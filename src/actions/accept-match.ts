"use server";

import "server-only";
import { db } from "@/db";
import { match, book } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq, or } from "drizzle-orm";

export async function acceptMatch(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const matchId = formData.get("matchId") as string;
  if (!matchId) {
    return { error: "Missing match id" };
  }

  try {
    // Load match and ensure user is participant
    const existing = await db
      .select()
      .from(match)
      .where(
        and(
          eq(match.id, matchId),
          or(
            eq(match.user1Id, session.user.id),
            eq(match.user2Id, session.user.id),
          ),
        ),
      )
      .limit(1);

    if (existing.length === 0) {
      return { error: "Match not found" };
    }

    const m = existing[0];

    // Only pending or active matches are accept-able; if cancelled/completed, ignore
    if (m.status === "cancelled" || m.status === "completed") {
      return { error: "Match cannot be accepted" };
    }

    // Determine the current user's own book by ownership to tolerate legacy
    // matches that might have used a different book ordering.
    const bothBooks = await db
      .select({
        id: book.id,
        userId: book.userId,
        isAvailable: book.isAvailable,
      })
      .from(book)
      .where(or(eq(book.id, m.book1Id), eq(book.id, m.book2Id)));

    const myBook = bothBooks.find((b) => b.userId === session.user.id);
    const theirBook = bothBooks.find((b) => b.userId !== session.user.id);
    if (!myBook || !theirBook) {
      return { error: "Books not found for match" };
    }
    const myBookId = myBook.id;
    const theirBookId = theirBook.id;

    // Reserve my book (set unavailable)
    await db
      .update(book)
      .set({ isAvailable: false })
      .where(eq(book.id, myBookId));

    // Check if the other side has also accepted (their book unavailable)
    const theirBooks = await db
      .select({ isAvailable: book.isAvailable })
      .from(book)
      .where(eq(book.id, theirBookId))
      .limit(1);

    const otherAccepted = theirBooks[0]?.isAvailable === false;

    if (otherAccepted) {
      // Both accepted -> activate match
      await db
        .update(match)
        .set({ status: "active" })
        .where(eq(match.id, m.id));
    } else {
      // Ensure status is at least pending
      if (m.status !== "pending") {
        await db
          .update(match)
          .set({ status: "pending" })
          .where(eq(match.id, m.id));
      }
    }

    revalidatePath("/", "layout");
    return { success: true, activated: otherAccepted };
  } catch (e) {
    console.error("Error accepting match:", e);
    return { error: "Failed to accept match" };
  }
}

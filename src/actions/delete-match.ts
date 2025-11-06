"use server";

import "server-only";
import { db } from "@/db";
import { match, book } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and, or } from "drizzle-orm";

export async function deleteMatch(formData: FormData) {
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
    // Ensure user is part of this match
    const existing = await db
      .select()
      .from(match)
      .where(
        and(
          eq(match.id, matchId),
          or(eq(match.user1Id, session.user.id), eq(match.user2Id, session.user.id)),
        ),
      )
      .limit(1);

    if (existing.length === 0) {
      return { error: "Match not found" };
    }

  // Soft-delete by setting status to cancelled and free up books (set available)
  await db.update(match).set({ status: "cancelled" }).where(eq(match.id, matchId));
  const m = existing[0];
  await db.update(book).set({ isAvailable: true }).where(eq(book.id, m.book1Id));
  await db.update(book).set({ isAvailable: true }).where(eq(book.id, m.book2Id));

    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("Error deleting match: ", e);
    return { error: "Failed to delete match" };
  }
}

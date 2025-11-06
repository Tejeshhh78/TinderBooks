"use server";

import "server-only";
import { db } from "@/db";
import { swipe, match, book } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { eq, and, or, isNull } from "drizzle-orm";

export async function swipeBook(bookId: string, action: "like" | "pass") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    // Record the swipe event
    await db.insert(swipe).values({
      id: randomUUID(),
      userId: session.user.id,
      bookId,
      action,
    });

    // On like: try to create a match based on mutual likes
    if (action === "like") {
      // Find the owner of the liked book
      const likedBook = await db
        .select()
        .from(book)
        .where(eq(book.id, bookId))
        .limit(1);
      if (likedBook.length === 0) {
        return { success: true, matched: false };
      }
      const bookOwnerId = likedBook[0].userId;

      // Has the owner liked any of my available books?
      const ownerLikedMyBook = await db
        .select({ likedMyBookId: swipe.bookId })
        .from(swipe)
        .leftJoin(book, eq(swipe.bookId, book.id))
        .where(
          and(
            eq(swipe.userId, bookOwnerId),
            eq(swipe.action, "like"),
            eq(book.userId, session.user.id),
            eq(book.isAvailable, true),
            or(isNull(book.isDeleted), eq(book.isDeleted, false)),
          ),
        )
        .limit(1);

      if (ownerLikedMyBook.length > 0) {
        const myBookId = ownerLikedMyBook[0].likedMyBookId;

        // Avoid duplicate active matches regardless of book order
        const existing = await db
          .select()
          .from(match)
          .where(
            and(
              // Avoid duplicates for any non-cancelled match between these books
              // If a previous match was cancelled, allow creating a new one
              // Note: status is free-text; we treat anything except 'cancelled' as existing
              // by checking not equal when paired with book pair OR check existence of any row then filter in code
              or(
                and(eq(match.book1Id, bookId), eq(match.book2Id, myBookId)),
                and(eq(match.book2Id, bookId), eq(match.book1Id, myBookId)),
              ),
            ),
          )
          .limit(1);

        if (existing.length === 0) {
          // Conventions: user1 pairs with book1 (my book), user2 pairs with book2 (their book I liked)
          await db.insert(match).values({
            id: randomUUID(),
            user1Id: session.user.id,
            user2Id: bookOwnerId,
            book1Id: myBookId,
            book2Id: bookId,
            status: "pending",
          });

          // Don't globally revalidate on creating a pending match to keep counters stable
          return { success: true, matched: true };
        }
      }
    }

    // Normal swipe: no full revalidation to keep the counter stable
    return { success: true, matched: false };
  } catch (error) {
    console.error("Error swiping book:", error);
    return { error: "Failed to swipe book" };
  }
}

"use server";

import "server-only";
import { db } from "@/db";
import { swipe, match, book, wantedBook } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { eq, and } from "drizzle-orm";

export async function swipeBook(bookId: string, action: "like" | "pass") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    // Record the swipe
    await db.insert(swipe).values({
      id: randomUUID(),
      userId: session.user.id,
      bookId,
      action,
    });

    // If it's a "like", check for potential matches
    if (action === "like") {
      const likedBook = await db
        .select()
        .from(book)
        .where(eq(book.id, bookId))
        .limit(1);

      if (likedBook.length === 0) return { success: true };

      const bookOwnerId = likedBook[0].userId;

      // Get my wanted books to check if I want this book
      const myWants = await db
        .select()
        .from(wantedBook)
        .where(eq(wantedBook.userId, session.user.id));

      // Check if I want this book (by title or genre)
      let iWantThisBook = false;
      for (const want of myWants) {
        // Check title match
        if (
          want.title &&
          want.title.toLowerCase() === likedBook[0].title.toLowerCase()
        ) {
          iWantThisBook = true;
          break;
        }

        // Check genre match
        if (want.genres) {
          const wantedGenres = JSON.parse(want.genres) as string[];
          if (wantedGenres.includes(likedBook[0].genre)) {
            iWantThisBook = true;
            break;
          }
        }
      }

      // If I want this book, check if I have a book the owner wants
      if (iWantThisBook) {
        const myBooks = await db
          .select()
          .from(book)
          .where(
            and(eq(book.userId, session.user.id), eq(book.isAvailable, true)),
          );

        const ownerWants = await db
          .select()
          .from(wantedBook)
          .where(eq(wantedBook.userId, bookOwnerId));

        // Check if any of my books match what the owner wants
        for (const myBook of myBooks) {
          for (const want of ownerWants) {
            let ownerWantsMyBook = false;

            // Check if specific title match
            if (
              want.title &&
              want.title.toLowerCase() === myBook.title.toLowerCase()
            ) {
              ownerWantsMyBook = true;
            }

            // Check if genre match
            if (want.genres && !ownerWantsMyBook) {
              const wantedGenres = JSON.parse(want.genres) as string[];
              if (wantedGenres.includes(myBook.genre)) {
                ownerWantsMyBook = true;
              }
            }

            // If mutual interest found, create match!
            if (ownerWantsMyBook) {
              // Check if match already exists
              const existingMatch = await db
                .select()
                .from(match)
                .where(
                  and(
                    eq(match.book1Id, bookId),
                    eq(match.book2Id, myBook.id),
                    eq(match.status, "active"),
                  ),
                )
                .limit(1);

              if (existingMatch.length === 0) {
                await db.insert(match).values({
                  id: randomUUID(),
                  user1Id: session.user.id, // User who liked
                  user2Id: bookOwnerId, // Book owner
                  book1Id: bookId, // Book that was liked (owned by user2)
                  book2Id: myBook.id, // My book (that owner wants)
                  status: "active",
                });

                revalidatePath("/", "layout");
                return { success: true, matched: true };
              }
            }
          }
        }
      }
    }

    revalidatePath("/", "layout");
    return { success: true, matched: false };
  } catch (error) {
    console.error("Error swiping book:", error);
    return { error: "Failed to swipe book" };
  }
}

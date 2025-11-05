"use server";

import "server-only";

import { db } from "@/db";
import { swipe, match, userBook } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

const swipeBookSchema = z.object({
  bookId: z.string(),
  direction: z.enum(["like", "pass"]),
  offeredBookId: z.string().optional(),
});

export async function swipeBook(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  const data = {
    bookId: formData.get("bookId") as string,
    direction: formData.get("direction") as string,
    offeredBookId: formData.get("offeredBookId") as string | undefined,
  };

  const validated = swipeBookSchema.safeParse(data);

  if (!validated.success) {
    return {
      error: validated.error.issues[0].message,
    };
  }

  try {
    // Record the swipe
    await db.insert(swipe).values({
      id: crypto.randomUUID(),
      userId: user.id,
      bookId: validated.data.bookId,
      direction: validated.data.direction,
    });

    // If it's a like, check for potential matches
    if (validated.data.direction === "like" && validated.data.offeredBookId) {
      // Get the book owner
      const bookOwnerResult = await db
        .select({ userId: userBook.userId })
        .from(userBook)
        .where(
          and(
            eq(userBook.bookId, validated.data.bookId),
            eq(userBook.type, "have")
          )
        )
        .limit(1);

      if (bookOwnerResult.length > 0 && bookOwnerResult[0].userId !== user.id) {
        const otherUserId = bookOwnerResult[0].userId;

        // Check if the other user has liked any of our books
        const mutualLikes = await db
          .select({
            swipeId: swipe.id,
            swipedBookId: swipe.bookId,
          })
          .from(swipe)
          .innerJoin(userBook, eq(swipe.bookId, userBook.bookId))
          .where(
            and(
              eq(swipe.userId, otherUserId),
              eq(swipe.direction, "like"),
              eq(userBook.userId, user.id),
              eq(userBook.type, "have")
            )
          );

        // Check if they liked the specific book we're offering
        const matchedBook = mutualLikes.find(
          (like) => like.swipedBookId === validated.data.offeredBookId
        );

        if (matchedBook) {
          // Create a match!
          const matchId = crypto.randomUUID();
          await db.insert(match).values({
            id: matchId,
            user1Id: user.id,
            user2Id: otherUserId,
            book1Id: validated.data.offeredBookId,
            book2Id: validated.data.bookId,
            status: "pending",
          });

          revalidatePath("/", "layout");

          return {
            success: true,
            match: true,
            matchId,
          };
        }
      }
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      match: false,
    };
  } catch (error) {
    console.error("Failed to swipe:", error);
    return {
      error: "Failed to record swipe",
    };
  }
}

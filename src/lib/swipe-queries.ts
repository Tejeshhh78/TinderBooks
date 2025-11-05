import "server-only";

import { db } from "@/db";
import { book, userBook, swipe, user } from "@/db/schema";
import { eq, and, notInArray, sql, ne } from "drizzle-orm";

export async function getBooksForSwipe(userId: string) {
  // Get books the user has already swiped on
  const swipedBookIds = await db
    .select({ bookId: swipe.bookId })
    .from(swipe)
    .where(eq(swipe.userId, userId));

  const swipedIds = swipedBookIds.map((s) => s.bookId);

  // Get books that:
  // 1. Are marked as "have" by other users
  // 2. Haven't been swiped by current user
  // 3. Don't belong to current user
  const whereConditions = [
    eq(userBook.type, "have"),
    ne(userBook.userId, userId),
  ];

  if (swipedIds.length > 0) {
    whereConditions.push(notInArray(book.id, swipedIds));
  }

  const query = db
    .select({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      coverUrl: book.coverUrl,
      description: book.description,
      ownerId: userBook.userId,
      ownerName: user.name,
    })
    .from(book)
    .innerJoin(userBook, eq(book.id, userBook.bookId))
    .innerJoin(user, eq(userBook.userId, user.id))
    .where(and(...whereConditions));

  return await query;
}

export async function getUserHaveBooks(userId: string) {
  const books = await db
    .select({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      coverUrl: book.coverUrl,
      description: book.description,
    })
    .from(book)
    .innerJoin(userBook, eq(book.id, userBook.bookId))
    .where(and(eq(userBook.userId, userId), eq(userBook.type, "have")));

  return books;
}

import "server-only";

import { db } from "@/db";
import { match, book, user, message } from "@/db/schema";
import { eq, or, and, desc, sql } from "drizzle-orm";

export async function getUserMatches(userId: string) {
  const matches = await db
    .select({
      id: match.id,
      status: match.status,
      createdAt: match.createdAt,
      user1Id: match.user1Id,
      user2Id: match.user2Id,
      book1Id: match.book1Id,
      book2Id: match.book2Id,
    })
    .from(match)
    .where(or(eq(match.user1Id, userId), eq(match.user2Id, userId)))
    .orderBy(desc(match.createdAt));

  // Enrich with user and book data
  const enrichedMatches = await Promise.all(
    matches.map(async (m) => {
      const otherUserId = m.user1Id === userId ? m.user2Id : m.user1Id;
      const myBookId = m.user1Id === userId ? m.book1Id : m.book2Id;
      const theirBookId = m.user1Id === userId ? m.book2Id : m.book1Id;

      const [otherUser] = await db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
        })
        .from(user)
        .where(eq(user.id, otherUserId))
        .limit(1);

      const [myBook] = await db
        .select({
          id: book.id,
          title: book.title,
          author: book.author,
        })
        .from(book)
        .where(eq(book.id, myBookId))
        .limit(1);

      const [theirBook] = await db
        .select({
          id: book.id,
          title: book.title,
          author: book.author,
        })
        .from(book)
        .where(eq(book.id, theirBookId))
        .limit(1);

      return {
        id: m.id,
        status: m.status,
        createdAt: m.createdAt,
        otherUserId: otherUser?.id,
        otherUserName: otherUser?.name,
        otherUserImage: otherUser?.image,
        myBookId: myBook?.id,
        myBookTitle: myBook?.title,
        myBookAuthor: myBook?.author,
        theirBookId: theirBook?.id,
        theirBookTitle: theirBook?.title,
        theirBookAuthor: theirBook?.author,
      };
    })
  );

  return enrichedMatches;
}

export async function getMatchMessages(matchId: string) {
  const messages = await db
    .select({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      read: message.read,
      senderId: message.senderId,
      senderName: user.name,
      senderImage: user.image,
    })
    .from(message)
    .innerJoin(user, eq(message.senderId, user.id))
    .where(eq(message.matchId, matchId))
    .orderBy(message.createdAt);

  return messages;
}

export async function getMatchDetails(matchId: string, userId: string) {
  const matchData = await db
    .select({
      id: match.id,
      status: match.status,
      user1Id: match.user1Id,
      user2Id: match.user2Id,
      book1Id: match.book1Id,
      book2Id: match.book2Id,
    })
    .from(match)
    .where(
      and(
        eq(match.id, matchId),
        or(eq(match.user1Id, userId), eq(match.user2Id, userId))
      )
    )
    .limit(1);

  if (matchData.length === 0) {
    return null;
  }

  const m = matchData[0];
  const otherUserId = m.user1Id === userId ? m.user2Id : m.user1Id;
  const myBookId = m.user1Id === userId ? m.book1Id : m.book2Id;
  const theirBookId = m.user1Id === userId ? m.book2Id : m.book1Id;

  const [otherUser] = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
    })
    .from(user)
    .where(eq(user.id, otherUserId))
    .limit(1);

  const [myBook] = await db
    .select({
      id: book.id,
      title: book.title,
      author: book.author,
    })
    .from(book)
    .where(eq(book.id, myBookId))
    .limit(1);

  const [theirBook] = await db
    .select({
      id: book.id,
      title: book.title,
      author: book.author,
    })
    .from(book)
    .where(eq(book.id, theirBookId))
    .limit(1);

  return {
    id: m.id,
    status: m.status,
    otherUser,
    myBook,
    theirBook,
  };
}

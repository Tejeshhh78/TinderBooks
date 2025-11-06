import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { book, swipe, user, wantedBook, userProfile } from "@/db/schema";
import { eq, and, ne, notInArray } from "drizzle-orm";
import { SwipeInterface } from "./_components/swipe-interface";
import { GenreFilter } from "@/app/discover/_components/genre-filter";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { genre } = await searchParams;

  // Get books user has already swiped
  const swipedBooks = await db
    .select({ bookId: swipe.bookId })
    .from(swipe)
    .where(eq(swipe.userId, session.user.id));

  const swipedBookIds = swipedBooks.map((s) => s.bookId);

  // Get books user wants (to prioritize relevant books)
  const myWants = await db
    .select()
    .from(wantedBook)
    .where(eq(wantedBook.userId, session.user.id));

  // Get my profile to see genre preferences
  const myProfile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, session.user.id))
    .limit(1);

  // Get available books (excluding own books and already swiped)
  let availableBooksQuery = db
    .select({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      imageUrl: book.imageUrl,
      description: book.description,
      ownerName: user.name,
      ownerId: user.id,
      ownerCity: userProfile.city,
    })
    .from(book)
    .leftJoin(user, eq(book.userId, user.id))
    .leftJoin(userProfile, eq(user.id, userProfile.userId))
    .where(
      and(
        eq(book.isAvailable, true),
        ne(book.userId, session.user.id),
        genre ? eq(book.genre, genre) : eq(book.genre, book.genre),
      ),
    )
    .limit(50);

  if (swipedBookIds.length > 0) {
    availableBooksQuery = db
      .select({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        condition: book.condition,
        imageUrl: book.imageUrl,
        description: book.description,
        ownerName: user.name,
        ownerId: user.id,
        ownerCity: userProfile.city,
      })
      .from(book)
      .leftJoin(user, eq(book.userId, user.id))
      .leftJoin(userProfile, eq(user.id, userProfile.userId))
      .where(
        and(
          eq(book.isAvailable, true),
          ne(book.userId, session.user.id),
          notInArray(book.id, swipedBookIds),
          genre ? eq(book.genre, genre) : eq(book.genre, book.genre),
        ),
      )
      .limit(50);
  }

  const availableBooks = await availableBooksQuery;

  // Prioritize books that match user's wants
  const prioritizedBooks = [...availableBooks].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Check against wanted books
    for (const want of myWants) {
      if (
        want.title &&
        a.title.toLowerCase().includes(want.title.toLowerCase())
      ) {
        scoreA += 10;
      }
      if (
        want.title &&
        b.title.toLowerCase().includes(want.title.toLowerCase())
      ) {
        scoreB += 10;
      }

      if (want.genres) {
        const wantedGenres = JSON.parse(want.genres) as string[];
        if (wantedGenres.includes(a.genre)) scoreA += 5;
        if (wantedGenres.includes(b.genre)) scoreB += 5;
      }
    }

    // Check against profile genre preferences
    if (myProfile[0]?.genres) {
      const preferredGenres = JSON.parse(myProfile[0].genres) as string[];
      if (preferredGenres.includes(a.genre)) scoreA += 2;
      if (preferredGenres.includes(b.genre)) scoreB += 2;
    }

    return scoreB - scoreA;
  });

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Discover Books</h1>
      <GenreFilter selectedGenre={genre} />
      <SwipeInterface books={prioritizedBooks} />
    </div>
  );
}

import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { book, wantedBook, match } from "@/db/schema";
import { eq, or, inArray } from "drizzle-orm";
import { BookList } from "./_components/book-list";
import { WantedBookList } from "./_components/wanted-book-list";
import { AddBookDialog } from "./_components/add-book-dialog";
import { AddWantedBookDialog } from "./_components/add-wanted-book-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function MyBooksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const [myBooks, myWantedBooks] = await Promise.all([
    db.select().from(book).where(eq(book.userId, session.user.id)),
    db.select().from(wantedBook).where(eq(wantedBook.userId, session.user.id)),
  ]);

  // Compute which of my books are currently involved in pending/active matches
  const myBookIds = myBooks.map((b) => b.id);
  let inMatchingBookIds: string[] = [];
  if (myBookIds.length > 0) {
    const relatedMatches = await db
      .select({ book1Id: match.book1Id, book2Id: match.book2Id, status: match.status })
      .from(match)
      .where(
        or(inArray(match.book1Id, myBookIds), inArray(match.book2Id, myBookIds))
      );

    const set = new Set<string>();
    for (const m of relatedMatches) {
      if (m.status === "pending" || m.status === "active") {
        if (myBookIds.includes(m.book1Id)) set.add(m.book1Id);
        if (myBookIds.includes(m.book2Id)) set.add(m.book2Id);
      }
    }
    inMatchingBookIds = Array.from(set);
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Books</h1>

      <Tabs defaultValue="have" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="have">Books I Have</TabsTrigger>
          <TabsTrigger value="want">Books I Want</TabsTrigger>
        </TabsList>

        <TabsContent value="have" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              {myBooks.length} {myBooks.length === 1 ? "book" : "books"}{" "}
              available for trade
            </p>
            <AddBookDialog />
          </div>
          <BookList books={myBooks} inMatchingBookIds={inMatchingBookIds} />
        </TabsContent>

        <TabsContent value="want" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              {myWantedBooks.length}{" "}
              {myWantedBooks.length === 1 ? "book" : "books"} on your wishlist
            </p>
            <AddWantedBookDialog />
          </div>
          <WantedBookList books={myWantedBooks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

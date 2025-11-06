import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { book, wantedBook } from "@/db/schema";
import { eq } from "drizzle-orm";
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
          <BookList books={myBooks} />
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

import { db } from "@/db";
import { book, userBook } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { BookCard } from "@/components/book-card";
import { AddBookDialog } from "@/components/add-book-dialog";
import { addBook } from "@/actions/add-book";
import { removeBook } from "@/actions/remove-book";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function BooksPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's books
  const userBooks = await db
    .select({
      book: book,
      type: userBook.type,
    })
    .from(userBook)
    .innerJoin(book, eq(userBook.bookId, book.id))
    .where(eq(userBook.userId, user.id));

  const haveBooks = userBooks.filter((ub) => ub.type === "have").map((ub) => ub.book);
  const wantBooks = userBooks.filter((ub) => ub.type === "want").map((ub) => ub.book);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Books</h1>
                <p className="text-muted-foreground">
                  Manage your book collection and wish list
                </p>
              </div>

              <Tabs defaultValue="have" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="have">
                    Books I Have ({haveBooks.length})
                  </TabsTrigger>
                  <TabsTrigger value="want">
                    Books I Want ({wantBooks.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="have" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Books You Own</CardTitle>
                      <CardDescription>
                        Books from your collection available for trading
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AddBookDialog type="have" addBookAction={addBook} />
                    </CardContent>
                  </Card>

                  {haveBooks.length === 0 ? (
                    <Card>
                      <CardContent className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground">
                          No books yet. Add some books you own!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {haveBooks.map((b) => (
                        <BookCard
                          key={b.id}
                          book={b}
                          type="have"
                          removeBookAction={removeBook}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="want" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Books You Want</CardTitle>
                      <CardDescription>
                        Books you're looking to add to your collection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AddBookDialog type="want" addBookAction={addBook} />
                    </CardContent>
                  </Card>

                  {wantBooks.length === 0 ? (
                    <Card>
                      <CardContent className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground">
                          No books on your wish list yet!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {wantBooks.map((b) => (
                        <BookCard
                          key={b.id}
                          book={b}
                          type="want"
                          removeBookAction={removeBook}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

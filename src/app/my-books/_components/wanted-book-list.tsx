"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteWantedBook } from "@/actions/delete-wanted-book";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface WantedBook {
  id: string;
  title: string | null;
  author: string | null;
  genres: string | null;
}

interface WantedBookListProps {
  books: WantedBook[];
}

export function WantedBookList({ books }: WantedBookListProps) {
  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to remove this from your wishlist?"))
      return;

    const result = await deleteWantedBook(bookId);
    if (result.success) {
      toast.success("Removed from wishlist");
    } else {
      toast.error(result.error || "Failed to remove");
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <p className="text-muted-foreground">
          No books on your wishlist. Add books you'd like to find!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => {
        const genres = book.genres ? JSON.parse(book.genres) : [];

        return (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle
                className={book.title ? "" : "text-muted-foreground italic"}
              >
                {book.title || "Any book"}
              </CardTitle>
              {book.author && <CardDescription>{book.author}</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">
                  Interested in:
                </span>
                <div className="flex flex-wrap gap-1">
                  {genres.map((genre: string) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(book.id)}
                className="w-full"
              >
                <Trash2 className="size-4 mr-2" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

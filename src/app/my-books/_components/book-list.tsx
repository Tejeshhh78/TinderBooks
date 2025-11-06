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
import { deleteBook } from "@/actions/delete-book";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  condition: string;
  imageUrl: string | null;
  description: string | null;
  isAvailable: boolean;
}

interface BookListProps {
  books: Book[];
  inMatchingBookIds?: string[];
}

export function BookList({ books, inMatchingBookIds = [] }: BookListProps) {
  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    const result = await deleteBook(bookId);
    if (result.success) {
      toast.success("Book deleted successfully");
    } else {
      toast.error(result.error || "Failed to delete book");
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <p className="text-muted-foreground">
          No books yet. Add your first book to start trading!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <Card key={book.id}>
          {book.imageUrl && (
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
              <Image
                src={book.imageUrl}
                alt={book.title}
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="truncate">{book.title}</CardTitle>
                <CardDescription className="truncate">
                  {book.author}
                </CardDescription>
              </div>
              {inMatchingBookIds.includes(book.id) ? (
                <Badge variant="secondary">In Matching</Badge>
              ) : (
                <Badge variant={book.isAvailable ? "default" : "secondary"}>
                  {book.isAvailable ? "Available" : "Traded"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Genre:</span>
                <span className="text-sm font-medium">{book.genre}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Condition:
                </span>
                <span className="text-sm font-medium capitalize">
                  {book.condition}
                </span>
              </div>
              {book.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {book.description}
                </p>
              )}
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
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

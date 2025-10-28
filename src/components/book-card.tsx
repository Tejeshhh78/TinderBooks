"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  condition: "new" | "like-new" | "good" | "fair";
  coverUrl?: string | null;
  description?: string | null;
}

interface BookCardProps {
  book: Book;
  type: "have" | "want";
  showRemove?: boolean;
  removeBookAction: (formData: FormData) => Promise<any>;
}

export function BookCard({
  book,
  type,
  showRemove = true,
  removeBookAction,
}: BookCardProps) {
  const [isPending, setIsPending] = useState(false);

  const handleRemove = async (formData: FormData) => {
    setIsPending(true);
    await removeBookAction(formData);
    setIsPending(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight text-balance">
            {book.title}
          </CardTitle>
          {showRemove && (
            <form action={handleRemove}>
              <input type="hidden" name="bookId" value={book.id} />
              <input type="hidden" name="type" value={type} />
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                disabled={isPending}
                type="submit"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </form>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">by {book.author}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{book.genre}</Badge>
          {book.condition && (
            <Badge variant="outline" className="capitalize">
              {book.condition.replace("-", " ")}
            </Badge>
          )}
        </div>
        {book.description && (
          <p className="text-sm text-muted-foreground mt-2">{book.description}</p>
        )}
      </CardContent>
    </Card>
  );
}

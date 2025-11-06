"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, MapPin, BookOpen } from "lucide-react";
import { swipeBook } from "@/actions/swipe-book";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  condition: string;
  imageUrl: string | null;
  description: string | null;
  ownerName: string | null;
  ownerId: string | null;
  ownerCity: string | null;
}

interface SwipeInterfaceProps {
  books: Book[];
}

export function SwipeInterface({ books }: SwipeInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );

  const currentBook = books[currentIndex];

  const handleSwipe = async (action: "like" | "pass") => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(action === "like" ? "right" : "left");

    // Wait for animation
    setTimeout(async () => {
      const result = await swipeBook(currentBook.id, action);

      if (result.error) {
        toast.error(result.error);
      } else if (result.matched) {
        toast.success("🎉 It's a match! You can now chat with the owner.");
      }

      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  if (!currentBook || currentIndex >= books.length) {
    return (
      <div className="text-center py-20">
        <BookOpen className="size-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          No more books to discover
        </h2>
        <p className="text-muted-foreground">
          Check back later for new listings or add more books to your wishlist!
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-4 text-center text-sm text-muted-foreground">
        {currentIndex + 1} of {books.length} books
      </div>

      <div className="relative flex justify-center items-center min-h-[600px]">
        <Card
          className={`w-full max-w-md transition-all duration-300 ${
            swipeDirection === "left"
              ? "-translate-x-[200%] rotate-[-20deg] opacity-0"
              : swipeDirection === "right"
                ? "translate-x-[200%] rotate-[20deg] opacity-0"
                : ""
          }`}
        >
          {currentBook.imageUrl && (
            <div className="aspect-[3/4] w-full overflow-hidden rounded-t-lg">
              <img
                src={currentBook.imageUrl}
                alt={currentBook.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">{currentBook.title}</CardTitle>
            <CardDescription className="text-lg">
              {currentBook.author}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{currentBook.genre}</Badge>
              <Badge variant="outline" className="capitalize">
                {currentBook.condition.replace("-", " ")}
              </Badge>
            </div>

            {currentBook.description && (
              <p className="text-sm text-muted-foreground">
                {currentBook.description}
              </p>
            )}

            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Owner:</span>
                <span>{currentBook.ownerName}</span>
              </div>
              {currentBook.ownerCity && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  <span>{currentBook.ownerCity}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <Button
          size="lg"
          variant="outline"
          className="size-16 rounded-full border-2"
          onClick={() => handleSwipe("pass")}
          disabled={isAnimating}
        >
          <X className="size-6" />
        </Button>
        <Button
          size="lg"
          className="size-16 rounded-full"
          onClick={() => handleSwipe("like")}
          disabled={isAnimating}
        >
          <Heart className="size-6" />
        </Button>
      </div>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        <p>Press ← or → on your keyboard to swipe</p>
      </div>
    </div>
  );
}

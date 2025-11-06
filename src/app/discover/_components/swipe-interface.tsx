"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
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

  // Keep the initial total stable during the session to avoid shrinking totals after a swipe
  const initialTotalRef = useRef<number>(books.length);

  // Pointer drag state for mouse/touch swiping
  const dragStartX = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const currentBook = books[currentIndex];

  const handleSwipe = useCallback(
    async (action: "like" | "pass") => {
      if (isAnimating || !currentBook) return;

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
    },
    [currentBook, isAnimating],
  );

  // Mouse/touch swipe handlers
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isAnimating) return;
      dragStartX.current = e.clientX;
      setDragging(true);
      (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    [isAnimating],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || dragStartX.current === null) return;
      const deltaX = e.clientX - dragStartX.current;
      setDragX(deltaX);
    },
    [dragging],
  );

  const onPointerUp = useCallback(
    (_e: React.PointerEvent) => {
      if (!dragging) return;
      const threshold = 100;
      const dx = dragX;
      setDragging(false);
      setDragX(0);
      dragStartX.current = null;

      if (dx > threshold) {
        void handleSwipe("like");
      } else if (dx < -threshold) {
        void handleSwipe("pass");
      }
    },
    [dragging, dragX, handleSwipe],
  );

  // Keyboard navigation: Left Arrow = pass, Right Arrow = like
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when typing in inputs/textareas/contenteditable
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable =
        (target as HTMLElement | null)?.isContentEditable ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select";
      if (isEditable) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        void handleSwipe("pass");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        void handleSwipe("like");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSwipe]);

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
        {Math.min(currentIndex + 1, initialTotalRef.current)} of{" "}
        {initialTotalRef.current} books
      </div>

      <div className="relative flex justify-center items-center min-h-[600px]">
        <Card
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={`w-full max-w-md transition-all duration-300 select-none ${
            swipeDirection === "left"
              ? "-translate-x-[200%] rotate-[-20deg] opacity-0"
              : swipeDirection === "right"
                ? "translate-x-[200%] rotate-[20deg] opacity-0"
                : ""
          }`}
          style={
            dragging && swipeDirection === null
              ? {
                  transform: `translateX(${dragX}px) rotate(${dragX / 20}deg)`,
                }
              : undefined
          }
        >
          {currentBook.imageUrl && (
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
              <Image
                src={currentBook.imageUrl}
                alt={currentBook.title}
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover"
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
        <p>Press ← or → on your keyboard or drag the card with the mouse</p>
      </div>
    </div>
  );
}

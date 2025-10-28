"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Heart } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  condition: "new" | "like-new" | "good" | "fair";
  coverUrl?: string | null;
  description?: string | null;
}

interface SwipeCardProps {
  book: Book;
  onSwipe: (direction: "left" | "right") => void;
  style?: React.CSSProperties;
}

export function SwipeCard({ book, onSwipe, style }: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    const threshold = 100;
    if (Math.abs(position.x) > threshold) {
      onSwipe(position.x > 0 ? "right" : "left");
    }

    setPosition({ x: 0, y: 0 });
  };

  const rotation = position.x / 20;
  const opacity = 1 - Math.abs(position.x) / 300;

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? "none" : "all 0.3s ease-out",
        ...style,
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <Card className="h-full shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl leading-tight text-balance">
            {book.title}
          </CardTitle>
          <p className="text-base text-muted-foreground">by {book.author}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              {book.genre}
            </Badge>
            {book.condition && (
              <Badge variant="outline" className="text-sm capitalize">
                {book.condition.replace("-", " ")}
              </Badge>
            )}
          </div>

          {book.description && (
            <div>
              <h4 className="font-semibold text-sm mb-1">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {position.x > 50 && (
        <div className="absolute top-8 right-8 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg rotate-12">
          <Heart className="size-6" />
        </div>
      )}

      {position.x < -50 && (
        <div className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg -rotate-12">
          <X className="size-6" />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Poetry",
  "Horror",
  "Young Adult",
  "Children's",
];

export function GenreFilter({ selectedGenre }: { selectedGenre?: string }) {
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [value, setValue] = useState<string>(selectedGenre ?? "");

  useEffect(() => {
    setValue(selectedGenre ?? "");
  }, [selectedGenre]);

  return (
  <form ref={formRef} method="GET" action={pathname} className="mb-6 flex items-center gap-3 justify-center">
      <input type="hidden" name="genre" value={value} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by genre" />
        </SelectTrigger>
        <SelectContent>
          {GENRES.map((g) => (
            <SelectItem key={g} value={g}>
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          setValue("");
          // submit after state updates the hidden input
          setTimeout(() => formRef.current?.submit(), 0);
        }}
      >
        Clear
      </Button>
      <Button type="submit">Apply</Button>
    </form>
  );
}

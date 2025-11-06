"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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

export function GenreFilter({ selectedGenres = [] }: { selectedGenres?: string[] }) {
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [values, setValues] = useState<string[]>(selectedGenres);

  useEffect(() => {
    setValues(selectedGenres);
  }, [selectedGenres]);

  const toggle = (g: string) => {
    setValues((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };

  return (
  <form ref={formRef} method="GET" action={pathname} className="mb-6 flex flex-col items-center gap-3">
      <input type="hidden" name="genres" value={values.join(",")} />
      <div className="flex flex-wrap gap-2 justify-center">
        {GENRES.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => toggle(g)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              values.includes(g)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          setValues([]);
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

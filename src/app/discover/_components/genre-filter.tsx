"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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
  const [open, setOpen] = useState(false);
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
  <form
      ref={formRef}
      method="GET"
      action={pathname}
      className="mb-6 flex items-center justify-center"
    >
      <input type="hidden" name="genres" value={values.join(",")} />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            Genres{values.length ? ` (${values.length})` : ""}
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>Select genres</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-64 overflow-auto">
            {GENRES.map((g) => (
              <DropdownMenuCheckboxItem
                key={g}
                checked={values.includes(g)}
                onCheckedChange={() => toggle(g)}
              >
                {g}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <div className="flex items-center justify-between gap-2 p-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setValues([]);
                setTimeout(() => formRef.current?.submit(), 0);
                setOpen(false);
              }}
            >
              Clear
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                formRef.current?.submit();
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
}

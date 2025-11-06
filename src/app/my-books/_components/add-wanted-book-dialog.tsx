"use client";

import { useState, useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { addWantedBook } from "@/actions/add-wanted-book";
import { toast } from "sonner";

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

export function AddWantedBookDialog() {
  const [open, setOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [_state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      if (selectedGenres.length === 0) {
        toast.error("Please select at least one genre");
        return null;
      }

      formData.set("genres", JSON.stringify(selectedGenres));

      const result = await addWantedBook(formData);

      if (result.success) {
        toast.success("Added to wishlist!");
        setOpen(false);
        setSelectedGenres([]);
      } else {
        toast.error(result.error || "Failed to add to wishlist");
      }

      return result;
    },
    null,
  );

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Add to Wishlist
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add to Wishlist</DialogTitle>
          <DialogDescription>
            Specify books you're looking for. You can search by title, author,
            or just genres.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., The Great Gatsby"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank to search by genre only
            </p>
          </div>

          <div>
            <Label htmlFor="author">Author (optional)</Label>
            <Input
              id="author"
              name="author"
              placeholder="e.g., F. Scott Fitzgerald"
            />
          </div>

          <div>
            <Label>Genres of Interest *</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select genres you're interested in
            </p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedGenres.includes(genre)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedGenres.length} selected
            </p>
          </div>

          <Button
            type="submit"
            disabled={isPending || selectedGenres.length === 0}
            className="w-full"
          >
            {isPending ? "Adding..." : "Add to Wishlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

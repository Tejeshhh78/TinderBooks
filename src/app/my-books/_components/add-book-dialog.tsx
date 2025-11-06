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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { addBook } from "@/actions/add-book";
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

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

export function AddBookDialog() {
  const [open, setOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  const [_state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      if (!selectedGenre || !selectedCondition) {
        toast.error("Please select genre and condition");
        return null;
      }

      formData.set("genre", selectedGenre);
      formData.set("condition", selectedCondition);

      const result = await addBook(formData);

      if (result.success) {
        toast.success("Book added successfully!");
        setOpen(false);
        setSelectedGenre("");
        setSelectedCondition("");
      } else {
        toast.error(result.error || "Failed to add book");
      }

      return result;
    },
    null,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Book</DialogTitle>
          <DialogDescription>
            Add a book you're willing to trade with others.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" required />
          </div>

          <div>
            <Label htmlFor="author">Author *</Label>
            <Input id="author" name="author" required />
          </div>

          <div>
            <Label htmlFor="genre">Genre *</Label>
            <Select
              value={selectedGenre}
              onValueChange={setSelectedGenre}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="condition">Condition *</Label>
            <Select
              value={selectedCondition}
              onValueChange={setSelectedCondition}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-3 py-2 bg-background border rounded-md"
              placeholder="Any additional details about the book..."
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

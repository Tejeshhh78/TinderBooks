"use client";

import { useActionState, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { updateBook } from "@/actions/update-book";
import { Pencil } from "lucide-react";

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

interface EditBookDialogProps {
  book: {
    id: string;
    title: string;
    author: string;
    genre: string;
    condition: string;
    description: string | null;
  };
}

export function EditBookDialog({ book }: EditBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [genre, setGenre] = useState(book.genre);
  const [condition, setCondition] = useState(book.condition);
  const [imageFileName, setImageFileName] = useState("");

  const [_state, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set("bookId", book.id);
      formData.set("genre", genre);
      formData.set("condition", condition);
      const res = await updateBook(formData);
      if (res?.success) {
        toast.success("Book updated");
        setOpen(false);
      } else {
        toast.error(res?.error || "Failed to update book");
      }
      return res;
    },
    null,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="size-4 mr-2" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>Update details for your book.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" defaultValue={book.title} required />
          </div>
          <div>
            <Label htmlFor="author">Author *</Label>
            <Input id="author" name="author" defaultValue={book.author} required />
          </div>
          <div>
            <Label htmlFor="genre">Genre *</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="condition">Condition *</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="imageFile">Replace image (optional)</Label>
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setImageFileName(e.target.files?.[0]?.name ?? "")}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {imageFileName ? `Selected: ${imageFileName}` : "Upload to replace the cover image."}
            </p>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-3 py-2 bg-background border rounded-md"
              defaultValue={book.description ?? ""}
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

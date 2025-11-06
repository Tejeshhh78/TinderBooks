"use client";

import { useState, useActionState } from "react";
import { updateProfile } from "@/actions/update-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface ProfileFormProps {
  existingProfile: {
    bio: string | null;
    city: string | null;
    genres: string | null;
  } | null;
}

export function ProfileForm({ existingProfile }: ProfileFormProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    existingProfile?.genres ? JSON.parse(existingProfile.genres) : [],
  );

  const [_state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      formData.set("genres", JSON.stringify(selectedGenres));
      const result = await updateProfile(formData);

      if (result.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.error || "Failed to update profile");
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
    <form
      action={formAction}
      className="space-y-6 bg-card rounded-lg border p-6"
    >
      <div>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={existingProfile?.bio || ""}
          placeholder="Tell other book lovers about yourself..."
          className="w-full mt-1 px-3 py-2 bg-background border rounded-md"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Maximum 500 characters
        </p>
      </div>

      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          name="city"
          type="text"
          defaultValue={existingProfile?.city || ""}
          placeholder="e.g., San Francisco, CA"
          maxLength={100}
        />
      </div>

      <div>
        <Label>Favorite Genres</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Select genres you enjoy reading
        </p>
        <div className="flex flex-wrap gap-2">
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
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}

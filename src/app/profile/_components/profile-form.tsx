"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/update-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRef, useState } from "react";

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
  hasImage?: boolean;
}

export function ProfileForm({
  existingProfile,
  hasImage = false,
}: ProfileFormProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    existingProfile?.genres ? JSON.parse(existingProfile.genres) : [],
  );
  const [imageFileName, setImageFileName] = useState<string>("");
  const [removeImage, setRemoveImage] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [_state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      formData.set("genres", JSON.stringify(selectedGenres));
      if (removeImage) {
        formData.set("imageUrl", "");
      }
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
        <Label htmlFor="imageFile">Profile image</Label>
        <Input
          id="imageFile"
          name="imageFile"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          ref={fileRef}
          onChange={(e) => setImageFileName(e.target.files?.[0]?.name ?? "")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {imageFileName
            ? `Selected: ${imageFileName}`
            : "Optional. Upload a profile photo (PNG, JPG, WEBP)."}
        </p>
        {hasImage && (
          <div className="mt-2 flex items-center gap-2">
            <input
              id="removeImage"
              type="checkbox"
              checked={removeImage}
              onChange={(e) => {
                setRemoveImage(e.target.checked);
                if (e.target.checked && fileRef.current) {
                  fileRef.current.value = "";
                  setImageFileName("");
                }
              }}
            />
            <Label htmlFor="removeImage">Remove current image</Label>
          </div>
        )}
      </div>
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

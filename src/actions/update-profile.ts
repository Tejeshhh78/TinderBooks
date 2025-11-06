"use server";

import "server-only";
import { db } from "@/db";
import { userProfile, user } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveUploadedFile } from "@/lib/upload";
import { eq } from "drizzle-orm";

const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  genres: z.string(), // JSON stringified array
  // Deprecated: kept for backward-compat, but file upload is preferred
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const rawBio = formData.get("bio");
  const rawCity = formData.get("city");
  const rawGenres = formData.get("genres");
  const rawImageUrl = formData.get("imageUrl");

  const data = {
    bio: typeof rawBio === "string" && rawBio.trim() !== "" ? rawBio : undefined,
    city: typeof rawCity === "string" && rawCity.trim() !== "" ? rawCity : undefined,
    // Genres is required: ensure it's a stringified array
    genres: typeof rawGenres === "string" ? rawGenres : "[]",
    // Optional: when not provided, keep undefined; empty string means clear image
    imageUrl:
      typeof rawImageUrl === "string"
        ? rawImageUrl
        : undefined,
  };

  const parsed = updateProfileSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid data" };
  }

  try {
    // Check if profile exists
    const existingProfile = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, session.user.id))
      .limit(1);

    if (existingProfile.length === 0) {
      // Create new profile
      await db.insert(userProfile).values({
        userId: session.user.id,
        bio: parsed.data.bio,
        city: parsed.data.city,
        genres: parsed.data.genres,
      });
    } else {
      // Update existing profile
      await db
        .update(userProfile)
        .set({
          bio: parsed.data.bio,
          city: parsed.data.city,
          genres: parsed.data.genres,
        })
        .where(eq(userProfile.userId, session.user.id));
    }

    // Handle image upload via file input first, fallback to imageUrl if set
    const imageFile = formData.get("imageFile");
    if (imageFile instanceof File && imageFile.size > 0) {
      const publicPath = await saveUploadedFile(imageFile, "profile");
      await db.update(user).set({ image: publicPath }).where(eq(user.id, session.user.id));
    } else if (parsed.data.imageUrl !== undefined) {
      await db.update(user).set({ image: parsed.data.imageUrl || null }).where(eq(user.id, session.user.id));
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

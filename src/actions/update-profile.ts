"use server";

import "server-only";

import { db } from "@/db";
import { userProfile } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";

const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  favoriteGenres: z.string().optional(), // JSON string array
});

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  const data = {
    bio: formData.get("bio") as string,
    location: formData.get("location") as string,
    favoriteGenres: formData.get("favoriteGenres") as string,
  };

  const validated = updateProfileSchema.safeParse(data);

  if (!validated.success) {
    return {
      error: validated.error.issues[0].message,
    };
  }

  try {
    // Check if profile exists
    const existingProfile = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, user.id))
      .limit(1);

    if (existingProfile.length === 0) {
      // Create new profile
      await db.insert(userProfile).values({
        id: crypto.randomUUID(),
        userId: user.id,
        bio: validated.data.bio || null,
        location: validated.data.location || null,
        favoriteGenres: validated.data.favoriteGenres || null,
      });
    } else {
      // Update existing profile
      await db
        .update(userProfile)
        .set({
          bio: validated.data.bio || null,
          location: validated.data.location || null,
          favoriteGenres: validated.data.favoriteGenres || null,
        })
        .where(eq(userProfile.userId, user.id));
    }

    revalidatePath("/", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return {
      error: "Failed to update profile",
    };
  }
}

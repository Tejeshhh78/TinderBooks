"use server";

import "server-only";
import { db } from "@/db";
import { userProfile } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";

const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  genres: z.string(), // JSON stringified array
});

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const data = {
    bio: formData.get("bio") as string,
    city: formData.get("city") as string,
    genres: formData.get("genres") as string,
  };

  const parsed = updateProfileSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Invalid data" };
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

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

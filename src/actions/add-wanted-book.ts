"use server";

import "server-only";
import { db } from "@/db";
import { wantedBook } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomUUID } from "node:crypto";

const addWantedBookSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  genres: z.string().min(1, "At least one genre is required"),
});

export async function addWantedBook(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const data = {
    title: formData.get("title") as string,
    author: formData.get("author") as string,
    genres: formData.get("genres") as string,
  };

  const parsed = addWantedBookSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await db.insert(wantedBook).values({
      id: randomUUID(),
      userId: session.user.id,
      title: parsed.data.title || null,
      author: parsed.data.author || null,
      genres: parsed.data.genres,
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error adding wanted book:", error);
    return { error: "Failed to add wanted book" };
  }
}

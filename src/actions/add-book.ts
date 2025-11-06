"use server";

import "server-only";
import { db } from "@/db";
import { book } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomUUID } from "node:crypto";

const addBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  condition: z.enum(["new", "like-new", "good", "fair", "poor"]),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export async function addBook(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const data = {
    title: formData.get("title") as string,
    author: formData.get("author") as string,
    genre: formData.get("genre") as string,
    condition: formData.get("condition") as string,
    description: formData.get("description") as string,
    imageUrl: formData.get("imageUrl") as string,
  };

  const parsed = addBookSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await db.insert(book).values({
      id: randomUUID(),
      userId: session.user.id,
      ...parsed.data,
      imageUrl: parsed.data.imageUrl || null,
      description: parsed.data.description || null,
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error adding book:", error);
    return { error: "Failed to add book" };
  }
}

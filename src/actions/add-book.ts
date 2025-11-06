"use server";

import "server-only";
import { db } from "@/db";
import { book } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { saveUploadedFile } from "@/lib/upload";

const addBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  condition: z.enum(["new", "like-new", "good", "fair", "poor"]),
  description: z.string().optional(),
  // Deprecated: URL support retained, but file upload is preferred
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export async function addBook(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const rawTitle = formData.get("title");
  const rawAuthor = formData.get("author");
  const rawGenre = formData.get("genre");
  const rawCondition = formData.get("condition");
  const rawDescription = formData.get("description");
  const rawImageUrl = formData.get("imageUrl");

  const data = {
    title: typeof rawTitle === "string" ? rawTitle : "",
    author: typeof rawAuthor === "string" ? rawAuthor : "",
    genre: typeof rawGenre === "string" ? rawGenre : "",
    condition: typeof rawCondition === "string" ? rawCondition : "",
    description:
      typeof rawDescription === "string" && rawDescription.trim() !== ""
        ? rawDescription
        : undefined,
    imageUrl:
      typeof rawImageUrl === "string" && rawImageUrl.trim() !== ""
        ? rawImageUrl
        : undefined,
  };

  const parsed = addBookSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    let finalImageUrl: string | null = null;
    const imageFile = formData.get("imageFile");
    if (imageFile instanceof File && imageFile.size > 0) {
      finalImageUrl = await saveUploadedFile(imageFile, "books");
    } else {
      finalImageUrl = parsed.data.imageUrl || null;
    }

    await db.insert(book).values({
      id: randomUUID(),
      userId: session.user.id,
      ...parsed.data,
      imageUrl: finalImageUrl,
      description: parsed.data.description || null,
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error adding book:", error);
    return { error: "Failed to add book" };
  }
}

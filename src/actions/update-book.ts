"use server";

import "server-only";
import { db } from "@/db";
import { book } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { saveUploadedFile } from "@/lib/upload";

const updateBookSchema = z.object({
  bookId: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().min(1),
  condition: z.enum(["new", "like-new", "good", "fair", "poor"]),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export async function updateBook(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const parsed = updateBookSchema.safeParse({
    bookId: formData.get("bookId"),
    title: formData.get("title"),
    author: formData.get("author"),
    genre: formData.get("genre"),
    condition: formData.get("condition"),
    description: formData.get("description") ?? undefined,
    imageUrl: formData.get("imageUrl") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const imageFile = formData.get("imageFile");
  let finalImageUrl: string | null | undefined = undefined; // undefined = keep, null = clear, string = new
  if (imageFile instanceof File && imageFile.size > 0) {
    finalImageUrl = await saveUploadedFile(imageFile, "books");
  } else if (parsed.data.imageUrl !== undefined) {
    finalImageUrl = parsed.data.imageUrl || null;
  }

  try {
    const updateData: Record<string, unknown> = {
      title: parsed.data.title,
      author: parsed.data.author,
      genre: parsed.data.genre,
      condition: parsed.data.condition,
      description: parsed.data.description ?? null,
    };
    if (finalImageUrl !== undefined) {
      updateData.imageUrl = finalImageUrl;
    }

    await db
      .update(book)
      .set(updateData)
      .where(and(eq(book.id, parsed.data.bookId), eq(book.userId, session.user.id)));

    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("Error updating book:", e);
    return { error: "Failed to update book" };
  }
}

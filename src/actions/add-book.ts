"use server";

import "server-only";

import { db } from "@/db";
import { book, userBook } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  condition: z.enum(["new", "like-new", "good", "fair"], {
    message: "Please select a valid condition",
  }),
  coverUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  type: z.enum(["have", "want"], {
    message: "Please select have or want",
  }),
});

export async function addBook(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  const data = {
    title: formData.get("title") as string,
    author: formData.get("author") as string,
    genre: formData.get("genre") as string,
    condition: formData.get("condition") as string,
    coverUrl: formData.get("coverUrl") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as string,
  };

  const validated = addBookSchema.safeParse(data);

  if (!validated.success) {
    return {
      error: validated.error.issues[0].message,
    };
  }

  try {
    const bookId = crypto.randomUUID();

    // Insert book
    await db.insert(book).values({
      id: bookId,
      title: validated.data.title,
      author: validated.data.author,
      genre: validated.data.genre,
      condition: validated.data.condition,
      coverUrl: validated.data.coverUrl || null,
      description: validated.data.description || null,
    });

    // Link book to user
    await db.insert(userBook).values({
      id: crypto.randomUUID(),
      userId: user.id,
      bookId: bookId,
      type: validated.data.type,
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      bookId,
    };
  } catch (error) {
    console.error("Failed to add book:", error);
    return {
      error: "Failed to add book",
    };
  }
}

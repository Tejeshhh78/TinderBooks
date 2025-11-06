"use server";

import "server-only";
import { db } from "@/db";
import { book } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function deleteBook(bookId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    // Soft-delete: hide from listings but keep for historical matches
    await db
      .update(book)
      .set({ isDeleted: true, isAvailable: false })
      .where(and(eq(book.id, bookId), eq(book.userId, session.user.id)));

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { error: "Failed to delete book" };
  }
}

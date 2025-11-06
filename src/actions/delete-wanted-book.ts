"use server";

import "server-only";
import { db } from "@/db";
import { wantedBook } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function deleteWantedBook(bookId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .delete(wantedBook)
      .where(
        and(eq(wantedBook.id, bookId), eq(wantedBook.userId, session.user.id)),
      );

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error deleting wanted book:", error);
    return { error: "Failed to delete wanted book" };
  }
}

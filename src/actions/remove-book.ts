import "server-only";

import { db } from "@/db";
import { userBook } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

const removeBookSchema = z.object({
  bookId: z.string(),
  type: z.enum(["have", "want"]),
});

export async function removeBook(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  const data = {
    bookId: formData.get("bookId") as string,
    type: formData.get("type") as string,
  };

  const validated = removeBookSchema.safeParse(data);

  if (!validated.success) {
    return {
      error: validated.error.issues[0].message,
    };
  }

  try {
    await db
      .delete(userBook)
      .where(
        and(
          eq(userBook.userId, user.id),
          eq(userBook.bookId, validated.data.bookId),
          eq(userBook.type, validated.data.type)
        )
      );

    revalidatePath("/", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to remove book:", error);
    return {
      error: "Failed to remove book",
    };
  }
}

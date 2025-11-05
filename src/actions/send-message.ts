"use server";

import "server-only";

import { db } from "@/db";
import { message } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const sendMessageSchema = z.object({
  matchId: z.string(),
  content: z.string().min(1, "Message cannot be empty").max(1000),
});

export async function sendMessage(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  const data = {
    matchId: formData.get("matchId") as string,
    content: formData.get("content") as string,
  };

  const validated = sendMessageSchema.safeParse(data);

  if (!validated.success) {
    return {
      error: validated.error.issues[0].message,
    };
  }

  try {
    await db.insert(message).values({
      id: crypto.randomUUID(),
      matchId: validated.data.matchId,
      senderId: user.id,
      content: validated.data.content,
      read: false,
    });

    revalidatePath("/", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to send message:", error);
    return {
      error: "Failed to send message",
    };
  }
}

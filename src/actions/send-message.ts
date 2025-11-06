"use server";

import "server-only";
import { db } from "@/db";
import { message, match } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { eq, or, and } from "drizzle-orm";

const sendMessageSchema = z.object({
  matchId: z.string(),
  content: z.string().min(1).max(1000),
});

export async function sendMessage(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const data = {
    matchId: formData.get("matchId") as string,
    content: formData.get("content") as string,
  };

  const parsed = sendMessageSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Invalid message" };
  }

  try {
    // Verify user is part of this match
    const matchData = await db
      .select()
      .from(match)
      .where(
        and(
          eq(match.id, parsed.data.matchId),
          or(
            eq(match.user1Id, session.user.id),
            eq(match.user2Id, session.user.id),
          ),
        ),
      )
      .limit(1);

    if (matchData.length === 0) {
      return { error: "Match not found" };
    }

    await db.insert(message).values({
      id: randomUUID(),
      matchId: parsed.data.matchId,
      senderId: session.user.id,
      content: parsed.data.content,
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}

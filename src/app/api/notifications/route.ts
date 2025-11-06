import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { match, message } from "@/db/schema";
import { and, eq, or, ne, inArray, gt } from "drizzle-orm";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ hasMatch: false, hasMessage: false });
  }

  // Any pending matches for the user?
  const pending = await db
    .select({ id: match.id })
    .from(match)
    .where(
      and(or(eq(match.user1Id, session.user.id), eq(match.user2Id, session.user.id)), eq(match.status, "pending")),
    )
    .limit(1);

  // Any recent incoming messages for the user? (last 24 hours)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const myMatches = await db
    .select({ id: match.id })
    .from(match)
    .where(and(or(eq(match.user1Id, session.user.id), eq(match.user2Id, session.user.id)), ne(match.status, "cancelled")));
  const matchIds = myMatches.map((m) => m.id);
  let hasMessage = false;
  if (matchIds.length > 0) {
    const incoming = await db
      .select({ id: message.id })
      .from(message)
      .where(and(inArray(message.matchId, matchIds), ne(message.senderId, session.user.id), gt(message.createdAt, since)))
      .limit(1);
    hasMessage = incoming.length > 0;
  }

  return NextResponse.json({ hasMatch: pending.length > 0, hasMessage });
}

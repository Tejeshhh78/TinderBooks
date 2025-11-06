import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { match, message } from "@/db/schema";
import { and, eq, or, ne, inArray, desc, isNull } from "drizzle-orm";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ hasMatch: false, hasMessage: false });
  }

  // Any pending matches for the user?
  const pending = await db
    .select({ id: match.id, createdAt: match.createdAt })
    .from(match)
    .where(
      and(
        or(
          eq(match.user1Id, session.user.id),
          eq(match.user2Id, session.user.id),
        ),
        eq(match.status, "pending"),
        or(
          isNull(match.deletedForUserId),
          ne(match.deletedForUserId, session.user.id),
        ),
      ),
    )
    .orderBy(desc(match.createdAt))
    .limit(1);

  // Any recent incoming messages for the user? (last 24 hours)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const myMatches = await db
    .select({ id: match.id })
    .from(match)
    .where(
      and(
        or(
          eq(match.user1Id, session.user.id),
          eq(match.user2Id, session.user.id),
        ),
        ne(match.status, "cancelled"),
        or(
          isNull(match.deletedForUserId),
          ne(match.deletedForUserId, session.user.id),
        ),
      ),
    );
  const matchIds = myMatches.map((m) => m.id);
  let hasMessage = false;
  let latestMsgMs: number | undefined;
  if (matchIds.length > 0) {
    const incoming = await db
      .select({ id: message.id, createdAt: message.createdAt })
      .from(message)
      .where(
        and(
          inArray(message.matchId, matchIds),
          ne(message.senderId, session.user.id),
        ),
      )
      .orderBy(desc(message.createdAt))
      .limit(1);
    if (incoming.length > 0) {
      hasMessage = true;
      latestMsgMs = +new Date(incoming[0].createdAt);
    }
  }

  const latestPendingMs =
    pending.length > 0 ? +new Date(pending[0].createdAt) : undefined;
  const latest = Math.max(latestPendingMs ?? 0, latestMsgMs ?? 0) || null;
  return NextResponse.json({
    hasMatch: pending.length > 0,
    hasMessage,
    latest,
  });
}

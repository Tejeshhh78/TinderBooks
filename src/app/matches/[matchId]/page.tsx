import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { match, book, user, message } from "@/db/schema";
import { eq, or, and, asc } from "drizzle-orm";
import { ChatInterface } from "./_components/chat-interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface PageProps {
  params: Promise<{ matchId: string }>;
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { matchId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Get match details
  const matchData = await db
    .select()
    .from(match)
    .where(
      and(
        eq(match.id, matchId),
        or(
          eq(match.user1Id, session.user.id),
          eq(match.user2Id, session.user.id),
        ),
      ),
    )
    .limit(1);

  if (matchData.length === 0) {
    notFound();
  }

  const matchInfo = matchData[0];
  const isUser1 = matchInfo.user1Id === session.user.id;
  const otherUserId = isUser1 ? matchInfo.user2Id : matchInfo.user1Id;
  const myBookId = isUser1 ? matchInfo.book2Id : matchInfo.book1Id;
  const theirBookId = isUser1 ? matchInfo.book1Id : matchInfo.book2Id;

  // Get all related data
  const [otherUserData, myBookData, theirBookData, messages] =
    await Promise.all([
      db.select().from(user).where(eq(user.id, otherUserId)).limit(1),
      db.select().from(book).where(eq(book.id, myBookId)).limit(1),
      db.select().from(book).where(eq(book.id, theirBookId)).limit(1),
      db
        .select({
          id: message.id,
          content: message.content,
          senderId: message.senderId,
          createdAt: message.createdAt,
        })
        .from(message)
        .where(eq(message.matchId, matchId))
        .orderBy(asc(message.createdAt)),
    ]);

  const otherUser = otherUserData[0];
  const myBook = myBookData[0];
  const theirBook = theirBookData[0];

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-4">
        <Link href="/matches">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4 mr-2" />
            Back to matches
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              You offer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {myBook.imageUrl && (
                <div className="relative w-16 h-20">
                  <Image
                    src={myBook.imageUrl}
                    alt={myBook.title}
                    fill
                    sizes="80px"
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold">{myBook.title}</p>
                <p className="text-sm text-muted-foreground">{myBook.author}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              You receive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {theirBook.imageUrl && (
                <div className="relative w-16 h-20">
                  <Image
                    src={theirBook.imageUrl}
                    alt={theirBook.title}
                    fill
                    sizes="80px"
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold">{theirBook.title}</p>
                <p className="text-sm text-muted-foreground">
                  {theirBook.author}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ChatInterface
        matchId={matchId}
        messages={messages}
        currentUserId={session.user.id}
        otherUserName={otherUser.name}
      />
    </div>
  );
}

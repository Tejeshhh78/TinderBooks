import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { match, book, user, message } from "@/db/schema";
import { eq, or, and, asc, ne } from "drizzle-orm";
import { ChatInterface } from "./_components/chat-interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Trash2, Check } from "lucide-react";
import { deleteMatch } from "@/actions/delete-match";
import { acceptMatch } from "@/actions/accept-match";
import Image from "next/image";
import { safeImageSrc } from "@/lib/utils";

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
        or(eq(match.user1Id, session.user.id), eq(match.user2Id, session.user.id)),
        ne(match.status, "cancelled"),
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
  const pending = matchInfo.status === "pending";

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/matches">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4 mr-2" />
            Back to matches
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {pending && myBook.isAvailable && (
            <form
              action={async (formData) => {
                "use server";
                formData.set("matchId", matchId);
                await acceptMatch(formData);
              }}
            >
              <Button size="sm" type="submit">
                <Check className="size-4 mr-2" /> Accept match
              </Button>
            </form>
          )}
          {pending && !myBook.isAvailable && (
            <span className="text-sm text-muted-foreground">Waiting for confirmation…</span>
          )}
        <form
          action={async (formData) => {
            "use server";
            await deleteMatch(formData);
            redirect("/matches");
          }}
        >
          <input type="hidden" name="matchId" value={matchId} />
          <Button variant="destructive" size="sm">
            <Trash2 className="size-4 mr-2" />
            Delete match
          </Button>
        </form>
        </div>
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
              <div className="relative w-16 h-20">
                <Image
                  src={safeImageSrc(myBook.imageUrl, "book")}
                  alt={myBook.title}
                  fill
                  sizes="80px"
                  className="object-cover rounded"
                />
              </div>
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
              <div className="relative w-16 h-20">
                <Image
                  src={safeImageSrc(theirBook.imageUrl, "book")}
                  alt={theirBook.title}
                  fill
                  sizes="80px"
                  className="object-cover rounded"
                />
              </div>
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

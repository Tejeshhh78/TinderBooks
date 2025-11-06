import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { match, book, user } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

export default async function MatchesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Get all matches for this user
  const matchesRaw = await db
    .select()
    .from(match)
    .where(
      or(
        eq(match.user1Id, session.user.id),
        eq(match.user2Id, session.user.id),
      ),
    )
    .orderBy(desc(match.createdAt));

  // Enrich matches with proper data structure
  const enrichedMatches = await Promise.all(
    matchesRaw.map(async (m) => {
      const isUser1 = m.user1Id === session.user.id;
      const otherUserId = isUser1 ? m.user2Id : m.user1Id;
      const myBookId = isUser1 ? m.book2Id : m.book1Id;
      const theirBookId = isUser1 ? m.book1Id : m.book2Id;

      if (!myBookId || !theirBookId) {
        return null;
      }

      const [otherUserData, myBookData, theirBookData] = await Promise.all([
        db.select().from(user).where(eq(user.id, otherUserId)).limit(1),
        db.select().from(book).where(eq(book.id, myBookId)).limit(1),
        db.select().from(book).where(eq(book.id, theirBookId)).limit(1),
      ]);

      if (!otherUserData[0] || !myBookData[0] || !theirBookData[0]) {
        return null;
      }

      return {
        matchId: m.id,
        status: m.status,
        createdAt: m.createdAt,
        otherUser: otherUserData[0],
        myBook: myBookData[0],
        theirBook: theirBookData[0],
      };
    }),
  );

  // Filter out null matches
  const validMatches = enrichedMatches.filter((m) => m !== null);

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Matches</h1>

      {validMatches.length === 0 ? (
        <div className="text-center py-20">
          <MessageCircle className="size-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No matches yet</h2>
          <p className="text-muted-foreground">
            Keep swiping to find book trades!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {validMatches.map((m) => (
            <Link key={m.matchId} href={`/matches/${m.matchId}`}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Match with {m.otherUser.name}</CardTitle>
                      <CardDescription>
                        {new Date(m.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={m.status === "active" ? "default" : "secondary"}
                    >
                      {m.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        You offer:
                      </p>
                      <div className="flex items-center gap-3">
                        {m.myBook.imageUrl && (
                          <img
                            src={m.myBook.imageUrl}
                            alt={m.myBook.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{m.myBook.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {m.myBook.author}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        You receive:
                      </p>
                      <div className="flex items-center gap-3">
                        {m.theirBook.imageUrl && (
                          <img
                            src={m.theirBook.imageUrl}
                            alt={m.theirBook.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{m.theirBook.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {m.theirBook.author}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

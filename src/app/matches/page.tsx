import { getUserMatches } from "@/lib/match-queries";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MatchesPage() {
const user = await getCurrentUser();
if (!user) {
redirect("/login");
}

const matches = await getUserMatches(user.id);

return (
<div className="container mx-auto px-4 py-8">
<h1 className="text-3xl font-bold mb-6">Your Matches</h1>

{matches.length === 0 ? (
<Card>
<CardContent className="p-8 text-center">
<p className="text-lg text-muted-foreground">
No matches yet. Keep swiping to find your perfect book swap!
</p>
<Button asChild className="mt-4">
<Link href="/swipe">Start Swiping</Link>
</Button>
</CardContent>
</Card>
) : (
<div className="grid gap-4 md:grid-cols-2">
{matches.map((match) => (
<Card key={match.id}>
<CardHeader>
<CardTitle className="text-lg">
Match with {match.otherUserName || "User"}
</CardTitle>
</CardHeader>
<CardContent className="space-y-4">
<div>
<p className="text-sm text-muted-foreground">They want:</p>
<p className="font-medium">{match.theirBookTitle}</p>
<p className="text-sm text-muted-foreground">
by {match.theirBookAuthor}
</p>
</div>
<div>
<p className="text-sm text-muted-foreground">You offered:</p>
<p className="font-medium">{match.myBookTitle}</p>
<p className="text-sm text-muted-foreground">
by {match.myBookAuthor}
</p>
</div>
<div className="pt-2">
<Button asChild className="w-full">
<Link href={`/messages?match=${match.id}`}>
Send Message
</Link>
</Button>
</div>
</CardContent>
</Card>
))}
</div>
)}
</div>
);
}


import { getUserMatches, getMatchMessages, getMatchDetails } from "@/lib/match-queries";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import MessageInterface from "./_components/message-interface";

type PageProps = {
searchParams: Promise<{ match?: string }>;
};

export default async function MessagesPage({ searchParams }: PageProps) {
const user = await getCurrentUser();
if (!user) {
redirect("/login");
}

const params = await searchParams;
const selectedMatchId = params.match;

	const matches = await getUserMatches(user.id);

	let selectedMatch: Awaited<ReturnType<typeof getMatchDetails>> = null;
	let messages: Awaited<ReturnType<typeof getMatchMessages>> = [];if (selectedMatchId) {
selectedMatch = await getMatchDetails(selectedMatchId, user.id);
if (selectedMatch) {
messages = await getMatchMessages(selectedMatchId);
}
}

return (
<div className="container mx-auto px-4 py-8">
<h1 className="text-3xl font-bold mb-6">Messages</h1>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<Card className="md:col-span-1">
<CardHeader>
<CardTitle>Your Matches</CardTitle>
</CardHeader>
<CardContent className="p-0">
<div className="h-[600px] overflow-y-auto">
{matches.length === 0 ? (
<p className="text-center text-muted-foreground p-4">
No matches yet
</p>
) : (
<div className="space-y-1">
{matches.map((match) => (
<Link
key={match.id}
href={`/messages?match=${match.id}`}
className={"block p-4 hover:bg-accent transition-colors " + (selectedMatchId === match.id ? "bg-accent" : "")}
>
<p className="font-medium">
{match.otherUserName || "User"}
</p>
<p className="text-sm text-muted-foreground truncate">
{match.theirBookTitle}
</p>
</Link>
))}
</div>
)}
</div>
</CardContent>
</Card>

<Card className="md:col-span-2">
{selectedMatch ? (
<>
<CardHeader>
<CardTitle>
{selectedMatch.otherUser?.name || "User"}
</CardTitle>
<p className="text-sm text-muted-foreground">
Swapping: {selectedMatch.theirBook?.title} ↔ {selectedMatch.myBook?.title}
</p>
</CardHeader>
<CardContent>
<MessageInterface
matchId={selectedMatch.id}
currentUserId={user.id}
messagesPromise={Promise.resolve(messages)}
/>
</CardContent>
</>
) : (
<CardContent className="p-8 flex items-center justify-center h-[600px]">
<p className="text-muted-foreground">
Select a match to start messaging
</p>
</CardContent>
)}
</Card>
</div>
</div>
);
}



"use client";

import { use, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/actions/send-message";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

type Message = {
id: string;
content: string;
senderId: string;
createdAt: Date;
read: boolean;
senderName: string;
senderImage: string | null;
};

type MessageInterfaceProps = {
matchId: string;
currentUserId: string;
messagesPromise: Promise<Message[]>;
};

export default function MessageInterface({
matchId,
currentUserId,
messagesPromise,
}: MessageInterfaceProps) {
const initialMessages = use(messagesPromise);
const [messages, setMessages] = useState(initialMessages);
const [content, setContent] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const scrollRef = useRef<HTMLDivElement>(null);
const router = useRouter();

useEffect(() => {
if (scrollRef.current) {
scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
}
}, [messages]);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!content.trim() || isSubmitting) return;

setIsSubmitting(true);

try {
const formData = new FormData();
formData.append("matchId", matchId);
formData.append("content", content);

await sendMessage(formData);

setContent("");
router.refresh();
} catch (error) {
console.error("Failed to send message:", error);
alert("Failed to send message. Please try again.");
} finally {
setIsSubmitting(false);
}
};

return (
<div className="flex flex-col h-[500px]">
<div className="flex-1 overflow-y-auto pr-4" ref={scrollRef}>
<div className="space-y-4 pb-4">
{messages.length === 0 ? (
<p className="text-center text-muted-foreground">
No messages yet. Start the conversation!
</p>
) : (
messages.map((message) => {
const isOwn = message.senderId === currentUserId;
return (
<div
key={message.id}
className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
>
<div
className={`max-w-[70%] rounded-lg px-4 py-2 ${
isOwn
? "bg-primary text-primary-foreground"
: "bg-muted"
}`}
>
<p>{message.content}</p>
<p
className={`text-xs mt-1 ${
isOwn
? "text-primary-foreground/70"
: "text-muted-foreground"
}`}
>
{new Date(message.createdAt).toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit",
})}
</p>
</div>
</div>
);
})
)}
</div>
</div>

<form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">
<Input
value={content}
onChange={(e) => setContent(e.target.value)}
placeholder="Type a message..."
disabled={isSubmitting}
className="flex-1"
/>
<Button type="submit" disabled={isSubmitting || !content.trim()}>
<Send className="size-4" />
</Button>
</form>
</div>
);
}

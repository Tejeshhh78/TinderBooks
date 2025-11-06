"use client";

import { useRef, useEffect, useActionState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/actions/send-message";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
}

interface ChatInterfaceProps {
  matchId: string;
  messages: Message[];
  currentUserId: string;
  otherUserName: string;
}

export function ChatInterface({
  matchId,
  messages,
  currentUserId,
  otherUserName,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [_state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const result = await sendMessage(formData);

      if (result.success) {
        formRef.current?.reset();
      } else {
        toast.error(result.error || "Failed to send message");
      }

      return result;
    },
    null,
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with {otherUserName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter>
        <form ref={formRef} action={formAction} className="flex gap-2 w-full">
          <input type="hidden" name="matchId" value={matchId} />
          <Input
            name="content"
            placeholder="Type your message..."
            required
            maxLength={1000}
            disabled={isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={isPending}>
            <Send className="size-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

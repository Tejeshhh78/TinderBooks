"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft } from "lucide-react"
import type { Match } from "@/lib/matches"
import type { User } from "@/lib/auth"
import type { Book } from "@/lib/books"

interface ConversationItemProps {
  match: Match
  otherUser: User | null
  myBook: Book | null
  theirBook: Book | null
  lastMessage?: string
  onClick: () => void
}

export function ConversationItem({ match, otherUser, myBook, theirBook, lastMessage, onClick }: ConversationItemProps) {
  if (!otherUser || !myBook || !theirBook) {
    return null
  }

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base truncate">{otherUser.name}</h3>
              <Badge variant="secondary" className="text-xs shrink-0">
                {match.status}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="truncate">{myBook.title}</span>
              <ArrowRightLeft className="h-3 w-3 shrink-0" />
              <span className="truncate">{theirBook.title}</span>
            </div>

            {lastMessage && <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

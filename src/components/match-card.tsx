"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, ArrowRightLeft } from "lucide-react"
import type { Match } from "@/lib/matches"
import type { Book } from "@/lib/books"
import type { User } from "@/lib/auth"

interface MatchCardProps {
  match: Match
  currentUserId: string
  otherUser: User | null
  myBook: Book | null
  theirBook: Book | null
  onMessage: () => void
}

export function MatchCard({ match, currentUserId, otherUser, myBook, theirBook, onMessage }: MatchCardProps) {
  if (!otherUser || !myBook || !theirBook) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Match with {otherUser.name}</CardTitle>
            {otherUser.location && <p className="text-sm text-muted-foreground mt-1">{otherUser.location}</p>}
          </div>
          <Badge variant={match.status === "pending" ? "secondary" : "default"} className="capitalize">
            {match.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
          <div className="space-y-1">
            <p className="text-sm font-semibold">You offer:</p>
            <p className="text-sm text-foreground">{myBook.title}</p>
            <p className="text-xs text-muted-foreground">by {myBook.author}</p>
          </div>

          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />

          <div className="space-y-1">
            <p className="text-sm font-semibold">They offer:</p>
            <p className="text-sm text-foreground">{theirBook.title}</p>
            <p className="text-xs text-muted-foreground">by {theirBook.author}</p>
          </div>
        </div>

        <Button onClick={onMessage} className="w-full">
          <MessageCircle className="h-4 w-4 mr-2" />
          Message {otherUser.name}
        </Button>
      </CardContent>
    </Card>
  )
}

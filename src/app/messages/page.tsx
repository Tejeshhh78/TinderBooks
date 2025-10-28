"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getAuthState, getAllUsers, type User } from "@/lib/auth"
import { getUserMatches, type Match } from "@/lib/matches"
import { getUserBooks, type Book } from "@/lib/books"
import { getMatchMessages, sendMessage, type Message } from "@/lib/messages"
import { NavBar } from "@/components/nav-bar"
import { ConversationItem } from "@/components/conversation-item"
import { MessageBubble } from "@/components/message-bubble"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, ArrowLeft, Send } from "lucide-react"

interface MatchWithDetails {
  match: Match
  otherUser: User | null
  myBook: Book | null
  theirBook: Book | null
  lastMessage?: string
}

export default function MessagesPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [matches, setMatches] = useState<MatchWithDetails[]>([])
  const [selectedMatch, setSelectedMatch] = useState<MatchWithDetails | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasHandledUrlMatch = useRef(false)

  useEffect(() => {
    const authState = getAuthState()
    if (!authState.isAuthenticated) {
      router.push("/")
    } else {
      setUserId(authState.user!.id)
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (userId) {
      loadMatches()
    }
  }, [userId])

  useEffect(() => {
    const matchId = searchParams.get("matchId")
    if (matchId && matches.length > 0 && !hasHandledUrlMatch.current) {
      const match = matches.find((m) => m.match.id === matchId)
      if (match) {
        handleSelectMatch(match)
        hasHandledUrlMatch.current = true
      }
    }
  }, [searchParams, matches.length])

  const loadMatches = () => {
    if (!userId) return

    const userMatches = getUserMatches(userId)
    const allUsers = getAllUsers()

    const matchesWithDetails: MatchWithDetails[] = userMatches.map((match) => {
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id
      const otherUser = allUsers.find((u) => u.id === otherUserId) || null

      const myBookId = match.user1Id === userId ? match.book1Id : match.book2Id
      const theirBookId = match.user1Id === userId ? match.book2Id : match.book1Id

      let myBook: Book | null = null
      let theirBook: Book | null = null

      const myBooks = getUserBooks(userId)
      myBook = myBooks.have.find((b) => b.id === myBookId) || null

      if (otherUser) {
        const theirBooks = getUserBooks(otherUser.id)
        theirBook = theirBooks.have.find((b) => b.id === theirBookId) || null
      }

      const matchMessages = getMatchMessages(match.id)
      const lastMessage = matchMessages[matchMessages.length - 1]?.content

      return {
        match,
        otherUser,
        myBook,
        theirBook,
        lastMessage,
      }
    })

    setMatches(matchesWithDetails)
  }

  const handleSelectMatch = (matchDetails: MatchWithDetails) => {
    setSelectedMatch(matchDetails)
    const matchMessages = getMatchMessages(matchDetails.match.id)
    setMessages(matchMessages)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedMatch || !userId) return

    sendMessage(selectedMatch.match.id, userId, newMessage.trim())
    setNewMessage("")

    const updatedMessages = getMatchMessages(selectedMatch.match.id)
    setMessages(updatedMessages)
    loadMatches()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (selectedMatch) {
    return (
      <main className="min-h-screen pb-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
        <div className="bg-card border-b">
          <div className="max-w-2xl mx-auto p-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedMatch(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate">{selectedMatch.otherUser?.name}</h2>
              <p className="text-sm text-muted-foreground truncate">
                {selectedMatch.myBook?.title} ↔ {selectedMatch.theirBook?.title}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm mt-1">Start the conversation about your trade</p>
              </div>
            ) : (
              <div className="space-y-1">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} isCurrentUser={message.senderId === userId} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border-t">
          <div className="max-w-2xl mx-auto p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <NavBar />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center gap-2 pt-4">
          <MessageCircle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        </div>

        {matches.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground mt-1">Match with someone to start chatting</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {matches.map((matchDetails) => (
              <ConversationItem
                key={matchDetails.match.id}
                match={matchDetails.match}
                otherUser={matchDetails.otherUser}
                myBook={matchDetails.myBook}
                theirBook={matchDetails.theirBook}
                lastMessage={matchDetails.lastMessage}
                onClick={() => handleSelectMatch(matchDetails)}
              />
            ))}
          </div>
        )}
      </div>

      <NavBar />
    </main>
  )
}

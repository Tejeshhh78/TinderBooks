"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthState, getAllUsers, type User } from "@/lib/auth"
import { getUserMatches, type Match } from "@/lib/matches"
import { getUserBooks, type Book } from "@/lib/books"
import { NavBar } from "@/components/nav-bar"
import { MatchCard } from "@/components/match-card"
import { Heart } from "lucide-react"

interface MatchWithDetails {
  match: Match
  otherUser: User | null
  myBook: Book | null
  theirBook: Book | null
}

export default function MatchesPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [matches, setMatches] = useState<MatchWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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

      return {
        match,
        otherUser,
        myBook,
        theirBook,
      }
    })

    setMatches(matchesWithDetails)
  }

  const handleMessage = (matchId: string) => {
    router.push(`/messages?matchId=${matchId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen pb-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center gap-2 pt-4">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">My Matches</h1>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No matches yet</p>
            <p className="text-sm mt-1">Start swiping to find books you want</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {matches.map(({ match, otherUser, myBook, theirBook }) => (
              <MatchCard
                key={match.id}
                match={match}
                currentUserId={userId!}
                otherUser={otherUser}
                myBook={myBook}
                theirBook={theirBook}
                onMessage={() => handleMessage(match.id)}
              />
            ))}
          </div>
        )}
      </div>

      <NavBar />
    </main>
  )
}

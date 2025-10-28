"use client"

export interface Match {
  id: string
  user1Id: string
  user2Id: string
  book1Id: string
  book2Id: string
  createdAt: string
  status: "pending" | "accepted" | "rejected"
}

export interface Swipe {
  userId: string
  bookId: string
  direction: "left" | "right"
  offeredBookId?: string
  createdAt: string
}

const SWIPES_KEY = "bookswap_swipes"
const MATCHES_KEY = "bookswap_matches"

function getAllSwipes(): Swipe[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(SWIPES_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveSwipes(swipes: Swipe[]) {
  localStorage.setItem(SWIPES_KEY, JSON.stringify(swipes))
}

function getAllMatches(): Match[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(MATCHES_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveMatches(matches: Match[]) {
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches))
}

export function swipeBook(
  userId: string,
  bookId: string,
  direction: "left" | "right",
  offeredBookId?: string,
): Match | null {
  const swipes = getAllSwipes()

  const newSwipe: Swipe = {
    userId,
    bookId,
    direction,
    offeredBookId,
    createdAt: new Date().toISOString(),
  }

  swipes.push(newSwipe)
  saveSwipes(swipes)

  if (direction === "right" && offeredBookId) {
    const matches = getAllMatches()
    const reciprocalSwipe = swipes.find(
      (s) => s.userId !== userId && s.bookId === offeredBookId && s.offeredBookId === bookId && s.direction === "right",
    )

    if (reciprocalSwipe) {
      const newMatch: Match = {
        id: crypto.randomUUID(),
        user1Id: userId,
        user2Id: reciprocalSwipe.userId,
        book1Id: offeredBookId,
        book2Id: bookId,
        createdAt: new Date().toISOString(),
        status: "pending",
      }

      matches.push(newMatch)
      saveMatches(matches)
      return newMatch
    }
  }

  return null
}

export function getUserMatches(userId: string): Match[] {
  const matches = getAllMatches()
  return matches.filter((m) => m.user1Id === userId || m.user2Id === userId)
}

export function hasSwipedBook(userId: string, bookId: string): boolean {
  const swipes = getAllSwipes()
  return swipes.some((s) => s.userId === userId && s.bookId === bookId)
}

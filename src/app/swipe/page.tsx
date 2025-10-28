"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthState } from "@/lib/auth"
import { getAllBooksForSwipe, getUserBooks, type Book } from "@/lib/books"
import { swipeBook, hasSwipedBook } from "@/lib/matches"
import { NavBar } from "@/components/nav-bar"
import { SwipeCard } from "@/components/swipe-card"
import { BookSelectionDialog } from "@/components/book-selection-dialog"
import { Button } from "@/components/ui/button"
import { X, Heart, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SwipePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [availableBooks, setAvailableBooks] = useState<Book[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userBooks, setUserBooks] = useState<Book[]>([])
  const [showBookSelection, setShowBookSelection] = useState(false)
  const [pendingSwipe, setPendingSwipe] = useState<{ book: Book; direction: "left" | "right" } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

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
      loadBooks()
    }
  }, [userId])

  const loadBooks = () => {
    if (!userId) return

    console.log("[v0] loadBooks - userId:", userId)
    const allBooks = getAllBooksForSwipe(userId)
    console.log("[v0] loadBooks - all available books:", allBooks.length, allBooks)
    const unswipedBooks = allBooks.filter((book) => !hasSwipedBook(userId, book.id))
    console.log("[v0] loadBooks - unswiped books:", unswipedBooks.length)
    setAvailableBooks(unswipedBooks)

    const myBooks = getUserBooks(userId)
    console.log("[v0] loadBooks - my books:", myBooks.have.length)
    setUserBooks(myBooks.have)
  }

  const handleSwipe = (direction: "left" | "right") => {
    const currentBook = availableBooks[currentIndex]
    if (!currentBook || !userId) return

    if (direction === "right") {
      setPendingSwipe({ book: currentBook, direction })
      setShowBookSelection(true)
    } else {
      swipeBook(userId, currentBook.id, direction)
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleBookSelection = (offeredBookId: string) => {
    if (!pendingSwipe || !userId) return

    const match = swipeBook(userId, pendingSwipe.book.id, "right", offeredBookId)

    if (match) {
      toast({
        title: "It's a match!",
        description: "You can now message about this trade.",
      })
    }

    setShowBookSelection(false)
    setPendingSwipe(null)
    setCurrentIndex((prev) => prev + 1)
  }

  const handleReset = () => {
    setCurrentIndex(0)
    loadBooks()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const currentBook = availableBooks[currentIndex]
  const hasMoreBooks = currentIndex < availableBooks.length

  return (
    <main className="min-h-screen pb-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
        <div className="flex items-center justify-between pt-4 mb-4">
          <h1 className="text-2xl font-bold text-foreground">Discover Books</h1>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 relative mb-4">
          {!hasMoreBooks ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">No more books to discover</p>
                <Button onClick={handleReset}>Start Over</Button>
              </div>
            </div>
          ) : (
            <>{currentBook && <SwipeCard key={currentBook.id} book={currentBook} onSwipe={handleSwipe} />}</>
          )}
        </div>

        {hasMoreBooks && (
          <div className="flex items-center justify-center gap-6 pb-4">
            <Button
              size="lg"
              variant="outline"
              className="h-16 w-16 rounded-full bg-white hover:bg-red-50 border-2"
              onClick={() => handleSwipe("left")}
            >
              <X className="h-8 w-8 text-red-500" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 w-16 rounded-full bg-white hover:bg-green-50 border-2"
              onClick={() => handleSwipe("right")}
            >
              <Heart className="h-8 w-8 text-green-500" />
            </Button>
          </div>
        )}
      </div>

      {pendingSwipe && (
        <BookSelectionDialog
          open={showBookSelection}
          onOpenChange={(open) => {
            setShowBookSelection(open)
            if (!open) setPendingSwipe(null)
          }}
          books={userBooks}
          onSelect={handleBookSelection}
          targetBook={pendingSwipe.book}
        />
      )}

      <NavBar />
    </main>
  )
}

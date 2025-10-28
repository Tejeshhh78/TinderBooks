"use client"

export interface Book {
  id: string
  userId: string
  title: string
  author: string
  genre: string
  condition: "new" | "like-new" | "good" | "fair"
  coverUrl?: string
  description?: string
  createdAt: string
}

export interface BookList {
  have: Book[]
  want: Book[]
}

const BOOKS_KEY = "bookswap_books"

function getAllBooks(): Record<string, BookList> {
  if (typeof window === "undefined") return {}

  const stored = localStorage.getItem(BOOKS_KEY)
  console.log("[v0] getAllBooks - raw stored data:", stored?.substring(0, 200))

  if (!stored) {
    console.log("[v0] getAllBooks - no data found")
    return {}
  }

  try {
    const parsed = JSON.parse(stored)
    console.log("[v0] getAllBooks - parsed type:", Array.isArray(parsed) ? "array" : typeof parsed)

    if (Array.isArray(parsed)) {
      console.log("[v0] getAllBooks - Converting array format to object format")

      // Convert array of books to nested object structure
      const converted: Record<string, BookList> = {}

      parsed.forEach((book: any) => {
        if (book.userId) {
          if (!converted[book.userId]) {
            converted[book.userId] = { have: [], want: [] }
          }

          // Determine if it's a "have" or "want" book based on type field or default to "have"
          const type = book.type === "want" ? "want" : "have"
          converted[book.userId][type].push(book)
        }
      })

      console.log("[v0] getAllBooks - Converted to object with keys:", Object.keys(converted))

      // Save the converted format
      saveAllBooks(converted)

      return converted
    }

    console.log("[v0] getAllBooks - parsed keys:", Object.keys(parsed))
    return parsed
  } catch (error) {
    console.log("[v0] getAllBooks - parse error:", error)
    return {}
  }
}

function saveAllBooks(books: Record<string, BookList>) {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books))
}

export function getUserBooks(userId: string): BookList {
  const allBooks = getAllBooks()
  return allBooks[userId] || { have: [], want: [] }
}

export function addBook(userId: string, book: Omit<Book, "id" | "userId" | "createdAt">, type: "have" | "want"): Book {
  const allBooks = getAllBooks()
  const userBooks = allBooks[userId] || { have: [], want: [] }

  const newBook: Book = {
    ...book,
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
  }

  userBooks[type].push(newBook)
  allBooks[userId] = userBooks
  saveAllBooks(allBooks)

  return newBook
}

export function removeBook(userId: string, bookId: string, type: "have" | "want") {
  const allBooks = getAllBooks()
  const userBooks = allBooks[userId]

  if (!userBooks) return

  userBooks[type] = userBooks[type].filter((b) => b.id !== bookId)
  allBooks[userId] = userBooks
  saveAllBooks(allBooks)
}

export function getAllBooksForSwipe(currentUserId: string): Book[] {
  const allBooks = getAllBooks()
  console.log("[v0] getAllBooksForSwipe - allBooks type:", typeof allBooks)
  console.log("[v0] getAllBooksForSwipe - allBooks keys:", Object.keys(allBooks))

  const books: Book[] = []

  Object.entries(allBooks).forEach(([userId, bookList]) => {
    console.log("[v0] getAllBooksForSwipe - checking userId:", userId, "has bookList:", !!bookList)

    if (userId !== currentUserId && bookList && Array.isArray(bookList.have)) {
      console.log("[v0] getAllBooksForSwipe - adding", bookList.have.length, "books from user", userId)
      books.push(...bookList.have)
    }
  })

  console.log("[v0] getAllBooksForSwipe - final books count:", books.length)
  return books
}

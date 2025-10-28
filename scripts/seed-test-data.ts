// Seed script to populate BookSwap with test users, books, matches, and messages

interface User {
  id: string
  email: string
  name: string
  bio?: string
  location?: string
  favoriteGenres: string[]
  createdAt: string
}

interface Book {
  id: string
  userId: string
  title: string
  author: string
  genre: string
  condition: "new" | "like-new" | "good" | "fair"
  description?: string
  createdAt: string
}

interface BookList {
  have: Book[]
  want: Book[]
}

interface Match {
  id: string
  user1Id: string
  user2Id: string
  book1Id: string
  book2Id: string
  createdAt: string
  status: "pending" | "accepted" | "rejected"
}

interface Swipe {
  userId: string
  bookId: string
  direction: "left" | "right"
  offeredBookId?: string
  createdAt: string
}

interface Message {
  id: string
  matchId: string
  senderId: string
  content: string
  createdAt: string
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Create test users
const testUsers: User[] = [
  {
    id: "user-1",
    email: "alice@test.com",
    name: "Alice Johnson",
    bio: "Avid reader and fantasy enthusiast. Always looking for the next great adventure!",
    location: "San Francisco, CA",
    favoriteGenres: ["Fantasy", "Science Fiction", "Mystery"],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "user-2",
    email: "bob@test.com",
    name: "Bob Martinez",
    bio: "Mystery lover and thriller addict. Love a good page-turner!",
    location: "Austin, TX",
    favoriteGenres: ["Mystery", "Thriller", "Crime"],
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "user-3",
    email: "carol@test.com",
    name: "Carol Chen",
    bio: "Romance and contemporary fiction reader. Looking to expand my collection!",
    location: "Seattle, WA",
    favoriteGenres: ["Romance", "Contemporary", "Historical Fiction"],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "user-4",
    email: "david@test.com",
    name: "David Kim",
    bio: "Sci-fi nerd and space opera fan. The future is now!",
    location: "New York, NY",
    favoriteGenres: ["Science Fiction", "Fantasy", "Non-Fiction"],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "user-5",
    email: "emma@test.com",
    name: "Emma Wilson",
    bio: "Classic literature enthusiast. Old books have the best stories.",
    location: "Boston, MA",
    favoriteGenres: ["Classic", "Historical Fiction", "Literary Fiction"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Create books for each user
const testBooks: Record<string, BookList> = {
  "user-1": {
    have: [
      {
        id: "book-1",
        userId: "user-1",
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        genre: "Fantasy",
        condition: "good",
        description: "First book in the Kingkiller Chronicle. Great condition, some wear on cover.",
        createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "book-2",
        userId: "user-1",
        title: "Dune",
        author: "Frank Herbert",
        genre: "Science Fiction",
        condition: "like-new",
        description: "Classic sci-fi masterpiece. Barely read, excellent condition.",
        createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "book-3",
        userId: "user-1",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        condition: "good",
        description: "Well-loved copy with some annotations.",
        createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    want: [
      {
        id: "book-4",
        userId: "user-1",
        title: "The Way of Kings",
        author: "Brandon Sanderson",
        genre: "Fantasy",
        condition: "good",
        description: "Looking for any condition!",
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  "user-2": {
    have: [
      {
        id: "book-5",
        userId: "user-2",
        title: "Gone Girl",
        author: "Gillian Flynn",
        genre: "Mystery",
        condition: "like-new",
        description: "Thrilling mystery with great twists. Read once, like new.",
        createdAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "book-6",
        userId: "user-2",
        title: "The Girl with the Dragon Tattoo",
        author: "Stieg Larsson",
        genre: "Thriller",
        condition: "good",
        description: "First in the Millennium series. Good condition.",
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "book-7",
        userId: "user-2",
        title: "The Da Vinci Code",
        author: "Dan Brown",
        genre: "Thriller",
        condition: "fair",
        description: "Well-read copy, some wear but fully readable.",
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    want: [
      {
        id: "book-8",
        userId: "user-2",
        title: "The Silent Patient",
        author: "Alex Michaelides",
        genre: "Thriller",
        condition: "good",
        description: "Heard great things about this one!",
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  "user-3": {
    have: [
      {
        id: "book-9",
        userId: "user-3",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Romance",
        condition: "good",
        description: "Classic romance. Beautiful edition.",
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "book-10",
        userId: "user-3",
        title: "The Notebook",
        author: "Nicholas Sparks",
        genre: "Romance",
        condition: "like-new",
        description: "Heartwarming love story. Excellent condition.",
        createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "book-11",
        userId: "user-3",
        title: "Eleanor Oliphant Is Completely Fine",
        author: "Gail Honeyman",
        genre: "Contemporary",
        condition: "new",
        description: "Brand new, never read. Changed my mind about reading it.",
        createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    want: [
      {
        id: "book-12",
        userId: "user-3",
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        genre: "Historical Fiction",
        condition: "good",
        description: "Really want to read this!",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  "user-4": {
    have: [
      {
        id: "book-13",
        userId: "user-4",
        title: "Foundation",
        author: "Isaac Asimov",
        genre: "Science Fiction",
        condition: "good",
        description: "Classic sci-fi series starter. Good condition.",
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "book-14",
        userId: "user-4",
        title: "Ender's Game",
        author: "Orson Scott Card",
        genre: "Science Fiction",
        condition: "like-new",
        description: "Amazing sci-fi novel. Like new condition.",
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "book-15",
        userId: "user-4",
        title: "The Way of Kings",
        author: "Brandon Sanderson",
        genre: "Fantasy",
        condition: "good",
        description: "Epic fantasy. First in the Stormlight Archive.",
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    want: [
      {
        id: "book-16",
        userId: "user-4",
        title: "Project Hail Mary",
        author: "Andy Weir",
        genre: "Science Fiction",
        condition: "good",
        description: "Looking for this one!",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  "user-5": {
    have: [
      {
        id: "book-17",
        userId: "user-5",
        title: "1984",
        author: "George Orwell",
        genre: "Classic",
        condition: "good",
        description: "Dystopian classic. Well-maintained copy.",
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "book-18",
        userId: "user-5",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Classic",
        condition: "like-new",
        description: "American classic. Excellent condition.",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "book-19",
        userId: "user-5",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic",
        condition: "good",
        description: "Jazz age masterpiece. Good condition.",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    want: [
      {
        id: "book-20",
        userId: "user-5",
        title: "Jane Eyre",
        author: "Charlotte Brontë",
        genre: "Classic",
        condition: "good",
        description: "Looking to complete my classics collection!",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
}

// Create some swipes and matches
const testSwipes: Swipe[] = [
  // Alice (user-1) swipes right on David's "The Way of Kings" offering her "Dune"
  {
    userId: "user-1",
    bookId: "book-15",
    direction: "right",
    offeredBookId: "book-2",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // David (user-4) swipes right on Alice's "Dune" offering his "The Way of Kings"
  {
    userId: "user-4",
    bookId: "book-2",
    direction: "right",
    offeredBookId: "book-15",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Bob (user-2) swipes right on Carol's "Eleanor Oliphant" offering his "Gone Girl"
  {
    userId: "user-2",
    bookId: "book-11",
    direction: "right",
    offeredBookId: "book-5",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Carol (user-3) swipes right on Bob's "Gone Girl" offering her "Eleanor Oliphant"
  {
    userId: "user-3",
    bookId: "book-5",
    direction: "right",
    offeredBookId: "book-11",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Some left swipes
  {
    userId: "user-1",
    bookId: "book-17",
    direction: "left",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    userId: "user-2",
    bookId: "book-2",
    direction: "left",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const testMatches: Match[] = [
  {
    id: "match-1",
    user1Id: "user-1",
    user2Id: "user-4",
    book1Id: "book-2",
    book2Id: "book-15",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "match-2",
    user1Id: "user-2",
    user2Id: "user-3",
    book1Id: "book-5",
    book2Id: "book-11",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
]

// Create some messages
const testMessages: Message[] = [
  {
    id: "msg-1",
    matchId: "match-1",
    senderId: "user-4",
    content: "Hey! I'd love to trade The Way of Kings for Dune. Is your copy in good condition?",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-2",
    matchId: "match-1",
    senderId: "user-1",
    content: "Yes! It's in great condition, barely read. I've been wanting to read The Way of Kings for ages!",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
  },
  {
    id: "msg-3",
    matchId: "match-1",
    senderId: "user-4",
    content: "Perfect! How would you like to arrange the exchange?",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-4",
    matchId: "match-2",
    senderId: "user-3",
    content: "Hi! I'm interested in Gone Girl. My copy of Eleanor Oliphant is brand new!",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-5",
    matchId: "match-2",
    senderId: "user-2",
    content: "That sounds great! I've heard amazing things about that book.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 7200000).toISOString(),
  },
]

// Seed the data
console.log("[v0] Starting to seed test data...")

// Save users
localStorage.setItem("bookswap_users", JSON.stringify(testUsers))
console.log(`[v0] Created ${testUsers.length} test users`)

// Save books
localStorage.setItem("bookswap_books", JSON.stringify(testBooks))
const totalBooks = Object.values(testBooks).reduce((sum, list) => sum + list.have.length + list.want.length, 0)
console.log(`[v0] Created ${totalBooks} test books`)

// Save swipes
localStorage.setItem("bookswap_swipes", JSON.stringify(testSwipes))
console.log(`[v0] Created ${testSwipes.length} test swipes`)

// Save matches
localStorage.setItem("bookswap_matches", JSON.stringify(testMatches))
console.log(`[v0] Created ${testMatches.length} test matches`)

// Save messages
localStorage.setItem("bookswap_messages", JSON.stringify(testMessages))
console.log(`[v0] Created ${testMessages.length} test messages`)

console.log("[v0] Test data seeded successfully!")
console.log("[v0] You can now sign in with any of these test accounts:")
console.log("[v0] - alice@test.com (password: anything)")
console.log("[v0] - bob@test.com (password: anything)")
console.log("[v0] - carol@test.com (password: anything)")
console.log("[v0] - david@test.com (password: anything)")
console.log("[v0] - emma@test.com (password: anything)")

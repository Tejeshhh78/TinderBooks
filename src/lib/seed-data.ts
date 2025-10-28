export function seedTestData() {
  console.log("[v0] seedTestData - starting")

  localStorage.clear()
  console.log("[v0] seedTestData - cleared all localStorage")

  localStorage.removeItem("bookswap_books")
  localStorage.removeItem("bookswap_swipes")
  localStorage.removeItem("bookswap_matches")
  localStorage.removeItem("bookswap_messages")

  // Create test users
  const testUsers = [
    {
      id: "user-1",
      email: "alice@test.com",
      password: "password123",
      name: "Alice Johnson",
      bio: "Avid reader and book collector. Love fantasy and sci-fi!",
      location: "San Francisco, CA",
      favoriteGenres: ["Fantasy", "Science Fiction", "Mystery"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-2",
      email: "bob@test.com",
      password: "password123",
      name: "Bob Smith",
      bio: "Always looking for my next great read. Prefer non-fiction.",
      location: "New York, NY",
      favoriteGenres: ["Non-Fiction", "Biography", "History"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-3",
      email: "carol@test.com",
      password: "password123",
      name: "Carol Davis",
      bio: "Romance and contemporary fiction enthusiast.",
      location: "Austin, TX",
      favoriteGenres: ["Romance", "Contemporary", "Young Adult"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-4",
      email: "david@test.com",
      password: "password123",
      name: "David Wilson",
      bio: "Thriller and mystery lover. Always up for a good page-turner.",
      location: "Seattle, WA",
      favoriteGenres: ["Thriller", "Mystery", "Horror"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-5",
      email: "emma@test.com",
      password: "password123",
      name: "Emma Brown",
      bio: "Classic literature and poetry reader.",
      location: "Boston, MA",
      favoriteGenres: ["Classics", "Poetry", "Literary Fiction"],
      createdAt: new Date().toISOString(),
    },
  ]

  // Save users
  localStorage.setItem("bookswap_users", JSON.stringify(testUsers))
  console.log("[v0] seedTestData - saved users:", testUsers.length)

  const booksByUser: Record<string, { have: any[]; want: any[] }> = {
    "user-1": { have: [], want: [] },
    "user-2": { have: [], want: [] },
    "user-3": { have: [], want: [] },
    "user-4": { have: [], want: [] },
    "user-5": { have: [], want: [] },
  }

  // Alice's books
  booksByUser["user-1"].have.push({
    id: "book-1",
    userId: "user-1",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    condition: "good",
    description: "First book in the Kingkiller Chronicle series",
    createdAt: new Date().toISOString(),
  })
  booksByUser["user-1"].have.push({
    id: "book-2",
    userId: "user-1",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    condition: "like-new",
    description: "Classic sci-fi masterpiece",
    createdAt: new Date().toISOString(),
  })
  booksByUser["user-1"].want.push({
    id: "book-3",
    userId: "user-1",
    title: "The Way of Kings",
    author: "Brandon Sanderson",
    genre: "Fantasy",
    condition: "good",
    description: "Epic fantasy at its finest",
    createdAt: new Date().toISOString(),
  })

  // Bob's books
  booksByUser["user-2"].have.push({
    id: "book-4",
    userId: "user-2",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "Non-Fiction",
    condition: "good",
    description: "A brief history of humankind",
    createdAt: new Date().toISOString(),
  })
  booksByUser["user-2"].have.push({
    id: "book-5",
    userId: "user-2",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    genre: "Biography",
    condition: "like-new",
    description: "Biography of Apple's co-founder",
    createdAt: new Date().toISOString(),
  })
  booksByUser["user-2"].want.push({
    id: "book-6",
    userId: "user-2",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    condition: "good",
    description: "Heard great things about this",
    createdAt: new Date().toISOString(),
  })

  // Carol's books
  booksByUser["user-3"].have.push({
    id: "book-7",
    userId: "user-3",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: "Contemporary",
    condition: "good",
    description: "Beautiful story about love and identity",
    createdAt: new Date().toISOString(),
  })
  booksByUser["user-3"].have.push({
    id: "book-8",
    userId: "user-3",
    title: "Beach Read",
    author: "Emily Henry",
    genre: "Romance",
    condition: "like-new",
    description: "Perfect summer romance",
    createdAt: new Date().toISOString(),
  })
  booksByUser["user-3"].want.push({
    id: "book-9",
    userId: "user-3",
    title: "Red, White & Royal Blue",
    author: "Casey McQuiston",
    genre: "Romance",
    condition: "good",
    description: "Want to read this so badly!",
    createdAt: new Date().toISOString(),
  })

  // David's books
  booksByUser["user-4"].have.push({
    id: "book-10",
    userId: "user-4",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Thriller",
    condition: "good",
    description: "Gripping psychological thriller",
    createdAt: new Date().toISOString(),
  })
  booksByUser["user-4"].have.push({
    id: "book-11",
    userId: "user-4",
    title: "Gone Girl",
    author: "Gillian Flynn",
    genre: "Mystery",
    condition: "fair",
    description: "Twisted and unpredictable",
    createdAt: new Date().toISOString(),
  })
  booksByUser["user-4"].want.push({
    id: "book-12",
    userId: "user-4",
    title: "The Shining",
    author: "Stephen King",
    genre: "Horror",
    condition: "good",
    description: "Classic King horror",
    createdAt: new Date().toISOString(),
  })

  // Emma's books
  booksByUser["user-5"].have.push({
    id: "book-13",
    userId: "user-5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Classics",
    condition: "like-new",
    description: "Timeless classic",
    createdAt: new Date().toISOString(),
  })
  booksByUser["user-5"].have.push({
    id: "book-14",
    userId: "user-5",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classics",
    condition: "good",
    description: "American classic",
    createdAt: new Date().toISOString(),
  })
  booksByUser["user-5"].want.push({
    id: "book-15",
    userId: "user-5",
    title: "Leaves of Grass",
    author: "Walt Whitman",
    genre: "Poetry",
    condition: "good",
    description: "Looking for a good edition",
    createdAt: new Date().toISOString(),
  })

  const booksJson = JSON.stringify(booksByUser)
  localStorage.setItem("bookswap_books", booksJson)
  console.log("[v0] seedTestData - saved books structure:", booksByUser)
  console.log("[v0] seedTestData - books JSON:", booksJson.substring(0, 200))

  const verification = localStorage.getItem("bookswap_books")
  console.log("[v0] seedTestData - verification read:", verification?.substring(0, 200))

  const parsedVerification = JSON.parse(verification || "{}")
  console.log("[v0] seedTestData - parsed verification type:", Array.isArray(parsedVerification) ? "array" : "object")
  console.log("[v0] seedTestData - parsed verification keys:", Object.keys(parsedVerification))

  const totalBooks = Object.values(booksByUser).reduce((sum, user) => sum + user.have.length + user.want.length, 0)
  console.log("[v0] seedTestData - total books:", totalBooks)

  // Create some swipes
  const swipes = [
    { userId: "user-1", bookId: "book-4", direction: "right", offeredBookId: "book-1" },
    { userId: "user-2", bookId: "book-1", direction: "right", offeredBookId: "book-4" },
    { userId: "user-1", bookId: "book-7", direction: "right", offeredBookId: "book-2" },
    { userId: "user-3", bookId: "book-2", direction: "right", offeredBookId: "book-7" },
  ]

  localStorage.setItem("bookswap_swipes", JSON.stringify(swipes))
  console.log("[v0] seedTestData - saved swipes:", swipes.length)

  // Create matches
  const matches = [
    {
      id: "match-1",
      user1Id: "user-1",
      user2Id: "user-2",
      book1Id: "book-1",
      book2Id: "book-4",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "match-2",
      user1Id: "user-1",
      user2Id: "user-3",
      book1Id: "book-2",
      book2Id: "book-7",
      createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    },
  ]

  localStorage.setItem("bookswap_matches", JSON.stringify(matches))
  console.log("[v0] seedTestData - saved matches:", matches.length)

  // Create messages
  const messages = [
    {
      id: "msg-1",
      matchId: "match-1",
      senderId: "user-2",
      content: "Hey! I'd love to trade for The Name of the Wind!",
      createdAt: new Date(Date.now() - 82800000).toISOString(),
    },
    {
      id: "msg-2",
      matchId: "match-1",
      senderId: "user-1",
      content: "Sounds great! Sapiens looks really interesting.",
      createdAt: new Date(Date.now() - 79200000).toISOString(),
    },
    {
      id: "msg-3",
      matchId: "match-1",
      senderId: "user-2",
      content: "When would be a good time to meet up?",
      createdAt: new Date(Date.now() - 75600000).toISOString(),
    },
    {
      id: "msg-4",
      matchId: "match-2",
      senderId: "user-3",
      content: "Hi! I'm so excited about this trade!",
      createdAt: new Date(Date.now() - 39600000).toISOString(),
    },
    {
      id: "msg-5",
      matchId: "match-2",
      senderId: "user-1",
      content: "Me too! Dune for The Seven Husbands sounds perfect.",
      createdAt: new Date(Date.now() - 36000000).toISOString(),
    },
  ]

  localStorage.setItem("bookswap_messages", JSON.stringify(messages))
  console.log("[v0] seedTestData - saved messages:", messages.length)

  console.log("[v0] seedTestData - complete!")
  return true
}

import { config } from "dotenv";
import { resolve } from "path";
import { eq } from "drizzle-orm";

// Load environment variables from .env.local FIRST
config({ path: resolve(process.cwd(), ".env.local") });

/**
 * Seed script to create test data for existing users
 * This script adds profiles, books, and wanted books for users that already exist
 *
 * Prerequisites: Users must be created through signup first
 * Run this after creating test accounts manually through the signup page
 */

interface UserData {
  email: string;
  profile: {
    bio: string;
    city: string;
    genres: string[]; // Changed from favoriteGenres
  };
  books: Array<{
    title: string;
    author: string;
    genre: string;
    condition: string;
    imageUrl: string;
  }>;
  wants: Array<{
    title: string;
    author: string;
    genres: string[]; // Changed from genre - this matches wanted book schema
  }>;
}

const testUsersData: UserData[] = [
  {
    email: "alice@test.com",
    profile: {
      bio: "Avid reader and coffee enthusiast. Love sci-fi and mystery novels!",
      city: "San Francisco",
      genres: ["Science Fiction", "Mystery", "Thriller"],
    },
    books: [
      {
        title: "Dune",
        author: "Frank Herbert",
        genre: "Science Fiction",
        condition: "Good",
        imageUrl:
          "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
      },
      {
        title: "The Martian",
        author: "Andy Weir",
        genre: "Science Fiction",
        condition: "Like New",
        imageUrl:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
      },
      {
        title: "Gone Girl",
        author: "Gillian Flynn",
        genre: "Mystery",
        condition: "Good",
        imageUrl:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
      },
    ],
    wants: [
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        genres: ["Science Fiction"],
      },
      {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        genres: ["Thriller", "Mystery"],
      },
    ],
  },
  {
    email: "bob@test.com",
    profile: {
      bio: "Fantasy and adventure lover. Always looking for the next epic series!",
      city: "Austin",
      genres: ["Fantasy", "Adventure", "Historical Fiction"],
    },
    books: [
      {
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        genre: "Fantasy",
        condition: "Good",
        imageUrl:
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        genre: "Science Fiction",
        condition: "Like New",
        imageUrl:
          "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
      },
      {
        title: "The Pillars of the Earth",
        author: "Ken Follett",
        genre: "Historical Fiction",
        condition: "Fair",
        imageUrl:
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
      },
    ],
    wants: [
      {
        title: "The Way of Kings",
        author: "Brandon Sanderson",
        genres: ["Fantasy", "Adventure"],
      },
      { title: "Dune", author: "Frank Herbert", genres: ["Science Fiction"] },
    ],
  },
  {
    email: "carol@test.com",
    profile: {
      bio: "Romance and contemporary fiction reader. Looking to swap recent releases!",
      city: "New York",
      genres: ["Romance", "Contemporary", "Literary Fiction"],
    },
    books: [
      {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        genre: "Thriller",
        condition: "Like New",
        imageUrl:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      },
      {
        title: "Normal People",
        author: "Sally Rooney",
        genre: "Contemporary",
        condition: "Good",
        imageUrl:
          "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
      },
      {
        title: "The Night Circus",
        author: "Erin Morgenstern",
        genre: "Fantasy",
        condition: "Good",
        imageUrl:
          "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400",
      },
    ],
    wants: [
      {
        title: "Book Lovers",
        author: "Emily Henry",
        genres: ["Romance", "Contemporary"],
      },
      {
        title: "Tomorrow, and Tomorrow, and Tomorrow",
        author: "Gabrielle Zevin",
        genres: ["Literary Fiction", "Contemporary"],
      },
    ],
  },
  {
    email: "david@test.com",
    profile: {
      bio: "Non-fiction and biography enthusiast. Love learning from other people's stories.",
      city: "Seattle",
      genres: ["Non-Fiction", "Biography", "Self-Help"],
    },
    books: [
      {
        title: "Educated",
        author: "Tara Westover",
        genre: "Biography",
        condition: "Like New",
        imageUrl:
          "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400",
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self-Help",
        condition: "Good",
        imageUrl:
          "https://images.unsplash.com/photo-1551135049-8a33b5883817?w=400",
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        genre: "Non-Fiction",
        condition: "Good",
        imageUrl:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      },
    ],
    wants: [
      {
        title: "The Body Keeps the Score",
        author: "Bessel van der Kolk",
        genres: ["Non-Fiction", "Psychology"],
      },
      {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        genres: ["Non-Fiction", "Psychology"],
      },
    ],
  },
  {
    email: "emma@test.com",
    profile: {
      bio: "Thriller and horror fan. The more suspenseful, the better!",
      city: "Boston",
      genres: ["Thriller", "Horror", "Mystery"],
    },
    books: [
      {
        title: "The Shining",
        author: "Stephen King",
        genre: "Horror",
        condition: "Good",
        imageUrl:
          "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400",
      },
      {
        title: "The Girl with the Dragon Tattoo",
        author: "Stieg Larsson",
        genre: "Mystery",
        condition: "Fair",
        imageUrl:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
      },
      {
        title: "The Way of Kings",
        author: "Brandon Sanderson",
        genre: "Fantasy",
        condition: "Like New",
        imageUrl:
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
      },
    ],
    wants: [
      {
        title: "Gone Girl",
        author: "Gillian Flynn",
        genres: ["Mystery", "Thriller"],
      },
      {
        title: "The Martian",
        author: "Andy Weir",
        genres: ["Science Fiction", "Thriller"],
      },
    ],
  },
];
async function seed() {
  console.log("🌱 Seeding database with test data...\n");
  console.log(
    "⚠️  Make sure you've created these accounts first through signup:",
  );
  console.log("   alice@test.com / password123");
  console.log("   bob@test.com / password123");
  console.log("   carol@test.com / password123");
  console.log("   david@test.com / password123");
  console.log("   emma@test.com / password123");
  console.log("");

  // Import modules after environment is configured
  const { db } = await import("./index");
  const { user, userProfile, book, wantedBook } = await import("./schema");

  for (const userData of testUsersData) {
    console.log(`\n👤 Processing user: ${userData.email}`);

    // Find user by email
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, userData.email));

    if (!existingUser) {
      console.log(
        `   ⚠️  User not found - please create account through signup first`,
      );
      continue;
    }

    // Delete existing data for this user
    await db.delete(wantedBook).where(eq(wantedBook.userId, existingUser.id));
    await db.delete(book).where(eq(book.userId, existingUser.id));
    await db.delete(userProfile).where(eq(userProfile.userId, existingUser.id));

    // Create profile
    await db.insert(userProfile).values({
      userId: existingUser.id,
      bio: userData.profile.bio,
      city: userData.profile.city,
      genres: JSON.stringify(userData.profile.genres),
    });
    console.log(`   ✅ Profile created`);

    // Create books
    for (const bookData of userData.books) {
      await db.insert(book).values({
        ...bookData,
        id: crypto.randomUUID(),
        userId: existingUser.id,
      });
    }
    console.log(`   ✅ Created ${userData.books.length} books`);

    // Create wanted books
    for (const wantedBookData of userData.wants) {
      await db.insert(wantedBook).values({
        ...wantedBookData,
        id: crypto.randomUUID(),
        userId: existingUser.id,
        genres: JSON.stringify(wantedBookData.genres),
      });
    }
    console.log(`   ✅ Created ${userData.wants.length} wanted books`);
  }

  console.log("\n✨ Seeding complete!");
  console.log("\n💡 Log in with any account and start swiping!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

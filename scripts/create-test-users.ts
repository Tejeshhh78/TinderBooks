/**
 * Script to create test user accounts using better-auth's signup
 */

interface TestUser {
  email: string;
  password: string;
  name: string;
}

const testUsers: TestUser[] = [
  { email: "alice@test.com", password: "password123", name: "Alice Johnson" },
  { email: "bob@test.com", password: "password123", name: "Bob Martinez" },
  { email: "carol@test.com", password: "password123", name: "Carol Chen" },
  { email: "david@test.com", password: "password123", name: "David Kim" },
  { email: "emma@test.com", password: "password123", name: "Emma Wilson" },
];

async function createTestUsers() {
  console.log("🔧 Creating test user accounts...\n");

  const baseUrl =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

  for (const testUser of testUsers) {
    console.log(`👤 Creating ${testUser.name} (${testUser.email})`);

    try {
      const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        }),
      });

      if (response.ok) {
        console.log(`   ✅ Created successfully`);
      } else {
        const error = await response.json();
        if (
          error.message?.includes("already exists") ||
          error.error?.includes("already exists")
        ) {
          console.log(`   ⚠️  User already exists - skipping`);
        } else {
          console.log(`   ❌ Failed: ${JSON.stringify(error)}`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }
  }

  console.log("\n✨ All test accounts created!");
  console.log("\n📝 You can now log in with:");
  for (const testUser of testUsers) {
    console.log(`   ${testUser.email} / ${testUser.password}`);
  }
  console.log("\n🌱 Next, run: pnpm db:seed");
}

createTestUsers()
  .catch((error) => {
    console.error("❌ Failed to create test users:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

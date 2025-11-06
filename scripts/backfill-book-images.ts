/**
 * Backfill script: Set a default neutral book cover for books missing an image.
 *
 * Criteria:
 * - imageUrl IS NULL or '' (empty string)
 *
 * Uses the existing Drizzle client and schema. Assumes DATABASE_URL is set.
 */

import "dotenv/config";
import { eq, isNull, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { book } from "../src/db/schema";

async function backfillBookImages() {
  const PLACEHOLDER = "/placeholder-book.svg";

  console.log("\n📚 Backfilling missing book images...");
  console.log(`   Using placeholder: ${PLACEHOLDER}`);

  const fallbackUrl = "file:./src/db/localdb.sqlite";
  const url = process.env.DATABASE_URL || fallbackUrl;
  if (!process.env.DATABASE_URL) {
    console.log(`   ℹ️ DATABASE_URL not set; using local DB: ${fallbackUrl}`);
  }

  const db = drizzle({ connection: { url } });

  // Condition: imageUrl is null or empty string
  const condition = or(isNull(book.imageUrl), eq(book.imageUrl, ""));

  // Count candidates first (SQLite update does not return affected rows in all adapters)
  const toUpdate = await db.select({ id: book.id }).from(book).where(condition);
  const count = toUpdate.length;

  if (count === 0) {
    console.log("✅ No books with missing images found. Nothing to update.\n");
    return;
  }

  console.log(`🔎 Found ${count} book(s) without image.`);

  // Perform the update
  await db.update(book).set({ imageUrl: PLACEHOLDER }).where(condition);

  // Quick verification: count remaining (should be 0 for our filter)
  const remaining = await db
    .select({ id: book.id })
    .from(book)
    .where(condition);

  console.log(
    `✅ Updated ${count - remaining.length} book(s). Remaining without image: ${remaining.length}.`,
  );
  console.log("✨ Done.\n");
}

backfillBookImages().catch((err) => {
  console.error("❌ Backfill failed:", err);
  process.exit(1);
});

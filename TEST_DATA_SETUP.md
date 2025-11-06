# BookSwap Test Data Setup

Follow these steps to create test users and populate the database with sample books:

## Step 1: Create Test Accounts

Make sure your dev server is running (`pnpm dev`), then visit http://localhost:3000/signup and create these accounts:

1. **Alice Johnson**
   - Email: `alice@test.com`
   - Password: `password123`
   - Name: `Alice Johnson`

2. **Bob Martinez**
   - Email: `bob@test.com`
   - Password: `password123`
   - Name: `Bob Martinez`

3. **Carol Chen**
   - Email: `carol@test.com`
   - Password: `password123`
   - Name: `Carol Chen`

4. **David Kim**
   - Email: `david@test.com`
   - Password: `password123`
   - Name: `David Kim`

5. **Emma Wilson**
   - Email: `emma@test.com`
   - Password: `password123`
   - Name: `Emma Wilson`

## Step 2: Seed the Database

After creating all 5 accounts, run this command to populate them with profiles, books, and wanted books:

```bash
pnpm db:seed
```

This will:
- ✅ Create user profiles with bios, cities, and favorite genres
- ✅ Add 3 books per user (15 total books to discover)
- ✅ Add wanted books that create potential matches
- ✅ Set up realistic data for testing swipe, match, and messaging features

## Step 3: Test the Features

Now you can log in with any of the test accounts and:

- **Discover Page**: Swipe through books from other users
- **My Books**: See your books and wanted books
- **Matches**: View and chat with matched users
- **Profile**: Edit your bio, city, and favorite genres

## What Each User Has

### Alice (Science Fiction & Mystery fan from San Francisco)
- **Books**: Dune, The Martian, Gone Girl
- **Wants**: Project Hail Mary, The Silent Patient

### Bob (Fantasy & Adventure lover from Austin)
- **Books**: The Name of the Wind, Project Hail Mary, The Pillars of the Earth
- **Wants**: The Way of Kings, Dune

### Carol (Romance & Contemporary reader from New York)
- **Books**: The Silent Patient, Normal People, The Night Circus
- **Wants**: Book Lovers, Tomorrow and Tomorrow and Tomorrow

### David (Non-Fiction & Biography enthusiast from Seattle)
- **Books**: Educated, Atomic Habits, Sapiens
- **Wants**: The Body Keeps the Score, Thinking Fast and Slow

### Emma (Thriller & Horror fan from Boston)
- **Books**: The Shining, The Girl with the Dragon Tattoo, The Way of Kings
- **Wants**: Gone Girl, The Martian

## Potential Matches

The seed data creates natural matching opportunities:
- Alice wants "Project Hail Mary" → Bob has it
- Bob wants "Dune" → Alice has it
- Carol wants "Book Lovers" (none available - good test for empty state)
- Emma wants "Gone Girl" → Alice has it
- Emma wants "The Martian" → Alice has it

Happy testing! 🎉

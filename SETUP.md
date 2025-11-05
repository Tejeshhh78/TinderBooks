# TinderBooks - Setup Instructions for New Developers

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)

## Setup Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TinderBooks
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your configuration:

```env
# Database
DATABASE_URL=file:./src/db/localdb.sqlite
DATABASE_AUTH_TOKEN=

# Auth Secret (generate a random string)
BETTER_AUTH_SECRET=your-random-secret-here-minimum-32-characters

# App URL
BETTER_AUTH_URL=http://localhost:3000
```

**To generate a secure secret:**

```bash
# On Windows PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# On Mac/Linux:
openssl rand -base64 32
```

### 4. Setup Database

Run the database migrations:

```bash
pnpm db:push
```

This will create the SQLite database file at `src/db/localdb.sqlite`.

### 5. Run Development Server

```bash
pnpm dev
```

The app will be available at **http://localhost:3000**

## Project Structure

- `src/app/` - Next.js App Router pages
  - `books/` - Book collection management
  - `swipe/` - Tinder-style book discovery
  - `matches/` - View matched users
  - `messages/` - Chat with matches
- `src/actions/` - Server actions for mutations
- `src/lib/` - Database queries and utilities
- `src/components/` - Reusable React components
- `src/db/` - Database schema and connection

## Troubleshooting

### "Module not found" errors

Run:
```bash
rm -rf .next
pnpm install
pnpm dev
```

### Database errors

Make sure the database is initialized:
```bash
pnpm db:push
```

### CSS not loading

The CSS is in `src/app/globals.css` and should be automatically included. If it's not loading:
1. Check that the file exists
2. Verify it's imported in `src/app/layout.tsx`
3. Clear Next.js cache: `rm -rf .next`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## First Time Use

1. Sign up for an account at `/signup`
2. Add some books to your collection at `/books`
3. Go to `/swipe` to discover books from other users
4. When you like a book, select which of your books to offer
5. If both users like each other's books, you get a match!
6. Chat with matches at `/messages`

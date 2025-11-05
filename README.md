# TinderBooks - Book Exchange Platform

A modern web-based book management and exchange platform where users can organize their book collections and wishlist. Built with Next.js 15 following modern full-stack best practices.

## Problem Statement

Book lovers often have books they've finished reading and would like to trade, but lack an easy way to organize their collection and connect with potential trading partners. TinderBooks solves this by providing a centralized platform to manage books you own and books you're looking for.

## Features

- 📚 **Book Collection Management** - Add and organize books you own
- 🎯 **Wishlist** - Keep track of books you want to read
- � **Secure Authentication** - User accounts with better-auth
- 📊 **Database Persistence** - All data stored in SQLite database
- 🎨 **Modern UI** - Clean interface built with TailwindCSS and shadcn/ui

## Tech Stack

This project perfectly matches the recommended tech stack from the course:

- **Meta-Framework:** Next.js 15.5.4
- **Frontend Framework:** React 19.1.0
- **Database ORM:** Drizzle ORM 0.44.6
- **Database:** SQLite (via @libsql/client)
- **Authentication:** better-auth 1.3.26
- **Styling:** TailwindCSS 4
- **Components:** shadcn/ui (radix-ui based)
- **Additional:** TypeScript, Biome (linting/formatting)

## Project Structure

```
src/
├── actions/          # Server actions for data mutations
├── app/             # Next.js app router pages
│   ├── books/       # Main book management page
│   ├── login/       # Login page
│   ├── signup/      # Signup page
│   └── api/auth/    # Auth API routes
├── components/      # Reusable React components
│   └── ui/          # shadcn/ui components
├── db/              # Database schema and connection
├── lib/             # Utility functions and helpers
└── middleware.ts    # Auth middleware
```


## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager ([Installation Guide](https://pnpm.io/installation))

### Installation & Setup

**1. Install dependencies**

```bash
pnpm install
```

**2. Set up environment variables**

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:
- `BETTER_AUTH_SECRET` - A random string (minimum 32 characters)
- `DATABASE_URL` - Already configured for local SQLite (`file:./src/db/localdb.sqlite`)
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Set to `http://localhost:3000` for development

**3. Initialize the database**

```bash
pnpm db:push
```

This creates the SQLite database with all required tables in `src/db/localdb.sqlite`.

**4. Start the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up** - Create a new account on the signup page
2. **Login** - Access your account
3. **Add Books** - Navigate to the Books page to add books you own or want
4. **Manage Collection** - View, organize, and remove books from your lists

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Drizzle Studio for database management

## Future Enhancements

- Tinder-style swipe interface for discovering books
- Matching algorithm to connect users with similar interests
- Messaging system for coordinating book trades
- User profiles with reading preferences
- Book condition ratings and photos

## Assignment Compliance

This project fulfills all mandatory requirements:
- ✅ Solves a real problem (book collection management and trading)
- ✅ Web-based frontend with user interaction
- ✅ Server-side logic (authentication, data validation, business logic)
- ✅ Database persistence (SQLite with Drizzle ORM)
- ✅ Can be run in any development environment
- ✅ Uses the exact recommended tech stack

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js templates](https://vercel.com/templates/next.js) - need other functionality? Look here for other cool templates

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

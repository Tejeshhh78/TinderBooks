# 📚 BookSwap - Book Exchange Platform# Simple full-stack starter



BookSwap is a Tinder-style book exchange platform that allows users to discover and trade physical books by swiping through available listings. Match with other book lovers based on what you have and what you want!Used deps:



## 🎯 Features- Main framework: Next.js

- DB: SQLite

### Core MVP Features- ORM: Drizzle

- **User Profiles** - Create your profile with bio, city, and favorite genres- Styling: Tailwind v4

- **Book Listings** - Manage "Books I Have" and "Books I Want"- Auth: better-auth

- **Swipe Discovery** - Tinder-style interface to browse available books- Components: shadcn/ui (radix-ui based)

- **Smart Matching** - Automatic matching when users want each other's books

- **Messaging** - Chat with matches to coordinate exchanges

## Getting Started

## 🛠️ Tech Stack

### (0. Install pnpm)

- **Framework:** Next.js 15 (App Router)

- **Styling:** Tailwind CSS v4See [pnpm Installation Guide](https://pnpm.io/installation).

- **Components:** shadcn/ui (Radix UI)

- **Authentication:** better-auth

- **Database:** Turso (SQLite) via drizzle-orm### 1. Install all dependencies 

- **Package Manager:** pnpm

```bash

## 🚀 Getting Startedpnpm i

```

### Prerequisites

- Node.js 20+ You do this whenever new dependencies should get installed

- pnpm

### 2. Initialize the database

### Installation

```bash

1. Clone the repository:pnpm db:push

```bash```

git clone <repository-url>

cd BookSwapThis command creates a (.gitignore'd) SQLite DB file in src/db/localdb.sqlite.

```

*You also use this command later to push the changes to the schema into the database!*

2. Install dependencies:

```bash### 3. Running the development server

pnpm install

``````bash

pnpm dev

3. Set up environment variables:```

Create a `.env.local` file with:

```Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

DATABASE_URL=<your-database-url>You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

DATABASE_AUTH_TOKEN=<your-auth-token>

```This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



4. Push the database schema:### Dev agent compatibility

```bash

pnpm db:pushThis project defines a AGENTS.md file for context and rules for coding agents. Feel free to use it as additional info when asking other external chat tools as well!

```



5. Run the development server:### Recommended dependencies

```bash

pnpm dev- If you build tables, it's highly recommended to store pagination, sorting and filtering state in search params. Use [nuqs](https://nuqs.dev/) for that. Use [TanStack Table](https://tanstack.com/table/latest) for base table components.

```- If you really need client-side data fetching, use [SWR](https://swr.vercel.app/) or [TanStack Query](https://tanstack.com/query/v5/docs/framework/react/overview) instead of fetch calls in "useEffect" hooks.

- If the manual validation and middleware boilerplate in your server actions get's too much, build your server actions with [next-safe-action](https://next-safe-action.dev/)

Open [http://localhost:3000](http://localhost:3000) to see the app!



## 📁 Project Structure### Recommended MCPs



```If you use tooling that allows integration of MCP servers, I recommend the following ones:

src/

├── actions/          # Server actions for mutations- [Context7 by upstash](https://upstash.com/blog/context7-mcp)

├── app/              # Next.js app router pages    - Returns up-to-date info about all kinds of dependencies

│   ├── discover/     # Swipe interface

│   ├── my-books/     # Book management## Learn More

│   ├── matches/      # Matches and messaging

│   └── profile/      # User profileTo learn more about Next.js, take a look at the following resources:

├── components/       # Reusable UI components

├── db/               # Database schema and connection- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

└── lib/              # Utilities and helpers- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

```- [Next.js templates](https://vercel.com/templates/next.js) - need other functionality? Look here for other cool templates



## 🎮 How to UseYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


1. **Sign Up** - Create an account with email
2. **Complete Profile** - Add your bio, city, and favorite genres
3. **Add Books** - List books you have and want
4. **Discover** - Swipe through available books
   - ❤️ Swipe right if interested
   - ❌ Swipe left to pass
5. **Match** - When both users want each other's books
6. **Chat** - Message your matches to coordinate the exchange

## 🗄️ Database Schema

- **user** - User accounts (from better-auth)
- **userProfile** - Extended profile (bio, city, genres)
- **book** - Books users have
- **wantedBook** - Books users want
- **swipe** - Swipe actions (like/pass)
- **match** - Successful matches between users
- **message** - Chat messages

## 📜 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter
- `pnpm format` - Format code
- `pnpm db:push` - Push schema changes
- `pnpm db:studio` - Open Drizzle Studio

## 🔒 Authentication

BookSwap uses [better-auth](https://www.better-auth.com/) for authentication with:
- Email/password authentication
- Session management
- Protected routes via middleware

## 🎨 Styling

- Custom color scheme in `src/app/globals.css`
- shadcn/ui components for consistent design
- Responsive design for mobile and desktop

## 🚀 Future Enhancements

- Geolocation filters ("Show users near me")
- Book scanning via ISBN
- Rating/reputation system
- In-app notifications
- Group swaps / community events
- Image upload for book photos
- Advanced search and filters

## 📝 License

This project is built as an MVP demonstration.

## 🤝 Contributing

This is an MVP project. Feel free to fork and customize for your needs!

---

Built with ❤️ using Next.js and better-auth

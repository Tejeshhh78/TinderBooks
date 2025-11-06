# 📚 TinderBooks - Book Exchange Platform

> Swipe, Match, and Exchange Books with Fellow Readers

TinderBooks is a modern book exchange platform that combines social discovery with book trading. Swipe through available books, match with other readers, and coordinate book swaps - all in a beautifully designed interface.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

## ✨ Features

### 📖 Book Management
- **Dual Collections** - Manage "Books I Have" and "Books I Want"
- **Rich Metadata** - Add titles, authors, genres, conditions, and descriptions
- **Easy Organization** - Tabbed interface for quick access

### 💫 Discovery & Matching
- **Tinder-Style Swipe** - Intuitive card interface for book discovery
- **Smart Matching** - Automatic matches when mutual interest is detected
- **Real-time Updates** - See new books as they're added

### 💬 Communication
- **In-App Messaging** - Chat with matches to coordinate exchanges
- **Match History** - Keep track of all your book swap conversations

### 👤 User Profiles
- **Personalization** - Add bio, location, and favorite genres
- **Reading Preferences** - Let others know your reading interests

### � Dashboard
- **Analytics** - Track your book collection and swap activity
- **Interactive Charts** - Visualize your reading habits

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Authentication:** [better-auth](https://www.better-auth.com/)
- **Database:** SQLite with [Drizzle ORM](https://orm.drizzle.team/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Package Manager:** npm/pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or pnpm installed

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Tejeshhh78/TinderBooks.git
cd TinderBooks
```

2. **Install dependencies:**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables:**

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Update the following variables:
```env
# Authentication
BETTER_AUTH_SECRET=your-secret-key-min-32-characters
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=file:./src/db/localdb.sqlite
```

4. **Initialize the database:**
```bash
npm run db:push
# or
pnpm db:push
```

This creates a local SQLite database with all required tables.

5. **Start the development server:**
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 🎮 How to Use

1. **Sign Up** - Create an account with your email
2. **Complete Your Profile** - Add bio, location, and favorite genres
3. **Add Books** 
   - Navigate to "My Books"
   - Add books you own to "Books I Have"
   - Add books you're looking for to "Books I Want"
4. **Discover Books**
   - Swipe through available books
   - ❤️ Swipe right if interested
   - ❌ Swipe left to pass
5. **Match & Connect** - When both users want each other's books, you match!
6. **Message** - Coordinate the book exchange via in-app messaging

## 📁 Project Structure

```
TinderBooks/
├── src/
│   ├── actions/              # Server actions (add-book, remove-book, etc.)
│   ├── app/                  # Next.js App Router pages
│   │   ├── books/           # Book collection management
│   │   ├── dashboard/       # Analytics dashboard
│   │   ├── login/           # Authentication pages
│   │   ├── signup/
│   │   └── api/auth/        # better-auth API routes
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui primitives
│   │   ├── book-card.tsx    # Book display component
│   │   ├── swipe-card.tsx   # Swipeable card interface
│   │   └── ...
│   ├── db/                   # Database layer
│   │   ├── schema.ts        # Drizzle schema definitions
│   │   └── index.ts         # Database client
│   ├── lib/                  # Utilities
│   │   ├── auth.ts          # better-auth configuration
│   │   ├── auth-server.ts   # Server-side auth helpers
│   │   └── utils.ts         # Shared utilities
│   └── middleware.ts         # Route protection
├── public/                   # Static assets
├── AGENTS.md                 # AI agent coding guidelines
└── drizzle.config.ts         # Drizzle ORM configuration
```

## 🗄️ Database Schema

### Core Tables

- **user** - User accounts (managed by better-auth)
- **session** - User sessions
- **account** - OAuth accounts
- **verification** - Email verification tokens

### BookSwap Tables

- **userProfile** - Extended user data (bio, location, genres)
- **book** - Book catalog (title, author, genre, condition)
- **userBook** - User book relationships (have/want)
- **swipe** - Swipe history (like/pass)
- **match** - Successful matches between users
- **message** - Chat messages

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run Biome linter |
| `npm run format` | Format code with Biome |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

## � Authentication

TinderBooks uses [better-auth](https://www.better-auth.com/) for secure authentication:

- **Email/Password Authentication** - Simple signup and login
- **Session Management** - Secure session handling
- **Protected Routes** - Middleware-based route protection
- **Server Actions** - Secure server-side mutations

Protected routes include:
- `/dashboard` - Analytics dashboard
- `/books` - Book management
- `/swipe` - Discovery interface
- `/matches` - Match list
- `/messages` - Chat interface

## 🎨 Design System

### Colors & Theming

Custom color palette defined in `src/app/globals.css`:
- Uses CSS variables for light/dark mode support
- Semantic color naming (primary, secondary, accent, etc.)
- Consistent across all components

### Components

Built with [shadcn/ui](https://ui.shadcn.com/) for:
- Consistency and accessibility
- Full TypeScript support
- Customizable and composable
- Built on Radix UI primitives

### Icons

[Lucide React](https://lucide.dev/) icons throughout:
- Consistent `size-4` class for button icons
- Semantic naming
- Tree-shakeable

## 🔧 Development Guidelines

### For AI Coding Agents

This project includes an `AGENTS.md` file with:
- Coding conventions and rules
- File structure guidelines
- Best practices for Next.js App Router
- Server Action patterns
- Component organization

### Code Style

- **File Naming:** snake_case for files, PascalCase for components
- **Client Components:** Mark with `"use client"` directive
- **Server Components:** Use `import "server-only"` for server-only code
- **Server Actions:** One action per file, use Zod for validation
- **Revalidation:** Always call `revalidatePath("/", "layout")` after mutations

### Recommended Tools

- **State Management:** Use URL search params with [nuqs](https://nuqs.dev/)
- **Data Fetching:** [SWR](https://swr.vercel.app/) or [TanStack Query](https://tanstack.com/query/latest)
- **Tables:** [TanStack Table](https://tanstack.com/table/latest) with shadcn theming
- **Forms:** [React Hook Form](https://react-hook-form.com/) + Zod validation

## 🌟 Future Enhancements

- [ ] ISBN book scanning for easy additions
- [ ] Geolocation-based discovery
- [ ] User ratings and reputation system
- [ ] Book condition photos
- [ ] Push notifications for matches
- [ ] Reading lists and recommendations
- [ ] Community book clubs
- [ ] Advanced search and filters
- [ ] Social features (following, reviews)
- [ ] Export/import book collections

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
BETTER_AUTH_SECRET=<generate-secure-random-string>
NEXT_PUBLIC_BETTER_AUTH_URL=<your-production-url>
DATABASE_URL=<your-database-url>
```

### Database Options

- **Development:** Local SQLite (included)
- **Production:** [Turso](https://turso.tech/) - Serverless SQLite
- **Alternative:** Any PostgreSQL/MySQL database with Drizzle ORM

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [better-auth Documentation](https://www.better-auth.com/) - Authentication setup
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database queries
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## � License

This project is available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 💬 Support

For questions or issues:
- Open an issue on GitHub
- Check existing issues for solutions

---

**Built with ❤️ using Next.js, better-auth, and modern web technologies**

⭐ Star this repo if you find it helpful!

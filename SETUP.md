# 🚀 BookSwap - Quick Start Guide

## ✅ Your Environment is Ready!

Everything has been set up automatically. Here's what was created:

### 1. Environment Variables (`.env.local`)
- ✅ Local SQLite database configured
- ✅ Authentication secret generated
- ✅ Base URL set to localhost:3000

### 2. Database
- ✅ SQLite database file created at `src/db/localdb.sqlite`
- ✅ All tables initialized (users, books, matches, messages, etc.)

## 🎯 How to Start

### Start the Development Server
```bash
pnpm dev
```

Then open your browser to: **http://localhost:3000**

## 📖 Using BookSwap

### First Time Setup:
1. **Sign Up** - Create an account at http://localhost:3000/signup
2. **Complete Profile** - Add your bio, city, and favorite book genres
3. **Add Books** - List books you have and books you want
4. **Start Swiping** - Go to Discover and swipe on books!

### Main Pages:
- **Home** (`/`) - Landing page (redirects to discover if logged in)
- **Sign Up** (`/signup`) - Create a new account
- **Login** (`/login`) - Sign in to existing account
- **Discover** (`/discover`) - Swipe through available books
- **My Books** (`/my-books`) - Manage your book listings
- **Matches** (`/matches`) - View and chat with matches
- **Profile** (`/profile`) - Edit your profile

## 🗄️ Database Information

Your local SQLite database includes these tables:
- `user` - User accounts
- `userProfile` - Extended profiles (bio, city, genres)
- `book` - Books users have available
- `wantedBook` - Books users want
- `swipe` - Swipe history
- `match` - Matched users
- `message` - Chat messages

### View Database
To inspect your database:
```bash
pnpm db:studio
```
This opens Drizzle Studio in your browser to view/edit data.

## 🔧 Useful Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start

# View database
pnpm db:studio

# Update database schema (after changes)
pnpm db:push

# Format code
pnpm format

# Check code quality
pnpm lint
```

## 📝 Environment Variables Explained

```bash
# Database location (local SQLite file)
DATABASE_URL=file:./src/db/localdb.sqlite

# Auth secret (keep this secure in production!)
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production-minimum-32-chars

# Your app URL
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## 🎨 Features Available

✅ User authentication (email/password)
✅ User profiles with preferences
✅ Book management (add/delete)
✅ Wishlist system
✅ Tinder-style swipe interface
✅ Smart matching algorithm
✅ Real-time messaging
✅ Responsive design

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
# Kill the process or use a different port
pnpm dev -- -p 3001
```

### Database Issues
If you need to reset the database:
```bash
# Delete the database file
Remove-Item src\db\localdb.sqlite

# Recreate it
pnpm db:push
```

### Dependencies Issue
If something doesn't work:
```bash
# Reinstall dependencies
Remove-Item -Recurse node_modules
pnpm install
```

## 🎉 You're All Set!

Just run `pnpm dev` and start building your book exchange community!

---

Need help? Check the main README.md for more details.

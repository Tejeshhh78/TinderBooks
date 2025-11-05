# Checklist for Your Friend

## ❓ Is CSS/Styling Missing?

The CSS **IS** in the repository. Here's what to check:

### 1. Did they run `pnpm install`?

```bash
pnpm install
```

This installs all dependencies including TailwindCSS.

### 2. Did they create `.env.local`?

Copy the example file:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add:
```env
BETTER_AUTH_SECRET=put-a-random-32-character-string-here
```

Generate a secret:
```powershell
# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 3. Did they initialize the database?

```bash
pnpm db:push
```

### 4. Are they running the dev server?

```bash
pnpm dev
```

Then open http://localhost:3000

## 🔍 Common Issues

### "No CSS styling appears"

**Solution:**
1. Check `src/app/globals.css` exists
2. Run: `rm -rf .next; pnpm dev`
3. Hard refresh browser (Ctrl+Shift+R)

### "Module not found" errors

**Solution:**
```bash
rm -rf node_modules
rm -rf .next
pnpm install
pnpm dev
```

### "Database error"

**Solution:**
```bash
pnpm db:push
```

This creates the SQLite database file.

### "Authentication not working"

**Solution:**
Make sure `.env.local` has:
```env
BETTER_AUTH_SECRET=your-secret-here-minimum-32-chars
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Files That SHOULD Be There

These files ARE tracked in git and your friend should have them:

- ✅ `src/app/globals.css` - All CSS styling
- ✅ `src/app/layout.tsx` - Root layout (imports globals.css)
- ✅ `components.json` - shadcn/ui config
- ✅ `postcss.config.mjs` - PostCSS config
- ✅ `biome.json` - Linter config
- ✅ `.env.example` - Example environment variables
- ✅ All `.tsx` and `.ts` files in `src/`

## 📁 Files That SHOULD NOT Be There

These files are NOT in git (by design):

- ❌ `.env.local` - Must create manually (has secrets)
- ❌ `node_modules/` - Must run `pnpm install`
- ❌ `.next/` - Build cache (auto-generated)
- ❌ `src/db/localdb.sqlite` - Database (auto-generated with `pnpm db:push`)

## 🚀 Quick Setup

Tell your friend to run these commands in order:

```bash
# 1. Install dependencies
pnpm install

# 2. Create environment file
cp .env.example .env.local

# 3. Edit .env.local and add BETTER_AUTH_SECRET (see above)

# 4. Initialize database
pnpm db:push

# 5. Start dev server
pnpm dev
```

Then visit http://localhost:3000

## 💡 TIP

If they cloned the repo and **nothing** is there, they might have:
- Cloned an empty branch
- Cloned before you pushed your changes
- Network issues during clone

Ask them to run:
```bash
git pull origin main
git status
ls -la
```

This will show what branch they're on and what files they have.

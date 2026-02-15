# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start dev server (Next.js)
bun run build        # Production build
bun run lint         # ESLint
bun run start        # Start production server

# Database
bunx drizzle-kit generate                                      # Generate migrations
bunx wrangler d1 migrations apply tsundoc-db --local           # Apply migrations locally

# Deployment target: Cloudflare Pages via @opennextjs/cloudflare
```

## Architecture

**tsundoc** — a "tsundoku" (積読) tracking app for managing unread books. Next.js 16 App Router on Cloudflare Pages with D1 (SQLite).

### Stack

- **Framework:** Next.js 16 (App Router, React Compiler enabled)
- **DB:** Drizzle ORM → Cloudflare D1 (SQLite). Schema in `src/db/schema.ts`
- **Auth:** better-auth (email+password only). Server config in `src/lib/auth.ts`, client in `src/lib/auth-client.ts`
- **IDs:** ULID for all primary keys
- **Styling:** Tailwind CSS 4 (utility classes only, no component library)
- **Path alias:** `@/*` → `./src/*`

### Route Groups

- `(auth)/` — Public login/signup pages (client components with useState)
- `(main)/` — Auth-protected routes. Layout checks session server-side, redirects to `/login` if unauthenticated
- `/api/auth/[...all]` — Better Auth catch-all handler
- `/api/books/search` — ISBN lookup (OpenBD → Google Books fallback)

### Data Patterns

- **Pages are server components** that query the DB directly via Drizzle
- **Mutations use server actions** (`"use server"` in co-located `actions.ts` files), followed by `revalidatePath()`
- **Client components** are isolated for interactivity (forms, book card status updates via `useTransition`)

### DB Schema (app tables)

- `books` — Shared book catalog (isbn unique, title, author, publisher, coverUrl)
- `user_books` — Per-user book status (unread/reading/done), memo. FK to books and auth user table with cascade delete. Unique constraint on (userId, bookId)

### Environment Variables

```
BETTER_AUTH_SECRET=<random_secret>
BETTER_AUTH_URL=http://localhost:3000
```

Cloudflare D1 binding name is "DB" (configured in `wrangler.toml`).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start dev server (Next.js)
bun run build        # Production build
bun run lint         # ESLint
bun run start        # Start production server
bun run cf:build     # Build for Cloudflare Workers
bun run preview      # Build and preview locally on Cloudflare
bun run deploy       # Build and deploy to Cloudflare Workers

# Database
bunx drizzle-kit generate                                      # Generate migrations
bunx wrangler d1 migrations apply tsundoc-db --local           # Apply migrations locally
```

## Architecture

**tsundoc** — a "tsundoku" (積読) tracking app for managing unread books. Next.js 16 App Router on Cloudflare Workers with D1 (SQLite).

### Stack

- **Framework:** Next.js 16 (App Router, React Compiler enabled)
- **DB:** Drizzle ORM → Cloudflare D1 (SQLite). Schema in `src/db/schema.ts`
- **Auth:** better-auth (email+password only). Server config in `src/lib/auth.ts`, client in `src/lib/auth-client.ts`
- **IDs:** ULID for all primary keys
- **Styling:** Tailwind CSS 4 (utility classes only, no component library)
- **Icons:** lucide-react
- **Path alias:** `@/*` → `./src/*`

### Route Groups

- `(auth)/` — Public login/signup pages (client components with useState)
- `(main)/` — Auth-protected routes. Layout checks session server-side, redirects to `/login` if unauthenticated
  - `@modal/` — Parallel route slot for intercepted modal dialogs
  - `(.)books/new` — Intercepts `/books/new` to render as modal
  - `(.)books/[id]` — Intercepts `/books/[id]` to render as modal
- `/api/auth/[...all]` — Better Auth catch-all handler
- `/api/books/search` — Book search by ISBN (`?isbn=`) or keyword (`?title=&author=`) via Google Books API

### Data Patterns

- **Pages are server components** that query the DB directly via Drizzle
- **Mutations use server actions** (`"use server"` in co-located `actions.ts` files), followed by `revalidatePath()`
- **Client components** are isolated for interactivity (forms, book card status updates via `useTransition`)
- **Modals** use Next.js intercepting routes (`(.)books/...`) with the `@modal` parallel route slot

### DB Schema (app tables)

- `books` — Shared book catalog (isbn unique, title, author, publisher, coverUrl)
- `user_books` — Per-user book status (unread/reading/done), memo. FK to books and auth user table with cascade delete. Unique constraint on (userId, bookId)

### Environment Variables

```
BETTER_AUTH_SECRET=<random_secret>
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_BOOKS_API_KEY=<api_key>
```

Cloudflare D1 binding name is "DB" (configured in `wrangler.toml`). Two environments: production (`tsundoc-db`) and staging (`tsundoc-db-staging`).

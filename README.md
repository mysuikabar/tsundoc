# tsundoc

A web app for managing your "tsundoku" (unread book pile) — automatically fetches book info by ISBN or keyword (title/author) and tracks reading status: **Unread → Reading → Done**.

## Tech Stack

- **Next.js 16** (App Router, React Compiler) + TypeScript
- **Cloudflare D1** (SQLite) + **Drizzle ORM**
- **Better Auth** (email + password authentication)
- **Tailwind CSS 4**
- Deploy: **Cloudflare Workers** (@opennextjs/cloudflare)

## Setup

```bash
bun install
```

### Environment Variables

Set the following in `.env.local`:

```
BETTER_AUTH_SECRET=<secret>
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_BOOKS_API_KEY=<api_key>
```

### DB Migrations

```bash
bunx drizzle-kit generate
bunx wrangler d1 migrations apply tsundoc-db --local
```

## Development

```bash
bun run dev
```

Runs at http://localhost:3000.

## CI/CD

GitHub Actions handles all deployments automatically.

| Workflow | Trigger | Action |
|----------|---------|--------|
| **CI** | Pull request | Lint + build check |
| **Preview** | Pull request to `main` | Deploy to staging environment (Cloudflare Workers) with staging D1 migrations applied |
| **CD** | Push to `main` | Apply D1 migrations and deploy to production (Cloudflare Workers) |

Required GitHub Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

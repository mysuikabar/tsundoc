# tsundoc

ISBN またはキーワード（タイトル・著者名）で書籍情報を自動取得し、「未読 → 読書中 → 読了」のステータスで積読を管理できる Web アプリ。

## 技術構成

- **Next.js 16** (App Router, React Compiler) + TypeScript
- **Cloudflare D1** (SQLite) + **Drizzle ORM**
- **Better Auth** (メール+パスワード認証)
- **Tailwind CSS 4**
- デプロイ: **Cloudflare Workers** (@opennextjs/cloudflare)

## セットアップ

```bash
bun install
```

### 環境変数

`.env.local` に以下を設定:

```
BETTER_AUTH_SECRET=<secret>
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_BOOKS_API_KEY=<api_key>
```

### DB マイグレーション

```bash
bunx drizzle-kit generate
bunx wrangler d1 migrations apply tsundoc-db --local
```

## 開発

```bash
bun run dev
```

http://localhost:3000 で起動。

## デプロイ

```bash
bun run deploy          # 本番環境へデプロイ
bun run preview         # ローカルで本番ビルドをプレビュー
```


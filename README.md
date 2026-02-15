# tsundoc

ISBN を入力するだけで書籍情報を自動取得し、「未読 → 読書中 → 読了」のステータスで積読を管理できる Web アプリ。

## 技術構成

- **Next.js** (App Router) + TypeScript
- **Cloudflare D1** (SQLite) + **Drizzle ORM**
- **Better Auth** (メール+パスワード認証)
- **Tailwind CSS**
- デプロイ: **Cloudflare Pages**

## セットアップ

```bash
bun install
```

### 環境変数

`.env.local` に以下を設定:

```
BETTER_AUTH_SECRET=<secret>
BETTER_AUTH_URL=http://localhost:3000
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

## 主な機能

- メールアドレス+パスワードでの認証
- ISBN 検索による書籍登録 (OpenBD / Google Books API)
- 積読リストの一覧表示・ステータスフィルタ
- ステータス管理 (未読 / 読書中 / 読了)
- 書籍の削除

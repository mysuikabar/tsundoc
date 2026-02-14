# tsundoc 実装計画

## 全体方針

要件定義書（`requirements.md`）とディレクトリ構成（`directory-structure.md`）に基づき、4 つの Phase に分けて段階的に実装する。

---

## Phase 1: プロジェクト初期化

Next.js プロジェクトの初期化と基盤セットアップ。

### Step 1: Next.js プロジェクト初期化

- `bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias` で既存ディレクトリ内に初期化
- 不要な初期ファイルの整理（デフォルトの page.tsx の中身を簡素化など）

### Step 2: 追加パッケージのインストール

```bash
# Cloudflare 対応
bun add @opennextjs/cloudflare
bun add -d wrangler

# Drizzle ORM
bun add drizzle-orm
bun add -d drizzle-kit

# Better Auth
bun add better-auth

# ユーティリティ
bun add ulid
```

### Step 3: 設定ファイル作成・修正

- **`next.config.ts`**: `@opennextjs/cloudflare` 用の設定を追加
- **`wrangler.toml`**: D1 バインディング、compatibility_date などを設定
- **`drizzle.config.ts`**: D1 向け Drizzle 設定

### Step 4: DB スキーマ定義

- `src/db/schema.ts` — `books`, `user_books` テーブル + Better Auth 必須テーブル（`user`, `session`, `account`, `verification`）を Drizzle で定義
- `src/db/index.ts` — D1 クライアント初期化ヘルパー

### Step 5: 認証セットアップ

- `src/lib/auth.ts` — Better Auth サーバー設定（D1 + Drizzle アダプター）
- `src/lib/auth-client.ts` — Better Auth クライアントインスタンス
- `src/app/api/auth/[...all]/route.ts` — キャッチオール API ルート

### Step 6: ディレクトリ骨格の作成

- `src/app/(auth)/login/page.tsx` — プレースホルダー
- `src/app/(auth)/signup/page.tsx` — プレースホルダー
- `src/app/(main)/layout.tsx` — 認証チェック付きレイアウト（骨格）
- `src/app/(main)/books/page.tsx` — プレースホルダー
- `src/app/page.tsx` — `/books` へリダイレクト
- `src/types/index.ts` — 共通型定義（BookStatus 等）
- `.env.local` — テンプレート（BETTER_AUTH_SECRET 等）

### Step 7: 動作確認

- `bun run dev` でローカル起動確認
- TypeScript エラーがないことを確認

### 作成・変更するファイル一覧

| ファイル | 操作 |
|---------|------|
| `next.config.ts` | 修正 |
| `wrangler.toml` | 新規 |
| `drizzle.config.ts` | 新規 |
| `src/db/schema.ts` | 新規 |
| `src/db/index.ts` | 新規 |
| `src/lib/auth.ts` | 新規 |
| `src/lib/auth-client.ts` | 新規 |
| `src/app/api/auth/[...all]/route.ts` | 新規 |
| `src/app/layout.tsx` | 修正 |
| `src/app/page.tsx` | 修正 |
| `src/app/(auth)/login/page.tsx` | 新規 |
| `src/app/(auth)/signup/page.tsx` | 新規 |
| `src/app/(main)/layout.tsx` | 新規 |
| `src/app/(main)/books/page.tsx` | 新規 |
| `src/types/index.ts` | 新規 |
| `.env.local` | 新規 |

### 検証方法

- `bun run dev` でエラーなく起動すること
- ルートアクセス時に `/books` へリダイレクトされること
- `/api/auth` 系エンドポイントがレスポンスを返すこと
- `bunx drizzle-kit generate` でマイグレーションファイルが生成されること

---

## Phase 2: 認証 UI 実装

ログイン・サインアップフォームの実装、認証フロー完成。

---

## Phase 3: ISBN 検索 & 書籍登録

OpenBD / Google Books API との連携、書籍登録画面の実装。

---

## Phase 4: 積読リスト & ステータス管理

一覧表示、フィルタ、ステータス変更、削除機能の実装。

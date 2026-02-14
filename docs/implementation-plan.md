# tsundoc 実装計画

## 全体方針

要件定義書（`requirements.md`）とディレクトリ構成（`directory-structure.md`）に基づき、4 つの Phase に分けて段階的に実装する。

---

## Phase 1: プロジェクト初期化 ✅ 完了

Next.js プロジェクトの初期化と基盤セットアップ。

### Step 1: Next.js プロジェクト初期化 ✅

- `bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias` で初期化済み
- React Compiler（`babel-plugin-react-compiler`）を有効化済み

### Step 2: 追加パッケージのインストール ✅

- `@opennextjs/cloudflare`, `wrangler` — Cloudflare 対応
- `drizzle-orm`, `drizzle-kit` — ORM
- `better-auth` — 認証
- `ulid` — ID 生成

### Step 3: 設定ファイル作成・修正 ✅

- **`next.config.ts`**: `initOpenNextCloudflareForDev()` を追加
- **`wrangler.toml`**: D1 バインディング設定（`database_id` は要置換）
- **`drizzle.config.ts`**: SQLite dialect、`src/db/migrations` 出力先
- **`worker-configuration.d.ts`**: `bunx wrangler types --env-interface CloudflareEnv` で生成済み

### Step 4: DB スキーマ定義 ✅

- `src/db/schema.ts` — Better Auth テーブル（`user`, `session`, `account`, `verification`）+ アプリテーブル（`books`, `user_books`）
- `src/db/index.ts` — `getCloudflareContext()` 経由の `getDB()` ヘルパー

### Step 5: 認証セットアップ ✅

- `src/lib/auth.ts` — リクエストスコープの `getAuth()` 関数（D1 はリクエストごとにバインディング取得が必要なため）
- `src/lib/auth-client.ts` — `createAuthClient()` から `signIn`, `signUp`, `signOut`, `useSession` をエクスポート
- `src/app/api/auth/[...all]/route.ts` — GET/POST ハンドラ

### Step 6: ディレクトリ骨格の作成 ✅

- `src/app/page.tsx` — `/books` へリダイレクト
- `src/app/(auth)/login/page.tsx` — プレースホルダー
- `src/app/(auth)/signup/page.tsx` — プレースホルダー
- `src/app/(main)/layout.tsx` — ヘッダー + 認証チェック骨格（TODO）
- `src/app/(main)/books/page.tsx` — プレースホルダー
- `src/types/index.ts` — `BookStatus`, Drizzle 推論型
- `.env.local` — `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`

### Step 7: 動作確認 ✅

- `bun run dev` でエラーなく起動
- `GET /` → 307 で `/books` へリダイレクト
- `GET /login`, `GET /signup` → 200
- `GET /api/auth/ok` → 200

---

## Phase 2: 認証 UI 実装 ✅ 完了

ログイン・サインアップフォームの実装、認証フロー完成。

### Step 1: DB マイグレーション ✅

- `bunx drizzle-kit generate` でマイグレーション SQL を生成済み
- `bunx wrangler d1 migrations apply tsundoc-db --local` でローカル D1 にスキーマ適用済み
- `wrangler.toml` に `migrations_dir = "src/db/migrations"` を追加

### Step 2: ログインフォーム ✅

- `src/app/(auth)/login/page.tsx` — Client Component
  - メールアドレス + パスワード入力、`signIn.email()` で認証
  - `useSession()` で認証済みガード → `/books` へリダイレクト
  - バリデーション（空欄チェック）、日本語エラーメッセージ

### Step 3: サインアップフォーム ✅

- `src/app/(auth)/signup/page.tsx` — Client Component
  - 名前 + メール + パスワード + 確認入力、`signUp.email()` で登録
  - パスワード 8 文字以上チェック、確認一致チェック
  - 登録後 `signIn.email()` で自動ログイン → `/books` へリダイレクト

### Step 4: 認証チェック付きレイアウト ✅

- `src/app/(main)/layout.tsx` — Server Component
  - `getAuth().api.getSession({ headers })` でセッション検証
  - 未認証 → `/login` リダイレクト
  - ヘッダーにユーザー名 + `<LogoutButton />` 表示
- `src/components/logout-button.tsx` — 新規作成

---

## Phase 3: ISBN 検索 & 書籍登録 ✅ 完了

OpenBD / Google Books API との連携、書籍登録画面の実装。

### Step 1: 書籍情報 API クライアント ✅

- `src/lib/book-api.ts` — `BookInfo` 型、`validateISBN()` (ISBN-13 チェックディジット検証)、`searchByISBN()` (OpenBD → Google Books フォールバック)

### Step 2: ISBN 検索 API Route ✅

- `src/app/api/books/search/route.ts` — `GET /api/books/search?isbn=`
  - 認証チェック、ISBN バリデーション、書籍検索、`BookInfo` JSON 返却

### Step 3: 書籍登録ページ & Server Actions ✅

- `src/app/(main)/books/new/actions.ts` — `registerBook()` Server Action（book upsert + user_books 作成 + 重複チェック）
- `src/app/(main)/books/new/page.tsx` — Server Component ラッパー（`force-dynamic`）
- `src/app/(main)/books/new/new-book-form.tsx` — Client Component（ISBN 検索フォーム + プレビュー + 登録ボタン）

---

## Phase 4: 積読リスト & ステータス管理

一覧表示、フィルタ、ステータス変更、削除機能の実装。

### Step 1: 書籍一覧の Server Actions

- `src/app/(main)/books/actions.ts` を実装
  - `updateBookStatus(userBookId, status)` — ステータス更新
  - `deleteUserBook(userBookId)` — 書籍をリストから削除

### Step 2: 書籍一覧ページ

- `src/app/(main)/books/page.tsx` を実装
  - サーバーコンポーネントで `user_books` + `books` を JOIN して取得
  - ステータスフィルタ（全て / 未読 / 読書中 / 読了）を URL search params で管理
  - 書籍登録画面への導線ボタン

### Step 3: UI コンポーネント

- `src/components/book-card.tsx` — 書籍カード（表紙画像・タイトル・著者・ステータス・操作ボタン）
- `src/components/book-list.tsx` — 書籍カードのリスト表示
- `src/components/status-badge.tsx` — ステータスバッジ（色分け）

### Step 4: ステータス変更 & 削除

- 書籍カード上のステータスセレクトで `updateBookStatus` を呼び出し
- 削除ボタンで確認後 `deleteUserBook` を呼び出し
- `revalidatePath` で一覧を再検証

### Step 5: レスポンシブ対応

- モバイルファーストのレイアウト調整
- カード表示のレスポンシブグリッド

### Step 6: 動作確認

- 書籍一覧が表示される
- フィルタタブでステータス別に絞り込める
- ステータス変更が即時反映される
- 削除後に一覧から消える
- モバイル・デスクトップで適切に表示される

### 作成・変更するファイル一覧

| ファイル | 操作 |
|---------|------|
| `src/app/(main)/books/page.tsx` | 修正 |
| `src/app/(main)/books/actions.ts` | 新規 |
| `src/components/book-card.tsx` | 新規 |
| `src/components/book-list.tsx` | 新規 |
| `src/components/status-badge.tsx` | 新規 |

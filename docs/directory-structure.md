# tsundoc ディレクトリ構成

```
tsundoc/
├── docs/                              # ドキュメント
│   ├── requirements.md
│   └── directory-structure.md
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # ルートレイアウト
│   │   ├── page.tsx                   # トップ → リダイレクト
│   │   ├── (auth)/                    # 認証系ページ（レイアウトグループ）
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (main)/                    # 認証済みページ（レイアウトグループ）
│   │   │   ├── layout.tsx             # 認証チェック付きレイアウト
│   │   │   ├── books/
│   │   │   │   ├── page.tsx           # 積読リスト（メイン画面）
│   │   │   │   └── actions.ts         # 書籍ステータス更新・削除の Server Actions
│   │   │   └── books/new/
│   │   │       ├── page.tsx           # 書籍登録
│   │   │       └── actions.ts         # 書籍登録の Server Actions
│   │   └── api/
│   │       ├── auth/[...all]/
│   │       │   └── route.ts           # Better Auth ハンドラ
│   │       └── books/
│   │           └── search/
│   │               └── route.ts       # ISBN 検索 API（OpenBD / Google Books）
│   ├── db/
│   │   ├── schema.ts                  # Drizzle スキーマ定義
│   │   ├── index.ts                   # D1 クライアント初期化
│   │   └── migrations/                # Drizzle マイグレーションファイル
│   ├── lib/
│   │   ├── auth.ts                    # Better Auth サーバー設定
│   │   ├── auth-client.ts             # Better Auth クライアント
│   │   └── book-api.ts               # OpenBD / Google Books API クライアント
│   ├── components/
│   │   ├── ui/                        # 汎用 UI コンポーネント
│   │   ├── book-card.tsx              # 書籍カード
│   │   ├── book-list.tsx              # 書籍一覧
│   │   ├── isbn-search-form.tsx       # ISBN 検索フォーム
│   │   └── status-badge.tsx           # ステータスバッジ
│   └── types/
│       └── index.ts                   # 共通型定義
├── public/                            # 静的ファイル
├── drizzle.config.ts                  # Drizzle 設定
├── next.config.ts                     # Next.js 設定
├── wrangler.toml                      # Cloudflare 設定
├── package.json
├── tsconfig.json
└── .env.local                         # ローカル環境変数（gitignore 対象）
```

## 設計ポイント

### Route Groups による関心の分離

- **`(auth)/`**: ログイン・新規登録など未認証ユーザー向けページ
- **`(main)/`**: 認証済みユーザー向けページ。共通の `layout.tsx` で認証チェックを行い、未認証ユーザーをログインページへリダイレクト

### Server Actions の配置

書籍の CRUD 操作（登録・ステータス更新・削除）は API Route ではなく Server Actions で実装する。各 `actions.ts` は対応するページの近くに配置し、関連するロジックを見つけやすくする。

- `src/app/(main)/books/actions.ts` — ステータス更新、削除
- `src/app/(main)/books/new/actions.ts` — 書籍登録

### API Routes

API Route は以下の 2 種類のみ:

- **`/api/auth/[...all]`** — Better Auth のキャッチオールハンドラ。認証のエンドポイントを一括で処理
- **`/api/books/search`** — ISBN 検索。クライアントから呼び出し、OpenBD → Google Books の順にフォールバック検索

### `src/db/`

Drizzle ORM 関連ファイルを集約。`schema.ts` でテーブル定義、`index.ts` で D1 クライアントの初期化、`migrations/` にマイグレーションファイルを配置。

### `src/lib/`

ページやコンポーネントから利用される共通ロジック。認証設定と外部 API クライアントを配置。

### `src/components/`

再利用可能なコンポーネント。`ui/` にボタン・入力欄などの汎用コンポーネント、ドメイン固有のコンポーネント（書籍カード等）はフラットに配置。

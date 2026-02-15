# tsundoc 改善計画

## Context

tsundocのMVP（認証・ISBN検索・ステータス管理・削除）が完成している。次のステップとして、メモ機能、手動書籍登録、書籍詳細ページ、検索・ソート機能の4つを追加し、実用性を高める。

## 実装順序と依存関係

```
1. メモ機能（DBスキーマ済み）
2. 手動書籍登録（/books/new を拡張）
3. 書籍詳細ページ（/books/[id] 新規、メモ編集のメインUIに）
4. 検索・ソート（一覧ページを拡張）
```

---

## Phase 1: メモ機能

DBの `user_books.memo` カラムは既に存在。UIとServer Actionの追加のみ。

### 変更ファイル

- **`src/app/(main)/books/actions.ts`** — `updateMemo` Server Action を追加
  - 引数: `userBookId: string, memo: string`
  - 所有権チェック → `memo` と `updatedAt` を更新 → `revalidatePath("/books")`

- **`src/components/book-card.tsx`** — メモ表示・簡易編集UIを追加
  - メモがある場合はカード下部に表示（truncate）
  - 「メモ」ボタンでテキストエリアをトグル表示
  - 保存時に `updateMemo` を呼び出し

- **`src/app/(main)/books/page.tsx`** — クエリに `memo` を追加
  - `select` に `userBooks.memo` を含める

- **`src/components/book-list.tsx`** — `BookItem` 型に `memo` を追加

---

## Phase 2: 手動書籍登録

ISBNのない書籍をタイトル・著者の手入力で登録できるようにする。

### 変更ファイル

- **`src/app/(main)/books/new/new-book-form.tsx`** — タブで「ISBN検索」と「手動入力」を切り替え
  - 手動入力フォーム: タイトル（必須）、著者、出版社
  - 登録時は `registerBookManual` Server Action を呼び出し

- **`src/app/(main)/books/new/actions.ts`** — `registerBookManual` を追加
  - 引数: `{ title: string; author?: string; publisher?: string }`
  - ISBN なしで `books` テーブルに insert（isbn = null）
  - `user_books` に紐付け（status: "unread"）
  - 重複チェック: ISBNがないため、同一ユーザーの同一タイトル+著者での重複は警告程度に留める（登録は許可）

---

## Phase 3: 書籍詳細ページ

`/books/[id]` で書籍の詳細表示とメモ編集を行うページを追加。

### 新規ファイル

- **`src/app/(main)/books/[id]/page.tsx`** — Server Component
  - `userBooks` + `books` を JOIN して取得（所有権チェック付き）
  - 書籍情報の全項目表示（カバー画像、タイトル、著者、出版社、ISBN、ステータス、登録日）
  - メモ編集用のクライアントコンポーネントを配置
  - 戻るリンク（← 積読リスト）

- **`src/app/(main)/books/[id]/memo-editor.tsx`** — Client Component
  - テキストエリアでメモを編集・保存
  - `updateMemo` Server Action を利用（Phase 1で作成済み）

- **`src/app/(main)/books/[id]/actions.ts`** — 詳細ページ用 Server Actions（必要に応じて）

### 変更ファイル

- **`src/components/book-card.tsx`** — カードのタイトルを `/books/[id]` へのリンクに変更
- **`src/app/(main)/books/actions.ts`** — `revalidatePath` に `/books/[id]` パターンも追加

---

## Phase 4: 検索・ソート機能

一覧ページにテキスト検索とソート機能を追加。

### 変更ファイル

- **`src/app/(main)/books/page.tsx`** — 検索・ソートUIとクエリロジック
  - 検索パラメータ: `?q=検索語&sort=title|created|updated&status=unread`
  - 検索: タイトル・著者に対して `LIKE '%keyword%'` でフィルタ（Drizzle の `like` / `or`）
  - ソート: `orderBy` を動的に切り替え（デフォルト: 登録日の新しい順）
  - フィルタリングをDB側で処理するよう変更（現在はJS側でfilter）

- **`src/components/book-search-bar.tsx`** — 新規 Client Component
  - 検索入力フィールド（デバウンス付き、`useRouter().replace` でURLパラメータ更新）
  - ソートドロップダウン（登録日順 / タイトル順 / 更新日順）

---

## 検証方法

1. `npm run dev` でローカルサーバー起動
2. 各機能を手動テスト:
   - メモ: 書籍カードからメモ追加・編集・保存を確認
   - 手動登録: ISBNなしでタイトル入力 → 登録 → 一覧に表示を確認
   - 詳細ページ: カードのタイトルクリック → 詳細ページ表示 → メモ編集を確認
   - 検索: テキスト入力で一覧がフィルタされることを確認
   - ソート: ドロップダウン切り替えで並び順が変わることを確認
3. `npm run build` でビルドエラーがないことを確認
4. `npm run lint` でlintエラーがないことを確認

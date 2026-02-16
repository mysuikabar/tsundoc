import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { getAuth } from "@/lib/auth";
import { getDB } from "@/db";
import { userBooks, books } from "@/db/schema";
import { BookList } from "@/components/book-list";
import type { BookStatus } from "@/types";

const tabs: { label: string; value: BookStatus | null }[] = [
  { label: "すべて", value: null },
  { label: "未読", value: "unread" },
  { label: "読書中", value: "reading" },
  { label: "読了", value: "done" },
];

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });
  if (!session) return null;

  const { status } = await searchParams;
  const activeStatus = (["unread", "reading", "done"].includes(status ?? "") ? status : null) as BookStatus | null;

  const db = getDB();
  const conditions = [eq(userBooks.userId, session.user.id)];
  if (activeStatus) {
    conditions.push(eq(userBooks.status, activeStatus));
  }

  const rows = await db
    .select({
      userBookId: userBooks.id,
      title: books.title,
      author: books.author,
      coverUrl: books.coverUrl,
      status: userBooks.status,
    })
    .from(userBooks)
    .innerJoin(books, eq(userBooks.bookId, books.id))
    .where(and(...conditions));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">マイ本棚</h1>
        <Link
          href="/books/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          書籍を追加
        </Link>
      </div>

      <nav className="flex gap-1 border-b border-border">
        {tabs.map((tab) => {
          const isActive = tab.value === activeStatus;
          const href = tab.value ? `/books?status=${tab.value}` : "/books";
          return (
            <Link
              key={tab.label}
              href={href}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <BookList books={rows as { userBookId: string; title: string; author: string | null; coverUrl: string | null; status: BookStatus }[]} />
    </div>
  );
}

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
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
    .where(eq(userBooks.userId, session.user.id));

  const filtered = activeStatus
    ? rows.filter((r) => r.status === activeStatus)
    : rows;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">積読リスト</h2>
        <Link
          href="/books/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          書籍を追加
        </Link>
      </div>

      <nav className="flex gap-1">
        {tabs.map((tab) => {
          const isActive = tab.value === activeStatus;
          const href = tab.value ? `/books?status=${tab.value}` : "/books";
          return (
            <Link
              key={tab.label}
              href={href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <BookList books={filtered as { userBookId: string; title: string; author: string | null; coverUrl: string | null; status: BookStatus }[]} />
    </div>
  );
}

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { getAuth } from "@/lib/auth";
import { getDB } from "@/db";
import { userBooks, books } from "@/db/schema";
import { BookDetail } from "@/components/book-detail";
import type { BookStatus } from "@/types";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getAuth().api.getSession({
    headers: await headers(),
  });
  if (!session) return notFound();

  const db = getDB();
  const [row] = await db
    .select({
      userBookId: userBooks.id,
      title: books.title,
      author: books.author,
      publisher: books.publisher,
      isbn: books.isbn,
      coverUrl: books.coverUrl,
      status: userBooks.status,
      memo: userBooks.memo,
      createdAt: userBooks.createdAt,
      updatedAt: userBooks.updatedAt,
    })
    .from(userBooks)
    .innerJoin(books, eq(userBooks.bookId, books.id))
    .where(and(eq(userBooks.id, id), eq(userBooks.userId, session.user.id)));

  if (!row) return notFound();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href="/books"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        一覧に戻る
      </Link>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <BookDetail
          title={row.title}
          author={row.author}
          publisher={row.publisher}
          isbn={row.isbn}
          coverUrl={row.coverUrl}
          status={row.status as BookStatus}
          memo={row.memo}
          createdAt={row.createdAt}
          updatedAt={row.updatedAt}
        />
      </div>
    </div>
  );
}

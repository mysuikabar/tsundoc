import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { getDB } from "@/db";
import { userBooks, books } from "@/db/schema";
import { BookDetailModal } from "@/components/book-detail-modal";
import { BookDetail } from "@/components/book-detail";
import type { BookStatus } from "@/types";

export default async function InterceptedBookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return notFound();

  const db = await getDB();
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
    <BookDetailModal>
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
    </BookDetailModal>
  );
}

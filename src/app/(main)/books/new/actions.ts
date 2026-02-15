"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { getAuth } from "@/lib/auth";
import { getDB } from "@/db";
import { books, userBooks } from "@/db/schema";
import type { BookInfo } from "@/lib/book-api";

export async function registerBook(
  bookInfo: BookInfo,
): Promise<{ error?: string }> {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "ログインしてください" };
  }

  const db = getDB();
  const userId = session.user.id;

  // Upsert book by ISBN (insert or get existing)
  const bookId = ulid();
  await db
    .insert(books)
    .values({
      id: bookId,
      isbn: bookInfo.isbn,
      title: bookInfo.title,
      author: bookInfo.author,
      publisher: bookInfo.publisher,
      coverUrl: bookInfo.coverUrl,
      createdAt: new Date(),
    })
    .onConflictDoNothing({ target: books.isbn });

  const existingBook = await db.query.books.findFirst({
    where: eq(books.isbn, bookInfo.isbn),
  });

  if (!existingBook) {
    return { error: "書籍の登録に失敗しました" };
  }

  // Insert user-book link; unique constraint prevents duplicates
  const now = new Date();
  try {
    await db.insert(userBooks).values({
      id: ulid(),
      userId,
      bookId: existingBook.id,
      status: "unread",
      createdAt: now,
      updatedAt: now,
    });
  } catch {
    return { error: "この書籍は既に登録されています" };
  }

  return {};
}

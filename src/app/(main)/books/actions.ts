"use server";

import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuth } from "@/lib/auth";
import { getDB } from "@/db";
import { userBooks } from "@/db/schema";
import type { BookStatus } from "@/types";

export async function updateBookStatus(
  userBookId: string,
  status: BookStatus,
): Promise<{ error?: string }> {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "ログインしてください" };
  }

  const db = await getDB();

  const record = await db.query.userBooks.findFirst({
    where: and(eq(userBooks.id, userBookId), eq(userBooks.userId, session.user.id)),
  });

  if (!record) {
    return { error: "書籍が見つかりません" };
  }

  await db
    .update(userBooks)
    .set({ status, updatedAt: new Date() })
    .where(eq(userBooks.id, userBookId));

  revalidatePath("/books");
  return {};
}

export async function deleteUserBook(
  userBookId: string,
): Promise<{ error?: string }> {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "ログインしてください" };
  }

  const db = await getDB();

  const record = await db.query.userBooks.findFirst({
    where: and(eq(userBooks.id, userBookId), eq(userBooks.userId, session.user.id)),
  });

  if (!record) {
    return { error: "書籍が見つかりません" };
  }

  await db.delete(userBooks).where(eq(userBooks.id, userBookId));

  revalidatePath("/books");
  return {};
}

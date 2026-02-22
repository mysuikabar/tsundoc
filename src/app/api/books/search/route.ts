import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { normalizeISBN, searchByISBN, validateISBN } from "@/lib/book-api";

export async function GET(req: Request) {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const isbn = normalizeISBN(searchParams.get("isbn") ?? "");

  if (!validateISBN(isbn)) {
    return NextResponse.json(
      { error: "有効なISBN-13を入力してください" },
      { status: 400 },
    );
  }

  const book = await searchByISBN(isbn);
  if (!book) {
    return NextResponse.json(
      { error: "書籍が見つかりませんでした" },
      { status: 404 },
    );
  }

  return NextResponse.json(book);
}

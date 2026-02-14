"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerBook } from "./actions";
import type { BookInfo } from "@/lib/book-api";

export function NewBookForm() {
  const router = useRouter();
  const [isbn, setIsbn] = useState("");
  const [book, setBook] = useState<BookInfo | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [registering, startRegister] = useTransition();

  async function handleSearch() {
    setError("");
    setBook(null);
    setSearching(true);

    try {
      const res = await fetch(
        `/api/books/search?isbn=${encodeURIComponent(isbn)}`,
      );
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "検索に失敗しました");
        return;
      }
      setBook(await res.json());
    } catch {
      setError("検索中にエラーが発生しました");
    } finally {
      setSearching(false);
    }
  }

  function handleRegister() {
    if (!book) return;

    startRegister(async () => {
      const result = await registerBook(book);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/books");
      }
    });
  }

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-6 text-xl font-bold">書籍を登録</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="ISBN-13 を入力"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          onClick={handleSearch}
          disabled={searching || !isbn}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {searching ? "検索中…" : "検索"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {book && (
        <div className="mt-6 rounded border p-4">
          <div className="flex gap-4">
            {book.coverUrl && (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="h-32 w-auto object-contain"
              />
            )}
            <div className="flex-1">
              <p className="font-bold">{book.title}</p>
              {book.author && (
                <p className="mt-1 text-sm text-gray-600">{book.author}</p>
              )}
              {book.publisher && (
                <p className="text-sm text-gray-600">{book.publisher}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">ISBN: {book.isbn}</p>
            </div>
          </div>
          <button
            onClick={handleRegister}
            disabled={registering}
            className="mt-4 w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {registering ? "登録中…" : "登録する"}
          </button>
        </div>
      )}
    </div>
  );
}

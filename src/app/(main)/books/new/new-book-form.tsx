"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
        router.back();
      }
    });
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="ISBN-13 を入力"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 rounded-lg border border-border bg-card px-3 py-2 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={handleSearch}
          disabled={searching || !isbn}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {searching ? "検索中…" : "検索"}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {book && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex gap-4">
            {book.coverUrl && (
              <Image
                src={book.coverUrl}
                alt={book.title}
                width={80}
                height={128}
                className="h-32 w-auto rounded-lg object-contain"
              />
            )}
            <div className="flex-1">
              <p className="font-bold">{book.title}</p>
              {book.author && (
                <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
              )}
              {book.publisher && (
                <p className="text-sm text-muted-foreground">{book.publisher}</p>
              )}
              <p className="mt-1 font-mono text-xs text-muted-foreground">ISBN: {book.isbn}</p>
            </div>
          </div>
          <button
            onClick={handleRegister}
            disabled={registering}
            className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {registering ? "登録中…" : "登録する"}
          </button>
        </div>
      )}
    </div>
  );
}

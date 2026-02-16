"use client";

import { useTransition } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { updateBookStatus, deleteUserBook } from "@/app/(main)/books/actions";
import type { BookStatus } from "@/types";

type BookCardProps = {
  userBookId: string;
  title: string;
  author: string | null;
  coverUrl: string | null;
  status: BookStatus;
};

export function BookCard({ userBookId, title, author, coverUrl, status }: BookCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = e.target.value as BookStatus;
    startTransition(async () => {
      await updateBookStatus(userBookId, newStatus);
    });
  }

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`「${title}」を削除しますか？`)) return;
    startTransition(async () => {
      await deleteUserBook(userBookId);
    });
  }

  return (
    <Link
      href={`/books/${userBookId}`}
      className={`block cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${isPending ? "opacity-50" : ""}`}
    >
      <div className="flex gap-4">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="h-32 w-24 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-32 w-24 shrink-0 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
            No Image
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="truncate font-semibold">{title}</h3>
          {author && <p className="truncate text-sm text-muted-foreground">{author}</p>}
          <div className="mt-1">
            <StatusBadge status={status} />
          </div>
          <div className="mt-auto flex items-center gap-2 pt-2">
            <div onClick={(e) => e.preventDefault()} onMouseDown={(e) => e.stopPropagation()}>
              <select
                value={status}
                onChange={handleStatusChange}
                disabled={isPending}
                className="rounded-lg border border-border bg-card px-2 py-1 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="unread">未読</option>
                <option value="reading">読書中</option>
                <option value="done">読了</option>
              </select>
            </div>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
              aria-label="削除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

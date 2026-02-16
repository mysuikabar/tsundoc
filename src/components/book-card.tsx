"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
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
      className={`group relative block cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${isPending ? "opacity-50" : ""}`}
    >
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="absolute top-2 right-2 z-10 rounded-full bg-card p-1.5 text-muted-foreground shadow-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-destructive"
        aria-label="削除"
      >
        <Trash2 className="h-4 w-4" />
      </button>
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
          </div>
        </div>
      </div>
    </Link>
  );
}

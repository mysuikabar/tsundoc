"use client";

import { useTransition } from "react";
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
    const newStatus = e.target.value as BookStatus;
    startTransition(async () => {
      await updateBookStatus(userBookId, newStatus);
    });
  }

  function handleDelete() {
    if (!window.confirm(`「${title}」を削除しますか？`)) return;
    startTransition(async () => {
      await deleteUserBook(userBookId);
    });
  }

  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm ${isPending ? "opacity-50" : ""}`}>
      <div className="flex gap-4">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="h-32 w-24 shrink-0 rounded object-cover"
          />
        ) : (
          <div className="flex h-32 w-24 shrink-0 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
            No Image
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="truncate font-semibold">{title}</h3>
          {author && <p className="truncate text-sm text-gray-600">{author}</p>}
          <div className="mt-1">
            <StatusBadge status={status} />
          </div>
          <div className="mt-auto flex items-center gap-2 pt-2">
            <select
              value={status}
              onChange={handleStatusChange}
              disabled={isPending}
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="unread">未読</option>
              <option value="reading">読書中</option>
              <option value="done">読了</option>
            </select>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="rounded border border-red-200 px-2 py-1 text-sm text-red-600 hover:bg-red-50"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

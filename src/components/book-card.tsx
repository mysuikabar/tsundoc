"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { updateBookStatus, deleteUserBook } from "@/app/(main)/books/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleStatusClick(e: React.MouseEvent<HTMLButtonElement>, newStatus: BookStatus) {
    e.preventDefault();
    e.stopPropagation();
    if (newStatus === status) return;
    startTransition(async () => {
      await updateBookStatus(userBookId, newStatus);
    });
  }

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  }

  function handleDeleteConfirm() {
    startTransition(async () => {
      await deleteUserBook(userBookId);
    });
  }

  return (
    <>
    <Link
      href={`/books/${userBookId}`}
      className={`group relative block cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${isPending ? "opacity-50" : ""}`}
    >
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="absolute top-2 right-2 z-10 rounded-full bg-card p-1.5 text-muted-foreground shadow-sm opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100 hover:bg-red-50 hover:text-destructive"
        aria-label="削除"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <div className="flex gap-4">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            width={96}
            height={128}
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
          <div className={`mt-auto flex gap-1 pt-2 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
            {([
              { value: "unread", label: "未読", activeClass: "border-gray-400 bg-gray-100 text-gray-700" },
              { value: "reading", label: "読書中", activeClass: "border-blue-400 bg-blue-50 text-blue-700" },
              { value: "done", label: "読了", activeClass: "border-emerald-400 bg-emerald-50 text-emerald-700" },
            ] as const).map(({ value, label, activeClass }) => (
              <button
                key={value}
                onClick={(e) => handleStatusClick(e, value)}
                disabled={isPending}
                className={`rounded-lg border px-2 py-0.5 text-xs font-medium transition-colors ${
                  status === value
                    ? activeClass
                    : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Link>
    <ConfirmDialog
      open={showDeleteConfirm}
      title="書籍の削除"
      message={`「${title}」を削除しますか？`}
      onConfirm={handleDeleteConfirm}
      onCancel={() => setShowDeleteConfirm(false)}
      isPending={isPending}
    />
    </>
  );
}

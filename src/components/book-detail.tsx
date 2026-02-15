import { StatusBadge } from "@/components/status-badge";
import type { BookStatus } from "@/types";

type BookDetailProps = {
  title: string;
  author: string | null;
  publisher: string | null;
  isbn: string | null;
  coverUrl: string | null;
  status: BookStatus;
  memo: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function formatDate(date: Date) {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BookDetail({
  title,
  author,
  publisher,
  isbn,
  coverUrl,
  status,
  memo,
  createdAt,
  updatedAt,
}: BookDetailProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="shrink-0">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="h-48 w-36 rounded-lg object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-48 w-36 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-bold">{title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          {author && (
            <div>
              <dt className="text-gray-500">著者</dt>
              <dd>{author}</dd>
            </div>
          )}
          {publisher && (
            <div>
              <dt className="text-gray-500">出版社</dt>
              <dd>{publisher}</dd>
            </div>
          )}
          {isbn && (
            <div>
              <dt className="text-gray-500">ISBN</dt>
              <dd className="font-mono">{isbn}</dd>
            </div>
          )}
          <div>
            <dt className="text-gray-500">ステータス</dt>
            <dd className="mt-0.5">
              <StatusBadge status={status} />
            </dd>
          </div>
          {memo && (
            <div>
              <dt className="text-gray-500">メモ</dt>
              <dd className="whitespace-pre-wrap">{memo}</dd>
            </div>
          )}
          <div>
            <dt className="text-gray-500">登録日</dt>
            <dd>{formatDate(createdAt)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">更新日</dt>
            <dd>{formatDate(updatedAt)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

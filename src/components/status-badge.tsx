import type { BookStatus } from "@/types";

const config: Record<BookStatus, { label: string; className: string }> = {
  unread: { label: "未読", className: "bg-gray-100 text-gray-700" },
  reading: { label: "読書中", className: "bg-blue-100 text-blue-700" },
  done: { label: "読了", className: "bg-green-100 text-green-700" },
};

export function StatusBadge({ status }: { status: BookStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

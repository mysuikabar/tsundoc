import type { BookStatus } from "@/types";

const config: Record<BookStatus, { label: string; className: string }> = {
  unread: { label: "未読", className: "bg-gray-100 text-gray-600" },
  reading: { label: "読書中", className: "bg-blue-50 text-blue-600" },
  done: { label: "読了", className: "bg-emerald-50 text-emerald-600" },
};

export function StatusBadge({ status }: { status: BookStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

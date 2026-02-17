"use client";

import { useRef, useEffect } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  isPending?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "削除",
  isPending = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      onCancel();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={onCancel}
      className="m-auto w-full max-w-sm rounded-2xl bg-card p-0 shadow-2xl"
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 disabled:opacity-50"
          >
            {isPending ? "削除中..." : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

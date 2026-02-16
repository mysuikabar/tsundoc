import { BookDetailModal } from "@/components/book-detail-modal";
import { NewBookForm } from "@/app/(main)/books/new/new-book-form";

export const dynamic = "force-dynamic";

export default function InterceptedNewBookPage() {
  return (
    <BookDetailModal>
      <h2 className="mb-4 text-lg font-bold text-foreground">書籍を登録</h2>
      <NewBookForm />
    </BookDetailModal>
  );
}

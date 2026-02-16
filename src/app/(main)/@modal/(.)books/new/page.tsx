import { BookDetailModal } from "@/components/book-detail-modal";
import { NewBookForm } from "@/app/(main)/books/new/new-book-form";

export default function InterceptedNewBookPage() {
  return (
    <BookDetailModal title="書籍を登録">
      <NewBookForm />
    </BookDetailModal>
  );
}

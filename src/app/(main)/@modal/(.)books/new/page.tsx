import { BookDetailModal } from "@/components/book-detail-modal";
import { NewBookForm } from "@/app/(main)/books/new/new-book-form";

export const dynamic = "force-dynamic";

export default function InterceptedNewBookPage() {
  return (
    <BookDetailModal>
      <NewBookForm />
    </BookDetailModal>
  );
}

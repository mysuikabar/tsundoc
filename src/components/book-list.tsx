import { BookCard } from "@/components/book-card";
import type { BookStatus } from "@/types";

type BookItem = {
  userBookId: string;
  title: string;
  author: string | null;
  coverUrl: string | null;
  status: BookStatus;
};

export function BookList({ books }: { books: BookItem[] }) {
  if (books.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">書籍が登録されていません</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.userBookId} {...book} />
      ))}
    </div>
  );
}

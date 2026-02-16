import { NewBookForm } from "./new-book-form";

export const dynamic = "force-dynamic";

export default function NewBookPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">書籍を登録</h2>
      <NewBookForm />
    </div>
  );
}

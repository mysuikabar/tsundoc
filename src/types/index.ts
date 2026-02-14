import type { InferSelectModel } from "drizzle-orm";
import type { user, books, userBooks } from "@/db/schema";

export type BookStatus = "unread" | "reading" | "done";

export type User = InferSelectModel<typeof user>;
export type Book = InferSelectModel<typeof books>;
export type UserBook = InferSelectModel<typeof userBooks>;

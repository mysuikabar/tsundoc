export type BookInfo = {
  isbn: string;
  title: string;
  author: string | null;
  publisher: string | null;
  coverUrl: string | null;
};

export function ensureHttps(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/^http:\/\//, "https://");
}

export function normalizeISBN(isbn: string): string {
  return isbn.replace(/[-\s]/g, "");
}

export function validateISBN(isbn: string): boolean {
  if (!/^\d{13}$/.test(isbn)) return false;
  const sum = isbn
    .split("")
    .reduce((acc, ch, i) => acc + Number(ch) * (i % 2 === 0 ? 1 : 3), 0);
  return sum % 10 === 0;
}

export async function searchByISBN(isbn: string): Promise<BookInfo | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}${apiKey ? `&key=${apiKey}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  const item = data?.items?.[0];
  if (!item) return null;

  const info = item.volumeInfo;
  if (!info?.title) return null;

  const coverUrl = ensureHttps(info.imageLinks?.thumbnail ?? null);

  return {
    isbn,
    title: info.title,
    author: info.authors?.join(", ") ?? null,
    publisher: info.publisher ?? null,
    coverUrl,
  };
}

export async function searchByKeyword(title: string, author: string): Promise<BookInfo[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const parts: string[] = [];
  if (title.trim()) parts.push(`intitle:${title.trim()}`);
  if (author.trim()) parts.push(`inauthor:${author.trim()}`);
  const query = parts.join("+");
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10${apiKey ? `&key=${apiKey}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  if (!data?.items) return [];

  const results: BookInfo[] = [];
  for (const item of data.items) {
    const info = item.volumeInfo;
    if (!info?.title) continue;
    const isbn13Entry = info.industryIdentifiers?.find(
      (id: { type: string; identifier: string }) => id.type === "ISBN_13",
    );
    if (!isbn13Entry) continue;
    results.push({
      isbn: isbn13Entry.identifier,
      title: info.title,
      author: info.authors?.join(", ") ?? null,
      publisher: info.publisher ?? null,
      coverUrl: ensureHttps(info.imageLinks?.thumbnail ?? null),
    });
  }
  return results;
}

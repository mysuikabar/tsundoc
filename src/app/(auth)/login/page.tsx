"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { signIn, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isPending) return null;

  if (session) {
    router.push("/books");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);
    const { error: authError } = await signIn.email({
      email,
      password,
      callbackURL: "/books",
    });

    if (authError) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
      return;
    }

    router.push("/books");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="flex items-center justify-center gap-1.5 text-2xl font-bold text-primary"><BookOpen className="size-6" />tsundoc</h1>
          <p className="mt-1 text-sm text-muted-foreground">積読管理アプリ</p>
        </div>
        <div className="rounded-2xl bg-card p-8 shadow-lg">
          <h2 className="mb-6 text-xl font-bold text-center">ログイン</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="font-medium text-primary hover:text-primary-hover">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}

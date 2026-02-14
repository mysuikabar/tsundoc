"use client";

import { signOut } from "@/lib/auth-client";

export function LogoutButton() {
  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      ログアウト
    </button>
  );
}

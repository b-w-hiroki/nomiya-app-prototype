"use client";

import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-[1000] bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 shrink-0 text-accent" />
          <h1 className="truncate text-xl font-bold text-gray-900">ハマベロ</h1>
        </Link>
        <nav className="flex shrink-0 items-center gap-4 sm:gap-6">
          <Link
            href="/bar"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-accent"
          >
            Barモード
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-accent"
          >
            管理
          </Link>
        </nav>
      </div>
    </header>
  );
}

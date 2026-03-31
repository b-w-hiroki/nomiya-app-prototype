"use client";

import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-bold text-gray-900">ハマベロ</h1>
          </Link>
          <Link
            href="/admin"
            className="text-sm text-gray-600 hover:text-accent transition-colors"
          >
            管理画面
          </Link>
          <Link
            href="/bar"
            className="text-sm text-gray-600 hover:text-accent transition-colors"
          >
            Barモード
          </Link>
        </div>
      </div>
    </header>
  );
}

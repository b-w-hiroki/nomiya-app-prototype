"use client";

import { useMemo, useState } from "react";
import BarCard from "@/components/BarCard";
import BarMapMock from "@/components/BarMapMock";
import { BAR_SPOTS } from "@/lib/barMock";
import { BarPriceRange, BarVibe } from "@/types/bar";

type Filter = "all" | "yes" | "no";

export default function BarModePage() {
  const [price, setPrice] = useState<BarPriceRange | "all">("all");
  const [vibe, setVibe] = useState<BarVibe | "all">("all");
  const [beginner, setBeginner] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return BAR_SPOTS.filter((bar) => {
      const byPrice = price === "all" || bar.priceRange === price;
      const byVibe = vibe === "all" || bar.vibe === vibe;
      const byBeginner =
        beginner === "all" ||
        (beginner === "yes" && bar.beginnerFriendly) ||
        (beginner === "no" && !bar.beginnerFriendly);
      return byPrice && byVibe && byBeginner;
    });
  }, [price, vibe, beginner]);

  const sorted = useMemo(() => {
    if (!selectedId) return filtered;
    const selected = filtered.find((v) => v.id === selectedId);
    if (!selected) return filtered;
    const rest = filtered.filter((v) => v.id !== selectedId);
    return [selected, ...rest];
  }, [filtered, selectedId]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Barモード（モックアップ）</h2>
        <p className="mt-2 text-sm text-gray-600">
          入りやすさ・雰囲気でBarを探せる地域マップの試作画面です。
        </p>
      </div>

      <section className="mb-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <select
          value={price}
          onChange={(e) => setPrice(e.target.value as BarPriceRange | "all")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">価格帯: すべて</option>
          <option value="low">価格帯: 低め</option>
          <option value="mid">価格帯: 中間</option>
          <option value="high">価格帯: 高め</option>
        </select>

        <select
          value={vibe}
          onChange={(e) => setVibe(e.target.value as BarVibe | "all")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">雰囲気: すべて</option>
          <option value="quiet">雰囲気: 静か</option>
          <option value="casual">雰囲気: カジュアル</option>
          <option value="lively">雰囲気: にぎやか</option>
        </select>

        <select
          value={beginner}
          onChange={(e) => setBeginner(e.target.value as Filter)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">初心者向け: すべて</option>
          <option value="yes">初心者向け: はい</option>
          <option value="no">初心者向け: いいえ</option>
        </select>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <BarMapMock bars={filtered} selectedId={selectedId} onSelect={setSelectedId} />

        <section className="space-y-3">
          <p className="text-sm text-gray-600">該当件数: {filtered.length}件</p>
          {sorted.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
              条件に一致するBarがありません。
            </div>
          ) : (
            sorted.map((bar) => <BarCard key={bar.id} bar={bar} />)
          )}
        </section>
      </div>
    </div>
  );
}

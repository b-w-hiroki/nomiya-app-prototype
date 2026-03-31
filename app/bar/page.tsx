"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import BarCard from "@/components/BarCard";
import { BAR_SPOTS } from "@/lib/barMock";
import { BarPriceRange, BarVibe } from "@/types/bar";
import { MapPin, SlidersHorizontal, Wine } from "lucide-react";

const BarMap = dynamic(() => import("@/components/BarMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(54vh,560px)] min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-500">
      地図を読み込み中…
    </div>
  ),
});

type Filter = "all" | "yes" | "no";

const selectClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25";

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

  useEffect(() => {
    if (selectedId && !filtered.some((b) => b.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  const sorted = useMemo(() => {
    if (!selectedId) return filtered;
    const selected = filtered.find((v) => v.id === selectedId);
    if (!selected) return filtered;
    const rest = filtered.filter((v) => v.id !== selectedId);
    return [selected, ...rest];
  }, [filtered, selectedId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-12">
      <header className="mb-8 overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white via-orange-50/50 to-white px-5 py-6 shadow-sm ring-1 ring-black/[0.03] sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-orange-200/60">
            <Wine className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Beta
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Barモード
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              どこにBarがあるか・どんな雰囲気かを、地図と条件絞り込みでざっくり把握するためのプロトタイプです。
            </p>
          </div>
        </div>
      </header>

      <section className="mb-6 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
          条件
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value as BarPriceRange | "all")}
            className={selectClass}
            aria-label="価格帯"
          >
            <option value="all">価格帯 · すべて</option>
            <option value="low">価格帯 · 手頃</option>
            <option value="mid">価格帯 · 中間</option>
            <option value="high">価格帯 · やや上</option>
          </select>

          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value as BarVibe | "all")}
            className={selectClass}
            aria-label="雰囲気"
          >
            <option value="all">雰囲気 · すべて</option>
            <option value="quiet">雰囲気 · 静かめ</option>
            <option value="casual">雰囲気 · カジュアル</option>
            <option value="lively">雰囲気 · にぎやか</option>
          </select>

          <select
            value={beginner}
            onChange={(e) => setBeginner(e.target.value as Filter)}
            className={selectClass}
            aria-label="初心者向け"
          >
            <option value="all">初心者向け · すべて</option>
            <option value="yes">初心者向け · はい</option>
            <option value="no">初心者向け · いいえ</option>
          </select>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="lg:sticky lg:top-[5.25rem] lg:z-0">
          <BarMap
            bars={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <MapPin className="h-4 w-4 text-accent" aria-hidden />
              一覧
            </p>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              {filtered.length} 件
            </span>
          </div>
          {sorted.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/80 px-5 py-10 text-center text-sm text-gray-500">
              条件に一致するBarがありません。フィルタを緩めて試してください。
            </div>
          ) : (
            <ul className="space-y-3">
              {sorted.map((bar) => (
                <li key={bar.id}>
                  <BarCard
                    bar={bar}
                    selected={selectedId === bar.id}
                    onSelect={() =>
                      setSelectedId((id) => (id === bar.id ? null : bar.id))
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

"use client";

import { BarSpot } from "@/types/bar";
import { Clock, MapPin, Train } from "lucide-react";

function labelPrice(priceRange: BarSpot["priceRange"]): string {
  if (priceRange === "low") return "価格 · 手頃";
  if (priceRange === "mid") return "価格 · 中間";
  return "価格 · やや上";
}

function labelVibe(vibe: BarSpot["vibe"]): string {
  if (vibe === "quiet") return "静かめ";
  if (vibe === "casual") return "カジュアル";
  return "にぎやか";
}

export default function BarCard({
  bar,
  selected,
  onSelect,
}: {
  bar: BarSpot;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <article
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (!onSelect) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 ${
        selected
          ? "border-accent ring-2 ring-accent/35 shadow-md"
          : "border-gray-200/90 hover:border-gray-300 hover:shadow-md"
      } ${onSelect ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-gray-900">{bar.name}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
              {bar.area}
            </span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1">
              <Train className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
              {bar.nearestStation} 徒歩{bar.walkMinutes}分
            </span>
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-800">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {bar.openUntil}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-700">{bar.note}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
          {labelPrice(bar.priceRange)}
        </span>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {labelVibe(bar.vibe)}
        </span>
        {bar.beginnerFriendly && (
          <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
            初心者向け
          </span>
        )}
        {bar.soloFriendly && (
          <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">
            1人OK
          </span>
        )}
        {bar.noCoverCharge && (
          <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-800">
            チャージなし
          </span>
        )}
      </div>
    </article>
  );
}

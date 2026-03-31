"use client";

import { BarSpot } from "@/types/bar";

function labelPrice(priceRange: BarSpot["priceRange"]): string {
  if (priceRange === "low") return "価格帯: 低め";
  if (priceRange === "mid") return "価格帯: 中間";
  return "価格帯: 高め";
}

function labelVibe(vibe: BarSpot["vibe"]): string {
  if (vibe === "quiet") return "雰囲気: 静か";
  if (vibe === "casual") return "雰囲気: カジュアル";
  return "雰囲気: にぎやか";
}

export default function BarCard({ bar }: { bar: BarSpot }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{bar.name}</h3>
          <p className="text-sm text-gray-600">
            {bar.area} / {bar.nearestStation}駅 徒歩{bar.walkMinutes}分
          </p>
        </div>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
          {bar.openUntil}まで
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-700">{bar.note}</p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">{labelPrice(bar.priceRange)}</span>
        <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">{labelVibe(bar.vibe)}</span>
        {bar.beginnerFriendly && <span className="rounded bg-green-100 px-2 py-1 text-green-700">初心者向け</span>}
        {bar.soloFriendly && <span className="rounded bg-blue-100 px-2 py-1 text-blue-700">1人OK</span>}
        {bar.noCoverCharge && <span className="rounded bg-purple-100 px-2 py-1 text-purple-700">チャージなし</span>}
      </div>
    </article>
  );
}

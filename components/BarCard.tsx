"use client";

import { BarSpot } from "@/types/bar";
import { drinkLabel } from "@/lib/barDrinks";
import { Clock, MapPin, Navigation, Train } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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
  highlightDrink,
  embedded,
  distanceMeters,
}: {
  bar: BarSpot;
  selected?: boolean;
  onSelect?: () => void;
  /** 逆引きフィルタで選んだドリンクをチップで強調 */
  highlightDrink?: string | null;
  /** サイドパネル内表示用（枠やリングを弱める） */
  embedded?: boolean;
  distanceMeters?: number | null;
}) {
  const photos = useMemo(
    () => [bar.coverImageUrl, ...(bar.atmospherePhotos ?? [])],
    [bar.coverImageUrl, bar.atmospherePhotos]
  );
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const activeSrc = photos[Math.min(photoIndex, photos.length - 1)] ?? "";

  useEffect(() => {
    setPhotoIndex(0);
    setImageError(false);
  }, [bar.id]);

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
      className={`overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
        embedded
          ? "border-transparent shadow-none"
          : selected
            ? "border-accent shadow-md ring-2 ring-accent/35"
            : "border-gray-200/90 shadow-sm hover:border-gray-300 hover:shadow-md"
      } ${onSelect ? "cursor-pointer" : ""}`}
    >
      <div className="relative aspect-[16/9] w-full bg-gray-100">
        {!imageError && activeSrc ? (
          <Image
            src={activeSrc}
            alt={`${bar.name}の店内・雰囲気`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 480px"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            画像を表示できません
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-2 pt-10">
          <p className="text-xs font-medium text-white/95 drop-shadow-sm">
            雰囲気 · {labelVibe(bar.vibe)}
          </p>
        </div>
        <span className="pointer-events-none absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          <Clock className="h-3 w-3" aria-hidden />
          {bar.openUntil}
        </span>
      </div>

      {photos.length > 1 && (
        <div
          className="flex gap-1.5 overflow-x-auto border-b border-gray-100 bg-gray-50/90 px-2 py-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {photos.map((url, i) => (
            <button
              key={`${bar.id}-ph-${i}`}
              type="button"
              onClick={() => {
                setPhotoIndex(i);
                setImageError(false);
              }}
              className={`relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                i === photoIndex
                  ? "ring-accent shadow-sm"
                  : "ring-transparent opacity-85 hover:opacity-100"
              }`}
              aria-label={`写真 ${i + 1} を表示`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="72px" />
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
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
              {typeof distanceMeters === "number" && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Navigation className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
                    現在地から{(distanceMeters / 1000).toFixed(1)}km
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-gray-700">{bar.note}</p>

        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-500">
            飲み物の例
          </p>
          <div className="flex flex-wrap gap-1.5">
            {bar.stockDrinks.map((key) => (
              <span
                key={key}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                  highlightDrink === key
                    ? "bg-orange-100 text-orange-950 ring-2 ring-accent/70"
                    : "bg-amber-50/90 text-amber-950/85 ring-1 ring-amber-100/90"
                }`}
              >
                {drinkLabel(key)}
              </span>
            ))}
          </div>
        </div>

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
      </div>
    </article>
  );
}

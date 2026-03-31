"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import BarCard from "@/components/BarCard";
import { BAR_SPOTS } from "@/lib/barMock";
import { DRINK_FILTER_OPTIONS } from "@/lib/barDrinks";
import { BarPriceRange, BarVibe } from "@/types/bar";
import { haversineMeters } from "@/utils/geo";
import {
  Beer,
  LayoutGrid,
  LocateFixed,
  Loader2,
  MapIcon,
  MapPin,
  SlidersHorizontal,
  Wine,
  X,
} from "lucide-react";

type BrowseMode = "map" | "list";
type GeoState = "idle" | "loading" | "success" | "error";

/** モバイルは画面比・デスクトップはビューポート基準で地図を広く */
const MAP_SHELL =
  "min-h-[300px] h-[min(46vh,420px)] w-full lg:h-[min(78vh,calc(100vh-10.5rem))] lg:min-h-[520px]";

const BarMap = dynamic(() => import("@/components/BarMap"), {
  ssr: false,
  loading: () => (
    <div
      className={`flex items-center justify-center rounded-2xl border border-gray-200 bg-stone-50 text-sm text-gray-500 ${MAP_SHELL}`}
    >
      地図を読み込み中…
    </div>
  ),
});

type Filter = "all" | "yes" | "no";

const selectClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25";

const segBtn = (on: boolean) =>
  `inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition ${
    on
      ? "bg-white text-gray-900 shadow-sm"
      : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
  }`;

export default function BarModePage() {
  const [browseMode, setBrowseMode] = useState<BrowseMode>("map");
  const [price, setPrice] = useState<BarPriceRange | "all">("all");
  const [vibe, setVibe] = useState<BarVibe | "all">("all");
  const [beginner, setBeginner] = useState<Filter>("all");
  const [drinkKey, setDrinkKey] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [geoError, setGeoError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return BAR_SPOTS.filter((bar) => {
      const byPrice = price === "all" || bar.priceRange === price;
      const byVibe = vibe === "all" || bar.vibe === vibe;
      const byBeginner =
        beginner === "all" ||
        (beginner === "yes" && bar.beginnerFriendly) ||
        (beginner === "no" && !bar.beginnerFriendly);
      const byDrink =
        drinkKey === "all" || bar.stockDrinks.includes(drinkKey);
      return byPrice && byVibe && byBeginner && byDrink;
    });
  }, [price, vibe, beginner, drinkKey]);

  useEffect(() => {
    if (selectedId && !filtered.some((b) => b.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  const barsWithDistance = useMemo(
    () =>
      filtered.map((bar) => ({
        bar,
        distanceMeters: userLocation
          ? haversineMeters(
              { lat: userLocation.lat, lng: userLocation.lng },
              { lat: bar.latitude, lng: bar.longitude }
            )
          : null,
      })),
    [filtered, userLocation]
  );

  const visibleBars = useMemo(() => {
    if (!userLocation) return barsWithDistance;
    return [...barsWithDistance].sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
  }, [barsWithDistance, userLocation]);

  const selectedBar = useMemo(
    () => visibleBars.find((v) => v.bar.id === selectedId) ?? null,
    [visibleBars, selectedId]
  );

  const drinkHint = DRINK_FILTER_OPTIONS.find((o) => o.value === drinkKey);

  const chipClass = (active: boolean) =>
    `shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
      active
        ? "border-accent bg-orange-50 text-orange-900 shadow-sm"
        : "border-gray-200 bg-white text-gray-700 hover:border-accent/40 hover:bg-orange-50/50"
    }`;

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoState("error");
      setGeoError("このブラウザでは位置情報を利用できません。");
      return;
    }
    setGeoState("loading");
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoState("success");
      },
      () => {
        setGeoState("error");
        setGeoError("位置情報の取得に失敗しました（許可設定をご確認ください）。");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-12">
      <header className="mb-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white via-orange-50/50 to-white px-5 py-5 shadow-sm ring-1 ring-black/[0.03] sm:px-7 sm:py-6">
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
              <strong className="font-semibold text-gray-800">マップ</strong>
              か<strong className="font-semibold text-gray-800">一覧</strong>
              で見る方式を切り替えられます。ピンが店の位置です。
            </p>
          </div>
        </div>
      </header>

      <section className="mb-5 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
          基本条件
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

        <div className="mt-5 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-orange-50/40 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Beer className="h-4 w-4 text-amber-700" aria-hidden />
            飲みたいもの（逆引き）
          </div>
          <select
            value={drinkKey}
            onChange={(e) => setDrinkKey(e.target.value)}
            className={selectClass}
            aria-label="飲みたいもの"
          >
            <option value="all">指定なし（すべて表示）</option>
            {DRINK_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-relaxed text-gray-600">
            {drinkKey === "all" ? (
              <>
                例：「サッポロビール」を選ぶと、その取扱がある店だけが表示されます（モック）。
              </>
            ) : (
              <>
                選択中：{drinkHint?.label}
                {drinkHint?.description ? ` — ${drinkHint.description}` : ""}
              </>
            )}
          </p>
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/90 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm text-gray-600">
          表示方法 · 該当{" "}
          <span className="font-semibold text-gray-900">{visibleBars.length}</span>{" "}
          件
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-accent/40 hover:bg-orange-50/50"
            onClick={handleUseMyLocation}
            disabled={geoState === "loading"}
          >
            {geoState === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <LocateFixed className="h-4 w-4" aria-hidden />
            )}
            現在地を使う
          </button>
          <div
            className="flex rounded-xl border border-gray-200 bg-gray-100/90 p-0.5"
            role="group"
            aria-label="表示切替"
          >
            <button
              type="button"
              className={segBtn(browseMode === "map")}
              onClick={() => setBrowseMode("map")}
              aria-pressed={browseMode === "map"}
            >
              <MapIcon className="h-4 w-4" aria-hidden />
              マップ
            </button>
            <button
              type="button"
              className={segBtn(browseMode === "list")}
              onClick={() => setBrowseMode("list")}
              aria-pressed={browseMode === "list"}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
              一覧
            </button>
          </div>
        </div>
      </div>
      {geoError && <p className="mb-4 text-sm text-red-600">{geoError}</p>}

      {browseMode === "list" ? (
        <section>
          {visibleBars.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/80 px-5 py-12 text-center text-sm text-gray-500">
              条件に一致するBarがありません。
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleBars.map(({ bar, distanceMeters }) => (
                <BarCard
                  key={bar.id}
                  bar={bar}
                  selected={selectedId === bar.id}
                  highlightDrink={drinkKey === "all" ? null : drinkKey}
                  distanceMeters={distanceMeters}
                  onSelect={() =>
                    setSelectedId((id) => (id === bar.id ? null : bar.id))
                  }
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_min(400px,36%)] lg:items-stretch lg:gap-6">
          <div className="flex min-h-0 flex-col gap-3 lg:sticky lg:top-[5.25rem] lg:self-start">
            <div className={`${MAP_SHELL} overflow-hidden rounded-2xl`}>
              <BarMap
                bars={filtered}
                selectedId={selectedId}
                onSelect={setSelectedId}
                userLocation={userLocation}
                className="h-full w-full"
              />
            </div>

            {visibleBars.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  店名から開く（{visibleBars.length}件）
                </p>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
                  {visibleBars.map(({ bar }) => (
                    <button
                      key={bar.id}
                      type="button"
                      onClick={() => setSelectedId(bar.id)}
                      className={chipClass(selectedId === bar.id)}
                      aria-pressed={selectedId === bar.id}
                    >
                      {bar.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-md ring-1 ring-black/[0.04] lg:min-h-[min(78vh,calc(100vh-10.5rem))]">
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 bg-stone-50/80 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <MapPin className="h-4 w-4 text-accent" aria-hidden />
                詳細
              </div>
              {selectedBar ? (
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-200/60 hover:text-gray-900"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                  閉じる
                </button>
              ) : (
                <span className="text-xs text-gray-400">未選択</span>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
              {visibleBars.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-gray-500">
                  条件に一致するBarがありません。
                </div>
              ) : selectedBar ? (
                <div className="p-3 sm:p-4">
                  <BarCard
                    bar={selectedBar.bar}
                    selected
                    embedded
                    highlightDrink={drinkKey === "all" ? null : drinkKey}
                    distanceMeters={selectedBar.distanceMeters}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
                  <div className="rounded-full bg-gray-100 p-4">
                    <MapPin className="h-8 w-8 text-gray-400" aria-hidden />
                  </div>
                  <p className="max-w-xs text-sm leading-relaxed text-gray-600">
                    <strong className="text-gray-800">ピンをタップ</strong>
                    するか
                    <strong className="text-gray-800">店名チップ</strong>
                    から選ぶと、ここに詳細が出ます。
                  </p>
                  <p className="text-xs text-gray-400">
                    該当 {visibleBars.length} 件
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

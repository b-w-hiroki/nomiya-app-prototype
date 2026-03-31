"use client";

import { BarSpot } from "@/types/bar";

export default function BarMapMock({
  bars,
  selectedId,
  onSelect,
}: {
  bars: BarSpot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-gray-700">地域マップ（モック）</p>
      <div className="relative h-72 w-full overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-b from-orange-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(251,146,60,0.14),transparent_28%),radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.10),transparent_35%)]" />
        {bars.map((bar) => (
          <button
            key={bar.id}
            type="button"
            onClick={() => onSelect(bar.id)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-xs shadow-sm transition ${
              selectedId === bar.id
                ? "border-orange-600 bg-orange-500 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-orange-400"
            }`}
            style={{ left: `${bar.mapX}%`, top: `${bar.mapY}%` }}
          >
            {bar.name}
          </button>
        ))}
      </div>
    </section>
  );
}

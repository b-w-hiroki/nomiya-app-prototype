"use client";

import { STATIONS } from "@/lib/stations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const stationId = searchParams.get("stationId") || "yokohama";
  const radius = searchParams.get("radius") || "800";
  const sort = searchParams.get("sort") || "endsSoon";

  const update = (patch: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => params.set(k, v));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const radiusOptions = useMemo(
    () => [
      { value: "400", label: "徒歩5分 (約400m)" },
      { value: "800", label: "徒歩10分 (約800m)" },
      { value: "1200", label: "徒歩15分 (約1.2km)" },
    ],
    []
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <select
        value={stationId}
        onChange={(e) => update({ stationId: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
      >
        {STATIONS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={radius}
        onChange={(e) => update({ radius: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
      >
        {radiusOptions.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => update({ sort: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
      >
        <option value="endsSoon">終了間近</option>
        <option value="distance">近い順</option>
      </select>
    </div>
  );
}


"use client";

import SearchBar from "@/components/SearchBar";
import CampaignCard from "@/components/CampaignCard";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CampaignWithDistance } from "@/types/campaign";
import { getCampaigns } from "@/lib/campaignsQuery";

function CampaignList() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CampaignWithDistance[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const stationId = params.get("stationId") ?? "yokohama";
    const radius = params.get("radius") ?? "800";
    const sort = params.get("sort") ?? "endsSoon";

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const result = await getCampaigns({
          stationId,
          radius,
          sort,
        });
        if (controller.signal.aborted) return;
        if (!result.ok) {
          throw new Error(result.error ?? "読み込みに失敗しました");
        }
        setItems(result.data.campaigns ?? []);
      } catch (e) {
        if (e instanceof Error && e.name !== "AbortError") {
          setError(e.message ?? "読み込みに失敗しました");
        } else if (!(e instanceof Error)) {
          setError("読み込みに失敗しました");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => controller.abort();
  }, [params]);

  return (
    <div className="space-y-4 min-h-[200px]">
      {loading && <p className="text-sm text-gray-500">読み込み中...</p>}
      {error && (
        <p className="text-sm text-red-600">エラー: {error}</p>
      )}
      {!loading && !error && items.length === 0 && (
        <p className="text-sm text-gray-500">該当するキャンペーンはありません。</p>
      )}
      {!loading &&
        !error &&
        items.map((c) => <CampaignCard key={c.id} campaign={c} />)}
    </div>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-12">
      <header className="mb-8 overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white via-orange-50/40 to-white px-5 py-6 shadow-sm ring-1 ring-black/[0.03]">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          キャンペーン
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
          近くのお得情報を探す
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          駅・範囲・並び順を選んで、終了が近い順などでチェックできます。
        </p>
        <div className="mt-5">
          <Suspense fallback={<div className="h-12" />}>
            <SearchBar />
          </Suspense>
        </div>
      </header>

      <Suspense fallback={<p className="text-sm text-gray-500">読み込み中...</p>}>
        <CampaignList />
      </Suspense>

      <div className="mt-10 text-center text-xs text-gray-500">
        <p>※ 情報の正確性は各店舗にご確認ください</p>
      </div>
    </div>
  );
}

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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          近くのお得なキャンペーンを探す
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          駅と範囲を選んで、終了間近のお得情報をチェック！
        </p>
        <Suspense fallback={<div className="h-12" />}>
          <SearchBar />
        </Suspense>
      </div>

      <Suspense fallback={<p className="text-sm text-gray-500">読み込み中...</p>}>
        <CampaignList />
      </Suspense>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>※ 情報の正確性は各店舗にご確認ください</p>
      </div>
    </div>
  );
}

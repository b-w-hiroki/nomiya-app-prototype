import { supabase } from "@/utils/supabase";
import { getStationById, type Station } from "@/lib/stations";
import { haversineMeters } from "@/utils/geo";
import { Campaign, CampaignWithDistance } from "@/types/campaign";
import { MOCK_CAMPAIGNS } from "@/lib/campaignMock";

export type CampaignsSuccess = {
  station: Station;
  radius: number;
  count: number;
  campaigns: CampaignWithDistance[];
};

export type CampaignsResult =
  | { ok: true; data: CampaignsSuccess }
  | { ok: false; error: string; status?: number };

/** プレースホルダーは未設定と同扱い（誤って Supabase を叩かない） */
export function hasUsableSupabaseEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  if (!url || !key) return false;
  if (url.includes("placeholder.supabase.co")) return false;
  if (key === "placeholder-key") return false;
  return true;
}

export async function getCampaigns(options: {
  stationId: string;
  radius: string;
  sort: string;
  brand?: string | null;
}): Promise<CampaignsResult> {
  const stationId = options.stationId || "yokohama";
  const radius = Number(options.radius || "800");
  const sort = options.sort || "endsSoon";
  const brand = options.brand;

  const station = getStationById(stationId);
  if (!station) {
    return { ok: false, error: "unknown station", status: 400 };
  }

  let rows: Campaign[] = [];
  if (hasUsableSupabaseEnv()) {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .gt("expires_at", new Date().toISOString());
    if (error) {
      console.error(error);
      return { ok: false, error: "fetch failed", status: 500 };
    }
    rows = data as unknown as Campaign[];
  } else {
    rows = MOCK_CAMPAIGNS;
  }

  if (brand) {
    const b = brand.toLowerCase();
    rows = rows.filter(
      (c) =>
        (c.brand && c.brand.toLowerCase().includes(b)) ||
        c.store_name.toLowerCase().includes(b)
    );
  }

  const withDistance: CampaignWithDistance[] = rows
    .map((c) => ({
      ...c,
      distanceMeters: haversineMeters(
        { lat: c.latitude, lng: c.longitude },
        { lat: station.latitude, lng: station.longitude }
      ),
    }))
    .filter((c) => c.distanceMeters <= radius);

  const sorted =
    sort === "distance"
      ? [...withDistance].sort((a, b) => a.distanceMeters - b.distanceMeters)
      : [...withDistance].sort(
          (a, b) =>
            new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime()
        );

  return {
    ok: true,
    data: {
      station,
      radius,
      count: sorted.length,
      campaigns: sorted,
    },
  };
}

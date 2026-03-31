import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import { getStationById } from "@/lib/stations";
import { haversineMeters } from "@/utils/geo";
import { Campaign, CampaignWithDistance } from "@/types/campaign";
import { MOCK_CAMPAIGNS } from "@/lib/campaignMock";

function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stationId = searchParams.get("stationId") || "yokohama";
  const radius = Number(searchParams.get("radius") || "800"); // meters
  const brand = searchParams.get("brand");
  const sort = searchParams.get("sort") || "endsSoon"; // endsSoon | distance

  const station = getStationById(stationId);
  if (!station) {
    return NextResponse.json({ error: "unknown station" }, { status: 400 });
  }

  // fetch source (supabase or mock)
  let rows: Campaign[] = [];
  if (hasSupabaseEnv()) {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .gt("expires_at", new Date().toISOString());
    if (error) {
      console.error(error);
      return NextResponse.json({ error: "fetch failed" }, { status: 500 });
    }
    rows = data as unknown as Campaign[];
  } else {
    rows = MOCK_CAMPAIGNS;
  }

  // optional brand filter
  if (brand) {
    const b = brand.toLowerCase();
    rows = rows.filter(
      (c) =>
        (c.brand && c.brand.toLowerCase().includes(b)) ||
        c.store_name.toLowerCase().includes(b)
    );
  }

  // distance filter + mapping
  const withDistance: CampaignWithDistance[] = rows
    .map((c) => ({
      ...c,
      distanceMeters: haversineMeters(
        { lat: c.latitude, lng: c.longitude },
        { lat: station.latitude, lng: station.longitude }
      ),
    }))
    .filter((c) => c.distanceMeters <= radius);

  // sort
  const sorted =
    sort === "distance"
      ? [...withDistance].sort((a, b) => a.distanceMeters - b.distanceMeters)
      : [...withDistance].sort(
          (a, b) =>
            new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime()
        );

  return NextResponse.json({
    station,
    radius,
    count: sorted.length,
    campaigns: sorted,
  });
}


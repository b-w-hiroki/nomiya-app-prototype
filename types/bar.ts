export type BarPriceRange = "low" | "mid" | "high";
export type BarVibe = "quiet" | "casual" | "lively";

export interface BarSpot {
  id: string;
  name: string;
  area: string;
  nearestStation: string;
  walkMinutes: number;
  priceRange: BarPriceRange;
  vibe: BarVibe;
  beginnerFriendly: boolean;
  soloFriendly: boolean;
  noCoverCharge: boolean;
  openUntil: string;
  note: string;
  latitude: number;
  longitude: number;
}

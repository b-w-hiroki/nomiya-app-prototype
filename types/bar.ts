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
  /** 一覧・地図カードのメイン写真（雰囲気紹介） */
  coverImageUrl: string;
  /** 追加の雰囲気ショット（任意） */
  atmospherePhotos?: string[];
  latitude: number;
  longitude: number;
}

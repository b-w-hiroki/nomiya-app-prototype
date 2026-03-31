import { RecommendedZone } from "@/types/recommendedZone";

/** モック用「地域のおすすめ」。実運用では CMS / DB から取得想定 */
export const RECOMMENDED_ZONES: RecommendedZone[] = [
  {
    id: "minatomirai-sakuragi",
    label: "みなとみらい〜桜木町",
    latitude: 35.4545,
    longitude: 139.6305,
    radiusMeters: 850,
    accentHex: "#c2410c",
  },
  {
    id: "noge-kannai",
    label: "野毛・関内はしご酒",
    latitude: 35.4465,
    longitude: 139.631,
    radiusMeters: 700,
    accentHex: "#ea580c",
  },
  {
    id: "yokohama-west",
    label: "横浜駅西口〜鶴屋町",
    latitude: 35.4658,
    longitude: 139.618,
    radiusMeters: 480,
    accentHex: "#d97706",
  },
];

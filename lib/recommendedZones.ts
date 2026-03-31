import { RecommendedZone } from "@/types/recommendedZone";

/** モック用「地域のおすすめ」（多角形）。実運用では GeoJSON / CMS 想定 */
export const RECOMMENDED_ZONES: RecommendedZone[] = [
  {
    id: "minatomirai-sakuragi",
    label: "みなとみらい〜桜木町",
    accentHex: "#c2410c",
    polygon: [
      [35.4642, 139.618],
      [35.4642, 139.648],
      [35.4445, 139.648],
      [35.4445, 139.618],
    ],
  },
  {
    id: "noge-kannai",
    label: "野毛・関内はしご酒",
    accentHex: "#ea580c",
    polygon: [
      [35.4545, 139.622],
      [35.4545, 139.642],
      [35.4348, 139.642],
      [35.4348, 139.622],
    ],
  },
  {
    id: "yokohama-west",
    label: "横浜駅西口〜鶴屋町",
    accentHex: "#d97706",
    polygon: [
      [35.4712, 139.609],
      [35.4712, 139.626],
      [35.4625, 139.626],
      [35.4625, 139.609],
    ],
  },
];

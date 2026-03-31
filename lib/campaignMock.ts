import { Campaign } from "@/types/campaign";

// 横浜駅近辺の適当な座標に配置したモック
export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "m1",
    created_at: new Date().toISOString(),
    brand: "串カツ田中",
    store_name: "串カツ田中 横浜店",
    title: "19時までハイボール50円！",
    price_display: "50円〜",
    image_url:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    starts_at: null,
    expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    latitude: 35.4666,
    longitude: 139.6215,
    area: "横浜",
    source: "モック",
    tags: ["ハッピーアワー"],
  },
  {
    id: "m2",
    created_at: new Date().toISOString(),
    brand: "365酒場",
    store_name: "365酒場 横浜駅前",
    title: "終日メガジョッキ半額！",
    price_display: "半額",
    image_url:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
    starts_at: null,
    expires_at: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    latitude: 35.4662,
    longitude: 139.624,
    area: "横浜",
    source: "モック",
    tags: ["ドリンク"],
  },
  {
    id: "m3",
    created_at: new Date().toISOString(),
    brand: "個室居酒屋",
    store_name: "はまっこ",
    title: "刺身盛り合わせ半額（本日限定）",
    price_display: "半額",
    image_url:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
    starts_at: null,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    latitude: 35.4655,
    longitude: 139.621,
    area: "横浜",
    source: "モック",
    tags: ["フード"],
  },
];


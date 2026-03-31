import { Coupon } from "@/types/coupon";

// モックデータ（ダミーデータ）
export const DUMMY_COUPONS: Coupon[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    store_name: "居酒屋 よこはま",
    title: "19時までハイボール50円！",
    price_display: "1,200円〜",
    image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2時間後
    area: "横浜",
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    store_name: "串焼き 横浜本店",
    title: "22時まで全品100円引き！",
    price_display: "800円〜",
    image_url: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop",
    expires_at: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5時間後
    area: "横浜",
  },
  {
    id: "3",
    created_at: new Date().toISOString(),
    store_name: "海鮮居酒屋 はまっこ",
    title: "本日限定！刺身盛り合わせ半額",
    price_display: "1,500円〜",
    image_url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間後
    area: "横浜",
  },
  {
    id: "4",
    created_at: new Date().toISOString(),
    store_name: "焼鳥 横浜駅前",
    title: "20時までビール半額！",
    price_display: "900円〜",
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
    expires_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3時間後
    area: "横浜",
  },
  {
    id: "5",
    created_at: new Date().toISOString(),
    store_name: "和食居酒屋 みなと",
    title: "本日限定！おでんセット500円",
    price_display: "1,000円〜",
    image_url: "https://images.unsplash.com/photo-1609501676725-7186f3a1f2f1?w=800&h=600&fit=crop",
    expires_at: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1時間後
    area: "横浜",
  },
];

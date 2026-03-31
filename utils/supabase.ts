import { createClient } from "@supabase/supabase-js";
import { Coupon } from "@/types/coupon";

// 環境変数から取得（後で設定）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// クーポン関連の型定義（Supabaseテーブル用）
export type CouponInsert = Omit<Coupon, "id" | "created_at">;
export type CouponUpdate = Partial<CouponInsert>;

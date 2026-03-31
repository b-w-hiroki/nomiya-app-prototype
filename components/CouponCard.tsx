"use client";

import { Coupon } from "@/types/coupon";
import { getTimeRemaining, isUrgent } from "@/utils/timeUtils";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CouponCardProps {
  coupon: Coupon;
}

export default function CouponCard({ coupon }: CouponCardProps) {
  const [imageError, setImageError] = useState(false);
  const timeRemaining = getTimeRemaining(coupon.expires_at);
  const urgent = isUrgent(coupon.expires_at);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* クーポン画像 */}
      <div className="relative w-full h-48 bg-gray-200">
        {!imageError ? (
          <Image
            src={coupon.image_url}
            alt={coupon.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">画像なし</span>
          </div>
        )}
        {/* 残り時間バッジ */}
        <div
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
            urgent
              ? "bg-red-500 text-white animate-pulse"
              : "bg-accent text-white"
          }`}
        >
          <Clock className="w-3 h-3 inline mr-1" />
          {timeRemaining}
        </div>
      </div>

      {/* カード内容 */}
      <div className="p-4">
        {/* 店名とエリア */}
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">{coupon.area}</span>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {coupon.store_name}
        </h2>

        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {coupon.title}
        </p>

        {/* 価格表示 */}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-xs text-gray-500">実質価格</span>
            <p className="text-2xl font-bold text-accent">
              {coupon.price_display}
            </p>
          </div>
        </div>

        {/* 詳細ボタン */}
        <button className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
          詳細を見る
        </button>
      </div>
    </div>
  );
}

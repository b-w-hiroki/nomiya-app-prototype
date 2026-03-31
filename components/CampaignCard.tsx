"use client";

import { CampaignWithDistance } from "@/types/campaign";
import { getTimeRemaining, isUrgent } from "@/utils/timeUtils";
import Image from "next/image";
import { Clock, MapPin, Navigation } from "lucide-react";
import { useState } from "react";

export default function CampaignCard({ campaign }: { campaign: CampaignWithDistance }) {
  const [imageError, setImageError] = useState(false);
  const timeRemaining = getTimeRemaining(campaign.expires_at);
  const urgent = isUrgent(campaign.expires_at);
  const km = (campaign.distanceMeters / 1000).toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 bg-gray-200">
        {!imageError && campaign.image_url ? (
          <Image
            src={campaign.image_url}
            alt={campaign.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">画像なし</span>
          </div>
        )}
        <div
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
            urgent ? "bg-red-500 text-white animate-pulse" : "bg-accent text-white"
          }`}
        >
          <Clock className="w-3 h-3 inline mr-1" />
          {timeRemaining}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{campaign.area ?? "エリア不明"}</span>
          <span className="mx-1">·</span>
          <Navigation className="w-4 h-4 text-gray-400" />
          <span>約{km}km</span>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {campaign.store_name}
          {campaign.brand ? <span className="ml-2 text-sm text-gray-500">({campaign.brand})</span> : null}
        </h2>

        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{campaign.title}</p>

        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs text-gray-500">実質価格</span>
            <p className="text-2xl font-bold text-accent">{campaign.price_display}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export interface Campaign {
  id: string;
  created_at: string;
  brand?: string;
  store_name: string;
  title: string;
  price_display: string;
  image_url?: string;
  starts_at?: string | null;
  expires_at: string;
  latitude: number;
  longitude: number;
  area?: string;
  source?: string;
  tags?: string[];
}

export interface CampaignWithDistance extends Campaign {
  distanceMeters: number;
}

export type CampaignInsert = Omit<Campaign, "id" | "created_at">;
export type CampaignUpdate = Partial<CampaignInsert>;


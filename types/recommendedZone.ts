export interface RecommendedZone {
  id: string;
  label: string;
  /** 緯度・経度の閉じたリング [[lat, lng], ...]（行政区画っぽく見せるためのおおまかな形） */
  polygon: [number, number][];
  /** 枠・塗りのアクセント色（#RRGGBB） */
  accentHex?: string;
}

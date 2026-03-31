export interface RecommendedZone {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  /** Leaflet Circle の半径（メートル） */
  radiusMeters: number;
  /** 枠・塗りの色（#RRGGBB） */
  accentHex?: string;
}

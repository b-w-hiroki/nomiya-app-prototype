export type Station = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export const STATIONS: Station[] = [
  {
    id: "yokohama",
    name: "横浜",
    latitude: 35.465995,
    longitude: 139.622093,
  },
  {
    id: "kawasaki",
    name: "川崎",
    latitude: 35.530865,
    longitude: 139.696976,
  },
  {
    id: "shin_yokohama",
    name: "新横浜",
    latitude: 35.507456,
    longitude: 139.617586,
  },
];

export function getStationById(id: string | null | undefined): Station | null {
  if (!id) return null;
  return STATIONS.find((s) => s.id === id) ?? null;
}


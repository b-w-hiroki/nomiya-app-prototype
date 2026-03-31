"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BarSpot } from "@/types/bar";

const YOKOHAMA_ST: [number, number] = [35.465995, 139.622093];
/** 情報密度を抑えたシンプル地図（CARTO Positron系ライト） */
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
const MAP_MAX_ZOOM = 14;
const FLY_ZOOM = 14;

function FitBounds({ bars }: { bars: BarSpot[] }) {
  const map = useMap();
  useEffect(() => {
    if (bars.length === 0) {
      map.setView(YOKOHAMA_ST, 12);
      return;
    }
    if (bars.length === 1) {
      map.setView([bars[0].latitude, bars[0].longitude], FLY_ZOOM);
      return;
    }
    const bounds = L.latLngBounds(
      bars.map((b) => [b.latitude, b.longitude] as [number, number])
    );
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: MAP_MAX_ZOOM });
  }, [map, bars]);
  return null;
}

function FlyToSelected({
  selectedId,
  bars,
}: {
  selectedId: string | null;
  bars: BarSpot[];
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const bar = bars.find((b) => b.id === selectedId);
    if (!bar) return;
    map.flyTo([bar.latitude, bar.longitude], FLY_ZOOM, { duration: 0.45 });
  }, [selectedId, bars, map]);
  return null;
}

function pinIcon(selected: boolean) {
  const fill = selected ? "#ea580c" : "#fb923c";
  return L.divIcon({
    className: "bar-map-pin",
    html: `<div style="width:26px;height:26px;border-radius:9999px;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.22);background:${fill};box-sizing:border-box"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export default function BarMap({
  bars,
  selectedId,
  onSelect,
  className = "",
}: {
  bars: BarSpot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** 高さは親で指定（例: h-[300px]） */
  className?: string;
}) {
  return (
    <section
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-md ring-1 ring-black/[0.04] ${className}`}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gradient-to-r from-white to-stone-50/80 px-3 py-2.5 sm:px-4">
        <div>
          <p className="text-sm font-semibold tracking-tight text-gray-900">
            エリア
          </p>
          <p className="text-[11px] leading-snug text-gray-500">
            シンプル地図 · ピンタップで詳細へ
          </p>
        </div>
        <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100">
          {bars.length} 件
        </span>
      </header>
      <div className="relative flex-1 basis-0 overflow-hidden bg-stone-100/80">
        <MapContainer
          center={YOKOHAMA_ST}
          zoom={12}
          minZoom={11}
          maxZoom={MAP_MAX_ZOOM}
          scrollWheelZoom
          className="bar-leaflet-map absolute inset-0 z-0 h-full w-full"
        >
          <TileLayer
            attribution={TILE_ATTRIBUTION}
            url={TILE_URL}
            subdomains="abcd"
          />
          <FitBounds bars={bars} />
          <FlyToSelected selectedId={selectedId} bars={bars} />
          {bars.map((bar) => (
            <Marker
              key={`${bar.id}-${selectedId === bar.id}`}
              position={[bar.latitude, bar.longitude]}
              icon={pinIcon(selectedId === bar.id)}
              eventHandlers={{
                click: () => onSelect(bar.id),
              }}
            />
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

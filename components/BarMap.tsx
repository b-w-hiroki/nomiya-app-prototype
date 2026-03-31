"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BarSpot } from "@/types/bar";

const YOKOHAMA_ST: [number, number] = [35.465995, 139.622093];

function FitBounds({ bars }: { bars: BarSpot[] }) {
  const map = useMap();
  useEffect(() => {
    if (bars.length === 0) {
      map.setView(YOKOHAMA_ST, 13);
      return;
    }
    if (bars.length === 1) {
      map.setView([bars[0].latitude, bars[0].longitude], 15);
      return;
    }
    const bounds = L.latLngBounds(
      bars.map((b) => [b.latitude, b.longitude] as [number, number])
    );
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 16 });
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
    map.flyTo([bar.latitude, bar.longitude], Math.max(map.getZoom(), 15), {
      duration: 0.45,
    });
  }, [selectedId, bars, map]);
  return null;
}

function pinIcon(selected: boolean) {
  const fill = selected ? "#ea580c" : "#fb923c";
  return L.divIcon({
    className: "bar-map-pin",
    html: `<div style="width:28px;height:28px;border-radius:9999px;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.28);background:${fill};box-sizing:border-box"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function BarMap({
  bars,
  selectedId,
  onSelect,
}: {
  bars: BarSpot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-md ring-1 ring-black/[0.04]">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gradient-to-r from-white to-orange-50/40 px-4 py-3">
        <div>
          <p className="text-sm font-semibold tracking-tight text-gray-900">エリア地図</p>
          <p className="text-xs text-gray-500">
            OpenStreetMap（ピンをタップして一覧と連動）
          </p>
        </div>
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-gray-100">
          {bars.length} 件
        </span>
      </header>
      <div className="relative h-[min(54vh,560px)] w-full min-h-[300px] bg-gray-100">
        <MapContainer
          center={YOKOHAMA_ST}
          zoom={13}
          scrollWheelZoom
          className="bar-leaflet-map h-full w-full"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

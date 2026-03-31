"use client";

import { Fragment, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  LayerGroup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BarSpot } from "@/types/bar";
import { RecommendedZone } from "@/types/recommendedZone";
import { RECOMMENDED_ZONES } from "@/lib/recommendedZones";

const YOKOHAMA_ST: [number, number] = [35.465995, 139.622093];

type MapTileStyle = "simple" | "detailed";

const TILE = {
  simple: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd" as const,
    maxZoom: 15,
    fitMaxZoom: 14,
    flyZoom: 14,
  },
  detailed: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: "abc" as const,
    maxZoom: 19,
    fitMaxZoom: 17,
    flyZoom: 15,
  },
} as const;

function SyncMapMaxZoom({ maxZoom }: { maxZoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setMaxZoom(maxZoom);
    const z = map.getZoom();
    if (z > maxZoom) map.setZoom(maxZoom);
  }, [map, maxZoom]);
  return null;
}

function FitBounds({
  bars,
  fitMaxZoom,
  flyZoom,
}: {
  bars: BarSpot[];
  fitMaxZoom: number;
  flyZoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (bars.length === 0) {
      map.setView(YOKOHAMA_ST, 12);
      return;
    }
    if (bars.length === 1) {
      map.setView([bars[0].latitude, bars[0].longitude], flyZoom);
      return;
    }
    const bounds = L.latLngBounds(
      bars.map((b) => [b.latitude, b.longitude] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: fitMaxZoom });
  }, [map, bars, fitMaxZoom, flyZoom]);
  return null;
}

function FlyToSelected({
  selectedId,
  bars,
  flyZoom,
}: {
  selectedId: string | null;
  bars: BarSpot[];
  flyZoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const bar = bars.find((b) => b.id === selectedId);
    if (!bar) return;
    map.flyTo([bar.latitude, bar.longitude], flyZoom, { duration: 0.45 });
  }, [selectedId, bars, map, flyZoom]);
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

function RecommendedAreaLayer({ zones }: { zones: RecommendedZone[] }) {
  if (zones.length === 0) return null;
  return (
    <LayerGroup>
      {zones.map((z) => {
        const stroke = z.accentHex ?? "#ea580c";
        const fillSoft = z.accentHex ?? "#fb923c";
        return (
          <Fragment key={z.id}>
            <Circle
              center={[z.latitude, z.longitude]}
              radius={z.radiusMeters * 1.45}
              pathOptions={{
                stroke: false,
                fillColor: fillSoft,
                fillOpacity: 0.09,
                interactive: false,
              }}
            />
            <Circle
              center={[z.latitude, z.longitude]}
              radius={z.radiusMeters}
              pathOptions={{
                color: stroke,
                fillColor: fillSoft,
                fillOpacity: 0.16,
                weight: 2,
                dashArray: "10 7",
                className: "recommended-zone-pulse",
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={0.92}>
                <span className="text-xs font-semibold text-gray-900">
                  {z.label}
                </span>
                <span className="mt-0.5 block text-[11px] font-normal text-gray-600">
                  おすすめエリア
                </span>
              </Tooltip>
            </Circle>
          </Fragment>
        );
      })}
    </LayerGroup>
  );
}

const segmentBtn = (active: boolean) =>
  `rounded-md px-2.5 py-1 transition ${
    active
      ? "bg-white font-semibold text-gray-900 shadow-sm"
      : "text-gray-500 hover:text-gray-800"
  }`;

export default function BarMap({
  bars,
  selectedId,
  onSelect,
  className = "",
  recommendedZones = RECOMMENDED_ZONES,
}: {
  bars: BarSpot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  /** 空配列でおすすめエリア非表示 */
  recommendedZones?: RecommendedZone[];
}) {
  const [mapStyle, setMapStyle] = useState<MapTileStyle>("simple");
  const tile = TILE[mapStyle];

  return (
    <section
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-md ring-1 ring-black/[0.04] ${className}`}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gradient-to-r from-white to-stone-50/80 px-3 py-2.5 sm:px-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold tracking-tight text-gray-900">
            エリア
          </p>
          <p className="text-[11px] leading-snug text-gray-500">
            {mapStyle === "simple"
              ? "見やすいライト地図"
              : "道路・施設名が詳しい地図"}
            {" · "}オレンジの丸＝おすすめゾーン
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex rounded-lg border border-gray-200/90 bg-gray-100/90 p-0.5 text-[11px] font-medium"
            role="group"
            aria-label="地図の種類"
          >
            <button
              type="button"
              className={segmentBtn(mapStyle === "simple")}
              onClick={() => setMapStyle("simple")}
            >
              シンプル
            </button>
            <button
              type="button"
              className={segmentBtn(mapStyle === "detailed")}
              onClick={() => setMapStyle("detailed")}
            >
              詳細
            </button>
          </div>
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100">
            {bars.length} 件
          </span>
        </div>
      </header>
      <div className="relative flex-1 basis-0 overflow-hidden bg-stone-100/80">
        <MapContainer
          center={YOKOHAMA_ST}
          zoom={12}
          minZoom={11}
          maxZoom={tile.maxZoom}
          scrollWheelZoom
          className="bar-leaflet-map absolute inset-0 z-0 h-full w-full"
        >
          <TileLayer
            key={mapStyle}
            attribution={tile.attribution}
            url={tile.url}
            subdomains={tile.subdomains}
          />
          <SyncMapMaxZoom maxZoom={tile.maxZoom} />
          <RecommendedAreaLayer zones={recommendedZones} />
          <FitBounds
            bars={bars}
            fitMaxZoom={tile.fitMaxZoom}
            flyZoom={tile.flyZoom}
          />
          <FlyToSelected
            selectedId={selectedId}
            bars={bars}
            flyZoom={tile.flyZoom}
          />
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

"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icons if standard markers are ever used
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface DistrictMetric {
  name: string;
  coords: [number, number];
  totalReports: number;
  pending: number;
  resolved: number;
  highPriority: number;
  innovationCandidates: number;
  hasSpecialCluster?: boolean;
  specialClusterId?: string;
}

export interface DistrictHeatmapInnerProps {
  districts: DistrictMetric[];
  selectedDistrict?: string | null;
  onSelectDistrict?: (districtName: string) => void;
  onOpenCluster?: (clusterId: string) => void;
  className?: string;
  tLabels: {
    reports: string;
    pending: string;
    resolved: string;
    highPriority: string;
    innovationCandidates: string;
    viewDetails: string;
  };
}

export default function DistrictHeatmapInner({
  districts,
  selectedDistrict,
  onSelectDistrict,
  onOpenCluster,
  className = "h-[420px] w-full rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-xs",
  tLabels,
}: DistrictHeatmapInnerProps) {
  const center: [number, number] = [23.5, 85.6]; // Center of Jharkhand

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={center}
        zoom={7.4}
        scrollWheelZoom={false}
        className="h-full w-full bg-[#f8fafc]"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {districts.map((d) => {
          const isSelected = selectedDistrict === d.name;
          const radius = Math.max(14, Math.min(36, Math.sqrt(d.totalReports) * 1.8));

          // Color based on high priority count & volume
          const fillColor = d.hasSpecialCluster
            ? "#dc2626" // crimson for Chaibasa / high priority cluster
            : d.highPriority > 12
            ? "#ea580c" // amber-orange for high priority
            : "#0284c7"; // blue for regular

          return (
            <CircleMarker
              key={d.name}
              center={d.coords}
              radius={radius}
              pathOptions={{
                color: isSelected ? "#0f172a" : fillColor,
                weight: isSelected ? 3 : 1.5,
                fillColor: fillColor,
                fillOpacity: isSelected ? 0.85 : 0.6,
              }}
              eventHandlers={{
                click: () => {
                  onSelectDistrict?.(d.name);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                <div className="font-semibold text-xs text-slate-900">
                  {d.name}: {d.totalReports} {tLabels.reports}
                </div>
              </Tooltip>

              <Popup>
                <div className="min-w-[210px] p-1 font-sans">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                    <span className="font-bold text-sm text-slate-900">{d.name}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {d.totalReports} {tLabels.reports}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-amber-50/80 p-1.5 rounded-lg border border-amber-200/50">
                      <span className="text-[10px] text-amber-700 block uppercase font-medium">{tLabels.pending}</span>
                      <span className="font-bold text-amber-900">{d.pending}</span>
                    </div>
                    <div className="bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-200/50">
                      <span className="text-[10px] text-emerald-700 block uppercase font-medium">{tLabels.resolved}</span>
                      <span className="font-bold text-emerald-900">{d.resolved}</span>
                    </div>
                    <div className="bg-red-50/80 p-1.5 rounded-lg border border-red-200/50">
                      <span className="text-[10px] text-red-700 block uppercase font-medium">{tLabels.highPriority}</span>
                      <span className="font-bold text-red-900">{d.highPriority}</span>
                    </div>
                    <div className="bg-indigo-50/80 p-1.5 rounded-lg border border-indigo-200/50">
                      <span className="text-[10px] text-indigo-700 block uppercase font-medium">{tLabels.innovationCandidates}</span>
                      <span className="font-bold text-indigo-900">{d.innovationCandidates}</span>
                    </div>
                  </div>

                  {d.hasSpecialCluster && d.specialClusterId && (
                    <button
                      type="button"
                      onClick={() => onOpenCluster?.(d.specialClusterId!)}
                      className="w-full mb-1.5 py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span>⚡ Open WQ-07 Water Cluster</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectDistrict?.(d.name)}
                    className="w-full py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-medium transition-colors text-center cursor-pointer"
                  >
                    {tLabels.viewDetails}
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-2.5 shadow-md text-xs space-y-1.5">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Report Intensity</div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-600 inline-block"></span>
          <span className="text-[11px] text-slate-700 font-medium">Critical Cluster (Chaibasa WQ-07)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-500 inline-block"></span>
          <span className="text-[11px] text-slate-700 font-medium">High Volume (&gt;150 Reports)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-sky-600 inline-block"></span>
          <span className="text-[11px] text-slate-700 font-medium">Moderate Volume</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix broken default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface LocationDisplayMapInnerProps {
  position: [number, number];
  label?: string;
  zoom?: number;
  className?: string;
}

export default function LocationDisplayMapInner({
  position,
  label,
  zoom = 13,
  className = "h-56 w-full rounded-xl border border-[var(--border-default)] shadow-xs",
}: LocationDisplayMapInnerProps) {
  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      className={className}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={position}>
        {label && (
          <Popup>
            <div className="text-xs font-medium text-[var(--text-primary)]">
              {label}
            </div>
          </Popup>
        )}
      </Marker>
    </MapContainer>
  );
}

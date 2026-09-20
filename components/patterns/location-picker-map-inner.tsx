"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

// Fix broken default icon paths (known Leaflet + bundler issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export const JHARKHAND_CENTER: [number, number] = [23.3441, 85.3096]; // Ranchi

function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export interface LocationPickerMapInnerProps {
  onSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number] | null;
  className?: string;
  zoom?: number;
}

export default function LocationPickerMapInner({
  onSelect,
  initialPosition = null,
  className = "h-64 w-full rounded-xl border border-[var(--border-default)] shadow-xs",
  zoom = 7,
}: LocationPickerMapInnerProps) {
  const [pin, setPin] = useState<[number, number] | null>(initialPosition);

  useEffect(() => {
    if (initialPosition) {
      setPin(initialPosition);
    }
  }, [initialPosition]);

  const handleSelect = (lat: number, lng: number) => {
    setPin([lat, lng]);
    onSelect(lat, lng);
  };

  return (
    <MapContainer
      center={pin || JHARKHAND_CENTER}
      zoom={zoom}
      scrollWheelZoom={false}
      className={className}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <ClickHandler onSelect={handleSelect} />
      {pin && <Marker position={pin} />}
    </MapContainer>
  );
}

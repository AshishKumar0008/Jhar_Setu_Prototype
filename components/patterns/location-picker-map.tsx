"use client";

import dynamic from "next/dynamic";
import type { LocationPickerMapInnerProps } from "./location-picker-map-inner";

const MapContainerInner = dynamic(
  () => import("./location-picker-map-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-xl bg-[var(--bg-base,#F7F8FA)] border border-[var(--border-default,#E2E5EA)] animate-pulse flex items-center justify-center text-xs text-[var(--text-muted,#6B7280)] font-medium">
        Loading interactive map...
      </div>
    ),
  }
);

export function LocationPickerMap(props: LocationPickerMapInnerProps) {
  return <MapContainerInner {...props} />;
}

export default LocationPickerMap;

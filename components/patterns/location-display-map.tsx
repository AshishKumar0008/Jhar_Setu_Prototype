"use client";

import dynamic from "next/dynamic";
import type { LocationDisplayMapInnerProps } from "./location-display-map-inner";

const DisplayMapInner = dynamic(
  () => import("./location-display-map-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 w-full rounded-xl bg-[var(--bg-base,#F7F8FA)] border border-[var(--border-default,#E2E5EA)] animate-pulse flex items-center justify-center text-xs text-[var(--text-muted,#6B7280)] font-medium">
        Loading location map...
      </div>
    ),
  }
);

export function LocationDisplayMap(props: LocationDisplayMapInnerProps) {
  return <DisplayMapInner {...props} />;
}

export default LocationDisplayMap;

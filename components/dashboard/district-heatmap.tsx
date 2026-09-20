"use client";

import dynamic from "next/dynamic";
import type { DistrictHeatmapInnerProps } from "./district-heatmap-inner";

const DistrictHeatmapInner = dynamic(
  () => import("./district-heatmap-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full rounded-2xl bg-[var(--bg-base,#F8FAFC)] border border-[var(--border-default,#E2E8F0)] animate-pulse flex flex-col items-center justify-center text-xs text-[var(--text-muted,#64748B)] font-medium gap-2">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        <span>Loading district analytics map...</span>
      </div>
    ),
  }
);

export function DistrictHeatmap(props: DistrictHeatmapInnerProps) {
  return <DistrictHeatmapInner {...props} />;
}

export default DistrictHeatmap;

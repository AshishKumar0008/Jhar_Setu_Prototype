"use client";

import React from "react";
import { MapPin, Map, Home, CheckCircle2 } from "lucide-react";
import { LocationPickerMap } from "@/components/patterns/location-picker-map";
import { useLanguage } from "@/lib/i18n/language-context";

export interface LocationStepProps {
  locationMethod: "gps" | "map" | "village" | null;
  selectedCoords: { lat: number; lng: number } | null;
  onSelectMethod: (method: "gps" | "map" | "village") => void;
  onSelectCoords: (coords: { lat: number; lng: number }) => void;
}

export function LocationStep({
  locationMethod,
  selectedCoords,
  onSelectMethod,
  onSelectCoords,
}: LocationStepProps) {
  const { t } = useLanguage();

  const handleMethodClick = (method: "gps" | "map" | "village") => {
    onSelectMethod(method);
    if (method === "gps") {
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            onSelectCoords({
              lat: Number(pos.coords.latitude.toFixed(4)),
              lng: Number(pos.coords.longitude.toFixed(4)),
            });
          },
          () => {
            // Default to Ranchi coordinates
            onSelectCoords({ lat: 23.3441, lng: 85.3096 });
          }
        );
      } else {
        onSelectCoords({ lat: 23.3441, lng: 85.3096 });
      }
    } else if (method === "map") {
      if (!selectedCoords) {
        onSelectCoords({ lat: 23.3441, lng: 85.3096 });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[var(--accent-primary)]" />
          <span>{t("reportWizard.whereHappened")}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Geographic coordinates assist field engineers in dispatching rapid repair teams.
        </p>
      </div>

      {/* 3 Large Option Cards */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Select Location Capture Method
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              id: "gps" as const,
              icon: MapPin,
              title: t("reportWizard.useGps"),
              desc: "Auto-detect location from device GPS",
            },
            {
              id: "map" as const,
              icon: Map,
              title: t("reportWizard.chooseMap"),
              desc: "Pinpoint exact spot on Jharkhand map",
            },
            {
              id: "village" as const,
              icon: Home,
              title: t("reportWizard.villageOnly"),
              desc: "Select village & block name only",
            },
          ].map((item) => {
            const isSelected = locationMethod === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMethodClick(item.id)}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 text-center transition-all min-h-[110px] cursor-pointer ${
                  isSelected
                    ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold shadow-sm ring-2 ring-[var(--accent-primary)]/20"
                    : "border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--bg-base)]"
                }`}
              >
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    isSelected
                      ? "bg-[var(--accent-primary)] text-white"
                      : "bg-[var(--bg-base)] text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold">{item.title}</span>
                <span className="text-xs text-[var(--text-muted)] font-normal mt-1 max-w-[200px]">
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Interactive Leaflet Location Picker Map */}
      {locationMethod === "map" && (
        <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <Map className="h-4 w-4 text-[var(--accent-primary)]" />
              Click or drag anywhere on the map to set the incident pin
            </span>
            {selectedCoords && (
              <span className="text-xs font-mono font-semibold text-[var(--accent-primary)] bg-white px-3 py-1 rounded-md border border-[var(--border-default)] shadow-xs">
                📍 {selectedCoords.lat.toFixed(4)}° N, {selectedCoords.lng.toFixed(4)}° E
              </span>
            )}
          </div>
          <LocationPickerMap
            initialPosition={
              selectedCoords
                ? [selectedCoords.lat, selectedCoords.lng]
                : [23.3441, 85.3096]
            }
            onSelect={(lat, lng) =>
              onSelectCoords({
                lat: Number(lat.toFixed(4)),
                lng: Number(lng.toFixed(4)),
              })
            }
            className="h-80 sm:h-96 w-full rounded-xl border border-[var(--border-default)] shadow-xs"
          />
          <p className="text-[11px] text-[var(--text-muted)]">
            CARTO Positron Light Tiles. OpenStreetMap & CARTO attribution.
          </p>
        </div>
      )}

      {/* GPS Captured Confirmation */}
      {locationMethod === "gps" && selectedCoords && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-800 flex flex-wrap items-center justify-between gap-2 animate-in fade-in">
          <span className="flex items-center gap-2 font-medium text-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>GPS Coordinates Captured Successfully</span>
          </span>
          <span className="font-mono font-bold bg-white px-3 py-1 rounded border border-emerald-300">
            📍 {selectedCoords.lat.toFixed(4)}° N, {selectedCoords.lng.toFixed(4)}° E
          </span>
        </div>
      )}

      {/* Village Name Only Notice */}
      {locationMethod === "village" && (
        <div className="p-5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] space-y-1.5 animate-in fade-in">
          <p className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Coarse Locality Assigned:
          </p>
          <p className="text-base font-bold text-[var(--text-primary)]">
            Ranchi District • Kanke Block • Chhotanagpur Region
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Your grievance will be categorized under the regional block desk for administrative dispatch.
          </p>
        </div>
      )}
    </div>
  );
}

export default LocationStep;

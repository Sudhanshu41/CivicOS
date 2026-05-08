"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Zap, Droplets, Construction, ShieldAlert, WifiOff } from "lucide-react";
import { getCityZonePoint, jitterPoint } from "../../../lib/geoUtils";

// ─── Infrastructure Intelligence ──────────────────────────────────────────────
// Subtle tactical markers for persistent city infrastructure status.

interface InfraStatus {
  id: string;
  type: "power" | "water" | "road" | "safety" | "network";
  label: string;
  severity: "low" | "medium" | "high";
  lat: number;
  lng: number;
}

const INFRA_ICONS: Record<InfraStatus["type"], typeof Zap> = {
  power:   Zap,
  water:   Droplets,
  road:    Construction,
  safety:  ShieldAlert,
  network: WifiOff,
};

const INFRA_COLORS: Record<InfraStatus["severity"], string> = {
  low:    "text-emerald-400",
  medium: "text-amber-400",
  high:   "text-rose-400",
};

/**
 * CIVICOS — INFRASTRUCTURE INTELLIGENCE LAYER
 * Renders subtle, tactical icons representing persistent city infrastructure
 * health (signal failures, water leaks, etc.).
 */
export function InfrastructureIntelligenceOverlay() {
  // Static seed data for infra hotspots
  const infraPoints: InfraStatus[] = [
    { id: "p1", type: "power",   label: "Substation B-4",    severity: "medium", ...jitterPoint(getCityZonePoint(1), 0.005) },
    { id: "w1", type: "water",   label: "Main Pipe Fault",   severity: "high",   ...jitterPoint(getCityZonePoint(4), 0.008) },
    { id: "r1", type: "road",    label: "Degraded Pavement", severity: "low",    ...jitterPoint(getCityZonePoint(7), 0.01) },
    { id: "s1", type: "safety",  label: "Camera Offline",    severity: "medium", ...jitterPoint(getCityZonePoint(10), 0.006) },
    { id: "n1", type: "network", label: "5G Node Outage",    severity: "high",   ...jitterPoint(getCityZonePoint(2), 0.004) },
  ];

  return (
    <>
      {infraPoints.map((p) => {
        const Icon = INFRA_ICONS[p.type];
        const color = INFRA_COLORS[p.severity];

        return (
          <AdvancedMarker
            key={p.id}
            position={{ lat: p.lat, lng: p.lng }}
            zIndex={5}
          >
            <div className="relative group">
              {/* Subtle background glow */}
              <div 
                className={`absolute inset-0 rounded-full blur-[4px] opacity-20 ${color.replace('text-', 'bg-')}`}
              />
              <div className={`p-1 rounded bg-black/40 border border-white/5 backdrop-blur-sm ${color} opacity-60 group-hover:opacity-100 transition-opacity`}>
                <Icon className="w-2.5 h-2.5" />
              </div>
              
              {/* Label on hover */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="text-[6px] font-mono font-bold text-white bg-black/80 px-1 py-0.5 rounded border border-white/10 uppercase tracking-widest">
                  {p.label}
                </span>
              </div>
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
}

"use client";

import { useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { getCityZonePoint, jitterPoint } from "../../../lib/geoUtils";
import { Flame, Plus, Shield, Bell, Tent } from "lucide-react";

const CRISIS_CENTER = getCityZonePoint(2);

export function EmergencyFlowOverlay() {
  const map = useMap();
  const circleRef = useRef<google.maps.Circle | null>(null);

  // Generate stable points on mount to avoid hydration mismatch
  const [points] = useState(() => {
    return {
      crisis: jitterPoint(CRISIS_CENTER, 0.02),
      hospitals: [
        { id: "h1", name: "Metro General Hospital", pt: jitterPoint(CRISIS_CENTER, 0.015) },
        { id: "h2", name: "St. Jude Medical Center", pt: jitterPoint(CRISIS_CENTER, 0.03) },
        { id: "h3", name: "City Care Clinic", pt: jitterPoint(CRISIS_CENTER, -0.02) },
      ],
      police: [
        { id: "p1", name: "Central Precinct", pt: jitterPoint(CRISIS_CENTER, 0.025) },
        { id: "p2", name: "Sector 4 PD", pt: jitterPoint(CRISIS_CENTER, -0.015) },
      ],
      fire: [
        { id: "f1", name: "Firehouse 12", pt: jitterPoint(CRISIS_CENTER, 0.02) },
        { id: "f2", name: "Firehouse 7", pt: jitterPoint(CRISIS_CENTER, -0.025) },
      ],
      evac: [
        { id: "e1", name: "Evac Center Alpha", pt: jitterPoint(CRISIS_CENTER, 0.04) },
        { id: "e2", name: "Evac Center Beta", pt: jitterPoint(CRISIS_CENTER, -0.035) },
      ]
    };
  });

  useEffect(() => {
    if (!map) return;

    circleRef.current = new google.maps.Circle({
      strokeColor: "#f43f5e",
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: "#f43f5e",
      fillOpacity: 0.05,
      map,
      center: points.crisis,
      radius: 1200, // 1.2km crisis radius
    });

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
    };
  }, [map, points.crisis]);

  return (
    <>
      {/* Crisis Center Marker */}
      <AdvancedMarker position={points.crisis} zIndex={300} title="Crisis Zone">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 bg-rose-500/20 border border-rose-500/30 rounded-full animate-ping" />
          <div className="absolute w-14 h-14 bg-rose-500/30 rounded-full animate-pulse" />
          <div className="relative bg-rose-500 border-2 border-white rounded-full w-10 h-10 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.6)]">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div className="absolute top-12 whitespace-nowrap bg-rose-500/90 backdrop-blur-md border border-rose-400 text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded shadow-[0_0_10px_rgba(244,63,94,0.5)]">
            Active Emergency
          </div>
        </div>
      </AdvancedMarker>

      {/* Nearby Hospitals */}
      {points.hospitals.map(h => (
        <AdvancedMarker key={h.id} position={h.pt} zIndex={200} title={h.name}>
          <div className="relative flex flex-col items-center group cursor-pointer">
            <div className="bg-black/80 backdrop-blur-md border border-emerald-500 rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <Plus className="w-4 h-4 text-emerald-500 font-bold" />
            </div>
            <div className="absolute top-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md border border-emerald-500/50 text-emerald-400 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded shadow-xl">
              {h.name}
            </div>
          </div>
        </AdvancedMarker>
      ))}

      {/* Police Stations */}
      {points.police.map(p => (
        <AdvancedMarker key={p.id} position={p.pt} zIndex={190} title={p.name}>
          <div className="relative flex flex-col items-center group cursor-pointer">
            <div className="bg-black/80 backdrop-blur-md border border-blue-500 rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="absolute top-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md border border-blue-500/50 text-blue-400 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded shadow-xl">
              {p.name}
            </div>
          </div>
        </AdvancedMarker>
      ))}

      {/* Fire Stations */}
      {points.fire.map(f => (
        <AdvancedMarker key={f.id} position={f.pt} zIndex={190} title={f.name}>
          <div className="relative flex flex-col items-center group cursor-pointer">
            <div className="bg-black/80 backdrop-blur-md border border-orange-500 rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]">
              <Bell className="w-3.5 h-3.5 text-orange-500" />
            </div>
            <div className="absolute top-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md border border-orange-500/50 text-orange-400 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded shadow-xl">
              {f.name}
            </div>
          </div>
        </AdvancedMarker>
      ))}

      {/* Evacuation Centres */}
      {points.evac.map(e => (
        <AdvancedMarker key={e.id} position={e.pt} zIndex={180} title={e.name}>
          <div className="relative flex flex-col items-center group cursor-pointer">
            <div className="bg-amber-500/20 backdrop-blur-md border border-amber-500 rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse">
              <Tent className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="absolute top-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md border border-amber-500/50 text-amber-400 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded shadow-xl">
              {e.name}
            </div>
          </div>
        </AdvancedMarker>
      ))}
    </>
  );
}

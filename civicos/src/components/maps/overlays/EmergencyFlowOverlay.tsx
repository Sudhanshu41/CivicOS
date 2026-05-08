"use client";

import { useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { getCityZonePoint, jitterPoint } from "../../../lib/geoUtils";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

export function EmergencyFlowOverlay() {
  const map = useMap();
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map) return;

    const centerPoint = jitterPoint(getCityZonePoint(2), 0.02);

    circleRef.current = new google.maps.Circle({
      strokeColor: "#f43f5e",
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: "#f43f5e",
      fillOpacity: 0.05,
      map,
      center: centerPoint,
      radius: 1200, // 1.2km crisis radius
    });

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
    };
  }, [map]);

  const crisisPoint = jitterPoint(getCityZonePoint(2), 0.02);

  return (
    <>
      <AdvancedMarker position={crisisPoint} zIndex={300} title="Crisis Zone">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full animate-ping" />
          <div className="relative bg-rose-500/20 border border-rose-500/50 rounded-full w-10 h-10 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)]">
            <Flame className="w-5 h-5 text-rose-500" />
          </div>
        </div>
      </AdvancedMarker>
    </>
  );
}

"use client";

import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { getCityZonePoint, jitterPoint } from "../../../lib/geoUtils";

// Sample traffic routes for the overlay
const ROUTES = [
  { id: "main-artery", color: "#FFD500", weight: 4, isEmergency: false },
  { id: "emergency-corridor", color: "#ef4444", weight: 3, isEmergency: true },
  { id: "transit-line", color: "#3b82f6", weight: 2, isEmergency: false }
];

export function TrafficFlowOverlay() {
  const map = useMap();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map) return;

    // Create polylines
    ROUTES.forEach((route, idx) => {
      const basePoint = getCityZonePoint(idx);
      const path = [
        jitterPoint(basePoint, 0.05),
        jitterPoint(basePoint, 0.03),
        jitterPoint(basePoint, 0.01),
        jitterPoint(basePoint, -0.02),
        jitterPoint(basePoint, -0.04),
      ];

      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: route.color,
        strokeOpacity: 0.8,
        strokeWeight: route.weight,
        map,
      });

      polylinesRef.current.push(polyline);
    });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map]);

  return null;
}

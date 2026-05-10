"use client";

import { useEffect, useRef } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCityOperations } from "../../../stores/cityOperations";
import { getCityZonePoint } from "../../../lib/geoUtils";

// ─── Department Coverage Zones ────────────────────────────────────────────────
// Each department covers a cluster of city zones with colored polygon overlays.

interface DeptZoneConfig {
  id: string;
  name: string;
  zoneIndices: number[];  // which city grid points this dept covers
  fillColor: string;
  strokeColor: string;
}

const DEPT_ZONES: DeptZoneConfig[] = [
  {
    id: "infrastructure",
    name: "Infrastructure",
    zoneIndices: [0, 2, 6],
    fillColor: "#3b82f6",
    strokeColor: "#60a5fa",
  },
  {
    id: "traffic",
    name: "Traffic Control",
    zoneIndices: [1, 4, 8],
    fillColor: "#f59e0b",
    strokeColor: "#fbbf24",
  },
  {
    id: "emergency",
    name: "Emergency Services",
    zoneIndices: [3, 10, 14],
    fillColor: "#ef4444",
    strokeColor: "#f87171",
  },
  {
    id: "utilities",
    name: "Utilities",
    zoneIndices: [5, 9, 12],
    fillColor: "#f97316",
    strokeColor: "#fb923c",
  },
  {
    id: "sanitation",
    name: "Sanitation",
    zoneIndices: [7, 11, 13],
    fillColor: "#22c55e",
    strokeColor: "#4ade80",
  },
];

// Build a convex polygon from a set of GeoPoints (uses center + jittered corners)
function buildZonePolygon(zoneIndices: number[]): google.maps.LatLngLiteral[] {
  const centers = zoneIndices.map((i) => getCityZonePoint(i));

  // Compute centroid
  const centroid = {
    lat: centers.reduce((s, p) => s + p.lat, 0) / centers.length,
    lng: centers.reduce((s, p) => s + p.lng, 0) / centers.length,
  };

  // Build polygon corners from each center point, spread out from centroid
  const corners: google.maps.LatLngLiteral[] = centers.map((c) => ({
    lat: centroid.lat + (c.lat - centroid.lat) * 1.8,
    lng: centroid.lng + (c.lng - centroid.lng) * 1.8,
  }));

  // Sort corners by angle for a proper polygon
  corners.sort((a, b) => {
    const angleA = Math.atan2(a.lat - centroid.lat, a.lng - centroid.lng);
    const angleB = Math.atan2(b.lat - centroid.lat, b.lng - centroid.lng);
    return angleA - angleB;
  });

  return corners;
}

/**
 * CIVICOS — DEPARTMENT COVERAGE OVERLAY
 * Renders operational territory polygons for each city department.
 * Color intensity reflects department load.
 */
export function DepartmentCoverageOverlay() {
  const map = useMap();
  const mapsCore = useMapsLibrary("core");
  const departments = useCityOperations((s) => s.departments);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);

  useEffect(() => {
    if (!map || !mapsCore) return;

    // Clear previous
    polygonsRef.current.forEach((p) => p.setMap(null));
    polygonsRef.current = [];

    DEPT_ZONES.forEach((config) => {
      const dept = departments.find((d) => d.id === config.id);
      const overloaded = dept?.status === "critical";
      const elevated   = dept?.status === "elevated";

      // Adjust opacity based on load
      const fillOpacity = overloaded ? 0.14 : elevated ? 0.09 : 0.05;
      const strokeOpacity = overloaded ? 0.5 : elevated ? 0.35 : 0.2;

      const paths = buildZonePolygon(config.zoneIndices);

      const polygon = new google.maps.Polygon({
        paths,
        fillColor: config.fillColor,
        fillOpacity,
        strokeColor: config.strokeColor,
        strokeOpacity,
        strokeWeight: overloaded ? 1.5 : 0.8,
        map,
        zIndex: overloaded ? 5 : 2,
      });

      polygonsRef.current.push(polygon);
    });

    return () => {
      polygonsRef.current.forEach((p) => p.setMap(null));
      polygonsRef.current = [];
    };
  }, [map, mapsCore, departments]);

  return null;
}

"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

// ============================================================
// CIVICOS — MAP PROVIDER
// Production-grade Google Maps integration for city intelligence.
// Wraps @vis.gl/react-google-maps APIProvider with CivicOS config.
// ============================================================

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Tactical dark city map style — premium, restrained, futuristic
export const CIVIC_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry",        stylers: [{ color: "#04020f" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#04020f" }] },
  { elementType: "labels.text.fill",   stylers: [{ color: "#3a3a4a" }] },
  { featureType: "administrative",  elementType: "geometry.stroke",  stylers: [{ color: "#1a1a2e" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#2a2a3a" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#060415" }] },
  { featureType: "poi",               elementType: "geometry", stylers: [{ color: "#07061a" }] },
  { featureType: "poi",               elementType: "labels.text.fill", stylers: [{ color: "#2a2a3a" }] },
  { featureType: "poi.park",          elementType: "geometry",         stylers: [{ color: "#050318" }] },
  { featureType: "poi.park",          elementType: "labels.text.fill", stylers: [{ color: "#1f3020" }] },
  { featureType: "road",              elementType: "geometry",         stylers: [{ color: "#0e0e22" }] },
  { featureType: "road",              elementType: "geometry.stroke",  stylers: [{ color: "#1a1a30" }] },
  { featureType: "road",              elementType: "labels.text.fill", stylers: [{ color: "#2a2a4a" }] },
  { featureType: "road.highway",      elementType: "geometry",         stylers: [{ color: "#12102a" }] },
  { featureType: "road.highway",      elementType: "geometry.stroke",  stylers: [{ color: "#1e1c40" }] },
  { featureType: "road.highway",      elementType: "labels.text.fill", stylers: [{ color: "#3a3860" }] },
  { featureType: "transit",           elementType: "geometry",         stylers: [{ color: "#080820" }] },
  { featureType: "transit.station",   elementType: "labels.text.fill", stylers: [{ color: "#2a2a4a" }] },
  { featureType: "water",             elementType: "geometry",         stylers: [{ color: "#010110" }] },
  { featureType: "water",             elementType: "labels.text.fill", stylers: [{ color: "#1a1a2a" }] },
  { featureType: "water",             elementType: "labels.text.stroke",stylers: [{ color: "#04020f" }] },
];

// Default city center — Bengaluru, India
export const DEFAULT_CITY_CENTER = { lat: 12.9716, lng: 77.5946 };
export const DEFAULT_ZOOM = 13;

interface MapContextType {
  apiKey: string;
  isConfigured: boolean;
}

const MapContext = createContext<MapContextType>({
  apiKey: "",
  isConfigured: false,
});

export function useMapContext() {
  return useContext(MapContext);
}

interface MapProviderProps {
  children: ReactNode;
}

/**
 * CIVICOS — MAP PROVIDER
 * Wraps the application with Google Maps API context.
 * Must be mounted at dashboard layout level for SSR safety.
 */
export function MapProvider({ children }: MapProviderProps) {
  const isConfigured = !!GOOGLE_MAPS_API_KEY;

  if (!isConfigured) {
    // Graceful degradation — render children without map API
    return (
      <MapContext.Provider value={{ apiKey: "", isConfigured: false }}>
        {children}
      </MapContext.Provider>
    );
  }

  return (
    <MapContext.Provider value={{ apiKey: GOOGLE_MAPS_API_KEY, isConfigured: true }}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={["visualization"]}>
        {children}
      </APIProvider>
    </MapContext.Provider>
  );
}

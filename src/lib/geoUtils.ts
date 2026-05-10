// CIVICOS — GEOSPATIAL UTILITIES
// Shared types and helpers for city intelligence map operations.

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoIncident extends GeoPoint {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "escalated" | "resolved" | "pending";
  category: string;
  workflowId?: string;
  department?: string;
  timestamp: string;
}

export interface GeoBound {
  north: number;
  south: number;
  east: number;
  west: number;
}

// City zones around Bengaluru center for realistic incident distribution
const CITY_GRID: GeoPoint[] = [
  { lat: 12.9716, lng: 77.5946 }, // City Center
  { lat: 12.9784, lng: 77.6408 }, // Indiranagar
  { lat: 12.9352, lng: 77.6245 }, // Koramangala
  { lat: 12.9630, lng: 77.5476 }, // Rajajinagar
  { lat: 13.0067, lng: 77.5963 }, // Mathikere
  { lat: 12.9279, lng: 77.6271 }, // BTM Layout
  { lat: 12.9820, lng: 77.5512 }, // Malleswaram
  { lat: 12.9007, lng: 77.6085 }, // JP Nagar
  { lat: 13.0153, lng: 77.6400 }, // Kalyan Nagar
  { lat: 12.9502, lng: 77.5600 }, // Vijayanagar
  { lat: 13.0298, lng: 77.5588 }, // Yeshwanthpur
  { lat: 12.9445, lng: 77.6930 }, // Whitefield
  { lat: 12.9010, lng: 77.5580 }, // Banashankari
  { lat: 12.9850, lng: 77.7235 }, // Mahadevapura
  { lat: 12.9260, lng: 77.5490 }, // Kanakapura Road
];

// Jitter a point by a small random offset for realistic scatter
export function jitterPoint(base: GeoPoint, radiusDeg = 0.008): GeoPoint {
  const angle = Math.random() * 2 * Math.PI;
  const r = Math.random() * radiusDeg;
  return {
    lat: base.lat + r * Math.cos(angle),
    lng: base.lng + r * Math.sin(angle),
  };
}

// Get a deterministic city grid position from an index
export function getCityZonePoint(index: number): GeoPoint {
  return CITY_GRID[index % CITY_GRID.length];
}

// Generate a realistic set of seed incidents seeded from city zones
let _seedCounter = 0;
export function generateSeedIncident(overrides: Partial<GeoIncident> = {}): GeoIncident {
  const base = CITY_GRID[_seedCounter % CITY_GRID.length];
  const location = jitterPoint(base, 0.012);
  _seedCounter++;

  return {
    id: `seed-${_seedCounter}`,
    title: "Civic Alert",
    severity: "medium",
    status: "active",
    category: "infrastructure",
    timestamp: new Date().toISOString(),
    ...location,
    ...overrides,
  };
}

// Haversine distance between two geo points (km)
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sin2 =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
    Math.cos((b.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(sin2));
}

// Map incident category to a Google Maps hex marker color
export const CATEGORY_HEX: Record<string, string> = {
  infrastructure:  "#3b82f6",  // blue
  traffic:         "#f59e0b",  // amber
  emergency:       "#ef4444",  // rose
  sanitation:      "#22c55e",  // green
  environmental:   "#14b8a6",  // teal
  utility_failure: "#f97316",  // orange
  public_safety:   "#a855f7",  // purple
};

// Map severity to a z-index weight
export const SEVERITY_ZINDEX: Record<string, number> = {
  critical: 100,
  high: 80,
  medium: 50,
  low: 20,
};

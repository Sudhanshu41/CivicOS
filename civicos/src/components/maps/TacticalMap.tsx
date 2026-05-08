"use client";

import { useMemo, useCallback, useEffect, useRef } from "react";
import {
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useOrchestrationRegistry } from "../../stores/orchestrationRegistry";
import { useCityOperations, CityIncident } from "../../stores/cityOperations";
import {
  CIVIC_MAP_STYLE,
  DEFAULT_CITY_CENTER,
  DEFAULT_ZOOM,
} from "../../providers/MapProvider";
import {
  CATEGORY_HEX,
  SEVERITY_ZINDEX,
  getCityZonePoint,
  jitterPoint,
  type GeoIncident,
} from "../../lib/geoUtils";
import { useReplayStore } from "../../stores/replayStore";

// ─── Incident Marker ────────────────────────────────────────────────────────

function IncidentMarker({
  incident,
  onClick,
}: {
  incident: GeoIncident;
  onClick: (id: string) => void;
}) {
  const color = CATEGORY_HEX[incident.category] || "#9ca3af";
  const zIndex = SEVERITY_ZINDEX[incident.severity] || 10;
  const isActive = incident.status === "active" || incident.status === "escalated";
  const isCritical = incident.severity === "critical";
  const isEscalated = incident.status === "escalated";

  return (
    <AdvancedMarker
      position={{ lat: incident.lat, lng: incident.lng }}
      zIndex={zIndex}
      onClick={() => onClick(incident.id)}
      title={incident.title}
    >
      <div className="relative flex items-center justify-center cursor-pointer group">
        {/* Outer pulse ring — only for active/escalated */}
        {isActive && (
          <div
            className="absolute rounded-full animate-ping"
            style={{
              width: isCritical ? 40 : 28,
              height: isCritical ? 40 : 28,
              backgroundColor: color,
              opacity: 0.2,
            }}
          />
        )}
        {/* Secondary pulse ring for escalated */}
        {isEscalated && (
          <div
            className="absolute rounded-full animate-ping"
            style={{
              width: 52,
              height: 52,
              backgroundColor: color,
              opacity: 0.1,
              animationDelay: "0.3s",
            }}
          />
        )}
        {/* Core marker dot */}
        <div
          className="relative rounded-full border-2 transition-transform group-hover:scale-125"
          style={{
            width: isCritical ? 18 : 12,
            height: isCritical ? 18 : 12,
            backgroundColor: color,
            borderColor: `${color}80`,
            boxShadow: `0 0 ${isCritical ? 16 : 8}px ${color}88`,
          }}
        />
      </div>
    </AdvancedMarker>
  );
}

// ─── Workflow Marker ─────────────────────────────────────────────────────────

function WorkflowMarker({ workflowId, point, status, priority }: {
  workflowId: string;
  point: { lat: number; lng: number };
  status: string;
  priority: string;
}) {
  const isRunning = status === "running";
  const isEmergency = priority === "emergency";

  return (
    <AdvancedMarker position={point} zIndex={isEmergency ? 200 : 60} title={workflowId}>
      <div className="relative flex items-center justify-center">
        {isRunning && (
          <div
            className="absolute rounded-full animate-ping"
            style={{
              width: 36,
              height: 36,
              backgroundColor: isEmergency ? "#ef4444" : "#FFD500",
              opacity: 0.15,
            }}
          />
        )}
        <div
          className="relative rounded-full border flex items-center justify-center"
          style={{
            width: 20,
            height: 20,
            backgroundColor: isRunning ? (isEmergency ? "#ef4444" : "#FFD500") : "#1a1a2e",
            borderColor: isRunning ? (isEmergency ? "#ef4444" : "#FFD500") : "#333",
            boxShadow: isRunning ? `0 0 12px ${isEmergency ? "#ef444488" : "#FFD50088"}` : "none",
          }}
        >
          <span className="text-[6px] font-mono font-bold text-black select-none">AI</span>
        </div>
      </div>
    </AdvancedMarker>
  );
}

// ─── Heatmap Layer ────────────────────────────────────────────────────────────

function HeatmapLayer({ incidents }: { incidents: GeoIncident[] }) {
  const map = useMap();
  const visualization = useMapsLibrary("visualization");
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!map || !visualization) return;

    const weightedPoints = incidents
      .filter((i) => i.status !== "resolved")
      .map((i) => ({
        location: new google.maps.LatLng(i.lat, i.lng),
        weight: i.severity === "critical" ? 4 : i.severity === "high" ? 2.5 : i.severity === "medium" ? 1.5 : 1,
      }));

    if (heatmapRef.current) {
      heatmapRef.current.setData(weightedPoints);
    } else {
      heatmapRef.current = new visualization.HeatmapLayer({
        data: weightedPoints,
        map,
        radius: 50,
        opacity: 0.35,
        gradient: [
          "rgba(0, 0, 0, 0)",
          "rgba(30, 0, 60, 0.4)",
          "rgba(80, 0, 100, 0.5)",
          "rgba(160, 10, 60, 0.6)",
          "rgba(220, 30, 30, 0.7)",
          "rgba(255, 80, 0, 0.8)",
          "rgba(255, 213, 0, 0.9)",
        ],
      });
    }

    return () => {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
    };
  }, [map, visualization, incidents]);

  return null;
}

// ─── Main TacticalMap Component ─────────────────────────────────────────────────

export interface TacticalMapProps {
  filter?: string;
  showHeatmap?: boolean;
  showWorkflows?: boolean;
  onIncidentSelect?: (id: string | null) => void;
  selectedIncidentId?: string | null;
  children?: React.ReactNode;
}

export function TacticalMap({
  filter = "all",
  showHeatmap = true,
  showWorkflows = true,
  onIncidentSelect,
  selectedIncidentId,
  children,
}: TacticalMapProps) {
  const storedIncidents = useCityOperations((s) => s.incidents);
  const workflows       = useOrchestrationRegistry((s) => s.workflows);
  const { status: replayStatus, currentTime, startTime } = useReplayStore();

  // Calculate current simulation time in ms
  const simulationTimeMs = useMemo(() => {
    const startMs = new Date(startTime).getTime();
    const windowMs = 24 * 60 * 60 * 1000; // 24h
    return startMs + (currentTime / 100) * windowMs;
  }, [startTime, currentTime]);

  // Convert stored incidents → GeoIncident, assigning city zone positions if missing
  const geoIncidents: GeoIncident[] = useMemo(() => {
    return Object.values(storedIncidents)
      .filter(inc => {
        if (replayStatus === "live") return true;
        // Only show incidents that occurred before or at simulation time
        return new Date(inc.timestamp).getTime() <= simulationTimeMs;
      })
      .map((inc: CityIncident, i) => ({
        id: inc.id,
      title: inc.title,
      severity: inc.severity,
      status: inc.status,
      category: inc.category,
      workflowId: inc.workflowId,
      department: inc.department,
      timestamp: inc.timestamp,
      lat: inc.location.lat || jitterPoint(getCityZonePoint(i), 0.015).lat,
      lng: inc.location.lng || jitterPoint(getCityZonePoint(i), 0.015).lng,
    }));
  }, [storedIncidents, replayStatus, simulationTimeMs]);

  // Map workflow IDs → geographic positions (deterministic from workflow index)
  const workflowGeoPoints = useMemo(() => {
    return Object.values(workflows).map((wf, i) => {
      const base = getCityZonePoint(i + 3);
      const pt = jitterPoint(base, 0.01);
      return { ...wf, lat: pt.lat, lng: pt.lng };
    });
  }, [workflows]);

  const filtered = useMemo(() =>
    filter === "all" ? geoIncidents : geoIncidents.filter((i) => i.category === filter),
    [geoIncidents, filter]
  );

  const handleMarkerClick = useCallback((id: string) => {
    onIncidentSelect?.(id === selectedIncidentId ? null : id);
  }, [onIncidentSelect, selectedIncidentId]);

  return (
    <Map
      defaultCenter={DEFAULT_CITY_CENTER}
      defaultZoom={DEFAULT_ZOOM}
      mapId="civicos-tactical"
      styles={CIVIC_MAP_STYLE}
      disableDefaultUI
      gestureHandling="greedy"
      className="w-full h-full"
    >
      {/* Heatmap overlay */}
      {showHeatmap && <HeatmapLayer incidents={filtered} />}

      {/* Incident markers */}
      {filtered.map((incident) => (
        <IncidentMarker
          key={incident.id}
          incident={incident}
          onClick={handleMarkerClick}
        />
      ))}

      {/* Live workflow markers */}
      {showWorkflows && workflowGeoPoints.map((wf) => (
        <WorkflowMarker
          key={wf.issue_id}
          workflowId={wf.issue_id}
          point={{ lat: wf.lat, lng: wf.lng }}
          status={wf.status}
          priority={wf.priority}
        />
      ))}

      {/* Additional overlay children (DepartmentCoverage, WorkflowPropagation, etc.) */}
      {children}
    </Map>
  );
}


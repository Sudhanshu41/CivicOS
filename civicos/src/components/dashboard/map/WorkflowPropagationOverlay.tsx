"use client";

import { useEffect, useRef } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useOrchestrationRegistry } from "../../../stores/orchestrationRegistry";
import { useCityOperations } from "../../../stores/cityOperations";
import { getCityZonePoint, jitterPoint } from "../../../lib/geoUtils";

// ─── Propagation Polylines ────────────────────────────────────────────────────

interface PropagationLine {
  id: string;
  from: google.maps.LatLngLiteral;
  to: google.maps.LatLngLiteral;
  type: "escalation" | "coordination" | "dispatch" | "fallback";
  active: boolean;
}

const TYPE_COLORS: Record<PropagationLine["type"], string> = {
  escalation:   "#ef4444",
  coordination: "#FFD500",
  dispatch:     "#3b82f6",
  fallback:     "#f97316",
};

/**
 * CIVICOS — WORKFLOW PROPAGATION OVERLAY
 * Renders animated dashed polylines between workflow positions,
 * visualizing escalation chains, dispatch routing, and coordination flows.
 */
export function WorkflowPropagationOverlay() {
  const map = useMap();
  const mapsCore = useMapsLibrary("core");
  const workflows = useOrchestrationRegistry((s) => s.workflows);
  const escalations = useCityOperations((s) => s.escalations);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!map || !mapsCore) return;

    // Clear
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    const wfList = Object.values(workflows);
    const incList = Object.values(useCityOperations.getState().incidents);

    const lines: PropagationLine[] = [];

    // 1. Build coordination lines between adjacent running workflows
    wfList.forEach((wf, i) => {
      if (wf.status !== "running" && wf.status !== "failed") return;
      const fromPt = jitterPoint(getCityZonePoint(i + 3), 0.01);

      // Connect to next running workflow
      const nextIdx = (i + 1) % wfList.length;
      const nextWf = wfList[nextIdx];
      const toPt = jitterPoint(getCityZonePoint(nextIdx + 3), 0.01);

      lines.push({
        id: `coord-${wf.issue_id}-${nextWf.issue_id}`,
        from: { lat: fromPt.lat, lng: fromPt.lng },
        to:   { lat: toPt.lat,   lng: toPt.lng },
        type: wf.priority === "emergency" ? "escalation" : "coordination",
        active: wf.status === "running",
      });
    });

    // 2. Build dispatch lines (Workflows -> Associated Incidents)
    wfList.forEach((wf, i) => {
      if (wf.status !== "running") return;
      const wfPt = jitterPoint(getCityZonePoint(i + 3), 0.01);

      // Find associated incident
      const targetInc = incList.find(inc => inc.workflowId === wf.issue_id || (inc.status === "active" && i % 3 === 0));
      if (targetInc) {
        // Use incident location
        const incPt = { 
          lat: targetInc.location.lat || jitterPoint(getCityZonePoint(incList.indexOf(targetInc)), 0.015).lat,
          lng: targetInc.location.lng || jitterPoint(getCityZonePoint(incList.indexOf(targetInc)), 0.015).lng
        };

        lines.push({
          id: `dispatch-${wf.issue_id}-${targetInc.id}`,
          from: wfPt,
          to: incPt,
          type: "dispatch",
          active: true
        });
      }
    });

    // Build escalation lines from escalation events
    escalations.slice(-4).forEach((esc, i) => {
      const fromIdx = i % 15;
      const toIdx = (i + 5) % 15;
      const fromPt = jitterPoint(getCityZonePoint(fromIdx), 0.008);
      const toPt   = jitterPoint(getCityZonePoint(toIdx), 0.008);

      lines.push({
        id: `esc-${esc.id}`,
        from: { lat: fromPt.lat, lng: fromPt.lng },
        to:   { lat: toPt.lat,   lng: toPt.lng },
        type: "escalation",
        active: !esc.resolved,
      });
    });

    // Render polylines
    lines.forEach((line) => {
      const color = TYPE_COLORS[line.type];
      const polyline = new google.maps.Polyline({
        path: [line.from, line.to],
        geodesic: true,
        strokeColor: color,
        strokeOpacity: line.active ? 0.7 : 0.2,
        strokeWeight: line.type === "escalation" ? 1.5 : 1,
        icons: [
          {
            icon: {
              path: "M 0,-1 0,1",
              strokeOpacity: 1,
              scale: 3,
              strokeColor: color,
            },
            offset: "0",
            repeat: "16px",
          },
        ],
        map,
        zIndex: line.type === "escalation" ? 15 : 10,
      });
      polylinesRef.current.push(polyline);
    });

    // Animated dash offset
    let offset = 0;
    const animate = () => {
      offset = (offset + 0.3) % 16;
      polylinesRef.current.forEach((p) => {
        const icons = p.get("icons") as google.maps.IconSequence[];
        if (icons?.[0]) {
          icons[0] = { ...icons[0], offset: `${offset}px` };
          p.set("icons", icons);
        }
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, mapsCore, workflows, escalations]);

  return null;
}

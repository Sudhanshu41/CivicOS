"use client";

import { create } from 'zustand';

// ==============================================================
// CIVICOS — CITY OPERATIONS STORE
// Citywide incident registry, department load, escalation chains
// ==============================================================

export type IncidentCategory =
  | "infrastructure"
  | "traffic"
  | "emergency"
  | "sanitation"
  | "environmental"
  | "utility_failure"
  | "public_safety";

export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type IncidentStatus = "active" | "escalated" | "resolved" | "pending";

export interface CityIncident {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  workflowId?: string;
  location: { lat: number; lng: number; label: string };
  timestamp: string;
  department?: string;
  escalationChain?: string[];
}

export interface DepartmentLoad {
  id: string;
  name: string;
  activeIncidents: number;
  capacity: number;
  status: "nominal" | "elevated" | "critical";
}

export interface EscalationEvent {
  id: string;
  fromWorkflow: string;
  toWorkflow?: string;
  reason: string;
  severity: IncidentSeverity;
  timestamp: string;
  resolved: boolean;
}

export interface CityOperationsState {
  incidents: Record<string, CityIncident>;
  departments: DepartmentLoad[];
  escalations: EscalationEvent[];
  cityMetrics: {
    activeIncidents: number;
    resolvedToday: number;
    criticalEscalations: number;
    aiCoordinationScore: number;
    avgResolutionMs: number;
  };

  // Actions
  upsertIncident: (incident: CityIncident) => void;
  resolveIncident: (id: string) => void;
  escalateIncident: (id: string, event: EscalationEvent) => void;
  updateDepartmentLoad: (departments: DepartmentLoad[]) => void;
  updateCityMetrics: (data: Partial<CityOperationsState["cityMetrics"]>) => void;
}

const SEED_DEPARTMENTS: DepartmentLoad[] = [
  { id: "infrastructure", name: "Infrastructure", activeIncidents: 3, capacity: 10, status: "nominal" },
  { id: "traffic",        name: "Traffic Control", activeIncidents: 7, capacity: 8, status: "elevated" },
  { id: "emergency",      name: "Emergency Services", activeIncidents: 2, capacity: 12, status: "nominal" },
  { id: "utilities",      name: "Utilities", activeIncidents: 4, capacity: 9, status: "nominal" },
  { id: "sanitation",     name: "Sanitation", activeIncidents: 1, capacity: 6, status: "nominal" },
  { id: "public_safety",  name: "Public Safety", activeIncidents: 5, capacity: 10, status: "elevated" },
];

const SEED_INCIDENTS: Record<string, CityIncident> = {
  "inc-001": { id: "inc-001", title: "Pothole Cluster — MG Road", category: "infrastructure", severity: "medium", status: "active", location: { lat: 12.9716, lng: 77.5946, label: "MG Road" }, timestamp: new Date(Date.now() - 3600000).toISOString(), department: "infrastructure" },
  "inc-002": { id: "inc-002", title: "Signal Failure — Brigade Rd", category: "traffic", severity: "high", status: "active", location: { lat: 12.9784, lng: 77.6408, label: "Indiranagar" }, timestamp: new Date(Date.now() - 2400000).toISOString(), department: "traffic" },
  "inc-003": { id: "inc-003", title: "Gas Leak — Koramangala", category: "utility_failure", severity: "critical", status: "escalated", location: { lat: 12.9352, lng: 77.6245, label: "Koramangala" }, timestamp: new Date(Date.now() - 1800000).toISOString(), department: "utilities" },
  "inc-004": { id: "inc-004", title: "Flooding — Rajajinagar", category: "environmental", severity: "high", status: "active", location: { lat: 12.9630, lng: 77.5476, label: "Rajajinagar" }, timestamp: new Date(Date.now() - 900000).toISOString(), department: "infrastructure" },
  "inc-005": { id: "inc-005", title: "Fire Alarm — Mathikere", category: "emergency", severity: "critical", status: "escalated", location: { lat: 13.0067, lng: 77.5963, label: "Mathikere" }, timestamp: new Date(Date.now() - 600000).toISOString(), department: "emergency" },
  "inc-006": { id: "inc-006", title: "Sewage Overflow — BTM", category: "sanitation", severity: "medium", status: "active", location: { lat: 12.9279, lng: 77.6271, label: "BTM Layout" }, timestamp: new Date(Date.now() - 300000).toISOString(), department: "sanitation" },
  "inc-007": { id: "inc-007", title: "Power Outage — Malleswaram", category: "utility_failure", severity: "high", status: "active", location: { lat: 12.9820, lng: 77.5512, label: "Malleswaram" }, timestamp: new Date(Date.now() - 200000).toISOString(), department: "utilities" },
  "inc-008": { id: "inc-008", title: "Vandalism — JP Nagar", category: "public_safety", severity: "low", status: "pending", location: { lat: 12.9007, lng: 77.6085, label: "JP Nagar" }, timestamp: new Date(Date.now() - 120000).toISOString(), department: "public_safety" },
  "inc-009": { id: "inc-009", title: "Road Cave-In — Whitefield", category: "infrastructure", severity: "critical", status: "escalated", location: { lat: 12.9445, lng: 77.6930, label: "Whitefield" }, timestamp: new Date(Date.now() - 60000).toISOString(), department: "infrastructure" },
  "inc-010": { id: "inc-010", title: "Crowd Control — Yeshwanthpur", category: "public_safety", severity: "medium", status: "active", location: { lat: 13.0298, lng: 77.5588, label: "Yeshwanthpur" }, timestamp: new Date(Date.now() - 30000).toISOString(), department: "public_safety" },
};

export const useCityOperations = create<CityOperationsState>((set) => ({
  incidents: SEED_INCIDENTS,
  departments: SEED_DEPARTMENTS,
  escalations: [],
  cityMetrics: {
    activeIncidents: 22,
    resolvedToday: 108,
    criticalEscalations: 0,
    aiCoordinationScore: 94.2,
    avgResolutionMs: 4820,
  },

  upsertIncident: (incident) => set((state) => ({
    incidents: { ...state.incidents, [incident.id]: incident },
    cityMetrics: {
      ...state.cityMetrics,
      activeIncidents: Object.values({ ...state.incidents, [incident.id]: incident })
        .filter(i => i.status === "active" || i.status === "escalated").length,
    }
  })),

  resolveIncident: (id) => set((state) => {
    const updated = { ...state.incidents };
    if (updated[id]) {
      updated[id] = { ...updated[id], status: "resolved" };
    }
    return {
      incidents: updated,
      cityMetrics: {
        ...state.cityMetrics,
        activeIncidents: Object.values(updated).filter(i => i.status === "active" || i.status === "escalated").length,
        resolvedToday: state.cityMetrics.resolvedToday + 1,
      }
    };
  }),

  escalateIncident: (id, event) => set((state) => {
    const updated = { ...state.incidents };
    if (updated[id]) {
      updated[id] = {
        ...updated[id],
        status: "escalated",
        escalationChain: [...(updated[id].escalationChain || []), event.id]
      };
    }
    return {
      incidents: updated,
      escalations: [...state.escalations, event],
      cityMetrics: {
        ...state.cityMetrics,
        criticalEscalations: state.escalations.filter(e => !e.resolved).length + 1,
      }
    };
  }),

  updateDepartmentLoad: (departments) => set({ departments }),

  updateCityMetrics: (data) => set((state) => ({
    cityMetrics: { ...state.cityMetrics, ...data }
  })),
}));

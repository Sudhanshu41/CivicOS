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

export const useCityOperations = create<CityOperationsState>((set) => ({
  incidents: {},
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

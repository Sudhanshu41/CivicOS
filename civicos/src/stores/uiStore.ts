"use client";

import { create } from 'zustand';

interface UIState {
  aiCopilotOpen: boolean;
  incidentModalOpen: boolean;
  toggleAiCopilot: () => void;
  openAiCopilot: () => void;
  closeAiCopilot: () => void;
  toggleIncidentModal: () => void;
  openIncidentModal: () => void;
  closeIncidentModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  aiCopilotOpen: false,
  incidentModalOpen: false,
  toggleAiCopilot: () => set((state) => ({ aiCopilotOpen: !state.aiCopilotOpen })),
  openAiCopilot: () => set({ aiCopilotOpen: true }),
  closeAiCopilot: () => set({ aiCopilotOpen: false }),
  toggleIncidentModal: () => set((state) => ({ incidentModalOpen: !state.incidentModalOpen })),
  openIncidentModal: () => set({ incidentModalOpen: true }),
  closeIncidentModal: () => set({ incidentModalOpen: false }),
}));

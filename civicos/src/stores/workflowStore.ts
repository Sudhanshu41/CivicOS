import { create } from 'zustand';
import { NodeUpdatePayload, LogAppendPayload, WorkflowStatus } from '../types/orchestration';

export type SystemStatus = "online" | "degraded" | "offline" | "maintenance";

export interface WorkflowState {
  issue_id: string;
  status: WorkflowStatus;
  nodes: Record<string, NodeUpdatePayload>;
  logs: LogAppendPayload[];
  reasoning: string;
  telemetry: {
    startTime: string | null;
    endTime: string | null;
    totalLatency: number;
    tokensUsed: number;
    retries: number;
  };
  health: {
    backend: SystemStatus;
    websocket: SystemStatus;
    aiProvider: SystemStatus;
    database: SystemStatus;
  };
  systemTelemetry: {
    wsLatency: number;
    activeWorkflows: number;
    totalRetries: number;
    fallbackActivations: number;
  };
}

interface WorkflowStore extends WorkflowState {
  // Actions
  setWorkflowId: (id: string) => void;
  setStatus: (status: WorkflowStatus) => void;
  updateNode: (payload: NodeUpdatePayload) => void;
  addLog: (log: LogAppendPayload) => void;
  appendReasoning: (text: string) => void;
  updateTelemetry: (data: Partial<WorkflowState['telemetry']>) => void;
  updateHealth: (data: Partial<WorkflowState['health']>) => void;
  updateSystemTelemetry: (data: Partial<WorkflowState['systemTelemetry']>) => void;
  hydrateReplay: (state: Partial<WorkflowState>) => void;
  resetWorkflow: () => void;
}

const initialState: WorkflowState = {
  issue_id: '',
  status: 'idle',
  nodes: {},
  logs: [],
  reasoning: '',
  telemetry: {
    startTime: null,
    endTime: null,
    totalLatency: 0,
    tokensUsed: 0,
    retries: 0,
  },
  health: {
    backend: 'online',
    websocket: 'offline',
    aiProvider: 'online',
    database: 'online',
  },
  systemTelemetry: {
    wsLatency: 0,
    activeWorkflows: 0,
    totalRetries: 0,
    fallbackActivations: 0,
  },
};

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  ...initialState,

  setWorkflowId: (id) => set({ issue_id: id }),
  
  setStatus: (status) => set((state) => ({ 
    status,
    telemetry: {
      ...state.telemetry,
      startTime: status === 'running' ? new Date().toISOString() : state.telemetry.startTime,
      endTime: (status === 'completed' || status === 'failed') ? new Date().toISOString() : state.telemetry.endTime,
    }
  })),

  updateNode: (payload) => set((state) => ({
    nodes: {
      ...state.nodes,
      [payload.node_id]: {
        ...state.nodes[payload.node_id],
        ...payload,
      }
    }
  })),

  addLog: (log) => set((state) => ({
    logs: [...state.logs, log]
  })),

  appendReasoning: (text) => set((state) => ({
    reasoning: state.reasoning + text
  })),

  updateTelemetry: (data) => set((state) => ({
    telemetry: { ...state.telemetry, ...data }
  })),

  updateHealth: (data) => set((state) => ({
    health: { ...state.health, ...data }
  })),

  updateSystemTelemetry: (data) => set((state) => ({
    systemTelemetry: { ...state.systemTelemetry, ...data }
  })),

  hydrateReplay: (data) => set((state) => ({
    ...state,
    ...data,
    status: 'replay'
  })),

  resetWorkflow: () => set(initialState),
}));

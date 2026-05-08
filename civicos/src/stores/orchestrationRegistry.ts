import { create } from 'zustand';
import { NodeUpdatePayload, LogAppendPayload, WorkflowStatus } from '../types/orchestration';

export type SystemStatus = "online" | "degraded" | "offline" | "maintenance";

export interface WorkflowState {
  issue_id: string;
  status: WorkflowStatus;
  priority: "low" | "normal" | "high" | "emergency";
  nodes: Record<string, NodeUpdatePayload>;
  logs: LogAppendPayload[];
  reasoning: string;
  telemetry: {
    startTime: string | null;
    endTime: string | null;
    totalLatency: number;
    tokensUsed: number;
    retries: number;
    fallbackActivations: number;
  };
}

export interface OrchestrationRegistryState {
  workflows: Record<string, WorkflowState>;
  activeWorkflowId: string | null;
  
  // City-scale telemetry
  health: {
    backend: SystemStatus;
    websocket: SystemStatus;
    aiProvider: SystemStatus;
    database: SystemStatus;
  };
  systemTelemetry: {
    wsLatency: number;
    activeWorkflows: number;
    emergencyWorkflows: number;
    totalRetries: number;
    fallbackActivations: number;
    totalCompleted: number;
    totalFailed: number;
  };

  // Actions
  setActiveWorkflow: (id: string | null) => void;
  initializeWorkflow: (id: string, priority?: "low" | "normal" | "high" | "emergency") => void;
  setWorkflowStatus: (id: string, status: WorkflowStatus) => void;
  updateWorkflowNode: (id: string, payload: NodeUpdatePayload) => void;
  addWorkflowLog: (id: string, log: LogAppendPayload) => void;
  appendWorkflowReasoning: (id: string, text: string) => void;
  updateWorkflowTelemetry: (id: string, data: Partial<WorkflowState['telemetry']>) => void;
  
  // Global Actions
  updateHealth: (data: Partial<OrchestrationRegistryState['health']>) => void;
  updateSystemTelemetry: (data: Partial<OrchestrationRegistryState['systemTelemetry']>) => void;
  resetRegistry: () => void;
}

const initialHealth = {
  backend: 'online' as SystemStatus,
  websocket: 'offline' as SystemStatus,
  aiProvider: 'online' as SystemStatus,
  database: 'online' as SystemStatus,
};

const initialSystemTelemetry = {
  wsLatency: 0,
  activeWorkflows: 0,
  emergencyWorkflows: 0,
  totalRetries: 0,
  fallbackActivations: 0,
  totalCompleted: 0,
  totalFailed: 0,
};

const createEmptyWorkflow = (id: string, priority: "low" | "normal" | "high" | "emergency" = "normal"): WorkflowState => ({
  issue_id: id,
  status: 'idle',
  priority,
  nodes: {},
  logs: [],
  reasoning: '',
  telemetry: {
    startTime: null,
    endTime: null,
    totalLatency: 0,
    tokensUsed: 0,
    retries: 0,
    fallbackActivations: 0,
  },
});

export const useOrchestrationRegistry = create<OrchestrationRegistryState>((set) => ({
  workflows: {},
  activeWorkflowId: null,
  health: initialHealth,
  systemTelemetry: initialSystemTelemetry,

  setActiveWorkflow: (id) => set({ activeWorkflowId: id }),
  
  initializeWorkflow: (id, priority = "normal") => set((state) => {
    if (state.workflows[id]) return state; // Already exists
    
    return {
      workflows: {
        ...state.workflows,
        [id]: createEmptyWorkflow(id, priority)
      },
      systemTelemetry: {
        ...state.systemTelemetry,
        activeWorkflows: state.systemTelemetry.activeWorkflows + 1,
        emergencyWorkflows: priority === "emergency" 
          ? state.systemTelemetry.emergencyWorkflows + 1 
          : state.systemTelemetry.emergencyWorkflows
      }
    };
  }),

  setWorkflowStatus: (id, status) => set((state) => {
    const wf = state.workflows[id];
    if (!wf) return state;

    const isRunning = status === 'running';
    const isCompleted = status === 'completed';
    const isFailed = status === 'failed';
    const isTerminal = isCompleted || isFailed;

    const updatedWf = {
      ...wf,
      status,
      telemetry: {
        ...wf.telemetry,
        startTime: isRunning && !wf.telemetry.startTime ? new Date().toISOString() : wf.telemetry.startTime,
        endTime: isTerminal ? new Date().toISOString() : wf.telemetry.endTime,
      }
    };

    let newActiveCount = state.systemTelemetry.activeWorkflows;
    let newCompletedCount = state.systemTelemetry.totalCompleted;
    let newFailedCount = state.systemTelemetry.totalFailed;

    if (isTerminal && wf.status !== 'completed' && wf.status !== 'failed') {
      newActiveCount = Math.max(0, newActiveCount - 1);
      if (isCompleted) newCompletedCount += 1;
      if (isFailed) newFailedCount += 1;
    }

    return {
      workflows: {
        ...state.workflows,
        [id]: updatedWf
      },
      systemTelemetry: {
        ...state.systemTelemetry,
        activeWorkflows: newActiveCount,
        totalCompleted: newCompletedCount,
        totalFailed: newFailedCount
      }
    };
  }),

  updateWorkflowNode: (id, payload) => set((state) => {
    const wf = state.workflows[id];
    if (!wf) return state;
    return {
      workflows: {
        ...state.workflows,
        [id]: {
          ...wf,
          nodes: {
            ...wf.nodes,
            [payload.node_id]: {
              ...(wf.nodes[payload.node_id] || {}),
              ...payload,
            }
          }
        }
      }
    };
  }),

  addWorkflowLog: (id, log) => set((state) => {
    const wf = state.workflows[id];
    if (!wf) return state;
    return {
      workflows: {
        ...state.workflows,
        [id]: {
          ...wf,
          logs: [...wf.logs, log]
        }
      }
    };
  }),

  appendWorkflowReasoning: (id, text) => set((state) => {
    const wf = state.workflows[id];
    if (!wf) return state;
    return {
      workflows: {
        ...state.workflows,
        [id]: {
          ...wf,
          reasoning: wf.reasoning + text
        }
      }
    };
  }),

  updateWorkflowTelemetry: (id, data) => set((state) => {
    const wf = state.workflows[id];
    if (!wf) return state;
    return {
      workflows: {
        ...state.workflows,
        [id]: {
          ...wf,
          telemetry: { ...wf.telemetry, ...data }
        }
      }
    };
  }),

  updateHealth: (data) => set((state) => ({
    health: { ...state.health, ...data }
  })),

  updateSystemTelemetry: (data) => set((state) => ({
    systemTelemetry: { ...state.systemTelemetry, ...data }
  })),

  resetRegistry: () => set({
    workflows: {},
    activeWorkflowId: null,
    health: initialHealth,
    systemTelemetry: initialSystemTelemetry
  })
}));

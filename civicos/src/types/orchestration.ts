/**
 * CIVICOS — ORCHESTRATION TYPES
 * Strongly typed contracts for realtime AI workflow events.
 */

export type WorkflowStatus = "idle" | "running" | "completed" | "failed" | "replay";

export type NodeStatus = "QUEUED" | "ACTIVE" | "COMPLETED" | "FAILED" | "FALLBACK";

export interface AgentTrace {
  agent_name: string;
  node_name: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  latency_ms: number;
  timestamp: string;
}

export interface OrchestrationEvent {
  type: 
    | "workflow.started"
    | "classification.completed"
    | "severity.analyzed"
    | "validation.completed"
    | "routing.completed"
    | "recommendation.generated"
    | "workflow.completed"
    | "workflow.failed"
    | "ai_retry_attempted"
    | "ai_fallback_used"
    | "node_update"
    | "log_append";
  workflow_id: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface NodeUpdatePayload {
  node_id: string;
  status: NodeStatus;
  label?: string;
  metadata?: Record<string, unknown>;
}

export interface LogAppendPayload {
  message: string;
  level: "info" | "warning" | "error" | "ai";
  agent?: string;
  metadata?: Record<string, unknown>;
}

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
}

"use client";

import { useEffect, useCallback } from 'react';
import { useSocket } from '../providers/SocketProvider';
import { useOrchestrationRegistry } from '../stores/orchestrationRegistry';
import { OrchestrationEvent, NodeUpdatePayload, LogAppendPayload } from '../types/orchestration';

/**
 * CIVICOS — USE ORCHESTRATION HOOK
 * Bridges WebSocket events to the global Orchestration Registry.
 */
export function useOrchestration() {
  const { subscribe, status: socketStatus } = useSocket();

  // ── Sync socket status → health store ──────────────────────────────────────
  // Use getState() inside the effect so we never add the store itself to deps.
  useEffect(() => {
    const healthStatus =
      socketStatus === "CONNECTED" ? "online" :
      socketStatus === "DEGRADED"  ? "degraded" : "offline";
    useOrchestrationRegistry.getState().updateHealth({ websocket: healthStatus });
  }, [socketStatus]); // only re-runs when socketStatus actually changes

  // ── Stable action callbacks (getState() is never reactive) ─────────────────
  const handleNodeUpdate = useCallback((event: OrchestrationEvent) => {
    const { workflow_id, payload } = event;
    const reg = useOrchestrationRegistry.getState();
    reg.initializeWorkflow(workflow_id);
    reg.updateWorkflowNode(workflow_id, payload as unknown as NodeUpdatePayload);
  }, []);

  const handleLogAppend = useCallback((event: OrchestrationEvent) => {
    const { workflow_id, payload } = event;
    const reg = useOrchestrationRegistry.getState();
    reg.initializeWorkflow(workflow_id);
    reg.addWorkflowLog(workflow_id, payload as unknown as LogAppendPayload);
  }, []);

  const handleWorkflowStarted = useCallback((event: OrchestrationEvent) => {
    const { workflow_id } = event;
    const reg = useOrchestrationRegistry.getState();
    reg.initializeWorkflow(workflow_id);
    reg.setWorkflowStatus(workflow_id, 'running');
    reg.addWorkflowLog(workflow_id, { message: "AI Orchestration pipeline engaged.", level: "info" });
  }, []);

  const handleWorkflowCompleted = useCallback((event: OrchestrationEvent) => {
    const { workflow_id } = event;
    const reg = useOrchestrationRegistry.getState();
    reg.initializeWorkflow(workflow_id);
    reg.setWorkflowStatus(workflow_id, 'completed');
    reg.addWorkflowLog(workflow_id, { message: "Orchestration successfully completed.", level: "info" });
  }, []);

  const handleWorkflowFailed = useCallback((event: OrchestrationEvent) => {
    const { workflow_id, payload } = event;
    const errorPayload = payload as Record<string, unknown>;
    const reg = useOrchestrationRegistry.getState();
    reg.initializeWorkflow(workflow_id);
    reg.setWorkflowStatus(workflow_id, 'failed');
    reg.addWorkflowLog(workflow_id, { message: `Orchestration failed: ${errorPayload.error || 'Unknown error'}`, level: "error" });
  }, []);

  const handleRetry = useCallback((event: OrchestrationEvent) => {
    const { workflow_id, payload } = event;
    const retryPayload = payload as { attempt: number };
    const reg = useOrchestrationRegistry.getState();
    reg.initializeWorkflow(workflow_id);
    const wf = reg.workflows[workflow_id];
    if (wf) {
      reg.updateWorkflowTelemetry(workflow_id, { retries: (wf.telemetry.retries || 0) + 1 });
    }
    reg.updateSystemTelemetry({ totalRetries: reg.systemTelemetry.totalRetries + 1 });
    reg.addWorkflowLog(workflow_id, { message: `AI agent encountered a timeout. Initiating retry attempt ${retryPayload.attempt}...`, level: "ai" });
  }, []);

  const handleReasoning = useCallback((event: OrchestrationEvent) => {
    const { workflow_id, payload } = event;
    const reasoningPayload = payload as { text: string };
    const reg = useOrchestrationRegistry.getState();
    reg.initializeWorkflow(workflow_id);
    reg.appendWorkflowReasoning(workflow_id, reasoningPayload.text);
  }, []);

  useEffect(() => {
    // Subscriptions
    const unsubNode = subscribe<OrchestrationEvent>('node_update', handleNodeUpdate);
    const unsubLog = subscribe<OrchestrationEvent>('log_append', handleLogAppend);
    const unsubStart = subscribe<OrchestrationEvent>('workflow.started', handleWorkflowStarted);
    const unsubEnd = subscribe<OrchestrationEvent>('workflow.completed', handleWorkflowCompleted);
    const unsubFail = subscribe<OrchestrationEvent>('workflow.failed', handleWorkflowFailed);
    const unsubRetry = subscribe<OrchestrationEvent>('ai_retry_attempted', handleRetry);
    const unsubReason = subscribe<OrchestrationEvent>('ai_reasoning_chunk', handleReasoning);

    return () => {
      unsubNode();
      unsubLog();
      unsubStart();
      unsubEnd();
      unsubFail();
      unsubRetry();
      unsubReason();
    };
  }, [subscribe, handleNodeUpdate, handleLogAppend, handleWorkflowStarted, handleWorkflowCompleted, handleWorkflowFailed, handleRetry, handleReasoning]);

  return {
    socketStatus,
  };
}

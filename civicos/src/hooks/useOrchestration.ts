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
  const registry = useOrchestrationRegistry();

  // Sync socket status to health store
  useEffect(() => {
    const healthStatus = 
      socketStatus === "CONNECTED" ? "online" : 
      (socketStatus === "DEGRADED" ? "degraded" : "offline");
    registry.updateHealth({ websocket: healthStatus });
  }, [socketStatus, registry]);

  const handleNodeUpdate = useCallback((event: OrchestrationEvent) => {
    const { workflow_id, payload } = event;
    registry.initializeWorkflow(workflow_id);
    registry.updateWorkflowNode(workflow_id, payload as unknown as NodeUpdatePayload);
  }, [registry]);

  const handleLogAppend = useCallback((event: OrchestrationEvent) => {
    const { workflow_id, payload } = event;
    registry.initializeWorkflow(workflow_id);
    registry.addWorkflowLog(workflow_id, payload as unknown as LogAppendPayload);
  }, [registry]);

  const handleWorkflowStarted = useCallback((event: OrchestrationEvent) => {
    const { workflow_id } = event;
    registry.initializeWorkflow(workflow_id);
    registry.setWorkflowStatus(workflow_id, 'running');
    registry.addWorkflowLog(workflow_id, { message: "AI Orchestration pipeline engaged.", level: "info" });
  }, [registry]);

  const handleWorkflowCompleted = useCallback((event: OrchestrationEvent) => {
    const { workflow_id } = event;
    registry.initializeWorkflow(workflow_id);
    registry.setWorkflowStatus(workflow_id, 'completed');
    registry.addWorkflowLog(workflow_id, { message: "Orchestration successfully completed.", level: "info" });
  }, [registry]);

  const handleWorkflowFailed = useCallback((event: OrchestrationEvent) => {
    const { workflow_id, payload } = event;
    const errorPayload = payload as Record<string, unknown>;
    registry.initializeWorkflow(workflow_id);
    registry.setWorkflowStatus(workflow_id, 'failed');
    registry.addWorkflowLog(workflow_id, { message: `Orchestration failed: ${errorPayload.error || 'Unknown error'}`, level: "error" });
  }, [registry]);

  const handleRetry = useCallback((event: OrchestrationEvent) => {
    const { workflow_id, payload } = event;
    const retryPayload = payload as { attempt: number };
    registry.initializeWorkflow(workflow_id);
    const wf = useOrchestrationRegistry.getState().workflows[workflow_id];
    if (wf) {
      registry.updateWorkflowTelemetry(workflow_id, { retries: (wf.telemetry.retries || 0) + 1 });
    }
    registry.updateSystemTelemetry({ totalRetries: useOrchestrationRegistry.getState().systemTelemetry.totalRetries + 1 });
    registry.addWorkflowLog(workflow_id, { message: `AI agent encountered a timeout. Initiating retry attempt ${retryPayload.attempt}...`, level: "ai" });
  }, [registry]);

  const handleReasoning = useCallback((event: OrchestrationEvent) => {
    const { workflow_id, payload } = event;
    const reasoningPayload = payload as { text: string };
    registry.initializeWorkflow(workflow_id);
    registry.appendWorkflowReasoning(workflow_id, reasoningPayload.text);
  }, [registry]);

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
    registry,
    socketStatus,
  };
}

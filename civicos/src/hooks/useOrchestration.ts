"use client";

import { useEffect, useCallback } from 'react';
import { useSocket } from '../providers/SocketProvider';
import { useWorkflowStore } from '../stores/workflowStore';
import { NodeUpdatePayload, LogAppendPayload } from '../types/orchestration';

/**
 * CIVICOS — USE ORCHESTRATION HOOK
 * Bridges WebSocket events to the global Workflow Store.
 */
export function useOrchestration(issueId?: string) {
  const { subscribe, status: socketStatus } = useSocket();
  const store = useWorkflowStore();

  // Sync socket status to health store
  useEffect(() => {
    const healthStatus = 
      socketStatus === "CONNECTED" ? "online" : 
      (socketStatus === "DEGRADED" ? "degraded" : "offline");
    store.updateHealth({ websocket: healthStatus });
  }, [socketStatus, store]);

  const handleNodeUpdate = useCallback((payload: NodeUpdatePayload) => {
    store.updateNode(payload);
  }, [store]);

  const handleLogAppend = useCallback((payload: LogAppendPayload) => {
    store.addLog(payload);
  }, [store]);

  const handleWorkflowStarted = useCallback((payload: Record<string, unknown>) => {
    store.setStatus('running');
    store.addLog({ message: "AI Orchestration pipeline engaged.", level: "info" });
  }, [store]);

  const handleWorkflowCompleted = useCallback((payload: Record<string, unknown>) => {
    store.setStatus('completed');
    store.addLog({ message: "Orchestration successfully completed.", level: "info" });
  }, [store]);

  const handleWorkflowFailed = useCallback((payload: { error?: string }) => {
    store.setStatus('failed');
    store.addLog({ message: `Orchestration failed: ${payload.error || 'Unknown error'}`, level: "error" });
  }, [store]);

  const handleRetry = useCallback((payload: { attempt: number }) => {
    store.updateTelemetry({ retries: (store.telemetry.retries || 0) + 1 });
    store.addLog({ message: `AI agent encountered a timeout. Initiating retry attempt ${payload.attempt}...`, level: "ai" });
  }, [store]);

  const handleReasoning = useCallback((payload: { text: string }) => {
    store.appendReasoning(payload.text);
  }, [store]);

  useEffect(() => {
    if (!issueId) return;

    // Subscriptions
    const unsubNode = subscribe('node_update', handleNodeUpdate);
    const unsubLog = subscribe('log_append', handleLogAppend);
    const unsubStart = subscribe('workflow.started', handleWorkflowStarted);
    const unsubEnd = subscribe('workflow.completed', handleWorkflowCompleted);
    const unsubFail = subscribe('workflow.failed', handleWorkflowFailed);
    const unsubRetry = subscribe('ai_retry_attempted', handleRetry);
    const unsubReason = subscribe('ai_reasoning_chunk', handleReasoning);

    return () => {
      unsubNode();
      unsubLog();
      unsubStart();
      unsubEnd();
      unsubFail();
      unsubRetry();
      unsubReason();
    };
  }, [issueId, subscribe, handleNodeUpdate, handleLogAppend, handleWorkflowStarted, handleWorkflowCompleted, handleWorkflowFailed, handleRetry, handleReasoning]);

  return {
    ...store,
    socketStatus,
  };
}

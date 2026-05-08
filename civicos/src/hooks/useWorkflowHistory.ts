"use client";

import { useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';
import { useOrchestrationRegistry } from '../stores/orchestrationRegistry';
import { WorkflowState } from '../stores/orchestrationRegistry';

/**
 * CIVICOS — USE WORKFLOW HISTORY HOOK
 * Handles loading historical workflow data and hydrating the replay system.
 */
export function useWorkflowHistory() {
  const [history, setHistory] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const registry = useOrchestrationRegistry();

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get<Record<string, unknown>[]>('/workflows/history');
      setHistory(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load history");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadReplay = useCallback(async (workflowId: string) => {
    setIsLoading(true);
    try {
      const data = await api.get<WorkflowState>(`/workflows/${workflowId}/trace`);
      registry.initializeWorkflow(workflowId);
      // We manually override the workflow state with replay data
      // For now, just set status and active workflow
      registry.setWorkflowStatus(workflowId, 'replay');
      registry.setActiveWorkflow(workflowId);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load workflow trace");
      }
    } finally {
      setIsLoading(false);
    }
  }, [registry]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    error,
    fetchHistory,
    loadReplay
  };
}

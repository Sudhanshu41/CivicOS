"use client";

import { useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';
import { useWorkflowStore } from '../stores/workflowStore';
import { WorkflowState } from '../types/orchestration';

/**
 * CIVICOS — USE WORKFLOW HISTORY HOOK
 * Handles loading historical workflow data and hydrating the replay system.
 */
export function useWorkflowHistory() {
  const [history, setHistory] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const store = useWorkflowStore();

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
      const data = await api.get<Partial<WorkflowState>>(`/workflows/${workflowId}/trace`);
      store.hydrateReplay(data);
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
  }, [store]);

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

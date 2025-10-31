'use client';

import { useState, useCallback } from 'react';

interface TriggerN8nAgentOptions {
  agentName: string;
  payload: any;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

interface TriggerN8nAgentResult {
  data: any | null;
  error: string | null;
  isLoading: boolean;
  trigger: (options: TriggerN8nAgentOptions) => Promise<void>;
  reset: () => void;
}

interface N8nApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  workflowId?: string;
}

/**
 * React hook for triggering N8N agents
 * Provides a clean interface to call N8N workflows from React components
 */
export const useTriggerN8nAgent = (): TriggerN8nAgentResult => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const trigger = useCallback(async (options: TriggerN8nAgentOptions) => {
    const { agentName, payload, onSuccess, onError, onComplete } = options;

    // Reset state
    setData(null);
    setError(null);
    setIsLoading(true);

    try {
      // Validate inputs
      if (!agentName || !payload) {
        throw new Error('agentName and payload are required');
      }

      // Make API call
      const response = await fetch('/api/n8n/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentName,
          payload,
        }),
      });

      const result: N8nApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Success
      setData(result.data);
      setError(null);
      onSuccess?.(result.data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setData(null);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      onComplete?.();
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    trigger,
    reset,
  };
};

/**
 * Utility function for triggering N8N agents without using the hook
 * Useful for one-off calls or in non-React contexts
 */
export const triggerN8nAgent = async (
  agentName: string,
  payload: any
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await fetch('/api/n8n/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentName,
        payload,
      }),
    });

    const result: N8nApiResponse = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data: result.data,
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Available agent names for TypeScript type safety
 */
export const AGENT_NAMES = {
  CALENDAR: 'calendar',
  EMAIL: 'email',
  PHONE: 'phone',
  PERSONAL_ASSISTANT: 'personal_assistant',
} as const;

export type AgentName = typeof AGENT_NAMES[keyof typeof AGENT_NAMES];

/**
 * Type-safe wrapper for triggering agents
 */
export const triggerAgent = async (
  agentName: AgentName,
  payload: any
): Promise<{ success: boolean; data?: any; error?: string }> => {
  return triggerN8nAgent(agentName, payload);
};

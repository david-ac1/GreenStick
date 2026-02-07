'use client';

import { useState, useCallback } from 'react';

interface AgentPlan {
    action: string;
    confidence: number;
    reasoning: string;
    steps: string[];
}

interface AgentExecution {
    status: string;
    message: string;
    approval_required: boolean;
}

interface AgentAnalysis {
    incident_id: string;
    timestamp: string;
    detected_anomalies: Array<{
        service: string;
        level: string;
        message: string;
        trace_id: string;
        '@timestamp': string;
    }>;
    historical_context: Array<{
        incident_id: string;
        description: string;
        resolution: string;
        root_cause: string;
    }>;
    correlations: Array<{
        service: string;
        level: string;
        count: number;
    }>;
    analysis: {
        root_cause_probability: number;
        summary: string;
    };
    plan: AgentPlan;
    execution: AgentExecution;
}

interface UseAgentReturn {
    loading: boolean;
    error: string | null;
    analysis: AgentAnalysis | null;
    analyzeIncident: (incidentId: string) => Promise<void>;
    checkBackend: () => Promise<boolean>;
}

export function useAgent(): UseAgentReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AgentAnalysis | null>(null);

    const analyzeIncident = useCallback(async (incidentId: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/agent?incident_id=${encodeURIComponent(incidentId)}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Analysis failed: ${response.status}`);
            }

            const data = await response.json();
            setAnalysis(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    const checkBackend = useCallback(async () => {
        try {
            const response = await fetch('/api/agent');
            return response.ok;
        } catch {
            return false;
        }
    }, []);

    return { loading, error, analysis, analyzeIncident, checkBackend };
}

export type { AgentAnalysis, AgentPlan, AgentExecution };

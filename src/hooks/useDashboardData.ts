'use client';

import { useState, useEffect, useCallback } from 'react';

interface Stats {
    active_incidents: number;
    anomaly_flux: number;
    mttr_avg: number;
    agent_accuracy: number;
    historical_incidents: number;
    error?: string;
}

interface Incident {
    id: string;
    timestamp: string;
    service: string;
    level: string;
    message: string;
    trace_id: string;
}

interface IncidentsData {
    total: number;
    incidents: Incident[];
    error?: string;
}

export function useDashboardData() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [incidents, setIncidents] = useState<IncidentsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [statsRes, incidentsRes] = await Promise.all([
                fetch('/api/stats'),
                fetch('/api/incidents')
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            if (incidentsRes.ok) {
                const incidentsData = await incidentsRes.json();
                setIncidents(incidentsData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return { stats, incidents, loading, error, refresh: fetchData };
}

export type { Stats, Incident, IncidentsData };

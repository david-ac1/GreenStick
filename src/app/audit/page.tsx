'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AuthGate from '@/components/AuthGate';
import { useAuth } from '@/context/AuthContext';

interface AuditLog {
    id: string;
    timestamp: string;
    trace_id: string;
    action_type: string;
    description: string;
    confidence: number;
    status: string;
    metadata: Record<string, unknown>;
}

function useAuditLogs() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/audit-logs');
            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs || []);
                setTotal(data.total || 0);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 30000);
        return () => clearInterval(interval);
    }, [fetchLogs]);

    const updateStatus = async (logId: string, status: string) => {
        console.log(`[Audit] Updating log ${logId} to status: ${status}`);
        try {
            const response = await fetch(`/api/audit-logs?id=${logId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            console.log(`[Audit] Response status: ${response.status}`);
            const data = await response.json();
            console.log('[Audit] Response data:', data);
            if (response.ok) {
                fetchLogs();
            } else {
                console.error('[Audit] Update failed:', data);
            }
        } catch (err) {
            console.error('[Audit] Failed to update status:', err);
        }
    };

    return { logs, total, loading, error, refresh: fetchLogs, updateStatus };
}

function formatTimestamp(timestamp: string) {
    try {
        const date = new Date(timestamp);
        return {
            time: date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            date: date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
        };
    } catch {
        return { time: '--:--:--', date: '-- --- ----' };
    }
}

function getActionColor(actionType: string) {
    const colors: Record<string, string> = {
        'K8S_RESTART': 'bg-zinc-400',
        'CONFIG_ROLLBACK': 'bg-amber-500',
        'SCALE_UP': 'bg-emerald-500',
        'ALERT_ESCALATE': 'bg-rose-500',
        'ANALYSIS': 'bg-blue-500',
    };
    return colors[actionType] || 'bg-zinc-600';
}

function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
        'approved': 'text-emerald-500',
        'pending': 'text-zinc-500',
        'rejected': 'text-rose-500',
    };
    return styles[status] || 'text-zinc-600';
}

export default function AuditPage() {
    const { logs, total, loading, refresh, updateStatus } = useAuditLogs();
    const { logout, user } = useAuth();

    return (
        <AuthGate>
            <div className="bg-black text-slate-300 min-h-screen font-sans">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur-md px-6 lg:px-10 py-3">
                    <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <div className="size-8 bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                    <span className="material-symbols-outlined text-zinc-400">terminal</span>
                                </div>
                                <h2 className="text-white text-lg font-bold tracking-tighter uppercase">
                                    GreenStick <span className="text-zinc-500 font-normal">Audit</span>
                                </h2>
                            </Link>
                            <nav className="hidden md:flex items-center gap-6">
                                <Link href="/" className="text-zinc-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">
                                    Dashboard
                                </Link>
                                <span className="text-white text-[11px] font-bold uppercase tracking-widest border-b border-white pb-1">
                                    Audit Log
                                </span>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{user || 'OPERATOR'}</span>
                            <button onClick={logout} className="text-zinc-500 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-[1440px] mx-auto p-6 lg:p-10">
                    {/* Page Title */}
                    <div className="flex justify-between items-end gap-4 mb-10 pb-6 border-b border-zinc-800">
                        <div>
                            <h1 className="text-white text-3xl font-light tracking-tight">Agent Audit Log</h1>
                            <p className="text-zinc-500 text-xs font-medium mt-2 flex items-center gap-2">
                                <span className={`size-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                {loading ? 'Loading...' : `${total} audit entries from Elasticsearch`}
                            </p>
                        </div>
                        <button
                            onClick={refresh}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-all text-[10px] font-bold uppercase tracking-widest"
                        >
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            Refresh
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="p-4 border border-zinc-800 bg-zinc-900/50">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Entries</p>
                            <p className="text-2xl font-mono font-bold text-white">{total}</p>
                        </div>
                        <div className="p-4 border border-zinc-800 bg-zinc-900/50">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Approved</p>
                            <p className="text-2xl font-mono font-bold text-emerald-500">
                                {logs.filter(l => l.status === 'approved').length}
                            </p>
                        </div>
                        <div className="p-4 border border-zinc-800 bg-zinc-900/50">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Pending Review</p>
                            <p className="text-2xl font-mono font-bold text-amber-500">
                                {logs.filter(l => l.status === 'pending').length}
                            </p>
                        </div>
                        <div className="p-4 border border-zinc-800 bg-zinc-900/50">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Avg Confidence</p>
                            <p className="text-2xl font-mono font-bold text-white">
                                {logs.length > 0 ? (logs.reduce((sum, l) => sum + l.confidence, 0) / logs.length * 100).toFixed(1) : 0}%
                            </p>
                        </div>
                    </div>

                    {/* Audit Table */}
                    <div className="bg-zinc-900/50 border border-zinc-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-black border-b border-zinc-800">
                                        <th className="w-40 px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Timestamp</th>
                                        <th className="w-36 px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Trace ID</th>
                                        <th className="w-40 px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Action Type</th>
                                        <th className="px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</th>
                                        <th className="w-24 px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Confidence</th>
                                        <th className="w-28 px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                                        <th className="w-32 px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {logs.map((log) => {
                                        const ts = formatTimestamp(log.timestamp);
                                        return (
                                            <tr key={log.id} className="hover:bg-zinc-800/50 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-white font-mono">{ts.time}</span>
                                                        <span className="text-[10px] text-zinc-600 font-bold tracking-tighter">{ts.date}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 border border-zinc-700">
                                                        {log.trace_id.slice(0, 12)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`size-2 ${getActionColor(log.action_type)}`}></span>
                                                        <span className="text-[11px] font-bold text-white tracking-wider uppercase">{log.action_type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="text-xs text-zinc-400 leading-relaxed max-w-lg truncate">{log.description}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-white font-mono font-bold">{(log.confidence * 100).toFixed(1)}%</span>
                                                        <div className="w-full h-[3px] bg-zinc-800 overflow-hidden">
                                                            <div className="h-full bg-white" style={{ width: `${log.confidence * 100}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(log.status)}`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {log.status === 'pending' ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => updateStatus(log.id, 'approved')}
                                                                className="p-1.5 bg-zinc-900 hover:bg-emerald-600 text-zinc-400 hover:text-white border border-zinc-700 transition-all"
                                                                title="Approve"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">check</span>
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(log.id, 'rejected')}
                                                                className="p-1.5 bg-zinc-900 hover:bg-rose-600 text-zinc-400 hover:text-white border border-zinc-700 transition-all"
                                                                title="Reject"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">close</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-zinc-600">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {logs.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                                                No audit logs found. Agent actions will appear here.
                                            </td>
                                        </tr>
                                    )}
                                    {loading && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                                                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t border-zinc-800 bg-black/50">
                            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                                Displaying {logs.length} of {total} Audit Entries • Data from Elasticsearch
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGate>
    );
}

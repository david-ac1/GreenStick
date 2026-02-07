'use client';

import { useAgent, AgentAnalysis } from '@/hooks/useAgent';
import { useState, useEffect } from 'react';

function ConfidenceMeter({ value }: { value: number }) {
    const percentage = Math.round(value * 100);
    const color = percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500';

    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-xs font-mono font-bold">{percentage}%</span>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        'PENDING_APPROVAL': 'bg-amber-100 text-amber-700 border-amber-300',
        'EXECUTED': 'bg-emerald-100 text-emerald-700 border-emerald-300',
        'ERROR': 'bg-rose-100 text-rose-700 border-rose-300',
    };

    return (
        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${colors[status] || 'bg-slate-100 text-slate-700 border-slate-300'}`}>
            {status.replace('_', ' ')}
        </span>
    );
}

export default function AgentPanel() {
    const { loading, error, analysis, analyzeIncident, checkBackend } = useAgent();
    const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
    const [incidentInput, setIncidentInput] = useState('trace-hq-001');

    useEffect(() => {
        checkBackend().then(setBackendOnline);
    }, [checkBackend]);

    const handleAnalyze = () => {
        if (incidentInput.trim()) {
            analyzeIncident(incidentInput.trim());
        }
    };

    return (
        <div className="bg-white border border-slate-300 rounded-sm shadow-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-black text-white">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg">smart_toy</span>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">GreenStick Agent</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${backendOnline ? 'bg-emerald-400' : backendOnline === false ? 'bg-rose-400' : 'bg-slate-400'}`} />
                    <span className="text-[10px] font-mono">
                        {backendOnline ? 'ONLINE' : backendOnline === false ? 'OFFLINE' : 'CHECKING...'}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Input Section */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={incidentInput}
                        onChange={(e) => setIncidentInput(e.target.value)}
                        placeholder="Enter trace ID or incident ID..."
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-sm text-xs font-mono focus:ring-1 focus:ring-black focus:border-black"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !backendOnline}
                        className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-sm">query_stats</span>
                                Analyze
                            </>
                        )}
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-700">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Analysis Results */}
                {analysis && (
                    <div className="space-y-4">
                        {/* Summary Card */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analysis Summary</p>
                                    <p className="text-sm font-medium mt-1">{analysis.analysis?.summary || 'No summary available'}</p>
                                </div>
                                <StatusBadge status={analysis.execution?.status || 'N/A'} />
                            </div>
                            <div className="mt-3">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Root Cause Probability</p>
                                <ConfidenceMeter value={analysis.analysis?.root_cause_probability || 0} />
                            </div>
                        </div>

                        {/* Detection Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-white border border-slate-200 rounded-sm">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Anomalies</p>
                                <p className="text-2xl font-bold font-mono mt-1">{analysis.detected_anomalies?.length || 0}</p>
                            </div>
                            <div className="p-3 bg-white border border-slate-200 rounded-sm">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">History Match</p>
                                <p className="text-2xl font-bold font-mono mt-1">{analysis.historical_context?.length || 0}</p>
                            </div>
                            <div className="p-3 bg-white border border-slate-200 rounded-sm">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Correlations</p>
                                <p className="text-2xl font-bold font-mono mt-1">{analysis.correlations?.length || 0}</p>
                            </div>
                        </div>

                        {/* Plan */}
                        <div className="p-4 bg-black text-white rounded-sm">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-bold uppercase tracking-widest">Recommended Action</p>
                                <span className="px-2 py-1 bg-white/10 text-[10px] font-bold rounded">{analysis.plan?.action}</span>
                            </div>
                            <p className="text-xs text-slate-300 mb-3">{analysis.plan?.reasoning}</p>
                            {analysis.plan?.steps && (
                                <div className="space-y-1">
                                    {analysis.plan.steps.map((step, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs">
                                            <span className="text-emerald-400 font-mono">{i + 1}.</span>
                                            <span className="text-slate-200">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Approval Section */}
                        {analysis.execution?.approval_required && (
                            <div className="flex gap-2">
                                <button className="flex-1 px-4 py-2 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-emerald-700">
                                    <span className="material-symbols-outlined text-sm mr-2">check</span>
                                    Approve Action
                                </button>
                                <button className="flex-1 px-4 py-2 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-rose-700">
                                    <span className="material-symbols-outlined text-sm mr-2">close</span>
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

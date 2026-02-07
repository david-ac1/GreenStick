'use client';

import { useState } from 'react';

interface ReportIncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const SERVICES = [
    "api-gateway",
    "auth-service",
    "payment-processor",
    "user-service",
    "notification-hub",
    "data-pipeline"
];

const LEVELS = ["ERROR", "WARN", "INFO"];

export default function ReportIncidentModal({ isOpen, onClose, onSuccess }: ReportIncidentModalProps) {
    const [service, setService] = useState(SERVICES[0]);
    const [level, setLevel] = useState("ERROR");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch('/api/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service, level, message }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to report incident');
            }

            setMessage("");
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-sm shadow-2xl border border-slate-300">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-black text-white">
                    <h2 className="text-[11px] font-bold uppercase tracking-widest">Report Incident</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                            Service
                        </label>
                        <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm font-mono focus:ring-1 focus:ring-black"
                        >
                            {SERVICES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                            Severity Level
                        </label>
                        <div className="flex gap-2">
                            {LEVELS.map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setLevel(l)}
                                    className={`flex-1 px-3 py-2 text-[10px] font-bold uppercase rounded-sm border transition-colors ${level === l
                                            ? l === 'ERROR' ? 'bg-rose-500 text-white border-rose-600'
                                                : l === 'WARN' ? 'bg-amber-500 text-black border-amber-600'
                                                    : 'bg-emerald-500 text-white border-emerald-600'
                                            : 'bg-white border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe the incident..."
                            rows={3}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm font-mono focus:ring-1 focus:ring-black resize-none"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-700">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !message}
                            className="flex-1 px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    Reporting...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">send</span>
                                    Report
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

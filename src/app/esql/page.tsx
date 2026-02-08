'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import AuthGate from "@/components/AuthGate";
import { useAuth } from "@/context/AuthContext";

interface ToolDefinition {
    id: string;
    name: string;
    description: string;
    parameters: Record<string, string>;
    esql_preview: string;
}

interface ServiceHealth {
    service: string;
    total: number;
    errors: number;
    warnings: number;
    error_rate: number;
}

interface ErrorTrend {
    hour: string;
    error_count: number;
}

interface Correlation {
    trace_id: string;
    error_count: number;
    distinct_services: number;
}

export default function ESQLDashboard() {
    const { user, logout } = useAuth();
    const [tools, setTools] = useState<ToolDefinition[]>([]);
    const [health, setHealth] = useState<ServiceHealth[]>([]);
    const [trends, setTrends] = useState<ErrorTrend[]>([]);
    const [correlations, setCorrelations] = useState<Correlation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const [toolParams, setToolParams] = useState<Record<string, string>>({});
    const [toolResult, setToolResult] = useState<any>(null);
    const [executing, setExecuting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [toolsRes, healthRes, trendsRes, corrRes] = await Promise.all([
                    fetch('/api/esql/tools'),
                    fetch('/api/esql/service-health'),
                    fetch('/api/esql/error-trends?hours=24'),
                    fetch('/api/esql/correlations?timeframe_minutes=60')
                ]);

                if (toolsRes.ok) setTools((await toolsRes.json()).tools);
                if (healthRes.ok) setHealth((await healthRes.json()).services);
                if (trendsRes.ok) setTrends((await trendsRes.json()).trends);
                if (corrRes.ok) setCorrelations((await corrRes.json()).correlations);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const executeTool = async () => {
        if (!selectedTool) return;
        setExecuting(true);
        setToolResult(null);

        try {
            // Convert params to correct types if needed (simple string for now)
            const res = await fetch('/api/esql/execute-tool', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool_id: selectedTool,
                    params: toolParams
                })
            });

            const data = await res.json();
            setToolResult(data.results || data);
        } catch (error) {
            setToolResult({ error: String(error) });
        } finally {
            setExecuting(false);
        }
    };

    const handleTraceClick = (traceId: string) => {
        const traceTool = tools.find(t => t.id === 'trace_request');
        if (traceTool) {
            setSelectedTool(traceTool.id);
            setToolParams({ trace_id: traceId });
            // Optional: auto-scroll to tool area
            document.getElementById('tool-executor')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <AuthGate>
            <div className="flex h-screen bg-[var(--metallic-bg)] text-[var(--obsidian)] overflow-hidden font-sans">
                {/* Sidebar (Duplicated from main Dashboard for consistency) */}
                <aside className="w-64 bg-black flex flex-col transition-all duration-300 flex-shrink-0 z-20">
                    <div className="h-14 flex items-center px-4 border-b border-white/10">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="size-8 bg-white/10 rounded flex items-center justify-center text-white shrink-0">
                                <span className="material-symbols-outlined text-sm">terminal</span>
                            </div>
                            <span className="font-bold text-sm tracking-tight whitespace-nowrap text-white">GREENSTICK</span>
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-6 space-y-1">
                        <div className="px-4 mb-4">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</p>
                        </div>
                        <Link className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors group" href="/">
                            <span className="material-symbols-outlined text-xl">dashboard</span>
                            <span className="text-xs font-medium">Overview</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-4 py-2.5 text-white bg-white/10 border-r-4 border-white group" href="/esql">
                            <span className="material-symbols-outlined text-xl">query_stats</span>
                            <span className="text-xs font-semibold">ES|QL Analytics</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors group" href="/audit">
                            <span className="material-symbols-outlined text-xl">shield</span>
                            <span className="text-xs font-medium">Audit Log</span>
                        </Link>
                    </nav>
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full border border-white/20 overflow-hidden shrink-0 relative">
                                <Image
                                    alt="User Profile"
                                    className="object-cover grayscale brightness-125"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFgJcVcPeGsPGBRkbXHUMYgY3H1MXcHfhUdTzt7k8Tu5lNtCRCPwqe9YiUSiYFi4zgfyLLvMBASY69ENZFqHKbK5Tr_ABj3kWqVmWlDP65zNEaUC0Kr2C91QwQ2_BhCHZhmhHPVSCHTXm5pb9VDMsFhK62dUZ_IMdpGgWKofaHYAcI0UG8aSWfUJwZXnjGRbJY_3sTp7QNib1TXMhVqVtdhvtXo3OJPAAJmJaHsDjqRDSBI2c7-q9nwt-ZyY7XtFD9B3wGUAc0nH4"
                                    fill
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-white truncate uppercase tracking-tighter">{user || 'OPERATOR'}</p>
                                <p className="text-[9px] text-slate-500 truncate font-mono">AUTHORIZED</p>
                            </div>
                            <button onClick={logout} className="text-slate-500 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
                    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0">
                        <h1 className="text-sm font-bold uppercase tracking-widest text-slate-700 flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-600">query_stats</span>
                            Elastic Agent Tools (ES|QL)
                        </h1>
                        <div className="text-xs font-mono text-slate-500">
                            Connection: {loading ? 'Checking...' : 'Active'}
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* Top Row: Service Health & Cascading Failures */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Service Health Grid (2 cols) */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {health.map((svc) => (
                                    <div key={svc.service} className="bg-white p-4 border border-slate-200 shadow-sm rounded-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-sm text-slate-700">{svc.service}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${svc.error_rate > 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                {svc.error_rate}% Errors
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 font-mono">
                                            <span>Total: {svc.total}</span>
                                            <span className="text-rose-600">Errors: {svc.errors}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cascading Failures Widget (1 col) */}
                            <div className="bg-white border border-rose-200 shadow-sm rounded-sm overflow-hidden flex flex-col h-full">
                                <div className="px-4 py-3 border-b border-rose-100 bg-rose-50 flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-rose-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">hub</span>
                                        Cascading Failures
                                    </h3>
                                    <span className="text-[9px] font-mono text-rose-600 bg-white px-1.5 py-0.5 rounded border border-rose-100">Last Hour</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-0 divide-y divide-rose-50 max-h-[300px] lg:max-h-none">
                                    {correlations.map(c => (
                                        <button
                                            key={c.trace_id}
                                            className="w-full text-left flex justify-between items-center px-4 py-3 hover:bg-rose-50 transition-colors group"
                                            onClick={() => handleTraceClick(c.trace_id)}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs text-slate-600 group-hover:text-black font-bold">{c.trace_id.slice(0, 8)}...</span>
                                                <span className="text-[10px] text-slate-400">Click to trace</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-0.5">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold text-xs text-rose-600">{c.error_count}</span>
                                                    <span className="text-[9px] uppercase text-slate-400">Errors</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold text-xs text-slate-600">{c.distinct_services}</span>
                                                    <span className="text-[9px] uppercase text-slate-400">Services</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                    {correlations.length === 0 && !loading && (
                                        <div className="p-8 text-center text-slate-400 text-xs italic">
                                            No correlated failures detected.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tools Execution Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="tool-executor">

                            {/* Tool Selector */}
                            <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden lg:col-span-1">
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">Available Agent Tools</h3>
                                </div>
                                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                                    {tools.map((tool) => (
                                        <button
                                            key={tool.id}
                                            onClick={() => {
                                                setSelectedTool(tool.id);
                                                setToolParams({});
                                                setToolResult(null);
                                            }}
                                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${selectedTool === tool.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-sm text-slate-800">{tool.name}</span>
                                                <span className="text-[10px] font-mono text-slate-400">{tool.id}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2">{tool.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tool Executor */}
                            <div className="lg:col-span-2 space-y-4">
                                {selectedTool ? (
                                    <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6">
                                        <div className="mb-4">
                                            <h2 className="text-lg font-bold text-slate-800 mb-1">
                                                {tools.find(t => t.id === selectedTool)?.name}
                                            </h2>
                                            <p className="text-sm text-slate-500">
                                                {tools.find(t => t.id === selectedTool)?.description}
                                            </p>
                                        </div>

                                        <div className="bg-slate-900 rounded p-3 mb-6 font-mono text-xs text-emerald-400 overflow-x-auto">
                                            <pre>{tools.find(t => t.id === selectedTool)?.esql_preview}</pre>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            {Object.entries(tools.find(t => t.id === selectedTool)?.parameters || {}).map(([param, type]) => (
                                                <div key={param}>
                                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                                                        {param} <span className="text-slate-400 font-normal">({type})</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder={`Enter value for ${param}...`}
                                                        onChange={(e) => setToolParams(prev => ({ ...prev, [param]: e.target.value }))}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={executeTool}
                                                disabled={executing}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wide flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {executing ? (
                                                    <>
                                                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                                        Running ES|QL...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined text-sm">play_arrow</span>
                                                        Execute Tool
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded p-12 text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">handyman</span>
                                        <p className="text-slate-500 font-medium">Select a tool to configure and run</p>
                                    </div>
                                )}

                                {/* Results Area */}
                                {toolResult && (
                                    <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
                                        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                            <h3 className="text-xs font-bold uppercase text-slate-600">Execution Results</h3>
                                            <button
                                                onClick={() => setToolResult(null)}
                                                className="text-slate-400 hover:text-slate-600"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </div>
                                        <div className="p-0 overflow-x-auto">
                                            {Array.isArray(toolResult) && toolResult.length > 0 ? (
                                                <table className="w-full text-left text-xs border-collapse">
                                                    <thead className="bg-slate-50">
                                                        <tr>
                                                            {Object.keys(toolResult[0]).map(key => (
                                                                <th key={key} className="px-4 py-2 border-b border-slate-200 font-bold text-slate-500 uppercase">{key}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 font-mono">
                                                        {toolResult.map((row: any, i: number) => (
                                                            <tr key={i} className="hover:bg-slate-50">
                                                                {Object.values(row).map((val: any, j) => (
                                                                    <td key={j} className="px-4 py-2 text-slate-700 whitespace-nowrap">{String(val)}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="p-4 font-mono text-xs text-slate-600">
                                                    <pre>{JSON.stringify(toolResult, null, 2)}</pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGate>
    );
}

export default function InvestigationPage() {
    return (
        <div className="dark bg-[#d1d5db] text-zinc-900 font-sans text-xs antialiased overflow-hidden h-screen flex flex-col metallic-gradient">
            {/* Header */}
            <header className="h-10 border-b border-border-sharp bg-deep-black flex items-center justify-between px-4 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white">
                        <span className="material-symbols-outlined text-lg">precision_manufacturing</span>
                        <h1 className="font-black text-xs tracking-widest uppercase">SYSTEM_INVESTIGATOR_V4</h1>
                    </div>
                    <div className="h-3 w-px bg-zinc-800"></div>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase">INCIDENT_ID:</span>
                        <span className="text-[9px] font-mono text-white font-bold tracking-widest bg-zinc-900 px-2 py-0.5 border border-zinc-700">#402-CRITICAL</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] text-zinc-500 uppercase font-bold">CONFIDENCE_INDEX</span>
                            <span className="text-xs font-mono text-white font-bold">94.82</span>
                        </div>
                        <div className="w-20 bg-zinc-900 h-1 border border-zinc-800">
                            <div className="bg-white h-full w-[94%]"></div>
                        </div>
                    </div>
                    <div className="h-6 w-px bg-zinc-800"></div>
                    <div className="flex items-center gap-1">
                        <button className="bg-zinc-900 border border-zinc-700 text-white px-3 py-1 text-[9px] font-bold hover:bg-zinc-800 transition-all uppercase tracking-tighter">
                            ESCALATE
                        </button>
                        <button className="bg-white text-black px-3 py-1 text-[9px] font-bold hover:bg-zinc-200 transition-all uppercase tracking-tighter">
                            EXECUTE_REMEDIATION
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Left Column: Telemetry Log Viewer */}
                <section className="w-[30%] border-r border-deep-black flex flex-col bg-terminal-bg relative">
                    <div className="h-7 border-b border-zinc-800 flex items-center justify-between px-3 bg-zinc-900">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs text-zinc-400">terminal</span>
                            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">TELEMETRY_LOG_VIEWER</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="size-1.5 bg-white animate-pulse"></span>
                        </div>
                    </div>
                    <div className="flex-1 p-3 font-mono text-[10.5px] overflow-y-auto custom-scrollbar leading-tight text-white">
                        <div className="space-y-1">
                            <div className="text-zinc-500">2024-05-24 14:02:11.452 <span className="text-zinc-300">[INFO]</span> [checkout-v2] Start transaction #TX-9821</div>
                            <div className="flex gap-2">
                                <span className="text-zinc-500">14:02:12.110</span>
                                <span className="text-white font-bold bg-zinc-800 px-1 border border-zinc-600">[ERR]</span>
                                <span className="text-zinc-200">[checkout-v2] Failed to acquire DB connection</span>
                            </div>
                            <div className="pl-6 border-l border-zinc-800 my-1 py-1 space-y-0.5">
                                <div className="text-zinc-400">{"{"}</div>
                                <div className="pl-4"><span className="text-white font-bold">"service"</span>: <span className="text-zinc-400">"checkout-v2"</span>,</div>
                                <div className="pl-4"><span className="text-white font-bold">"error"</span>: <span className="text-zinc-400">"PoolExhaustedException"</span>,</div>
                                <div className="pl-4"><span className="text-white font-bold">"metrics"</span>: {"{"} <span className="text-white font-bold">"active"</span>: <span className="text-zinc-300">100</span>, <span className="text-white font-bold">"max"</span>: <span className="text-zinc-300">100</span> {"}"}</div>
                                <div className="text-zinc-400">{"}"}</div>
                            </div>
                            <div className="text-zinc-500">2024-05-24 14:02:12.112 <span className="text-white font-bold">[FATAL]</span> [checkout-v2] Uncaught exception: Timeout</div>
                            <div className="text-zinc-500">2024-05-24 14:02:13.001 <span className="text-zinc-300">[WARN]</span> [circuit-breaker] state: OPEN</div>
                            <div className="text-zinc-500">2024-05-24 14:02:13.521 <span className="text-zinc-200 font-bold">[ERROR]</span> [api-gateway] Upstream 503 Service Unavailable</div>
                            <div className="text-zinc-500">2024-05-24 14:02:14.452 <span className="text-zinc-500">[INFO]</span> [checkout-v2] Start transaction #TX-9822</div>
                            <div className="text-zinc-500">2024-05-24 14:02:14.600 <span className="text-white border border-zinc-700 px-1">[ERR]</span> [checkout-v2] PoolExhausted: Retry #1</div>
                            <div className="text-zinc-500">2024-05-24 14:02:15.102 <span className="text-zinc-300">[INFO]</span> [auth-v2] Token verification successful</div>
                            <div className="text-zinc-500">2024-05-24 14:02:15.550 <span className="text-white border border-zinc-700 px-1">[ERR]</span> [checkout-v2] PoolExhausted: Retry #2</div>
                        </div>
                    </div>
                    <div className="h-7 border-t border-zinc-800 bg-zinc-900 px-3 flex items-center justify-between shrink-0">
                        <span className="text-[8px] font-mono text-zinc-500">FLT: SEVERITY &gt;= ERROR</span>
                        <span className="text-[8px] font-mono text-zinc-400">STRM_ACTV: 1,429 LN</span>
                    </div>
                </section>

                {/* Center Column: Causal Logic Graph */}
                <section className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="h-7 border-b border-deep-black flex items-center justify-between px-4 bg-zinc-900/10">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs text-black">schema</span>
                            <span className="text-[9px] font-black text-black uppercase tracking-widest">CAUSAL_LOGIC_GRAPH</span>
                        </div>
                        <div className="flex items-center gap-4 text-black">
                            <span className="text-[8px] font-bold">ZOOM: 100%</span>
                            <span className="text-[8px] font-bold uppercase">LAYOUT: DAG_STRICT</span>
                        </div>
                    </div>
                    <div className="flex-1 relative p-12 overflow-auto custom-scrollbar flex items-center justify-center">
                        <div className="relative flex flex-col items-center gap-16 w-full max-w-xl">
                            {/* Node 1 */}
                            <div className="relative z-10 w-56 p-4 bg-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] flex flex-col gap-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase">SIGNAL_01</span>
                                    <span className="text-[8px] px-1 border border-zinc-700 text-zinc-400">METRIC</span>
                                </div>
                                <div className="text-xs font-black text-white uppercase tracking-tighter">CPU_LOAD_CRITICAL</div>
                                <div className="h-8 w-full bg-zinc-900 border border-zinc-800 flex items-end p-0.5 gap-0.5">
                                    <div className="bg-white w-full h-[20%]"></div>
                                    <div className="bg-white w-full h-[45%]"></div>
                                    <div className="bg-white w-full h-[70%]"></div>
                                    <div className="bg-white w-full h-[95%]"></div>
                                    <div className="bg-white w-full h-[100%]"></div>
                                </div>
                            </div>

                            <div className="absolute top-[80px] h-16 w-0.5 bg-black"></div>
                            <div className="absolute top-[144px] text-black">
                                <span className="material-symbols-outlined text-sm font-black">arrow_downward</span>
                            </div>

                            {/* Node 2 */}
                            <div className="relative z-10 w-56 p-4 bg-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] flex flex-col gap-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase">SIGNAL_02</span>
                                    <span className="text-[8px] px-1 border border-zinc-700 text-zinc-400">LATENCY</span>
                                </div>
                                <div className="text-xs font-black text-white uppercase tracking-tighter">P99_THRESHOLD_EXCEEDED</div>
                                <div className="text-[9px] text-zinc-500 font-mono">VAL: 2854ms / COR: 0.89</div>
                            </div>

                            <div className="absolute top-[244px] h-16 w-0.5 bg-black"></div>
                            <div className="absolute top-[308px] text-black">
                                <span className="material-symbols-outlined text-sm font-black">arrow_downward</span>
                            </div>

                            {/* Node 3 */}
                            <div className="relative z-10 w-56 p-4 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] text-black font-black uppercase">ROOT_CAUSE</span>
                                    <span className="text-[9px] px-1 bg-black text-white font-bold">5XX_ERR</span>
                                </div>
                                <div className="text-xs font-black text-black uppercase leading-tight">DB_POOL_EXHAUSTION</div>
                                <div className="text-[8px] text-zinc-600 font-bold uppercase border-t border-black pt-1">
                                    REF: <span className="underline">v2.4.12_STABLE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-7 border-t border-deep-black bg-zinc-900/10 px-4 flex items-center justify-between shrink-0">
                        <div className="flex gap-4">
                            <span className="text-[8px] font-black text-black">NODES: 08</span>
                            <span className="text-[8px] font-black text-black">VERTICES: 07</span>
                        </div>
                        <span className="text-[8px] font-mono text-zinc-600 uppercase">Engine: ANALYTIC_CORE_12</span>
                    </div>
                </section>

                {/* Right Column: Infrastructure Metadata & Similar History */}
                <section className="w-[25%] border-l border-deep-black flex flex-col bg-deep-black">
                    <div className="p-4 border-b border-zinc-900">
                        <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs">layers</span> INFRASTRUCTURE_METADATA
                        </h3>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800">
                                <span className="text-[9px] text-zinc-500 font-mono">CLUSTER</span>
                                <span className="text-[9px] text-white font-bold font-mono">PROD-US-EAST-1</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800">
                                <span className="text-[9px] text-zinc-500 font-mono">NAMESPACE</span>
                                <span className="text-[9px] text-white font-bold font-mono">CHK-SVC</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800">
                                <span className="text-[9px] text-zinc-500 font-mono">POD_ID</span>
                                <span className="text-[9px] text-white font-bold font-mono uppercase">V2-7F9B88-4K2</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-zinc-900 flex items-center justify-between">
                            <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-xs">history</span> SIMILAR_HISTORY
                            </h3>
                            <span className="text-[8px] px-1 bg-zinc-800 text-zinc-400 font-mono">VECTOR_SIM</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                            <div className="p-3 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-bold text-white border-b border-white">#IRS-210</span>
                                    <div className="text-right">
                                        <span className="text-[9px] text-white font-black block">92.4% MATCH</span>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-zinc-300 uppercase mb-1">POSTGRES_POOL_SATURATION</div>
                                <p className="text-[9px] text-zinc-500 leading-tight">Mar-12-2024: Stack trace identity match in checkout-v2 module.</p>
                            </div>
                            <div className="p-3 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-bold text-white border-b border-white">#IRS-184</span>
                                    <div className="text-right">
                                        <span className="text-[9px] text-zinc-400 font-black block">76.1% MATCH</span>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-zinc-300 uppercase mb-1">GW_504_TIMEOUT_SURGE</div>
                                <p className="text-[9px] text-zinc-500 leading-tight">Cascading failure triggered by identity provider latency.</p>
                            </div>
                        </div>
                        <div className="p-3">
                            <button className="w-full py-2 bg-zinc-900 border border-zinc-700 text-[9px] font-black text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
                                ELASTIC_DEEP_SEARCH
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="h-7 border-t border-border-sharp bg-deep-black flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] text-zinc-600 uppercase font-bold">CORE_STATUS:</span>
                        <div className="flex items-center gap-1.5">
                            <span className="size-1 bg-white"></span>
                            <span className="text-[8px] font-bold text-zinc-400 font-mono">NOMINAL</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] text-zinc-600 uppercase font-bold">OPERATOR:</span>
                        <span className="text-[8px] font-bold text-zinc-400 font-mono">ALPHA_SRE_04</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[8px] text-zinc-600 font-mono">LAT: 0.42ms</div>
                    <div className="h-2 w-px bg-zinc-800"></div>
                    <div className="text-[8px] text-zinc-600 font-mono uppercase">2024-05-24 14:16:02 UTC</div>
                </div>
            </footer>
        </div>
    );
}

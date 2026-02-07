export default function ActionPage() {
    return (
        <div className="bg-metallic-bg text-slate-300 min-h-screen font-display metallic-texture overflow-x-hidden">
            {/* Header */}
            <header className="flex items-center justify-between border-b-2 border-industrial-black px-10 py-3 bg-metallic-panel shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="size-10 flex items-center justify-center bg-industrial-black beveled-border">
                            <span className="material-symbols-outlined text-white text-xl">settings_input_component</span>
                        </div>
                        <div>
                            <h2 className="text-white text-sm font-black leading-tight tracking-[0.2em] uppercase">Sentinel Execution Engine</h2>
                            <p className="text-[10px] font-mono text-slate-400">DECISION-SUPPORT-SYSTEM-v4.0</p>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
                        <a className="px-4 py-2 text-slate-400 hover:bg-industrial-black/20 transition-colors uppercase" href="#">Operations</a>
                        <a className="px-4 py-2 bg-industrial-black text-white border-b-2 border-white uppercase font-bold" href="#">Decision Center</a>
                        <a className="px-4 py-2 text-slate-400 hover:bg-industrial-black/20 transition-colors uppercase" href="#">Simulations</a>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden xl:flex flex-col items-end border-r border-slate-600 pr-6">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Global Status</span>
                        <span className="text-xs text-emerald-500 font-mono font-bold uppercase">Ready // Prod-US-East-1</span>
                    </div>
                    <div className="bg-industrial-black p-1 beveled-border">
                        <div className="aspect-square bg-cover size-8 grayscale contrast-125 bg-slate-500 relative">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUrqWremcuwiCJYg_BTJ7VNCm5UO607mN6vW-QVf5wRPS3NfDAO8rdyN_k-4wf-m8P1BJnKb8icBMtMFUbtkzQma3h332Ap2n10UdjcgYFuyi8mGuO9ZBrOmGPMEy3EzT0GIK-TzhaCGIKt8gme5fKN8PLB1R2L7FEHUVnYrsLFfbi4bvmtGUWJj4xylj5GihLhMUm9eQ3yn8-5WAAxx6rUpT_5YnhvAt3jTf1mKgM-jJwjXfs5apLOUIPzl9ldxQD9dRzBBVP-AU" alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 max-w-7xl mx-auto w-full gap-8">
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 uppercase">
                            <span className="text-white">Decision Engine</span>
                            <span className="material-symbols-outlined text-[12px]">keyboard_double_arrow_right</span>
                            <span className="bg-industrial-black px-1.5 py-0.5 text-slate-300">Execution Protocol #284-B</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Decision Support & Execution</h1>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-industrial-black beveled-border p-3 flex items-center gap-4 min-w-[190px]">
                            <div className="size-10 bg-emerald-500/10 flex items-center justify-center text-emerald-500 panel-inset">
                                <span className="material-symbols-outlined">analytics</span>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Estimated Reward</p>
                                <p className="text-lg font-mono font-black text-emerald-500">MAX_IMPACT</p>
                            </div>
                        </div>
                        <div className="bg-industrial-black beveled-border p-3 flex items-center gap-4 min-w-[190px]">
                            <div className="size-10 bg-red-500/10 flex items-center justify-center text-red-500 panel-inset">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Risk Assessment</p>
                                <p className="text-lg font-mono font-black text-red-500">MOD_HIGH</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        <div className="bg-industrial-black beveled-border relative shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-30"></div>
                            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="size-3 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>
                                        <span className="text-white text-[10px] font-mono font-bold uppercase tracking-[0.3em]">AI Agent Recommendation</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white uppercase leading-none">Rollback to Stable Release <span className="text-slate-600 font-mono">v2.4.1</span></h2>
                                </div>
                                <div className="bg-metallic-bg beveled-border p-4 text-center min-w-[140px]">
                                    <div className="text-4xl font-mono font-black text-white">98.4<span className="text-lg">%</span></div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Confidence Score</div>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">equalizer</span> Signal Weight Breakdown
                                    </h3>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-mono font-bold uppercase">
                                                <span className="text-slate-400">HTTP 5xx Correlation</span>
                                                <span className="text-white">0.92</span>
                                            </div>
                                            <div className="h-3 w-full bg-metallic-bg panel-inset p-0.5">
                                                <div className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ width: '92%' }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-mono font-bold uppercase">
                                                <span className="text-slate-400">Deployment Match</span>
                                                <span className="text-white">0.88</span>
                                            </div>
                                            <div className="h-3 w-full bg-metallic-bg panel-inset p-0.5">
                                                <div className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ width: '88%' }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-mono font-bold uppercase">
                                                <span className="text-slate-400">Pod Health Probes</span>
                                                <span className="text-white">0.75</span>
                                            </div>
                                            <div className="h-3 w-full bg-metallic-bg panel-inset p-0.5">
                                                <div className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">show_chart</span> Rollback Projection
                                    </h3>
                                    <div className="relative h-32 w-full bg-black panel-inset overflow-hidden border border-white/5">
                                        <svg className="w-full h-full p-2" preserveAspectRatio="none" viewBox="0 0 200 80">
                                            <line stroke="#1a1a1a" strokeWidth="1" x1="0" x2="200" y1="20" y2="20"></line>
                                            <line stroke="#1a1a1a" strokeWidth="1" x1="0" x2="200" y1="40" y2="40"></line>
                                            <line stroke="#1a1a1a" strokeWidth="1" x1="0" x2="200" y1="60" y2="60"></line>
                                            <path d="M0 25 L20 20 L40 35 L60 15 L80 28 L100 20" fill="none" stroke="#ef4444" strokeWidth="2"></path>
                                            <line stroke="#475569" strokeDasharray="2,2" strokeWidth="1" x1="100" x2="100" y1="0" y2="80"></line>
                                            <path d="M100 20 C120 45, 140 65, 200 70" fill="none" stroke="#10b981" strokeDasharray="4,2" strokeWidth="2"></path>
                                            <path d="M100 20 C120 45, 140 65, 200 70 L200 80 L100 80 Z" fill="rgba(16,185,129,0.1)"></path>
                                        </svg>
                                        <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 uppercase">Input Error Rate</div>
                                        <div className="absolute top-2 right-2 text-[8px] font-mono text-emerald-500 font-bold uppercase text-right">Proj: -92% Errors<br />T+4m</div>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 bg-metallic-bg/50 p-2 beveled-border">
                                        <span className="material-symbols-outlined text-[14px]">terminal</span>
                                        Stability converge within 270s post-exec.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-industrial-black beveled-border p-8">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">verified</span> Pre-flight Protocol Checklist
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-4 bg-metallic-bg beveled-border">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-emerald-500">check_box</span>
                                        <span className="text-xs font-bold text-white uppercase tracking-tighter">Database Backup Status</span>
                                    </div>
                                    <span className="text-[9px] bg-emerald-500 text-black px-1.5 py-0.5 font-black uppercase">Verified</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-metallic-bg beveled-border">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-emerald-500">check_box</span>
                                        <span className="text-xs font-bold text-white uppercase tracking-tighter">Traffic Shift Readiness</span>
                                    </div>
                                    <span className="text-[9px] bg-emerald-500 text-black px-1.5 py-0.5 font-black uppercase">Active</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-metallic-bg beveled-border border-l-4 border-l-amber-500">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-amber-500">sync_saved_locally</span>
                                        <span className="text-xs font-bold text-white uppercase tracking-tighter">API Compatibility Check</span>
                                    </div>
                                    <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 font-black uppercase">Process</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-metallic-bg beveled-border opacity-60">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-500">check_box_outline_blank</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Canary Cleanup Tasks</span>
                                    </div>
                                    <span className="text-[9px] bg-slate-700 text-slate-400 px-1.5 py-0.5 font-black uppercase">Queue</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="bg-industrial-black beveled-border p-6 shadow-xl sticky top-24">
                            <div className="mb-8 p-4 bg-metallic-bg/30 panel-inset">
                                <h3 className="text-xs font-black text-white uppercase mb-2 tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">gpp_maybe</span> Execution Safety
                                </h3>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                    CRITICAL ACTION: Requires dual-token validation from lead engineer and automated compliance scan.
                                </p>
                            </div>
                            <div className="bg-metallic-bg p-5 beveled-border mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-slate-300 text-[20px]">admin_panel_settings</span>
                                        <span className="text-xs font-black text-white uppercase tracking-tighter">Secondary Approval</span>
                                    </div>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input defaultChecked className="sr-only peer" type="checkbox" />
                                        <div className="relative w-10 h-5 bg-black panel-inset peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-white after:border after:border-slate-400"></div>
                                    </label>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-black beveled-border flex items-center justify-center text-[10px] font-mono font-bold text-slate-500">
                                        [AC]
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Wait: Alex Chen</p>
                                            <span className="text-[9px] font-mono text-white">50%</span>
                                        </div>
                                        <div className="w-full h-2 bg-black panel-inset p-0.5">
                                            <div className="w-1/2 h-full bg-white"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <button className="w-full group relative overflow-hidden h-14 bg-white text-black font-black text-sm tracking-[0.2em] uppercase transition-all hover:bg-slate-200 active:scale-[0.98] beveled-border">
                                    <span className="flex items-center justify-center gap-3">
                                        <span className="material-symbols-outlined">bolt</span>
                                        Approve & Execute
                                    </span>
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="h-12 bg-metallic-bg text-slate-300 border border-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-colors">
                                        Reject Action
                                    </button>
                                    <button className="h-12 bg-metallic-bg text-slate-300 border border-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-colors">
                                        Modify Plan
                                    </button>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center mb-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                    <span>Activity Ledger</span>
                                    <span className="text-white hover:underline cursor-pointer">Export Logs</span>
                                </div>
                                <div className="space-y-3 font-mono text-[10px]">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[14px] text-slate-600">history</span>
                                        <span className="text-slate-400">REC BY <span className="text-white">[SENTIENT_AI]</span></span>
                                        <span className="ml-auto text-slate-600 italic">T-2m</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[14px] text-slate-600">visibility</span>
                                        <span className="text-slate-400">AUDIT STARTED</span>
                                        <span className="ml-auto text-slate-600 italic">T-1m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-950/20 beveled-border border-l-4 border-l-red-600 p-6">
                            <div className="flex items-start gap-4">
                                <div className="size-8 bg-red-600 flex items-center justify-center text-black shrink-0">
                                    <span className="material-symbols-outlined text-[20px] font-bold">priority_high</span>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Impact Warning</h4>
                                    <p className="text-[11px] text-slate-400 leading-tight font-medium">
                                        Rollback terminates <span className="text-white font-mono">3 active websocket streams</span> in SHARD-CHECKOUT. Immediate reconnect logic required.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t-2 border-industrial-black py-4 px-10 flex justify-between items-center bg-metallic-panel text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">
                <div className="flex items-center gap-6">
                    <span>© 2024 Sentinel Ops Engine</span>
                    <a className="hover:text-white transition-colors" href="#">Security Protocol</a>
                    <a className="hover:text-white transition-colors" href="#">Auditor Terminal</a>
                </div>
                <div className="flex items-center gap-3 bg-industrial-black px-4 py-1.5 beveled-border">
                    <span className="size-1.5 bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                    <span className="font-mono text-white">System Status: Nominal // 124 Nodes</span>
                </div>
            </footer>
        </div>
    );
}

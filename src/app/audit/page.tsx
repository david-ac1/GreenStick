import Image from "next/image";

export default function AuditPage() {
    return (
        <div className="bg-background-dark text-slate-300 min-h-screen font-display">
            <header className="sticky top-0 z-50 w-full border-b border-solid border-border-dark bg-black/95 backdrop-blur-md px-6 lg:px-10 py-3">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between whitespace-nowrap">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                <span className="material-symbols-outlined text-zinc-400">shield_with_heart</span>
                            </div>
                            <h2 className="text-white text-lg font-bold leading-tight tracking-tighter uppercase">Forensic <span className="text-zinc-500 font-normal">Audit</span></h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a className="text-zinc-500 hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-colors" href="#">System</a>
                            <a className="text-zinc-500 hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-colors" href="#">Traces</a>
                            <a className="text-white text-[11px] font-bold uppercase tracking-[0.2em] border-b border-white pb-1" href="#">Forensic Log</a>
                            <a className="text-zinc-500 hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-colors" href="#">Integrity</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">search</span>
                            <input className="w-64 bg-black border-border-dark rounded-none pl-10 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 text-white placeholder-zinc-700" placeholder="Trace ID / SHA-256 / Object..." type="text" />
                        </div>
                        <div className="h-8 w-8 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden relative">
                            <Image
                                alt="User avatar"
                                className="grayscale opacity-80 object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvv5KOozEFn8lRSrqjsMTCk_GIZXgV7zZKiro15Nv_DZyrqQfCxq-rhY4KD9-WpF2uh8lsd31-79W9xw9OzumqJBVardh5IvUYNQy3UfK67Je0IUjuh1foTifGhgznQ4maP6r4zTgDzTw080_xycoWlTCU5iiJoph-ITfNg41UM78BGFY6gHHPy57dlEsmDbNOQQj-7Gh0tilC4PNyNqOwDrrNWrzeRoA_EMCxXcxyqr9vYnIQZ0KVLcwCUQ5r3KpAZck1YY7ua_U"
                                fill
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto p-6 lg:p-10">
                <div className="flex flex-wrap justify-between items-end gap-4 mb-10 pb-6 border-b border-border-dark">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-white text-4xl font-light leading-tight tracking-tighter">Forensic Audit Log</h1>
                            <span className="px-2 py-0.5 border border-zinc-800 text-[10px] font-mono text-zinc-500 bg-zinc-900/50 uppercase">Secured v4.2</span>
                        </div>
                        <p className="text-zinc-500 text-xs font-medium tracking-wide flex items-center gap-2">
                            <span className="size-1.5 bg-white rounded-full"></span>
                            NODE_ARRAY_ACTIVE: 142 SERVICES IN COGNITIVE LOOP
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-black border border-zinc-800 hover:border-zinc-600 transition-all text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                            <span className="material-symbols-outlined text-sm">filter_list</span>
                            Refine Scope
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-all text-[10px] font-bold uppercase tracking-[0.2em]">
                            <span className="material-symbols-outlined text-sm">ios_share</span>
                            Export Manifest
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-10">
                    <div className="border border-border-dark bg-surface-dark p-6">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-1">Incident Velocity & Resolution</h3>
                                <p className="text-zinc-600 text-[10px] uppercase font-mono">72HR Forensic Window • Sample Rate: 100ms</p>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="size-2 bg-zinc-700"></span>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Anomalies Detected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2 bg-white"></span>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Resolved States</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-48 relative">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
                                <defs>
                                    <linearGradient id="grad-dark" x1="0%" x2="0%" y1="0%" y2="100%">
                                        <stop offset="0%" stopColor="#262626" stopOpacity="0.8"></stop>
                                        <stop offset="100%" stopColor="#000000" stopOpacity="0.2"></stop>
                                    </linearGradient>
                                    <linearGradient id="grad-light" x1="0%" x2="0%" y1="0%" y2="100%">
                                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,150 Q100,140 200,160 T400,90 T600,130 T800,50 T1000,80 L1000,200 L0,200 Z" fill="url(#grad-dark)"></path>
                                <path d="M0,150 Q100,140 200,160 T400,90 T600,130 T800,50 T1000,80" fill="none" stroke="#404040" strokeDasharray="2 2" strokeWidth="1.5"></path>
                                <path d="M0,160 Q100,145 200,165 T400,120 T600,150 T800,70 T1000,100 L1000,200 L0,200 Z" fill="url(#grad-light)"></path>
                                <path d="M0,160 Q100,145 200,165 T400,120 T600,150 T800,70 T1000,100" fill="none" stroke="#ffffff" strokeWidth="2"></path>
                            </svg>
                            <div className="flex justify-between mt-4 border-t border-zinc-900 pt-3">
                                <span className="text-[10px] font-mono text-zinc-700">T-72H</span>
                                <span className="text-[10px] font-mono text-zinc-700">T-48H</span>
                                <span className="text-[10px] font-mono text-zinc-700">T-24H</span>
                                <span className="text-[10px] font-mono text-white">LIVE_NOW</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mr-2">Quick Filters:</span>
                    <div className="flex items-center gap-2 bg-black border border-zinc-800 px-3 py-1.5 rounded-none">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Ver:</span>
                        <select className="bg-transparent border-none text-[10px] font-mono text-white p-0 focus:ring-0 cursor-pointer pr-6 uppercase">
                            <option>v4.2.0-stable</option>
                            <option>v4.3.1-beta</option>
                            <option>Legacy v3.9</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-black border border-zinc-800 px-3 py-1.5 rounded-none">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Confidence:</span>
                        <select className="bg-transparent border-none text-[10px] font-mono text-white p-0 focus:ring-0 cursor-pointer pr-6 uppercase">
                            <option>&gt; 95% High</option>
                            <option>&gt; 80% Med</option>
                            <option>All Thresholds</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-black border border-zinc-800 px-3 py-1.5 rounded-none">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Type:</span>
                        <select className="bg-transparent border-none text-[10px] font-mono text-white p-0 focus:ring-0 cursor-pointer pr-6 uppercase">
                            <option>Auto-Remediated</option>
                            <option>Escalated</option>
                            <option>Manual Override</option>
                        </select>
                    </div>
                    <div className="w-px h-6 bg-border-dark mx-2"></div>
                    <button className="text-[10px] font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">Clear Overlays</button>
                </div>

                <div className="bg-surface-dark border border-border-dark overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse table-fixed min-w-[1200px]">
                            <thead>
                                <tr className="bg-black border-b border-border-dark">
                                    <th className="w-12 px-4 py-4"></th>
                                    <th className="w-44 px-4 py-4 text-[10px] font-bold text-white uppercase tracking-[0.2em]">Timestamp</th>
                                    <th className="w-48 px-4 py-4 text-[10px] font-bold text-white uppercase tracking-[0.2em]">Trace & Manifest</th>
                                    <th className="w-44 px-4 py-4 text-[10px] font-bold text-white uppercase tracking-[0.2em]">Execution Type</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-white uppercase tracking-[0.2em]">Causal Analysis</th>
                                    <th className="w-32 px-4 py-4 text-[10px] font-bold text-white uppercase tracking-[0.2em]">Cert Score</th>
                                    <th className="w-40 px-4 py-4 text-[10px] font-bold text-white uppercase tracking-[0.2em]">Human Audit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-dark">
                                <tr className="hover:bg-zinc-900/40 transition-colors group">
                                    <td className="px-4 py-6 align-top">
                                        <span className="material-symbols-outlined text-zinc-700 group-hover:text-white cursor-pointer text-base">expand_more</span>
                                    </td>
                                    <td className="px-4 py-6 align-top">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-white font-mono">14:12:05.442</span>
                                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">27 OCT 2023</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 align-top">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 w-fit border border-zinc-700">TR-8821-XK9</span>
                                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Core: v4.2.0-stable</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 align-top">
                                        <div className="flex items-center gap-2">
                                            <span className="size-1.5 bg-zinc-400"></span>
                                            <span className="text-[11px] font-bold text-white tracking-widest uppercase">K8S_RESTART</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 align-top">
                                        <div className="space-y-3">
                                            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">Memory leak in <code className="text-[10px] bg-zinc-900 border border-zinc-800 px-1 text-white">auth-svc-v2</code>. Entropy delta exceeded 0.85 threshold. Pod termination initiated for heap clearance.</p>
                                            <details className="group/json">
                                                <summary className="text-[10px] font-bold text-zinc-500 cursor-pointer hover:text-white flex items-center gap-1.5 uppercase tracking-widest transition-colors mb-2">
                                                    <span className="material-symbols-outlined text-[14px]">terminal</span>
                                                    Inspect JSON State
                                                </summary>
                                                <div className="mt-2 p-4 bg-black border border-border-dark json-payload overflow-x-auto shadow-inner">
                                                    <pre className="text-zinc-500 text-xs">
                                                        {`{
  "id": "tr-8821-xk9",
  "anomaly_score": 0.942,
  "patterns": ["leak_sig_04", "cpu_drift_high"],
  "remediation": {
    "target": "pod/auth-svc-v2-5fb9",
    "signal": "SIGTERM"
  },
  "metrics": {
    "fidelity": 0.99,
    "success_prob": 0.91
  }
}`}
                                                    </pre>
                                                </div>
                                            </details>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 align-top">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-xs text-white font-mono font-bold">98.2%</span>
                                            <div className="w-full h-[3px] bg-zinc-900 overflow-hidden">
                                                <div className="h-full bg-white" style={{ width: '98%' }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 align-top">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 bg-zinc-900 hover:bg-white hover:text-black text-zinc-500 border border-zinc-800 transition-all">
                                                <span className="material-symbols-outlined text-base">thumb_up</span>
                                            </button>
                                            <button className="p-2 bg-zinc-900 hover:bg-zinc-100 hover:text-black text-zinc-500 border border-zinc-800 transition-all">
                                                <span className="material-symbols-outlined text-base">thumb_down</span>
                                            </button>
                                            <div className="w-px h-4 bg-zinc-800 mx-1"></div>
                                            <span className="text-[10px] font-bold text-zinc-700 tracking-widest">PENDING</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-5 border-t border-border-dark flex items-center justify-between bg-black/40">
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">Manifest Hash: 8E2F...A91C • Displaying 15 Forensic Entries</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-black border border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:text-white hover:border-zinc-600 transition-colors">Prev</button>
                            <div className="flex gap-1">
                                <button className="px-4 py-2 bg-white text-black text-[10px] font-bold">01</button>
                                <button className="px-4 py-2 bg-black border border-zinc-800 text-zinc-500 text-[10px] font-bold hover:text-white transition-colors">02</button>
                                <button className="px-4 py-2 bg-black border border-zinc-800 text-zinc-500 text-[10px] font-bold hover:text-white transition-colors">03</button>
                            </div>
                            <button className="px-4 py-2 bg-black border border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:text-white hover:border-zinc-600 transition-colors">Next</button>
                        </div>
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 border border-zinc-800 bg-surface-dark/50">
                        <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="size-1.5 bg-zinc-400"></span>
                            Alignment Matrix
                        </h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Model decisions are 94% congruent with manual SRE verification over the last 30-day epoch. Drift is within nominal range (+2.1%).</p>
                    </div>
                    <div className="p-6 border border-zinc-800 bg-surface-dark/50">
                        <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="size-1.5 bg-zinc-400"></span>
                            Ambiguity Thresholds
                        </h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">12 incidents were successfully escalated due to confidence vector collapsing below 0.80. No catastrophic failures recorded.</p>
                    </div>
                    <div className="p-6 border border-zinc-800 bg-surface-dark/50">
                        <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="size-1.5 bg-zinc-400"></span>
                            Chain of Custody
                        </h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Audit logs are immutable, Merkle-tree verified, and cryptographically anchored to internal ledger for compliance audit readiness.</p>
                    </div>
                </div>
            </main>

            <footer className="mt-20 p-10 border-t border-border-dark bg-black">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
                    <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                        <span>Latency: 24ms</span>
                        <span>Cluster: us-west-2-prod</span>
                        <span>Auth: SHA-256 Validated</span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                        © 2023 Forensic Engine • Stark Systems Architecture
                    </div>
                </div>
            </footer>
        </div>
    );
}

import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[var(--metallic-bg)] text-[var(--obsidian)] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black flex flex-col transition-all duration-300 flex-shrink-0 z-20">
        <div className="h-14 flex items-center px-4 border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="size-8 bg-white/10 rounded flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-sm">terminal</span>
            </div>
            <span className="font-bold text-sm tracking-tight whitespace-nowrap text-white">COMMAND CENTER</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 space-y-1">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</p>
          </div>
          <Link className="flex items-center gap-3 px-4 py-2.5 text-white bg-white/10 border-r-4 border-white group" href="/">
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span className="text-xs font-semibold">Overview</span>
          </Link>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">warning</span>
                <span className="text-xs font-medium">Incidents</span>
              </div>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <div className="pl-12 space-y-1">
              <Link className="block py-1.5 text-[11px] text-slate-500 hover:text-white" href="/incident/active">Active Queue</Link>
              <Link className="block py-1.5 text-[11px] text-slate-500 hover:text-white" href="/incident/archive">Historical Archive</Link>
              <Link className="block py-1.5 text-[11px] text-slate-500 hover:text-white" href="/incident/post-mortems">Post-Mortems</Link>
            </div>
          </div>
          <Link className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors group" href="/anomalies">
            <span className="material-symbols-outlined text-xl">analytics</span>
            <span className="text-xs font-medium">Anomalies</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors group" href="/audit">
            <span className="material-symbols-outlined text-xl">shield</span>
            <span className="text-xs font-medium">Security Audit</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors group" href="/settings">
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="text-xs font-medium">System Config</span>
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
              <p className="text-[11px] font-bold text-white truncate uppercase tracking-tighter">ARIVERA_SRE</p>
              <p className="text-[9px] text-slate-500 truncate font-mono">LVL_04_ROOT</p>
            </div>
            <span className="material-symbols-outlined text-slate-500 text-sm cursor-pointer hover:text-white">logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-[var(--metallic-surface)] border-b border-slate-300 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex items-end gap-[2px] h-4">
                <div className="w-[3px] bg-emerald-500 rounded-[1px] h-2"></div>
                <div className="w-[3px] bg-emerald-500 rounded-[1px] h-3"></div>
                <div className="w-[3px] bg-emerald-500 rounded-[1px] h-1"></div>
                <div className="w-[3px] bg-emerald-500 rounded-[1px] h-4"></div>
                <div className="w-[3px] bg-emerald-500 rounded-[1px] h-2"></div>
                <div className="w-[3px] bg-emerald-500 rounded-[1px] h-3"></div>
                <div className="w-[3px] bg-emerald-500 rounded-[1px] h-2"></div>
                <div className="w-[3px] bg-emerald-500 rounded-[1px] h-4"></div>
                <div className="w-[3px] bg-emerald-500 rounded-[1px] h-1"></div>
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status: <span className="text-black bg-emerald-400 px-2 py-0.5 rounded-sm">STABLE</span></span>
            </div>
            <div className="relative w-96">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-base">search</span>
              <input className="w-full pl-8 pr-4 py-1.5 bg-white/50 border border-slate-300 rounded-sm text-xs focus:ring-1 focus:ring-black focus:border-black transition-all font-mono" placeholder="grep --trace-id '942-fca' /var/log/..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-300 rounded-sm">
              <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] font-bold text-black font-mono uppercase tracking-tight">NODE: US-EAST-1</span>
            </div>
            <button className="bg-black text-white text-[10px] font-bold px-4 py-2 rounded-sm hover:bg-slate-800 transition-colors flex items-center gap-2 uppercase tracking-widest border border-black shadow-lg">
              <span className="material-symbols-outlined text-sm">add</span>
              Create Incident
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex bg-[var(--metallic-bg)]">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {/* Stat Cards */}
              <div className="bg-white border-b-2 border-b-black p-4 shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Incidents</span>
                  <span className="text-rose-600 text-[10px] font-bold font-mono">+12.4%</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold font-mono leading-none tracking-tighter text-black">08</span>
                  <div className="flex items-end gap-[1px] h-6 flex-1 mb-1">
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-2"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-4"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-3"></div>
                    <div className="flex-1 bg-rose-500 min-h-[2px] h-6"></div>
                    <div className="flex-1 bg-rose-400 min-h-[2px] h-5"></div>
                    <div className="flex-1 bg-rose-400 min-h-[2px] h-4"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-3"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-b-2 border-b-black p-4 shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Anomaly Flux</span>
                  <span className="text-emerald-600 text-[10px] font-bold font-mono">-4.2%</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold font-mono leading-none tracking-tighter text-black">142</span>
                  <div className="flex items-end gap-[1px] h-6 flex-1 mb-1">
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-4"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-5"></div>
                    <div className="flex-1 bg-emerald-500 min-h-[2px] h-6"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-4"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-3"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-2"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-1"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-b-2 border-b-black p-4 shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">MTTR Avg</span>
                  <span className="text-slate-400 text-[10px] font-bold font-mono">STABLE</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold font-mono leading-none tracking-tighter text-black">15<span className="text-sm font-normal text-slate-400 tracking-tighter ml-0.5">m</span></span>
                  <div className="flex items-end gap-[1px] h-6 flex-1 mb-1">
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-3"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-3"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-4"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-4"></div>
                    <div className="flex-1 bg-slate-900 min-h-[2px] h-4"></div>
                    <div className="flex-1 bg-slate-900 min-h-[2px] h-4"></div>
                    <div className="flex-1 bg-slate-300 min-h-[2px] h-4"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-b-2 border-b-black p-4 shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Agent Accuracy</span>
                  <span className="text-emerald-600 text-[10px] font-bold font-mono">+0.8%</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold font-mono leading-none tracking-tighter text-black">99.8%</span>
                  <div className="flex items-end gap-[1px] h-6 flex-1 mb-1">
                    <div className="flex-1 bg-emerald-400 min-h-[2px] h-6"></div>
                    <div className="flex-1 bg-emerald-400 min-h-[2px] h-6"></div>
                    <div className="flex-1 bg-emerald-500 min-h-[2px] h-5"></div>
                    <div className="flex-1 bg-emerald-600 min-h-[2px] h-6"></div>
                    <div className="flex-1 bg-emerald-500 min-h-[2px] h-6"></div>
                    <div className="flex-1 bg-emerald-400 min-h-[2px] h-6"></div>
                    <div className="flex-1 bg-emerald-400 min-h-[2px] h-6"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Incident Stream */}
            <div className="bg-white border border-slate-300 rounded-sm shadow-xl flex flex-col overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Incident Stream</h3>
                  <div className="h-4 w-px bg-slate-300"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-slate-500 font-mono">Showing 24 of 1,284 entries</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold border border-slate-300 hover:bg-slate-50 transition-colors uppercase">
                    <span className="material-symbols-outlined text-sm">filter_alt</span> Filter
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold border border-slate-300 hover:bg-slate-50 transition-colors uppercase">
                    <span className="material-symbols-outlined text-sm">download</span> Export
                  </button>
                  <button className="bg-black p-1 text-white">
                    <span className="material-symbols-outlined text-sm">more_vert</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b-2 border-black">
                        Status <span className="material-symbols-outlined text-[12px] align-middle ml-1">swap_vert</span>
                      </th>
                      <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b-2 border-black">
                        Severity <span className="material-symbols-outlined text-[12px] align-middle ml-1">swap_vert</span>
                      </th>
                      <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b-2 border-black">
                        Record ID <span className="material-symbols-outlined text-[12px] align-middle ml-1">swap_vert</span>
                      </th>
                      <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-full border-b-2 border-black">
                        Event Message
                      </th>
                      <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b-2 border-black">
                        Assigned Agent
                      </th>
                      <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b-2 border-black">
                        ISO_8601
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-rose-500 text-white font-bold uppercase tracking-tighter border border-rose-600">
                          Active
                        </span>
                      </td>
                      <td className="px-5 py-3 font-bold text-rose-600">CRITICAL</td>
                      <td className="px-5 py-3 text-black font-semibold">#IR-402</td>
                      <td className="px-5 py-3 text-slate-700 truncate max-w-md">LATENCY_SPIKE_DETECTED (850ms) us-east-1-api-cluster</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-black">smart_toy</span>
                          <span className="font-semibold text-black">DELTA_01</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">14:02:11.452</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-amber-500 text-black font-bold uppercase tracking-tighter border border-amber-600">
                          Pending
                        </span>
                      </td>
                      <td className="px-5 py-3 font-bold text-amber-600">WARNING</td>
                      <td className="px-5 py-3 text-black font-semibold">#IR-398</td>
                      <td className="px-5 py-3 text-slate-700 truncate max-w-md">DB_POOL_EXHAUSTION (88%) shard-04-primary</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-black">person</span>
                          <span className="font-semibold text-black">HUMAN_OPS</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">13:58:02.110</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-emerald-500 text-white font-bold uppercase tracking-tighter border border-emerald-600">
                          Resolved
                        </span>
                      </td>
                      <td className="px-5 py-3 font-bold text-slate-400">LOW_PRIO</td>
                      <td className="px-5 py-3 text-black font-semibold">#IR-395</td>
                      <td className="px-5 py-3 text-slate-700 truncate max-w-md">S3_POLICY_REMEDIATION sandbox-env-audit</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-black">smart_toy</span>
                          <span className="font-semibold text-black">SIGMA_09</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">13:45:55.901</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                <div className="flex gap-1">
                  <button className="px-3 py-1 bg-white border border-slate-300 rounded-sm text-[10px] font-bold hover:bg-black hover:text-white transition-all uppercase">Prev</button>
                  <button className="px-3 py-1 bg-black text-white border border-black rounded-sm text-[10px] font-bold uppercase">1</button>
                  <button className="px-3 py-1 bg-white border border-slate-300 rounded-sm text-[10px] font-bold hover:bg-slate-100 uppercase">2</button>
                  <button className="px-3 py-1 bg-white border border-slate-300 rounded-sm text-[10px] font-bold hover:bg-black hover:text-white transition-all uppercase">Next</button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-500 font-mono">JUMP TO PAGE</span>
                  <input className="w-12 h-6 text-[10px] font-mono border-slate-300 p-1 text-center" type="text" defaultValue="1" />
                </div>
              </div>
            </div>
          </div>

          <aside className="w-80 bg-white border-l border-slate-300 flex flex-col flex-shrink-0">
            <div className="p-4 border-b-2 border-black flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Agent Activity</h3>
              <span className="text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-sm">LIVE</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="relative pl-6 pb-2 border-l-2 border-emerald-500">
                <div className="absolute -left-[5px] top-0 size-2.5 rounded-full bg-emerald-500 border-2 border-white"></div>
                <p className="text-[9px] font-bold text-slate-400 mb-1 font-mono">14:05:12.822</p>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-sm shadow-sm">
                  <p className="text-[11px] font-semibold text-black leading-tight">Agent-Delta-01 initialized trace analysis on #IR-402</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 bg-black text-white rounded-[1px] text-[8px] font-bold tracking-tight">ANALYZING</span>
                    <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded-[1px] text-[8px] font-bold tracking-tight">K8S_CTX</span>
                  </div>
                </div>
              </div>
              <div className="relative pl-6 pb-2 border-l-2 border-slate-200">
                <div className="absolute -left-[5px] top-0 size-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                <p className="text-[9px] font-bold text-slate-400 mb-1 font-mono">14:04:45.109</p>
                <div className="bg-white border border-slate-100 p-3 rounded-sm opacity-60">
                  <p className="text-[11px] font-medium text-slate-600 leading-tight">Agent-Sigma-09 completed task 842: S3_FIX</p>
                </div>
              </div>
              <div className="relative pl-6 pb-2 border-l-2 border-rose-500">
                <div className="absolute -left-[5px] top-0 size-2.5 rounded-full bg-rose-500 border-2 border-white"></div>
                <p className="text-[9px] font-bold text-slate-400 mb-1 font-mono">14:02:11.452</p>
                <div className="bg-rose-50 border border-rose-100 p-3 rounded-sm">
                  <p className="text-[11px] font-bold text-rose-900 leading-tight">CRITICAL: API_LATENCY &gt; 800ms</p>
                  <p className="text-[10px] text-rose-700 mt-1 font-mono">src: control-loop-primary</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-black border-t border-black">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 tracking-widest">
                <span>CONNECTION: SECURE</span>
                <div className="flex gap-1 items-center">
                  <span className="text-emerald-500">200 OK</span>
                  <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

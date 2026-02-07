'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import AgentPanel from "@/components/AgentPanel";
import AuthGate from "@/components/AuthGate";
import ReportIncidentModal from "@/components/ReportIncidentModal";
import { useDashboardData, Incident } from "@/hooks/useDashboardData";
import { useAuth } from "@/context/AuthContext";

function StatCard({ label, value, change, trend }: { label: string; value: string | number; change?: string; trend?: 'up' | 'down' | 'stable' }) {
  const trendColor = trend === 'up' ? 'text-rose-600' : trend === 'down' ? 'text-emerald-600' : 'text-slate-400';

  return (
    <div className="bg-white border-b-2 border-b-black p-4 shadow-md">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        {change && <span className={`${trendColor} text-[10px] font-bold font-mono`}>{change}</span>}
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold font-mono leading-none tracking-tighter text-black">{value}</span>
      </div>
    </div>
  );
}

function IncidentRow({ incident, onSelect }: { incident: Incident; onSelect: (id: string) => void }) {
  const levelColors: Record<string, string> = {
    'ERROR': 'text-rose-600',
    'WARN': 'text-amber-600',
    'INFO': 'text-slate-400',
  };

  const statusColors: Record<string, string> = {
    'ERROR': 'bg-rose-500 text-white border-rose-600',
    'WARN': 'bg-amber-500 text-black border-amber-600',
    'INFO': 'bg-emerald-500 text-white border-emerald-600',
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { hour12: false });
    } catch {
      return timestamp;
    }
  };

  return (
    <tr
      className="hover:bg-slate-50 transition-colors cursor-pointer group"
      onClick={() => onSelect(incident.trace_id || incident.id)}
    >
      <td className="px-5 py-3">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm ${statusColors[incident.level] || statusColors['INFO']} font-bold uppercase tracking-tighter border`}>
          {incident.level === 'ERROR' ? 'Active' : incident.level === 'WARN' ? 'Pending' : 'Info'}
        </span>
      </td>
      <td className={`px-5 py-3 font-bold ${levelColors[incident.level] || 'text-slate-400'}`}>
        {incident.level}
      </td>
      <td className="px-5 py-3 text-black font-semibold font-mono">{incident.trace_id || incident.id.slice(0, 8)}</td>
      <td className="px-5 py-3 text-slate-700 truncate max-w-md">{incident.message}</td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-black">smart_toy</span>
          <span className="font-semibold text-black">AGENT</span>
        </div>
      </td>
      <td className="px-5 py-3 text-slate-500 whitespace-nowrap font-mono">{formatTime(incident.timestamp)}</td>
    </tr>
  );
}

export default function Dashboard() {
  const { stats, incidents, loading, refresh } = useDashboardData();
  const { user, logout } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <AuthGate>
      <ReportIncidentModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSuccess={refresh}
      />
      <div className="flex h-screen bg-[var(--metallic-bg)] text-[var(--obsidian)] overflow-hidden font-sans">
        {/* Sidebar */}
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
            <Link className="flex items-center gap-3 px-4 py-2.5 text-white bg-white/10 border-r-4 border-white group" href="/">
              <span className="material-symbols-outlined text-xl">dashboard</span>
              <span className="text-xs font-semibold">Overview</span>
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
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 bg-[var(--metallic-surface)] border-b border-slate-300 flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <span className={`size-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Status: <span className={`${loading ? 'text-amber-600' : 'text-black'} bg-${loading ? 'amber' : 'emerald'}-400 px-2 py-0.5 rounded-sm`}>
                    {loading ? 'LOADING' : 'LIVE'}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowReportModal(true)}
                className="bg-rose-500 text-white text-[10px] font-bold px-4 py-2 rounded-sm hover:bg-rose-600 transition-colors flex items-center gap-2 uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-sm">add_alert</span>
                Report Incident
              </button>
              <button
                onClick={refresh}
                className="bg-black text-white text-[10px] font-bold px-4 py-2 rounded-sm hover:bg-slate-800 transition-colors flex items-center gap-2 uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                Refresh
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden flex bg-[var(--metallic-bg)]">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <StatCard
                  label="Active Incidents"
                  value={stats?.active_incidents ?? '-'}
                  change={stats ? `${stats.active_incidents} errors` : undefined}
                  trend="up"
                />
                <StatCard
                  label="Total Logs"
                  value={stats?.anomaly_flux ?? '-'}
                  trend="stable"
                />
                <StatCard
                  label="Historical Incidents"
                  value={stats?.historical_incidents ?? '-'}
                  trend="stable"
                />
                <StatCard
                  label="Agent Accuracy"
                  value={stats ? `${stats.agent_accuracy}%` : '-'}
                  change="+0.8%"
                  trend="down"
                />
              </div>

              {/* Incident Stream */}
              <div className="bg-white border border-slate-300 rounded-sm shadow-xl flex flex-col overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Incident Stream</h3>
                    <div className="h-4 w-px bg-slate-300"></div>
                    <span className="text-[10px] font-medium text-slate-500 font-mono">
                      Showing {incidents?.incidents.length || 0} of {incidents?.total || 0} entries
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b-2 border-black">Status</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b-2 border-black">Severity</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b-2 border-black">Trace ID</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-full border-b-2 border-black">Message</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b-2 border-black">Agent</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap border-b-2 border-black">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                      {incidents?.incidents.map((incident) => (
                        <IncidentRow
                          key={incident.id}
                          incident={incident}
                          onSelect={(id) => console.log('Selected:', id)}
                        />
                      ))}
                      {(!incidents || incidents.incidents.length === 0) && (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                            {loading ? 'Loading incidents...' : 'No incidents found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <aside className="w-96 border-l border-slate-300 flex flex-col flex-shrink-0 overflow-y-auto">
              <AgentPanel />
            </aside>
          </div>
        </main>
      </div>
    </AuthGate>
  );
}

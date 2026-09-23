import React from 'react';
import { NavLink } from 'react-router-dom';
import { useMonitoring } from '../../context/MonitoringContext';
import { 
  LayoutDashboard, 
  Building2, 
  Activity, 
  BrainCircuit, 
  ShieldAlert, 
  Scan, 
  ClipboardCheck, 
  FileSpreadsheet,
  Cpu,
  FileCode2
} from 'lucide-react';

export default function Sidebar() {
  const { alerts = [] } = useMonitoring();
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const navItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Structure Inventory', path: '/structures', icon: Building2 },
    { name: 'Virtual Sensor Feeds', path: '/monitoring', icon: Activity },
    { name: 'AI Anomaly Detection', path: '/anomalies', icon: Cpu },
    { name: 'AI Risk Assessment', path: '/risk', icon: BrainCircuit },
    { name: 'AI Crack Vision', path: '/crack-detection', icon: Scan },
    { name: 'Field Inspections', path: '/inspections', icon: ClipboardCheck },
    { name: 'System Alerts', path: '/alerts', icon: ShieldAlert, badge: activeAlertsCount > 0 ? activeAlertsCount : null },
    { name: 'PDF Engineering Reports', path: '/reports', icon: FileSpreadsheet },
    { name: 'ETABS Import', path: '/etabs-import', icon: FileCode2 },
  ];

  return (
    <aside className="w-64 bg-slate-900/80 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-3 px-3">
          Engineering Operations
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </div>
                {item.badge != null && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-md">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            AI SIMULATOR RUNNING
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Virtual sensors auto-generating structural strain, vibration, temperature & crack width metrics.
          </p>
        </div>
      </div>
    </aside>
  );
}

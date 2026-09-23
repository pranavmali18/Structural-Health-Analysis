import React from 'react';
import { ShieldAlert, CheckCircle, Eye } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function AlertCard({ alert, onResolve, onAcknowledge }) {
  if (!alert) return null;
  const alertId = alert.id || alert._id;

  return (
    <div className="glass-panel p-4 rounded-xl space-y-2.5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className={`w-4 h-4 ${alert.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-400'}`} />
            <h5 className="text-xs font-bold text-slate-100 truncate max-w-[140px]">{alert.type || alert.title || 'System Alert'}</h5>
          </div>
          <StatusBadge status={alert.severity || 'HIGH'} size="sm" />
        </div>

        <p className="text-xs font-semibold text-slate-200">{alert.structureName}</p>
        <p className="text-[11px] text-slate-400 leading-relaxed font-mono mt-1">{alert.message}</p>
      </div>

      <div className="pt-3 border-t border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-2 font-mono text-[10px] text-slate-500">
          <span>{alert.timestamp || alert.createdAt ? new Date(alert.timestamp || alert.createdAt).toLocaleTimeString() : 'Recent'}</span>
          <span className={`px-2 py-0.5 rounded font-bold uppercase ${
            alert.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
            alert.status === 'ACKNOWLEDGED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
            'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse'
          }`}>
            {alert.status || 'ACTIVE'}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          {alert.status === 'ACTIVE' && onAcknowledge && (
            <button
              onClick={() => onAcknowledge(alertId)}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-3 h-3" /> Acknowledge
            </button>
          )}

          {alert.status !== 'RESOLVED' && onResolve && (
            <button
              onClick={() => onResolve(alertId)}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold rounded-lg transition-colors cursor-pointer"
            >
              <CheckCircle className="w-3 h-3" /> Mark Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

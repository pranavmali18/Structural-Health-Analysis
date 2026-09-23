import React from 'react';
import { AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function RiskCard({ riskScore = 42, riskLevel = 'MODERATE', factors = [] }) {
  return (
    <div className="glass-panel p-4 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-slate-100 uppercase font-mono">Risk Status Summary</h4>
        </div>
        <StatusBadge status={riskLevel} size="sm" />
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-extrabold font-mono text-amber-400">{riskScore}</span>
        <span className="text-xs text-slate-400 font-mono">Risk Level: {riskLevel}</span>
      </div>

      <div className="space-y-1 text-xs font-mono">
        <p className="text-[10px] text-slate-500 font-semibold uppercase">Top Contributing Factor</p>
        <p className="text-slate-300">
          {factors[0]?.name || 'Micro-vibration harmonics (+22%)'}
        </p>
      </div>
    </div>
  );
}

import React from 'react';
import { ShieldCheck, HeartPulse } from 'lucide-react';

export default function HealthScore({ score = 88 }) {
  const getScoreColor = (s) => {
    if (s >= 75) return 'text-emerald-400';
    if (s >= 50) return 'text-amber-400';
    return 'text-rose-500';
  };

  return (
    <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Structural Health Index</span>
          <span className="text-xs text-slate-300">Composite Integrity Metric</span>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-2xl font-extrabold font-mono ${getScoreColor(score)}`}>
          {score} <span className="text-xs text-slate-500">/ 100</span>
        </span>
      </div>
    </div>
  );
}

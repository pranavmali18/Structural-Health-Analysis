import React from 'react';
import { Cpu, AlertCircle } from 'lucide-react';

export default function AnomalyCard({ anomaly }) {
  if (!anomaly) return null;

  return (
    <div className="glass-panel p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-rose-400 font-mono">
          <AlertCircle className="w-4 h-4" />
          <span>Isolation Forest Alert</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">{anomaly.timestamp}</span>
      </div>

      <p className="text-xs font-semibold text-slate-200">{anomaly.structureName}</p>
      <p className="text-[11px] text-slate-400 leading-relaxed font-mono">{anomaly.explanation}</p>

      <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
        <span className="text-slate-500">Feature: <strong className="text-cyan-400">{anomaly.affectedParameter}</strong></span>
        <span className="text-rose-400 font-bold">Score: {anomaly.score}</span>
      </div>
    </div>
  );
}

import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { CheckCircle2, AlertTriangle, ShieldCheck, Scan, Cpu } from 'lucide-react';

export default function CrackResult({ result }) {
  if (!result) return null;

  return (
    <div className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm">Computer Vision Crack Analysis Output</h3>
        </div>
        <StatusBadge status={result.severity} size="md" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <span className="text-slate-500 block text-[10px]">Crack Detected</span>
          <span className={`font-bold text-sm ${result.crackDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
            {result.crackDetected ? 'YES ⚠️' : 'NO ✅'}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px]">Model Confidence</span>
          <span className="text-cyan-400 font-bold text-sm">{(result.confidence * 100).toFixed(1)}%</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px]">Severity Level</span>
          <span className="text-amber-400 font-bold text-sm uppercase">{result.severity}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px]">Model Used</span>
          <span className="text-slate-300 font-bold text-xs">OpenCV + PyTorch CNN</span>
        </div>
      </div>

      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-400 font-mono text-[10px] block uppercase font-bold mb-1">AI Recommendation</span>
        <p className="text-slate-200 text-xs leading-relaxed">{result.recommendation}</p>
      </div>
    </div>
  );
}

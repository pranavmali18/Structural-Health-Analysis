import React from 'react';
import { ShieldCheck, AlertTriangle, Flame, ShieldAlert, Cpu } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function RiskGauge({ riskScore = 18, riskLevel = 'LOW', factors = [], recommendation = "" }) {
  const getRiskColor = (score) => {
    if (score <= 25) return { text: 'text-emerald-400', stroke: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (score <= 50) return { text: 'text-amber-400', stroke: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    if (score <= 75) return { text: 'text-orange-400', stroke: '#f97316', bg: 'bg-orange-500/10', border: 'border-orange-500/30' };
    return { text: 'text-rose-500', stroke: '#ef4444', bg: 'bg-rose-500/15', border: 'border-rose-500/40' };
  };

  const colors = getRiskColor(riskScore);
  const strokeDashoffset = 283 - (283 * Math.min(100, Math.max(0, riskScore))) / 100;

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">AI Structural Risk Index</h3>
        </div>
        <StatusBadge status={riskLevel} size="md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-2">
        {/* SVG Circular Meter */}
        <div className="relative flex flex-col items-center justify-center">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r="45"
              stroke={colors.stroke}
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-extrabold font-mono tracking-tight ${colors.text}`}>
              {riskScore}
            </span>
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Out of 100</span>
          </div>
        </div>

        {/* Contributing Factors & Recommendation */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">Key Risk Factors</p>
            <div className="space-y-1.5">
              {factors.length > 0 ? (
                factors.map((factor, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-800">
                    <span className="text-slate-300 font-medium">{factor.name}</span>
                    <span className="font-mono text-cyan-400 font-bold">+{factor.weight}%</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No critical risk factors flagged.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Engineering Action */}
      <div className={`mt-3 p-3 rounded-xl border ${colors.bg} ${colors.border} text-xs flex items-start gap-2.5`}>
        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${colors.text}`} />
        <div>
          <span className="font-bold text-slate-200 block mb-0.5">Engineering Recommendation</span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {recommendation || "Maintain standard automated 24/7 sensor monitoring. Next scheduled ultrasonic shear check in 30 days."}
          </p>
        </div>
      </div>
    </div>
  );
}

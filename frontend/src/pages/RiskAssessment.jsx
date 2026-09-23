import React from 'react';
import AcademicDisclaimer from '../components/common/AcademicDisclaimer';
import RiskGauge from '../components/dashboard/RiskGauge';
import { BrainCircuit, ShieldCheck, AlertTriangle, Layers, TrendingUp } from 'lucide-react';

export default function RiskAssessment({ currentStructure, structures = [] }) {
  const selected = currentStructure || structures[0];

  return (
    <div className="space-y-6">
      <AcademicDisclaimer />

      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
          <BrainCircuit className="w-6 h-6 text-cyan-400" />
          AI Structural Risk & Integrity Scoring
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Predictive multi-variate ML risk evaluation combining structural age, materials, cumulative anomaly frequency, strain and crack width metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskGauge
            riskScore={selected?.riskScore || 42}
            riskLevel={selected?.riskLevel || 'MODERATE'}
            factors={selected?.factors || []}
            recommendation={selected?.recommendation}
          />
        </div>

        {/* Risk Level Classification Key */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <h3 className="font-bold text-slate-100 text-sm mb-3">Risk Level Spectrum Scale</h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-400 block">LOW (0 - 25)</span>
                <span className="text-[10px] text-slate-400">Normal nominal operations</span>
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>

            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-400 block">MODERATE (26 - 50)</span>
                <span className="text-[10px] text-slate-400">Minor sensor deviations flagged</span>
              </div>
              <span className="w-3 h-3 rounded-full bg-amber-400" />
            </div>

            <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-orange-400 block">HIGH (51 - 75)</span>
                <span className="text-[10px] text-slate-400">Significant risk; schedule inspection</span>
              </div>
              <span className="w-3 h-3 rounded-full bg-orange-400" />
            </div>

            <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-500 block">CRITICAL (76 - 100)</span>
                <span className="text-[10px] text-slate-400">Severe risk; emergency protocol</span>
              </div>
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

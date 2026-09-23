import React from 'react';
import AcademicDisclaimer from '../components/common/AcademicDisclaimer';
import StatusBadge from '../components/common/StatusBadge';
import { Cpu, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';

export default function AnomalyDetection({ anomalies = [] }) {
  return (
    <div className="space-y-6">
      <AcademicDisclaimer />

      {/* Page Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-cyan-400" />
          AI Anomaly Detection Studio (Isolation Forest)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Machine Learning unsupervised anomaly detection model parsing high-frequency multi-sensor telemetry streams.
        </p>
      </div>

      {/* Model Specs Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm">Model Architecture & Training Parameters</h3>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full font-semibold">
            Algorithm: IsolationForest (scikit-learn)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-500 block text-[10px]">Contamination Rate</span>
            <span className="text-slate-200 font-bold">0.05 (5%)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Estimators / Trees</span>
            <span className="text-slate-200 font-bold">100 Isolation Trees</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Feature Space</span>
            <span className="text-slate-200 font-bold">6 Physical Parameters</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Inference Time</span>
            <span className="text-cyan-400 font-bold">&lt; 4.2 ms / sample</span>
          </div>
        </div>
      </div>

      {/* Flagged Anomaly Logs Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <h3 className="font-bold text-slate-100 text-sm mb-4">Recent ML Flagged Sensor Anomalies</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Structure</th>
                <th className="p-3">Affected Feature</th>
                <th className="p-3">Anomaly Score</th>
                <th className="p-3">Status</th>
                <th className="p-3">Explainable AI Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {anomalies.map((anm) => (
                <tr key={anm.id} className="hover:bg-slate-900/40">
                  <td className="p-3 text-slate-400 whitespace-nowrap">{anm.timestamp}</td>
                  <td className="p-3 font-semibold text-slate-200">{anm.structureName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-cyan-400 rounded border border-slate-700">
                      {anm.affectedParameter}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-rose-400">{anm.score}</td>
                  <td className="p-3">
                    <StatusBadge status={anm.status} size="sm" />
                  </td>
                  <td className="p-3 text-slate-400 max-w-xs leading-relaxed text-[11px]">
                    {anm.explanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

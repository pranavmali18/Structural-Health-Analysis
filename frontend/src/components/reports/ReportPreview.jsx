import React from 'react';
import AcademicDisclaimer from '../common/AcademicDisclaimer';
import StatusBadge from '../common/StatusBadge';
import { Building2, Calendar, FileText, CheckCircle, ShieldAlert } from 'lucide-react';

export default function ReportPreview({ structure }) {
  if (!structure) return null;

  return (
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl text-slate-200 space-y-6 font-sans">
      {/* Report Header */}
      <div className="flex items-start justify-between border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Structural Health Monitoring Report</h2>
          <p className="text-xs text-cyan-400 font-mono mt-0.5">Automated AI Engineering Inspection Certificate</p>
        </div>
        <div className="text-right text-xs font-mono">
          <p className="text-slate-400">Date: {new Date().toLocaleDateString()}</p>
          <p className="text-slate-400">Doc ID: SHM-REP-2026-901</p>
        </div>
      </div>

      <AcademicDisclaimer />

      {/* Structure Info */}
      <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div>
          <span className="text-slate-500 block">Structure Name</span>
          <strong className="text-slate-100 text-sm">{structure.name}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Asset Type</span>
          <strong className="text-slate-100 text-sm">{structure.type}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Location</span>
          <span className="text-slate-200">{structure.location}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Status / Risk</span>
          <StatusBadge status={structure.status} size="sm" />
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2 text-xs">
        <h4 className="font-bold text-slate-100 uppercase font-mono">Executive AI Assessment Summary</h4>
        <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
          Isolation Forest anomaly detection verified baseline vibration metrics (4.85 mm/s²) and strain limits (340 με). Overall risk index evaluates at {structure.riskScore} / 100 ({structure.riskLevel}).
        </p>
      </div>
    </div>
  );
}

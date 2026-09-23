import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function AcademicDisclaimer({ className = "" }) {
  return (
    <div className={`bg-amber-950/40 border border-amber-500/30 rounded-lg p-3 text-amber-200 text-xs flex items-center gap-3 shadow-inner ${className}`}>
      <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
      <div>
        <span className="font-semibold text-amber-300 mr-1.5 uppercase tracking-wide text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
          Academic Prototype Disclaimer
        </span>
        AI-based preliminary structural assessment only. Results are intended for academic and monitoring support purposes and must not replace inspection, testing, or certification by a qualified structural engineer.
      </div>
    </div>
  );
}

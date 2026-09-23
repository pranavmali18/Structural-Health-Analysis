import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Building2, MapPin, Calendar, Activity } from 'lucide-react';

export default function StructureCard({ structure, onSelect }) {
  return (
    <div className="glass-panel-interactive p-5 rounded-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-2">
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 rounded border border-slate-700">
            {structure.type}
          </span>
          <StatusBadge status={structure.status} size="sm" />
        </div>

        <h3 className="text-base font-bold text-slate-100 mb-1">{structure.name}</h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{structure.description}</p>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-3">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-400" /> {structure.location}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-cyan-400" /> {structure.constructionYear}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <span className="font-mono text-slate-400">Risk: <strong className="text-amber-400">{structure.riskScore} / 100</strong></span>
        <button
          onClick={() => onSelect && onSelect(structure)}
          className="px-3 py-1 bg-slate-800 text-cyan-400 border border-slate-700 rounded-lg hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
        >
          <Activity className="w-3 h-3" /> Live Feed
        </button>
      </div>
    </div>
  );
}

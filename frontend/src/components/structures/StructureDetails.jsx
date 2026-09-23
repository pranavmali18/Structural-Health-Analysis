import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Building2, MapPin, Calendar, Layers, Ruler } from 'lucide-react';

export default function StructureDetails({ structure }) {
  if (!structure) return null;

  return (
    <div className="glass-panel p-5 rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{structure.type}</span>
          <h3 className="text-xl font-bold text-slate-100">{structure.name}</h3>
        </div>
        <StatusBadge status={structure.status} size="lg" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <span className="text-slate-500 block text-[10px]">Location</span>
          <span className="text-slate-200 font-bold">{structure.location}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Construction Year</span>
          <span className="text-slate-200 font-bold">{structure.constructionYear}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Material</span>
          <span className="text-slate-200 font-bold">{structure.material}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Dimensions</span>
          <span className="text-slate-200 font-bold">{structure.length}m × {structure.width}m</span>
        </div>
      </div>
    </div>
  );
}

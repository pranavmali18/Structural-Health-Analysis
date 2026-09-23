import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function Loader({ label = "Processing AI Analysis..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
      <span className="text-xs font-mono text-slate-300 font-semibold">{label}</span>
    </div>
  );
}

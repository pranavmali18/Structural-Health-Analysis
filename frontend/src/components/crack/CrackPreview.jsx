import React from 'react';
import { Eye, RefreshCw } from 'lucide-react';

export default function CrackPreview({ imageSrc, isAnalyzing, onAnalyze }) {
  if (!imageSrc) return null;

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center max-h-80">
        <img src={imageSrc} alt="Concrete inspection surface" className="w-full h-auto object-cover" />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">Selected Image Ready</span>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running CV Inspection...
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Analyze Surface with AI Vision
            </>
          )}
        </button>
      </div>
    </div>
  );
}

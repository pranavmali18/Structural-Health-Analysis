import React from 'react';
import { Thermometer, Droplets, Activity, Move, Gauge, Eye, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export default function SensorCard({ title, value, unit, status, trend, baseline, iconName }) {
  const iconMap = {
    temperature: Thermometer,
    humidity: Droplets,
    vibration: Activity,
    displacement: Move,
    strain: Gauge,
    crackWidth: Eye
  };

  const IconComponent = iconMap[iconName] || Activity;

  const statusColors = {
    normal: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    anomalous: 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse',
    critical: 'text-rose-500 bg-rose-500/20 border-rose-500/40 animate-pulse'
  };

  const currentStatusClass = statusColors[status?.toLowerCase()] || statusColors.normal;

  return (
    <div className="glass-panel-interactive p-4 rounded-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-cyan-400">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300 capitalize">{title}</h4>
            <p className="text-[10px] font-mono text-slate-500">Normal Range: {baseline}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded border ${currentStatusClass}`}>
          {status}
        </span>
      </div>

      {/* Main Metric Value Display */}
      <div className="flex items-baseline justify-between mt-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl lg:text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
            {typeof value === 'number' ? value.toFixed(2) : value}
          </span>
          <span className="text-xs font-semibold text-slate-400 font-mono">{unit}</span>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center gap-1 text-xs font-mono">
          {trend === 'up' ? (
            <span className="flex items-center text-rose-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +2.4%
            </span>
          ) : trend === 'down' ? (
            <span className="flex items-center text-emerald-400 font-semibold">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -1.1%
            </span>
          ) : (
            <span className="text-slate-500">STABLE</span>
          )}
        </div>
      </div>

      {/* Sparkline background bar decoration */}
      <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full rounded-full ${status === 'anomalous' ? 'bg-rose-500' : status === 'warning' ? 'bg-amber-400' : 'bg-cyan-500'}`}
          style={{ width: `${Math.min(100, Math.max(15, (value / (parseFloat(baseline.split('-')[1]) || 100)) * 100))}%` }}
        />
      </div>
    </div>
  );
}

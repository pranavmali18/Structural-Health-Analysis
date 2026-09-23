import React from 'react';

export default function StatusBadge({ status = 'Healthy', size = 'md' }) {
  const normalized = (status || 'Healthy').toLowerCase();

  const styles = {
    healthy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 status-glow-healthy',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30 status-glow-warning',
    'high risk': 'bg-orange-500/10 text-orange-400 border-orange-500/30 status-glow-high',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/30 status-glow-high',
    critical: 'bg-rose-500/15 text-rose-400 border-rose-500/40 status-glow-critical animate-pulse',
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 status-glow-healthy',
    moderate: 'bg-amber-500/10 text-amber-400 border-amber-500/30 status-glow-warning',
  };

  const dots = {
    healthy: 'bg-emerald-400',
    warning: 'bg-amber-400',
    'high risk': 'bg-orange-400',
    high: 'bg-orange-400',
    critical: 'bg-rose-400',
    low: 'bg-emerald-400',
    moderate: 'bg-amber-400',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-bold',
  };

  const currentStyle = styles[normalized] || styles.healthy;
  const currentDot = dots[normalized] || dots.healthy;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses[size]} ${currentStyle}`}>
      <span className={`w-2 h-2 rounded-full ${currentDot}`} />
      <span className="capitalize tracking-wide">{status}</span>
    </span>
  );
}

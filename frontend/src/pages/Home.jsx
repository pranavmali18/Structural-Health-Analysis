import React from 'react';
import { Link } from 'react-router-dom';
import AcademicDisclaimer from '../components/common/AcademicDisclaimer';
import { Building2, Activity, Cpu, ShieldCheck, ArrowRight, Scan, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8 py-4">
      <AcademicDisclaimer />

      {/* Hero Section */}
      <div className="glass-panel p-8 lg:p-12 rounded-3xl border border-slate-800 text-center relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full uppercase tracking-wider">
            Civil Engineering Academic Platform
          </span>

          <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            AI-Enabled Structural Health Monitoring & Risk Assessment
          </h1>

          <p className="text-sm lg:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Real-time virtual sensor telemetry simulation, machine learning Isolation Forest anomaly detection, predictive structural risk scoring, and computer vision concrete crack inspection.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
            >
              Launch Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/monitoring"
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-colors"
            >
              <Activity className="w-4 h-4 text-cyan-400" /> Virtual Sensor Feeds
            </Link>
          </div>
        </div>
      </div>

      {/* Core AI Modules Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Isolation Forest ML</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Unsupervised machine learning model identifying abnormal multi-sensor spikes across strain, displacement, and harmonic vibration.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">AI Risk Assessment</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Continuous structural integrity index (0–100) classifying structures into Low, Moderate, High, or Critical risk tiers.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Scan className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Computer Vision Crack AI</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Deep learning visual inspection model detecting concrete surface cracking, calculating severity ratings, and suggesting remedial engineering actions.
          </p>
        </div>
      </div>
    </div>
  );
}

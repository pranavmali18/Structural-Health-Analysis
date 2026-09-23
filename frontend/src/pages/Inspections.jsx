import React, { useState } from 'react';
import AcademicDisclaimer from '../components/common/AcademicDisclaimer';
import StatusBadge from '../components/common/StatusBadge';
import { 
  ClipboardCheck, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  FileText,
  Building2,
  HardHat
} from 'lucide-react';

const INITIAL_INSPECTIONS = [
  {
    id: 'insp-101',
    structureName: 'Starlight Skybridge',
    inspector: 'Eng. Pranav Mali',
    date: '2026-09-15',
    type: 'NDT Ultrasonic Flaw Inspection',
    status: 'COMPLETED',
    findings: 'Minor hairline surface wear noted at Expansion Joint B. Ultrasonic echo confirmed zero sub-surface structural rebar voids.',
    urgency: 'LOW'
  },
  {
    id: 'insp-102',
    structureName: 'Metropolis Comm TV Tower',
    inspector: 'Dr. Aris Thorne',
    date: '2026-09-12',
    type: 'Guy Wire Tension Calibration',
    status: 'IN_PROGRESS',
    findings: 'Micro-displacement detected on North anchor assembly. Re-tensioning in progress.',
    urgency: 'HIGH'
  },
  {
    id: 'insp-103',
    structureName: 'Titan Arch Dam',
    inspector: 'Eng. Sarah Connor',
    date: '2026-09-10',
    type: 'Concrete Seepage & Crack Audit',
    status: 'SCHEDULED',
    findings: 'Scheduled 90-day acoustic emission NDT audit.',
    urgency: 'MEDIUM'
  }
];

export default function Inspections({ currentStructure, structures = [] }) {
  const [inspections, setInspections] = useState(INITIAL_INSPECTIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    structureName: currentStructure?.name || 'Starlight Skybridge',
    inspector: 'Eng. Pranav Mali',
    type: 'Visual & Sensor Calibration',
    findings: '',
    urgency: 'LOW'
  });

  const handleCreateInspection = (e) => {
    e.preventDefault();
    const newInsp = {
      id: `insp-${Date.now().toString().slice(-4)}`,
      structureName: formData.structureName,
      inspector: formData.inspector,
      date: new Date().toISOString().split('T')[0],
      type: formData.type,
      status: 'COMPLETED',
      findings: formData.findings || 'Routine engineering inspection completed. All sensor baselines within parameters.',
      urgency: formData.urgency
    };
    setInspections([newInsp, ...inspections]);
    setShowAddModal(false);
    setFormData({
      structureName: currentStructure?.name || 'Starlight Skybridge',
      inspector: 'Eng. Pranav Mali',
      type: 'Visual & Sensor Calibration',
      findings: '',
      urgency: 'LOW'
    });
  };

  return (
    <div className="space-y-6">
      <AcademicDisclaimer />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <ClipboardCheck className="w-6 h-6 text-cyan-400" />
            Field Engineering Inspections & Audits
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Physical site inspection logs, NDT non-destructive testing reports & maintenance schedules
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log New Site Inspection
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-mono">Completed Inspections</p>
            <p className="text-lg font-bold text-slate-100">{inspections.filter(i => i.status === 'COMPLETED').length}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-mono">In-Progress / Scheduled</p>
            <p className="text-lg font-bold text-slate-100">{inspections.filter(i => i.status !== 'COMPLETED').length}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-mono">Active Field Engineers</p>
            <p className="text-lg font-bold text-slate-100">3 Certified Auditors</p>
          </div>
        </div>
      </div>

      {/* Inspections List */}
      <div className="space-y-4">
        {inspections.map((item) => (
          <div key={item.id} className="glass-panel p-5 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{item.structureName}</h3>
                  <p className="text-xs text-slate-400 font-mono">{item.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                  item.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  item.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/30'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auditing Engineer: <strong className="text-slate-200">{item.inspector}</strong></span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-slate-300 font-mono leading-relaxed text-[11px]">
                💬 <strong>Engineering Log:</strong> {item.findings}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Inspection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Log Field Site Inspection</h3>
            
            <form onSubmit={handleCreateInspection} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Target Structure</label>
                <select
                  value={formData.structureName}
                  onChange={e => setFormData({ ...formData, structureName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {structures.map(s => (
                    <option key={s.id || s._id} value={s.name}>{s.name} ({s.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Auditing Engineer Name</label>
                <input
                  type="text"
                  required
                  value={formData.inspector}
                  onChange={e => setFormData({ ...formData, inspector: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Inspection Audit Type</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NDT Ultrasonic & Rebar Crack Inspection"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Inspector Log Findings & Notes</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Enter physical observation notes..."
                  value={formData.findings}
                  onChange={e => setFormData({ ...formData, findings: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 cursor-pointer"
                >
                  Save Field Inspection Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

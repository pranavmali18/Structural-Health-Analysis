import React, { useState } from 'react';
import StatusBadge from '../components/common/StatusBadge';
import AcademicDisclaimer from '../components/common/AcademicDisclaimer';
import { useMonitoring } from '../context/MonitoringContext';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Layers, 
  Ruler, 
  Activity,
  Trash2
} from 'lucide-react';

export default function Structures({ structures = [], onSelectStructure }) {
  const { addStructure, deleteStructure } = useMonitoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Building',
    location: '',
    constructionYear: 2020,
    material: 'Reinforced Concrete',
    length: 100,
    width: 50,
    height: 30,
    description: ''
  });

  const filteredStructures = structures.filter(s => {
    const nameStr = s.name || '';
    const locStr = s.location || '';
    const matchesSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          locStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || s.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateStructure = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addStructure(formData);
      setShowAddModal(false);
      setFormData({
        name: '',
        type: 'Building',
        location: '',
        constructionYear: 2020,
        material: 'Reinforced Concrete',
        length: 100,
        width: 50,
        height: 30,
        description: ''
      });
    } catch (err) {
      console.error('Error creating structure:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (e, structure) => {
    e.stopPropagation();
    const sId = structure.id || structure._id;
    if (window.confirm(`Are you sure you want to delete "${structure.name}" from your monitoring inventory?`)) {
      deleteStructure(sId);
    }
  };

  return (
    <div className="space-y-6">
      <AcademicDisclaimer />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-cyan-400" />
            Structural Inventory Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registered civil engineering assets under continuous virtual sensor monitoring
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Structure
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between glass-panel p-3.5 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search structure name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-mono">Type Filter:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
          >
            <option value="All">All Types</option>
            <option value="Building">Building</option>
            <option value="Bridge">Bridge</option>
            <option value="Dam">Dam</option>
            <option value="Tower">Tower</option>
          </select>
        </div>
      </div>

      {/* Grid of Structure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStructures.map((structure) => (
          <div
            key={structure.id || structure._id}
            className="glass-panel-interactive p-5 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold bg-slate-800 text-cyan-400 rounded border border-slate-700">
                    {structure.type}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 mt-1">{structure.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={structure.status || 'Healthy'} size="md" />
                  <button
                    onClick={(e) => handleDelete(e, structure)}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                    title="Delete Structure from Inventory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                {structure.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-400 truncate">{structure.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">Year: {structure.constructionYear || structure.yearBuilt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-300 truncate">{structure.material}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">{structure.length}m × {structure.width}m × {structure.height}m</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Risk Score:</span>
                <span className={`font-bold ${structure.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {structure.riskScore || 18} / 100 ({structure.riskLevel || 'LOW'})
                </span>
              </div>

              <button
                onClick={() => onSelectStructure && onSelectStructure(structure)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                Live Telemetry
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Structure Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Add New Monitored Structure</h3>
            
            <form onSubmit={handleCreateStructure} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Structure Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Titan Suspension Bridge"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Structure Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Building">Building</option>
                    <option value="Bridge">Bridge</option>
                    <option value="Dam">Dam</option>
                    <option value="Tower">Tower</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Location Coordinates / Site</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sector 12 North Highway"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Construction Year</label>
                  <input
                    type="number"
                    required
                    value={formData.constructionYear}
                    onChange={e => setFormData({...formData, constructionYear: parseInt(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Primary Structural Material</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Strength Prestressed Concrete"
                  value={formData.material}
                  onChange={e => setFormData({...formData, material: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Length (m)</label>
                  <input
                    type="number"
                    value={formData.length}
                    onChange={e => setFormData({...formData, length: parseFloat(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Width (m)</label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={e => setFormData({...formData, width: parseFloat(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Height (m)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={e => setFormData({...formData, height: parseFloat(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Engineering Description</label>
                <textarea
                  rows="3"
                  placeholder="Provide structural context..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
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
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Structure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

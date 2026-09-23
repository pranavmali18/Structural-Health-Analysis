import React, { useState } from 'react';

export default function StructureForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Building');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState(2022);
  const [material, setMaterial] = useState('Reinforced Concrete');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ name, type, location, constructionYear: year, material });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
      <div>
        <label className="block text-slate-400 mb-1">Structure Name</label>
        <input 
          type="text" 
          required 
          value={name} 
          onChange={e => setName(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
          placeholder="e.g. Apex Central Span"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1">Structure Type</label>
          <select 
            value={type} 
            onChange={e => setType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
          >
            <option value="Building">Building</option>
            <option value="Bridge">Bridge</option>
            <option value="Dam">Dam</option>
            <option value="Tower">Tower</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Construction Year</label>
          <input 
            type="number" 
            value={year} 
            onChange={e => setYear(parseInt(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-400 mb-1">Location</label>
        <input 
          type="text" 
          required 
          value={location} 
          onChange={e => setLocation(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
          placeholder="Location site..."
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-bold"
        >
          Create Asset
        </button>
      </div>
    </form>
  );
}

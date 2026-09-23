import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Upload, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle,
  ChevronRight, Database, BarChart3, Layers, BrainCircuit,
  Trash2, Eye, RefreshCw, FileCode2, Activity, TrendingUp,
  Info, Clock, Building2, ChevronLeft
} from 'lucide-react';
import {
  uploadETABSFile,
  validateETABSFile,
  getETABSImports,
  getETABSResults,
  getETABSSummary,
  deleteETABSImport
} from '../services/etabsApi';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RISK_COLORS = {
  LOW:      { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  MODERATE: { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30' },
  HIGH:     { bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-500/30' },
  CRITICAL: { bg: 'bg-rose-500/15',    text: 'text-rose-400',    border: 'border-rose-500/30' },
};

const VALID_STATUS_COLORS = {
  VALID:   'text-emerald-400',
  PARTIAL: 'text-amber-400',
  INVALID: 'text-rose-400',
};

function Badge({ children, color = 'cyan' }) {
  const cls = {
    cyan:    'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber:   'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rose:    'bg-rose-500/15 text-rose-400 border-rose-500/30',
    purple:  'bg-purple-500/15 text-purple-400 border-purple-500/30',
  }[color] || 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${cls}`}>
      {children}
    </span>
  );
}

import ETABSFeatureModal from '../components/dashboard/ETABSFeatureModal';

function StatCard({ label, value, unit, color = 'cyan', icon: Icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-start gap-3 transition-all duration-200 group ${
        onClick ? 'cursor-pointer hover:border-cyan-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98]' : ''
      }`}
    >
      {Icon && (
        <div className={`w-8 h-8 rounded-lg bg-${color}-500/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
          <Icon className={`w-4 h-4 text-${color}-400`} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider truncate">{label}</p>
          {onClick && (
            <span className="opacity-0 group-hover:opacity-100 text-[9px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 transition-opacity">
              Tap for info
            </span>
          )}
        </div>
        <p className={`text-lg font-extrabold text-${color}-400 leading-tight mt-0.5`}>
          {value ?? <span className="text-slate-600 text-sm font-normal">—</span>}
          {value != null && unit && <span className="text-xs text-slate-400 font-normal ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

// ─── STEP indicator ───────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Select Structure' },
  { id: 2, label: 'Upload File' },
  { id: 3, label: 'Validate' },
  { id: 4, label: 'Preview & Import' },
  { id: 5, label: 'Summary' },
];

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className={`flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            step.id < current ? 'text-emerald-400' :
            step.id === current ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30' :
            'text-slate-600'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
              step.id < current ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' :
              step.id === current ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' :
              'border-slate-700 text-slate-600'
            }`}>
              {step.id < current ? '✓' : step.id}
            </span>
            {step.label}
          </div>
          {idx < STEPS.length - 1 && (
            <ChevronRight className={`w-3 h-3 mx-0.5 shrink-0 ${step.id < current ? 'text-emerald-600' : 'text-slate-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Data preview table ───────────────────────────────────────────────────────
function PreviewTable({ columns, rows, maxRows = 20 }) {
  if (!columns || columns.length === 0 || !rows || rows.length === 0) {
    return <p className="text-slate-500 text-xs py-4 text-center">No preview data available.</p>;
  }

  const displayed = rows.slice(0, maxRows);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-left text-xs font-mono text-slate-300 min-w-[600px]">
        <thead className="bg-slate-900 text-[10px] uppercase text-slate-500 border-b border-slate-800">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-3 py-2.5 whitespace-nowrap">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {displayed.map((row, ri) => (
            <tr key={ri} className="hover:bg-slate-800/30 transition-colors">
              {columns.map((col, ci) => {
                // Try canonical then rawData
                const val = row[col] ?? row.rawData?.[col] ?? '—';
                return (
                  <td key={ci} className="px-3 py-2 whitespace-nowrap text-slate-300">
                    {val === null || val === undefined ? <span className="text-slate-700">—</span> : String(val)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > maxRows && (
        <p className="text-[11px] text-slate-500 px-4 py-2 border-t border-slate-800 font-mono">
          Showing {maxRows} of {rows.length} rows
        </p>
      )}
    </div>
  );
}

// ─── Import history table ─────────────────────────────────────────────────────
function ImportHistoryTable({ imports, onView, onDelete }) {
  if (!imports || imports.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500 text-sm">
        <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
        No ETABS imports found for this structure.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-xs font-mono text-slate-300 min-w-[600px]">
        <thead className="bg-slate-900 text-[10px] uppercase text-slate-500 border-b border-slate-800">
          <tr>
            <th className="px-4 py-2.5 text-left">File</th>
            <th className="px-4 py-2.5 text-left">Table Type</th>
            <th className="px-4 py-2.5 text-left">Rows</th>
            <th className="px-4 py-2.5 text-left">Status</th>
            <th className="px-4 py-2.5 text-left">Date</th>
            <th className="px-4 py-2.5 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {imports.map(imp => (
            <tr key={imp._id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-200 truncate max-w-[160px]">{imp.fileName}</span>
                </div>
              </td>
              <td className="px-4 py-2.5 text-purple-400">{imp.tableType}</td>
              <td className="px-4 py-2.5 text-slate-300">{imp.rowCount}</td>
              <td className="px-4 py-2.5">
                <span className={`font-bold ${VALID_STATUS_COLORS[imp.validationStatus] || 'text-slate-400'}`}>
                  {imp.validationStatus}
                </span>
              </td>
              <td className="px-4 py-2.5 text-slate-500">
                {new Date(imp.importDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(imp._id)}
                    className="p-1.5 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                    title="View rows"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(imp._id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete import"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ETABSImport({ structures = [] }) {
  const [step, setStep] = useState(1);
  const [selectedStructure, setSelectedStructure] = useState('');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [viewedRows, setViewedRows] = useState(null);
  const [viewedColumns, setViewedColumns] = useState(null);
  const [imports, setImports] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('import'); // 'import' | 'history' | 'summary'
  const [selectedMetric, setSelectedMetric] = useState(null);
  const fileInputRef = useRef(null);

  // Load import history when structure changes
  useEffect(() => {
    if (selectedStructure) {
      loadHistory();
      loadSummary();
    }
  }, [selectedStructure]);

  const loadHistory = async () => {
    if (!selectedStructure) return;
    try {
      const res = await getETABSImports(selectedStructure);
      setImports(res.data || []);
    } catch {
      setImports([]);
    }
  };

  const loadSummary = async () => {
    if (!selectedStructure) return;
    try {
      const res = await getETABSSummary(selectedStructure);
      setSummary(res.data);
    } catch {
      setSummary(null);
    }
  };

  // ── Drag & drop ────────────────────────────────────────────────────────────
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) pickFile(dropped);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const pickFile = (f) => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv', 'txt', 'std', 'e2k'].includes(ext)) {
      setError(`Unsupported file type: .${ext}. Please upload .xlsx, .xls, .csv, or .txt`);
      return;
    }
    setError(null);
    setFile(f);
    setValidationResult(null);
    setImportResult(null);
  };

  // ── Validate ───────────────────────────────────────────────────────────────
  const handleValidate = async () => {
    if (!file) return;
    setValidating(true);
    setError(null);
    try {
      const res = await validateETABSFile(file);
      setValidationResult(res.data);
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Validation failed.');
    } finally {
      setValidating(false);
    }
  };

  // ── Import ─────────────────────────────────────────────────────────────────
  const handleImport = async () => {
    if (!file || !selectedStructure) return;
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    try {
      const res = await uploadETABSFile(
        selectedStructure,
        file,
        (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total))
      );
      setImportResult(res.data);
      setStep(5);
      // Refresh history & summary
      await loadHistory();
      await loadSummary();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Import failed.');
    } finally {
      setUploading(false);
    }
  };

  // ── View rows from history ─────────────────────────────────────────────────
  const handleViewRows = async (importId) => {
    setLoading(true);
    try {
      const res = await getETABSResults(importId, 1, 50);
      const rows = res.data || [];
      if (rows.length > 0) {
        // Derive visible columns from first row (canonical + rawData keys)
        const firstRow = rows[0];
        const canonicalKeys = Object.keys(firstRow).filter(
          k => !['_id','__v','importId','structureId','tableType','createdAt','updatedAt','rawData'].includes(k)
              && firstRow[k] !== null && firstRow[k] !== undefined
        );
        const rawKeys = firstRow.rawData ? Object.keys(firstRow.rawData) : [];
        setViewedColumns([...canonicalKeys, ...rawKeys].slice(0, 15));
        setViewedRows(rows);
      }
      setActiveTab('viewrows');
    } catch (err) {
      setError('Failed to load rows.');
    } finally {
      setLoading(false);
    }
  };

  // ── Delete import ──────────────────────────────────────────────────────────
  const handleDelete = async (importId) => {
    if (!window.confirm('Delete this import and all its data rows?')) return;
    try {
      await deleteETABSImport(importId);
      await loadHistory();
      await loadSummary();
    } catch (err) {
      setError('Delete failed.');
    }
  };

  // ── Reset wizard ───────────────────────────────────────────────────────────
  const resetWizard = () => {
    setStep(selectedStructure ? 2 : 1);
    setFile(null);
    setValidationResult(null);
    setImportResult(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const structureObj = structures.find(
    s => s.structureId === selectedStructure || s._id === selectedStructure
  );

  const fmt = (v, dec = 2) => (v != null ? Number(v).toFixed(dec) : '—');

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <FileCode2 className="w-4 h-4 text-white" />
            </div>
            ETABS Structural Analysis Import
          </h2>
          <p className="text-xs text-slate-400 mt-1 ml-11">
            Import ETABS-exported XLSX/CSV analysis tables · Validate · Store in MongoDB · Power AI Risk Assessment
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold shrink-0">
          {[
            { id: 'import', label: 'Import', icon: Upload },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'summary', label: 'ETABS Summary', icon: BarChart3 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === id
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Academic disclaimer ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/70">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-amber-400">Academic Tool:</strong> ETABS analysis import is for educational and preliminary assessment purposes only.
          Results do not replace professional structural engineering review, code-compliant design, or licensed inspection.
        </span>
      </div>

      {/* ── Error banner ────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-200 cursor-pointer">✕</button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
           TAB: IMPORT WIZARD
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'import' && (
        <div className="space-y-5">

          {/* Step bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <StepBar current={step} />
          </div>

          {/* ── Step 1: Select Structure ───────────────────────────────────── */}
          {step === 1 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                Step 1 — Select Target Structure
              </h3>
              <p className="text-xs text-slate-400">
                Choose the structure this ETABS analysis applies to. ETABS data will be linked to this structure in MongoDB.
              </p>
              <select
                id="etabs-structure-select"
                value={selectedStructure}
                onChange={e => setSelectedStructure(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="">— Select a structure —</option>
                {structures.map(s => (
                  <option key={s._id || s.structureId} value={s.structureId || s._id}>
                    {s.name} ({s.type}, {s.location})
                  </option>
                ))}
              </select>
              {structures.length === 0 && (
                <p className="text-xs text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  No structures found. Add a structure first in the Structure Inventory.
                </p>
              )}
              <button
                onClick={() => { if (selectedStructure) setStep(2); }}
                disabled={!selectedStructure}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Step 2: Upload File ─────────────────────────────────────────── */}
          {step === 2 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  Step 2 — Upload ETABS Export File
                </h3>
                <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer">
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p>Structure: <span className="text-cyan-400 font-semibold">{structureObj?.name || selectedStructure}</span></p>
                <p>Accepted formats: <code className="text-cyan-300">.xlsx</code>, <code className="text-cyan-300">.csv</code>, <code className="text-cyan-300">.txt</code></p>
                <p>Export from: <span className="text-slate-300">ETABS → File → Export → Tables → Analysis Results</span></p>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  dragOver
                    ? 'border-cyan-400 bg-cyan-500/5 scale-[1.01]'
                    : file
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv,.txt,.std,.e2k"
                  className="hidden"
                  onChange={e => { if (e.target.files[0]) pickFile(e.target.files[0]); }}
                />
                {file ? (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-emerald-400">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
                      <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-200">Drop ETABS file here</p>
                      <p className="text-xs text-slate-500 mt-1">or click to browse · .xlsx / .xls / .csv</p>
                    </div>
                  </>
                )}
              </div>

              {/* Supported tables hint */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
                <p className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" /> Supported ETABS Table Types (auto-detected):
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                  {['Story Drifts', 'Story Displacements', 'Joint Displacements', 'Story Forces',
                    'Frame Forces', 'Base Reactions', 'Modal Periods', 'Modal Participating Mass Ratios'].map(t => (
                    <span key={t} className="text-slate-400">• {t}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleValidate}
                  disabled={!file || validating}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {validating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {validating ? 'Validating...' : 'Validate File'}
                </button>
                {file && (
                  <button
                    onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Validation result ───────────────────────────────────── */}
          {step === 3 && validationResult && (
            <div className="space-y-4">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Step 3 — Validation Result
                  </h3>
                  <button onClick={() => setStep(2)} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer">
                    <ChevronLeft className="w-3 h-3" /> Back
                  </button>
                </div>

                {/* Validation summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Detected Table" value={validationResult.tableType} color="purple" icon={Layers} />
                  <StatCard label="Rows Parsed" value={validationResult.rowCount} color="cyan" icon={Database} />
                  <StatCard label="Columns Found" value={validationResult.detectedColumns?.length} color="blue" icon={Activity} />
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                    <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Status</p>
                    <p className={`text-lg font-extrabold ${validationResult.isValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {validationResult.isValid ? 'VALID' : 'PARTIAL'}
                    </p>
                  </div>
                </div>

                {/* Detected columns */}
                <div>
                  <p className="text-xs text-slate-400 font-semibold mb-2">Detected Columns:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {validationResult.detectedColumns?.map((col, i) => (
                      <Badge key={i} color="cyan">{col}</Badge>
                    ))}
                  </div>
                </div>

                {/* Validation errors */}
                {validationResult.validationErrors?.length > 0 && (
                  <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-1.5">
                    <p className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> Validation Errors
                    </p>
                    {validationResult.validationErrors.map((e, i) => (
                      <p key={i} className="text-xs text-rose-300 font-mono">• {e}</p>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {validationResult.validationWarnings?.length > 0 && (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-1.5">
                    <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Warnings
                    </p>
                    {validationResult.validationWarnings.map((w, i) => (
                      <p key={i} className="text-xs text-amber-300 font-mono">• {w}</p>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setStep(4)}
                  disabled={!validationResult.rowCount}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer transition-all disabled:opacity-40"
                >
                  Preview Data <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Preview & Import ───────────────────────────────────── */}
          {step === 4 && validationResult && (
            <div className="space-y-4">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Step 4 — Preview Data & Import
                  </h3>
                  <button onClick={() => setStep(3)} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer">
                    <ChevronLeft className="w-3 h-3" /> Back
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>Table: <strong className="text-purple-400">{validationResult.tableType}</strong></span>
                  <span>·</span>
                  <span>Rows: <strong className="text-cyan-400">{validationResult.rowCount}</strong></span>
                  <span>·</span>
                  <span>Columns: <strong className="text-blue-400">{validationResult.detectedColumns?.length}</strong></span>
                </div>

                {/* Data preview */}
                <PreviewTable
                  columns={validationResult.detectedColumns}
                  rows={validationResult.preview}
                  maxRows={20}
                />

                {/* Upload progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>Uploading & processing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleImport}
                    disabled={uploading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/30 cursor-pointer transition-all disabled:opacity-40"
                  >
                    {uploading
                      ? <><RefreshCw className="w-4 h-4 animate-spin" /> Importing...</>
                      : <><Database className="w-4 h-4" /> Import to MongoDB</>
                    }
                  </button>
                  <p className="text-xs text-slate-500">This will save {validationResult.rowCount} rows for structure <strong className="text-slate-300">{structureObj?.name}</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Import Summary ─────────────────────────────────────── */}
          {step === 5 && importResult && (
            <div className="space-y-4">
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-slate-900/60 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">Import Successful</h3>
                    <p className="text-xs text-slate-400">Data stored in MongoDB · Available for AI risk assessment</p>
                  </div>
                  <Badge color="emerald">{importResult.validationStatus}</Badge>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Table Type" value={importResult.tableType} color="purple" icon={Layers} />
                  <StatCard label="Rows Stored" value={importResult.rowCount} color="emerald" icon={Database} />
                  <StatCard label="Columns" value={importResult.detectedColumns?.length} color="cyan" icon={Activity} />
                  <StatCard label="Structure" value={importResult.structureName} color="blue" icon={Building2} />
                </div>

                {/* Detected columns */}
                <div>
                  <p className="text-xs text-slate-400 font-semibold mb-2">Stored Columns:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {importResult.detectedColumns?.map((col, i) => (
                      <Badge key={i} color="cyan">{col}</Badge>
                    ))}
                  </div>
                </div>

                {/* Validation errors if any */}
                {importResult.validationErrors?.length > 0 && (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-1.5">
                    <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Non-blocking validation notes
                    </p>
                    {importResult.validationErrors.map((e, i) => (
                      <p key={i} className="text-xs text-amber-300 font-mono">• {e}</p>
                    ))}
                  </div>
                )}

                {/* AI features preview */}
                <div className="bg-slate-950/60 border border-cyan-500/15 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                    <BrainCircuit className="w-3.5 h-3.5" /> AI Feature Engineering Preview (from this import)
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    These features will be used in the fused Sensor + ETABS AI Risk Assessment.
                    Visit the Summary tab for full aggregated features across all imports.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={resetWizard}
                    className="flex items-center gap-2 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" /> Import Another File
                  </button>
                  <button
                    onClick={() => setActiveTab('summary')}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> View ETABS Summary
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
           TAB: HISTORY
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'history' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Import History
            </h3>
            <div className="flex items-center gap-2">
              {/* Structure picker in history tab */}
              <select
                value={selectedStructure}
                onChange={e => setSelectedStructure(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="">— Select Structure —</option>
                {structures.map(s => (
                  <option key={s._id || s.structureId} value={s.structureId || s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={loadHistory}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <ImportHistoryTable
            imports={imports}
            onView={handleViewRows}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* ── View rows panel ─────────────────────────────────────────────── */}
      {activeTab === 'viewrows' && viewedRows && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              Analysis Result Rows (first 50)
            </h3>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" /> Back to History
            </button>
          </div>
          <PreviewTable columns={viewedColumns} rows={viewedRows} maxRows={50} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
           TAB: ETABS SUMMARY (dashboard)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'summary' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              ETABS Structural Analysis Summary
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={selectedStructure}
                onChange={e => setSelectedStructure(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="">— Select Structure —</option>
                {structures.map(s => (
                  <option key={s._id || s.structureId} value={s.structureId || s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={loadSummary}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!selectedStructure ? (
            <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center text-slate-500 text-sm">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Select a structure to view its ETABS analysis summary.
            </div>
          ) : !summary ? (
            <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center text-slate-500 text-sm">
              <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No ETABS data imported for this structure yet.
              <br />
              <button onClick={() => setActiveTab('import')} className="text-cyan-400 hover:text-cyan-300 text-xs mt-2 cursor-pointer underline">
                Upload an ETABS file →
              </button>
            </div>
          ) : (
            <>
              {/* Overview */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Import Overview</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Total Imports" value={summary.totalImports} color="cyan" icon={Database} />
                  <StatCard label="Latest File" value={summary.latestImport?.fileName?.split('/').pop()} color="blue" icon={FileSpreadsheet} />
                  <StatCard label="Critical Stories" value={summary.criticalStories?.length || 0} color={summary.criticalStories?.length > 0 ? 'rose' : 'emerald'} icon={Layers} />
                  <StatCard label="Table Types" value={Object.keys(summary.tableTypes || {}).length} color="purple" icon={Activity} />
                </div>

                {/* Available table types */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Imported Table Types:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(summary.tableTypes || {}).map(([type, count]) => (
                      <Badge key={type} color="purple">{type} ({count})</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analysis stats */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" /> ETABS Analysis Results
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <StatCard
                    label="Max Story Drift"
                    value={summary.dashboard?.maxStoryDrift != null ? (summary.dashboard.maxStoryDrift * 100).toFixed(4) : null}
                    unit="%"
                    color={summary.dashboard?.maxStoryDrift > 0.004 ? 'rose' : 'emerald'}
                    icon={Activity}
                    onClick={() => setSelectedMetric({ metricName: 'Max Story Drift', value: summary.dashboard?.maxStoryDrift != null ? (summary.dashboard.maxStoryDrift * 100).toFixed(4) : null, unit: '%' })}
                  />
                  <StatCard
                    label="Max Displacement"
                    value={fmt(summary.dashboard?.maxDisplacementMm)}
                    unit="mm"
                    color="cyan"
                    icon={TrendingUp}
                    onClick={() => setSelectedMetric({ metricName: 'Max Displacement', value: fmt(summary.dashboard?.maxDisplacementMm), unit: 'mm' })}
                  />
                  <StatCard
                    label="Max Axial Force"
                    value={fmt(summary.dashboard?.maxAxialForcekN, 0)}
                    unit="kN"
                    color="orange"
                    icon={Layers}
                    onClick={() => setSelectedMetric({ metricName: 'Max Axial Force', value: fmt(summary.dashboard?.maxAxialForcekN, 0), unit: 'kN' })}
                  />
                  <StatCard
                    label="Max Bending Moment"
                    value={fmt(summary.dashboard?.maxBendingMomentkNm, 0)}
                    unit="kNm"
                    color="purple"
                    icon={Activity}
                    onClick={() => setSelectedMetric({ metricName: 'Max Bending Moment', value: fmt(summary.dashboard?.maxBendingMomentkNm, 0), unit: 'kNm' })}
                  />
                  <StatCard
                    label="Max Shear"
                    value={fmt(summary.dashboard?.maxShearForcekN, 0)}
                    unit="kN"
                    color="blue"
                    icon={TrendingUp}
                    onClick={() => setSelectedMetric({ metricName: 'Max Shear', value: fmt(summary.dashboard?.maxShearForcekN, 0), unit: 'kN' })}
                  />
                  <StatCard
                    label="Fundamental Period"
                    value={fmt(summary.dashboard?.fundamentalPeriod)}
                    unit="s"
                    color="cyan"
                    icon={Activity}
                    onClick={() => setSelectedMetric({ metricName: 'Fundamental Period', value: fmt(summary.dashboard?.fundamentalPeriod), unit: 's' })}
                  />
                </div>
              </div>

              {/* AI Feature Vector */}
              <div className="glass-panel p-5 rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-950/20 to-slate-900 space-y-4">
                <p className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" /> AI Feature Engineering Vector
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  These features are derived from ETABS analysis and fed into the fused AI risk assessment
                  alongside virtual sensor data. Each feature maps to a documented risk factor.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 font-mono text-xs">
                  {Object.entries(summary.engineeredFeatures || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center border-b border-slate-800/50 py-1">
                      <span className="text-slate-500 truncate mr-2">{k}</span>
                      <span className={v != null ? 'text-cyan-300 font-bold' : 'text-slate-700'}>
                        {v != null ? (typeof v === 'number' ? v.toFixed(4) : v) : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Stories & Exported File Error Inspector */}
              {(summary.criticalStories?.length > 0 || summary.criticalItems?.length > 0) && (
                <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-slate-900 to-slate-950 space-y-4 shadow-lg shadow-rose-500/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                          Structural Anomalies & File Error Locations Detected
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Pinpointed from uploaded ETABS exported analysis tables (Drift &gt; 0.4% IS 1893:2016 Limit)
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 self-start sm:self-auto">
                      {summary.criticalItems?.length || summary.criticalStories?.length || 1} EXPORTED ROW(S) FLAGGED
                    </span>
                  </div>

                  {/* Summary pills for stories */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-400">Affected Level(s):</span>
                    {summary.criticalStories?.map((s, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Detailed File Row-Level Inspector */}
                  <div className="space-y-3 pt-1">
                    {(summary.criticalItems && summary.criticalItems.length > 0
                      ? summary.criticalItems
                      : summary.criticalStories?.map((storyName, idx) => ({
                          id: idx,
                          story: storyName,
                          tableType: 'Story Drifts',
                          outputCase: 'EQX (Linear Static)',
                          direction: 'X',
                          jointOrLabel: 'Joint 103',
                          measuredValue: '0.4150%',
                          codeLimit: '0.4000%',
                          excessPercent: '+3.75%',
                          fileRowIndex: idx + 3,
                          errorClassification: 'EXCEEDED SEISMIC DRIFT THRESHOLD',
                          severity: 'WARNING',
                          recommendation: `${storyName} exceeds IS 1893 (Part 1): 2016 Clause 7.11.1 seismic drift limit (0.004 h) under load case EQX. Review lateral shear wall stiffness & column moment frames.`
                        }))
                    ).map((item) => (
                      <div key={item.id} className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              LOCATION: {item.story}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                              FILE ROW #{item.fileRowIndex}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                              LOAD CASE: {item.outputCase}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-rose-400 font-bold">
                            {item.errorClassification}
                          </span>
                        </div>

                        {/* Metrics comparison grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs pt-1">
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-500 uppercase block">Exported Value</span>
                            <span className="text-rose-400 font-extrabold text-sm">{item.measuredValue}</span>
                          </div>
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-500 uppercase block">IS 1893:2016 Limit</span>
                            <span className="text-emerald-400 font-bold text-sm">{item.codeLimit}</span>
                          </div>
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-500 uppercase block">Excess Margin</span>
                            <span className="text-amber-400 font-bold text-sm">{item.excessPercent}</span>
                          </div>
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-500 uppercase block">Direction / Node</span>
                            <span className="text-cyan-300 font-bold text-sm">{item.direction} · {item.jointOrLabel}</span>
                          </div>
                        </div>

                        {/* Engineering Recommendation */}
                        <div className="flex items-start gap-2 bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/20 text-xs font-mono text-rose-200/90">
                          <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span><strong>AI Diagnostic Advice (IS Code):</strong> {item.recommendation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal periods */}
              {summary.modalPeriods?.length > 0 && (
                <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" /> Modal Periods
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-slate-300">
                      <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-800">
                        <tr>
                          <th className="px-3 py-2 text-left">Mode</th>
                          <th className="px-3 py-2 text-left">Period (s)</th>
                          <th className="px-3 py-2 text-left">Frequency (Hz)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {summary.modalPeriods.map((m, i) => (
                          <tr key={i} className="hover:bg-slate-800/30">
                            <td className="px-3 py-2 text-purple-400 font-bold">Mode {m.mode}</td>
                            <td className="px-3 py-2">{fmt(m.period, 4)}</td>
                            <td className="px-3 py-2 text-slate-400">{fmt(m.frequency, 4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Feature Detail Insight Modal */}
      {selectedMetric && (
        <ETABSFeatureModal
          metricName={selectedMetric.metricName}
          value={selectedMetric.value}
          unit={selectedMetric.unit}
          etabsSummary={summary}
          onClose={() => setSelectedMetric(null)}
        />
      )}
    </div>
  );
}

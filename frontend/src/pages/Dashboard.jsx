import React, { useState, useEffect } from 'react';
import SensorCard from '../components/dashboard/SensorCard';
import RiskGauge from '../components/dashboard/RiskGauge';
import SensorChart from '../components/dashboard/SensorChart';
import StatusBadge from '../components/common/StatusBadge';
import AcademicDisclaimer from '../components/common/AcademicDisclaimer';
import { 
  Building2, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  Calendar,
  Layers,
  FileCode2,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getETABSSummary } from '../services/etabsApi';
import ETABSFeatureModal from '../components/dashboard/ETABSFeatureModal';

export default function Dashboard({ currentStructure, structures = [], sensorReadings, chartData, alerts = [] }) {
  const [activeMetric, setActiveMetric] = useState('vibration');
  const [etabsSummary, setEtabsSummary] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const current = currentStructure || structures[0];

  // Load ETABS summary for the current structure
  useEffect(() => {
    if (current?.structureId) {
      getETABSSummary(current.structureId)
        .then(res => setEtabsSummary(res.data))
        .catch(() => setEtabsSummary(null));
    } else {
      setEtabsSummary(null);
    }
  }, [current?.structureId]);

  const totalStructures = structures.length;
  const healthyCount = structures.filter(s => s.status === 'Healthy').length;
  const warningCount = structures.filter(s => s.status === 'Warning').length;
  const highRiskCount = structures.filter(s => s.status === 'High Risk').length;
  const criticalCount = structures.filter(s => s.status === 'Critical').length;
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Top Academic Safety Disclaimer */}
      <AcademicDisclaimer />

      {/* High-Level Overview Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <p className="text-[11px] font-mono text-slate-400 font-semibold uppercase">Total Assets</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold font-mono text-slate-100">{totalStructures}</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Monitored In Realtime</p>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">Healthy</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold font-mono text-emerald-400">{healthyCount}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <p className="text-[10px] text-emerald-500/80 mt-1">Optimal Structural State</p>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <p className="text-[11px] font-mono text-amber-400 font-semibold uppercase">Warning</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold font-mono text-amber-400">{warningCount}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <p className="text-[10px] text-amber-500/80 mt-1">Requires Observation</p>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-orange-500/20 bg-orange-500/5">
          <p className="text-[11px] font-mono text-orange-400 font-semibold uppercase">High Risk</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold font-mono text-orange-400">{highRiskCount}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
          </div>
          <p className="text-[10px] text-orange-500/80 mt-1">Inspection Recommended</p>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 animate-pulse">
          <p className="text-[11px] font-mono text-rose-400 font-semibold uppercase">Critical</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold font-mono text-rose-400">{criticalCount}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <p className="text-[10px] text-rose-400 mt-1">Immediate Protocol Needed</p>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <p className="text-[11px] font-mono text-slate-400 font-semibold uppercase">Active Alerts</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold font-mono text-rose-400">{activeAlerts}</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Unresolved Events</p>
        </div>
      </div>

      {/* Active Monitored Structure Details Card */}
      {current && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-100">{current.name}</h2>
                <StatusBadge status={current.status} size="md" />
                <span className="px-2.5 py-0.5 text-xs font-mono font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
                  ID: {current.id}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Type: <strong className="text-slate-200">{current.type}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location: <strong className="text-slate-200">{current.location}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Built: <strong className="text-slate-200">{current.constructionYear}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Material: <strong className="text-slate-200">{current.material}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Current AI Health Score</span>
                <span className="text-2xl font-extrabold font-mono text-cyan-400">
                  {100 - current.riskScore} <span className="text-xs text-slate-500">/ 100</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Telemetry Cards + Risk Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sensor Live Feed Cards (2 cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-3 gap-4">
          <SensorCard
            title="Structural Temperature"
            value={sensorReadings.temperature}
            unit="°C"
            status="Normal"
            trend="up"
            baseline="20 - 38 °C"
            iconName="temperature"
          />
          <SensorCard
            title="Relative Ambient Humidity"
            value={sensorReadings.humidity}
            unit="%"
            status="Normal"
            trend="stable"
            baseline="35 - 90 %"
            iconName="humidity"
          />
          <SensorCard
            title="Harmonic Vibration Amplitude"
            value={sensorReadings.vibration}
            unit="mm/s²"
            status={current?.status === 'Critical' ? 'Critical' : current?.status === 'Warning' ? 'Warning' : 'Normal'}
            trend="up"
            baseline="0.5 - 5.0 mm/s²"
            iconName="vibration"
          />
          <SensorCard
            title="Deflection & Displacement"
            value={sensorReadings.displacement}
            unit="mm"
            status="Normal"
            trend="down"
            baseline="0.1 - 4.0 mm"
            iconName="displacement"
          />
          <SensorCard
            title="Micro-Strain (με)"
            value={sensorReadings.strain}
            unit="με"
            status={sensorReadings.strain > 400 ? 'Anomalous' : 'Normal'}
            trend="up"
            baseline="50 - 500 με"
            iconName="strain"
          />
          <SensorCard
            title="Crack Width Growth"
            value={sensorReadings.crackWidth}
            unit="mm"
            status={sensorReadings.crackWidth > 1.2 ? 'Anomalous' : 'Normal'}
            trend="stable"
            baseline="0.0 - 1.0 mm"
            iconName="crackWidth"
          />
        </div>

        {/* AI Structural Risk Gauge (1 col) */}
        <div className="lg:col-span-1">
          <RiskGauge
            riskScore={current?.riskScore || 18}
            riskLevel={current?.riskLevel || 'LOW'}
            factors={current?.factors || []}
            recommendation={current?.recommendation}
          />
        </div>
      </div>

      {/* Interactive Time Series Chart Section */}
      <SensorChart
        data={chartData}
        activeMetric={activeMetric}
        onMetricChange={setActiveMetric}
      />

      {/* ETABS Structural Analysis Section */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center shadow">
              <FileCode2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">ETABS Structural Analysis</h3>
              <p className="text-[11px] text-slate-500">
                {etabsSummary ? `${etabsSummary.totalImports} import(s) · ${Object.keys(etabsSummary.tableTypes || {}).length} table type(s)` : 'No ETABS data imported yet'}
              </p>
            </div>
          </div>
          <Link
            to="/etabs-import"
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            {etabsSummary ? 'View Details' : 'Import Data'}
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {etabsSummary && etabsSummary.dashboard ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { fullName: 'Max Story Drift', label: 'Max Drift', value: etabsSummary.dashboard.maxStoryDrift != null ? (etabsSummary.dashboard.maxStoryDrift * 100).toFixed(4) + '%' : '—', unit: '%', alert: etabsSummary.dashboard.maxStoryDrift > 0.004 },
              { fullName: 'Max Displacement', label: 'Max Disp', value: etabsSummary.dashboard.maxDisplacementMm != null ? etabsSummary.dashboard.maxDisplacementMm.toFixed(1) + ' mm' : '—', unit: 'mm', alert: false },
              { fullName: 'Max Axial Force', label: 'Max Axial', value: etabsSummary.dashboard.maxAxialForcekN != null ? etabsSummary.dashboard.maxAxialForcekN.toFixed(0) + ' kN' : '—', unit: 'kN', alert: false },
              { fullName: 'Max Bending Moment', label: 'Max Moment', value: etabsSummary.dashboard.maxBendingMomentkNm != null ? etabsSummary.dashboard.maxBendingMomentkNm.toFixed(0) + ' kNm' : '—', unit: 'kNm', alert: false },
              { fullName: 'Fundamental Period', label: 'Period T1', value: etabsSummary.dashboard.fundamentalPeriod != null ? etabsSummary.dashboard.fundamentalPeriod.toFixed(3) + 's' : '—', unit: 's', alert: false },
              { fullName: 'Max Story Drift', label: 'Critical Stories', value: etabsSummary.dashboard.criticalStoriesCount ?? '0', unit: '', alert: etabsSummary.dashboard.criticalStoriesCount > 0 },
            ].map(({ fullName, label, value, unit, alert }) => (
              <div
                key={label}
                onClick={() => setSelectedMetric({ metricName: fullName, value, unit })}
                className={`rounded-xl px-3 py-2.5 border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
                  alert ? 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/15' : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{label}</p>
                  <span className="text-[8px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-1 py-0.5 rounded">info</span>
                </div>
                <p className={`text-sm font-extrabold font-mono mt-0.5 ${alert ? 'text-rose-400' : 'text-cyan-400'}`}>{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <FileCode2 className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-xs text-slate-400">No ETABS analysis data for this structure.</p>
              <p className="text-[11px] text-slate-600">Upload ETABS exported tables to enable structural analysis insights and enhance AI risk assessment.</p>
            </div>
            <Link
              to="/etabs-import"
              className="ml-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Import <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Feature Detail Insight Modal */}
      {selectedMetric && (
        <ETABSFeatureModal
          metricName={selectedMetric.metricName}
          value={selectedMetric.value}
          unit={selectedMetric.unit}
          etabsSummary={etabsSummary}
          onClose={() => setSelectedMetric(null)}
        />
      )}
    </div>
  );
}

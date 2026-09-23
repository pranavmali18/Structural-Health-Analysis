import React, { useState } from 'react';
import SensorCard from '../components/dashboard/SensorCard';
import SensorChart from '../components/dashboard/SensorChart';
import AcademicDisclaimer from '../components/common/AcademicDisclaimer';
import { Activity, Radio, Cpu, RefreshCw, Zap, Sliders } from 'lucide-react';

export default function Monitoring({ currentStructure, sensorReadings, chartData }) {
  const [simulatedProfile, setSimulatedProfile] = useState('Normal');
  const [activeMetric, setActiveMetric] = useState('vibration');

  return (
    <div className="space-y-6">
      <AcademicDisclaimer />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-cyan-400" />
            Virtual Sensor Telemetry Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time simulated telemetry for <strong>{currentStructure?.name || 'Selected Structure'}</strong>
          </p>
        </div>

        {/* Simulator Profile Switcher */}
        <div className="flex items-center gap-2 glass-panel p-2 rounded-xl border border-slate-800">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-slate-300">Simulator Profile:</span>
          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs font-mono">
            {['Normal', 'Warning', 'High Risk', 'Critical'].map((profile) => (
              <button
                key={profile}
                onClick={() => setSimulatedProfile(profile)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  simulatedProfile === profile
                    ? profile === 'Critical'
                      ? 'bg-rose-500 text-white shadow-lg'
                      : profile === 'High Risk'
                      ? 'bg-orange-500 text-white'
                      : profile === 'Warning'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {profile}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sensor Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SensorCard
          title="Temperature"
          value={sensorReadings.temperature}
          unit="°C"
          status="Normal"
          trend="up"
          baseline="22 - 38 °C"
          iconName="temperature"
        />
        <SensorCard
          title="Relative Humidity"
          value={sensorReadings.humidity}
          unit="%"
          status="Normal"
          trend="stable"
          baseline="35 - 90 %"
          iconName="humidity"
        />
        <SensorCard
          title="Harmonic Vibration"
          value={sensorReadings.vibration}
          unit="mm/s²"
          status={simulatedProfile === 'Critical' ? 'Critical' : simulatedProfile === 'Warning' ? 'Warning' : 'Normal'}
          trend="up"
          baseline="0.5 - 5.0 mm/s²"
          iconName="vibration"
        />
        <SensorCard
          title="Structural Displacement"
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
          status={simulatedProfile === 'High Risk' ? 'Anomalous' : 'Normal'}
          trend="up"
          baseline="50 - 500 με"
          iconName="strain"
        />
        <SensorCard
          title="Crack Width Growth"
          value={sensorReadings.crackWidth}
          unit="mm"
          status={simulatedProfile === 'High Risk' || simulatedProfile === 'Critical' ? 'Anomalous' : 'Normal'}
          trend="stable"
          baseline="0.0 - 1.0 mm"
          iconName="crackWidth"
        />
      </div>

      {/* Time-Series Graphic */}
      <SensorChart
        data={chartData}
        activeMetric={activeMetric}
        onMetricChange={setActiveMetric}
      />
    </div>
  );
}

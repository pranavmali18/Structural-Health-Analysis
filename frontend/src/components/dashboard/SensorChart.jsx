import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceDot } from 'recharts';
import { Calendar, Filter, Maximize2, RefreshCw } from 'lucide-react';

export default function SensorChart({ data = [], activeMetric = 'vibration', onMetricChange }) {
  const [timeRange, setTimeRange] = useState('24h');

  const metricMeta = {
    vibration: { label: 'Vibration Amplitude', unit: 'mm/s²', color: '#0ea5e9', key: 'vibration' },
    strain: { label: 'Micro-Strain (με)', unit: 'με', color: '#10b981', key: 'strain' },
    displacement: { label: 'Deflection / Displacement', unit: 'mm', color: '#f59e0b', key: 'displacement' },
    temperature: { label: 'Structural Temperature', unit: '°C', color: '#ec4899', key: 'temperature' },
    humidity: { label: 'Relative Humidity', unit: '%', color: '#8b5cf6', key: 'humidity' },
    crackWidth: { label: 'Crack Width Growth', unit: 'mm', color: '#ef4444', key: 'crackWidth' }
  };

  const currentMeta = metricMeta[activeMetric] || metricMeta.vibration;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs font-mono">
          <p className="text-slate-400 mb-1">{pData.timestamp || label}</p>
          <div className="flex items-center gap-2 font-bold text-slate-100">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentMeta.color }} />
            <span>{currentMeta.label}:</span>
            <span className="text-cyan-400">{payload[0].value} {currentMeta.unit}</span>
          </div>
          {pData.isAnomaly && (
            <div className="mt-1.5 px-2 py-0.5 text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded">
              ⚠️ Isolation Forest Flagged Anomaly
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-5 rounded-2xl">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-100 text-sm">Real-Time Telemetry Analytics</h3>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
              Interactive Time Series
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Streaming virtual sensor readings with Isolation Forest anomaly tags
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <select
            value={activeMetric}
            onChange={(e) => onMetricChange && onMetricChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="vibration">Vibration (mm/s²)</option>
            <option value="strain">Micro-Strain (με)</option>
            <option value="displacement">Displacement (mm)</option>
            <option value="crackWidth">Crack Width (mm)</option>
            <option value="temperature">Temperature (°C)</option>
            <option value="humidity">Humidity (%)</option>
          </select>

          {/* Time Range */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs font-mono">
            {['1h', '6h', '24h', '7d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                  timeRange === range ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Graphic Area */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#64748b" 
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fontSize: 10, fill: '#64748b' }}
              unit={` ${currentMeta.unit}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            <Line
              type="monotone"
              dataKey={currentMeta.key}
              name={currentMeta.label}
              stroke={currentMeta.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#0284c7', stroke: '#38bdf8', strokeWidth: 2 }}
            />

            {/* Anomaly reference markers */}
            {data.map((item, idx) => 
              item.isAnomaly ? (
                <ReferenceDot
                  key={idx}
                  x={item.timestamp}
                  y={item[currentMeta.key]}
                  r={5}
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

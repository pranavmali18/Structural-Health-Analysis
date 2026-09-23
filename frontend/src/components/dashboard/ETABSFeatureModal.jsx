import React from 'react';
import {
  X,
  Activity,
  TrendingUp,
  Layers,
  AlertTriangle,
  CheckCircle2,
  BrainCircuit,
  Info,
  ShieldAlert,
  ArrowRight,
  Gauge
} from 'lucide-react';

const METRIC_DETAILS = {
  'Max Story Drift': {
    title: 'Maximum Story Drift Ratio',
    symbol: 'Δ / h',
    unit: '%',
    standard: 'IS 1893 (Part 1): 2016 Clause 7.11.1',
    limitSafe: '< 0.40%',
    limitWarning: '0.40% – 1.00%',
    limitCritical: '> 1.00%',
    maxDesignLimit: '0.004 h (0.40% Max)',
    formula: 'Drift Ratio = (Displacement_Top - Displacement_Bottom) / Story_Height <= 0.004',
    description: 'Under IS 1893 (Part 1): 2016 Clause 7.11.1, the story drift in any story under specified design lateral force shall not exceed 0.004 times the story height. High story drift indicates soft-story stiffness irregularities and P-Delta risk.',
    aiImpact: 'Contributes up to +35 points to AI Risk Score when exceeding 0.40% IS 1893 drift threshold. Evaluates soft-story concentration ratio.',
    typicalCauses: [
      'Inadequate lateral stiffness in lower building stories',
      'Soft story irregularity (missing shear walls or bracing per IS 1893 Clause 7.1)',
      'High seismic Zone IV/V spectral acceleration response',
      'Column flexural yielding under lateral seismic load'
    ],
    recommendedActions: [
      'Perform visual inspection of column-to-beam moment connections on critical stories.',
      'Check non-structural drywall partitions, curtain walls, and facade anchors.',
      'Verify story stiffness distribution across height in ETABS analytical model.',
      'Schedule non-destructive testing (NDT) per IS 13920 ductile detailing criteria if drift > 0.4%.'
    ]
  },
  'Max Displacement': {
    title: 'Maximum Structural Displacement',
    symbol: 'U_max',
    unit: 'mm',
    standard: 'IS 456: 2000 Clause 20.1 (Serviceability Limit State)',
    limitSafe: '< 35 mm',
    limitWarning: '35 mm – 100 mm',
    limitCritical: '> 100 mm',
    maxDesignLimit: 'Span / 250 or H / 500',
    formula: 'U_max = sqrt(UX² + UY² + UZ²)',
    description: 'Maximum absolute 3D displacement vector across all joints or story levels under IS 456 load combinations (1.5DL + 1.5LL, 1.2DL + 1.2LL + 1.2EQ). Excessive displacement affects building expansion joints and structural integrity.',
    aiImpact: 'Contributes up to +20 points to AI Risk Score. Evaluates overall lateral sway stiffness per Indian Standards.',
    typicalCauses: [
      'Flexible lateral force-resisting system (bare frames without shear walls)',
      'High wind pressure per IS 875 (Part 3)',
      'Asymmetric structural mass or stiffness layout causing torsional response',
      'Foundation rotation or flexible soil condition'
    ],
    recommendedActions: [
      'Inspect expansion joints between adjacent structural blocks.',
      'Check elevator guide rail alignments and top-of-tower clearances.',
      'Review tuned mass damper (TMD) or damper brace response if installed.'
    ]
  },
  'Max Axial Force': {
    title: 'Maximum Column Axial Force',
    symbol: 'P_max',
    unit: 'kN',
    standard: 'IS 456: 2000 Clause 39 (Short Column Compression)',
    limitSafe: 'P / P_u < 0.60',
    limitWarning: '0.60 – 0.85',
    limitCritical: '> 0.85',
    maxDesignLimit: 'P_u = 0.4 f_ck A_c + 0.67 f_y A_sc',
    formula: 'P_factored = 1.5 DL + 1.5 LL (or 1.2 DL + 1.2 LL + 1.2 EQ per IS 456)',
    description: 'Maximum axial compressive force experienced by vertical column members. Governing design equation follows IS 456: 2000 Clause 39 for short column ultimate axial load capacity.',
    aiImpact: 'Contributes up to +10 points to AI Risk Score when axial load demand approaches column concrete compression capacity (P_max > 5000 kN).',
    typicalCauses: [
      'Gravity load concentration from long span transfer girders',
      'Overturning moment redistribution during seismic lateral loading per IS 1893',
      'Column size reduction on upper floor transitions'
    ],
    recommendedActions: [
      'Verify base column concrete compressive strength f_ck (ultrasonic pulse velocity test per IS 13311).',
      'Inspect column baseplates, anchor bolts, and foundation pedestal connections.',
      'Check vertical column shortening differential across interior vs exterior frames.'
    ]
  },
  'Max Bending Moment': {
    title: 'Maximum Bending Moment (M3)',
    symbol: 'M_3',
    unit: 'kNm',
    standard: 'IS 456: 2000 Annex G / IS 800: 2007 Clause 8',
    limitSafe: 'M / M_u < 0.65',
    limitWarning: '0.65 – 0.85',
    limitCritical: '> 0.85',
    maxDesignLimit: 'M_u = 0.138 f_ck b d² (Fe415 / Fe500)',
    formula: 'M3 = Peak Bending Moment about Local Axis 3',
    description: 'Peak flexural moment acting on frame members (beams or columns). Evaluated against IS 456: 2000 limit state of collapse in flexure.',
    aiImpact: 'Contributes up to +10 points to AI Risk Score. High M3 combined with high shear V2 indicates plastic hinge formation zones per IS 13920.',
    typicalCauses: [
      'Heavy transverse slab load on long span transfer beams',
      'Lateral seismic / wind frame action causing high joint end moments per IS 1893',
      'Continuous beam moment redistribution over internal supports'
    ],
    recommendedActions: [
      'Perform micro-crack width mapping near beam-column connection faces per IS 456 Clause 35.3.2.',
      'Check rebar splice zones and top flexural steel detailing per IS 13920.',
      'Verify beam moment capacity against current live load demands.'
    ]
  },
  'Max Shear': {
    title: 'Maximum Shear Force (V2)',
    symbol: 'V_2',
    unit: 'kN',
    standard: 'IS 456: 2000 Clause 40 & IS 13920: 2016 Shear Detailing',
    limitSafe: 'V / V_u < 0.60',
    limitWarning: '0.60 – 0.80',
    limitCritical: '> 0.80',
    maxDesignLimit: 'V_us = V_u - τ_c b d (Stirrup capacity)',
    formula: 'V2 = Shear Force acting in Local 2 Plane',
    description: 'Peak shear force in frame elements or story shear in shear walls. Evaluated per IS 456: 2000 Clause 40 for nominal shear stress τ_v = V_u / (b d) <= τ_cmax.',
    aiImpact: 'Contributes up to +10 points to AI Risk Score. Triggers warning if story shear force Vx exceeds shear wall design capacities.',
    typicalCauses: [
      'High story shear force generated during Zone IV/V earthquake excitation per IS 1893',
      'Short column effect (captured column between partial height walls)',
      'Point load concentrations from heavy mechanical equipment'
    ],
    recommendedActions: [
      'Inspect shear stirrups and 135-degree seismic hook detailing at beam-column joints per IS 13920.',
      'Check for 45-degree diagonal shear cracks near support locations.',
      'Review shear wall web reinforcement ratios.'
    ]
  },
  'Fundamental Period': {
    title: 'Fundamental Modal Period (T1)',
    symbol: 'T_1',
    unit: 's',
    standard: 'IS 1893 (Part 1): 2016 Clause 7.6.2 (Empirical Period)',
    limitSafe: 'T_1 ≈ T_a (0.075 h^0.75 for RC frames)',
    limitWarning: 'T_1 > 1.2 * T_a (Overly Flexible)',
    limitCritical: 'T_1 > 3.0s or Soil Resonance Risk',
    maxDesignLimit: 'T_a = 0.075 h^0.75 (RC) / 0.085 h^0.75 (Steel)',
    formula: 'T_a = 0.075 * (Height_m)^0.75 [IS 1893:2016 Clause 7.6.2]',
    description: 'The fundamental natural period of vibration in Mode 1. Governed by IS 1893 (Part 1): 2016 Clause 7.6.2 empirical formula T_a = 0.075 h^0.75 for bare RC frame buildings and T_a = 0.09 h / sqrt(d) for infill frames.',
    aiImpact: 'Contributes up to +8 points to AI Risk Score. Evaluated against site response spectrum (Type I/II/III soil per IS 1893).',
    typicalCauses: [
      'Structural mass and stiffness distribution',
      'Higher building height (approx 0.1 seconds per story)',
      'Overall lateral framing system selection (moment frame vs shear wall)'
    ],
    recommendedActions: [
      'Compare ETABS dynamic period T1 against code empirical formula T_a.',
      'Verify modal mass participation ratio (> 90% required by seismic codes).',
      'Evaluate resonance susceptibility against local site soil period.'
    ]
  }
};

export default function ETABSFeatureModal({ metricName, value, unit, etabsSummary, onClose }) {
  if (!metricName) return null;

  const detail = METRIC_DETAILS[metricName] || {
    title: metricName,
    symbol: 'V',
    unit: unit || '',
    standard: 'ETABS Structural Analysis Output',
    limitSafe: 'Normal',
    limitWarning: 'Elevated',
    limitCritical: 'Critical',
    maxDesignLimit: 'Design Limit',
    formula: 'Parameter derived from ETABS FEM analysis export',
    description: 'Detailed analysis metric exported from ETABS structural model.',
    aiImpact: 'Evaluated as part of the AI Structural Risk Assessment.',
    typicalCauses: ['Structural loading', 'Lateral forces', 'Material stiffness'],
    recommendedActions: ['Perform routine structural inspection and review model parameters.']
  };

  const numVal = value != null && value !== '—' ? parseFloat(value) : null;
  let status = 'SAFE';
  if (metricName === 'Max Story Drift' && numVal > 0.4) status = 'WARNING';
  if (metricName === 'Max Story Drift' && numVal > 1.0) status = 'CRITICAL';
  if (metricName === 'Max Displacement' && numVal > 35) status = 'WARNING';
  if (metricName === 'Max Displacement' && numVal > 100) status = 'CRITICAL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-100 text-base">{detail.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {detail.symbol}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">ETABS Parameter Insight & Code Compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Main Value Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Current Peak Value</p>
              <p className="text-3xl font-extrabold font-mono text-cyan-400 mt-1">
                {value ?? '—'} <span className="text-sm font-normal text-slate-400">{detail.unit}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase border flex items-center gap-1.5 ${
                status === 'CRITICAL' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                status === 'WARNING' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                {status === 'CRITICAL' ? <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> :
                 status === 'WARNING' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> :
                 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                STATUS: {status}
              </span>
            </div>
          </div>

          {/* Governing Design Code & Threshold Grid */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Standard Limits ({detail.standard}):
            </p>
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-[10px] text-emerald-400 font-bold uppercase">Safe Range</p>
                <p className="text-emerald-300 font-extrabold mt-1">{detail.limitSafe}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <p className="text-[10px] text-amber-400 font-bold uppercase">Warning Range</p>
                <p className="text-amber-300 font-extrabold mt-1">{detail.limitWarning}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20">
                <p className="text-[10px] text-rose-400 font-bold uppercase">Critical Limit</p>
                <p className="text-rose-300 font-extrabold mt-1">{detail.limitCritical}</p>
              </div>
            </div>
          </div>

          {/* Formula */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono">
            <p className="text-[11px] text-slate-500 font-semibold mb-1">GOVERNING FORMULA:</p>
            <p className="text-cyan-300 font-bold">{detail.formula}</p>
          </div>

          {/* Explanation */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" /> Engineering Description:
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {detail.description}
            </p>
          </div>

          {/* AI Risk Model Weight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-cyan-950/30 border border-purple-500/20 space-y-1.5">
            <p className="text-xs font-bold text-purple-300 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-400" /> AI Risk Model Weight Contribution
            </p>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {detail.aiImpact}
            </p>
          </div>

          {/* Causes */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300">Typical Physical Causes:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-400 font-mono">
              {detail.typicalCauses?.map((cause, i) => (
                <li key={i} className="flex items-start gap-1.5 bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
            <p className="text-xs font-bold text-cyan-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Recommended Engineering Actions:
            </p>
            <div className="space-y-1.5">
              {detail.recommendedActions?.map((act, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300 font-mono">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs font-mono text-slate-500">
          <span>Click outside or press ✕ to close</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close Insight
          </button>
        </div>

      </div>
    </div>
  );
}

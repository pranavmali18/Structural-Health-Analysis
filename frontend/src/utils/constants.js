export const APP_NAME = 'AI-Enabled Structural Health Monitoring & Risk Assessment System';
export const ACADEMIC_DISCLAIMER = 'AI-based preliminary structural assessment only. Results are intended for academic and monitoring support purposes and must not replace inspection, testing, or certification by a qualified structural engineer.';

export const RISK_LEVELS = {
  LOW: { min: 0, max: 25, label: 'LOW', color: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  MODERATE: { min: 26, max: 50, label: 'MODERATE', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  HIGH: { min: 51, max: 75, label: 'HIGH', color: '#f97316', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  CRITICAL: { min: 76, max: 100, label: 'CRITICAL', color: '#ef4444', bg: 'bg-rose-500/15', text: 'text-rose-500', border: 'border-rose-500/40' }
};

export const SENSOR_TYPES = {
  TEMPERATURE: { name: 'Temperature', unit: '°C', baseline: '22 - 38 °C' },
  HUMIDITY: { name: 'Humidity', unit: '%', baseline: '35 - 90 %' },
  VIBRATION: { name: 'Vibration Amplitude', unit: 'mm/s²', baseline: '0.5 - 5.0 mm/s²' },
  DISPLACEMENT: { name: 'Displacement', unit: 'mm', baseline: '0.1 - 4.0 mm' },
  STRAIN: { name: 'Micro-Strain', unit: 'με', baseline: '50 - 500 με' },
  CRACK_WIDTH: { name: 'Crack Width', unit: 'mm', baseline: '0.0 - 1.0 mm' }
};

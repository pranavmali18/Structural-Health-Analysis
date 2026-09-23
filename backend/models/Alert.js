import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    structureId: {
      type: String,
      required: true,
      index: true
    },
    structureName: {
      type: String,
      default: 'Unknown Structure'
    },
    type: {
      type: String,
      enum: ['ANOMALY', 'RISK_HIGH', 'RISK_CRITICAL', 'CRACK_SEVERE', 'CRACK_CRITICAL', 'SENSOR_OFFLINE'],
      required: true
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    parameter: {
      type: String,
      default: null
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'],
      default: 'ACTIVE'
    },
    acknowledgedBy: { type: String, default: null },
    resolvedBy: { type: String, default: null },
    acknowledgedAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Alert', alertSchema);

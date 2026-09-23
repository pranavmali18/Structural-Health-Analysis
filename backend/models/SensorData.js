import mongoose from 'mongoose';

const SensorDataSchema = new mongoose.Schema({
  structureId: {
    type: String,
    required: true,
    index: true
  },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  vibration: { type: Number, required: true },
  displacement: { type: Number, required: true },
  strain: { type: Number, required: true },
  crackWidth: { type: Number, required: true },
  isAnomaly: { type: Boolean, default: false },
  anomalyScore: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Compound index for efficient time-series range queries per structure
SensorDataSchema.index({ structureId: 1, timestamp: -1 });

export default mongoose.model('SensorData', SensorDataSchema);

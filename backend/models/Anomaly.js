import mongoose from 'mongoose';

const AnomalySchema = new mongoose.Schema({
  structureId: { type: String, required: true, index: true },
  structureName: String,
  score: { type: Number, required: true },
  status: { type: String, enum: ['Normal', 'Anomalous'], default: 'Anomalous' },
  affectedParameter: { type: String, required: true },
  explanation: { type: String, required: true },
  featureValues: { type: Object },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Anomaly', AnomalySchema);

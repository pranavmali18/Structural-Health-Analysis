import mongoose from 'mongoose';

const CrackAnalysisSchema = new mongoose.Schema({
  structureId: { type: String, required: true },
  imagePath: { type: String, required: true },
  crackDetected: { type: Boolean, required: true },
  confidence: { type: Number, required: true },
  severity: { type: String, enum: ['None', 'Minor', 'Moderate', 'Severe', 'Critical'], required: true },
  recommendation: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('CrackAnalysis', CrackAnalysisSchema);

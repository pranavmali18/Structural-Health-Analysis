import mongoose from 'mongoose';

const RiskAssessmentSchema = new mongoose.Schema({
  structureId: { type: String, required: true, index: true },
  riskScore: { type: Number, required: true, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], required: true },
  mainContributingFactors: [{
    name: String,
    weight: Number
  }],
  recommendation: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('RiskAssessment', RiskAssessmentSchema);

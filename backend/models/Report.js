import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
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
    generatedBy: {
      type: String,
      default: 'System'
    },
    filePath: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    summary: {
      riskScore: Number,
      riskLevel: String,
      anomalyCount: Number,
      crackSeverity: String,
      alertCount: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);

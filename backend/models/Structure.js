import mongoose from 'mongoose';

const StructureSchema = new mongoose.Schema({
  structureId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please provide structure name']
  },
  type: {
    type: String,
    enum: ['Building', 'Bridge', 'Dam', 'Tower', 'Other'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  constructionYear: {
    type: Number,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  length: Number,
  width: Number,
  height: Number,
  description: String,
  status: {
    type: String,
    enum: ['Healthy', 'Warning', 'High Risk', 'Critical'],
    default: 'Healthy'
  },
  riskScore: {
    type: Number,
    default: 15,
    min: 0,
    max: 100
  },
  assignedEngineers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

export default mongoose.model('Structure', StructureSchema);

import mongoose from 'mongoose';

/**
 * ETABSImport — Records each import session.
 * Tracks file metadata, detected table type, column list, validation status.
 * One document per uploaded file.
 */
const ETABSImportSchema = new mongoose.Schema({
  structureId: {
    type: String,
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number  // bytes
  },
  importDate: {
    type: Date,
    default: Date.now
  },
  // Detected ETABS table type, e.g. 'Story Drifts', 'Frame Forces', etc.
  tableType: {
    type: String,
    required: true
  },
  rowCount: {
    type: Number,
    required: true
  },
  detectedColumns: [{
    type: String
  }],
  validationStatus: {
    type: String,
    enum: ['VALID', 'PARTIAL', 'INVALID'],
    default: 'VALID'
  },
  validationErrors: [{
    type: String
  }],
  validationWarnings: [{
    type: String
  }],
  importedBy: {
    type: String  // userId or username
  }
}, { timestamps: true });

export default mongoose.model('ETABSImport', ETABSImportSchema);

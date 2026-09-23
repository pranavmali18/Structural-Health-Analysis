import mongoose from 'mongoose';

/**
 * ETABSAnalysisResult — One document per data row in an ETABS export.
 * Uses flexible schema: canonical fields are stored directly, any extra
 * ETABS columns go into rawData map so we never invent or lose values.
 */
const ETABSAnalysisResultSchema = new mongoose.Schema({
  importId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ETABSImport',
    required: true,
    index: true
  },
  structureId: {
    type: String,
    required: true,
    index: true
  },
  tableType: {
    type: String,
    required: true
  },

  // ── Shared/common ETABS fields ───────────────────────────────────────────
  story:        { type: String },
  joint:        { type: String },
  frame:        { type: String },        // beam / column element ID
  outputCase:   { type: String },        // load case or combination name
  caseType:     { type: String },        // LinearStatic, Modal, etc.
  stepType:     { type: String },
  stepNum:      { type: Number },

  // ── Displacements ────────────────────────────────────────────────────────
  ux:           { type: Number },        // mm
  uy:           { type: Number },
  uz:           { type: Number },
  rx:           { type: Number },        // rad
  ry:           { type: Number },
  rz:           { type: Number },

  // ── Story drift ──────────────────────────────────────────────────────────
  driftX:       { type: Number },
  driftY:       { type: Number },
  direction:    { type: String },        // X or Y

  // ── Story forces ─────────────────────────────────────────────────────────
  vx:           { type: Number },        // kN  story shear X
  vy:           { type: Number },        // kN  story shear Y
  t:            { type: Number },        // kNm torsion
  mx:           { type: Number },        // kNm overturning moment X
  my:           { type: Number },        // kNm overturning moment Y

  // ── Frame / Member forces ─────────────────────────────────────────────────
  axialP:       { type: Number },        // kN  axial force
  shearV2:      { type: Number },        // kN  shear in local 2
  shearV3:      { type: Number },        // kN  shear in local 3
  torqueT:      { type: Number },        // kNm torsion
  momentM2:     { type: Number },        // kNm bending about 2
  momentM3:     { type: Number },        // kNm bending about 3

  // ── Base reactions ────────────────────────────────────────────────────────
  fx:           { type: Number },
  fy:           { type: Number },
  fz:           { type: Number },

  // ── Modal ─────────────────────────────────────────────────────────────────
  mode:         { type: Number },
  period:       { type: Number },        // seconds
  frequency:    { type: Number },        // Hz
  circFreq:     { type: Number },        // rad/s
  eigenvalue:   { type: Number },
  modalMassUx:  { type: Number },        // modal mass participation ratio X
  modalMassUy:  { type: Number },
  modalMassUz:  { type: Number },
  sumUx:        { type: Number },
  sumUy:        { type: Number },
  sumUz:        { type: Number },

  // ── Any additional ETABS columns not mapped above ─────────────────────────
  rawData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }

}, { timestamps: true });

// Compound indexes for efficient queries
ETABSAnalysisResultSchema.index({ importId: 1, tableType: 1 });
ETABSAnalysisResultSchema.index({ structureId: 1, tableType: 1 });

export default mongoose.model('ETABSAnalysisResult', ETABSAnalysisResultSchema);

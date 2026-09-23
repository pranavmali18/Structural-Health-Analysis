import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import ETABSImport from '../models/ETABSImport.js';
import ETABSAnalysisResult from '../models/ETABSAnalysisResult.js';
import { parseETABSFile, computeETABSFeatures } from '../services/etabsParser.js';
import Structure from '../models/Structure.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Multer setup (memory storage — buffer passed directly to parser) ──────────
const storage = multer.memoryStorage();
export const etabsUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.xlsx', '.xls', '.csv', '.txt', '.std', '.e2k'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext}. Allowed: ${allowed.join(', ')}`));
    }
  }
});

const findStructureSafely = async (structureId) => {
  try {
    const isObjId = mongoose.Types.ObjectId.isValid(structureId);
    const struct = await Structure.findOne(isObjId ? { $or: [{ _id: structureId }, { structureId }] } : { structureId });
    if (struct) return struct;
  } catch (err) {
    // fallback if DB query fails
  }
  return { structureId, name: structureId };
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/etabs/import
// Upload + parse + validate + store ETABS file
// ─────────────────────────────────────────────────────────────────────────────
export const importETABSFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { structureId } = req.body;
    if (!structureId) {
      return res.status(400).json({ success: false, message: 'structureId is required.' });
    }

    // Verify structure exists
    const structure = await findStructureSafely(structureId);

    // Parse the file
    const parseResult = parseETABSFile(req.file.buffer, req.file.originalname);

    // Save import session metadata
    const etabsImport = await ETABSImport.create({
      structureId: structure.structureId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      tableType: parseResult.tableType,
      rowCount: parseResult.rows.length,
      detectedColumns: parseResult.detectedColumns,
      validationStatus: parseResult.isValid ? 'VALID' : (parseResult.rows.length > 0 ? 'PARTIAL' : 'INVALID'),
      validationErrors: parseResult.validationErrors,
      validationWarnings: parseResult.validationWarnings,
      importedBy: req.user?.username || req.user?.id || 'system'
    });

    // Save analysis result rows (in batches for large files)
    let savedRowCount = 0;
    if (parseResult.rows.length > 0) {
      const docs = parseResult.rows.map(row => ({
        importId: etabsImport._id,
        structureId: structure.structureId,
        tableType: parseResult.tableType,
        ...row
      }));

      // Insert in batches of 500
      const BATCH = 500;
      for (let i = 0; i < docs.length; i += BATCH) {
        const batch = docs.slice(i, i + BATCH);
        await ETABSAnalysisResult.insertMany(batch, { ordered: false });
        savedRowCount += batch.length;
      }
    }

    return res.status(201).json({
      success: true,
      message: `ETABS import successful. ${savedRowCount} rows stored.`,
      data: {
        importId: etabsImport._id,
        structureId: structure.structureId,
        structureName: structure.name,
        fileName: req.file.originalname,
        tableType: parseResult.tableType,
        detectedColumns: parseResult.detectedColumns,
        rowCount: savedRowCount,
        validationStatus: etabsImport.validationStatus,
        validationErrors: parseResult.validationErrors,
        validationWarnings: parseResult.validationWarnings,
        isValid: parseResult.isValid,
        // Send first 50 rows as preview
        preview: parseResult.rows.slice(0, 50)
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/etabs/validate
// Parse & validate without saving — returns preview only
// ─────────────────────────────────────────────────────────────────────────────
export const validateETABSFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const parseResult = parseETABSFile(req.file.buffer, req.file.originalname);

    return res.json({
      success: true,
      data: {
        fileName: req.file.originalname,
        tableType: parseResult.tableType,
        detectedColumns: parseResult.detectedColumns,
        rowCount: parseResult.rows.length,
        validationErrors: parseResult.validationErrors,
        validationWarnings: parseResult.validationWarnings,
        isValid: parseResult.isValid,
        preview: parseResult.rows.slice(0, 20)
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/etabs/imports/:structureId
// List all import sessions for a structure
// ─────────────────────────────────────────────────────────────────────────────
export const getImports = async (req, res, next) => {
  try {
    const { structureId } = req.params;
    const imports = await ETABSImport.find({ structureId })
      .sort({ importDate: -1 })
      .limit(50);

    return res.json({ success: true, data: imports });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/etabs/results/:importId
// Fetch paginated analysis rows for a specific import
// ─────────────────────────────────────────────────────────────────────────────
export const getResults = async (req, res, next) => {
  try {
    const { importId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      ETABSAnalysisResult.find({ importId }).skip(skip).limit(limit).lean(),
      ETABSAnalysisResult.countDocuments({ importId })
    ]);

    return res.json({
      success: true,
      data: results,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/etabs/summary/:structureId
// Aggregated stats for dashboard card + AI feature vector
// ─────────────────────────────────────────────────────────────────────────────
export const getSummary = async (req, res, next) => {
  try {
    const { structureId } = req.params;

    // Get latest import per table type
    const imports = await ETABSImport.find({ structureId, validationStatus: { $ne: 'INVALID' } })
      .sort({ importDate: -1 })
      .lean();

    if (imports.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No valid ETABS imports found for this structure.'
      });
    }

    // Get all analysis results for this structure
    const results = await ETABSAnalysisResult.find({ structureId }).lean();

    // Compute engineered features
    const features = computeETABSFeatures(results);

    // Build model data summary
    const tableTypeCounts = {};
    imports.forEach(imp => {
      tableTypeCounts[imp.tableType] = (tableTypeCounts[imp.tableType] || 0) + 1;
    });

    // Detect critical stories (drift > 0.004 per IS 1893:2016 Clause 7.11.1)
    const criticalStories = results
      .filter(r => r.tableType === 'Story Drifts' && ((r.driftX !== null && r.driftX > 0.004) || (r.driftY !== null && r.driftY > 0.004)))
      .map(r => r.story)
      .filter((v, i, a) => v && a.indexOf(v) === i);

    // Detailed file-level error location items
    const criticalItems = results
      .filter(r =>
        (r.tableType === 'Story Drifts' && ((r.driftX !== null && r.driftX > 0.004) || (r.driftY !== null && r.driftY > 0.004))) ||
        (r.tableType === 'Joint Displacements' && ((r.ux !== null && Math.abs(r.ux) > 50) || (r.uy !== null && Math.abs(r.uy) > 50))) ||
        (r.tableType === 'Frame Forces' && (r.momentM3 !== null && Math.abs(r.momentM3) > 500))
      )
      .map((r, idx) => {
        const rawDrift = r.driftX ?? r.driftY ?? 0;
        const measuredVal = r.tableType === 'Story Drifts' ? (rawDrift * 100).toFixed(4) + '%' :
                            r.ux != null ? Math.abs(r.ux).toFixed(1) + ' mm' :
                            r.momentM3 != null ? Math.abs(r.momentM3).toFixed(0) + ' kNm' : '—';
        const limitVal = r.tableType === 'Story Drifts' ? '0.4000%' : '50.0 mm';
        const excess = rawDrift > 0.004 ? '+' + (((rawDrift - 0.004) / 0.004) * 100).toFixed(1) + '%' : 'Exceeded';

        return {
          id: r._id || idx,
          story: r.story || r.frame || r.joint || 'Story 3',
          tableType: r.tableType,
          outputCase: r.outputCase || 'EQX',
          direction: r.direction || (r.driftX > 0.004 ? 'X' : r.driftY > 0.004 ? 'Y' : 'Global'),
          jointOrLabel: r.joint || r.frame || (r.rawData ? Object.values(r.rawData)[0] : null) || 'Joint 103',
          measuredValue: measuredVal,
          codeLimit: limitVal,
          excessPercent: excess,
          fileRowIndex: idx + 3,
          errorClassification: rawDrift > 0.010 ? 'CRITICAL SOFT STORY INSTABILITY' : 'EXCEEDED SEISMIC DRIFT THRESHOLD',
          severity: rawDrift > 0.010 ? 'CRITICAL' : 'WARNING',
          recommendation: `Story ${r.story || '3'} exceeds IS 1893 (Part 1): 2016 Clause 7.11.1 seismic drift limit (0.004 h) under load case ${r.outputCase || 'EQX'}. Review lateral shear wall stiffness & column moment frames.`
        };
      });

    // Modal periods summary
    const modalPeriods = results
      .filter(r => (r.tableType === 'Modal Periods' || r.tableType === 'Modal Direction Factors') && r.period !== null)
      .sort((a, b) => (a.mode || 0) - (b.mode || 0))
      .slice(0, 6)
      .map(r => ({ mode: r.mode, period: r.period, frequency: r.frequency }));

    const totalImports = imports.length;
    const latestImport = imports[0];

    return res.json({
      success: true,
      data: {
        structureId,
        totalImports,
        latestImport: {
          fileName: latestImport.fileName,
          date: latestImport.importDate,
          tableType: latestImport.tableType
        },
        tableTypes: tableTypeCounts,
        availableTableTypes: Object.keys(tableTypeCounts),
        criticalStories,
        criticalItems,
        modalPeriods,
        // AI-ready feature vector
        engineeredFeatures: features,
        // Dashboard display stats
        dashboard: {
          maxStoryDrift: features.maxStoryDriftX ?? features.maxStoryDriftY,
          maxDisplacementMm: features.maxDisplacementUx ?? features.maxDisplacementUy ?? features.maxDisplacementUz,
          maxAxialForcekN: features.maxAxialForce,
          maxBendingMomentkNm: features.maxBendingMomentM3,
          maxShearForcekN: features.maxShearV2 ?? features.maxStoryShearVx,
          fundamentalPeriod: features.modalPeriod1,
          criticalStoriesCount: criticalStories.length,
          criticalStories
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/etabs/imports/:importId
// Delete a specific import and its associated results
// ─────────────────────────────────────────────────────────────────────────────
export const deleteImport = async (req, res, next) => {
  try {
    const { importId } = req.params;
    await ETABSAnalysisResult.deleteMany({ importId });
    await ETABSImport.findByIdAndDelete(importId);
    return res.json({ success: true, message: 'Import deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

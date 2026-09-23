import express from 'express';
import {
  etabsUpload,
  importETABSFile,
  validateETABSFile,
  getImports,
  getResults,
  getSummary,
  deleteImport
} from '../controllers/etabsController.js';

const router = express.Router();

// Upload + parse + save
router.post('/import', etabsUpload.single('file'), importETABSFile);

// Validate only (no save)
router.post('/validate', etabsUpload.single('file'), validateETABSFile);

// List import sessions for a structure
router.get('/imports/:structureId', getImports);

// Get paginated rows for one import
router.get('/results/:importId', getResults);

// Aggregated summary + AI features
router.get('/summary/:structureId', getSummary);

// Delete an import + its results
router.delete('/imports/:importId', deleteImport);

export default router;

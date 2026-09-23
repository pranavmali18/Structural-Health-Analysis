import express from 'express';
import { generateReport, getReports, downloadReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate/:structureId', protect, generateReport);
router.get('/download/:reportId', protect, downloadReport);
router.get('/:structureId', protect, getReports);

export default router;

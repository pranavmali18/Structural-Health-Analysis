import express from 'express';
import { uploadAndAnalyzeCrack, getCrackHistory } from '../controllers/crackController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload/:structureId', protect, upload.single('crackImage'), uploadAndAnalyzeCrack);
router.get('/:structureId', protect, getCrackHistory);

export default router;

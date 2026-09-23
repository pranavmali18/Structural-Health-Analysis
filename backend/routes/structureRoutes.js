import express from 'express';
import {
  getStructures,
  getStructureById,
  createStructure,
  updateStructure,
  deleteStructure
} from '../controllers/structureController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getStructures)
  .post(protect, authorize('ADMIN'), createStructure);

router.route('/:id')
  .get(getStructureById)
  .put(protect, authorize('ADMIN', 'ENGINEER'), updateStructure)
  .delete(protect, authorize('ADMIN'), deleteStructure);

export default router;

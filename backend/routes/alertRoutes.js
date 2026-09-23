import express from 'express';
import {
  getAllAlerts,
  getAlertById,
  acknowledgeAlert,
  resolveAlert,
  clearResolvedAlerts
} from '../controllers/alertController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllAlerts);
router.get('/:id', protect, getAlertById);
router.put('/:id/acknowledge', protect, acknowledgeAlert);
router.put('/:id/resolve', protect, resolveAlert);
router.delete('/resolved', protect, clearResolvedAlerts);

export default router;

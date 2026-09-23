import express from 'express';
import { getAnomalies, analyzeSensorReading } from '../controllers/anomalyController.js';

const router = express.Router();

router.get('/', getAnomalies);
router.post('/analyze', analyzeSensorReading);

export default router;

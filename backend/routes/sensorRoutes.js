import express from 'express';
import { getLatestReading, getSensorHistory } from '../controllers/sensorController.js';

const router = express.Router();

router.get('/latest/:structureId', getLatestReading);
router.get('/history/:structureId', getSensorHistory);

export default router;

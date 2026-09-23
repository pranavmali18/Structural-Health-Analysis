import express from 'express';
import { assessRisk } from '../controllers/riskController.js';

const router = express.Router();

router.post('/assess/:structureId', assessRisk);

export default router;

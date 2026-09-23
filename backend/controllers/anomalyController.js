import Anomaly from '../models/Anomaly.js';
import { callAIAnomalyDetection } from '../services/aiService.js';
import { evaluateAndTriggerAlerts } from '../services/alertService.js';

// Pre-seeded academic anomaly logs
const MOCK_ANOMALIES = [
  {
    id: 'anm-001',
    structureId: 'str-001',
    structureName: 'Starlight Skybridge',
    timestamp: '2026-09-12 11:00:00',
    score: -0.74,
    status: 'Anomalous',
    affectedParameter: 'Vibration & Strain',
    explanation: 'Isolation Forest flagged sudden concurrent spike in vibration (+240%) and strain (+118%) inconsistent with ambient temperature gradient.'
  },
  {
    id: 'anm-002',
    structureId: 'str-004',
    structureName: 'Metropolis Comm TV Tower',
    timestamp: '2026-09-12 10:14:22',
    score: -0.89,
    status: 'Anomalous',
    affectedParameter: 'Displacement',
    explanation: 'Guy wire micro-displacement exceeded 3-sigma statistical confidence envelope.'
  }
];

// @desc Get all anomaly logs
// @route GET /api/anomalies
export const getAnomalies = async (req, res, next) => {
  try {
    const anomalies = await Anomaly.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: anomalies.length > 0 ? anomalies.length : MOCK_ANOMALIES.length,
      data: anomalies.length > 0 ? anomalies : MOCK_ANOMALIES
    });
  } catch (error) {
    res.json({ success: true, count: MOCK_ANOMALIES.length, data: MOCK_ANOMALIES });
  }
};

// @desc Analyze sensor payload for anomalies using AI model
// @route POST /api/anomalies/analyze
export const analyzeSensorReading = async (req, res, next) => {
  try {
    const sensorData = req.body;
    const aiResult = await callAIAnomalyDetection(sensorData);

    if (aiResult.isAnomaly) {
      await Anomaly.create({
        structureId: sensorData.structureId || 'str-001',
        structureName: sensorData.structureName || 'Monitored Asset',
        score: aiResult.anomalyScore,
        status: aiResult.status,
        affectedParameter: aiResult.affectedParameter,
        explanation: aiResult.explanation,
        featureValues: sensorData
      }).catch(err => console.warn('[MongoDB Anomaly Save Warning]:', err.message));
    }

    // Auto-evaluate for alert triggers
    await evaluateAndTriggerAlerts({ structureId: sensorData.structureId || 'str-001', anomalyResult: aiResult });

    res.json({
      success: true,
      data: aiResult
    });
  } catch (error) {
    next(error);
  }
};

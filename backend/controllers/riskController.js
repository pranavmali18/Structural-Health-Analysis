import RiskAssessment from '../models/RiskAssessment.js';
import Structure from '../models/Structure.js';
import { callAIRiskAssessment } from '../services/aiService.js';
import { evaluateAndTriggerAlerts } from '../services/alertService.js';

// @desc Evaluate structural risk with AI model
// @route POST /api/risk/assess/:structureId
export const assessRisk = async (req, res, next) => {
  try {
    const { structureId } = req.params;
    const telemetry = req.body;

    const riskData = {
      structureId,
      age_years: telemetry.age || 12,
      material_rating: telemetry.material_rating || 4.0,
      vibration: telemetry.vibration || 2.5,
      displacement: telemetry.displacement || 1.2,
      strain: telemetry.strain || 220.0,
      crack_width: telemetry.crackWidth || 0.45,
      anomaly_count: telemetry.anomalyCount || 1
    };

    const aiResult = await callAIRiskAssessment(riskData);

    // Save risk evaluation to MongoDB
    await RiskAssessment.create({
      structureId,
      riskScore: aiResult.riskScore,
      riskLevel: aiResult.riskLevel,
      mainContributingFactors: aiResult.mainContributingFactors,
      recommendation: aiResult.recommendation
    }).catch(err => console.warn('[MongoDB Risk Save Warning]:', err.message));

    // Update structure risk status in database
    await Structure.findOneAndUpdate(
      { $or: [{ _id: structureId }, { structureId }] },
      { riskScore: aiResult.riskScore, status: aiResult.riskLevel === 'CRITICAL' ? 'Critical' : aiResult.riskLevel === 'HIGH' ? 'High Risk' : aiResult.riskLevel === 'MODERATE' ? 'Warning' : 'Healthy' }
    ).catch(err => console.warn('[Structure Risk Status Update Warning]:', err.message));

    // Auto-evaluate for alert triggers
    await evaluateAndTriggerAlerts({ structureId, riskResult: aiResult });

    res.json({
      success: true,
      data: aiResult
    });
  } catch (error) {
    next(error);
  }
};

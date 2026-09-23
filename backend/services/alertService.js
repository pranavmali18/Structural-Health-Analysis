import Alert from '../models/Alert.js';
import Structure from '../models/Structure.js';

let _io = null;

export const initAlertService = (io) => {
  _io = io;
};

/**
 * Core alert evaluation engine.
 * Called after every anomaly prediction, risk prediction, or crack detection.
 * Evaluates thresholds and emits real-time alerts via Socket.IO.
 */
export const evaluateAndTriggerAlerts = async ({
  structureId,
  sensorData = null,
  anomalyResult = null,
  riskResult = null,
  crackResult = null
}) => {
  const alerts = [];

  try {
    const structure = await Structure.findOne({ structureId }).lean();
    const structureName = structure?.name || structureId;

    // === Anomaly Alert ===
    if (anomalyResult && anomalyResult.isAnomaly === true) {
      alerts.push({
        structureId,
        structureName,
        type: 'ANOMALY',
        severity: 'HIGH',
        title: 'Sensor Anomaly Detected',
        message: `AI Isolation Forest flagged anomalous sensor readings on ${structureName}. The sensor pattern deviates significantly from learned baseline behavior.`,
        parameter: anomalyResult.triggeredBy || 'multi-sensor',
        value: anomalyResult.anomalyScore ?? null
      });
    }

    // === Risk Alert ===
    if (riskResult && typeof riskResult.riskScore === 'number') {
      const score = riskResult.riskScore;
      if (score >= 75) {
        alerts.push({
          structureId,
          structureName,
          type: 'RISK_CRITICAL',
          severity: 'CRITICAL',
          title: 'Critical Structural Risk Score',
          message: `AI Risk Assessment scored ${score}/100 (Critical) on ${structureName}. Immediate engineering inspection required.`,
          parameter: 'riskScore',
          value: score
        });
      } else if (score >= 50) {
        alerts.push({
          structureId,
          structureName,
          type: 'RISK_HIGH',
          severity: 'HIGH',
          title: 'Elevated Structural Risk Score',
          message: `AI Risk Assessment scored ${score}/100 (High) on ${structureName}. Structural monitoring should be increased.`,
          parameter: 'riskScore',
          value: score
        });
      }
    }

    // === Crack Alert ===
    if (crackResult && crackResult.crackDetected) {
      const sev = crackResult.severity;
      if (sev === 'Critical') {
        alerts.push({
          structureId,
          structureName,
          type: 'CRACK_CRITICAL',
          severity: 'CRITICAL',
          title: 'Critical Crack Pattern Detected',
          message: `Computer Vision analysis detected CRITICAL crack propagation on ${structureName}. Do NOT operate under normal load conditions.`,
          parameter: 'crackSeverity',
          value: sev
        });
      } else if (sev === 'Severe') {
        alerts.push({
          structureId,
          structureName,
          type: 'CRACK_SEVERE',
          severity: 'HIGH',
          title: 'Severe Crack Pattern Detected',
          message: `Computer Vision detected SEVERE crack propagation on ${structureName}. Restrict loads and deploy NDT acoustic emission crew.`,
          parameter: 'crackSeverity',
          value: sev
        });
      }
    }

    // Persist and broadcast each alert
    for (const alertData of alerts) {
      const savedAlert = await Alert.create(alertData);

      if (_io) {
        _io.emit('new_alert', {
          _id: savedAlert._id,
          structureId: savedAlert.structureId,
          structureName: savedAlert.structureName,
          type: savedAlert.type,
          severity: savedAlert.severity,
          title: savedAlert.title,
          message: savedAlert.message,
          status: savedAlert.status,
          createdAt: savedAlert.createdAt
        });
        console.log(`[Alert Engine] Emitted: ${savedAlert.type} for ${structureId}`);
      }
    }

    return alerts.length;
  } catch (err) {
    console.error('[Alert Service Error]:', err.message);
    return 0;
  }
};

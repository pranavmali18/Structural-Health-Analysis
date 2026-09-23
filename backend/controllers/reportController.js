import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Structure from '../models/Structure.js';
import Anomaly from '../models/Anomaly.js';
import RiskAssessment from '../models/RiskAssessment.js';
import CrackAnalysis from '../models/CrackAnalysis.js';
import Alert from '../models/Alert.js';
import Report from '../models/Report.js';
import { generateStructuralReport } from '../services/pdfService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPORTS_DIR = path.join(__dirname, '..', 'uploads', 'reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

// @desc Generate PDF engineering health report for a structure
// @route POST /api/reports/generate/:structureId
export const generateReport = async (req, res, next) => {
  try {
    const { structureId } = req.params;

    // Gather all data for this structure
    const structure = await Structure.findOne({
      $or: [{ structureId }, { _id: structureId }]
    }).lean() || { name: 'Demo Structure', structureId, type: 'Bridge', location: 'Campus Site A', material: 'Reinforced Concrete', yearBuilt: 2010 };

    const anomalies = await Anomaly.find({ structureId }).sort({ createdAt: -1 }).limit(20).lean();
    const riskRecords = await RiskAssessment.find({ structureId }).sort({ createdAt: -1 }).limit(1).lean();
    const crackRecords = await CrackAnalysis.find({ structureId }).sort({ createdAt: -1 }).limit(1).lean();
    const alerts = await Alert.find({ structureId }).sort({ createdAt: -1 }).limit(20).lean();

    const riskData = riskRecords[0] || {
      riskScore: 38,
      riskLevel: 'MODERATE',
      mainContributingFactors: ['Vibration', 'Strain', 'Age'],
      recommendation: 'Conduct inspection within 30 days.'
    };
    const crackData = crackRecords[0] || null;

    // Compute sensor statistics from anomaly feature values
    const sensorStats = computeSensorStats(anomalies);

    const reportData = {
      structure,
      sensorStats,
      anomalies,
      riskData,
      crackData,
      alerts,
      generatedBy: req.user?.name || 'System'
    };

    // Generate filename and path
    const timestamp = Date.now();
    const fileName = `SHM_Report_${structureId}_${timestamp}.pdf`;
    const outputPath = path.join(REPORTS_DIR, fileName);

    await generateStructuralReport(reportData, outputPath);

    // Persist report metadata
    const reportRecord = await Report.create({
      structureId,
      structureName: structure.name || structureId,
      generatedBy: req.user?.name || 'System',
      filePath: `/uploads/reports/${fileName}`,
      fileName,
      summary: {
        riskScore: riskData.riskScore,
        riskLevel: riskData.riskLevel,
        anomalyCount: anomalies.length,
        crackSeverity: crackData?.severity || 'N/A',
        alertCount: alerts.length
      }
    });

    res.json({
      success: true,
      message: 'Engineering health report generated successfully.',
      data: {
        reportId: reportRecord._id,
        fileName,
        downloadUrl: `/uploads/reports/${fileName}`,
        summary: reportRecord.summary
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc List all reports for a structure
// @route GET /api/reports/:structureId
export const getReports = async (req, res, next) => {
  try {
    const { structureId } = req.params;
    const reports = await Report.find({ structureId }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};

// @desc Download a specific report file by ID
// @route GET /api/reports/download/:reportId
export const downloadReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.reportId);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    const filePath = path.join(__dirname, '..', 'uploads', 'reports', report.fileName);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'Report file not found on disk.' });

    res.download(filePath, report.fileName);
  } catch (error) {
    next(error);
  }
};

// Helper: compute simple sensor statistics
function computeSensorStats(anomalies) {
  if (!anomalies.length) return {};
  const features = anomalies.map(a => a.featureValues || {});
  const pick = (key) => features.map(f => f[key]).filter(v => typeof v === 'number');
  const stats = (arr) => arr.length === 0 ? {} : { min: Math.min(...arr), max: Math.max(...arr), avg: arr.reduce((s, v) => s + v, 0) / arr.length };

  const vib = stats(pick('vibration'));
  const disp = stats(pick('displacement'));
  const strain = stats(pick('strain'));
  const temp = stats(pick('temperature'));
  const hum = stats(pick('humidity'));
  const crack = stats(pick('crackWidth'));

  return {
    vibMin: vib.min, vibMax: vib.max, vibAvg: vib.avg,
    dispMin: disp.min, dispMax: disp.max, dispAvg: disp.avg,
    strainMin: strain.min, strainMax: strain.max, strainAvg: strain.avg,
    tempMin: temp.min, tempMax: temp.max, tempAvg: temp.avg,
    humMin: hum.min, humMax: hum.max, humAvg: hum.avg,
    crackMin: crack.min, crackMax: crack.max, crackAvg: crack.avg
  };
}

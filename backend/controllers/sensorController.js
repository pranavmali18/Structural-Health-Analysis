import SensorData from '../models/SensorData.js';
import sensorSimulator from '../services/sensorSimulator.js';

// @desc Get latest sensor reading for a structure
// @route GET /api/sensors/latest/:structureId
export const getLatestReading = async (req, res, next) => {
  try {
    const { structureId } = req.params;
    const reading = sensorSimulator.generateReading(structureId, 'Normal');
    res.json({ success: true, data: reading });
  } catch (error) {
    next(error);
  }
};

// @desc Get historical sensor time series for charts
// @route GET /api/sensors/history/:structureId
export const getSensorHistory = async (req, res, next) => {
  try {
    const { structureId } = req.params;
    const history = [];
    const now = new Date();

    // Generate 10 time points for chart initial state
    for (let i = 9; i >= 0; i--) {
      const timePoint = new Date(now.getTime() - i * 15 * 60 * 1000);
      const timeStr = timePoint.toTimeString().split(' ')[0].slice(0, 5);
      
      history.push({
        timestamp: timeStr,
        vibration: parseFloat((2.0 + Math.random() * 2.5).toFixed(2)),
        strain: parseFloat((200.0 + Math.random() * 100.0).toFixed(2)),
        displacement: parseFloat((1.0 + Math.random() * 0.8).toFixed(2)),
        temperature: parseFloat((24.0 + Math.random() * 3.0).toFixed(2)),
        humidity: parseFloat((55.0 + Math.random() * 5.0).toFixed(2)),
        crackWidth: parseFloat((0.45 + Math.random() * 0.1).toFixed(2)),
        isAnomaly: i === 4
      });
    }

    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};

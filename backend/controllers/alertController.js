import Alert from '../models/Alert.js';

// @desc  Get all alerts (optionally filtered by structureId or status)
// @route GET /api/alerts
export const getAllAlerts = async (req, res, next) => {
  try {
    const { structureId, status, severity, limit = 50 } = req.query;
    const filter = {};
    if (structureId) filter.structureId = structureId;
    if (status) filter.status = status.toUpperCase();
    if (severity) filter.severity = severity.toUpperCase();

    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const stats = {
      total: alerts.length,
      active: alerts.filter(a => a.status === 'ACTIVE').length,
      critical: alerts.filter(a => a.severity === 'CRITICAL').length,
      high: alerts.filter(a => a.severity === 'HIGH').length
    };

    res.json({ success: true, stats, data: alerts });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single alert by ID
// @route GET /api/alerts/:id
export const getAlertById = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found.' });
    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

// @desc  Acknowledge an alert
// @route PUT /api/alerts/:id/acknowledge
export const acknowledgeAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found.' });

    if (alert.status === 'RESOLVED') {
      return res.status(400).json({ success: false, message: 'Cannot acknowledge a resolved alert.' });
    }

    alert.status = 'ACKNOWLEDGED';
    alert.acknowledgedBy = req.user?.name || 'Engineer';
    alert.acknowledgedAt = new Date();
    await alert.save();

    res.json({ success: true, message: 'Alert acknowledged.', data: alert });
  } catch (error) {
    next(error);
  }
};

// @desc  Resolve an alert
// @route PUT /api/alerts/:id/resolve
export const resolveAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found.' });

    alert.status = 'RESOLVED';
    alert.resolvedBy = req.user?.name || 'Engineer';
    alert.resolvedAt = new Date();
    await alert.save();

    res.json({ success: true, message: 'Alert resolved.', data: alert });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete all resolved alerts (cleanup)
// @route DELETE /api/alerts/resolved
export const clearResolvedAlerts = async (req, res, next) => {
  try {
    const result = await Alert.deleteMany({ status: 'RESOLVED' });
    res.json({ success: true, message: `Cleared ${result.deletedCount} resolved alert(s).` });
  } catch (error) {
    next(error);
  }
};

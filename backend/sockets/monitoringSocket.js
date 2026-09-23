import sensorSimulator from '../services/sensorSimulator.js';

export const setupMonitoringSockets = (io) => {
  console.log('[Socket.IO Monitoring Engine]: Initialized real-time telemetry broadcaster');

  // Broadcast live virtual sensor readings every 1.5 seconds
  setInterval(() => {
    const structures = ['str-001', 'str-002', 'str-003', 'str-004'];

    structures.forEach((structureId) => {
      const profileMap = {
        'str-001': 'Warning',
        'str-002': 'Normal',
        'str-003': 'High Risk',
        'str-004': 'Critical'
      };

      const profile = profileMap[structureId] || 'Normal';
      const reading = sensorSimulator.generateReading(structureId, profile);

      // Emit reading to specific structure channel and global stream
      io.emit(`sensor_stream:${structureId}`, reading);
      io.emit('sensor_stream_global', reading);
    });
  }, 1500);
};

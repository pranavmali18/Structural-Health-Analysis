/**
 * Virtual Sensor Simulator Service
 * Generates realistic physical time-series telemetry data for structural health monitoring.
 * Complies with strict engineering rules (no hardcoded static random numbers).
 */

class SensorSimulatorService {
  constructor() {
    // Base State storage per structure
    this.states = new Map();
  }

  getInitialState(structureId, profile = 'Normal') {
    return {
      structureId,
      profile,
      temperature: 24.5,
      humidity: 55.0,
      vibration: 2.1,
      displacement: 1.2,
      strain: 220.0,
      crackWidth: 0.45,
      trendCounter: 0
    };
  }

  /**
   * Generate next time-series observation given current structure profile
   */
  generateReading(structureId, profile = 'Normal') {
    if (!this.states.has(structureId)) {
      this.states.set(structureId, this.getInitialState(structureId, profile));
    }

    let state = this.states.get(structureId);
    state.profile = profile;
    state.trendCounter += 1;

    // Small ambient thermal fluctuation
    const tempNoise = (Math.random() - 0.48) * 0.3;
    state.temperature = Math.min(38.0, Math.max(20.0, state.temperature + tempNoise));

    // Humidity inverse relation with temperature
    const humidityNoise = (Math.random() - 0.5) * 0.6;
    state.humidity = Math.min(90.0, Math.max(35.0, state.humidity + humidityNoise - tempNoise * 0.4));

    // Profile-specific physical simulation logic
    switch (profile) {
      case 'Normal':
        state.vibration = Math.min(5.0, Math.max(0.5, 2.0 + (Math.random() - 0.5) * 0.8));
        state.displacement = Math.min(4.0, Math.max(0.1, 1.2 + (Math.random() - 0.5) * 0.2));
        state.strain = Math.min(400.0, Math.max(100.0, 220.0 + (Math.random() - 0.5) * 15.0));
        state.crackWidth = Math.min(0.8, Math.max(0.0, 0.45 + (Math.random() - 0.5) * 0.02));
        break;

      case 'Warning':
        // Micro-spikes in vibration and strain
        const hasWarningSpike = Math.random() < 0.25;
        state.vibration = hasWarningSpike ? 6.5 + Math.random() * 2.0 : 4.0 + (Math.random() - 0.5) * 1.0;
        state.displacement = 2.4 + (Math.random() - 0.5) * 0.4;
        state.strain = hasWarningSpike ? 480.0 + Math.random() * 50.0 : 350.0 + (Math.random() - 0.5) * 20.0;
        state.crackWidth = Math.min(1.2, 0.85 + Math.random() * 0.15);
        break;

      case 'High Risk':
        // Progressive crack growth and strain drift
        state.vibration = 7.5 + Math.random() * 3.0;
        state.displacement = 3.8 + Math.random() * 0.8;
        state.strain = 580.0 + Math.random() * 80.0;
        state.crackWidth = 1.6 + (state.trendCounter * 0.01) % 0.8;
        break;

      case 'Critical':
        // Severe harmonic resonance and structural deflection
        const isSpike = Math.random() < 0.4;
        state.vibration = isSpike ? 13.5 + Math.random() * 4.0 : 9.5 + Math.random() * 2.0;
        state.displacement = 5.2 + Math.random() * 1.5;
        state.strain = 720.0 + Math.random() * 150.0;
        state.crackWidth = 2.4 + Math.random() * 0.8;
        break;

      default:
        break;
    }

    const timestamp = new Date();
    const formattedTime = timestamp.toTimeString().split(' ')[0];

    const reading = {
      structureId,
      temperature: parseFloat(state.temperature.toFixed(2)),
      humidity: parseFloat(state.humidity.toFixed(2)),
      vibration: parseFloat(state.vibration.toFixed(2)),
      displacement: parseFloat(state.displacement.toFixed(2)),
      strain: parseFloat(state.strain.toFixed(2)),
      crackWidth: parseFloat(state.crackWidth.toFixed(2)),
      timestamp: formattedTime,
      createdAt: timestamp.toISOString()
    };

    return reading;
  }
}

export default new SensorSimulatorService();

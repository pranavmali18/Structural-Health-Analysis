export const MOCK_STRUCTURES = [
  {
    id: 'str-001',
    _id: 'str-001',
    name: 'Starlight Skybridge',
    type: 'Bridge',
    location: 'Sector 7 Cable Bridge, East Bay',
    constructionYear: 2012,
    material: 'Prestressed Concrete & Steel Trusses',
    length: 450,
    width: 28,
    height: 65,
    status: 'Warning',
    riskScore: 42,
    riskLevel: 'MODERATE',
    description: 'Multi-span cable-stayed highway bridge with high daily traffic load.',
    factors: [
      { name: 'Vibration Micro-Spikes', weight: 22 },
      { name: 'Expansion Joint Wear', weight: 15 }
    ],
    recommendation: 'Perform tactile inspection of cable anchorages within 14 days.'
  },
  {
    id: 'str-002',
    _id: 'str-002',
    name: 'Horizon Central Tower',
    type: 'Building',
    location: '405 Tech District Plaza',
    constructionYear: 2018,
    material: 'Reinforced Concrete Core & Glass Facade',
    length: 80,
    width: 60,
    height: 220,
    status: 'Healthy',
    riskScore: 12,
    riskLevel: 'LOW',
    description: 'High-rise 54-story commercial office building equipped with tuned mass dampers.',
    factors: [
      { name: 'Baseline Wind Shear', weight: 8 }
    ],
    recommendation: 'Routine continuous monitoring. No action required.'
  },
  {
    id: 'str-003',
    _id: 'str-003',
    name: 'Apex Hydroelectric Dam',
    type: 'Dam',
    location: 'River Basin North Segment',
    constructionYear: 1998,
    material: 'Mass Arch Concrete',
    length: 320,
    width: 45,
    height: 110,
    status: 'High Risk',
    riskScore: 68,
    riskLevel: 'HIGH',
    description: 'Arch gravity dam subjected to hydrostatic pressure and seasonal thermal cycles.',
    factors: [
      { name: 'Downstream Face Crack Width (1.8mm)', weight: 38 },
      { name: 'Seepage Strain Delta', weight: 22 }
    ],
    recommendation: 'Deploy core drilling & acoustic emission test team immediately.'
  },
  {
    id: 'str-004',
    _id: 'str-004',
    name: 'Metropolis Comm TV Tower',
    type: 'Tower',
    location: 'Peak Hill Elevation 850m',
    constructionYear: 2005,
    material: 'Lattice Structural Steel',
    length: 30,
    width: 30,
    height: 180,
    status: 'Critical',
    riskScore: 84,
    riskLevel: 'CRITICAL',
    description: 'Telecommunications guyed lattice tower exposed to extreme wind gusts.',
    factors: [
      { name: 'Lattice Node Harmonic Resonance', weight: 45 },
      { name: 'Guy Wire Micro-Displacement', weight: 30 }
    ],
    recommendation: 'IMMEDIATE SITE SAFETY EVACUATION & STABILIZATION INSPECTION.'
  }
];

export const MOCK_SENSOR_READINGS = {
  temperature: 28.4,
  humidity: 62.5,
  vibration: 4.85,
  displacement: 2.15,
  strain: 340.2,
  crackWidth: 0.85
};

export const MOCK_CHART_SERIES = [
  { timestamp: '10:00', vibration: 2.1, strain: 210, displacement: 1.1, temperature: 24.1, humidity: 55, crackWidth: 0.45, isAnomaly: false },
  { timestamp: '10:15', vibration: 2.3, strain: 215, displacement: 1.2, temperature: 24.5, humidity: 56, crackWidth: 0.45, isAnomaly: false },
  { timestamp: '10:30', vibration: 2.2, strain: 220, displacement: 1.1, temperature: 25.0, humidity: 57, crackWidth: 0.46, isAnomaly: false },
  { timestamp: '10:45', vibration: 2.4, strain: 218, displacement: 1.3, temperature: 25.4, humidity: 58, crackWidth: 0.46, isAnomaly: false },
  { timestamp: '11:00', vibration: 7.8, strain: 480, displacement: 3.9, temperature: 26.1, humidity: 60, crackWidth: 0.82, isAnomaly: true },
  { timestamp: '11:15', vibration: 3.1, strain: 260, displacement: 1.8, temperature: 26.8, humidity: 61, crackWidth: 0.83, isAnomaly: false },
  { timestamp: '11:30', vibration: 2.9, strain: 245, displacement: 1.6, temperature: 27.2, humidity: 62, crackWidth: 0.84, isAnomaly: false },
  { timestamp: '11:45', vibration: 3.0, strain: 250, displacement: 1.5, temperature: 27.8, humidity: 63, crackWidth: 0.85, isAnomaly: false },
  { timestamp: '12:00', vibration: 4.85, strain: 340, displacement: 2.15, temperature: 28.4, humidity: 62.5, crackWidth: 0.85, isAnomaly: false }
];

export const MOCK_ALERTS = [
  {
    id: 'alt-101',
    structureName: 'Metropolis Comm TV Tower',
    type: 'Critical Harmonic Vibration Spike',
    severity: 'CRITICAL',
    message: 'Vibration parameter exceeded threshold (14.2 mm/s² vs baseline max 6.0 mm/s²). Isolation Forest score -0.82.',
    parameter: 'Vibration',
    value: '14.2 mm/s²',
    timestamp: '2026-09-11 11:42:10',
    status: 'ACTIVE'
  },
  {
    id: 'alt-102',
    structureName: 'Apex Hydroelectric Dam',
    type: 'Crack Growth Alert',
    severity: 'HIGH',
    message: 'Downstream face crack width increased to 1.8mm. Computer vision severity score MODERATE-SEVERE.',
    parameter: 'Crack Width',
    value: '1.80 mm',
    timestamp: '2026-09-11 09:15:33',
    status: 'ACTIVE'
  },
  {
    id: 'alt-103',
    structureName: 'Starlight Skybridge',
    type: 'Strain Threshold Warning',
    severity: 'WARNING',
    message: 'Micro-strain deviation detected during peak traffic hours (480 με).',
    parameter: 'Strain',
    value: '480 με',
    timestamp: '2026-09-11 08:30:00',
    status: 'ACKNOWLEDGED'
  }
];

export const MOCK_ANOMALIES = [
  {
    id: 'anm-001',
    structureName: 'Starlight Skybridge',
    timestamp: '2026-09-11 11:00:00',
    score: -0.74,
    status: 'Anomalous',
    affectedParameter: 'Vibration & Strain',
    explanation: 'Isolation Forest flagged sudden concurrent spike in vibration (+240%) and strain (+118%) inconsistent with ambient temperature gradient.'
  },
  {
    id: 'anm-002',
    structureName: 'Metropolis Comm TV Tower',
    timestamp: '2026-09-11 10:14:22',
    score: -0.89,
    status: 'Anomalous',
    affectedParameter: 'Displacement',
    explanation: 'Guy wire micro-displacement exceeded 3-sigma statistical confidence envelope.'
  }
];

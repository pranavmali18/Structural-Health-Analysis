import * as XLSX from 'xlsx';

/**
 * etabsParser.js
 * ──────────────
 * Enhanced ETABS parser supporting XLSX, CSV, and plain-text exports.
 */

// ─── Table-type detection patterns ───────────────────────────────────────────
const TABLE_TYPE_SIGNATURES = [
  {
    type: 'Story Drifts',
    required: ['story'],
    keywords: ['drift']
  },
  {
    type: 'Story Displacements',
    required: ['story'],
    keywords: ['ux', 'uy']
  },
  {
    type: 'Joint Displacements',
    required: ['joint'],
    keywords: ['u1', 'u2', 'u3', 'ux', 'uy']
  },
  {
    type: 'Story Forces',
    required: ['story'],
    keywords: ['vx', 'vy']
  },
  {
    type: 'Frame Forces',
    required: ['frame'],
    keywords: ['p', 'v2', 'm3']
  },
  {
    type: 'Beam Forces',
    required: ['frame'],
    keywords: ['p', 'v2', 'm3']
  },
  {
    type: 'Column Forces',
    required: ['frame'],
    keywords: ['p', 'v2', 'm3']
  },
  {
    type: 'Base Reactions',
    required: ['outputcase'],
    keywords: ['fx', 'fy', 'fz']
  },
  {
    type: 'Modal Periods',
    required: ['mode'],
    keywords: ['period']
  },
  {
    type: 'Modal Direction Factors',
    required: ['mode'],
    keywords: ['period', 'ux', 'uy', 'uz', 'rz']
  },
  {
    type: 'Modal Participating Mass Ratios',
    required: ['mode'],
    keywords: ['sumux', 'sumuy']
  }
];

const COLUMN_ALIASES = {
  // Story / element identifiers
  'story':        'story',
  'level':        'story',
  'joint':        'joint',
  'point':        'joint',
  'frame':        'frame',
  'beam':         'frame',
  'column':       'frame',
  'element':      'frame',

  // Load case
  'outputcase':   'outputCase',
  'loadcase':     'outputCase',
  'loadcomb':     'outputCase',
  'case':         'outputCase',
  'casetype':     'caseType',
  'steptype':     'stepType',
  'stepnum':      'stepNum',
  'step':         'stepNum',

  // Displacements & Rotations
  'ux':           'ux',
  'uy':           'uy',
  'uz':           'uz',
  'u1':           'ux',
  'u2':           'uy',
  'u3':           'uz',
  'rx':           'rx',
  'ry':           'ry',
  'rz':           'rz',
  'r1':           'rx',
  'r2':           'ry',
  'r3':           'rz',

  // Story drift
  'drift':        'driftX',
  'driftx':       'driftX',
  'drifty':       'driftY',
  'direction':    'direction',

  // Story forces
  'vx':           'vx',
  'vy':           'vy',
  't':            'torqueT',
  'mx':           'mx',
  'my':           'my',

  // Frame / Member forces
  'p':            'axialP',
  'axial':        'axialP',
  'axialforce':   'axialP',
  'v2':           'shearV2',
  'v3':           'shearV3',
  'shear':        'shearV2',
  'shearv2':      'shearV2',
  'shearv3':      'shearV3',
  'torque':       'torqueT',
  'm2':           'momentM2',
  'm3':           'momentM3',
  'moment':       'momentM3',
  'bendingmoment':'momentM3',

  // Base reactions
  'fx':           'fx',
  'fy':           'fy',
  'fz':           'fz',

  // Modal
  'mode':         'mode',
  'period':       'period',
  'frequency':    'frequency',
  'freq':         'frequency',
  'circfreq':     'circFreq',
  'eigenvalue':   'eigenvalue',
  'modalmassx':   'modalMassUx',
  'modalmassy':   'modalMassUy',
  'modalmassu':   'modalMassUz',
  'sumux':        'sumUx',
  'sumuy':        'sumUy',
  'sumuz':        'sumUz'
};

function normalizeHeaderKey(raw) {
  return raw
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()
    .trim();
}

function safeNum(val) {
  if (val === null || val === undefined || val === '') return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function safeStr(val) {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  return s === '' ? null : s;
}

// Known units keywords to identify & skip ETABS units row
const UNITS_KEYWORDS = new Set(['sec', 'mm', 'm', 'kn', 'knm', 'kn-m', 'rad', 'mpa', 'n/mm2', '%', 'in', 'ft', 'lbs', 'cyc/sec', 'rad/sec']);

function isUnitsRow(row) {
  const values = row.map(c => String(c).trim().toLowerCase()).filter(c => c !== '');
  if (values.length === 0) return false;
  return values.every(v => UNITS_KEYWORDS.has(v) || UNITS_KEYWORDS.has(v.replace(/[^a-z0-9]/g, '')));
}

function parseTextLines(buffer) {
  const text = buffer.toString('utf-8');
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const rawRows = [];

  for (const line of lines) {
    let cols = [];
    if (line.includes(',')) {
      cols = line.split(',');
    } else if (line.includes('\t')) {
      cols = line.split('\t');
    } else if (line.includes(';')) {
      cols = line.split(';');
    } else {
      cols = line.split(/\s+/);
    }
    rawRows.push(cols.map(c => c.trim().replace(/^"|"$/g, '')));
  }
  return rawRows;
}

export function parseETABSFile(buffer, originalName) {
  let rawRows = [];

  // ── Step 1: Read workbook or text fallback ────────────────────────────────
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer', raw: false });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  } catch (err) {
    // ignore, try text parse fallback
  }

  if (!rawRows || rawRows.length < 2) {
    rawRows = parseTextLines(buffer);
  }

  if (!rawRows || rawRows.length < 2) {
    return {
      tableType: 'Unknown',
      detectedColumns: [],
      rawHeaders: [],
      rows: [],
      validationErrors: ['File contains no data rows (minimum 2 rows required including header).'],
      validationWarnings: [],
      isValid: false
    };
  }

  // ── Step 2: Extract Table Title & Header Row ──────────────────────────────
  let titleFromPrefix = null;
  let headerRowIndex = -1;

  for (let i = 0; i < Math.min(5, rawRows.length); i++) {
    const rowStr = rawRows[i].join(' ').trim();
    if (/^TABLE:\s*/i.test(rowStr) || (rawRows[i][0] && /^TABLE:\s*/i.test(rawRows[i][0]))) {
      const firstCell = rawRows[i][0] || rowStr;
      titleFromPrefix = firstCell.replace(/^TABLE:\s*/i, '').replace(/,/g, '').trim();
    }
    const nonEmpty = rawRows[i].filter(c => c !== '' && c !== null && c !== undefined && !/^TABLE:\s*/i.test(String(c)));
    if (nonEmpty.length >= 3 && headerRowIndex === -1) {
      headerRowIndex = i;
    }
  }

  if (headerRowIndex === -1) {
    return {
      tableType: titleFromPrefix || 'Unknown',
      detectedColumns: [],
      rawHeaders: [],
      rows: [],
      validationErrors: ['Could not detect a valid header row with column names.'],
      validationWarnings: [],
      isValid: false
    };
  }

  const rawHeaders = rawRows[headerRowIndex].map(h => String(h).trim()).filter(h => h !== '');
  const normalizedKeys = rawHeaders.map(normalizeHeaderKey);
  const detectedColumns = rawHeaders;

  // ── Step 3: Detect Table Type ─────────────────────────────────────────────
  let tableType = titleFromPrefix || 'Generic ETABS Data';
  let bestScore = 0;

  if (!titleFromPrefix) {
    for (const sig of TABLE_TYPE_SIGNATURES) {
      const hasRequired = sig.required.every(r =>
        normalizedKeys.some(k => k === r || k.includes(r))
      );
      const keywordMatches = sig.keywords.filter(kw =>
        normalizedKeys.some(k => k === kw || k.includes(kw))
      ).length;

      if (hasRequired && keywordMatches > bestScore) {
        bestScore = keywordMatches;
        tableType = sig.type;
      }
    }
  }

  // ── Step 4: Validate ──────────────────────────────────────────────────────
  const validationErrors = [];
  const validationWarnings = [];

  if (rawHeaders.length < 2) {
    validationErrors.push('Too few columns detected. Ensure you are exporting a standard ETABS analysis table.');
  }

  // ── Step 5: Map Data Rows (filtering units row) ───────────────────────────
  const dataRows = rawRows.slice(headerRowIndex + 1);
  const rows = [];

  for (const rawRow of dataRows) {
    if (!rawRow || rawRow.every(c => c === '' || c === null || c === undefined)) continue;

    // Skip units row if present
    if (isUnitsRow(rawRow)) continue;

    const canonical = {};
    const rawData = {};

    rawHeaders.forEach((header, colIdx) => {
      const nk = normalizedKeys[colIdx];
      const cellValue = rawRow[colIdx];
      const alias = COLUMN_ALIASES[nk];

      if (alias) {
        const numericFields = [
          'ux','uy','uz','rx','ry','rz',
          'driftX','driftY','vx','vy','t','mx','my',
          'axialP','shearV2','shearV3','torqueT','momentM2','momentM3',
          'fx','fy','fz','mode','period','frequency','circFreq','eigenvalue',
          'modalMassUx','modalMassUy','modalMassUz','sumUx','sumUy','sumUz',
          'stepNum'
        ];
        canonical[alias] = numericFields.includes(alias) ? safeNum(cellValue) : safeStr(cellValue);
      } else {
        rawData[header] = cellValue !== '' ? cellValue : null;
      }
    });

    if (Object.values(canonical).some(v => v !== null && v !== undefined)) {
      rows.push({ ...canonical, rawData });
    }
  }

  if (rows.length === 0) {
    validationErrors.push('No valid data rows could be parsed from the file. Check that data rows follow immediately after the header row.');
  }

  const isValid = validationErrors.length === 0;

  return {
    tableType,
    detectedColumns,
    rawHeaders,
    rows,
    validationErrors,
    validationWarnings,
    isValid
  };
}

/**
 * computeETABSFeatures(results)
 *
 * Feature engineering layer — converts raw ETABS analysis rows into
 * meaningful scalar features for use in the AI risk model.
 * Returns null for features that cannot be computed from available data.
 *
 * @param {object[]} results - ETABSAnalysisResult documents
 * @returns {object} etabsFeatures
 */
export function computeETABSFeatures(results) {
  const features = {
    maxStoryDriftX:         null,
    maxStoryDriftY:         null,
    driftConcentrationRatio: null,
    maxDisplacementUx:      null,
    maxDisplacementUy:      null,
    maxDisplacementUz:      null,
    maxAxialForce:          null,
    maxBendingMomentM3:     null,
    maxShearV2:             null,
    maxStoryShearVx:        null,
    maxBaseReactionFz:      null,
    modalPeriod1:           null,
    modalPeriod2:           null,
    sumModalMassUx:         null,
    sumModalMassUy:         null
  };

  if (!results || results.length === 0) return features;

  // Drift features
  const driftRows = results.filter(r => r.tableType === 'Story Drifts' && r.driftX !== null);
  if (driftRows.length > 0) {
    const driftsX = driftRows.map(r => r.driftX).filter(v => v !== null);
    const driftsY = driftRows.map(r => r.driftY).filter(v => v !== null);
    if (driftsX.length > 0) {
      features.maxStoryDriftX = Math.max(...driftsX);
      const meanDrift = driftsX.reduce((a,b) => a+b, 0) / driftsX.length;
      features.driftConcentrationRatio = meanDrift > 0 ? features.maxStoryDriftX / meanDrift : null;
    }
    if (driftsY.length > 0) features.maxStoryDriftY = Math.max(...driftsY);
  }

  // Displacement features
  const dispRows = results.filter(r =>
    (r.tableType === 'Story Displacements' || r.tableType === 'Joint Displacements' || r.tableType === 'Modal Direction Factors') &&
    (r.ux !== null || r.uy !== null || r.uz !== null)
  );
  if (dispRows.length > 0) {
    const uxVals = dispRows.map(r => r.ux).filter(v => v !== null);
    const uyVals = dispRows.map(r => r.uy).filter(v => v !== null);
    const uzVals = dispRows.map(r => r.uz).filter(v => v !== null);
    if (uxVals.length > 0) features.maxDisplacementUx = Math.max(...uxVals.map(Math.abs));
    if (uyVals.length > 0) features.maxDisplacementUy = Math.max(...uyVals.map(Math.abs));
    if (uzVals.length > 0) features.maxDisplacementUz = Math.max(...uzVals.map(Math.abs));
  }

  // Frame forces features
  const frameRows = results.filter(r =>
    ['Frame Forces','Beam Forces','Column Forces'].includes(r.tableType)
  );
  if (frameRows.length > 0) {
    const axialVals = frameRows.map(r => r.axialP).filter(v => v !== null);
    const m3Vals    = frameRows.map(r => r.momentM3).filter(v => v !== null);
    const v2Vals    = frameRows.map(r => r.shearV2).filter(v => v !== null);
    if (axialVals.length > 0) features.maxAxialForce = Math.max(...axialVals.map(Math.abs));
    if (m3Vals.length > 0) features.maxBendingMomentM3 = Math.max(...m3Vals.map(Math.abs));
    if (v2Vals.length > 0) features.maxShearV2 = Math.max(...v2Vals.map(Math.abs));
  }

  // Story shear
  const storyForceRows = results.filter(r => r.tableType === 'Story Forces' && r.vx !== null);
  if (storyForceRows.length > 0) {
    features.maxStoryShearVx = Math.max(...storyForceRows.map(r => Math.abs(r.vx)));
  }

  // Base reactions
  const baseRows = results.filter(r => r.tableType === 'Base Reactions' && r.fz !== null);
  if (baseRows.length > 0) {
    features.maxBaseReactionFz = Math.max(...baseRows.map(r => Math.abs(r.fz)));
  }

  // Modal
  const modalRows = results
    .filter(r => (r.tableType === 'Modal Periods' || r.tableType === 'Modal Direction Factors') && r.period !== null)
    .sort((a, b) => (a.mode || 0) - (b.mode || 0));
  if (modalRows.length >= 1) features.modalPeriod1 = modalRows[0].period;
  if (modalRows.length >= 2) features.modalPeriod2 = modalRows[1].period;

  // Modal mass participation
  const mpmRows = results.filter(r => r.tableType === 'Modal Participating Mass Ratios');
  if (mpmRows.length > 0) {
    const lastRow = mpmRows[mpmRows.length - 1];
    if (lastRow.sumUx !== null) features.sumModalMassUx = lastRow.sumUx;
    if (lastRow.sumUy !== null) features.sumModalMassUy = lastRow.sumUy;
  }

  return features;
}

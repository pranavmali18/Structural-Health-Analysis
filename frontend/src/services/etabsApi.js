import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Upload an ETABS XLSX/CSV file for a given structure.
 * Returns { importId, tableType, detectedColumns, rowCount, preview, validationErrors, ... }
 */
export async function uploadETABSFile(structureId, file, onUploadProgress) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('structureId', structureId);

  const res = await axios.post(`${BASE_URL}/etabs/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  });
  return res.data;
}

/**
 * Validate an ETABS file without saving to DB.
 * Returns preview + validation result.
 */
export async function validateETABSFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post(`${BASE_URL}/etabs/validate`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

/**
 * Get all import sessions for a structure.
 */
export async function getETABSImports(structureId) {
  const res = await axios.get(`${BASE_URL}/etabs/imports/${structureId}`);
  return res.data;
}

/**
 * Get paginated analysis rows for one import.
 */
export async function getETABSResults(importId, page = 1, limit = 100) {
  const res = await axios.get(`${BASE_URL}/etabs/results/${importId}`, {
    params: { page, limit }
  });
  return res.data;
}

/**
 * Get aggregated summary + AI feature vector for a structure.
 */
export async function getETABSSummary(structureId) {
  const res = await axios.get(`${BASE_URL}/etabs/summary/${structureId}`);
  return res.data;
}

/**
 * Delete an import session and its result rows.
 */
export async function deleteETABSImport(importId) {
  const res = await axios.delete(`${BASE_URL}/etabs/imports/${importId}`);
  return res.data;
}

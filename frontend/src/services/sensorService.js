import API from './api';

export const getLatestReadingAPI = async (structureId) => {
  try {
    const res = await API.get(`/sensors/latest/${structureId}`);
    return res.data;
  } catch (error) {
    console.warn('[Sensor Service Warning]:', error);
    return null;
  }
};

export const getSensorHistoryAPI = async (structureId) => {
  try {
    const res = await API.get(`/sensors/history/${structureId}`);
    return res.data;
  } catch (error) {
    console.warn('[Sensor Service Warning]:', error);
    return null;
  }
};

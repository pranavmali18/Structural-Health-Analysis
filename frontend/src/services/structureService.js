import API from './api';

export const getStructuresAPI = async () => {
  try {
    const res = await API.get('/structures');
    return res.data;
  } catch (error) {
    console.warn('[Structure Service Warning] Failed to reach backend, falling back to local state:', error);
    return null;
  }
};

export const createStructureAPI = async (structureData) => {
  try {
    const res = await API.post('/structures', structureData);
    return res.data;
  } catch (error) {
    console.error('[Structure Service Error]:', error);
    throw error;
  }
};

export const updateStructureAPI = async (id, updateData) => {
  try {
    const res = await API.put(`/structures/${id}`, updateData);
    return res.data;
  } catch (error) {
    console.error('[Structure Service Error]:', error);
    throw error;
  }
};

export const deleteStructureAPI = async (id) => {
  try {
    const res = await API.delete(`/structures/${id}`);
    return res.data;
  } catch (error) {
    console.error('[Structure Service Error]:', error);
    throw error;
  }
};

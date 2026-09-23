import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_STRUCTURES, MOCK_SENSOR_READINGS, MOCK_CHART_SERIES, MOCK_ALERTS, MOCK_ANOMALIES } from '../services/mockData';
import API from '../services/api';

const MonitoringContext = createContext();

export function MonitoringProvider({ children }) {
  const [structures, setStructures] = useState(() => {
    try {
      const saved = localStorage.getItem('shm_structures');
      return saved ? JSON.parse(saved) : MOCK_STRUCTURES;
    } catch {
      return MOCK_STRUCTURES;
    }
  });

  const [currentStructure, setCurrentStructure] = useState(structures[0] || MOCK_STRUCTURES[0]);
  const [sensorReadings, setSensorReadings] = useState(MOCK_SENSOR_READINGS);
  const [chartData, setChartData] = useState(MOCK_CHART_SERIES);
  
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('shm_alerts');
      return saved ? JSON.parse(saved) : MOCK_ALERTS;
    } catch {
      return MOCK_ALERTS;
    }
  });

  const [anomalies, setAnomalies] = useState(MOCK_ANOMALIES);

  // Sync structures with local storage
  useEffect(() => {
    try {
      localStorage.setItem('shm_structures', JSON.stringify(structures));
    } catch (e) {
      console.warn('Failed to save structures to localStorage', e);
    }
  }, [structures]);

  // Sync alerts with local storage
  useEffect(() => {
    try {
      localStorage.setItem('shm_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.warn('Failed to save alerts to localStorage', e);
    }
  }, [alerts]);

  const selectStructure = (struct) => {
    setCurrentStructure(struct);
  };

  const addStructure = async (newStructData) => {
    const formattedStruct = {
      id: `str-${Date.now().toString().slice(-4)}`,
      structureId: `str-${Date.now().toString().slice(-4)}`,
      name: newStructData.name,
      type: newStructData.type || 'Building',
      location: newStructData.location || 'Site Zone B',
      constructionYear: newStructData.constructionYear || 2020,
      yearBuilt: newStructData.constructionYear || 2020,
      material: newStructData.material || 'Reinforced Concrete',
      length: newStructData.length || 100,
      width: newStructData.width || 50,
      height: newStructData.height || 30,
      description: newStructData.description || 'Newly registered structural asset under continuous monitoring.',
      status: 'Healthy',
      riskScore: 18,
      riskLevel: 'LOW'
    };

    try {
      const response = await API.post('/structures', formattedStruct);
      if (response.data && response.data.data) {
        const savedApiStruct = response.data.data;
        formattedStruct.id = savedApiStruct._id || savedApiStruct.id || formattedStruct.id;
      }
    } catch (err) {
      console.warn('[Structure API Warning] Backend API unreachable, persisting structure to local state.', err.message);
    }

    setStructures(prev => [formattedStruct, ...prev]);
    setCurrentStructure(formattedStruct);
    return formattedStruct;
  };

  const deleteStructure = async (structureId) => {
    try {
      await API.delete(`/structures/${structureId}`);
    } catch (err) {
      console.warn('[Structure Delete API Warning] Backend API delete request failed, removing from local state.', err.message);
    }

    setStructures(prev => {
      const updated = prev.filter(s => (s.id || s._id) !== structureId);
      if (currentStructure && (currentStructure.id || currentStructure._id) === structureId) {
        setCurrentStructure(updated[0] || null);
      }
      return updated;
    });
  };

  const resolveAlert = async (targetId) => {
    if (!targetId) return;

    // Try backend API
    try {
      await API.put(`/alerts/${targetId}/resolve`);
    } catch (err) {
      console.warn('[Alert Resolve API Warning] Backend API resolve failed, updating local state.', err.message);
    }

    setAlerts(prev => prev.map(a => {
      const match = (a.id === targetId || a._id === targetId || String(a.id) === String(targetId) || String(a._id) === String(targetId));
      return match ? { ...a, status: 'RESOLVED' } : a;
    }));
  };

  const acknowledgeAlert = async (targetId) => {
    if (!targetId) return;

    try {
      await API.put(`/alerts/${targetId}/acknowledge`);
    } catch (err) {
      console.warn('[Alert Acknowledge API Warning] Backend API acknowledge failed, updating local state.', err.message);
    }

    setAlerts(prev => prev.map(a => {
      const match = (a.id === targetId || a._id === targetId || String(a.id) === String(targetId) || String(a._id) === String(targetId));
      return match ? { ...a, status: 'ACKNOWLEDGED' } : a;
    }));
  };

  return (
    <MonitoringContext.Provider value={{
      structures,
      currentStructure,
      selectStructure,
      addStructure,
      deleteStructure,
      sensorReadings,
      chartData,
      alerts,
      anomalies,
      resolveAlert,
      acknowledgeAlert
    }}>
      {children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring() {
  return useContext(MonitoringContext);
}

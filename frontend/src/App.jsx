import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MonitoringProvider, useMonitoring } from './context/MonitoringContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Structures from './pages/Structures';
import StructureDetails from './pages/StructureDetails';
import Monitoring from './pages/Monitoring';
import AnomalyDetection from './pages/AnomalyDetection';
import RiskAssessment from './pages/RiskAssessment';
import CrackDetection from './pages/CrackDetection';
import Inspections from './pages/Inspections';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import ETABSImport from './pages/ETABSImport';

function AppLayout() {
  const {
    structures,
    currentStructure,
    selectStructure,
    sensorReadings,
    chartData,
    alerts,
    anomalies,
    resolveAlert,
    acknowledgeAlert
  } = useMonitoring();

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        currentStructure={currentStructure}
        structures={structures}
        onSelectStructure={selectStructure}
        unreadAlertsCount={activeAlertsCount}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  currentStructure={currentStructure}
                  structures={structures}
                  sensorReadings={sensorReadings}
                  chartData={chartData}
                  alerts={alerts}
                />
              }
            />
            <Route
              path="/structures"
              element={
                <Structures
                  structures={structures}
                  onSelectStructure={selectStructure}
                />
              }
            />
            <Route
              path="/structure-details"
              element={
                <StructureDetails
                  currentStructure={currentStructure}
                  sensorReadings={sensorReadings}
                />
              }
            />
            <Route
              path="/monitoring"
              element={
                <Monitoring
                  currentStructure={currentStructure}
                  sensorReadings={sensorReadings}
                  chartData={chartData}
                />
              }
            />
            <Route
              path="/anomalies"
              element={<AnomalyDetection anomalies={anomalies} />}
            />
            <Route
              path="/risk"
              element={
                <RiskAssessment
                  currentStructure={currentStructure}
                  structures={structures}
                />
              }
            />
            <Route path="/crack-detection" element={<CrackDetection />} />
            <Route
              path="/inspections"
              element={
                <Inspections
                  currentStructure={currentStructure}
                  structures={structures}
                />
              }
            />
            <Route
              path="/alerts"
              element={
                <Alerts
                  alerts={alerts}
                  onResolveAlert={resolveAlert}
                  onAcknowledgeAlert={acknowledgeAlert}
                />
              }
            />
            <Route
              path="/reports"
              element={
                <Reports
                  currentStructure={currentStructure}
                  structures={structures}
                />
              }
            />
            <Route
              path="/etabs-import"
              element={
                <ETABSImport
                  structures={structures}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MonitoringProvider>
          <AppLayout />
        </MonitoringProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

import React from 'react';
import StructureDetailsComponent from '../components/structures/StructureDetails';
import SensorCard from '../components/dashboard/SensorCard';
import AcademicDisclaimer from '../components/common/AcademicDisclaimer';

export default function StructureDetailsPage({ currentStructure, sensorReadings }) {
  const selected = currentStructure;

  return (
    <div className="space-y-6">
      <AcademicDisclaimer />
      <StructureDetailsComponent structure={selected} />

      <h3 className="font-bold text-slate-100 text-sm">Telemetry Sensor Matrix</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SensorCard
          title="Vibration"
          value={sensorReadings.vibration}
          unit="mm/s²"
          status="Normal"
          trend="stable"
          baseline="0.5 - 5.0"
          iconName="vibration"
        />
        <SensorCard
          title="Strain"
          value={sensorReadings.strain}
          unit="με"
          status="Normal"
          trend="up"
          baseline="50 - 500"
          iconName="strain"
        />
        <SensorCard
          title="Displacement"
          value={sensorReadings.displacement}
          unit="mm"
          status="Normal"
          trend="down"
          baseline="0.1 - 4.0"
          iconName="displacement"
        />
      </div>
    </div>
  );
}

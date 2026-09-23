import React from 'react';
import AcademicDisclaimer from '../components/common/AcademicDisclaimer';
import ReportPreview from '../components/reports/ReportPreview';
import ReportButton from '../components/reports/ReportButton';
import { FileSpreadsheet } from 'lucide-react';

export default function Reports({ currentStructure, structures = [] }) {
  const selected = currentStructure || structures[0];

  return (
    <div className="space-y-6">
      <AcademicDisclaimer />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
            PDF Engineering Health Report Generator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal academic and professional structural inspection reports with sensor statistics and AI assessments
          </p>
        </div>

        {selected && (
          <ReportButton
            structureName={selected.name}
            structureId={selected.id || selected._id}
            structure={selected}
          />
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <ReportPreview structure={selected} />
      </div>
    </div>
  );
}

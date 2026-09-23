import React, { useState } from 'react';
import AcademicDisclaimer from '../components/common/AcademicDisclaimer';
import ImageUploader from '../components/crack/ImageUploader';
import CrackPreview from '../components/crack/CrackPreview';
import CrackResult from '../components/crack/CrackResult';
import { Scan, Eye, Cpu, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function CrackDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageSelected = (file) => {
    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        crackDetected: true,
        confidence: 0.942,
        severity: 'Moderate',
        crackRegion: 'Center Slab Joint - Diagonal Shear Pattern',
        recommendation: 'Visual diagonal shear crack detected. Recommend epoxy injection filling & non-destructive ultrasonic testing within 14 days.'
      });
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <AcademicDisclaimer />

      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
          <Scan className="w-6 h-6 text-cyan-400" />
          AI Computer Vision Concrete Crack Analyzer
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload surface photos of concrete beams, columns, slabs, or bridge decks for deep learning visual crack detection & severity grading.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <ImageUploader onImageSelected={handleImageSelected} />
          {imagePreviewUrl && (
            <CrackPreview
              imageSrc={imagePreviewUrl}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleRunAnalysis}
            />
          )}
        </div>

        <div>
          {result ? (
            <CrackResult result={result} />
          ) : (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-500 border border-slate-800 space-y-3">
              <Eye className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs font-mono">Upload an inspection image and click "Analyze Surface" to view computer vision results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

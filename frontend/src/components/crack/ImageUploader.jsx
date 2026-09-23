import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ onImageSelected }) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onImageSelected) {
      onImageSelected(file);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files[0] && onImageSelected) {
          onImageSelected(e.dataTransfer.files[0]);
        }
      }}
      className={`glass-panel border-2 border-dashed p-8 rounded-2xl text-center cursor-pointer transition-all ${
        dragOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-700/80 hover:border-cyan-500/50'
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="crack-file-input"
      />
      <label htmlFor="crack-file-input" className="cursor-pointer block space-y-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-200">Upload Concrete Surface Image</p>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Drag & drop or click to select (Wall, Beam, Column, Slab, Bridge Deck)
          </p>
        </div>
        <span className="inline-block px-3 py-1 bg-slate-800 text-cyan-400 text-xs font-mono rounded-lg border border-slate-700">
          Supports JPG, PNG, WEBP (Max 10MB)
        </span>
      </label>
    </div>
  );
}

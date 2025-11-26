import React, { useState, useRef } from 'react';
import { ReferenceStats } from '../types';
import { parseReferenceData, parseExcelData } from '../utils';

interface DataIngestProps {
  onDataLoaded: (map: Map<string, string>) => void;
  stats: ReferenceStats | null;
}

type InputMode = 'file' | 'paste';

const DataIngest: React.FC<DataIngestProps> = ({ onDataLoaded, stats }) => {
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<InputMode>('file');
  const [pasteContent, setPasteContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (!result) return;

      if (isExcel && result instanceof ArrayBuffer) {
        try {
          const map = parseExcelData(result);
          onDataLoaded(map);
        } catch (err) {
          console.error(err);
          alert("Failed to parse Excel file. Please ensure it is a valid format.");
        }
      } else if (typeof result === 'string') {
        const map = parseReferenceData(result);
        onDataLoaded(map);
      }
    };

    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handlePasteProcess = () => {
    if (!pasteContent.trim()) return;
    const map = parseReferenceData(pasteContent);
    onDataLoaded(map);
  };

  const loadSampleData = () => {
    const sample = `SPC001,ASIN001
SPC002,ASIN002
SPC003,ASIN003`;
    const map = parseReferenceData(sample);
    onDataLoaded(map);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md duration-300">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Reference Data</h2>
            <p className="text-slate-500 text-sm mt-1">Upload your SPC to ASIN mapping (Excel or CSV)</p>
          </div>
          
          {stats ? (
            <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold">{stats.uniqueKeys.toLocaleString()} codes ready</span>
            </div>
          ) : (
            <button 
              onClick={loadSampleData}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-full transition-colors border border-transparent hover:border-indigo-100"
            >
              Load Sample
            </button>
          )}
        </div>

        {/* Minimal Tabs */}
        <div className="flex space-x-6 border-b border-slate-100 mb-6">
          <button
            onClick={() => setMode('file')}
            className={`pb-3 text-sm font-medium transition-all relative ${
              mode === 'file' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            File Upload
            {mode === 'file' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
          <button
            onClick={() => setMode('paste')}
            className={`pb-3 text-sm font-medium transition-all relative ${
              mode === 'paste' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Direct Input
            {mode === 'paste' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
        </div>

        {mode === 'file' ? (
          <div 
            className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
              dragActive 
                ? "border-indigo-500 bg-indigo-50/30 scale-[1.01]" 
                : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".csv,.txt,.tsv,.xlsx,.xls"
              onChange={handleChange} 
            />
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`p-4 rounded-full transition-colors ${dragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <div>
                <p className="text-base font-medium text-slate-700">
                  Drop your file here, or <span className="text-indigo-600 hover:underline">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Supports CSV, Excel, or Text (Column A: SPC, Column B: ASIN)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <textarea
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="Paste data here...&#10;SPC001, ASIN001&#10;SPC002, ASIN002"
              className="w-full h-40 p-4 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400"
            />
            <div className="flex justify-end">
              <button
                onClick={handlePasteProcess}
                disabled={!pasteContent.trim()}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transform duration-200"
              >
                Process Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataIngest;
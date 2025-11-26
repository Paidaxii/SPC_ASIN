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
    <div className="p-8 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">1. Upload Reference Data</h2>
            <p className="text-slate-500 mt-1 text-sm">Upload your master list (SPC to ASIN)</p>
          </div>
        </div>

        {stats ? (
          <div className="flex items-center gap-3 px-5 py-2.5 bg-green-50 text-green-700 rounded-full border border-green-100 shadow-sm animate-fade-in">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <span className="font-semibold">{stats.uniqueKeys.toLocaleString()} codes loaded</span>
          </div>
        ) : (
          <button 
            onClick={loadSampleData}
            className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-full transition-colors"
          >
            Use Sample Data
          </button>
        )}
      </div>

      <div className="bg-slate-50 p-1.5 rounded-2xl inline-flex w-full md:w-auto mb-6 shadow-inner">
        <button
          onClick={() => setMode('file')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            mode === 'file'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          File Upload
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            mode === 'paste'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Paste Text
        </button>
      </div>

      {mode === 'file' ? (
        <div 
          className={`relative cursor-pointer border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ${
            dragActive 
              ? "border-blue-500 bg-blue-50/50 scale-[1.01]" 
              : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
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
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${dragActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-700">
                Click to upload or drag & drop
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Supported formats: .csv, .xlsx, .txt
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="relative">
            <textarea
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="Example:&#10;SPC001, ASIN123&#10;SPC002, ASIN456"
              className="w-full h-48 p-5 text-sm font-mono bg-white border border-slate-300 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none shadow-sm placeholder:text-slate-300"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handlePasteProcess}
              disabled={!pasteContent.trim()}
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transform duration-200"
            >
              Process Reference Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataIngest;
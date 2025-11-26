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
    const sample = `A1,B1_ASIN
A2,B2_ASIN
A1,B1_ASIN_UPDATED
SPC001,ASIN001
SPC002,ASIN002`;
    const map = parseReferenceData(sample);
    onDataLoaded(map);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6"></path><path d="M9 15h6"></path></svg>
          1. Reference Data (SPC → ASIN)
        </h2>
        {stats && (
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Ready: {stats.uniqueKeys.toLocaleString()} codes
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 text-sm border-b border-slate-100 pb-2">
        <button 
          onClick={() => setMode('file')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${mode === 'file' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          Upload File
        </button>
        <button 
          onClick={() => setMode('paste')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${mode === 'paste' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
          Paste Text (Feishu/Excel)
        </button>
      </div>

      {mode === 'file' ? (
        <div 
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:bg-slate-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".csv,.txt,.tsv,.xlsx,.xls"
            onChange={handleChange} 
          />
          
          <div className="space-y-2">
            <div className="flex justify-center text-blue-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <p className="text-sm text-slate-600">
              Drag & drop your file here, or{' '}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 font-semibold hover:text-blue-700 underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-slate-400">
              Supports CSV, TXT, TSV, XLSX, XLS. (Col A = SPC, Col B = ASIN)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            placeholder="Go to Feishu/Excel, select your data (A & B columns), copy (Ctrl+C), and paste here..."
            className="w-full h-32 p-3 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handlePasteProcess}
            disabled={!pasteContent.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Process Pasted Data
          </button>
        </div>
      )}

      {!stats && (
        <div className="mt-4 text-center">
          <button 
            onClick={loadSampleData}
            className="text-xs text-slate-500 hover:text-blue-600 underline"
          >
            Load sample data for testing
          </button>
        </div>
      )}
    </div>
  );
};

export default DataIngest;
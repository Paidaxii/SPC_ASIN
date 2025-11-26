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
    <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              Reference Data
            </h2>
            <p className="text-sm text-gray-500 mt-1">Upload your SPC to ASIN mapping source</p>
          </div>
          
          {stats ? (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100 animate-pulse-once">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-semibold">Ready: {stats.uniqueKeys.toLocaleString()} codes</span>
             </div>
          ) : (
            <button 
              onClick={loadSampleData}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors"
            >
              Load Sample Data
            </button>
          )}
        </div>

        {/* Custom Tabs */}
        <div className="bg-gray-100/70 p-1 rounded-lg inline-flex mb-6 w-full sm:w-auto">
          <button 
            onClick={() => setMode('file')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              mode === 'file' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Upload File
          </button>
          <button 
            onClick={() => setMode('paste')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              mode === 'paste' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            Paste Text
          </button>
        </div>

        {mode === 'file' ? (
          <div 
            className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ease-in-out ${
              dragActive 
                ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]" 
                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
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
            
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className={`p-3 rounded-full transition-colors ${dragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-indigo-600 hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  CSV, Excel, or Text files (Col A: SPC, Col B: ASIN)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder="Paste your data here..."
                className="w-full h-32 p-4 text-sm font-mono bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-gray-400"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none bg-gray-50 px-1">
                Col A & B
              </div>
            </div>
            <button
              onClick={handlePasteProcess}
              disabled={!pasteContent.trim()}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            >
              Process Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataIngest;
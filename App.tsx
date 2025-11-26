import React, { useState } from 'react';
import DataIngest from './components/DataIngest';
import QueryZone from './components/QueryZone';
import { ReferenceStats } from './types';

const App: React.FC = () => {
  const [referenceMap, setReferenceMap] = useState<Map<string, string> | null>(null);
  const [stats, setStats] = useState<ReferenceStats | null>(null);

  const handleDataLoaded = (map: Map<string, string>) => {
    setReferenceMap(map);
    setStats({
      totalRows: map.size, 
      uniqueKeys: map.size,
      lastUpdated: new Date()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">SPC-ASIN Matcher</h1>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            v1.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        
        {/* Step 1: Data Ingest */}
        <section className="animate-fade-in-up">
          <DataIngest onDataLoaded={handleDataLoaded} stats={stats} />
        </section>

        {/* Step 2 & 3: Query & Result */}
        <section className="flex-1 min-h-[600px] animate-fade-in-up delay-100">
          <QueryZone referenceMap={referenceMap} />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400 font-medium">
            Processed securely in your browser. No data leaves your device.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200 transform rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">SPC-ASIN Matcher</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">Beta</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
        
        {/* Step 1: Data Ingest */}
        <section className="animate-fade-in-up">
          <DataIngest onDataLoaded={handleDataLoaded} stats={stats} />
        </section>

        {/* Step 2 & 3: Query & Result */}
        <section className="flex-1 min-h-[500px] animate-fade-in-up delay-100">
          <QueryZone referenceMap={referenceMap} />
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Processed locally in your browser
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
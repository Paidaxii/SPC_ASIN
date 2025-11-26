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
      totalRows: map.size, // Note: Map size handles uniqueness automatically
      uniqueKeys: map.size,
      lastUpdated: new Date()
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">SPC-ASIN Matcher</h1>
          </div>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            Help & Documentation
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        
        {/* Step 1: Data Ingest */}
        <DataIngest onDataLoaded={handleDataLoaded} stats={stats} />

        {/* Step 2 & 3: Query & Result */}
        <div className="flex-1 min-h-[500px]">
          <QueryZone referenceMap={referenceMap} />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          Processed locally in your browser. No data is sent to any server.
        </div>
      </footer>
    </div>
  );
};

export default App;
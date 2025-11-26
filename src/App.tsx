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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Hero Section with Blue Gradient */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 pb-32 shadow-lg">
        <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <span className="text-xl font-bold tracking-tight">SPC-ASIN Matcher</span>
          </div>
          <div className="hidden md:flex gap-4">
             <a href="#" className="text-sm font-medium text-blue-50 hover:text-white transition-colors">Documentation</a>
             <a href="#" className="text-sm font-medium text-blue-50 hover:text-white transition-colors">Support</a>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center md:text-left">
            Bulk Code Converter
          </h1>
          <p className="text-blue-100 text-lg md:max-w-2xl text-center md:text-left leading-relaxed">
            Instantly map your SPC inventory codes to Amazon ASINs with high precision. Secure, local, and fast.
          </p>
        </div>
      </div>

      {/* Main Content - Floating Cards */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12 flex flex-col gap-6">
        
        {/* Step 1: Data Ingest */}
        <section className="animate-fade-in-up shadow-xl shadow-slate-200/50 rounded-3xl bg-white overflow-hidden">
          <DataIngest onDataLoaded={handleDataLoaded} stats={stats} />
        </section>

        {/* Step 2 & 3: Query & Result */}
        <section className="flex-1 min-h-[500px] animate-fade-in-up delay-100">
          <QueryZone referenceMap={referenceMap} />
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} SPC-ASIN Matcher. All processing happens locally in your browser.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
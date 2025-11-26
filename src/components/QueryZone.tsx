import React, { useState, useEffect } from 'react';
import { processQuery } from '../utils';

interface QueryZoneProps {
  referenceMap: Map<string, string> | null;
}

const QueryZone: React.FC<QueryZoneProps> = ({ referenceMap }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<{ found: number; missing: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!referenceMap || !input.trim()) {
      if (!input) {
        setOutput('');
        setStatus(null);
      }
      return;
    }

    const { resultStr, found, missing } = processQuery(input, referenceMap);
    setOutput(resultStr);
    setStatus({ found, missing });
    setCopied(false);
  }, [input, referenceMap]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
             </div>
             <div>
                <h3 className="font-bold text-slate-800 text-sm">2. Input Codes</h3>
             </div>
          </div>
          {input && (
            <button 
               onClick={() => setInput('')}
               className="text-xs font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="flex-1 relative bg-slate-50/50">
            <textarea
            id="input-area"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your list of SPC codes here (one per line)..."
            className="absolute inset-0 w-full h-full p-6 resize-none focus:outline-none bg-transparent font-mono text-sm leading-relaxed text-slate-700 placeholder:text-slate-400"
            spellCheck={false}
            />
        </div>
        <div className="px-6 py-3 bg-white border-t border-slate-100 text-xs font-medium text-slate-400 flex justify-between items-center">
           <span>One code per line</span>
           <span>{input ? input.split(/\r?\n/).filter(line => line.trim() !== '').length : 0} items</span>
        </div>
      </div>

      {/* Output Section */}
      <div className={`flex flex-col h-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border overflow-hidden relative transition-all duration-300 ${status ? 'border-blue-200 ring-4 ring-blue-500/5' : 'border-slate-100'}`}>
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white h-[76px]">
          <div className="flex items-center gap-3">
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${status ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
             </div>
             <div>
                <h3 className="font-bold text-slate-800 text-sm">3. Results</h3>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            {status && (
              <div className="flex items-center text-xs font-bold bg-slate-100 rounded-full px-3 py-1.5 gap-3 animate-fade-in">
                <span className="text-emerald-600">
                    {status.found} Found
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-rose-500">
                    {status.missing} Missing
                </span>
              </div>
            )}
            
            <button
              onClick={handleCopy}
              disabled={!output}
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
                copied 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105" 
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              }`}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Copied
                </>
              ) : (
                'Copy'
              )}
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative bg-slate-50/50">
            <textarea
            id="output-area"
            readOnly
            value={output}
            placeholder="Results will appear here..."
            className={`absolute inset-0 w-full h-full p-6 resize-none focus:outline-none bg-transparent font-mono text-sm leading-relaxed transition-colors ${!referenceMap ? 'text-slate-300' : 'text-slate-800'}`}
            spellCheck={false}
            />
            {!referenceMap && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-white/60 backdrop-blur-[1px]">
                <div className="text-center animate-fade-in-up">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                    <p className="text-slate-500 font-medium">Waiting for Reference Data</p>
                    <p className="text-xs text-slate-400 mt-1">Complete Step 1 first</p>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QueryZone;
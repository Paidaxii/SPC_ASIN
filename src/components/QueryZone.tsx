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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Input Pane */}
      <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-indigo-200 transition-colors duration-300">
        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <label htmlFor="input-area" className="font-semibold text-slate-700 text-sm flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-slate-400"></span>
             Source Codes
          </label>
          {input && (
            <button 
               onClick={() => setInput('')}
               className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex-1 relative">
            <textarea
            id="input-area"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste SPCs here..."
            className="absolute inset-0 w-full h-full p-5 resize-none focus:outline-none focus:bg-indigo-50/5 transition-colors font-mono text-sm leading-relaxed text-slate-700 placeholder:text-slate-300"
            spellCheck={false}
            />
        </div>
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 flex justify-end">
           {input ? input.split(/\r?\n/).filter(line => line.trim() !== '').length : 0} items
        </div>
      </div>

      {/* Output Pane */}
      <div className={`flex flex-col h-full bg-white rounded-2xl shadow-sm border overflow-hidden relative transition-all duration-300 ${status ? 'border-indigo-200 ring-2 ring-indigo-500/5' : 'border-slate-200'}`}>
        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 h-[53px]">
          <label htmlFor="output-area" className="font-semibold text-slate-700 text-sm flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${status ? 'bg-indigo-500' : 'bg-slate-300'}`}></span>
            Mapped ASINs
          </label>
          
          <div className="flex items-center gap-3">
            {status && (
              <div className="flex items-center text-xs font-medium bg-slate-100 rounded-md px-2 py-1 gap-3 animate-fade-in">
                <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {status.found} found
                </span>
                <span className="w-px h-3 bg-slate-300"></span>
                <span className="text-rose-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    {status.missing} missing
                </span>
              </div>
            )}
            
            <button
              onClick={handleCopy}
              disabled={!output}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                copied 
                  ? "bg-emerald-600 text-white shadow-md scale-105" 
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600"
              }`}
            >
              {copied ? 'Copied' : 'Copy Result'}
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative bg-slate-50/30">
            <textarea
            id="output-area"
            readOnly
            value={output}
            placeholder="..."
            className={`absolute inset-0 w-full h-full p-5 resize-none focus:outline-none font-mono text-sm leading-relaxed transition-colors ${!referenceMap ? 'text-slate-300' : 'text-slate-800'}`}
            spellCheck={false}
            />
            {!referenceMap && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-white/60 backdrop-blur-[1px]">
                <div className="text-center max-w-[240px] animate-fade-in-up">
                    <div className="w-12 h-12 bg-slate-100 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                    <p className="text-sm font-medium text-slate-500">Waiting for Data</p>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QueryZone;
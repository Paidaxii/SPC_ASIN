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

  // Auto-process when input or map changes
  useEffect(() => {
    if (!referenceMap || !input.trim()) {
      // Don't clear output immediately if map is missing to prevent flickering during reload,
      // but do clear if input is cleared manually.
      if (!input) {
        setOutput('');
        setStatus(null);
      }
      return;
    }

    const { resultStr, found, missing } = processQuery(input, referenceMap);
    setOutput(resultStr);
    setStatus({ found, missing });
    setCopied(false); // Reset copied state on new result
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
      {/* Input Section */}
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <label htmlFor="input-area" className="font-bold text-slate-700 text-sm flex items-center gap-2">
             2. Input SPCs (One per line)
          </label>
          <button 
             onClick={() => setInput('')}
             className="text-xs text-slate-500 hover:text-red-600 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
          >
            Clear
          </button>
        </div>
        <textarea
          id="input-area"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="A1&#10;A2&#10;SPC..."
          className="flex-1 p-4 w-full resize-none focus:outline-none focus:bg-blue-50/30 transition-colors font-mono text-sm leading-6"
          spellCheck={false}
        />
        <div className="p-2 border-t border-slate-100 text-xs text-slate-400 bg-slate-50 text-right">
           Lines: {input ? input.split(/\r?\n/).length : 0}
        </div>
      </div>

      {/* Output Section */}
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <label htmlFor="output-area" className="font-bold text-slate-700 text-sm flex items-center gap-2">
            3. Result ASINs
          </label>
          
          <div className="flex items-center gap-2">
            {status && (
              <span className="text-xs text-slate-500 mr-2">
                Matched: <span className="font-bold text-green-600">{status.found}</span> / Missing: <span className="font-bold text-red-500">{status.missing}</span>
              </span>
            )}
            <button
              onClick={handleCopy}
              disabled={!output}
              className={`text-xs font-semibold px-4 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                copied 
                  ? "bg-green-600 text-white shadow-md transform scale-105" 
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        </div>
        
        <textarea
          id="output-area"
          readOnly
          value={output}
          placeholder="Result will appear here..."
          className={`flex-1 p-4 w-full resize-none focus:outline-none font-mono text-sm leading-6 ${!referenceMap ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-800'}`}
          spellCheck={false}
        />
        {!referenceMap && (
           <div className="absolute inset-0 top-14 flex items-center justify-center pointer-events-none">
             <div className="bg-white/80 p-4 rounded-lg text-slate-500 text-sm backdrop-blur-sm shadow-sm border border-slate-200">
               Please load Reference Data first
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default QueryZone;
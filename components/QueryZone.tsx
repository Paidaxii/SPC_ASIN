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
      {/* Input Section */}
      <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:border-indigo-200 transition-colors duration-300">
        <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <label htmlFor="input-area" className="font-semibold text-gray-700 text-sm flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
             Input SPCs
          </label>
          {input && (
            <button 
               onClick={() => setInput('')}
               className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
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
            placeholder="Paste codes here (one per line)..."
            className="absolute inset-0 w-full h-full p-5 resize-none focus:outline-none focus:bg-indigo-50/10 transition-colors font-mono text-sm leading-relaxed text-gray-700"
            spellCheck={false}
            />
        </div>
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex justify-end">
           {input ? input.split(/\r?\n/).filter(line => line.trim() !== '').length : 0} lines
        </div>
      </div>

      {/* Output Section */}
      <div className={`flex flex-col h-full bg-white rounded-2xl shadow-sm border overflow-hidden relative transition-all duration-300 ${status ? 'border-indigo-200 ring-2 ring-indigo-500/5' : 'border-gray-200'}`}>
        <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 h-[53px]">
          <label htmlFor="output-area" className="font-semibold text-gray-700 text-sm flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            Result ASINs
          </label>
          
          <div className="flex items-center gap-3">
            {status && (
              <div className="flex items-center text-xs font-medium bg-gray-100 rounded-md px-2 py-1 gap-2">
                <span className="text-green-700 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    {status.found}
                </span>
                <span className="w-px h-3 bg-gray-300"></span>
                <span className="text-red-600 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    {status.missing}
                </span>
              </div>
            )}
            
            <button
              onClick={handleCopy}
              disabled={!output}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                copied 
                  ? "bg-green-600 text-white shadow-md scale-105" 
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600"
              }`}
            >
              {copied ? (
                <>Copied!</>
              ) : (
                <>Copy</>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative bg-gray-50/30">
            <textarea
            id="output-area"
            readOnly
            value={output}
            placeholder="..."
            className={`absolute inset-0 w-full h-full p-5 resize-none focus:outline-none font-mono text-sm leading-relaxed ${!referenceMap ? 'text-gray-400' : 'text-gray-800'}`}
            spellCheck={false}
            />
            {!referenceMap && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-white/60 backdrop-blur-[1px]">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center max-w-[240px]">
                    <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Waiting for Data</p>
                    <p className="text-xs text-gray-400 mt-1">Please upload the reference file in the section above.</p>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QueryZone;
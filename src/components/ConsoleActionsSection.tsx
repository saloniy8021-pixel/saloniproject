import React, { useState } from 'react';
import { Play, PlayCircle, OctagonAlert, Cpu, Trash2, Download } from 'lucide-react';

interface ConsoleActionsSectionProps {
  darkMode: boolean;
  logs: string[];
  onRunCurrentStep: () => void;
  onRunAllSteps: () => void;
  onStop: () => void;
  onClearLogs?: () => void;
}

export const ConsoleActionsSection: React.FC<ConsoleActionsSectionProps> = ({
  darkMode,
  logs,
  onRunCurrentStep,
  onRunAllSteps,
  onStop,
  onClearLogs
}) => {
  const [outputTab, setOutputTab] = useState<'preview' | 'diff'>('preview');
  const [useGpu, setUseGpu] = useState(true);

  const handleDownloadLogs = () => {
    const blob = new Blob([logs.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chandrayaan2_registration_log.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const cardBg = darkMode ? 'bg-[#131C31] border-[#1E2A45]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = darkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`grid grid-cols-12 gap-3 p-3 border-t transition-colors ${
      darkMode ? 'bg-[#0B101D] border-[#1E2A45]' : 'bg-slate-50 border-slate-200'
    }`}>
      {/* LOG / CONSOLE (Bottom Left) */}
      <div className={`col-span-5 ${cardBg} border rounded-xl p-3 flex flex-col h-40 transition-colors`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-[11px] font-bold uppercase tracking-wider ${textTitle}`}>
            LOG / CONSOLE
          </h3>

          <div className="flex items-center gap-1">
            <button
              onClick={handleDownloadLogs}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Download Console Log File"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            {onClearLogs && (
              <button
                onClick={onClearLogs}
                className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title="Clear Console Output"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className={`border rounded-lg p-2.5 flex-1 overflow-y-auto font-mono text-[11px] space-y-1 select-text custom-scrollbar ${
          darkMode ? 'bg-[#080C16] border-[#1E2A45]' : 'bg-slate-900 text-slate-100 border-slate-700 shadow-inner'
        }`}>
          {logs.length === 0 ? (
            <div className="text-slate-500 italic">No logs recorded yet.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="leading-relaxed">
                <span className="text-slate-500">{log.substring(0, 10)}</span>{' '}
                <span className="text-emerald-400 font-bold">{log.substring(10, 15)}</span>
                <span className="text-slate-300">{log.substring(15)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* QUICK ACTIONS (Bottom Middle) */}
      <div className={`col-span-3 ${cardBg} border rounded-xl p-3 flex flex-col justify-between h-40 transition-colors`}>
        <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${textTitle}`}>
          QUICK ACTIONS
        </h3>

        <div className="space-y-2">
          <button
            onClick={onRunCurrentStep}
            className="w-full py-1.5 bg-[#16A34A] hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run Current Step</span>
          </button>

          <button
            onClick={onRunAllSteps}
            className="w-full py-1.5 bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Run All Steps</span>
          </button>

          <button
            onClick={onStop}
            className="w-full py-1.5 bg-[#DC2626] hover:bg-red-600 text-white font-bold text-xs rounded-lg transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <OctagonAlert className="w-3.5 h-3.5" />
            <span>Stop</span>
          </button>
        </div>

        {/* GPU CUDA Checkbox */}
        <div className={`pt-2 border-t flex items-center justify-between text-xs ${
          darkMode ? 'border-[#1E2A45]' : 'border-slate-200'
        }`}>
          <label className={`flex items-center gap-2 font-medium cursor-pointer ${
            darkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <input
              type="checkbox"
              checked={useGpu}
              onChange={(e) => setUseGpu(e.target.checked)}
              className="accent-blue-600 rounded cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              <span>Use GPU (CUDA)</span>
            </span>
          </label>

          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
            useGpu
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800'
              : 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800'
          }`}>
            {useGpu ? 'NVIDIA RTX 3060' : 'CPU Mode'}
          </span>
        </div>
      </div>

      {/* OUTPUT PREVIEW (Bottom Right) */}
      <div className={`col-span-4 ${cardBg} border rounded-xl p-3 flex flex-col h-40 transition-colors`}>
        {/* Tabs */}
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-[11px] font-bold uppercase tracking-wider ${textTitle}`}>
            OUTPUT PREVIEW
          </h3>

          <div className={`flex items-center p-0.5 rounded-lg text-[11px] ${
            darkMode ? 'bg-[#0E1527]' : 'bg-slate-100'
          }`}>
            <button
              onClick={() => setOutputTab('preview')}
              className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                outputTab === 'preview'
                  ? 'bg-[#2563EB] text-white font-bold shadow-sm'
                  : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Registered Image
            </button>
            <button
              onClick={() => setOutputTab('diff')}
              className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                outputTab === 'diff'
                  ? 'bg-[#2563EB] text-white font-bold shadow-sm'
                  : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Difference Map
            </button>
          </div>
        </div>

        {/* Preview Canvas / Map Area */}
        <div className="flex-1 bg-[#090D18] border border-[#1E2A45] rounded-lg relative overflow-hidden flex items-center justify-center">
          {outputTab === 'preview' ? (
            <svg viewBox="0 0 400 160" className="w-full h-full bg-[#121929]">
              <defs>
                <radialGradient id="out-crater" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#556682" />
                  <stop offset="70%" stopColor="#253248" />
                  <stop offset="100%" stopColor="#0B111E" />
                </radialGradient>
              </defs>

              <rect width="400" height="160" fill="#151D2E" />
              <circle cx="200" cy="80" r="48" fill="url(#out-crater)" />
              <circle cx="192" cy="72" r="38" fill="#0C1220" />
              <circle cx="186" cy="66" r="12" fill="#3B4861" />

              <circle cx="80" cy="50" r="20" fill="#253248" />
              <circle cx="320" cy="120" r="28" fill="#253248" />

              {/* Fused align check pattern overlay */}
              <circle cx="200" cy="80" r="48" fill="none" stroke="#22C55E" strokeWidth="1" strokeDasharray="4,4" />
            </svg>
          ) : (
            <svg viewBox="0 0 400 160" className="w-full h-full bg-[#0A0D16]">
              <rect width="400" height="160" fill="#0A0D16" />
              <circle cx="200" cy="80" r="50" fill="rgba(34, 197, 94, 0.25)" stroke="#22C55E" strokeDasharray="3,3" />
              <circle cx="200" cy="80" r="20" fill="rgba(220, 38, 38, 0.4)" />
              <text x="15" y="25" fill="#22C55E" fontSize="10" fontFamily="monospace">Sub-pixel Shift Error: 0.14 px</text>
            </svg>
          )}

          <div className="absolute bottom-2 right-2 bg-[#0E1527]/90 border border-[#1E2A45] px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-white"></div>
            <span>10 km</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useEffect } from 'react';
import { Play, PlayCircle, OctagonAlert, Cpu, Trash2, Download, CircleDashed } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const ConsoleActionsSection: React.FC = () => {
  const {
    darkMode,
    logs,
    runStep,
    runAllSteps,
    stopPipeline,
    isPipelineRunning,
    currentStepId,
    useGpu,
    setUseGpu,
    clearLogs,
    downloadLogs,
    steps
  } = useAppState();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const cardBg = darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0] shadow-sm';
  const textTitle = darkMode ? 'text-slate-400' : 'text-slate-600';

  const activeStepObj = steps.find(s => s.id === currentStepId);

  return (
    <div className={`grid grid-cols-12 gap-3 p-3 border-t transition-colors ${
      darkMode ? 'bg-[#0B101D] border-[#1F2937]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
    }`}>
      {/* LOG / CONSOLE (Always dark terminal feel) */}
      <div className={`col-span-8 ${cardBg} border rounded-xl p-3 flex flex-col h-44 transition-colors`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className={`text-[11px] font-bold uppercase tracking-wider ${textTitle}`}>
              TERMINAL LOG CONSOLE
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={downloadLogs}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Download Console Log File"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={clearLogs}
              className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear Console Output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ALWAYS DARK TERMINAL LOG CONTAINER */}
        <div
          ref={scrollRef}
          className="border border-[#1F2937] rounded-lg p-2.5 flex-1 overflow-y-auto font-mono text-[11px] space-y-1 bg-[#080C16] text-slate-100 shadow-inner custom-scrollbar select-text"
        >
          {logs.length === 0 ? (
            <div className="text-slate-500 italic">No logs recorded yet.</div>
          ) : (
            logs.map(log => {
              const levelColor =
                log.level === 'success' ? 'text-[#22C55E]' :
                log.level === 'warn' ? 'text-[#F59E0B]' :
                log.level === 'error' ? 'text-[#EF4444]' :
                log.level === 'stopped' ? 'text-amber-400 font-bold' : 'text-blue-400';

              return (
                <div key={log.id} className="leading-relaxed flex items-start gap-1.5">
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <span className={`font-bold shrink-0 uppercase text-[10px] ${levelColor}`}>
                    [{log.level}]
                  </span>
                  <span className="text-slate-300 font-mono tracking-tight">{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* QUICK ACTIONS (1 Primary Button Rule) */}
      <div className={`col-span-4 ${cardBg} border rounded-xl p-3 flex flex-col justify-between h-44 transition-colors`}>
        <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${textTitle}`}>
          QUICK ACTIONS
        </h3>

        <div className="space-y-1.5">
          {/* ONLY ONE PRIMARY BUTTON ON SCREEN */}
          <button
            onClick={() => runStep(currentStepId)}
            disabled={isPipelineRunning}
            className={`w-full py-1.5 bg-[#2F6BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
              isPipelineRunning ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {isPipelineRunning ? (
              <>
                <CircleDashed className="w-3.5 h-3.5 animate-spin" />
                <span>Running Step {currentStepId}...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Step {currentStepId}: {activeStepObj?.name}</span>
              </>
            )}
          </button>

          {/* SECONDARY OUTLINE */}
          <button
            onClick={() => runAllSteps()}
            disabled={isPipelineRunning}
            className={`w-full py-1.5 border font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              darkMode
                ? 'border-[#1F2937] bg-[#0B101D] hover:bg-[#1F2937] text-slate-200'
                : 'border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 text-slate-800'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#2F6BFF]" />
            <span>Run All Steps (1 → 12)</span>
          </button>

          {/* DESTRUCTIVE OUTLINE */}
          <button
            onClick={() => stopPipeline()}
            className="w-full py-1.5 border border-[#EF4444]/50 bg-transparent hover:bg-[#EF4444]/10 text-[#EF4444] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <OctagonAlert className="w-3.5 h-3.5" />
            <span>Stop Execution</span>
          </button>
        </div>

        {/* GPU CUDA Toggle */}
        <div className={`pt-1.5 border-t flex items-center justify-between text-xs ${
          darkMode ? 'border-[#1F2937]' : 'border-[#E2E8F0]'
        }`}>
          <label className={`flex items-center gap-2 font-medium cursor-pointer ${
            darkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <input
              type="checkbox"
              checked={useGpu}
              onChange={(e) => setUseGpu(e.target.checked)}
              className="accent-[#2F6BFF] rounded cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-[#2F6BFF]" />
              <span>GPU (CUDA)</span>
            </span>
          </label>

          <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border ${
            useGpu
              ? 'text-[#22C55E] bg-emerald-950/60 border-emerald-800'
              : 'text-[#F59E0B] bg-amber-950/60 border-amber-800'
          }`}>
            {useGpu ? 'CUDA Active' : 'CPU Mode'}
          </span>
        </div>
      </div>
    </div>
  );
};

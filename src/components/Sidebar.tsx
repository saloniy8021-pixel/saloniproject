import React from 'react';
import { Check, CircleDashed, AlertCircle, Wrench } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const Sidebar: React.FC = () => {
  const {
    darkMode,
    steps,
    currentStepId,
    setCurrentStepId,
    debugMode,
    setDebugMode,
    isPipelineRunning
  } = useAppState();

  return (
    <aside className={`w-64 flex flex-col shrink-0 select-none transition-colors border-r ${
      darkMode ? 'bg-[#0B101D] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
    }`}>
      {/* Sidebar Header */}
      <div className={`p-3 border-b flex items-center justify-between ${
        darkMode ? 'border-[#1F2937] bg-[#111827]/50' : 'border-[#E2E8F0] bg-slate-50'
      }`}>
        <div>
          <h2 className={`text-[11px] font-bold uppercase tracking-wider ${
            darkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            PIPELINE STEPS (12)
          </h2>
        </div>
      </div>

      {/* 12 Workflow Steps List */}
      <div className="p-3 flex-1 overflow-y-auto custom-scrollbar space-y-1">
        {steps.map(step => {
          const isActive = step.id === currentStepId;
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';
          const isFailed = step.status === 'failed';

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStepId(step.id)}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2F6BFF] text-white shadow-md font-semibold'
                  : isCompleted
                  ? darkMode
                    ? 'text-slate-200 hover:bg-[#111827]'
                    : 'text-slate-800 hover:bg-slate-100'
                  : darkMode
                  ? 'text-slate-400 hover:bg-[#111827] hover:text-slate-200'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Step State Badge (3-4 States) */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white text-[#2F6BFF]'
                      : isRunning
                      ? 'bg-[#2F6BFF] text-white animate-pulse'
                      : isCompleted
                      ? 'bg-[#22C55E] text-white'
                      : isFailed
                      ? 'bg-[#EF4444] text-white'
                      : darkMode
                      ? 'border border-[#1F2937] bg-[#111827] text-slate-400'
                      : 'border border-[#E2E8F0] bg-slate-100 text-slate-600'
                  }`}
                >
                  {isRunning ? (
                    <CircleDashed className="w-3 h-3 animate-spin" />
                  ) : isCompleted ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : isFailed ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="truncate tracking-tight">{step.name}</span>
              </div>

              {/* Status Pill Indicator */}
              <span className={`text-[9px] font-mono uppercase shrink-0 ${
                isActive
                  ? 'text-blue-100 font-bold'
                  : isRunning
                  ? 'text-blue-300 font-bold animate-pulse'
                  : isCompleted
                  ? 'text-[#22C55E] font-medium'
                  : isFailed
                  ? 'text-[#EF4444] font-bold'
                  : darkMode
                  ? 'text-slate-600'
                  : 'text-slate-400'
              }`}>
                {isRunning ? 'RUNNING' : isActive ? 'ACTIVE' : isCompleted ? 'DONE' : 'PENDING'}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

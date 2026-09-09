import React from 'react';

export interface WorkflowStep {
  id: number;
  name: string;
  status: 'completed' | 'active' | 'pending';
}

interface SidebarProps {
  darkMode: boolean;
  steps: WorkflowStep[];
  currentStepId: number;
  onSelectStep: (id: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  darkMode,
  steps,
  currentStepId,
  onSelectStep
}) => {
  return (
    <aside className={`w-60 flex flex-col justify-between select-none transition-colors border-r ${
      darkMode ? 'bg-[#0C1222] border-[#1E2A45]' : 'bg-white border-slate-200'
    }`}>
      {/* Workflow Steps Section */}
      <div className="p-3">
        <h2 className={`text-[11px] font-bold uppercase tracking-wider mb-2.5 px-2 ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          WORKFLOW STEPS
        </h2>

        <div className="space-y-1">
          {steps.map(step => {
            const isActive = step.id === currentStepId;
            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md font-semibold'
                    : darkMode
                    ? 'text-slate-300 hover:bg-[#1E2A45]/60 hover:text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive
                      ? 'bg-white text-[#2563EB]'
                      : darkMode
                      ? 'bg-[#1E2A45] text-slate-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {step.id}
                </div>
                <span className="truncate">{step.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Info Card */}
      <div className={`p-3 border-t transition-colors ${
        darkMode ? 'border-[#1E2A45] bg-[#0A0F1D]/90' : 'border-slate-200 bg-slate-50/90'
      }`}>
        <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          PROJECT INFO
        </h3>

        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex justify-between">
            <span className={`font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Project Name</span>
            <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>Demo_Project</span>
          </div>

          <div className="flex justify-between">
            <span className={`font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Created On</span>
            <span className={`text-[11px] ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>20 May 2025 10:30 AM</span>
          </div>

          <div className="flex justify-between">
            <span className={`font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Reference</span>
            <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>LROC WAC</span>
          </div>

          <div className="flex justify-between">
            <span className={`font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Source</span>
            <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>IIRS (Band {currentStepId})</span>
          </div>

          <div className={`flex justify-between items-center pt-1 border-t ${
            darkMode ? 'border-[#1E2A45]/50' : 'border-slate-200'
          }`}>
            <span className={`font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold font-sans">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};


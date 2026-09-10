import React from 'react';
import { FileText, FolderOpen, Save, Settings, Moon, Sun, Orbit } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const Header: React.FC = () => {
  const { darkMode, toggleTheme, setActiveModal, saveProject } = useAppState();

  return (
    <header className={`px-5 py-2.5 flex items-center justify-between border-b z-40 select-none transition-colors duration-200 ${
      darkMode ? 'bg-[#0B101D] border-[#1F2937] text-white' : 'bg-white border-[#E2E8F0] text-slate-900 shadow-sm'
    }`}>
      {/* Left: Mission Branding & Logo */}
      <div className="flex items-center gap-3.5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
          darkMode 
            ? 'bg-gradient-to-br from-blue-900/60 to-slate-900 border border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(47,107,255,0.25)]' 
            : 'bg-gradient-to-br from-blue-50 to-slate-100 border border-blue-200 text-[#2F6BFF] shadow-inner'
        }`}>
          <Orbit className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight">
              Chandrayaan-2 Lunar Image Registration Tool
            </h1>
            <span className={`text-[9.5px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
              darkMode ? 'bg-blue-950/70 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              ISRO / ISDA
            </span>
          </div>
          <p className={`text-[11px] font-medium tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            OHRC ↔ NAC Multi-Sensor Orbital Registration Platform
          </p>
        </div>
      </div>

      {/* Right: Quick Action Buttons & Theme Switcher Toggle */}
      <div className="flex items-center gap-3 text-xs">
        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-1.5 pr-3 border-r border-[#1F2937]/50">
          <button
            onClick={() => setActiveModal('New Project')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              darkMode 
                ? 'text-slate-300 hover:text-white hover:bg-[#111827] border border-transparent hover:border-[#1F2937]' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-[#E2E8F0]'
            }`}
            title="Create New Project Workspace"
          >
            <FileText className="w-3.5 h-3.5 text-[#2F6BFF]" />
            <span>New Project</span>
          </button>

          <button
            onClick={() => setActiveModal('Open Project')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              darkMode 
                ? 'text-slate-300 hover:text-white hover:bg-[#111827] border border-transparent hover:border-[#1F2937]' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-[#E2E8F0]'
            }`}
            title="Open Existing Project"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#2F6BFF]" />
            <span>Open Project</span>
          </button>

          <button
            onClick={saveProject}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              darkMode 
                ? 'text-slate-300 hover:text-white hover:bg-[#111827] border border-transparent hover:border-[#1F2937]' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-[#E2E8F0]'
            }`}
            title="Save Current Workspace State"
          >
            <Save className="w-3.5 h-3.5 text-[#2F6BFF]" />
            <span>Save Project</span>
          </button>

          <button
            onClick={() => setActiveModal('Settings')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              darkMode 
                ? 'text-slate-300 hover:text-white hover:bg-[#111827] border border-transparent hover:border-[#1F2937]' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-[#E2E8F0]'
            }`}
            title="Open Pipeline & System Settings"
          >
            <Settings className="w-3.5 h-3.5 text-[#2F6BFF]" />
            <span>Settings</span>
          </button>
        </div>

        {/* Theme Toggle Switch ONLY */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`relative w-13 h-7 rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer border shrink-0 ${
            darkMode 
              ? 'bg-[#111827] border-[#1F2937]' 
              : 'bg-slate-200 border-[#CBD5E1]'
          }`}
        >
          {/* Sliding Knob with Icon */}
          <div
            className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-300 ${
              darkMode 
                ? 'translate-x-6 bg-[#2F6BFF] text-white' 
                : 'translate-x-0 bg-white text-amber-500'
            }`}
          >
            {darkMode ? (
              <Moon className="w-3 h-3 fill-white text-white" />
            ) : (
              <Sun className="w-3 h-3 fill-amber-500 text-amber-500" />
            )}
          </div>
        </button>
      </div>
    </header>
  );
};

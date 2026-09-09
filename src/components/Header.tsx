import React from 'react';
import { FileText, FolderOpen, Save, Settings, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onNewProject,
  onOpenProject,
  onSaveProject,
  onSettings
}) => {
  return (
    <header className="bg-[#0B101D] border-b border-[#1E2A45] px-4 py-2.5 flex items-center justify-between z-40 select-none">
      {/* Moon Logo, Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
          <Moon className="w-5 h-5 text-slate-200 fill-slate-300" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Chandrayaan-2 Lunar Image Registration Tool
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            SuperPoint + SuperGlue Based Multi-Sensor Registration
          </p>
        </div>
      </div>

      {/* Action Buttons & Theme Pill Toggle */}
      <div className="flex items-center gap-5 text-xs text-slate-300">
        {/* Light / Dark Mode Pill Button matching screenshot */}
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-all shadow-sm cursor-pointer"
          title="Toggle Light / Dark Theme"
        >
          {darkMode ? (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Light Mode</span>
            </>
          )}
        </button>

        <button 
          onClick={onNewProject}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors group cursor-pointer"
        >
          <FileText className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
          <span>New Project</span>
        </button>

        <button 
          onClick={onOpenProject}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors group cursor-pointer"
        >
          <FolderOpen className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
          <span>Open Project</span>
        </button>

        <button 
          onClick={onSaveProject}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors group cursor-pointer"
        >
          <Save className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
          <span>Save Project</span>
        </button>

        <button 
          onClick={onSettings}
          className="flex flex-col items-center gap-1 hover:text-white transition-colors group cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
};


import React from 'react';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DataLoadingSection } from './components/DataLoadingSection';
import { PipelineProcessView } from './components/PipelineProcessView';
import { ViewportsSection } from './components/ViewportsSection';
import { MatchOverviewSection } from './components/MatchOverviewSection';
import { ConsoleActionsSection } from './components/ConsoleActionsSection';
import { Modals } from './components/Modals';

const MainLayout: React.FC = () => {
  const { darkMode } = useAppState();

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none transition-colors ${
      darkMode ? 'bg-[#0B101D] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      {/* Top Mission Control Header */}
      <Header />

      {/* Main Workspace (Single Sidebar Spine + Content Area) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Steps Spine */}
        <Sidebar />

        {/* Center Scrollable Dashboard Content */}
        <div className={`flex-1 flex flex-col overflow-y-auto ${
          darkMode ? 'bg-[#0B101D]' : 'bg-[#F8FAFC]'
        }`}>
          {/* Section 1: Data Loading & Sensors Setup */}
          <DataLoadingSection />

          {/* Active Step Process Execution Telemetry View */}
          <PipelineProcessView />

          {/* Section 2: Dual Synchronized Viewports (OHRC vs NAC) */}
          <ViewportsSection />

          {/* Section 3: Match Overview & Homography Matrix H */}
          <MatchOverviewSection />

          {/* Section 4: Console Log Terminal, Quick Actions & Output Preview */}
          <ConsoleActionsSection />
        </div>
      </div>

      {/* Modal Dialog Popups & Floating Toast Notifications */}
      <Modals />
    </div>
  );
};

export default function App() {
  return (
    <AppStateProvider>
      <MainLayout />
    </AppStateProvider>
  );
}

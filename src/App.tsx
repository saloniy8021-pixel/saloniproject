import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, WorkflowStep } from './components/Sidebar';
import { DataLoadingSection } from './components/DataLoadingSection';
import { ViewportsSection } from './components/ViewportsSection';
import { MatchOverviewSection } from './components/MatchOverviewSection';
import { PipelineMatrixSection } from './components/PipelineMatrixSection';
import { ConsoleActionsSection } from './components/ConsoleActionsSection';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentStepId, setCurrentStepId] = useState<number>(7); // Step 7 (RANSAC Outlier Rejection)
  const [selectedBand, setSelectedBand] = useState<number>(73);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('Chandrayaan2_Orbit_Pass_42');

  // Settings Form State
  const [keypointLimit, setKeypointLimit] = useState(2048);
  const [matchThreshold, setMatchThreshold] = useState(0.85);
  const [ransacThresh, setRansacThresh] = useState(3.0);

  // Sync dark mode class with HTML document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
    addLog(`Theme toggled to ${!darkMode ? 'Dark Space' : 'Light Slate'} Mode.`);
  };

  // Workflow steps
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: 1, name: 'Data Loading', status: 'completed' },
    { id: 2, name: 'Georeferencing', status: 'completed' },
    { id: 3, name: 'Resolution Resampling', status: 'completed' },
    { id: 4, name: 'Intensity Normalization', status: 'completed' },
    { id: 5, name: 'Feature Extraction (SuperPoint)', status: 'completed' },
    { id: 6, name: 'Feature Matching (SuperGlue)', status: 'completed' },
    { id: 7, name: 'Outlier Rejection (RANSAC)', status: 'active' },
    { id: 8, name: 'Transformation Estimation (H)', status: 'pending' },
    { id: 9, name: 'Image Warping', status: 'pending' },
    { id: 10, name: 'Apply to Full Cube (IIRS)', status: 'pending' },
    { id: 11, name: 'Evaluation', status: 'pending' },
    { id: 12, name: 'Export Results', status: 'pending' }
  ]);

  // Logs matching exact console output
  const [logs, setLogs] = useState<string[]>([
    '[10:45:12] INFO Project loaded successfully.',
    '[10:45:18] INFO Band selection completed. Best band: 73 (Score: 0.87)',
    '[10:45:34] INFO SuperPoint keypoint extraction completed. Found 2048 points.',
    '[10:45:41] INFO SuperGlue matching completed. Total matches: 1258',
    '[10:45:41] INFO RANSAC completed. Inliers: 982, Outlier ratio: 22.0%',
    '[10:45:42] INFO Homography matrix estimated.'
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [...prev, `[${time}] INFO ${msg}`]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleStepSelect = (id: number) => {
    setCurrentStepId(id);
    setSteps(prev => prev.map(s => {
      if (s.id < id) return { ...s, status: 'completed' };
      if (s.id === id) return { ...s, status: 'active' };
      return { ...s, status: 'pending' };
    }));
    const stepObj = steps.find(s => s.id === id);
    addLog(`Switched active workflow step to Step ${id}: ${stepObj?.name}`);
  };

  const handleRunCurrentStep = () => {
    const stepObj = steps.find(s => s.id === currentStepId);
    if (!stepObj) return;

    addLog(`Executing Step ${currentStepId}: ${stepObj.name}...`);

    setTimeout(() => {
      setSteps(prev => prev.map(s => {
        if (s.id === currentStepId) return { ...s, status: 'completed' };
        if (s.id === currentStepId + 1) return { ...s, status: 'active' };
        return s;
      }));

      addLog(`Step ${currentStepId} (${stepObj.name}) finished successfully.`);

      if (currentStepId < 12) {
        setCurrentStepId(prev => prev + 1);
      }
    }, 700);
  };

  const handleRunAllSteps = () => {
    addLog('Executing complete automated registration pipeline...');
    let step = currentStepId;

    const interval = setInterval(() => {
      if (step <= 12) {
        const stepName = steps.find(s => s.id === step)?.name || '';
        addLog(`Step ${step} (${stepName}) completed.`);

        setSteps(prev => prev.map(s => {
          if (s.id <= step) return { ...s, status: 'completed' };
          if (s.id === step + 1) return { ...s, status: 'active' };
          return s;
        }));

        setCurrentStepId(step < 12 ? step + 1 : 12);
        step++;
      } else {
        clearInterval(interval);
        addLog('Full pipeline execution finished! Homography Matrix H converged with RMSE 0.14 px.');
      }
    }, 500);
  };

  const handleStop = () => {
    addLog('Execution pipeline halted by user.');
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none transition-colors ${
      darkMode ? 'bg-[#0B101D] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Header Bar with Theme Toggle */}
      <Header
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onNewProject={() => setActiveModal('New Project')}
        onOpenProject={() => setActiveModal('Open Project')}
        onSaveProject={() => addLog('Project state saved to Demo_Project.c2proj.')}
        onSettings={() => setActiveModal('Settings')}
      />

      {/* Main Body (Sidebar + Content Workspace) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Steps & Project Info */}
        <Sidebar
          darkMode={darkMode}
          steps={steps}
          currentStepId={currentStepId}
          onSelectStep={handleStepSelect}
        />

        {/* Center Main Work Area */}
        <div className={`flex-1 flex flex-col overflow-y-auto ${
          darkMode ? 'bg-[#0B101D]' : 'bg-slate-50'
        }`}>
          {/* Top Data Loading Section */}
          <DataLoadingSection
            darkMode={darkMode}
            selectedBand={selectedBand}
            onSelectBand={(b) => {
              setSelectedBand(b);
              addLog(`IIRS Band changed to Band ${b}.`);
            }}
            onLogMsg={addLog}
          />

          {/* Dual Viewports Section (Source Image & Reference Image) */}
          <ViewportsSection darkMode={darkMode} selectedBand={selectedBand} />

          {/* Match Overview Section (SuperGlue + RANSAC Visualizer) */}
          <MatchOverviewSection darkMode={darkMode} />

          {/* Bottom Console Logs, Quick Actions, and Output Preview */}
          <ConsoleActionsSection
            darkMode={darkMode}
            logs={logs}
            onRunCurrentStep={handleRunCurrentStep}
            onRunAllSteps={handleRunAllSteps}
            onStop={handleStop}
            onClearLogs={handleClearLogs}
          />
        </div>

        {/* Right Process Pipeline & Homography Matrix Column */}
        <PipelineMatrixSection
          darkMode={darkMode}
          steps={steps}
          currentStepId={currentStepId}
          onSelectStep={handleStepSelect}
        />
      </div>

      {/* Modal Dialog Popups */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4 ${
            darkMode ? 'bg-[#131C31] border-[#1E2A45] text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <h3 className={`text-sm font-bold border-b pb-2 ${
              darkMode ? 'border-[#1E2A45]' : 'border-slate-200'
            }`}>
              {activeModal}
            </h3>

            {activeModal === 'New Project' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Project Name:</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none ${
                      darkMode ? 'bg-[#0E1527] border-blue-500 text-white' : 'bg-slate-100 border-blue-600 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Lunar Region:</label>
                  <select className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none ${
                    darkMode ? 'bg-[#0E1527] border-[#1E2A45] text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                  }`}>
                    <option>Lunar South Pole (Shoemaker / Shackleton)</option>
                    <option>Mare Tranquillitatis (Equatorial Pass)</option>
                    <option>Apollo 11 Landing Site</option>
                  </select>
                </div>
              </div>
            )}

            {activeModal === 'Open Project' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-400">Select a saved Chandrayaan-2 project file (.c2proj):</p>
                <input
                  type="file"
                  accept=".c2proj,.json"
                  className="w-full text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
              </div>
            )}

            {activeModal === 'Settings' && (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">SuperPoint Max Keypoints:</span>
                    <span className="font-mono font-bold text-blue-400">{keypointLimit}</span>
                  </div>
                  <input
                    type="range"
                    min="512"
                    max="4096"
                    step="256"
                    value={keypointLimit}
                    onChange={(e) => setKeypointLimit(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">SuperGlue Match Confidence Threshold:</span>
                    <span className="font-mono font-bold text-emerald-400">{matchThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="0.95"
                    step="0.05"
                    value={matchThreshold}
                    onChange={(e) => setMatchThreshold(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">RANSAC Reprojection Max Error (px):</span>
                    <span className="font-mono font-bold text-red-400">{ransacThresh} px</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.5"
                    value={ransacThresh}
                    onChange={(e) => setRansacThresh(parseFloat(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t dark:border-[#1E2A45]">
              <button
                onClick={() => setActiveModal(null)}
                className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer ${
                  darkMode ? 'bg-[#1E2A45] text-slate-300' : 'bg-slate-200 text-slate-800'
                }`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (activeModal === 'New Project') {
                    addLog(`Created new project workspace: ${newProjectName}`);
                  } else if (activeModal === 'Settings') {
                    addLog(`Updated algorithm parameters: Keypoints=${keypointLimit}, Threshold=${matchThreshold}, RANSAC=${ransacThresh}px`);
                  } else {
                    addLog(`${activeModal} confirmed.`);
                  }
                  setActiveModal(null);
                }}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 shadow-sm cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

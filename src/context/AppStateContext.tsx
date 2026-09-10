import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface PipelineStep {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'active';
  logMsg: string;
}

export interface TileMetadata {
  sensor: 'OHRC' | 'NAC';
  name: string;
  path: string;
  gsd: string;
  dimensions: string;
  footprint: string;
  crs: string;
  acquisitionDate: string;
  bitDepth: string;
  imageUrl?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'success' | 'error' | 'stopped';
  message: string;
}

interface AppStateContextType {
  // Theme
  darkMode: boolean;
  toggleTheme: () => void;

  // Pipeline Steps
  steps: PipelineStep[];
  currentStepId: number;
  setCurrentStepId: (id: number) => void;
  runStep: (stepId: number) => Promise<void>;
  runAllSteps: () => Promise<void>;
  stopPipeline: () => void;
  isPipelineRunning: boolean;

  // Toggles & Modes
  useGpu: boolean;
  setUseGpu: (val: boolean) => void;
  debugMode: boolean;
  setDebugMode: (val: boolean) => void;
  syncZoom: boolean;
  setSyncZoom: (val: boolean) => void;

  // Tiles Metadata
  ohrcTile: TileMetadata;
  nacTile: TileMetadata;
  changeTile: (sensor: 'OHRC' | 'NAC', newTile: Partial<TileMetadata>) => void;

  // Match & Homography Data
  filterMode: 'all' | 'inliers' | 'outliers';
  setFilterMode: (mode: 'all' | 'inliers' | 'outliers') => void;
  matrixValues: string[][];
  recalculateMatrix: () => void;
  copyMatrix: () => void;
  copiedMatrix: boolean;

  // Metrics
  inlierRatio: number;
  rmse: number;
  overlapPct: number;
  totalMatches: number;
  inliersCount: number;

  // Output Tabs
  outputTab: 'preview' | 'diff';
  setOutputTab: (tab: 'preview' | 'diff') => void;

  // Console Logs
  logs: LogEntry[];
  addLog: (msg: string, level?: 'info' | 'warn' | 'success' | 'error' | 'stopped') => void;
  clearLogs: () => void;
  downloadLogs: () => void;

  // Modals
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  // Toast notification
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Settings
  keypointLimit: number;
  setKeypointLimit: (val: number) => void;
  matchThreshold: number;
  setMatchThreshold: (val: number) => void;
  ransacThresh: number;
  setRansacThresh: (val: number) => void;

  // Project Serialization
  saveProject: () => void;
  loadProjectData: (jsonData: any) => void;
}

const INITIAL_STEPS: PipelineStep[] = [
  { id: 1, name: 'Data Loading', description: 'Load OHRC & NAC orbital tile metadata & footprints', status: 'completed', logMsg: 'Loaded OHRC tile (0.28 m/px) & NAC tile (1.10 m/px) — footprint overlap OK.' },
  { id: 2, name: 'Georeferencing', description: 'Reproject rasters to EPSG:104903 Moon 2000 CRS', status: 'completed', logMsg: 'Georeferencing verified — EPSG:104903 (Moon 2000), corner RMS 0.4 px.' },
  { id: 3, name: 'Resolution Resampling', description: 'Bicubic resampling OHRC to match NAC GSD grid', status: 'completed', logMsg: 'Resampled OHRC 0.28 m/px → 1.10 m/px (bicubic) to match NAC grid.' },
  { id: 4, name: 'Intensity Normalization', description: 'CLAHE contrast & histogram matching', status: 'completed', logMsg: 'Intensity normalized (CLAHE clip=2.0) — mean intensity diff reduced 34% → 4%.' },
  { id: 5, name: 'Automatic Coarse Alignment', description: 'Phase correlation & coarse translation offset estimation', status: 'completed', logMsg: 'Coarse alignment solved — Translation offset: ΔX=+14.2px, ΔY=-8.7px, Rotation: 0.42°, RMS error: 1.8 px.' },
  { id: 6, name: 'Feature Extraction (SuperPoint)', description: 'Extract deep keypoint patches across rasters', status: 'completed', logMsg: 'SuperPoint: 4,812 keypoints (OHRC), 5,096 keypoints (NAC) extracted.' },
  { id: 7, name: 'Feature Matching (SuperGlue)', description: 'GNN-driven feature correspondence matching', status: 'completed', logMsg: 'SuperGlue: 1,247 tentative matches, mean confidence 0.81.' },
  { id: 8, name: 'Outlier Rejection (RANSAC)', description: 'RANSAC reprojection error filtering', status: 'active', logMsg: 'RANSAC: 1,083 inliers / 1,247 (86.8%), reprojection threshold 2.0 px.' },
  { id: 9, name: 'Transformation Estimation (Polynomial)', description: '2nd-order Polynomial Transformation Matrix estimation', status: 'pending', logMsg: 'Polynomial Matrix estimated — reprojection RMSE 0.62 px.' },
  { id: 10, name: 'Image Warping', description: 'Bilinear/bicubic warping of OHRC tile to NAC', status: 'pending', logMsg: 'Warp complete: 8192×8192 px output composite created.' },
  { id: 11, name: 'Evaluation', description: 'RMSE calculation & Difference Map generation', status: 'pending', logMsg: 'Evaluation: RMSE 0.64 px, max error 2.1 px, inliers 86.8% [PASS].' },
  { id: 12, name: 'Export Results', description: 'Export GeoTIFF, homography.json & PDF report', status: 'pending', logMsg: 'Exported: registered_OH2_T014.tif, homography.json, eval_report.pdf.' }
];

const INITIAL_OHRC: TileMetadata = {
  sensor: 'OHRC',
  name: 'ch2_ohrc_nmp_20200115t083022_pass42.tif',
  path: '/data/OHRC/Pass42/ch2_ohrc_nmp_20200115t083022_pass42.tif',
  gsd: '0.28 m/px',
  dimensions: '8192 × 8192 px',
  footprint: '88.5°S, 0.2°E (South Pole)',
  crs: 'EPSG:104903 (Moon 2000)',
  acquisitionDate: '2020-01-15T08:30:22Z',
  bitDepth: '12-bit Raw'
};

const INITIAL_NAC: TileMetadata = {
  sensor: 'NAC',
  name: 'lroc_nac_visible_global_100m.tif',
  path: '/data/NAC/Orbit1142/lroc_nac_visible_global_100m.tif',
  gsd: '1.10 m/px',
  dimensions: '4096 × 4096 px',
  footprint: '88.4°S, 0.3°E (Shoemaker Crater)',
  crs: 'EPSG:104903 (Moon 2000)',
  acquisitionDate: '2019-11-12T14:15:00Z',
  bitDepth: '8-bit GeoTIFF'
};

const AppStateContext = createContext<AppStateContextType | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('c2_theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });

  // Pipeline State
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_STEPS);
  const [currentStepId, setCurrentStepId] = useState<number>(7);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);
  const abortRef = useRef<boolean>(false);

  // Toggles
  const [useGpu, setUseGpu] = useState<boolean>(true);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [syncZoom, setSyncZoom] = useState<boolean>(true);

  // Metadata
  const [ohrcTile, setOhrcTile] = useState<TileMetadata>(INITIAL_OHRC);
  const [nacTile, setNacTile] = useState<TileMetadata>(INITIAL_NAC);

  // Match & Matrix
  const [filterMode, setFilterMode] = useState<'all' | 'inliers' | 'outliers'>('all');
  const [matrixValues, setMatrixValues] = useState<string[][]>([
    ['1.0021', '0.0013', '-23.45'],
    ['-0.0011', '1.0032', '18.67'],
    ['0.000000', '0.000000', '1.0000']
  ]);
  const [copiedMatrix, setCopiedMatrix] = useState<boolean>(false);

  // Metrics
  const [inlierRatio, setInlierRatio] = useState<number>(86.8);
  const [rmse, setRmse] = useState<number>(0.62);
  const [overlapPct, setOverlapPct] = useState<number>(94.2);
  const [totalMatches, setTotalMatches] = useState<number>(1247);
  const [inliersCount, setInliersCount] = useState<number>(1083);

  // Output Tabs
  const [outputTab, setOutputTab] = useState<'preview' | 'diff'>('preview');

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '10:45:12', level: 'info', message: 'Project loaded successfully: Chandrayaan2_Orbit_Pass_42.' },
    { id: '2', timestamp: '10:45:18', level: 'info', message: 'Loaded OHRC tile ch2_ohrc_nmp_pass42.tif (0.28 m/px) & NAC tile lroc_nac_visible.tif (1.10 m/px) — overlap 94.2% OK.' },
    { id: '3', timestamp: '10:45:25', level: 'info', message: 'Georeferencing verified — EPSG:104903 (Moon 2000), corner RMS 0.4 px.' },
    { id: '4', timestamp: '10:45:34', level: 'info', message: 'SuperPoint: 4812 keypoints (OHRC), 5096 keypoints (NAC) — 312 ms (CUDA).' },
    { id: '5', timestamp: '10:45:41', level: 'info', message: 'SuperGlue: 1,247 tentative matches, mean confidence 0.81.' },
    { id: '6', timestamp: '10:45:41', level: 'success', message: 'RANSAC: 1,083 inliers / 1,247 (86.8%), reprojection threshold 2.0 px.' }
  ]);

  // Modal & Toast
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings
  const [keypointLimit, setKeypointLimit] = useState<number>(2048);
  const [matchThreshold, setMatchThreshold] = useState<number>(0.85);
  const [ransacThresh, setRansacThresh] = useState<number>(2.0);

  // Save Project Handler
  const saveProject = () => {
    const projectData = {
      version: '1.1',
      savedAt: new Date().toISOString(),
      ohrcTile,
      nacTile,
      steps,
      currentStepId,
      matrixValues,
      rmse,
      inlierRatio,
      overlapPct,
      totalMatches,
      inliersCount,
      settings: {
        keypointLimit,
        matchThreshold,
        ransacThresh,
        useGpu
      },
      logs
    };

    const jsonStr = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chandrayaan2_Project_${Date.now()}.c2proj`;
    link.click();
    URL.revokeObjectURL(url);

    addLog('Project state saved and exported as .c2proj file.', 'success');
    showToast('Project Saved (.c2proj File Exported)');
  };

  // Load Project Handler
  const loadProjectData = (jsonData: any) => {
    try {
      if (jsonData.ohrcTile) setOhrcTile(jsonData.ohrcTile);
      if (jsonData.nacTile) setNacTile(jsonData.nacTile);
      if (jsonData.steps) setSteps(jsonData.steps);
      if (jsonData.currentStepId) setCurrentStepId(jsonData.currentStepId);
      if (jsonData.matrixValues) setMatrixValues(jsonData.matrixValues);
      if (jsonData.rmse) setRmse(jsonData.rmse);
      if (jsonData.inlierRatio) setInlierRatio(jsonData.inlierRatio);
      if (jsonData.settings) {
        if (jsonData.settings.keypointLimit) setKeypointLimit(jsonData.settings.keypointLimit);
        if (jsonData.settings.matchThreshold) setMatchThreshold(jsonData.settings.matchThreshold);
        if (jsonData.settings.ransacThresh) setRansacThresh(jsonData.settings.ransacThresh);
        if (typeof jsonData.settings.useGpu === 'boolean') setUseGpu(jsonData.settings.useGpu);
      }
      if (jsonData.logs) setLogs(jsonData.logs);

      addLog('Project restored successfully from .c2proj file.', 'success');
      showToast('Project State Loaded & Restored!');
    } catch (err) {
      addLog('Failed to parse project file.', 'error');
      showToast('Error Loading Project File');
    }
  };

  // Sync theme with document element & localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('c2_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('c2_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const next = !prev;
      addLog(`Theme switched to ${next ? 'Deep Space Dark' : 'Clean Light Slate'} Mode.`, 'info');
      return next;
    });
  };

  const addLog = (message: string, level: 'info' | 'warn' | 'success' | 'error' | 'stopped' = 'info') => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const newEntry: LogEntry = {
      id: Date.now().toString() + Math.random().toString().slice(2, 5),
      timestamp,
      level,
      message
    };
    setLogs(prev => [...prev.slice(-499), newEntry]);
  };

  const clearLogs = () => {
    setLogs([]);
    showToast('Console logs cleared.');
  };

  const downloadLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.level.toUpperCase()} ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chandrayaan2_registration_log.txt';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Console log file downloaded.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run a single step with simulated async compute
  const runStep = async (stepId: number) => {
    const stepObj = steps.find(s => s.id === stepId);
    if (!stepObj) return;

    // Pre-condition check: predecessor must be complete unless in debug mode
    if (!debugMode && stepId > 1) {
      const prevStep = steps.find(s => s.id === stepId - 1);
      if (prevStep && prevStep.status !== 'completed') {
        addLog(`Cannot run Step ${stepId} (${stepObj.name}): Predecessor Step ${stepId - 1} is not completed.`, 'warn');
        showToast(`Run Step ${stepId - 1} (${prevStep.name}) first!`);
        return;
      }
    }

    setIsPipelineRunning(true);
    abortRef.current = false;

    // Set status to running
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'running' } : s));
    addLog(`Running Step ${stepId}: ${stepObj.name}... ${useGpu ? '(CUDA Accelerated)' : '(CPU Engine)'}`, 'info');

    // Async delay based on GPU toggle
    const delay = useGpu ? 350 : 1100;
    await new Promise(resolve => setTimeout(resolve, delay));

    if (abortRef.current) {
      setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'pending' } : s));
      setIsPipelineRunning(false);
      return;
    }

    // Step completed successfully
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) return { ...s, status: 'completed' };
      if (s.id === stepId + 1 && s.status === 'pending') return { ...s, status: 'active' };
      return s;
    }));

    addLog(`Step ${stepId} (${stepObj.name}) completed. ${stepObj.logMsg} ${useGpu ? '(CUDA)' : '(CPU)'}`, 'success');
    showToast(`Step ${stepId}: ${stepObj.name} Complete!`);

    // Enable downstream features as steps complete
    if (stepId === 8) {
      recalculateMatrix();
    }
    if (stepId === 11) {
      setOutputTab('diff');
    }

    if (stepId < 12) {
      setCurrentStepId(stepId + 1);
    }

    setIsPipelineRunning(false);
  };

  // Run all steps 1 -> 12 sequentially
  const runAllSteps = async () => {
    setIsPipelineRunning(true);
    abortRef.current = false;
    addLog('Executing complete 12-step automated registration pipeline (Steps 1 → 12)...', 'info');

    for (let sId = 1; sId <= 12; sId++) {
      if (abortRef.current) {
        addLog('[STOPPED] Automated pipeline execution aborted by user.', 'stopped');
        showToast('Pipeline Stopped by User.');
        break;
      }

      setCurrentStepId(sId);
      const stepObj = steps.find(s => s.id === sId);
      setSteps(prev => prev.map(s => s.id === sId ? { ...s, status: 'running' } : s));

      const delay = useGpu ? 300 : 800;
      await new Promise(resolve => setTimeout(resolve, delay));

      if (abortRef.current) {
        setSteps(prev => prev.map(s => s.id === sId ? { ...s, status: 'pending' } : s));
        break;
      }

      setSteps(prev => prev.map(s => {
        if (s.id <= sId) return { ...s, status: 'completed' };
        if (s.id === sId + 1) return { ...s, status: 'active' };
        return s;
      }));

      addLog(`Step ${sId} (${stepObj?.name}) complete.`, 'success');
    }

    if (!abortRef.current) {
      recalculateMatrix();
      setOutputTab('diff');
      addLog('Full pipeline execution finished! Homography Matrix H converged with RMSE 0.62 px.', 'success');
      showToast('Full 12-Step Pipeline Completed Successfully!');
    }

    setIsPipelineRunning(false);
  };

  const stopPipeline = () => {
    abortRef.current = true;
    setIsPipelineRunning(false);
    addLog('[STOPPED] In-flight execution halted within 500 ms.', 'stopped');
    showToast('Execution Halted.');
  };

  const changeTile = (sensor: 'OHRC' | 'NAC', newTile: Partial<TileMetadata>) => {
    if (sensor === 'OHRC') {
      setOhrcTile(prev => ({ ...prev, ...newTile }));
      addLog(`Loaded new OHRC Source Tile: ${newTile.name || 'Custom OHRC Tile'} (${newTile.gsd || '0.28 m/px'})`, 'info');
    } else {
      setNacTile(prev => ({ ...prev, ...newTile }));
      addLog(`Loaded new NAC Reference Tile: ${newTile.name || 'Custom NAC Tile'} (${newTile.gsd || '1.10 m/px'})`, 'info');
    }

    // Reset downstream steps 2..12 back to pending
    setSteps(prev => prev.map(s => {
      if (s.id === 1) return { ...s, status: 'completed' };
      if (s.id === 2) return { ...s, status: 'active' };
      return { ...s, status: 'pending' };
    }));
    setCurrentStepId(2);
    showToast(`Updated ${sensor} Tile! Pipeline reset to Step 2.`);
  };

  const recalculateMatrix = () => {
    const a0 = (-22.58 + (Math.random() - 0.5) * 1.2).toFixed(4);
    const a1 = (0.9992 + (Math.random() - 0.5) * 0.002).toFixed(4);
    const a2 = (-0.0011 + (Math.random() - 0.5) * 0.001).toFixed(4);

    const b0 = (18.90 + (Math.random() - 0.5) * 1.2).toFixed(4);
    const b1 = (0.0010 + (Math.random() - 0.5) * 0.001).toFixed(4);
    const b2 = (0.9991 + (Math.random() - 0.5) * 0.002).toFixed(4);

    setMatrixValues([
      [a0, a1, a2],
      [b0, b1, b2],
      ['Order: 2nd', 'RMS: 0.62px', 'R²: 0.9999']
    ]);
    const newRmse = parseFloat((0.55 + Math.random() * 0.15).toFixed(2));
    setRmse(newRmse);
    addLog(`Recalculated Polynomial Transformation Matrix — Reprojection RMSE: ${newRmse} px.`, 'info');
  };

  const copyMatrix = () => {
    const text = matrixValues.map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedMatrix(true);
    setTimeout(() => setCopiedMatrix(false), 2000);
    showToast('Polynomial Transformation Matrix copied to clipboard!');
    addLog('Copied Polynomial Transformation Matrix to clipboard.', 'info');
  };

  return (
    <AppStateContext.Provider
      value={{
        darkMode,
        toggleTheme,
        steps,
        currentStepId,
        setCurrentStepId,
        runStep,
        runAllSteps,
        stopPipeline,
        isPipelineRunning,
        useGpu,
        setUseGpu,
        debugMode,
        setDebugMode,
        syncZoom,
        setSyncZoom,
        ohrcTile,
        nacTile,
        changeTile,
        filterMode,
        setFilterMode,
        matrixValues,
        recalculateMatrix,
        copyMatrix,
        copiedMatrix,
        inlierRatio,
        rmse,
        overlapPct,
        totalMatches,
        inliersCount,
        outputTab,
        setOutputTab,
        logs,
        addLog,
        clearLogs,
        downloadLogs,
        activeModal,
        setActiveModal,
        toastMessage,
        showToast,
        keypointLimit,
        setKeypointLimit,
        matchThreshold,
        setMatchThreshold,
        ransacThresh,
        setRansacThresh,
        saveProject,
        loadProjectData
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

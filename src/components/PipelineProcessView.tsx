import React, { useState, useEffect } from 'react';
import { Play, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

interface StepDetail {
  id: number;
  name: string;
  subtitle: string;
  detail: string;
  metrics: Array<[string, string]>;
  inputFrameTitle: string;
  outputFrameTitle: string;
  logs: string[];
}

const STEP_DETAILS: Record<number, StepDetail> = {
  1: {
    id: 1,
    name: 'Data Loading',
    subtitle: 'OHRC & NAC Orbital Raster Ingestion',
    detail: 'Ingested raw PDS4 lunar orbital raster tiles from mission archive.',
    metrics: [['Tiles Loaded', '2 Rasters'], ['Total Size', '4.8 GB'], ['Bit Depth', '12-bit Raw'], ['Sensor Overlap', '94.2%']],
    inputFrameTitle: 'Raw PDS Archive Payload',
    outputFrameTitle: 'Ingested OHRC & NAC Tiles',
    logs: [
      'Reading OHRC_20200115T083022_pass42.tif (8192x8192 px, 0.28m/px)...',
      'Reading LROC_NAC_visible_global_100m.tif (4096x4096 px, 1.10m/px)...',
      'Checksum SHA-256 verified. Sensor overlap 94.2% OK.'
    ]
  },
  2: {
    id: 2,
    name: 'Georeferencing',
    subtitle: 'EPSG:104903 Moon 2000 Projection',
    detail: 'Attached ground-truth ephemeris coordinates to both orbital rasters.',
    metrics: [['Control Points', '312 GCPs'], ['Datum', 'Moon 2000'], ['Corner RMS', '0.4 px'], ['CRS', 'EPSG:104903']],
    inputFrameTitle: 'Unprojected Pixel Space',
    outputFrameTitle: 'Reprojected Lunar Spatial Grid',
    logs: [
      'Loading SPICE kernel ephemeris data for Chandrayaan-2 pass 42...',
      'Fitting 312 ground control points to Moon 2000 datum...',
      'Spatial reference EPSG:104903 attached successfully.'
    ]
  },
  3: {
    id: 3,
    name: 'Resolution Resampling',
    subtitle: 'Grid Scale Matching (0.28 → 1.10 m/px)',
    detail: 'Bicubic resampling OHRC source tile to match NAC reference GSD grid.',
    metrics: [['Source GSD', '0.28 m/px'], ['Target GSD', '1.10 m/px'], ['Method', 'Bicubic Lanczos'], ['Grid Pixels', '16.7 Mpx']],
    inputFrameTitle: 'OHRC Native 0.28m Resolution',
    outputFrameTitle: 'Resampled 1.10m Scale Match',
    logs: [
      'Calculating spatial resolution scaling ratio (3.92x)...',
      'Resampling OHRC source frame with Lanczos-3 interpolation kernel...',
      'Grid alignment verified across 16.7 Mpx output grid.'
    ]
  },
  4: {
    id: 4,
    name: 'Intensity Normalization',
    subtitle: 'CLAHE & Histogram Contrast Balancing',
    detail: 'Balanced illumination angle and contrast differences between sensors.',
    metrics: [['Algorithm', 'CLAHE (Clip=2.0)'], ['Mean Shift', '+4.2%'], ['Std Dev Ratio', '0.97'], ['Clipped Px', '0.02%']],
    inputFrameTitle: 'Shadowed Lunar Crater Input',
    outputFrameTitle: 'CLAHE Contrast Normalized',
    logs: [
      'Computing cumulative distribution function (CDF) histograms...',
      'Applying Contrast Limited Adaptive Histogram Equalization...',
      'Mean intensity difference reduced from 34% to 4.1%.'
    ]
  },
  5: {
    id: 5,
    name: 'Automatic Coarse Alignment',
    subtitle: 'Phase Correlation & Georeferencing Offset Estimation',
    detail: 'Solves initial translation offset vectors and georeferencing error prior to sub-pixel keypoint extraction.',
    metrics: [['Translation Shift', 'ΔX: +14.2px, ΔY: -8.7px'], ['Shift Vector', '16.65 px'], ['Rotation Drift', '0.42°'], ['Georef RMS Error', '1.8 px']],
    inputFrameTitle: 'Contrast Normalized Target Frame',
    outputFrameTitle: 'Coarse Aligned Overlay (Offset Corrected)',
    logs: [
      'Computing 2D Fourier phase correlation matrix across overlapping tiles...',
      'Correlation peak detected: Shift vector ΔX = +14.2 px, ΔY = -8.7 px (Magnitude 16.65 px).',
      'Georeferencing offset error: RMS = 1.8 px, Rotation drift = 0.42° [COARSE ALIGNED].'
    ]
  },
  6: {
    id: 6,
    name: 'Feature Extraction (SuperPoint)',
    subtitle: 'Deep Convolutional Keypoint Detection',
    detail: 'Extracted high-confidence deep keypoint descriptors across both frames.',
    metrics: [['Detector', 'SuperPoint Net'], ['OHRC Points', '4,812'], ['NAC Points', '5,096'], ['Avg Score', '0.84']],
    inputFrameTitle: 'Coarse Aligned Rasters',
    outputFrameTitle: 'Extracted SuperPoint Keypoints',
    logs: [
      'Evaluating SuperPoint encoder backbone on OHRC tile (312 ms CUDA)...',
      'Evaluating SuperPoint encoder backbone on NAC tile (328 ms CUDA)...',
      'Extracted 4,812 (OHRC) and 5,096 (NAC) keypoint interest points.'
    ]
  },
  7: {
    id: 7,
    name: 'Feature Matching (SuperGlue)',
    subtitle: 'Graph Neural Network Correspondence Matching',
    detail: 'Solved keypoint correspondences using optimal transport GNN.',
    metrics: [['Matcher', 'SuperGlue GNN'], ['Raw Matches', '1,247'], ['Match Rate', '56.9%'], ['Confidence', '0.81']],
    inputFrameTitle: 'Disparate Keypoint Cloud',
    outputFrameTitle: 'SuperGlue Correspondence Vectors',
    logs: [
      'Constructing keypoint positional graph embedding...',
      'Running SuperGlue attention layers for cross-image matching...',
      'Found 1,247 candidate match correspondences (mean confidence 0.81).'
    ]
  },
  8: {
    id: 8,
    name: 'Outlier Rejection (RANSAC)',
    subtitle: 'Robust Reprojection Error Filtering',
    detail: 'Filtered spurious matches using RANSAC reprojection error threshold.',
    metrics: [['Filter', 'RANSAC / MSAC'], ['Inliers Count', '1,083'], ['Outliers Removed', '164 (13.2%)'], ['Max Error', '2.0 px']],
    inputFrameTitle: 'Raw Correspondence Vectors',
    outputFrameTitle: 'RANSAC Filtered Inliers (86.8%)',
    logs: [
      'Sampling 500 minimal point subsets for consensus evaluation...',
      'Evaluating reprojection error against 2.0 px threshold...',
      'Retained 1,083 inliers (86.8% inlier ratio). Outliers pruned.'
    ]
  },
  9: {
    id: 9,
    name: 'Transformation Estimation (Polynomial)',
    subtitle: '2nd-Order Polynomial Model Convergence',
    detail: 'Estimated 2nd-order polynomial transformation matrix parameters.',
    metrics: [['Model', '2nd Polynomial'], ['Reproj RMSE', '0.62 px'], ['R² Score', '0.9999'], ['Iterations', '412']],
    inputFrameTitle: 'Inlier Coordinate Sets',
    outputFrameTitle: 'Converged Matrix P (Order 2)',
    logs: [
      'Solving non-linear least squares polynomial system...',
      'Refining co-efficients with Levenberg-Marquardt optimization...',
      'Converged at iteration 412: Reprojection RMSE 0.62 px [PASS].'
    ]
  },
  10: {
    id: 10,
    name: 'Image Warping',
    subtitle: 'Polynomial Geometric Raster Deformation',
    detail: 'Applying solved polynomial transform to warp OHRC tile onto NAC grid.',
    metrics: [['Matched GCPs', '1,083 Points'], ['RMSE Error', '0.62 px'], ['Interpolation', 'Bicubic Spline'], ['Tiles Processed', '185 / 240']],
    inputFrameTitle: 'Unwarped OHRC Source Tile',
    outputFrameTitle: 'Warped & Co-registered Composite',
    logs: [
      'Applying polynomial warping matrix P to tile 184/240...',
      'Resampling composite pixel buffer with bicubic spline interpolation...',
      'Tile 185/240 warped successfully, writing composite raster.'
    ]
  },
  11: {
    id: 11,
    name: 'Evaluation',
    subtitle: 'Sub-pixel Registration Accuracy Verification',
    detail: 'Evaluated sub-pixel shift error and generated difference map.',
    metrics: [['Test Grid', '500 Points'], ['Sub-pixel Shift', '0.62 px'], ['Target RMSE', '< 1.00 px'], ['Validation', 'PASS']],
    inputFrameTitle: 'Co-registered Composite',
    outputFrameTitle: 'Difference Heatmap (0.62 px)',
    logs: [
      'Evaluating 500 independent ground check validation points...',
      'Computing sub-pixel shift difference heatmap...',
      'Registration verified: Sub-pixel shift error 0.62 px [PASS].'
    ]
  },
  12: {
    id: 12,
    name: 'Export Results',
    subtitle: 'GeoTIFF, Matrix & PDF Report Generation',
    detail: 'Packaged final co-registered GeoTIFFs, homography matrix, and PDF.',
    metrics: [['Format', 'GeoTIFF + JSON'], ['Report PDF', 'Generated'], ['Destination', '/export/Pass42/'], ['Checksum', 'SHA-256 OK']],
    inputFrameTitle: 'Processed Memory Buffer',
    outputFrameTitle: 'Final GeoTIFF & PDF Deliverable',
    logs: [
      'Writing GeoTIFF raster registered_OH2_pass42.tif...',
      'Exporting transformation_matrix.json metadata...',
      'Generating PDF quality assurance evaluation report. Complete!'
    ]
  }
};

export const PipelineProcessView: React.FC = () => {
  const { darkMode, currentStepId, steps, isPipelineRunning, runStep } = useAppState();

  const [progress, setProgress] = useState<number>(75);

  // Zoom Controls State
  const [inputZoom, setInputZoom] = useState<number>(1.0);
  const [warpedZoom, setWarpedZoom] = useState<number>(1.0);

  const activeStepObj = steps.find(s => s.id === currentStepId);
  const stepInfo = STEP_DETAILS[currentStepId] || STEP_DETAILS[7];

  const cardBg = darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0] shadow-sm';
  const textTitle = darkMode ? 'text-slate-400' : 'text-slate-500';
  const metricBoxBg = darkMode ? 'bg-[#080C16] border-[#1F2937]' : 'bg-slate-50 border-slate-200';
  const frameContainerBg = darkMode ? 'bg-[#050811] border-[#1F2937]' : 'bg-slate-950 border-slate-300';

  useEffect(() => {
    if (activeStepObj?.status === 'running') {
      setProgress(45);
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 12, 98));
      }, 300);
      return () => clearInterval(interval);
    } else if (activeStepObj?.status === 'completed') {
      setProgress(100);
    } else {
      setProgress(35);
    }
  }, [currentStepId, activeStepObj?.status]);

  const isCompleted = activeStepObj?.status === 'completed';
  const isRunning = activeStepObj?.status === 'running';

  // Zoom Action Handlers
  const zoomInInput = () => setInputZoom(prev => Math.min(prev + 0.25, 3.0));
  const zoomOutInput = () => setInputZoom(prev => Math.max(prev - 0.25, 0.5));
  const resetInputZoom = () => setInputZoom(1.0);

  const zoomInWarped = () => setWarpedZoom(prev => Math.min(prev + 0.25, 3.0));
  const zoomOutWarped = () => setWarpedZoom(prev => Math.max(prev - 0.25, 0.5));
  const resetWarpedZoom = () => setWarpedZoom(1.0);

  return (
    <div className={`p-4 border-b transition-colors ${
      darkMode ? 'bg-[#0B101D] border-[#1F2937]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
    }`}>
      <div className={`${cardBg} border rounded-2xl p-5 space-y-5 transition-all shadow-lg`}>
        {/* Step Header & Live Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 dark:border-[#1F2937]">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                darkMode ? 'bg-blue-950/80 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                Step {stepInfo.id} of 12
              </span>
              <h2 className={`text-base font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {stepInfo.name}
              </h2>
            </div>
            <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {stepInfo.subtitle} — {stepInfo.detail}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Pill */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border shadow-sm ${
              isCompleted
                ? darkMode ? 'bg-emerald-950/80 border-emerald-800 text-[#22C55E]' : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : isRunning
                ? darkMode ? 'bg-amber-950/80 border-amber-800 text-[#F59E0B] animate-pulse' : 'bg-amber-50 border-amber-300 text-amber-700 animate-pulse'
                : darkMode
                ? 'bg-[#080C16] border-[#1F2937] text-slate-400'
                : 'bg-slate-100 border-slate-300 text-slate-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isCompleted ? 'bg-[#22C55E]' : isRunning ? 'bg-[#F59E0B] animate-ping' : 'bg-slate-400'
              }`}></span>
              <span>{isRunning ? 'PROCESSING' : isCompleted ? 'DONE' : 'PENDING'}</span>
            </span>

            {/* Run Current Step Button */}
            <button
              onClick={() => runStep(currentStepId)}
              disabled={isPipelineRunning}
              className={`px-4 py-1.5 bg-[#2F6BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                isPipelineRunning ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isRunning ? 'Processing...' : `Execute Step ${currentStepId}`}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className={`font-bold uppercase text-[10px] tracking-wider ${textTitle}`}>
              STEP COMPLETED PROGRESS
            </span>
            <span className="font-bold text-[#2F6BFF]">{progress}%</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden p-0.5 border ${
            darkMode ? 'bg-[#080C16] border-[#1F2937]' : 'bg-slate-200 border-slate-300'
          }`}>
            <div
              className={`h-full rounded-full transition-all duration-500 shadow-inner ${
                isCompleted
                  ? 'bg-emerald-500'
                  : isRunning
                  ? 'bg-amber-500'
                  : 'bg-[#2F6BFF]'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Live Telemetry Metrics Grid (4 Cells) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stepInfo.metrics.map(([label, val], idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${metricBoxBg}`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${textTitle}`}>
                {label}
              </p>
              <p className="text-sm font-bold font-mono text-[#2F6BFF] tracking-tight">
                {val}
              </p>
            </div>
          ))}
        </div>

        {/* Before / After Visual Frame Preview Cards (Input Frame vs Warped Output Frame) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Card 1: Input Frame */}
          <div className={`rounded-2xl border p-3 flex flex-col transition-all ${
            darkMode ? 'bg-[#080C16] border-[#1F2937]' : 'bg-slate-50/80 border-slate-200'
          }`}>
            {/* Card Header Bar */}
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${
                darkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>
                Input Frame
              </h4>
              <span className={`text-[10px] font-mono font-medium ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {stepInfo.inputFrameTitle}
              </span>
            </div>

            {/* Frame Container */}
            <div className={`relative h-60 md:h-64 rounded-xl border-2 border-[#22C55E]/60 overflow-hidden ${frameContainerBg} shadow-inner group flex items-center justify-center`}>
              {/* Floating Interactive Zoom Toolbar */}
              <div className={`absolute top-2.5 right-2.5 z-20 flex items-center gap-1 p-1 rounded-xl shadow-xl backdrop-blur-md border ${
                darkMode ? 'bg-[#0B101D]/90 border-[#1F2937] text-slate-200' : 'bg-white/95 border-slate-300 text-slate-800'
              }`}>
                <button
                  onClick={zoomOutInput}
                  className="p-1 rounded-lg hover:bg-blue-500/20 hover:text-[#2F6BFF] transition-colors cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold px-1.5 min-w-[36px] text-center">
                  {Math.round(inputZoom * 100)}%
                </span>
                <button
                  onClick={zoomInInput}
                  className="p-1 rounded-lg hover:bg-blue-500/20 hover:text-[#2F6BFF] transition-colors cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-3 bg-slate-500/30 mx-0.5" />
                <button
                  onClick={resetInputZoom}
                  className="p-1 rounded-lg hover:bg-blue-500/20 hover:text-[#2F6BFF] transition-colors cursor-pointer"
                  title="Reset Zoom (100%)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lunar Crater Photo with Dynamic Zoom Transform */}
              <div 
                className="w-full h-full relative transition-transform duration-200 ease-out"
                style={{ transform: `scale(${inputZoom})`, transformOrigin: 'center center' }}
              >
                <img
                  src="/lunar_crater.png"
                  alt="Input Frame Lunar Crater"
                  className="w-full h-full object-cover grayscale brightness-110 contrast-125 select-none"
                />

                {/* Green Dashed Grid Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
                  <line x1="80" y1="0" x2="80" y2="300" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="160" y1="0" x2="160" y2="300" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="240" y1="0" x2="240" y2="300" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="320" y1="0" x2="320" y2="300" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />

                  <line x1="0" y1="60" x2="400" y2="60" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="0" y1="180" x2="400" y2="180" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="0" y1="240" x2="400" y2="240" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Warped Output Frame */}
          <div className={`rounded-2xl border p-3 flex flex-col transition-all ${
            darkMode ? 'bg-[#080C16] border-[#1F2937]' : 'bg-slate-50/80 border-slate-200'
          }`}>
            {/* Card Header Bar */}
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${
                darkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>
                Warped Output Frame
              </h4>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">
                {stepInfo.outputFrameTitle}
              </span>
            </div>

            {/* Frame Container */}
            <div className={`relative h-60 md:h-64 rounded-xl overflow-hidden p-1 flex items-center justify-center ${frameContainerBg} shadow-inner`}>
              {/* Floating Interactive Zoom Toolbar */}
              <div className={`absolute top-2.5 right-2.5 z-20 flex items-center gap-1 p-1 rounded-xl shadow-xl backdrop-blur-md border ${
                darkMode ? 'bg-[#0B101D]/90 border-[#1F2937] text-slate-200' : 'bg-white/95 border-slate-300 text-slate-800'
              }`}>
                <button
                  onClick={zoomOutWarped}
                  className="p-1 rounded-lg hover:bg-blue-500/20 hover:text-[#2F6BFF] transition-colors cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold px-1.5 min-w-[36px] text-center">
                  {Math.round(warpedZoom * 100)}%
                </span>
                <button
                  onClick={zoomInWarped}
                  className="p-1 rounded-lg hover:bg-blue-500/20 hover:text-[#2F6BFF] transition-colors cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-3 bg-slate-500/30 mx-0.5" />
                <button
                  onClick={resetWarpedZoom}
                  className="p-1 rounded-lg hover:bg-blue-500/20 hover:text-[#2F6BFF] transition-colors cursor-pointer"
                  title="Reset Zoom (100%)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Warped Frame Container with Dynamic Rotation & Zoom Transform */}
              <div 
                className="w-full h-full relative rounded-lg border-2 border-dashed border-[#22C55E] overflow-hidden bg-black transition-transform duration-200 ease-out"
                style={{ 
                  transform: `rotate(-2.2deg) scale(${warpedZoom * 1.02}) skewX(0.8deg)`, 
                  transformOrigin: 'center center' 
                }}
              >
                <img
                  src="/lunar_crater.png"
                  alt="Warped Output Frame Lunar Crater"
                  className="w-full h-full object-cover grayscale brightness-110 contrast-125 select-none"
                />

                {/* Green Dashed Grid Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
                  <line x1="80" y1="0" x2="80" y2="300" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="160" y1="0" x2="160" y2="300" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="240" y1="0" x2="240" y2="300" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="320" y1="0" x2="320" y2="300" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />

                  <line x1="0" y1="60" x2="400" y2="60" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="0" y1="180" x2="400" y2="180" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                  <line x1="0" y1="240" x2="400" y2="240" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="5,5" opacity="0.85" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Monospace Step Execution Log Strip */}
        <div className={`border rounded-xl p-3 font-mono text-xs space-y-1 shadow-inner ${
          darkMode ? 'bg-[#080C16] border-[#1F2937] text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-200'
        }`}>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-800 mb-1">
            <span className="font-bold uppercase tracking-wider text-[#2F6BFF]">STEP RUNTIME LOG TELEMETRY</span>
            <span>GPU CUDA Engine</span>
          </div>
          {stepInfo.logs.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#22C55E] shrink-0">&gt;</span>
              <span className={idx === stepInfo.logs.length - 1 ? 'text-slate-100 font-semibold' : 'text-slate-400'}>
                {line}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

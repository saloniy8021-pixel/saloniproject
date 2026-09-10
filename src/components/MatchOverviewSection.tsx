import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const MatchOverviewSection: React.FC = () => {
  const {
    darkMode,
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
    steps
  } = useAppState();

  const [hoveredMatch, setHoveredMatch] = useState<number | null>(null);

  const step8Done = steps.find(s => s.id === 8)?.status === 'completed' || steps.find(s => s.id === 7)?.status === 'completed';

  // Generate 24 matching vector lines & outlier points with realistic coordinates
  const allMatchLines = Array.from({ length: 24 }, (_, i) => {
    const y1 = 20 + i * 6.5 + Math.sin(i) * 6;
    const x1 = 30 + (i % 5) * 50;
    const y2 = y1 + (Math.sin(i * 2) * 8);
    const x2 = 330 + (i % 5) * 50;
    const isOutlier = i % 5 === 0;
    const error = isOutlier ? (2.8 + (i % 3) * 0.4).toFixed(2) : (0.3 + (i % 4) * 0.2).toFixed(2);
    return {
      id: i,
      x1,
      y1,
      x2,
      y2,
      isOutlier,
      error,
      srcPt: `(${Math.round(x1 * 1.7)}, ${Math.round(y1 * 2.8)})`,
      refPt: `(${Math.round(x2 * 1.7)}, ${Math.round(y2 * 2.8)})`
    };
  });

  // FILTER MATCH VECTOR LINES ACCORDING TO FILTER TABS
  const visibleMatches = allMatchLines.filter(m => {
    if (filterMode === 'inliers') return !m.isOutlier;
    if (filterMode === 'outliers') return m.isOutlier;
    return true;
  });

  const cardBg = darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0] shadow-sm';
  const textTitle = darkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className={`p-3 border-b transition-colors ${
      darkMode ? 'bg-[#0B101D] border-[#1F2937]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-xs font-bold uppercase tracking-wider ${textTitle}`}>
          MATCH OVERVIEW & POLYNOMIAL MATRIX (P)
        </h2>

        {/* Filter Toggle Buttons (Active filtering of SVG vector canvas) */}
        <div className={`flex items-center p-0.5 rounded-lg text-[10px] ${
          darkMode ? 'bg-[#0B101D] border border-[#1F2937]' : 'bg-slate-200'
        }`}>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#2F6BFF] text-white shadow-sm'
                : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-700'
            }`}
          >
            All ({totalMatches})
          </button>
          <button
            onClick={() => setFilterMode('inliers')}
            className={`px-2.5 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
              filterMode === 'inliers'
                ? 'bg-[#22C55E] text-white shadow-sm'
                : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-700'
            }`}
          >
            Inliers ({inliersCount})
          </button>
          <button
            onClick={() => setFilterMode('outliers')}
            className={`px-2.5 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
              filterMode === 'outliers'
                ? 'bg-[#EF4444] text-white shadow-sm'
                : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-700'
            }`}
          >
            Outliers ({totalMatches - inliersCount})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Left Dual Vector Match Canvas */}
        <div className={`col-span-7 ${cardBg} border rounded-xl p-3 flex flex-col justify-between`}>
          <div className="h-44 bg-[#080C16] border border-[#1F2937] rounded-lg relative overflow-hidden flex cursor-crosshair">
            <div className="w-1/2 h-full border-r border-[#1F2937] relative overflow-hidden bg-[#0D1322]">
              <svg viewBox="0 0 300 180" className="w-full h-full">
                <rect width="300" height="180" fill="#0D1322" />
                <circle cx="100" cy="90" r="40" fill="#1E2937" />
                <circle cx="95" cy="85" r="30" fill="#0B101D" />
                <circle cx="220" cy="130" r="25" fill="#1E2937" />
              </svg>
              <div className="absolute top-1 left-2 text-[9px] font-mono text-slate-400">SOURCE KEYPOINTS (OHRC)</div>
            </div>

            <div className="w-1/2 h-full relative overflow-hidden bg-[#0D1322]">
              <svg viewBox="0 0 300 180" className="w-full h-full">
                <rect width="300" height="180" fill="#0D1322" />
                <circle cx="110" cy="95" r="40" fill="#1E2937" />
                <circle cx="105" cy="90" r="30" fill="#0B101D" />
                <circle cx="230" cy="135" r="25" fill="#1E2937" />
              </svg>
              <div className="absolute top-1 left-2 text-[9px] font-mono text-slate-400">REFERENCE MATCHES (NAC)</div>
            </div>

            {/* Overlaid Matching Vectors & Points */}
            <div className="absolute inset-0 pointer-events-auto">
              <svg viewBox="0 0 600 180" className="w-full h-full">
                {visibleMatches.map((m) => {
                  const isHovered = hoveredMatch === m.id;
                  return (
                    <g
                      key={m.id}
                      onMouseEnter={() => setHoveredMatch(m.id)}
                      onMouseLeave={() => setHoveredMatch(null)}
                      className="cursor-pointer"
                    >
                      <line
                        x1={m.x1}
                        y1={m.y1}
                        x2={m.x2}
                        y2={m.y2}
                        stroke={isHovered ? '#2F6BFF' : m.isOutlier ? '#EF4444' : '#22C55E'}
                        strokeWidth={isHovered ? '2.5' : m.isOutlier ? '1' : '1.2'}
                        strokeOpacity={isHovered ? '1' : m.isOutlier ? '0.7' : '0.85'}
                      />
                      <circle
                        cx={m.x1}
                        cy={m.y1}
                        r={isHovered ? '4' : m.isOutlier ? '2.5' : '2'}
                        fill={isHovered ? '#2F6BFF' : m.isOutlier ? '#EF4444' : '#22C55E'}
                      />
                      <circle
                        cx={m.x2}
                        cy={m.y2}
                        r={isHovered ? '4' : m.isOutlier ? '2.5' : '2'}
                        fill={isHovered ? '#2F6BFF' : m.isOutlier ? '#EF4444' : '#22C55E'}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Active Hover Tooltip */}
            {hoveredMatch !== null && (() => {
              const matchObj = allMatchLines.find(m => m.id === hoveredMatch);
              if (!matchObj) return null;
              return (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#0B101D]/95 text-white border border-[#2F6BFF] px-3 py-1 rounded-lg text-[10px] font-mono shadow-xl flex items-center gap-3">
                  <div>Keypoint #{matchObj.id + 1}</div>
                  <div className="text-slate-300">Src: {matchObj.srcPt} → Ref: {matchObj.refPt}</div>
                  <div>Error: <span className={matchObj.isOutlier ? 'text-[#EF4444] font-bold' : 'text-[#22C55E] font-bold'}>{matchObj.error} px</span></div>
                  <div className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${matchObj.isOutlier ? 'bg-red-950 text-[#EF4444]' : 'bg-emerald-950 text-[#22C55E]'}`}>
                    {matchObj.isOutlier ? 'OUTLIER' : 'INLIER'}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Middle 3 Core Telemetry Metrics */}
        <div className={`col-span-2 ${cardBg} border rounded-xl p-3 flex flex-col justify-between`}>
          <h3 className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            CORE METRICS (3)
          </h3>

          <div className="space-y-2.5 my-auto">
            <div className={`p-2 rounded-lg border ${
              darkMode ? 'bg-[#0B101D] border-[#1F2937]' : 'bg-slate-50 border-[#E2E8F0]'
            }`}>
              <div className={`text-[10px] font-medium uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Inliers %</div>
              <div className="text-base font-mono font-bold text-[#22C55E]">{inlierRatio}%</div>
            </div>

            <div className={`p-2 rounded-lg border ${
              darkMode ? 'bg-[#0B101D] border-[#1F2937]' : 'bg-slate-50 border-[#E2E8F0]'
            }`}>
              <div className={`text-[10px] font-medium uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>RMSE</div>
              <div className="text-base font-mono font-bold text-[#2F6BFF]">{rmse} px</div>
            </div>

            <div className={`p-2 rounded-lg border ${
              darkMode ? 'bg-[#0B101D] border-[#1F2937]' : 'bg-slate-50 border-[#E2E8F0]'
            }`}>
              <div className={`text-[10px] font-medium uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Overlap %</div>
              <div className="text-base font-mono font-bold text-[#22C55E]">{overlapPct}%</div>
            </div>
          </div>
        </div>

        {/* Right Polynomial Matrix (P) Card */}
        <div className={`col-span-3 ${cardBg} border rounded-xl p-3 flex flex-col justify-between`}>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              POLYNOMIAL MATRIX (P)
            </h3>
            <button
              onClick={recalculateMatrix}
              className="p-1 rounded hover:bg-[#2F6BFF]/20 text-slate-400 hover:text-[#2F6BFF] transition-colors cursor-pointer"
              title="Recalculate Polynomial Matrix P"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-[#080C16] border border-[#1F2937] rounded-lg p-2.5 font-mono text-[11px] text-[#22C55E] space-y-1 shadow-inner">
            <div className="flex justify-between">
              <span>{matrixValues[0][0]}</span>
              <span>{matrixValues[0][1]}</span>
              <span className="text-emerald-300">{matrixValues[0][2]}</span>
            </div>
            <div className="flex justify-between">
              <span>{matrixValues[1][0]}</span>
              <span>{matrixValues[1][1]}</span>
              <span className="text-emerald-300">{matrixValues[1][2]}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>{matrixValues[2][0]}</span>
              <span>{matrixValues[2][1]}</span>
              <span>{matrixValues[2][2]}</span>
            </div>
          </div>

          {/* Copy Matrix Button - Disabled until Step 8 complete or populated */}
          <button
            onClick={copyMatrix}
            disabled={!step8Done}
            className={`w-full mt-2 py-1.5 text-xs font-semibold rounded-lg transition-colors border flex items-center justify-center gap-1.5 cursor-pointer ${
              !step8Done
                ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500 border-slate-700'
                : darkMode
                ? 'bg-[#0B101D] hover:bg-[#1F2937] text-slate-200 border-[#1F2937]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-[#E2E8F0]'
            }`}
          >
            {copiedMatrix ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                <span className="text-[#22C55E] font-bold font-mono">Copied Matrix!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Polynomial Matrix</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

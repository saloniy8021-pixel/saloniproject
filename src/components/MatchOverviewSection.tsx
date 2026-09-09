import React, { useState } from 'react';

interface MatchOverviewSectionProps {
  darkMode: boolean;
}

export const MatchOverviewSection: React.FC<MatchOverviewSectionProps> = ({ darkMode }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'inliers' | 'outliers'>('all');
  const [hoveredMatch, setHoveredMatch] = useState<number | null>(null);

  // Generate 24 matching vector lines & outlier points with realistic coordinates
  const allMatchLines = Array.from({ length: 24 }, (_, i) => {
    const y1 = 20 + i * 6.5 + Math.sin(i) * 6;
    const x1 = 30 + (i % 5) * 50;
    const y2 = y1 + (Math.sin(i * 2) * 8);
    const x2 = 330 + (i % 5) * 50;
    const isOutlier = i % 5 === 0;
    const error = isOutlier ? (2.8 + (i % 3) * 0.4).toFixed(2) : (0.3 + (i % 4) * 0.2).toFixed(2);
    return { id: i, x1, y1, x2, y2, isOutlier, error, srcPt: `(${Math.round(x1 * 1.7)}, ${Math.round(y1 * 2.8)})`, refPt: `(${Math.round(x2 * 1.7)}, ${Math.round(y2 * 2.8)})` };
  });

  const visibleMatches = allMatchLines.filter(m => {
    if (filterMode === 'inliers') return !m.isOutlier;
    if (filterMode === 'outliers') return m.isOutlier;
    return true;
  });

  const cardBg = darkMode ? 'bg-[#131C31] border-[#1E2A45]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = darkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className={`p-3 border-b transition-colors ${
      darkMode ? 'bg-[#0B101D] border-[#1E2A45]' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-xs font-bold uppercase tracking-wider ${textTitle}`}>
          MATCH OVERVIEW (After RANSAC)
        </h2>

        {/* Filter Toggle Buttons */}
        <div className={`flex items-center p-0.5 rounded-lg text-[10px] ${
          darkMode ? 'bg-[#0E1527] border border-[#1E2A45]' : 'bg-slate-200'
        }`}>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-blue-600 text-white'
                : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-700'
            }`}
          >
            All (1258)
          </button>
          <button
            onClick={() => setFilterMode('inliers')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
              filterMode === 'inliers'
                ? 'bg-emerald-600 text-white'
                : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-700'
            }`}
          >
            Inliers (982)
          </button>
          <button
            onClick={() => setFilterMode('outliers')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
              filterMode === 'outliers'
                ? 'bg-red-600 text-white'
                : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-700'
            }`}
          >
            Outliers (276)
          </button>
        </div>
      </div>

      <div className={`${cardBg} border rounded-xl p-3 grid grid-cols-12 gap-3 items-center transition-colors`}>
        {/* Left Side-by-Side Dual Image Vector Match Canvas */}
        <div className="col-span-8 h-44 bg-[#090D18] border border-[#1E2A45] rounded-lg relative overflow-hidden flex cursor-crosshair">
          <div className="w-1/2 h-full border-r border-slate-700/50 relative overflow-hidden bg-[#101726]">
            <svg viewBox="0 0 300 180" className="w-full h-full">
              <rect width="300" height="180" fill="#141D2E" />
              <circle cx="100" cy="90" r="40" fill="#243044" />
              <circle cx="95" cy="85" r="30" fill="#0C1322" />
              <circle cx="220" cy="130" r="25" fill="#202A3C" />
            </svg>
            <div className="absolute top-1 left-2 text-[9px] font-mono text-slate-400">SOURCE KEYPOINTS</div>
          </div>

          <div className="w-1/2 h-full relative overflow-hidden bg-[#101726]">
            <svg viewBox="0 0 300 180" className="w-full h-full">
              <rect width="300" height="180" fill="#141D2E" />
              <circle cx="110" cy="95" r="40" fill="#243044" />
              <circle cx="105" cy="90" r="30" fill="#0C1322" />
              <circle cx="230" cy="135" r="25" fill="#202A3C" />
            </svg>
            <div className="absolute top-1 left-2 text-[9px] font-mono text-slate-400">REFERENCE MATCHES</div>
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
                      stroke={isHovered ? '#3B82F6' : m.isOutlier ? '#DC2626' : '#22C55E'}
                      strokeWidth={isHovered ? '2.5' : m.isOutlier ? '1' : '1.2'}
                      strokeOpacity={isHovered ? '1' : m.isOutlier ? '0.7' : '0.85'}
                    />
                    <circle
                      cx={m.x1}
                      cy={m.y1}
                      r={isHovered ? '4' : m.isOutlier ? '2.5' : '2'}
                      fill={isHovered ? '#3B82F6' : m.isOutlier ? '#DC2626' : '#22C55E'}
                    />
                    <circle
                      cx={m.x2}
                      cy={m.y2}
                      r={isHovered ? '4' : m.isOutlier ? '2.5' : '2'}
                      fill={isHovered ? '#3B82F6' : m.isOutlier ? '#DC2626' : '#22C55E'}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active Hover Match Info Tooltip */}
          {hoveredMatch !== null && (() => {
            const matchObj = allMatchLines.find(m => m.id === hoveredMatch);
            if (!matchObj) return null;
            return (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/90 text-white border border-blue-500/60 px-3 py-1 rounded-lg text-[10px] font-mono shadow-xl flex items-center gap-3">
                <div>Keypoint #{matchObj.id + 1}</div>
                <div className="text-slate-300">Src: {matchObj.srcPt} → Ref: {matchObj.refPt}</div>
                <div>Error: <span className={matchObj.isOutlier ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{matchObj.error} px</span></div>
                <div className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${matchObj.isOutlier ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'}`}>
                  {matchObj.isOutlier ? 'OUTLIER' : 'INLIER'}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right Match Statistics Panel */}
        <div className="col-span-4 space-y-2 text-xs font-mono">
          <div className={`flex items-center gap-4 text-xs font-sans pb-1 border-b ${
            darkMode ? 'border-[#1E2A45]' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Inliers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Outliers</span>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between">
              <span className={`font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Matches</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>1258</span>
            </div>

            <div className="flex justify-between">
              <span className={`font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Inliers</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">982</span>
            </div>

            <div className="flex justify-between">
              <span className={`font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Outlier Ratio</span>
              <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>22.0 %</span>
            </div>

            <div className="flex justify-between">
              <span className={`font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Inlier Ratio</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">78.0 %</span>
            </div>

            <div className={`flex justify-between pt-1 border-t ${
              darkMode ? 'border-[#1E2A45]' : 'border-slate-200'
            }`}>
              <span className={`font-sans ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>RMSE</span>
              <span className="text-red-500 font-bold text-sm">1.34 px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

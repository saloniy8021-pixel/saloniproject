import React from 'react';
import { CheckCircle2, SlidersHorizontal, MapPin, Database } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const DataLoadingSection: React.FC = () => {
  const { darkMode, ohrcTile, nacTile, setActiveModal, overlapPct } = useAppState();

  const cardBg = darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0] shadow-sm';
  const textTitle = darkMode ? 'text-slate-200' : 'text-slate-800';
  const textSub = darkMode ? 'text-slate-400' : 'text-slate-600';
  const textVal = darkMode ? 'text-slate-100 font-semibold' : 'text-slate-900 font-bold';
  const borderLine = darkMode ? 'border-[#1F2937]' : 'border-[#E2E8F0]';
  const btnStyle = darkMode
    ? 'bg-[#0B101D] hover:bg-[#1F2937] text-slate-200 border-[#1F2937]'
    : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-[#CBD5E1] shadow-xs';

  return (
    <div className={`p-3 border-b transition-colors ${
      darkMode ? 'bg-[#0B101D] border-[#1F2937]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* CARD 1: SOURCE SENSOR (OHRC) */}
        <div className={`${cardBg} border rounded-xl p-3 flex flex-col justify-between transition-colors min-h-[165px]`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-[10.5px] font-bold uppercase tracking-tight truncate ${textTitle}`}>
                SOURCE (OHRC - CHANDRAYAAN-2)
              </h3>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                darkMode ? 'bg-blue-950/80 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                SOURCE
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-lg p-0.5 shadow flex items-center justify-center shrink-0 border ${
                darkMode 
                  ? 'bg-gradient-to-tr from-slate-800 via-blue-900 to-indigo-900 border-blue-500/40' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <Database className="w-5 h-5 text-blue-500" />
              </div>

              <div className="space-y-0.5 text-[11px] min-w-0 flex-1 leading-tight font-mono">
                <div className={textSub}>
                  GSD: <span className={textVal}>{ohrcTile.gsd}</span>
                </div>
                <div className={textSub}>
                  Dim: <span className={textVal}>{ohrcTile.dimensions}</span>
                </div>
                <div className="flex items-center gap-1 text-[#22C55E] text-[10px] font-semibold pt-0.5">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span className="truncate" title={ohrcTile.name}>{ohrcTile.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2.5">
            <button
              onClick={() => setActiveModal('Change Tile OHRC')}
              className={`w-full py-1 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${btnStyle}`}
            >
              Select / Change OHRC Tile
            </button>
          </div>
        </div>

        {/* CARD 2: REFERENCE SENSOR (NAC) */}
        <div className={`${cardBg} border rounded-xl p-3 flex flex-col justify-between transition-colors min-h-[165px]`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-[10.5px] font-bold uppercase tracking-tight truncate ${textTitle}`}>
                REFERENCE (NAC - LROC)
              </h3>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                darkMode ? 'bg-emerald-950/80 text-[#22C55E] border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                REF
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-lg p-0.5 shadow flex items-center justify-center shrink-0 border ${
                darkMode 
                  ? 'bg-gradient-to-tr from-slate-800 via-emerald-900 to-teal-900 border-emerald-500/40' 
                  : 'bg-emerald-50 border-emerald-200'
              }`}>
                <MapPin className="w-5 h-5 text-[#22C55E]" />
              </div>

              <div className="space-y-0.5 text-[11px] min-w-0 flex-1 leading-tight font-mono">
                <div className={textSub}>
                  GSD: <span className={textVal}>{nacTile.gsd}</span>
                </div>
                <div className={textSub}>
                  CRS: <span className={textVal}>EPSG:104903</span>
                </div>
                <div className="flex items-center gap-1 text-[#22C55E] text-[10px] font-semibold pt-0.5">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span className="truncate" title={nacTile.name}>{nacTile.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2.5">
            <button
              onClick={() => setActiveModal('Change Tile NAC')}
              className={`w-full py-1 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${btnStyle}`}
            >
              Select / Change NAC Tile
            </button>
          </div>
        </div>

        {/* CARD 3: INTENSITY NORMALIZATION (HISTOGRAM OVERLAY) */}
        <div className={`${cardBg} border rounded-xl p-3 flex flex-col justify-between transition-colors min-h-[165px]`}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className={`text-[10.5px] font-bold uppercase tracking-tight ${textTitle}`}>
                HISTOGRAM NORMALIZATION
              </h3>
              <span className="text-[9px] font-mono text-[#22C55E] font-bold">CLAHE 2.0</span>
            </div>

            {/* SVG Before/After Histogram overlay chart */}
            <div className={`h-14 w-full border rounded-lg p-1 relative overflow-hidden flex items-center justify-center ${
              darkMode ? 'bg-[#080C16] border-[#1F2937]' : 'bg-slate-900 border-slate-800'
            }`}>
              <svg viewBox="0 0 200 50" className="w-full h-full">
                {/* Pre-normalization distribution (red curve) */}
                <path
                  d="M 10,45 Q 40,5 70,42 T 130,44 T 190,45"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="1.2"
                  strokeDasharray="2,2"
                  opacity="0.75"
                />
                {/* Post-normalization distribution (green curve) */}
                <path
                  d="M 10,45 Q 60,12 100,10 T 150,25 T 190,45"
                  fill="rgba(34, 197, 94, 0.15)"
                  stroke="#22C55E"
                  strokeWidth="1.8"
                />
              </svg>
              <div className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-300 bg-black/70 px-1 rounded">
                Diff: 34% → 4%
              </div>
            </div>
          </div>

          <div className="mt-1 flex justify-between items-center text-[10px] font-mono">
            <span className={textSub}>Mean Match:</span>
            <span className="text-[#22C55E] font-bold">96.0% (Matched)</span>
          </div>
        </div>

        {/* CARD 4: GEOREFERENCING & FOOTPRINT OVERLAP */}
        <div className={`${cardBg} border rounded-xl p-3 flex flex-col justify-between transition-colors min-h-[165px]`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-[10.5px] font-bold uppercase tracking-tight ${textTitle}`}>
                GEOREFERENCING & FOOTPRINT
              </h3>
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
            </div>

            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className={textSub}>CRS Datum:</span>
                <span className={textVal}>Moon 2000</span>
              </div>
              <div className="flex justify-between">
                <span className={textSub}>Footprint Overlap:</span>
                <span className="font-bold text-[#22C55E]">{overlapPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className={textSub}>Corner RMS Error:</span>
                <span className="font-bold text-blue-500">0.4 px</span>
              </div>
            </div>
          </div>

          <div className={`mt-2 pt-1 border-t ${borderLine} text-[10px] font-mono text-center ${textSub}`}>
            Reprojection Engine: PROJ4 Lunar Selenodesy
          </div>
        </div>
      </div>
    </div>
  );
};

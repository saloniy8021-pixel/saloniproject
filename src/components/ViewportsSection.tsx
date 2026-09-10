import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Search,
  Maximize2,
  RotateCw,
  Hand,
  Crosshair,
  Link2
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const ViewportsSection: React.FC = () => {
  const { darkMode, syncZoom, setSyncZoom, ohrcTile, nacTile } = useAppState();

  const [zoomSource, setZoomSource] = useState<number>(100);
  const [zoomRef, setZoomRef] = useState<number>(100);
  const [showReticle, setShowReticle] = useState<boolean>(true);
  const [rotationSource, setRotationSource] = useState<number>(0);
  const [rotationRef, setRotationRef] = useState<number>(0);
  const [handToolActive, setHandToolActive] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Pan offsets
  const [panSource, setPanSource] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panRef, setPanRef] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const cardBg = darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0] shadow-sm';
  const headerBg = darkMode ? 'bg-[#080C16] border-[#1F2937]' : 'bg-slate-100 border-[#E2E8F0]';
  const textTitle = darkMode ? 'text-slate-300' : 'text-slate-700';

  const handleZoom = (type: 'source' | 'ref', delta: number) => {
    if (syncZoom) {
      setZoomSource(prev => Math.max(50, Math.min(300, prev + delta)));
      setZoomRef(prev => Math.max(50, Math.min(300, prev + delta)));
    } else {
      if (type === 'source') {
        setZoomSource(prev => Math.max(50, Math.min(300, prev + delta)));
      } else {
        setZoomRef(prev => Math.max(50, Math.min(300, prev + delta)));
      }
    }
  };

  const handleReset = () => {
    setZoomSource(100);
    setZoomRef(100);
    setPanSource({ x: 0, y: 0 });
    setPanRef({ x: 0, y: 0 });
    setRotationSource(0);
    setRotationRef(0);
  };

  // Mouse pan drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent, type: 'source' | 'ref') => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    if (syncZoom) {
      setPanSource(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setPanRef(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    } else if (type === 'source') {
      setPanSource(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    } else {
      setPanRef(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={`grid grid-cols-12 gap-3 p-3 border-b transition-colors ${
      darkMode ? 'bg-[#0B101D] border-[#1F2937]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
    } ${isFullscreen ? 'fixed inset-0 z-50 p-6 bg-[#0B101D]' : ''}`}>
      {/* SOURCE IMAGE VIEWPORT (OHRC) */}
      <div className={`${cardBg} border rounded-xl overflow-hidden flex flex-col col-span-6 transition-colors`}>
        <div className={`px-3 py-1.5 border-b flex items-center justify-between ${headerBg}`}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
            <h3 className={`text-[11px] font-bold uppercase tracking-wider truncate ${textTitle}`}>
              SOURCE VIEWPORT (OHRC - {ohrcTile.gsd})
            </h3>
            <span className="text-[10px] font-mono font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded truncate max-w-[150px]" title={ohrcTile.name}>
              {ohrcTile.name}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <button
              onClick={() => handleZoom('source', 15)}
              className="p-1 hover:text-white hover:bg-[#2F6BFF] rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom('source', -15)}
              className="p-1 hover:text-white hover:bg-[#2F6BFF] rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleReset()}
              className="p-1 hover:text-white hover:bg-[#2F6BFF] rounded transition-colors cursor-pointer"
              title="Fit to Window"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:text-white hover:bg-[#2F6BFF] rounded transition-colors cursor-pointer"
              title="Toggle Fullscreen View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setRotationSource(prev => (prev + 90) % 360)}
              className="p-1 hover:text-white hover:bg-[#2F6BFF] rounded transition-colors cursor-pointer"
              title="Rotate 90° Clockwise"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setHandToolActive(!handToolActive)}
              className={`p-1 rounded transition-colors cursor-pointer ${
                handToolActive ? 'bg-[#2F6BFF] text-white' : 'hover:text-white hover:bg-[#2F6BFF]'
              }`}
              title="Hand Pan Tool"
            >
              <Hand className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] font-mono font-bold text-blue-400 px-1">{zoomSource}%</span>
          </div>
        </div>

        {/* Viewport Canvas (OHRC Lunar Crater) */}
        <div
          className="h-56 bg-[#080C16] relative overflow-hidden flex items-center justify-center cursor-crosshair select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => handleMouseMove(e, 'source')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `scale(${zoomSource / 100}) rotate(${rotationSource}deg) translate(${panSource.x}px, ${panSource.y}px)`
            }}
          >
            {ohrcTile.imageUrl ? (
              <img src={ohrcTile.imageUrl} alt={ohrcTile.name} className="max-h-full max-w-full object-contain pointer-events-none p-2" />
            ) : (
              <svg viewBox="0 0 500 250" className="w-full h-full">
                <defs>
                  <radialGradient id="ohrc-crater" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="60%" stopColor="#1E2937" />
                    <stop offset="100%" stopColor="#0B101D" />
                  </radialGradient>
                </defs>

                <rect width="500" height="250" fill="#0D1322" />
                {/* Moon Surface Regolith Craters */}
                <circle cx="250" cy="125" r="75" fill="url(#ohrc-crater)" stroke="#334155" strokeWidth="1" />
                <circle cx="238" cy="112" r="58" fill="#0B101D" />
                <circle cx="225" cy="100" r="18" fill="#334155" />

                <circle cx="100" cy="70" r="32" fill="#1E2937" stroke="#334155" strokeWidth="0.8" />
                <circle cx="390" cy="180" r="42" fill="#1E2937" stroke="#334155" strokeWidth="0.8" />

                {/* SuperPoint Keypoints overlay dots */}
                <circle cx="250" cy="125" r="3" fill="#2F6BFF" />
                <circle cx="238" cy="112" r="3" fill="#2F6BFF" />
                <circle cx="225" cy="100" r="3" fill="#2F6BFF" />
                <circle cx="100" cy="70" r="3" fill="#2F6BFF" />
                <circle cx="390" cy="180" r="3" fill="#2F6BFF" />
              </svg>
            )}
          </div>

          {/* Crosshair Reticle Overlay */}
          {showReticle && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-full h-[1px] bg-cyan-400/30"></div>
              <div className="h-full w-[1px] bg-cyan-400/30 absolute"></div>
              <div className="w-6 h-6 border border-cyan-400/50 rounded-full absolute"></div>
            </div>
          )}

          {/* Reticle Coordinates Badge */}
          <div className="absolute bottom-2 left-2 bg-[#0B101D]/90 border border-[#1F2937] px-2 py-0.5 rounded text-[9.5px] font-mono text-slate-300 pointer-events-none flex items-center gap-2">
            <span>File: {ohrcTile.name}</span>
            <span className="text-cyan-400">Lat: 88.5°S Long: 0.2°E</span>
          </div>
        </div>
      </div>

      {/* REFERENCE IMAGE VIEWPORT (NAC) */}
      <div className={`${cardBg} border rounded-xl overflow-hidden flex flex-col col-span-6 transition-colors`}>
        <div className={`px-3 py-1.5 border-b flex items-center justify-between ${headerBg}`}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0"></span>
            <h3 className={`text-[11px] font-bold uppercase tracking-wider truncate ${textTitle}`}>
              REFERENCE VIEWPORT (NAC - {nacTile.gsd})
            </h3>
            <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded truncate max-w-[150px]" title={nacTile.name}>
              {nacTile.name}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            {/* Sync-Zoom Link Toggle */}
            <button
              onClick={() => setSyncZoom(!syncZoom)}
              className={`p-1 rounded transition-colors flex items-center gap-1 text-[10px] font-mono font-bold cursor-pointer ${
                syncZoom
                  ? 'bg-[#2F6BFF] text-white border border-blue-400'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
              }`}
              title="Toggle Synchronized Dual Viewport Zoom & Pan"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>{syncZoom ? 'SYNCED' : 'LINK'}</span>
            </button>

            <button
              onClick={() => handleZoom('ref', 15)}
              className="p-1 hover:text-white hover:bg-[#2F6BFF] rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom('ref', -15)}
              className="p-1 hover:text-white hover:bg-[#2F6BFF] rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleReset()}
              className="p-1 hover:text-white hover:bg-[#2F6BFF] rounded transition-colors cursor-pointer"
              title="Fit to Window"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowReticle(!showReticle)}
              className={`p-1 rounded transition-colors cursor-pointer ${
                showReticle ? 'bg-cyan-600 text-white' : 'hover:text-white hover:bg-[#2F6BFF]'
              }`}
              title="Toggle Crosshair Reticle"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] font-mono font-bold text-[#22C55E] px-1">{zoomRef}%</span>
          </div>
        </div>

        {/* Viewport Canvas (NAC Reference Lunar Crater) */}
        <div
          className="h-56 bg-[#080C16] relative overflow-hidden flex items-center justify-center cursor-crosshair select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => handleMouseMove(e, 'ref')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `scale(${zoomRef / 100}) rotate(${rotationRef}deg) translate(${panRef.x}px, ${panRef.y}px)`
            }}
          >
            {nacTile.imageUrl ? (
              <img src={nacTile.imageUrl} alt={nacTile.name} className="max-h-full max-w-full object-contain pointer-events-none p-2" />
            ) : (
              <svg viewBox="0 0 500 250" className="w-full h-full">
                <defs>
                  <radialGradient id="nac-crater" cx="42%" cy="42%" r="60%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="60%" stopColor="#1E2937" />
                    <stop offset="100%" stopColor="#0B101D" />
                  </radialGradient>
                </defs>

                <rect width="500" height="250" fill="#0D1322" />
                {/* LROC NAC Reference Crater */}
                <circle cx="260" cy="130" r="75" fill="url(#nac-crater)" stroke="#475569" strokeWidth="1" />
                <circle cx="248" cy="117" r="58" fill="#0B101D" />
                <circle cx="235" cy="105" r="18" fill="#334155" />

                <circle cx="110" cy="75" r="32" fill="#1E2937" stroke="#475569" strokeWidth="0.8" />
                <circle cx="400" cy="185" r="42" fill="#1E2937" stroke="#475569" strokeWidth="0.8" />

                {/* SuperGlue Target Keypoints overlay dots */}
                <circle cx="260" cy="130" r="3" fill="#22C55E" />
                <circle cx="248" cy="117" r="3" fill="#22C55E" />
                <circle cx="235" cy="105" r="3" fill="#22C55E" />
                <circle cx="110" cy="75" r="3" fill="#22C55E" />
                <circle cx="400" cy="185" r="3" fill="#22C55E" />
              </svg>
            )}
          </div>

          {/* Crosshair Reticle Overlay */}
          {showReticle && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-full h-[1px] bg-cyan-400/30"></div>
              <div className="h-full w-[1px] bg-cyan-400/30 absolute"></div>
              <div className="w-6 h-6 border border-cyan-400/50 rounded-full absolute"></div>
            </div>
          )}

          {/* Reticle Coordinates Badge */}
          <div className="absolute bottom-2 left-2 bg-[#0B101D]/90 border border-[#1F2937] px-2 py-0.5 rounded text-[9.5px] font-mono text-slate-300 pointer-events-none flex items-center gap-2">
            <span>File: {nacTile.name}</span>
            <span className="text-[#22C55E]">Lat: 88.4°S Long: 0.3°E</span>
          </div>
        </div>
      </div>
    </div>
  );
};

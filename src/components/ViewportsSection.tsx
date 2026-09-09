import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Search,
  Maximize2,
  RotateCw,
  Hand,
  Crosshair,
  RefreshCw,
  Link2
} from 'lucide-react';

interface ViewportsSectionProps {
  darkMode: boolean;
  selectedBand: number;
}

export const ViewportsSection: React.FC<ViewportsSectionProps> = ({ darkMode, selectedBand }) => {
  const [zoomSource, setZoomSource] = useState(100);
  const [zoomRef, setZoomRef] = useState(100);
  const [syncZoom, setSyncZoom] = useState(true);
  const [showReticle, setShowReticle] = useState(true);
  const [rotationSource, setRotationSource] = useState(0);
  const [rotationRef, setRotationRef] = useState(0);
  const [handToolActive, setHandToolActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pan offsets
  const [panSource, setPanSource] = useState({ x: 0, y: 0 });
  const [panRef, setPanRef] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const cardBg = darkMode ? 'bg-[#131C31] border-[#1E2A45]' : 'bg-white border-slate-200 shadow-sm';
  const headerBg = darkMode ? 'bg-[#0E1527] border-[#1E2A45]' : 'bg-slate-100 border-slate-200';
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
      darkMode ? 'bg-[#0B101D] border-[#1E2A45]' : 'bg-slate-50 border-slate-200'
    } ${isFullscreen ? 'fixed inset-0 z-50 p-6 bg-[#0B101D]' : ''}`}>
      {/* SOURCE IMAGE (IIRS - Band XX) */}
      <div className={`${cardBg} border rounded-xl overflow-hidden flex flex-col col-span-6 transition-colors`}>
        <div className={`px-3 py-1.5 border-b flex items-center justify-between ${headerBg}`}>
          <h3 className={`text-[11px] font-bold uppercase tracking-wider ${textTitle}`}>
            SOURCE IMAGE (IIRS - Band {selectedBand})
          </h3>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={() => handleZoom('source', 15)}
              className="p-1 hover:text-white hover:bg-blue-600 rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom('source', -15)}
              className="p-1 hover:text-white hover:bg-blue-600 rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleReset()}
              className="p-1 hover:text-white hover:bg-blue-600 rounded transition-colors cursor-pointer"
              title="Fit to Window"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:text-white hover:bg-blue-600 rounded transition-colors cursor-pointer"
              title="Toggle Fullscreen View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setRotationSource(prev => (prev + 90) % 360)}
              className="p-1 hover:text-white hover:bg-blue-600 rounded transition-colors cursor-pointer"
              title="Rotate 90° Clockwise"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setHandToolActive(!handToolActive)}
              className={`p-1 rounded transition-colors cursor-pointer ${
                handToolActive ? 'bg-blue-600 text-white' : 'hover:text-white hover:bg-blue-600'
              }`}
              title="Hand Pan Tool"
            >
              <Hand className="w-3.5 h-3.5" />
            </button>

            <select
              value={`${zoomSource}%`}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setZoomSource(val);
                if (syncZoom) setZoomRef(val);
              }}
              className={`border rounded px-1.5 py-0.5 text-[11px] focus:outline-none cursor-pointer ${
                darkMode ? 'bg-[#0B101D] text-slate-300 border-[#1E2A45]' : 'bg-white text-slate-800 border-slate-300'
              }`}
            >
              <option value="50%">50%</option>
              <option value="100%">100%</option>
              <option value="150%">150%</option>
              <option value="200%">200%</option>
              <option value="300%">300%</option>
            </select>
          </div>
        </div>

        {/* Viewport Image Area */}
        <div
          className={`h-64 bg-[#090D18] relative overflow-hidden flex items-center justify-center ${
            handToolActive || isDragging ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => handleMouseMove(e, 'source')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            style={{
              transform: `translate(${panSource.x}px, ${panSource.y}px) scale(${zoomSource / 100}) rotate(${rotationSource}deg)`
            }}
            className="transition-transform duration-75 w-full h-full relative flex items-center justify-center"
          >
            <svg viewBox="0 0 500 300" className="w-full h-full bg-[#121929]">
              <defs>
                <radialGradient id="crater-grad-1" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#414F69" />
                  <stop offset="60%" stopColor="#1E283A" />
                  <stop offset="100%" stopColor="#0E1524" />
                </radialGradient>
                <radialGradient id="crater-grad-2" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#556682" />
                  <stop offset="70%" stopColor="#253248" />
                  <stop offset="100%" stopColor="#0B111E" />
                </radialGradient>
              </defs>

              <rect width="500" height="300" fill="#151D2E" />

              <circle cx="120" cy="140" r="45" fill="url(#crater-grad-1)" />
              <circle cx="115" cy="135" r="35" fill="#0D1422" />
              <circle cx="110" cy="130" r="10" fill="#2E3A52" />

              <circle cx="280" cy="90" r="30" fill="url(#crater-grad-2)" />
              <circle cx="275" cy="86" r="22" fill="#0C121F" />

              <circle cx="410" cy="210" r="55" fill="url(#crater-grad-1)" />
              <circle cx="400" cy="200" r="42" fill="#0A0F1B" />

              <circle cx="220" cy="230" r="25" fill="url(#crater-grad-2)" />

              {/* Band 73 Spectral false color tint overlay */}
              <rect width="500" height="300" fill="rgba(34, 197, 94, 0.04)" style={{ mixBlendMode: 'screen' }} />
            </svg>
          </div>

          {/* Crosshair Overlay */}
          {showReticle && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-full h-[1px] bg-cyan-400/40"></div>
              <div className="h-full w-[1px] bg-cyan-400/40 absolute"></div>
              <div className="w-12 h-12 border border-cyan-400/50 rounded-full absolute"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full absolute"></div>
            </div>
          )}

          <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
            512 × 512 | Band {selectedBand}
          </div>

          <div className="absolute bottom-2 right-2 bg-slate-900/90 text-white border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5">
            <div className="w-8 h-0.5 bg-white"></div>
            <span>10 km</span>
          </div>
        </div>
      </div>

      {/* REFERENCE IMAGE (WAC) */}
      <div className={`${cardBg} border rounded-xl overflow-hidden flex flex-col col-span-6 transition-colors`}>
        <div className={`px-3 py-1.5 border-b flex items-center justify-between ${headerBg}`}>
          <h3 className={`text-[11px] font-bold uppercase tracking-wider ${textTitle}`}>
            REFERENCE IMAGE (WAC)
          </h3>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={() => handleZoom('ref', 15)}
              className="p-1 hover:text-white hover:bg-blue-600 rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom('ref', -15)}
              className="p-1 hover:text-white hover:bg-blue-600 rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowReticle(!showReticle)}
              className={`p-1 rounded transition-colors cursor-pointer ${
                showReticle ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-800' : 'hover:text-white hover:bg-blue-600'
              }`}
              title="Toggle Crosshair Reticle Grid"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleReset()}
              className="p-1 hover:text-white hover:bg-blue-600 rounded transition-colors cursor-pointer"
              title="Reset Zoom & Pan"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <select
              value={`${zoomRef}%`}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setZoomRef(val);
                if (syncZoom) setZoomSource(val);
              }}
              className={`border rounded px-1.5 py-0.5 text-[11px] focus:outline-none cursor-pointer ${
                darkMode ? 'bg-[#0B101D] text-slate-300 border-[#1E2A45]' : 'bg-white text-slate-800 border-slate-300'
              }`}
            >
              <option value="50%">50%</option>
              <option value="100%">100%</option>
              <option value="150%">150%</option>
              <option value="200%">200%</option>
              <option value="300%">300%</option>
            </select>

            <button
              onClick={() => setSyncZoom(!syncZoom)}
              className={`p-1 rounded transition-colors cursor-pointer ${syncZoom ? 'text-blue-400 bg-blue-950/60 border border-blue-800' : 'text-slate-500'}`}
              title="Sync Dual Viewports"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Viewport Image Area */}
        <div
          className={`h-64 bg-[#090D18] relative overflow-hidden flex items-center justify-center ${
            handToolActive || isDragging ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => handleMouseMove(e, 'ref')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            style={{
              transform: `translate(${panRef.x}px, ${panRef.y}px) scale(${zoomRef / 100}) rotate(${rotationRef}deg)`
            }}
            className="transition-transform duration-75 w-full h-full relative flex items-center justify-center"
          >
            <svg viewBox="0 0 500 300" className="w-full h-full bg-[#121929]">
              <defs>
                <radialGradient id="ref-crater-main" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#647896" />
                  <stop offset="50%" stopColor="#313E54" />
                  <stop offset="85%" stopColor="#141C2B" />
                  <stop offset="100%" stopColor="#0B111E" />
                </radialGradient>
              </defs>

              <rect width="500" height="300" fill="#151D2E" />
              <circle cx="260" cy="150" r="75" fill="url(#ref-crater-main)" />
              <circle cx="250" cy="140" r="60" fill="#0C1220" />
              <circle cx="242" cy="132" r="18" fill="#4B5C78" />

              <circle cx="100" cy="80" r="28" fill="#253248" />
              <circle cx="420" cy="130" r="35" fill="#29364F" />
            </svg>
          </div>

          {/* Crosshair Overlay */}
          {showReticle && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-full h-[1px] bg-cyan-400/40"></div>
              <div className="h-full w-[1px] bg-cyan-400/40 absolute"></div>
              <div className="w-12 h-12 border border-cyan-400/50 rounded-full absolute"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full absolute"></div>
            </div>
          )}

          <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
            1024 × 1024 | Visible WAC
          </div>

          <div className="absolute bottom-2 right-2 bg-slate-900/90 text-white border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5">
            <div className="w-8 h-0.5 bg-white"></div>
            <span>10 km</span>
          </div>
        </div>
      </div>
    </div>
  );
};

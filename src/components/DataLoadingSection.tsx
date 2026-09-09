import React, { useState } from 'react';
import { CheckCircle2, Upload, Database, Layers, Sliders, X } from 'lucide-react';

interface DataLoadingSectionProps {
  darkMode: boolean;
  onSelectBand: (band: number) => void;
  selectedBand: number;
  onLogMsg: (msg: string) => void;
}

export const DataLoadingSection: React.FC<DataLoadingSectionProps> = ({
  darkMode,
  onSelectBand,
  selectedBand,
  onLogMsg
}) => {
  // Modal States
  const [bandInputModal, setBandInputModal] = useState(false);
  const [cubeModalOpen, setCubeModalOpen] = useState(false);
  const [wacModalOpen, setWacModalOpen] = useState(false);
  const [tmcModalOpen, setTmcModalOpen] = useState(false);

  // Data States
  const [customBand, setCustomBand] = useState(selectedBand.toString());
  const [cubeStatus, setCubeStatus] = useState('512 × 512 × 242');
  const [cubeName, setCubeName] = useState('ch2_iirs_nmp_20200115t083022_d_img.hdr');
  const [wacStatus, setWacStatus] = useState('1024 × 1024');
  const [wacName, setWacName] = useState('lroc_wac_visible_global_100m.tif');
  const [tmcStatus, setTmcStatus] = useState('512 × 512');
  const [tmcName, setTmcName] = useState('ch2_tmc2_ortho_5m_pass.tif');

  // Hover state for interactive spectral graph
  const [hoveredBand, setHoveredBand] = useState<number | null>(null);

  // Dynamic wavelength calculation: lambda = 0.8 + (band - 1) * 0.0174 um
  const calculateWavelength = (band: number) => (0.8 + (band - 1) * 0.0174).toFixed(2);
  const calculateScore = (band: number) => {
    // Peak near band 73 (~0.87)
    const dist = Math.abs(band - 73);
    const score = Math.max(0.42, 0.87 - dist * 0.0035 + Math.sin(band / 5) * 0.04);
    return score.toFixed(2);
  };

  const currentWavelength = calculateWavelength(selectedBand);
  const currentScore = calculateScore(selectedBand);

  const cardBg = darkMode ? 'bg-[#131C31] border-[#1E2A45]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = darkMode ? 'text-slate-200' : 'text-slate-800';
  const textSub = darkMode ? 'text-slate-400' : 'text-slate-600';
  const btnStyle = darkMode
    ? 'bg-[#1E2A45] hover:bg-slate-700 text-white border-slate-700'
    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300';

  return (
    <div className={`p-3 border-b transition-colors font-sf ${darkMode ? 'bg-[#0B101D] border-[#1E2A45]' : 'bg-slate-50 border-slate-200'}`}>
      <h2 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        DATA LOADING
      </h2>

      <div className="grid grid-cols-4 gap-3">
        {/* CARD 1: SOURCE SENSOR */}
        <div className={`${cardBg} border rounded-xl p-3 flex flex-col justify-between transition-colors min-h-[175px]`}>
          <div>
            <h3 className={`text-[10.5px] font-bold uppercase tracking-tight mb-2.5 whitespace-nowrap overflow-hidden text-ellipsis ${textTitle}`}>
              SOURCE SENSOR (IIRS - HYPERSPECTRAL)
            </h3>

            <div className="flex items-center gap-2.5">
              {/* 3D Hyperspectral Cube Preview */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-900 via-emerald-800 to-cyan-700 p-0.5 shadow flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#0E1527] rounded flex items-center justify-center">
                  <div className="w-7 h-7 border border-cyan-400/60 bg-gradient-to-br from-emerald-500/30 to-purple-500/30 transform -rotate-12 skew-x-6 flex items-center justify-center font-bold text-[8px] text-emerald-300 font-sf">
                    242 B
                  </div>
                </div>
              </div>

              <div className="space-y-0.5 text-[11px] min-w-0 flex-1 leading-tight">
                <div className={textSub}>
                  Cube Size: <span className={`font-semibold text-[11px] whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-900'}`}>{cubeStatus}</span>
                </div>
                <div className={textSub}>
                  Wavelength: <span className={`font-semibold text-[11px] whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-900'}`}>0.8 – 5.0 µm</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate" title={cubeName}>Loaded</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2.5">
            <button
              onClick={() => setCubeModalOpen(true)}
              className={`w-full py-1 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${btnStyle}`}
            >
              Select Cube
            </button>
          </div>
        </div>

        {/* CARD 2: REFERENCE SENSOR */}
        <div className={`${cardBg} border rounded-xl p-3 flex flex-col justify-between transition-colors min-h-[175px]`}>
          <div>
            <h3 className={`text-[10.5px] font-bold uppercase tracking-tight mb-2.5 whitespace-nowrap overflow-hidden text-ellipsis ${textTitle}`}>
              REFERENCE SENSOR (WAC - VISIBLE)
            </h3>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full bg-[#1A2234]">
                  <circle cx="50" cy="50" r="35" fill="#2E3A52" />
                  <circle cx="45" cy="45" r="28" fill="#182030" />
                  <circle cx="75" cy="25" r="12" fill="#253046" />
                  <circle cx="72" cy="23" r="9" fill="#141B2A" />
                </svg>
              </div>

              <div className="space-y-0.5 text-[11px] min-w-0 flex-1 leading-tight">
                <div className={textSub}>
                  Image Size: <span className={`font-semibold text-[11px] whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-900'}`}>{wacStatus}</span>
                </div>
                <div className={textSub}>
                  Resolution: <span className={`font-semibold text-[11px] whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-900'}`}>~100 m/px</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate" title={wacName}>Loaded</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2.5">
            <button
              onClick={() => setWacModalOpen(true)}
              className={`w-full py-1 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${btnStyle}`}
            >
              Select Image
            </button>
          </div>
        </div>

        {/* CARD 3: OPTIONAL (TMC) */}
        <div className={`${cardBg} border rounded-xl p-3 flex flex-col justify-between transition-colors min-h-[175px]`}>
          <div>
            <h3 className={`text-[10.5px] font-bold uppercase tracking-tight mb-2.5 whitespace-nowrap overflow-hidden text-ellipsis ${textTitle}`}>
              OPTIONAL (TMC)
            </h3>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full bg-[#1A2234]">
                  <circle cx="35" cy="35" r="20" fill="#2B374E" />
                  <circle cx="33" cy="33" r="15" fill="#161D2B" />
                  <circle cx="65" cy="65" r="25" fill="#2E3A52" />
                </svg>
              </div>

              <div className="space-y-0.5 text-[11px] min-w-0 flex-1 leading-tight">
                <div className={textSub}>
                  Image Size: <span className={`font-semibold text-[11px] whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-900'}`}>{tmcStatus}</span>
                </div>
                <div className={textSub}>
                  Resolution: <span className={`font-semibold text-[11px] whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-900'}`}>~5–10 m/px</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate" title={tmcName}>Loaded</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2.5">
            <button
              onClick={() => setTmcModalOpen(true)}
              className={`w-full py-1 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${btnStyle}`}
            >
              Select Image
            </button>
          </div>
        </div>

        {/* CARD 4: IIRS BAND SELECTION */}
        <div className={`${cardBg} border rounded-xl p-3 flex flex-col justify-between relative transition-colors min-h-[175px]`}>
          <div>
            <h3 className={`text-[10.5px] font-bold uppercase tracking-tight mb-2 whitespace-nowrap overflow-hidden text-ellipsis ${textTitle}`}>
              IIRS BAND SELECTION
            </h3>

            {/* Clean 3-Grid Stats Badges */}
            <div className="grid grid-cols-3 text-center gap-1 mb-1.5">
              <div className={`p-1 rounded border ${
                darkMode ? 'bg-[#0E1527] border-[#1E2A45]' : 'bg-slate-100 border-slate-200'
              }`}>
                <div className={`text-[9px] uppercase tracking-tight font-medium ${textSub}`}>Best Band</div>
                <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedBand}</div>
              </div>
              <div className={`p-1 rounded border ${
                darkMode ? 'bg-[#0E1527] border-[#1E2A45]' : 'bg-slate-100 border-slate-200'
              }`}>
                <div className={`text-[9px] uppercase tracking-tight font-medium ${textSub}`}>Wavelength</div>
                <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{currentWavelength} µm</div>
              </div>
              <div className={`p-1 rounded border ${
                darkMode ? 'bg-[#0E1527] border-[#1E2A45]' : 'bg-slate-100 border-slate-200'
              }`}>
                <div className={`text-[9px] uppercase tracking-tight font-medium ${textSub}`}>Score</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{currentScore}</div>
              </div>
            </div>

            {/* SVG Spectral Graph */}
            <div className={`h-12 w-full rounded-lg border p-0.5 relative overflow-hidden group cursor-crosshair ${
              darkMode ? 'bg-[#0E1527] border-[#1E2A45]' : 'bg-slate-100 border-slate-300'
            }`}>
              <svg
                viewBox="0 0 300 80"
                className="w-full h-full"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, x / rect.width));
                  const newBand = Math.round(1 + ratio * 241);
                  onSelectBand(newBand);
                  setCustomBand(newBand.toString());
                  onLogMsg(`Band selected via spectral curve: Band ${newBand} (${calculateWavelength(newBand)} µm)`);
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, x / rect.width));
                  const b = Math.round(1 + ratio * 241);
                  setHoveredBand(b);
                }}
                onMouseLeave={() => setHoveredBand(null)}
              >
                <line x1="20" y1="70" x2="290" y2="70" stroke={darkMode ? '#1E2A45' : '#CBD5E1'} strokeWidth="1" />
                <line x1="20" y1="10" x2="20" y2="70" stroke={darkMode ? '#1E2A45' : '#CBD5E1'} strokeWidth="1" />

                <text x="20" y="78" fill={darkMode ? '#64748B' : '#475569'} fontSize="8" fontFamily="Inter">0.8</text>
                <text x="145" y="78" fill={darkMode ? '#64748B' : '#475569'} fontSize="8" fontFamily="Inter">2.0</text>
                <text x="220" y="78" fill={darkMode ? '#64748B' : '#475569'} fontSize="8" fontFamily="Inter">3.2</text>
                <text x="280" y="78" fill={darkMode ? '#64748B' : '#475569'} fontSize="8" fontFamily="Inter">5.0</text>

                <polyline
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="1.8"
                  points="20,55 40,50 60,52 80,48 100,53 120,40 135,15 145,55 160,50 180,52 200,48 220,53 240,25 250,55 270,58 290,52"
                />

                {/* Vertical Pin for Selected Band */}
                {(() => {
                  const bandRatio = (selectedBand - 1) / 241;
                  const pinX = 20 + bandRatio * 270;
                  return (
                    <g>
                      <line x1={pinX} y1="10" x2={pinX} y2="70" stroke="#DC2626" strokeWidth="1.5" />
                      <circle cx={pinX} cy="15" r="2.5" fill="#DC2626" />
                    </g>
                  );
                })()}

                {/* Hover line */}
                {hoveredBand !== null && (
                  <g>
                    <line
                      x1={20 + ((hoveredBand - 1) / 241) * 270}
                      y1="10"
                      x2={20 + ((hoveredBand - 1) / 241) * 270}
                      y2="70"
                      stroke="#3B82F6"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  </g>
                )}
              </svg>

              {hoveredBand !== null && (
                <div className="absolute top-1 right-2 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded font-mono pointer-events-none">
                  Band {hoveredBand} ({calculateWavelength(hoveredBand)} µm)
                </div>
              )}
            </div>
          </div>

          <div className="mt-2">
            <button
              onClick={() => {
                setCustomBand(selectedBand.toString());
                setBandInputModal(true);
              }}
              className={`w-full py-1 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${btnStyle}`}
            >
              Change Band
            </button>
          </div>
        </div>
      </div>

      {/* CUBE SELECT MODAL */}
      {cubeModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-xl p-4 max-w-md w-full shadow-2xl space-y-3 ${
            darkMode ? 'bg-[#131C31] border-[#1E2A45] text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-2 dark:border-[#1E2A45]">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Select IIRS Hyperspectral Cube
              </h3>
              <button onClick={() => setCubeModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 block">Preset Datasets:</label>
              <div className="space-y-1.5">
                {[
                  { name: 'ch2_iirs_nmp_20200115t083022_d_img.hdr', dim: '512 × 512 × 242', desc: 'Standard Lunar Equator Orbit Pass' },
                  { name: 'ch2_iirs_nmp_20210310t142010_d_img.hdr', dim: '1024 × 1024 × 242', desc: 'High-Res South Pole Water Ice Target' },
                  { name: 'ch2_iirs_nmp_20220805t021145_d_img.hdr', dim: '256 × 256 × 242', desc: 'Mare Tranquillitatis Fast Preview' }
                ].map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => {
                      setCubeStatus(preset.dim);
                      setCubeName(preset.name);
                      onLogMsg(`Loaded IIRS Cube preset: ${preset.name} (${preset.dim})`);
                      setCubeModalOpen(false);
                    }}
                    className={`p-2.5 border rounded-lg cursor-pointer transition-colors text-xs flex items-center justify-between ${
                      cubeName === preset.name
                        ? 'border-blue-500 bg-blue-500/10'
                        : darkMode ? 'border-[#1E2A45] hover:bg-slate-800/60' : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-mono font-bold text-[11px]">{preset.name}</div>
                      <div className="text-[10px] text-slate-400">{preset.desc}</div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                      {preset.dim}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t dark:border-[#1E2A45]">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Or Upload Custom File (.hdr / .img / .nc / .tif):</label>
                <input
                  type="file"
                  accept=".hdr,.img,.nc,.tif,.tiff"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setCubeName(file.name);
                      setCubeStatus('512 × 512 × 242');
                      onLogMsg(`Uploaded custom cube file: ${file.name}`);
                      setCubeModalOpen(false);
                    }
                  }}
                  className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WAC REFERENCE MODAL */}
      {wacModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-xl p-4 max-w-md w-full shadow-2xl space-y-3 ${
            darkMode ? 'bg-[#131C31] border-[#1E2A45] text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-2 dark:border-[#1E2A45]">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Select Reference WAC Image
              </h3>
              <button onClick={() => setWacModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 block">Preset Reference Maps:</label>
              <div className="space-y-1.5">
                {[
                  { name: 'lroc_wac_visible_global_100m.tif', dim: '1024 × 1024', res: '~100 m/px' },
                  { name: 'lroc_wac_morphology_50m.tif', dim: '2048 × 2048', res: '~50 m/px' },
                  { name: 'ch2_tmc_global_ortho_100m.tif', dim: '1024 × 1024', res: '~100 m/px' }
                ].map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => {
                      setWacStatus(preset.dim);
                      setWacName(preset.name);
                      onLogMsg(`Loaded WAC Reference: ${preset.name}`);
                      setWacModalOpen(false);
                    }}
                    className={`p-2.5 border rounded-lg cursor-pointer transition-colors text-xs flex items-center justify-between ${
                      wacName === preset.name
                        ? 'border-blue-500 bg-blue-500/10'
                        : darkMode ? 'border-[#1E2A45] hover:bg-slate-800/60' : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-mono font-bold text-[11px]">{preset.name}</div>
                    <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800">
                      {preset.dim} ({preset.res})
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t dark:border-[#1E2A45]">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Or Upload Custom Reference (.tif / .png / .jpg):</label>
                <input
                  type="file"
                  accept=".tif,.tiff,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setWacName(file.name);
                      setWacStatus('1024 × 1024');
                      onLogMsg(`Uploaded custom reference image: ${file.name}`);
                      setWacModalOpen(false);
                    }
                  }}
                  className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TMC MODAL */}
      {tmcModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-xl p-4 max-w-md w-full shadow-2xl space-y-3 ${
            darkMode ? 'bg-[#131C31] border-[#1E2A45] text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-2 dark:border-[#1E2A45]">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Select Optional TMC High-Res Image
              </h3>
              <button onClick={() => setTmcModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 block">Preset TMC Passes:</label>
              <div className="space-y-1.5">
                {[
                  { name: 'ch2_tmc2_ortho_5m_pass.tif', dim: '512 × 512', res: '~5 m/px' },
                  { name: 'ch2_tmc2_stereo_dem_10m.tif', dim: '1024 × 1024', res: '~10 m/px' }
                ].map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => {
                      setTmcStatus(preset.dim);
                      setTmcName(preset.name);
                      onLogMsg(`Loaded Optional TMC image: ${preset.name}`);
                      setTmcModalOpen(false);
                    }}
                    className={`p-2.5 border rounded-lg cursor-pointer transition-colors text-xs flex items-center justify-between ${
                      tmcName === preset.name
                        ? 'border-purple-500 bg-purple-500/10'
                        : darkMode ? 'border-[#1E2A45] hover:bg-slate-800/60' : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-mono font-bold text-[11px]">{preset.name}</div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800">
                      {preset.dim} ({preset.res})
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t dark:border-[#1E2A45]">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Or Upload Custom TMC Image:</label>
                <input
                  type="file"
                  accept=".tif,.tiff,.png,.jpg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setTmcName(file.name);
                      setTmcStatus('512 × 512');
                      onLogMsg(`Uploaded custom TMC image: ${file.name}`);
                      setTmcModalOpen(false);
                    }
                  }}
                  className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BAND SELECTION MODAL */}
      {bandInputModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4 ${
            darkMode ? 'bg-[#131C31] border-[#1E2A45] text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-2 dark:border-[#1E2A45]">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Select IIRS Hyperspectral Band
              </h3>
              <button onClick={() => setBandInputModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Band Index (1 - 242):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="242"
                    value={customBand}
                    onChange={(e) => setCustomBand(e.target.value)}
                    className="flex-1 accent-blue-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="242"
                    value={customBand}
                    onChange={(e) => setCustomBand(e.target.value)}
                    className={`w-20 border text-xs font-bold px-2 py-1.5 rounded text-center focus:outline-none ${
                      darkMode ? 'bg-[#0E1527] border-blue-500 text-white' : 'bg-slate-100 border-blue-600 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg border dark:border-[#1E2A45] bg-[#0E1527]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Calculated Wavelength:</span>
                  <span className="font-bold text-white font-mono">{calculateWavelength(parseInt(customBand) || 73)} µm</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SNR Registration Score:</span>
                  <span className="font-bold text-emerald-400 font-mono">{calculateScore(parseInt(customBand) || 73)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setBandInputModal(false)}
                  className={`px-3 py-1.5 text-xs rounded font-medium cursor-pointer ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-800'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const b = Math.max(1, Math.min(242, parseInt(customBand) || 73));
                    onSelectBand(b);
                    onLogMsg(`Band changed to Band ${b} (${calculateWavelength(b)} µm).`);
                    setBandInputModal(false);
                  }}
                  className="px-4 py-1.5 text-xs bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 shadow-sm cursor-pointer"
                >
                  Apply Band
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

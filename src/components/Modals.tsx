import React, { useState } from 'react';
import { X, Check, Download, AlertCircle, FileCheck, Sliders, CheckCircle2 } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const Modals: React.FC = () => {
  const {
    darkMode,
    activeModal,
    setActiveModal,
    changeTile,
    addLog,
    showToast,
    toastMessage,
    keypointLimit,
    setKeypointLimit,
    matchThreshold,
    setMatchThreshold,
    ransacThresh,
    setRansacThresh,
    loadProjectData
  } = useAppState();

  const [newProjName, setNewProjName] = useState('Chandrayaan2_Orbit_Pass_42');
  const [selectedPass, setSelectedPass] = useState('Pass 42 South Pole (Shoemaker)');
  const [customPath, setCustomPath] = useState('/data/OHRC/Pass42/custom_tile.tif');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loadedJson, setLoadedJson] = useState<any>(null);

  if (!activeModal && !toastMessage) return null;

  return (
    <>
      {/* Toast Floating Notification Bar (Professional Glassmorphism Banner) */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-3.5 text-xs transition-all duration-300 transform translate-y-0 opacity-100 ${
          darkMode
            ? 'bg-[#0F172A]/90 border-emerald-500/40 text-slate-100 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl'
            : 'bg-white/95 border-emerald-500/40 text-slate-900 shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl'
        }`}>
          {/* Glowing Status Dot & Icon */}
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          </div>

          <div className="flex flex-col min-w-0 pr-1">
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-emerald-500">
              System Telemetry Notification
            </span>
            <span className="font-semibold tracking-tight font-sans text-xs">
              {toastMessage}
            </span>
          </div>
        </div>
      )}

      {/* Modal Dialog Popups */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4 ${
            darkMode ? 'bg-[#111827] border-[#1F2937] text-white' : 'bg-white border-[#E2E8F0] text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-2.5 dark:border-[#1F2937]">
              <h3 className="text-sm font-bold tracking-tight uppercase flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2F6BFF]" />
                <span>{activeModal}</span>
              </h3>
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setActiveModal(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1F2937] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CHANGE TILE OHRC MODAL */}
            {activeModal === 'Change Tile OHRC' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-400">Select or upload an OHRC (Source) Tile file (.img, .IMG, .tif, .cube, .xml):</p>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Orbital Pass / Region Preset:</label>
                  <select
                    value={selectedPass}
                    onChange={(e) => {
                      setSelectedPass(e.target.value);
                      setUploadedFile(null);
                      const fname = e.target.value.includes('Shoemaker') 
                        ? 'ch2_ohrc_pass42.tif' 
                        : e.target.value.includes('Tranquillitatis') 
                        ? 'ch2_ohrc_pass18.tif' 
                        : 'ch2_ohrc_pass09.tif';
                      setCustomPath(`/data/OHRC/${fname}`);
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none font-mono ${
                      darkMode ? 'bg-[#080C16] border-[#1F2937] text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Pass 42 South Pole (Shoemaker)">Pass 42 — South Pole (Shoemaker / Shackleton)</option>
                    <option value="Pass 18 Mare Tranquillitatis">Pass 18 — Mare Tranquillitatis (Equatorial)</option>
                    <option value="Pass 09 Apollo 11 Site">Pass 09 — Apollo 11 Landing Site</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Upload File (All Formats Supported):</label>
                  <input
                    type="file"
                    accept="*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setUploadedFile(f);
                        setCustomPath(f.name);
                      }
                    }}
                    className="w-full text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2F6BFF] file:text-white hover:file:bg-blue-500 cursor-pointer font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">File Path / Selected Target:</label>
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none font-mono ${
                      darkMode ? 'bg-[#080C16] border-[#2F6BFF] text-white' : 'bg-slate-100 border-blue-600 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* CHANGE TILE NAC MODAL */}
            {activeModal === 'Change Tile NAC' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-400">Select or upload a NAC (Reference) Tile file (.img, .IMG, .tif, .cube, .xml, images, all files):</p>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Reference Region Preset:</label>
                  <select
                    value={selectedPass}
                    onChange={(e) => {
                      setSelectedPass(e.target.value);
                      setUploadedFile(null);
                      const fname = e.target.value.includes('Shoemaker') 
                        ? 'lroc_nac_pass42.tif' 
                        : 'lroc_nac_pass18.tif';
                      setCustomPath(`/data/NAC/${fname}`);
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none font-mono ${
                      darkMode ? 'bg-[#080C16] border-[#1F2937] text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Pass 42 South Pole (Shoemaker)">LROC NAC M119028420R (Shoemaker Rim)</option>
                    <option value="Pass 18 Mare Tranquillitatis">LROC NAC M102342911L (Equatorial Pass)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Upload File (All Formats Supported):</label>
                  <input
                    type="file"
                    accept="*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setUploadedFile(f);
                        setCustomPath(f.name);
                      }
                    }}
                    className="w-full text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2F6BFF] file:text-white hover:file:bg-blue-500 cursor-pointer font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">File Path / Selected Target:</label>
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none font-mono ${
                      darkMode ? 'bg-[#080C16] border-[#2F6BFF] text-white' : 'bg-slate-100 border-blue-600 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* NEW PROJECT MODAL */}
            {activeModal === 'New Project' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Project Name:</label>
                  <input
                    type="text"
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none font-mono ${
                      darkMode ? 'bg-[#080C16] border-[#2F6BFF] text-white' : 'bg-slate-100 border-blue-600 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* OPEN PROJECT MODAL */}
            {activeModal === 'Open Project' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-400">Select or upload a saved Chandrayaan-2 project file (.c2proj, .json, all files):</p>
                <input
                  type="file"
                  accept="*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const parsed = JSON.parse(event.target?.result as string);
                          setLoadedJson(parsed);
                        } catch (err) {
                          // Standard file name loading
                          setLoadedJson({ projectFile: file.name });
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                  className="w-full text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2F6BFF] file:text-white hover:file:bg-blue-500 cursor-pointer font-mono"
                />
              </div>
            )}

            {/* SETTINGS MODAL */}
            {activeModal === 'Settings' && (
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 font-sans">SuperPoint Max Keypoints:</span>
                    <span className="font-bold text-blue-400">{keypointLimit}</span>
                  </div>
                  <input
                    type="range"
                    min="512"
                    max="4096"
                    step="256"
                    value={keypointLimit}
                    onChange={(e) => setKeypointLimit(parseInt(e.target.value))}
                    className="w-full accent-[#2F6BFF] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 font-sans">SuperGlue Confidence Threshold:</span>
                    <span className="font-bold text-[#22C55E]">{matchThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="0.95"
                    step="0.05"
                    value={matchThreshold}
                    onChange={(e) => setMatchThreshold(parseFloat(e.target.value))}
                    className="w-full accent-[#22C55E] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 font-sans">RANSAC Reprojection Max Error:</span>
                    <span className="font-bold text-[#EF4444]">{ransacThresh} px</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.5"
                    value={ransacThresh}
                    onChange={(e) => setRansacThresh(parseFloat(e.target.value))}
                    className="w-full accent-[#EF4444] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* MODAL ACTION BUTTONS */}
            <div className="flex justify-end gap-2 pt-3 border-t dark:border-[#1F2937]">
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setActiveModal(null);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer ${
                  darkMode ? 'bg-[#080C16] text-slate-300 border border-[#1F2937]' : 'bg-slate-200 text-slate-800'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeModal === 'Change Tile OHRC') {
                    const fileName = uploadedFile ? uploadedFile.name : (customPath.split('/').pop() || customPath || 'ch2_ohrc_custom.tif');
                    const imgUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : undefined;
                    changeTile('OHRC', { name: fileName, path: customPath || `/data/OHRC/${fileName}`, imageUrl: imgUrl });
                  } else if (activeModal === 'Change Tile NAC') {
                    const fileName = uploadedFile ? uploadedFile.name : (customPath.split('/').pop() || customPath || 'lroc_nac_custom.tif');
                    const imgUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : undefined;
                    changeTile('NAC', { name: fileName, path: customPath || `/data/NAC/${fileName}`, imageUrl: imgUrl });
                  } else if (activeModal === 'Open Project') {
                    if (loadedJson && loadedJson.version) {
                      loadProjectData(loadedJson);
                    } else {
                      addLog(`Opened project file: ${loadedJson?.projectFile || 'Demo_Project.c2proj'}`, 'success');
                      showToast('Project File Opened!');
                    }
                  } else if (activeModal === 'New Project') {
                    addLog(`Created new project workspace: ${newProjName}`, 'success');
                    showToast(`Created Workspace: ${newProjName}`);
                  } else if (activeModal === 'Settings') {
                    addLog(`Updated algorithm parameters: Keypoints=${keypointLimit}, Threshold=${matchThreshold}, RANSAC=${ransacThresh}px`, 'info');
                    showToast('Algorithm Parameters Updated');
                  } else {
                    addLog(`${activeModal} confirmed.`, 'info');
                  }
                  setUploadedFile(null);
                  setActiveModal(null);
                }}
                className="px-4 py-1.5 text-xs bg-[#2F6BFF] text-white font-bold rounded-lg hover:bg-blue-600 shadow-md cursor-pointer"
              >
                Confirm & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

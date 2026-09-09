import React, { useState } from 'react';
import { CheckCircle2, CircleDashed, Copy, Check, RefreshCw } from 'lucide-react';
import { WorkflowStep } from './Sidebar';

interface PipelineMatrixSectionProps {
  darkMode: boolean;
  steps: WorkflowStep[];
  currentStepId: number;
  onSelectStep?: (id: number) => void;
}

export const PipelineMatrixSection: React.FC<PipelineMatrixSectionProps> = ({
  darkMode,
  steps,
  currentStepId,
  onSelectStep
}) => {
  const [copied, setCopied] = useState(false);
  const [matrixValues, setMatrixValues] = useState([
    ['1.0021', '0.0013', '-23.45'],
    ['-0.0011', '1.0032', '18.67'],
    ['0.000000', '0.000000', '1.0000']
  ]);

  const matrixString = matrixValues.map(row => row.join('\t')).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(matrixString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRecalculate = () => {
    // Generate slight variation
    const r1 = (1.0 + (Math.random() - 0.5) * 0.005).toFixed(4);
    const r2 = ((Math.random() - 0.5) * 0.003).toFixed(4);
    const r3 = (-23.0 + (Math.random() - 0.5) * 1.5).toFixed(2);

    const r4 = ((Math.random() - 0.5) * 0.003).toFixed(4);
    const r5 = (1.0 + (Math.random() - 0.5) * 0.005).toFixed(4);
    const r6 = (18.5 + (Math.random() - 0.5) * 1.5).toFixed(2);

    setMatrixValues([
      [r1, r2, r3],
      [r4, r5, r6],
      ['0.000000', '0.000000', '1.0000']
    ]);
  };

  const cardBg = darkMode ? 'bg-[#131C31] border-[#1E2A45]' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = darkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className={`w-72 flex flex-col p-3 gap-3 select-none transition-colors border-l ${
      darkMode ? 'bg-[#0C1222] border-[#1E2A45]' : 'bg-slate-100 border-slate-300'
    }`}>
      {/* PROCESS PIPELINE CARD */}
      <div className={`${cardBg} border rounded-xl p-3 flex-1 flex flex-col transition-colors overflow-hidden`}>
        <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2.5 ${textTitle}`}>
          PROCESS PIPELINE
        </h3>

        <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
          {steps.map((step) => {
            const isCompleted = step.id < currentStepId;
            const isCurrent = step.id === currentStepId;

            return (
              <div
                key={step.id}
                onClick={() => onSelectStep && onSelectStep(step.id)}
                className={`flex items-center justify-between px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : isCompleted
                    ? darkMode ? 'text-slate-300 hover:bg-[#1E2A45]/50' : 'text-slate-700 hover:bg-slate-200'
                    : darkMode ? 'text-slate-500 hover:bg-[#1E2A45]/30' : 'text-slate-400 hover:bg-slate-150'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-4 font-mono text-[10px] ${isCurrent ? 'text-blue-100' : darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {step.id}
                  </span>
                  <span className="text-[11px] font-medium">
                    {step.name}
                  </span>
                </div>

                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <CircleDashed className="w-3.5 h-3.5 text-white animate-spin shrink-0" />
                ) : (
                  <span className="text-[10px] font-sans">Pending</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* HOMOGRAPHY MATRIX (H) CARD */}
      <div className={`${cardBg} border rounded-xl p-3 transition-colors`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-[11px] font-bold uppercase tracking-wider ${textTitle}`}>
            HOMOGRAPHY MATRIX (H)
          </h3>
          <button
            onClick={handleRecalculate}
            className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-blue-600/30 transition-colors cursor-pointer"
            title="Recalculate Matrix H"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-[#090D18] border border-[#1E2A45] rounded-lg p-2.5 matrix-font text-xs font-mono text-emerald-400 space-y-1.5 shadow-inner">
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
          <div className="flex justify-between text-slate-400">
            <span>{matrixValues[2][0]}</span>
            <span>{matrixValues[2][1]}</span>
            <span>{matrixValues[2][2]}</span>
          </div>
        </div>

        <div className="mt-2.5 text-center">
          <button
            onClick={handleCopy}
            className={`w-full py-1 text-xs font-semibold rounded-lg transition-colors border flex items-center justify-center gap-1.5 cursor-pointer ${
              darkMode
                ? 'bg-[#1E2A45] hover:bg-slate-700 text-white border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Matrix (H)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

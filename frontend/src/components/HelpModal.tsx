import React from 'react';
import { X, ShieldCheck, Play, Sparkles, BookOpen } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRates: (gold: number, silver: number) => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onApplyRates,
}) => {
  if (!isOpen) return null;

  const testCases = [
    {
      id: 1,
      title: 'Test 1: Base Reference Rate',
      gold: 12985,
      silver: 190,
      expected: 'Poster renders ₹12,985 for Gold and ₹190 for Silver.',
    },
    {
      id: 2,
      title: 'Test 2: Gold Price Update',
      gold: 13050,
      silver: 190,
      expected: 'Only Gold price changes to ₹13,050. Silver remains ₹190.',
    },
    {
      id: 3,
      title: 'Test 3: Silver Price Update',
      gold: 13050,
      silver: 200,
      expected: 'Only Silver price changes to ₹200. Gold remains ₹13,050.',
    },
    {
      id: 4,
      title: 'Test 4: High Value / 6-digit Format',
      gold: 125000,
      silver: 250,
      expected: 'Formatted as ₹1,25,000 without clipping inside the gold glitter box.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#16120b] border border-[#483719] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1e170d] border-b border-[#362711]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2a2010] text-[#f7d070] border border-[#4d3a19]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f7d070] tracking-wide">
                USER GUIDE & WORKFLOW TESTS
              </h2>
              <p className="text-xs text-[#a99c85]">
                Verification checklist and daily shop operation instructions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9a8d77] hover:text-white rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-[#cfb684]">
          {/* Daily 1-Minute Workflow */}
          <div className="p-4 rounded-xl bg-[#1c160e] border border-[#3d2f16] space-y-2">
            <h3 className="font-bold text-[#f7d070] text-sm uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 1-Minute Daily Shop Workflow:
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-[#b5a790] leading-relaxed">
              <li>Open the dashboard. Today's date is automatically retrieved.</li>
              <li>Type today's Gold price per gram (e.g., <code className="text-[#fce8a6]">12985</code>).</li>
              <li>Type today's Silver price per gram (e.g., <code className="text-[#fce8a6]">190</code>).</li>
              <li>Click <strong>GENERATE TODAY'S POSTER</strong>.</li>
              <li>Click <strong>SHARE WHATSAPP</strong> to instantly share with customers!</li>
            </ol>
          </div>

          {/* Interactive Specification Tests (Section 14) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#f7d070] uppercase tracking-wider text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Section 14 Verification Tests
              </h3>
              <span className="text-[10px] text-[#8e806c]">Click to test</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {testCases.map((tc) => (
                <div
                  key={tc.id}
                  className="p-3 bg-[#130f08] border border-[#332611] rounded-xl flex items-center justify-between gap-3 hover:border-[#523d19] transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{tc.title}</span>
                      <span className="font-mono text-[11px] text-[#f7d070]">
                        ₹{tc.gold} / ₹{tc.silver}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#938670]">{tc.expected}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onApplyRates(tc.gold, tc.silver);
                      onClose();
                    }}
                    className="shrink-0 px-3 py-1.5 bg-[#251e12] hover:bg-[#382b15] text-[#f7d070] border border-[#443316] rounded-lg font-semibold text-xs flex items-center gap-1 transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" /> Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

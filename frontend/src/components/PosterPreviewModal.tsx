import React from 'react';
import { X, Download, Share2 } from 'lucide-react';

interface PosterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvas: HTMLCanvasElement | null;
  onDownload: () => void;
  onShare: () => void;
}

export const PosterPreviewModal: React.FC<PosterPreviewModalProps> = ({
  isOpen,
  onClose,
  canvas,
  onDownload,
  onShare,
}) => {
  if (!isOpen || !canvas) return null;

  const dataUrl = canvas.toDataURL('image/png');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="relative flex flex-col items-center max-h-[95vh] max-w-4xl bg-[#140f09] border border-[#483719] rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="w-full flex items-center justify-between px-5 py-3 bg-[#1d160c] border-b border-[#362711]">
          <span className="text-sm font-bold text-[#f7d070] tracking-wide">
            SRI CHAIRMAN JEWELLERS – 1080 × 1920 POSTER PREVIEW
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="px-3 py-1.5 bg-[#251e12] hover:bg-[#382b15] text-[#f7d070] rounded-lg border border-[#483719] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button
              onClick={onShare}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#9a8d77] hover:text-white rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Poster Image Container */}
        <div className="p-4 overflow-auto flex items-center justify-center bg-[#090704]">
          <img
            src={dataUrl}
            alt="Full poster preview"
            className="max-h-[82vh] w-auto rounded-lg shadow-2xl object-contain border border-[#3e3017]"
          />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Share2 } from 'lucide-react';

interface WhatsAppGuideModalProps {
  isOpen: boolean;
  whatsappUrl: string;
  filename: string;
  onClose: () => void;
  onCopyImageAgain?: () => Promise<void>;
}

export const WhatsAppGuideModal: React.FC<WhatsAppGuideModalProps> = ({
  isOpen,
  whatsappUrl,
  filename,
  onClose,
  onCopyImageAgain,
}) => {
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyClick = async () => {
    if (onCopyImageAgain) {
      await onCopyImageAgain();
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#16120b] border border-[#483719] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-950/80 to-[#1e170d] border-b border-[#362711]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Share Poster on WhatsApp
              </h2>
              <p className="text-xs text-emerald-300 font-medium">
                No default contact • Send to any contact, group, or status
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9a8d77] hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Status Alert Box */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Image Copied & Ready!</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-600/40">
                Clipboard Ready
              </span>
            </div>
            <p className="font-mono text-[11px] text-[#f7d070] bg-[#110d07] px-2.5 py-1.5 rounded-lg border border-[#3e3016] break-all">
              {filename}
            </p>
          </div>

          {/* Quick instructions */}
          <div className="space-y-2.5 text-[#cfb684]">
            <h3 className="font-bold text-[#f7d070] uppercase tracking-wide text-[11px]">
              How to Send in WhatsApp:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-[#b5a790] leading-relaxed">
              <li>
                In the opened WhatsApp window, click on <strong className="text-white">any contact, customer, group, or Status</strong>.
              </li>
              <li>
                Click the chat input box and press <kbd className="px-1.5 py-0.5 bg-[#251e12] rounded border border-[#443317] font-mono text-white text-[11px]">Ctrl + V</kbd> to paste the clean image directly.
              </li>
              <li>
                Or click the <strong className="text-white">📎 attach icon</strong> and select the downloaded file <strong className="text-[#f7d070]">{filename}</strong>.
              </li>
              <li>
                Hit <strong className="text-emerald-400">Send</strong> — the poster sends cleanly with no description text.
              </li>
            </ol>
          </div>

          {/* Action links */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <a
              href={whatsappUrl || 'https://web.whatsapp.com/'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Go to WhatsApp Web</span>
            </a>

            {onCopyImageAgain && (
              <button
                type="button"
                onClick={handleCopyClick}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#251e12] hover:bg-[#382b15] text-[#f7d070] border border-[#4d3a19] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Image Again</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

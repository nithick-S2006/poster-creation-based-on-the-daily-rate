import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Share2, Smartphone, Send } from 'lucide-react';

interface WhatsAppGuideModalProps {
  isOpen: boolean;
  messageText: string;
  whatsappUrl: string;
  whatsappAppUrl?: string;
  filename: string;
  recipientPhone: string;
  onClose: () => void;
}

export const WhatsAppGuideModal: React.FC<WhatsAppGuideModalProps> = ({
  isOpen,
  messageText,
  whatsappUrl,
  whatsappAppUrl,
  filename,
  recipientPhone,
  onClose,
}) => {
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // fallback
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
                WhatsApp Direct Send
              </h2>
              <p className="text-xs text-emerald-400 font-medium">
                Sending directly to: <span className="font-mono text-white">{recipientPhone || 'Configured Recipient'}</span>
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
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Status Alert Box */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Chat launched & poster ready!</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-600/40">
                Auto-Copied to Clipboard
              </span>
            </div>
            <p className="font-mono text-[11px] text-[#f7d070] bg-[#110d07] px-2.5 py-1.5 rounded-lg border border-[#3e3016] break-all">
              {filename}
            </p>
          </div>

          {/* Quick instructions */}
          <div className="space-y-2 text-[#cfb684]">
            <h3 className="font-bold text-[#f7d070] uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-emerald-400" /> Sending to Recipient:
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-[#b5a790] leading-relaxed">
              <li>
                WhatsApp has opened a direct conversation with <strong className="text-white font-mono">{recipientPhone}</strong>.
              </li>
              <li>
                The poster image is already copied to your clipboard! Simply press <kbd className="px-1.5 py-0.5 bg-[#251e12] rounded border border-[#443317] font-mono text-white text-[10px]">Ctrl + V</kbd> in WhatsApp to paste and send.
              </li>
              <li>
                Or click the <strong className="text-white">📎 Paperclip icon</strong> and attach the downloaded <strong className="text-[#f7d070]">{filename}</strong>.
              </li>
            </ol>
          </div>

          {/* Action links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950 text-center"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in WhatsApp Web</span>
            </a>

            {whatsappAppUrl && (
              <a
                href={whatsappAppUrl}
                className="py-2.5 px-3 bg-[#241c10] hover:bg-[#342714] text-[#f7d070] border border-[#523e19] font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-center"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Open in WhatsApp App</span>
              </a>
            )}
          </div>

          {/* Message preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-[#8c7f6b] uppercase">
                Prepared Message Caption
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-[11px] text-[#f7d070] hover:text-white flex items-center gap-1 font-medium"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy Text
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-[#100d08] border border-[#3e3119] rounded-xl text-[#f3e3be] font-sans text-xs whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed select-all">
              {messageText}
            </pre>
          </div>

          {/* Done button */}
          <div className="flex items-center justify-end pt-2 border-t border-[#2e230f]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#20190e] hover:bg-[#302514] text-[#cfb684] rounded-xl border border-[#3e3119] font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

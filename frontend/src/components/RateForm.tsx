import React, { useState } from 'react';
import type { ShopSettings } from '../types';
import {
  formatIndianCurrency,
  convertIndianDateToIso,
  convertIsoToIndianDate,
  getTodayKolkataDate,
} from '../utils/dateUtils';
import {
  Coins,
  Sparkles,
  Calendar,
  Phone,
  Download,
  Share2,
  Copy,
  Check,
  AlertCircle,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AxisAdjuster } from './AxisAdjuster';

interface RateFormProps {
  goldRate: number;
  silverRate: number;
  dateStr: string;
  isAutoDate: boolean;
  settings: ShopSettings;
  onGoldRateChange: (rate: number) => void;
  onSilverRateChange: (rate: number) => void;
  onDateChange: (date: string) => void;
  onAutoDateToggle: (auto: boolean) => void;
  onSettingsChange: (settings: ShopSettings) => void;
  onGeneratePoster: () => void;
  onDownloadPoster: () => void;
  onShareWhatsApp: () => void;
  isGenerating?: boolean;
}

export const RateForm: React.FC<RateFormProps> = ({
  goldRate,
  silverRate,
  dateStr,
  isAutoDate,
  settings,
  onGoldRateChange,
  onSilverRateChange,
  onDateChange,
  onAutoDateToggle,
  onSettingsChange,
  onGeneratePoster,
  onDownloadPoster,
  onShareWhatsApp,
  isGenerating = false,
}) => {
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [phoneSaved, setPhoneSaved] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showAxisAdjuster, setShowAxisAdjuster] = useState(false);

  // Quick adjust handlers
  const adjustGold = (delta: number) => {
    const next = Math.max(1, (goldRate || 0) + delta);
    onGoldRateChange(next);
  };

  const adjustSilver = (delta: number) => {
    const next = Math.max(1, (silverRate || 0) + delta);
    onSilverRateChange(next);
  };

  const handlePhoneChange = (val: string) => {
    onSettingsChange({
      ...settings,
      whatsappNumber: val,
    });
    setPhoneSaved(true);
    setTimeout(() => setPhoneSaved(false), 2000);
  };

  const handleGenerateClick = () => {
    if (!goldRate || goldRate <= 0) {
      setValidationError('Please enter a valid Gold price per gram.');
      return;
    }
    if (!silverRate || silverRate <= 0) {
      setValidationError('Please enter a valid Silver price per gram.');
      return;
    }
    setValidationError(null);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f7d070', '#d4af37', '#ffffff', '#e6c875'],
      });
    } catch {
      // ignore
    }

    onGeneratePoster();
  };

  const handleCopyMessage = async () => {
    const text = `SRI CHAIRMAN JEWELLERS\n${settings.tamilShopName}\n\nஇன்றைய தங்கம் மற்றும் வெள்ளி விலை நிலவரம்:\n✨ 22K தங்கம்: ${formatIndianCurrency(goldRate)} / கிராம் (${formatIndianCurrency(goldRate * 8)} / சவரன்)\n✨ வெள்ளி: ${formatIndianCurrency(silverRate)} / கிராம் (${formatIndianCurrency(silverRate * 1000)} / கிலோ)\n📅 தேதி: ${dateStr}\n\n${settings.addressLine1} ${settings.addressLine2}\n${settings.footerText}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 md:p-6 bg-[#16120b] border border-[#3d3118] rounded-2xl shadow-xl">
      {/* Title */}
      <div className="border-b border-[#2d2412] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#f7d070]/20 to-[#9e6d0d]/10 border border-[#f7d070]/30 text-[#f7d070]">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#f7d070] tracking-wide">
                DAILY PRICE ENTRY
              </h2>
              <p className="text-xs text-[#a99c85]">
                Enter today's gold & silver rates per gram
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#251e11] text-[#d4af37] border border-[#483719]">
            INR (₹)
          </span>
        </div>
      </div>

      {/* Validation alert */}
      {validationError && (
        <div className="flex items-center gap-2 p-3 text-xs bg-red-950/80 border border-red-700/60 text-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 1. GOLD RATE INPUT */}
      <div className="p-4 rounded-xl bg-[#1d170e] border border-[#4a391a] relative overflow-hidden group hover:border-[#735824] transition-all">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-bold text-[#f7d070]">
            <span className="w-2 h-2 rounded-full bg-[#f7d070] shadow-[0_0_8px_#f7d070]" />
            GOLD RATE (22K) – PER GRAM
          </label>
          <span className="text-[11px] font-medium text-[#cbb994] bg-[#2a2010] px-2 py-0.5 rounded border border-[#443316]">
            {settings.goldPurity}
          </span>
        </div>

        {/* Input box */}
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-2xl font-bold text-[#f7d070] select-none pointer-events-none">
            ₹
          </span>
          <input
            type="number"
            value={goldRate || ''}
            onChange={(e) => onGoldRateChange(Number(e.target.value) || 0)}
            placeholder="e.g. 12985"
            className="w-full pl-10 pr-4 py-3 bg-[#110d08] border border-[#5a451e] rounded-xl text-2xl font-black text-white font-mono tracking-tight focus:outline-none focus:border-[#f7d070] focus:ring-2 focus:ring-[#f7d070]/20 transition-all placeholder:text-[#504432]"
          />
        </div>

        {/* Real-time Sovereign Breakdown */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#b8a990] bg-[#140f09] px-3 py-1.5 rounded-lg border border-[#2b2110]">
          <span>1 பவுன் (8 கிராம் Sovereign):</span>
          <span className="font-bold text-[#f7d070] font-mono">
            {formatIndianCurrency(goldRate * 8)}
          </span>
        </div>

        {/* Quick Stepper Buttons */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-[#786c58] uppercase font-semibold mr-1">Quick:</span>
          {[-100, -50, -10, +10, +50, +100].map((delta) => (
            <button
              key={delta}
              type="button"
              onClick={() => adjustGold(delta)}
              className="px-2 py-1 text-[11px] font-mono font-medium rounded bg-[#251e12] hover:bg-[#382c16] text-[#e0cfab] hover:text-white border border-[#443417] transition-all"
            >
              {delta > 0 ? `+${delta}` : delta}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SILVER RATE INPUT */}
      <div className="p-4 rounded-xl bg-[#1d170e] border border-[#3e3c3b] relative overflow-hidden group hover:border-[#6f757d] transition-all">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-bold text-[#e1e7ec]">
            <span className="w-2 h-2 rounded-full bg-[#d0d7de] shadow-[0_0_8px_#d0d7de]" />
            SILVER RATE – PER GRAM
          </label>
          <span className="text-[11px] font-medium text-[#b0bac5] bg-[#202428] px-2 py-0.5 rounded border border-[#3d444d]">
            Pure Silver
          </span>
        </div>

        {/* Input box */}
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-2xl font-bold text-[#d0d7de] select-none pointer-events-none">
            ₹
          </span>
          <input
            type="number"
            value={silverRate || ''}
            onChange={(e) => onSilverRateChange(Number(e.target.value) || 0)}
            placeholder="e.g. 190"
            className="w-full pl-10 pr-4 py-3 bg-[#110d08] border border-[#424850] rounded-xl text-2xl font-black text-white font-mono tracking-tight focus:outline-none focus:border-[#d0d7de] focus:ring-2 focus:ring-[#d0d7de]/20 transition-all placeholder:text-[#504432]"
          />
        </div>

        {/* Real-time 1 KG Breakdown */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#b8a990] bg-[#140f09] px-3 py-1.5 rounded-lg border border-[#2b2110]">
          <span>1 கிலோ (1000 கிராம் Silver Bar):</span>
          <span className="font-bold text-[#e1e7ec] font-mono">
            {formatIndianCurrency(silverRate * 1000)}
          </span>
        </div>

        {/* Quick Stepper Buttons */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-[#786c58] uppercase font-semibold mr-1">Quick:</span>
          {[-5, -1, +1, +5, +10].map((delta) => (
            <button
              key={delta}
              type="button"
              onClick={() => adjustSilver(delta)}
              className="px-2 py-1 text-[11px] font-mono font-medium rounded bg-[#202428] hover:bg-[#303840] text-[#d0d7de] hover:text-white border border-[#3d444d] transition-all"
            >
              {delta > 0 ? `+${delta}` : delta}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DATE SELECTION (Asia/Kolkata DD-MM-YYYY) */}
      <div className="p-4 rounded-xl bg-[#1a140d] border border-[#362913]">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#cfb684]">
            <Calendar className="w-4 h-4 text-[#f7d070]" />
            POSTER DATE (Asia/Kolkata DD-MM-YYYY)
          </label>
          <button
            type="button"
            onClick={() => {
              if (!isAutoDate) {
                onDateChange(getTodayKolkataDate());
              }
              onAutoDateToggle(!isAutoDate);
            }}
            className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
              isAutoDate
                ? 'bg-amber-950/70 text-[#f7d070] border border-[#f7d070]/40'
                : 'bg-[#292010] text-[#a49882] border border-[#443317]'
            }`}
          >
            {isAutoDate ? '✓ Today Auto' : 'Manual Override'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
          {/* Displayed Indian Format Date */}
          <div className="px-3.5 py-2.5 bg-[#100d08] border border-[#443419] rounded-xl flex items-center justify-between">
            <span className="text-xs text-[#8a7c66]">தேதி:</span>
            <span className="font-mono font-bold text-sm text-[#fce8a6] tracking-wide">
              {dateStr}
            </span>
          </div>

          {/* Native Date Input Picker */}
          <input
            type="date"
            disabled={isAutoDate}
            value={convertIndianDateToIso(dateStr)}
            onChange={(e) => {
              const formatted = convertIsoToIndianDate(e.target.value);
              onDateChange(formatted);
            }}
            className={`w-full px-3 py-2 bg-[#100d08] border rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#f7d070] transition-all ${
              isAutoDate
                ? 'opacity-40 border-[#312511] cursor-not-allowed'
                : 'opacity-100 border-[#5c461d] cursor-pointer'
            }`}
          />
        </div>
      </div>

      {/* 4. WHATSAPP RECIPIENT NUMBER */}
      <div className="p-4 rounded-xl bg-[#1a140d] border border-[#362913]">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#cfb684]">
            <Phone className="w-4 h-4 text-emerald-400" />
            WHATSAPP RECIPIENT NUMBER
          </label>
          {phoneSaved && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
        </div>

        <div className="relative flex items-center">
          <input
            type="text"
            value={settings.whatsappNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-2.5 bg-[#100d08] border border-[#4a391a] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-[#554734]"
          />
        </div>
        <p className="mt-1 text-[11px] text-[#7e725d]">
          Saved persistently. Country code (+91) applied automatically.
        </p>
      </div>

      {/* 5. RATE & DATE AXIS & SIZE FINE-TUNER */}
      <div className="rounded-xl border border-[#3e3017] bg-[#140f09] overflow-hidden shadow-lg transition-all">
        <button
          type="button"
          onClick={() => setShowAxisAdjuster(!showAxisAdjuster)}
          className="w-full px-4 py-3 bg-[#1c150c] hover:bg-[#281e10] flex items-center justify-between text-xs font-bold text-[#f7d070] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#2c2010] text-[#f7d070]">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <span>RATE & DATE AXIS & SIZE ADJUSTER</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#d4b574]">
            <span>{showAxisAdjuster ? 'Hide Controls' : 'Adjust (X, Y & Size)'}</span>
            {showAxisAdjuster ? (
              <ChevronUp className="w-4 h-4 text-[#f7d070]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#cfb684]" />
            )}
          </div>
        </button>

        {showAxisAdjuster && (
          <div className="p-3 border-t border-[#3e3017] bg-[#0e0a05]">
            <AxisAdjuster settings={settings} onChange={onSettingsChange} />
          </div>
        )}
      </div>

      {/* 6. PRIMARY ACTION BUTTONS */}
      <div className="flex flex-col gap-3 pt-2">
        {/* GENERATE TODAY'S POSTER (Primary Large Button) */}
        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="relative group w-full py-3.5 px-5 rounded-xl font-extrabold text-base tracking-wider uppercase text-[#231703] bg-gradient-to-r from-[#ffe17d] via-[#f7cb52] to-[#d8971f] hover:from-[#ffeb99] hover:via-[#fed86a] hover:to-[#e6a52b] active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(247,203,82,0.35)] hover:shadow-[0_0_35px_rgba(247,203,82,0.55)] border border-[#ffec9e] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-[#422904] animate-pulse" />
          <span>GENERATE TODAY'S POSTER</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* DOWNLOAD POSTER */}
          <button
            type="button"
            onClick={onDownloadPoster}
            className="py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wide text-[#fce8a6] bg-[#221a0f] hover:bg-[#332614] border border-[#543e1a] hover:border-[#85652e] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-[#f7d070]" />
            <span>DOWNLOAD PNG</span>
          </button>

          {/* SHARE ON WHATSAPP */}
          <button
            type="button"
            onClick={onShareWhatsApp}
            className="py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wide text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border border-emerald-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30 active:scale-[0.98]"
          >
            <Share2 className="w-4 h-4 text-emerald-100" />
            <span>SHARE WHATSAPP</span>
          </button>
        </div>

        {/* Copy Message shortcut */}
        <button
          type="button"
          onClick={handleCopyMessage}
          className="w-full py-2 px-3 text-xs text-[#a99c85] hover:text-[#f7d070] bg-[#141009] hover:bg-[#1f180d] rounded-lg border border-[#2d220e] transition-all flex items-center justify-center gap-1.5"
        >
          {copiedMessage ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Text Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy WhatsApp Text Summary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

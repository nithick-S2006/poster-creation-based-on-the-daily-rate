import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import type { PosterRenderOptions, ShopSettings } from '../types';
import { renderPosterToCanvas } from '../utils/posterRenderer';
import { AxisAdjuster } from './AxisAdjuster';
import {
  Maximize2,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Check,
  Layers,
  Sliders,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export interface PosterCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
  triggerRender: () => Promise<void>;
}

interface PosterCanvasProps {
  options: PosterRenderOptions;
  onFullscreen?: () => void;
  onSettingsChange?: (settings: ShopSettings) => void;
}

export const PosterCanvas = forwardRef<PosterCanvasHandle, PosterCanvasProps>(
  ({ options, onFullscreen, onSettingsChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const [renderSuccess, setRenderSuccess] = useState(false);
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [showAxisAdjuster, setShowAxisAdjuster] = useState<boolean>(false);

    const doRender = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        await renderPosterToCanvas(canvasRef.current, options);
        setRenderSuccess(true);
        setTimeout(() => setRenderSuccess(false), 1200);
      } catch (err) {
        console.error('Failed to render poster to canvas:', err);
      } finally {
        setIsRendering(false);
      }
    };

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      triggerRender: doRender,
    }));

    // Re-render whenever options or coordinates change
    useEffect(() => {
      const timer = setTimeout(() => {
        doRender();
      }, 50);
      return () => clearTimeout(timer);
    }, [
      options.goldRate,
      options.silverRate,
      options.dateStr,
      options.settings.posterMode,
      options.settings.customLogoUrl,
      options.settings.tamilFont,
      options.settings.shopName,
      options.settings.tamilShopName,
      options.settings.addressLine1,
      options.settings.addressLine2,
      options.settings.goldRateX,
      options.settings.goldRateY,
      options.settings.goldRateSize,
      options.settings.goldBgPatch,
      options.settings.goldBgWidth,
      options.settings.goldBgHeight,
      options.settings.silverRateX,
      options.settings.silverRateY,
      options.settings.silverRateSize,
      options.settings.silverBgPatch,
      options.settings.silverBgWidth,
      options.settings.silverBgHeight,
      options.settings.dateX,
      options.settings.dateY,
      options.settings.dateSize,
      options.settings.dateBgPatch,
      options.settings.dateBgWidth,
      options.settings.dateBgHeight,
    ]);

    return (
      <div className="flex flex-col h-full bg-[#120f0b] border border-[#3a2f18] rounded-2xl overflow-hidden shadow-2xl">
        {/* Poster Preview Header Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#18140e] border-b border-[#2e2513]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#2a2010] text-[#f7d070]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#f7d070] tracking-wide">
                  LIVE POSTER PREVIEW
                </span>
                {renderSuccess && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/50">
                    <Check className="w-3 h-3" /> Updated
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#a49882]">
                1080 × 1920 px (9:16 Ultra HD)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Axis Fine-Tuning Toggle Button */}
            {onSettingsChange && (
              <button
                type="button"
                onClick={() => setShowAxisAdjuster((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  showAxisAdjuster
                    ? 'bg-[#3b2c14] text-[#ffe699] border-[#f7d070] shadow-md shadow-amber-950'
                    : 'bg-[#221b10] hover:bg-[#322714] text-[#cfb684] border-[#3e3119]'
                }`}
                title="Adjust Text X & Y Positions"
              >
                <Sliders className="w-3.5 h-3.5 text-[#f7d070]" />
                <span className="hidden sm:inline">Adjust Axis</span>
                {showAxisAdjuster ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {/* Refresh render */}
            <button
              onClick={doRender}
              disabled={isRendering}
              title="Force re-render"
              className="p-1.5 text-[#cfb684] hover:text-white bg-[#221b10] hover:bg-[#322714] rounded-lg border border-[#3e3119] transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isRendering ? 'animate-spin text-[#f7d070]' : ''}`} />
            </button>

            {/* Zoom Controls */}
            <div className="hidden md:flex items-center bg-[#221b10] rounded-lg border border-[#3e3119] p-0.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 15, 70))}
                className="p-1 text-[#a49882] hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1.5 text-[#cfb684]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 15, 140))}
                className="p-1 text-[#a49882] hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fullscreen Button */}
            {onFullscreen && (
              <button
                onClick={onFullscreen}
                title="Expand Fullscreen"
                className="p-1.5 text-[#cfb684] hover:text-white bg-[#221b10] hover:bg-[#322714] rounded-lg border border-[#3e3119] transition-all"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Axis Adjuster Panel */}
        {showAxisAdjuster && onSettingsChange && (
          <div className="p-3 bg-[#17120a] border-b border-[#362711]">
            <AxisAdjuster
              settings={options.settings}
              onChange={onSettingsChange}
              onClose={() => setShowAxisAdjuster(false)}
            />
          </div>
        )}

        {/* Poster Canvas Viewport */}
        <div className="relative flex-1 p-4 md:p-6 flex items-center justify-center overflow-auto bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#18130a] via-[#0d0a06] to-[#050403]">
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(#f7d070 1px, transparent 1px), radial-gradient(#f7d070 1px, #0d0a06 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Canvas Wrapper with realistic luxury phone / print shadow */}
          <div
            className="relative transition-all duration-200 ease-out"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'center center',
            }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(212,163,50,0.18)] border border-[#483719]">
              <canvas
                ref={canvasRef}
                className="block max-h-[72vh] w-auto aspect-[9/16] object-contain select-none"
                style={{
                  maxHeight: 'min(70vh, 760px)',
                }}
              />
            </div>

            {/* Loading Overlay */}
            {isRendering && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center rounded-xl">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#1c160b] border border-[#d4af37]/40 rounded-lg text-[#fce8a6] text-xs font-medium shadow-xl">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#d4af37]" />
                  Rendering Poster...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom preview info strip */}
        <div className="px-4 py-2 bg-[#16120b] border-t border-[#2a200f] flex items-center justify-between text-xs text-[#8d806a]">
          <span>⚡ Live rendering enabled</span>
          <span className="font-mono text-[11px] text-[#cfb684]">
            Gold: ({options.settings.goldRateX ?? 702}, {options.settings.goldRateY ?? 948}) | Silver: ({options.settings.silverRateX ?? 723}, {options.settings.silverRateY ?? 1598}) | Date: ({options.settings.dateX ?? 540}, {options.settings.dateY ?? 1742})
          </span>
        </div>
      </div>
    );
  }
);

import React, { useState } from 'react';
import type { ShopSettings } from '../types';
import { Sliders, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, EyeOff, Type } from 'lucide-react';

interface AxisAdjusterProps {
  settings: ShopSettings;
  onChange: (updatedSettings: ShopSettings) => void;
  onClose?: () => void;
}

export const AxisAdjuster: React.FC<AxisAdjusterProps> = ({
  settings,
  onChange,
}) => {
  const [showBgControls, setShowBgControls] = useState<boolean>(false);

  const updateSetting = <K extends keyof ShopSettings>(key: K, value: ShopSettings[K]) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const nudge = (key: 'gold' | 'silver' | 'date', axis: 'x' | 'y', delta: number) => {
    if (key === 'gold') {
      if (axis === 'x') updateSetting('goldRateX', (settings.goldRateX ?? 685) + delta);
      if (axis === 'y') updateSetting('goldRateY', (settings.goldRateY ?? 948) + delta);
    } else if (key === 'silver') {
      if (axis === 'x') updateSetting('silverRateX', (settings.silverRateX ?? 700) + delta);
      if (axis === 'y') updateSetting('silverRateY', (settings.silverRateY ?? 1595) + delta);
    } else if (key === 'date') {
      if (axis === 'x') updateSetting('dateX', (settings.dateX ?? 540) + delta);
      if (axis === 'y') updateSetting('dateY', (settings.dateY ?? 1790) + delta);
    }
  };

  const handleResetDefaults = () => {
    onChange({
      ...settings,
      goldRateX: 685,
      goldRateY: 948,
      goldRateSize: 104,
      goldBgPatch: false,
      goldBgWidth: 480,
      goldBgHeight: 110,
      silverRateX: 700,
      silverRateY: 1595,
      silverRateSize: 104,
      silverBgPatch: false,
      silverBgWidth: 480,
      silverBgHeight: 110,
      dateX: 540,
      dateY: 1790,
      dateSize: 36,
      dateBgPatch: false,
      dateBgWidth: 400,
      dateBgHeight: 40,
    });
  };

  return (
    <div className="p-4 bg-[#140f09] border border-[#3e3017] rounded-xl flex flex-col gap-4 text-xs shadow-xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2d220e] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#271d0e] text-[#f7d070] border border-[#483719]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#f7d070] text-sm uppercase tracking-wide">
              Rate & Date Size and Axis Adjuster
            </h3>
            <p className="text-[11px] text-[#938670]">
              Adjust text size, horizontal (X) and vertical (Y) positions in real time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBgControls(!showBgControls)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-all ${
              showBgControls
                ? 'bg-[#2f2210] text-[#f7d070] border-[#f7d070]'
                : 'bg-[#1b150c] text-[#8e806a] border-[#382b15] hover:text-white'
            }`}
          >
            {showBgControls ? <Eye className="w-3 h-3 text-[#f7d070]" /> : <EyeOff className="w-3 h-3" />}
            <span>Background Mask</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            title="Reset to calibrated default coordinates"
            className="px-2.5 py-1 bg-[#20190e] hover:bg-[#322614] text-[#cfb684] hover:text-white rounded-lg border border-[#3e3119] text-[11px] font-semibold flex items-center gap-1 transition-all"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* Grid of 3 controls: Gold, Silver, Date */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 1. GOLD RATE AXIS & SIZE */}
        <div className="p-3 bg-[#1a140d] border border-[#4a391a] rounded-xl flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#f7d070] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f7d070]" />
              Gold Rate
            </span>
            <span className="font-mono text-[10px] text-[#cfb684]">
              ({settings.goldRateX ?? 685}, {settings.goldRateY ?? 948}) • {settings.goldRateSize ?? 104}px
            </span>
          </div>

          {/* Directional Pad */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            <button
              type="button"
              onClick={() => nudge('gold', 'x', -5)}
              className="p-1.5 bg-[#251e12] hover:bg-[#382c16] text-[#f7d070] rounded-lg border border-[#443317]"
              title="Left 5px"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => nudge('gold', 'y', -5)}
                className="p-1.5 bg-[#251e12] hover:bg-[#382c16] text-[#f7d070] rounded-lg border border-[#443317]"
                title="Up 5px"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => nudge('gold', 'y', 5)}
                className="p-1.5 bg-[#251e12] hover:bg-[#382c16] text-[#f7d070] rounded-lg border border-[#443317]"
                title="Down 5px"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => nudge('gold', 'x', 5)}
              className="p-1.5 bg-[#251e12] hover:bg-[#382c16] text-[#f7d070] rounded-lg border border-[#443317]"
              title="Right 5px"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sliders */}
          <div className="space-y-2">
            {/* Text Size */}
            <div className="p-1.5 bg-[#120e08] rounded-lg border border-[#3a2c16]">
              <div className="flex justify-between text-[11px] text-[#fce8a6] font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Type className="w-3 h-3 text-[#f7d070]" /> Text Size:
                </span>
                <span className="font-mono text-[#f7d070]">{settings.goldRateSize ?? 104}px</span>
              </div>
              <input
                type="range"
                min="60"
                max="135"
                value={settings.goldRateSize ?? 104}
                onChange={(e) => updateSetting('goldRateSize', Number(e.target.value))}
                className="w-full accent-[#f7d070] h-1.5 bg-[#251d11] rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#a99c85]">
                <span>X Position (Horizontal):</span>
                <span className="font-mono">{settings.goldRateX ?? 685}px</span>
              </div>
              <input
                type="range"
                min="500"
                max="900"
                value={settings.goldRateX ?? 685}
                onChange={(e) => updateSetting('goldRateX', Number(e.target.value))}
                className="w-full accent-[#f7d070] h-1.5 bg-[#0f0c08] rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#a99c85]">
                <span>Y Position (Vertical):</span>
                <span className="font-mono">{settings.goldRateY ?? 948}px</span>
              </div>
              <input
                type="range"
                min="850"
                max="1050"
                value={settings.goldRateY ?? 948}
                onChange={(e) => updateSetting('goldRateY', Number(e.target.value))}
                className="w-full accent-[#f7d070] h-1.5 bg-[#0f0c08] rounded cursor-pointer"
              />
            </div>

            {/* Optional Background Patch */}
            {showBgControls && (
              <div className="pt-2 border-t border-[#312513] space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10px] text-[#cfb684] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.goldBgPatch ?? false}
                    onChange={(e) => updateSetting('goldBgPatch', e.target.checked)}
                    className="accent-[#f7d070] rounded"
                  />
                  <span>Draw Black Background Box</span>
                </label>
                {settings.goldBgPatch && (
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span>Box Width:</span>
                      <input
                        type="number"
                        value={settings.goldBgWidth ?? 480}
                        onChange={(e) => updateSetting('goldBgWidth', Number(e.target.value))}
                        className="w-full px-1.5 py-0.5 bg-[#100d07] border border-[#3e3016] rounded text-white"
                      />
                    </div>
                    <div>
                      <span>Box Height:</span>
                      <input
                        type="number"
                        value={settings.goldBgHeight ?? 110}
                        onChange={(e) => updateSetting('goldBgHeight', Number(e.target.value))}
                        className="w-full px-1.5 py-0.5 bg-[#100d07] border border-[#3e3016] rounded text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. SILVER RATE AXIS & SIZE */}
        <div className="p-3 bg-[#1a140d] border border-[#3e3c3b] rounded-xl flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#e1e7ec] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d0d7de]" />
              Silver Rate
            </span>
            <span className="font-mono text-[10px] text-[#b0bac5]">
              ({settings.silverRateX ?? 700}, {settings.silverRateY ?? 1595}) • {settings.silverRateSize ?? 104}px
            </span>
          </div>

          {/* Directional Pad */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            <button
              type="button"
              onClick={() => nudge('silver', 'x', -5)}
              className="p-1.5 bg-[#202428] hover:bg-[#303840] text-[#d0d7de] rounded-lg border border-[#3d444d]"
              title="Left 5px"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => nudge('silver', 'y', -5)}
                className="p-1.5 bg-[#202428] hover:bg-[#303840] text-[#d0d7de] rounded-lg border border-[#3d444d]"
                title="Up 5px"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => nudge('silver', 'y', 5)}
                className="p-1.5 bg-[#202428] hover:bg-[#303840] text-[#d0d7de] rounded-lg border border-[#3d444d]"
                title="Down 5px"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => nudge('silver', 'x', 5)}
              className="p-1.5 bg-[#202428] hover:bg-[#303840] text-[#d0d7de] rounded-lg border border-[#3d444d]"
              title="Right 5px"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sliders */}
          <div className="space-y-2">
            {/* Text Size */}
            <div className="p-1.5 bg-[#120e08] rounded-lg border border-[#333a42]">
              <div className="flex justify-between text-[11px] text-[#e1e7ec] font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Type className="w-3 h-3 text-[#d0d7de]" /> Text Size:
                </span>
                <span className="font-mono text-[#d0d7de]">{settings.silverRateSize ?? 104}px</span>
              </div>
              <input
                type="range"
                min="60"
                max="135"
                value={settings.silverRateSize ?? 104}
                onChange={(e) => updateSetting('silverRateSize', Number(e.target.value))}
                className="w-full accent-[#d0d7de] h-1.5 bg-[#202428] rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#a99c85]">
                <span>X Position (Horizontal):</span>
                <span className="font-mono">{settings.silverRateX ?? 700}px</span>
              </div>
              <input
                type="range"
                min="500"
                max="900"
                value={settings.silverRateX ?? 700}
                onChange={(e) => updateSetting('silverRateX', Number(e.target.value))}
                className="w-full accent-[#d0d7de] h-1.5 bg-[#0f0c08] rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#a99c85]">
                <span>Y Position (Vertical):</span>
                <span className="font-mono">{settings.silverRateY ?? 1595}px</span>
              </div>
              <input
                type="range"
                min="1450"
                max="1700"
                value={settings.silverRateY ?? 1595}
                onChange={(e) => updateSetting('silverRateY', Number(e.target.value))}
                className="w-full accent-[#d0d7de] h-1.5 bg-[#0f0c08] rounded cursor-pointer"
              />
            </div>

            {/* Optional Background Patch */}
            {showBgControls && (
              <div className="pt-2 border-t border-[#312513] space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10px] text-[#cfb684] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.silverBgPatch ?? false}
                    onChange={(e) => updateSetting('silverBgPatch', e.target.checked)}
                    className="accent-[#d0d7de] rounded"
                  />
                  <span>Draw Black Background Box</span>
                </label>
                {settings.silverBgPatch && (
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span>Box Width:</span>
                      <input
                        type="number"
                        value={settings.silverBgWidth ?? 480}
                        onChange={(e) => updateSetting('silverBgWidth', Number(e.target.value))}
                        className="w-full px-1.5 py-0.5 bg-[#100d07] border border-[#3e3016] rounded text-white"
                      />
                    </div>
                    <div>
                      <span>Box Height:</span>
                      <input
                        type="number"
                        value={settings.silverBgHeight ?? 110}
                        onChange={(e) => updateSetting('silverBgHeight', Number(e.target.value))}
                        className="w-full px-1.5 py-0.5 bg-[#100d07] border border-[#3e3016] rounded text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3. DATE AXIS & SIZE */}
        <div className="p-3 bg-[#1a140d] border border-[#362913] rounded-xl flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#fce8a6] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#fce8a6]" />
              Date
            </span>
            <span className="font-mono text-[10px] text-[#cfb684]">
              ({settings.dateX ?? 540}, {settings.dateY ?? 1790}) • {settings.dateSize ?? 36}px
            </span>
          </div>

          {/* Directional Pad */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            <button
              type="button"
              onClick={() => nudge('date', 'x', -5)}
              className="p-1.5 bg-[#251e12] hover:bg-[#382c16] text-[#f7d070] rounded-lg border border-[#443317]"
              title="Left 5px"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => nudge('date', 'y', -5)}
                className="p-1.5 bg-[#251e12] hover:bg-[#382c16] text-[#f7d070] rounded-lg border border-[#443317]"
                title="Up 5px"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => nudge('date', 'y', 5)}
                className="p-1.5 bg-[#251e12] hover:bg-[#382c16] text-[#f7d070] rounded-lg border border-[#443317]"
                title="Down 5px"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => nudge('date', 'x', 5)}
              className="p-1.5 bg-[#251e12] hover:bg-[#382c16] text-[#f7d070] rounded-lg border border-[#443317]"
              title="Right 5px"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sliders */}
          <div className="space-y-2">
            {/* Text Size */}
            <div className="p-1.5 bg-[#120e08] rounded-lg border border-[#3a2c16]">
              <div className="flex justify-between text-[11px] text-[#fce8a6] font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Type className="w-3 h-3 text-[#fce8a6]" /> Text Size:
                </span>
                <span className="font-mono text-[#fce8a6]">{settings.dateSize ?? 36}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="60"
                value={settings.dateSize ?? 36}
                onChange={(e) => updateSetting('dateSize', Number(e.target.value))}
                className="w-full accent-[#fce8a6] h-1.5 bg-[#251d11] rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#a99c85]">
                <span>X Position (Horizontal):</span>
                <span className="font-mono">{settings.dateX ?? 540}px</span>
              </div>
              <input
                type="range"
                min="250"
                max="800"
                value={settings.dateX ?? 540}
                onChange={(e) => updateSetting('dateX', Number(e.target.value))}
                className="w-full accent-[#fce8a6] h-1.5 bg-[#0f0c08] rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#a99c85]">
                <span>Y Position (Vertical):</span>
                <span className="font-mono">{settings.dateY ?? 1790}px</span>
              </div>
              <input
                type="range"
                min="1700"
                max="1840"
                value={settings.dateY ?? 1790}
                onChange={(e) => updateSetting('dateY', Number(e.target.value))}
                className="w-full accent-[#fce8a6] h-1.5 bg-[#0f0c08] rounded cursor-pointer"
              />
            </div>

            {/* Optional Background Patch */}
            {showBgControls && (
              <div className="pt-2 border-t border-[#312513] space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10px] text-[#cfb684] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.dateBgPatch ?? false}
                    onChange={(e) => updateSetting('dateBgPatch', e.target.checked)}
                    className="accent-[#fce8a6] rounded"
                  />
                  <span>Draw Black Background Box</span>
                </label>
                {settings.dateBgPatch && (
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span>Box Width:</span>
                      <input
                        type="number"
                        value={settings.dateBgWidth ?? 380}
                        onChange={(e) => updateSetting('dateBgWidth', Number(e.target.value))}
                        className="w-full px-1.5 py-0.5 bg-[#100d07] border border-[#3e3016] rounded text-white"
                      />
                    </div>
                    <div>
                      <span>Box Height:</span>
                      <input
                        type="number"
                        value={settings.dateBgHeight ?? 45}
                        onChange={(e) => updateSetting('dateBgHeight', Number(e.target.value))}
                        className="w-full px-1.5 py-0.5 bg-[#100d07] border border-[#3e3016] rounded text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

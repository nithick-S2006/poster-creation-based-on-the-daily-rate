import React, { useState, useRef } from 'react';
import type { ShopSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/storage';
import { api } from '../utils/apiService';
import { AxisAdjuster } from './AxisAdjuster';
import {
  X,
  Settings,
  Store,
  Upload,
  RotateCcw,
  Save,
  Check,
  Server,
  FileImage,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: ShopSettings;
  onClose: () => void;
  onSave: (newSettings: ShopSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ShopSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backendPing, setBackendPing] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleChange = <K extends keyof ShopSettings>(key: K, value: ShopSettings[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleChange('customLogoUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    handleChange('customLogoUrl', null);
  };

  const handlePingBackend = async () => {
    setBackendPing('checking');
    api.updateConfig(formData.backendApiUrl, formData.useBackendApi);
    const ok = await api.checkHealth();
    setBackendPing(ok ? 'online' : 'offline');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false),
      onClose();
    }, 800);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all settings to default values?')) {
      setFormData({ ...DEFAULT_SETTINGS });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#16120b] border border-[#483719] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1e170d] border-b border-[#362711]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2a2010] text-[#f7d070] border border-[#4d3a19]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#f7d070] tracking-wide">
                SHOP & POSTER SETTINGS
              </h2>
              <p className="text-xs text-[#a99c85]">
                Customize shop details, typography, logo, and backend integrations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#9a8d77] hover:text-white hover:bg-[#2b2010] rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          {/* 1. Shop Names */}
          <div className="space-y-3 p-4 rounded-xl bg-[#1c160e] border border-[#3b2d16]">
            <h3 className="text-xs font-bold text-[#f7d070] uppercase tracking-wider flex items-center gap-2">
              <Store className="w-4 h-4" /> Shop Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#b5a790] mb-1">
                  Shop Name (English)
                </label>
                <input
                  type="text"
                  value={formData.shopName}
                  onChange={(e) => handleChange('shopName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#120e08] border border-[#48381c] rounded-lg text-sm text-white focus:outline-none focus:border-[#f7d070]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#b5a790] mb-1">
                  Tamil Shop Name (ஸ்ரீ சேர்மன் ஜூவல்லர்ஸ்)
                </label>
                <input
                  type="text"
                  value={formData.tamilShopName}
                  onChange={(e) => handleChange('tamilShopName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#120e08] border border-[#48381c] rounded-lg text-sm text-white focus:outline-none focus:border-[#f7d070]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b5a790] mb-1">
                Subtitle Banner (Tamil)
              </label>
              <input
                type="text"
                value={formData.subtitleText}
                onChange={(e) => handleChange('subtitleText', e.target.value)}
                className="w-full px-3 py-2 bg-[#120e08] border border-[#48381c] rounded-lg text-sm text-white focus:outline-none focus:border-[#f7d070]"
              />
            </div>
          </div>

          {/* 2. Address & Footer */}
          <div className="space-y-3 p-4 rounded-xl bg-[#1c160e] border border-[#3b2d16]">
            <h3 className="text-xs font-bold text-[#f7d070] uppercase tracking-wider">
              Address & Footer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#b5a790] mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                  className="w-full px-3 py-2 bg-[#120e08] border border-[#48381c] rounded-lg text-sm text-white focus:outline-none focus:border-[#f7d070]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#b5a790] mb-1">
                  Address Line 2 (City & Pincode)
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleChange('addressLine2', e.target.value)}
                  className="w-full px-3 py-2 bg-[#120e08] border border-[#48381c] rounded-lg text-sm text-white focus:outline-none focus:border-[#f7d070]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b5a790] mb-1">
                Footer Thank-You Text
              </label>
              <input
                type="text"
                value={formData.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                className="w-full px-3 py-2 bg-[#120e08] border border-[#48381c] rounded-lg text-sm text-white focus:outline-none focus:border-[#f7d070]"
              />
            </div>
          </div>

          {/* 3. Poster Design & Logo */}
          <div className="space-y-3 p-4 rounded-xl bg-[#1c160e] border border-[#3b2d16]">
            <h3 className="text-xs font-bold text-[#f7d070] uppercase tracking-wider flex items-center gap-2">
              <FileImage className="w-4 h-4" /> Poster Design & Logo
            </h3>

            {/* Poster Mode Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#b5a790] mb-1.5">
                Poster Rendering Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('posterMode', 'original_match')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    formData.posterMode === 'original_match'
                      ? 'bg-[#291f10] border-[#f7d070] text-[#f7d070] shadow-md'
                      : 'bg-[#141009] border-[#3d2f16] text-[#9b8d76] hover:border-[#634e27]'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    ✨ Original Poster Match
                  </span>
                  <span className="text-[11px] opacity-80">
                    Preserves original 3D embossed diamond title, frames, and ornate flourishes.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('posterMode', 'custom_modular')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    formData.posterMode === 'custom_modular'
                      ? 'bg-[#291f10] border-[#f7d070] text-[#f7d070] shadow-md'
                      : 'bg-[#141009] border-[#3d2f16] text-[#9b8d76] hover:border-[#634e27]'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    🎨 Custom Modular Typography
                  </span>
                  <span className="text-[11px] opacity-80">
                    Renders dynamic shop name and address with chosen Tamil Unicode font.
                  </span>
                </button>
              </div>
            </div>

            {/* Tamil Font Picker */}
            <div>
              <label className="block text-xs font-semibold text-[#b5a790] mb-1">
                Tamil Unicode Font
              </label>
              <select
                value={formData.tamilFont}
                onChange={(e) =>
                  handleChange('tamilFont', e.target.value as ShopSettings['tamilFont'])
                }
                className="w-full px-3 py-2 bg-[#120e08] border border-[#48381c] rounded-lg text-sm text-white focus:outline-none focus:border-[#f7d070]"
              >
                <option value="Noto Sans Tamil">Noto Sans Tamil (Clean & Modern)</option>
                <option value="Mukta Malar">Mukta Malar (Traditional Tamil)</option>
                <option value="Baloo Thambi 2">Baloo Thambi 2 (Bold & Friendly)</option>
                <option value="Anek Tamil">Anek Tamil (Display Headline)</option>
              </select>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-xs font-semibold text-[#b5a790] mb-1.5">
                Shop Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#120e08] border border-[#48381c] flex items-center justify-center overflow-hidden p-1">
                  {formData.customLogoUrl ? (
                    <img
                      src={formData.customLogoUrl}
                      alt="Custom Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src="/assets/logo_1080.png"
                      alt="Original Logo"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#251e12] hover:bg-[#382b15] text-[#f7d070] rounded-lg border border-[#483719] text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Logo
                  </button>

                  {formData.customLogoUrl && (
                    <button
                      type="button"
                      onClick={handleResetLogo}
                      className="px-3 py-1.5 bg-[#18130b] hover:bg-[#251e12] text-[#9b8d76] hover:text-white rounded-lg border border-[#3e3017] text-xs font-semibold transition-all"
                    >
                      Reset to Original
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Axis & Positioning Fine-Tuning */}
          <AxisAdjuster
            settings={formData}
            onChange={(updated) => setFormData(updated)}
          />

          {/* 5. Spring Boot & MySQL Backend Integration */}
          <div className="space-y-3 p-4 rounded-xl bg-[#1c160e] border border-[#3b2d16]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#f7d070] uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4" /> Backend & Database Integration
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#b5a790]">Spring Boot API Mode:</span>
                <input
                  type="checkbox"
                  checked={formData.useBackendApi}
                  onChange={(e) => handleChange('useBackendApi', e.target.checked)}
                  className="w-4 h-4 accent-[#f7d070] rounded cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b5a790] mb-1">
                REST API Base URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.backendApiUrl}
                  onChange={(e) => handleChange('backendApiUrl', e.target.value)}
                  placeholder="http://localhost:8080/api"
                  className="flex-1 px-3 py-2 bg-[#120e08] border border-[#48381c] rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[#f7d070]"
                />
                <button
                  type="button"
                  onClick={handlePingBackend}
                  className="px-3 py-2 bg-[#251e12] hover:bg-[#382b15] text-[#cfb684] rounded-lg border border-[#483719] text-xs font-semibold transition-all"
                >
                  Test Connection
                </button>
              </div>

              {backendPing === 'checking' && (
                <p className="text-[11px] text-[#f7d070] mt-1">Connecting to Spring Boot...</p>
              )}
              {backendPing === 'online' && (
                <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
                  ✓ Spring Boot REST API is connected!
                </p>
              )}
              {backendPing === 'offline' && (
                <p className="text-[11px] text-amber-400 mt-1">
                  Backend offline — falling back seamlessly to browser LocalStorage.
                </p>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#312513]">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-[#8c7f6b] hover:text-red-400 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#1b150c] hover:bg-[#281f12] text-[#cfb684] rounded-xl border border-[#3e3017] text-xs font-semibold transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-[#ffe17d] to-[#d8971f] hover:from-[#ffeb99] hover:to-[#e6a52b] text-[#221703] font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#f7cb52]/20 transition-all cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-[#221703]" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#221703]" /> Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

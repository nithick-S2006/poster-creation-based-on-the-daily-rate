import React, { useEffect, useState } from 'react';
import type { ShopSettings } from '../types';
import { getTodayKolkataDate, getTodayKolkataTime } from '../utils/dateUtils';
import { Sparkles, Clock, Calendar, Settings, HelpCircle, Database } from 'lucide-react';

interface HeaderProps {
  settings: ShopSettings;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenSettings,
  onOpenHelp,
}) => {
  const [currentTime, setCurrentTime] = useState(getTodayKolkataTime());
  const todayDate = getTodayKolkataDate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getTodayKolkataTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#151009]/95 backdrop-blur-md border-b border-[#3b2d15] sticky top-0 z-40 px-4 md:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#2f2210] to-[#140e06] border border-[#f7d070]/40 flex items-center justify-center shadow-lg shadow-amber-950/40 overflow-hidden p-1">
            {settings.customLogoUrl ? (
              <img
                src={settings.customLogoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src="/assets/logo_1080.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-extrabold tracking-wide text-white uppercase font-serif m-0">
                <span className="text-white">{settings.shopName.split(' ')[0]} </span>
                <span className="text-[#f7d070]">{settings.shopName.split(' ').slice(1).join(' ')}</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#271d0d] text-[#f7d070] border border-[#523d19]">
                <Sparkles className="w-2.5 h-2.5" /> 22K 916
              </span>
            </div>
            <p className="text-xs text-[#a49680] font-medium">
              <span className="text-[#fce8a6]">{settings.tamilShopName}</span> • Daily Gold & Silver Rate Management
            </p>
          </div>
        </div>

        {/* Right: Live IST Clock, Status & Actions */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Live Date & Time pill */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1d160c] border border-[#3a2c16] text-xs">
            <div className="flex items-center gap-1.5 text-[#cfb684]">
              <Calendar className="w-3.5 h-3.5 text-[#f7d070]" />
              <span className="font-mono font-semibold">{todayDate}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-[#5c4928]" />
            <div className="flex items-center gap-1.5 text-[#a49680]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[11px] text-[#f3e3be]">{currentTime} IST</span>
            </div>
          </div>

          {/* Storage / Backend indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1b150c] border border-[#3a2c16] text-[11px] text-[#9e8f77]"
            title={
              settings.useBackendApi
                ? `Connected to Spring Boot REST API at ${settings.backendApiUrl}`
                : 'Operating in Browser LocalStorage mode (Persistent & Offline)'
            }
          >
            <Database className="w-3 h-3 text-[#f7d070]" />
            <span className="font-medium text-[#cbb893]">
              {settings.useBackendApi ? 'Spring Boot' : 'Storage Active'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            title="User Guide & Testing"
            className="p-2 text-[#b5a589] hover:text-[#f7d070] bg-[#1d160c] hover:bg-[#2b2011] rounded-xl border border-[#3a2c16] transition-all"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Shop & Poster Settings"
            className="p-2 text-[#b5a589] hover:text-[#f7d070] bg-[#1d160c] hover:bg-[#2b2011] rounded-xl border border-[#3a2c16] transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

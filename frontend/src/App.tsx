import React, { useState, useEffect, useRef } from 'react';
import type { ShopSettings, DailyRate } from './types';
import * as storage from './utils/storage';
import { getTodayKolkataDate } from './utils/dateUtils';
import { downloadPosterImage } from './utils/posterRenderer';
import { sharePosterOnWhatsApp, generateWhatsAppMessage } from './utils/whatsappShare';
import { api } from './utils/apiService';

import { Header } from './components/Header';
import { RateForm } from './components/RateForm';
import { PosterCanvas } from './components/PosterCanvas';
import type { PosterCanvasHandle } from './components/PosterCanvas';
import { HistorySection } from './components/HistorySection';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { PosterPreviewModal } from './components/PosterPreviewModal';
import { WhatsAppGuideModal } from './components/WhatsAppGuideModal';

export const App: React.FC = () => {
  // Settings & Storage State
  const [settings, setSettings] = useState<ShopSettings>(() => storage.loadSettings());
  const [history, setHistory] = useState<DailyRate[]>(() => storage.loadRateHistory());

  // Form State
  const drafts = storage.loadDraftRates();
  const [goldRate, setGoldRate] = useState<number>(drafts.goldRate || 12985);
  const [silverRate, setSilverRate] = useState<number>(drafts.silverRate || 190);
  const [dateStr, setDateStr] = useState<string>(() => drafts.customDate || getTodayKolkataDate());
  const [isAutoDate, setIsAutoDate] = useState<boolean>(!drafts.customDate);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isWhatsAppGuideOpen, setIsWhatsAppGuideOpen] = useState<boolean>(false);
  const [whatsAppGuideData, setWhatsAppGuideData] = useState<{
    messageText: string;
    whatsappUrl: string;
    whatsappAppUrl?: string;
    filename: string;
    recipientPhone: string;
  }>({ messageText: '', whatsappUrl: '', filename: '', recipientPhone: '' });

  const canvasHandleRef = useRef<PosterCanvasHandle | null>(null);

  // Persist draft changes
  useEffect(() => {
    storage.saveDraftRates({
      goldRate,
      silverRate,
      customDate: isAutoDate ? undefined : dateStr,
    });
  }, [goldRate, silverRate, dateStr, isAutoDate]);

  // Handle gold rate change
  const handleGoldRateChange = (newRate: number) => {
    setGoldRate(newRate);
  };

  // Handle silver rate change
  const handleSilverRateChange = (newRate: number) => {
    setSilverRate(newRate);
  };

  // Handle date change
  const handleDateChange = (newDate: string) => {
    setDateStr(newDate);
  };

  // Handle auto date toggle
  const handleAutoDateToggle = (auto: boolean) => {
    setIsAutoDate(auto);
    if (auto) {
      setDateStr(getTodayKolkataDate());
    }
  };

  // Handle settings update
  const handleSaveSettings = async (newSettings: ShopSettings) => {
    setSettings(newSettings);
    await api.saveSettings(newSettings);
  };

  // Generate poster action
  const handleGeneratePoster = async () => {
    setIsGenerating(true);
    try {
      if (canvasHandleRef.current) {
        await canvasHandleRef.current.triggerRender();
      }

      // Record into History
      const filename = `SRI_CHAIRMAN_JEWELLERS_DAILY_RATE_${dateStr}.png`;
      await api.saveRate({
        date: dateStr,
        goldRate,
        silverRate,
        timestamp: new Date().toISOString(),
        posterFilename: filename,
      });

      // Update local history state
      setHistory(storage.loadRateHistory());
    } catch (e) {
      console.error('Poster generation failed:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download poster action
  const handleDownloadPoster = async () => {
    const canvas = canvasHandleRef.current?.getCanvas();
    if (!canvas) return;
    try {
      await downloadPosterImage(canvas, dateStr);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  // Share WhatsApp action
  const handleShareWhatsApp = async () => {
    const canvas = canvasHandleRef.current?.getCanvas();
    if (!canvas) return;

    try {
      const result = await sharePosterOnWhatsApp(
        canvas,
        goldRate,
        silverRate,
        dateStr,
        settings
      );

      // If fallback triggered, show instruction modal
      if (result.method === 'whatsapp_web') {
        const msg = generateWhatsAppMessage(goldRate, silverRate, dateStr, settings);
        setWhatsAppGuideData({
          messageText: msg,
          whatsappUrl: result.whatsappUrl || '',
          whatsappAppUrl: result.whatsappAppUrl || '',
          filename: result.filename || `SRI_CHAIRMAN_JEWELLERS_DAILY_RATE_${dateStr}.png`,
          recipientPhone: settings.whatsappNumber,
        });
        setIsWhatsAppGuideOpen(true);
      }
    } catch (e) {
      console.error('WhatsApp share error:', e);
    }
  };

  // History Actions
  const handleLoadRate = (item: DailyRate) => {
    setGoldRate(item.goldRate);
    setSilverRate(item.silverRate);
    setDateStr(item.date);
    setIsAutoDate(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRate = (id: string) => {
    const updated = storage.deleteDailyRate(id);
    setHistory(updated);
  };

  const handleRegenerateAndDownload = async (item: DailyRate) => {
    setGoldRate(item.goldRate);
    setSilverRate(item.silverRate);
    setDateStr(item.date);
    setIsAutoDate(false);

    // Wait short tick for canvas to update and download
    setTimeout(async () => {
      const canvas = canvasHandleRef.current?.getCanvas();
      if (canvas) {
        await downloadPosterImage(canvas, item.date);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0906] text-[#f7f2e7] selection:bg-[#f7d070]/30 selection:text-white">
      {/* Top Header */}
      <Header
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8">
        {/* Top 2-Column Grid: Left Controls + Right Live Poster Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Panel: Form Controls (5 columns on large screen) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <RateForm
              goldRate={goldRate}
              silverRate={silverRate}
              dateStr={dateStr}
              isAutoDate={isAutoDate}
              settings={settings}
              onGoldRateChange={handleGoldRateChange}
              onSilverRateChange={handleSilverRateChange}
              onDateChange={handleDateChange}
              onAutoDateToggle={handleAutoDateToggle}
              onSettingsChange={handleSaveSettings}
              onGeneratePoster={handleGeneratePoster}
              onDownloadPoster={handleDownloadPoster}
              onShareWhatsApp={handleShareWhatsApp}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Panel: Live Poster Preview (7 columns on large screen) */}
          <div className="lg:col-span-7 flex flex-col h-full sticky top-24">
            <PosterCanvas
              ref={canvasHandleRef}
              options={{
                goldRate,
                silverRate,
                dateStr,
                settings,
              }}
              onFullscreen={() => setIsPreviewModalOpen(true)}
              onSettingsChange={handleSaveSettings}
            />
          </div>
        </div>

        {/* Bottom Section: Daily Rate History Archive */}
        <section className="w-full">
          <HistorySection
            history={history}
            onLoadRate={handleLoadRate}
            onDeleteRate={handleDeleteRate}
            onRegenerateAndDownload={handleRegenerateAndDownload}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0e0b07] border-t border-[#292010] py-6 px-4 text-center text-xs text-[#82745e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#cfb684]">{settings.shopName}</span>
            <span>•</span>
            <span className="text-[#a49680]">{settings.tamilShopName}</span>
          </div>
          <p className="text-[#6d614f]">
            {settings.addressLine1} {settings.addressLine2} • {settings.footerText}
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />

      {/* Help / Testing Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onApplyRates={(gold, silver) => {
          setGoldRate(gold);
          setSilverRate(silver);
        }}
      />

      {/* Fullscreen Poster Preview Modal */}
      <PosterPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        canvas={canvasHandleRef.current?.getCanvas() || null}
        onDownload={handleDownloadPoster}
        onShare={handleShareWhatsApp}
      />

      {/* WhatsApp Sharing Guidance Modal */}
      <WhatsAppGuideModal
        isOpen={isWhatsAppGuideOpen}
        messageText={whatsAppGuideData.messageText}
        whatsappUrl={whatsAppGuideData.whatsappUrl}
        whatsappAppUrl={whatsAppGuideData.whatsappAppUrl}
        filename={whatsAppGuideData.filename}
        recipientPhone={whatsAppGuideData.recipientPhone}
        onClose={() => setIsWhatsAppGuideOpen(false)}
      />
    </div>
  );
};

export default App;

import type { ShopSettings, DailyRate } from '../types';
import { getTodayKolkataDate } from './dateUtils';

const SETTINGS_KEY = 'scj_shop_settings_v1';
const HISTORY_KEY = 'scj_rate_history_v1';
const DRAFT_RATES_KEY = 'scj_draft_rates_v1';

export const DEFAULT_SETTINGS: ShopSettings = {
  shopName: 'SRI CHAIRMAN JEWELLERS',
  tamilShopName: 'ஸ்ரீ சேர்மன் ஜூவல்லர்ஸ்',
  addressLine1: '12, BIG BAZAAR STREET,',
  addressLine2: 'RASIPURAM - 637408',
  goldPurity: '22 கேரட் (22k)',
  silverPurity: 'Silver – Per Gram',
  footerText: 'வாடிக்கையாளர்களின் ஆதரவுக்கு நன்றி!',
  whatsappNumber: '+919876543210',
  subtitleText: 'இன்றைய தங்கம் மற்றும் வெள்ளி விலை நிலவரம்',
  goldLabelTamil: 'தங்கம் (GOLD)',
  goldLabelEng: 'GOLD RATE',
  silverLabelTamil: 'வெள்ளி (SILVER)',
  silverLabelEng: 'SILVER RATE',
  weightLabel: '1 கிராம்',
  datePrefix: 'தேதி: ',
  customLogoUrl: null,
  tamilFont: 'Noto Sans Tamil',
  posterMode: 'original_match',
  backendApiUrl: 'http://localhost:8080/api',
  useBackendApi: false,

  // Default text axis positions & font sizes on 1080x1920 canvas
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
};

export function loadSettings(): ShopSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      goldBgPatch: parsed.goldBgPatch ?? false,
      silverBgPatch: parsed.silverBgPatch ?? false,
      dateBgPatch: parsed.dateBgPatch ?? false,
    };
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ShopSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadRateHistory(): DailyRate[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      // Seed with sample initial record matching original poster
      const initial: DailyRate[] = [
        {
          id: 'scj-seed-1',
          date: getTodayKolkataDate(),
          goldRate: 12985,
          silverRate: 190,
          timestamp: new Date().toISOString(),
          posterFilename: `SRI_CHAIRMAN_JEWELLERS_DAILY_RATE_${getTodayKolkataDate()}.png`,
          notes: 'Standard opening rate'
        }
      ];
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load history:', e);
    return [];
  }
}

export function saveRateHistory(history: DailyRate[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history:', e);
  }
}

export function addOrUpdateDailyRate(newRate: Omit<DailyRate, 'id'>): { rate: DailyRate; isNew: boolean } {
  const history = loadRateHistory();
  const existingIndex = history.findIndex(r => r.date === newRate.date);

  let updatedRate: DailyRate;
  let isNew = false;

  if (existingIndex >= 0) {
    // Update existing for that date
    updatedRate = {
      ...history[existingIndex],
      ...newRate,
      timestamp: new Date().toISOString()
    };
    history[existingIndex] = updatedRate;
  } else {
    // Add new
    isNew = true;
    updatedRate = {
      ...newRate,
      id: `rate_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };
    history.unshift(updatedRate);
  }

  saveRateHistory(history);
  return { rate: updatedRate, isNew };
}

export function deleteDailyRate(id: string): DailyRate[] {
  const history = loadRateHistory();
  const filtered = history.filter(r => r.id !== id);
  saveRateHistory(filtered);
  return filtered;
}

export function loadDraftRates(): { goldRate: number; silverRate: number; customDate?: string } {
  try {
    const raw = localStorage.getItem(DRAFT_RATES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load drafts:', e);
  }
  return { goldRate: 12985, silverRate: 190 };
}

export function saveDraftRates(rates: { goldRate: number; silverRate: number; customDate?: string }): void {
  try {
    localStorage.setItem(DRAFT_RATES_KEY, JSON.stringify(rates));
  } catch (e) {
    console.error('Failed to save drafts:', e);
  }
}

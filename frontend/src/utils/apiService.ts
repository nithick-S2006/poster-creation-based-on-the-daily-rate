import type { DailyRate, ShopSettings } from '../types';
import * as storage from './storage';

export class ApiService {
  private baseUrl: string;
  private useBackend: boolean;

  constructor() {
    const settings = storage.loadSettings();
    this.baseUrl = settings.backendApiUrl || 'http://localhost:8080/api';
    this.useBackend = settings.useBackendApi || false;
  }

  updateConfig(baseUrl: string, useBackend: boolean) {
    this.baseUrl = baseUrl;
    this.useBackend = useBackend;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  async getTodayRate(): Promise<DailyRate | null> {
    if (this.useBackend) {
      try {
        const res = await fetch(`${this.baseUrl}/rates/today`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable, using local storage:', e);
      }
    }
    const history = storage.loadRateHistory();
    return history[0] || null;
  }

  async getHistory(): Promise<DailyRate[]> {
    if (this.useBackend) {
      try {
        const res = await fetch(`${this.baseUrl}/rates/history`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable, using local storage:', e);
      }
    }
    return storage.loadRateHistory();
  }

  async saveRate(rate: Omit<DailyRate, 'id'>): Promise<{ rate: DailyRate; isNew: boolean }> {
    if (this.useBackend) {
      try {
        const res = await fetch(`${this.baseUrl}/rates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rate),
        });
        if (res.ok) {
          const saved = await res.json();
          // Also sync to local storage
          storage.addOrUpdateDailyRate(rate);
          return { rate: saved, isNew: true };
        }
      } catch (e) {
        console.warn('Backend save failed, saving locally:', e);
      }
    }
    return storage.addOrUpdateDailyRate(rate);
  }

  async getSettings(): Promise<ShopSettings> {
    if (this.useBackend) {
      try {
        const res = await fetch(`${this.baseUrl}/settings`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend unavailable, using local settings:', e);
      }
    }
    return storage.loadSettings();
  }

  async saveSettings(settings: ShopSettings): Promise<void> {
    storage.saveSettings(settings);
    if (this.useBackend) {
      try {
        await fetch(`${this.baseUrl}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        });
      } catch (e) {
        console.warn('Backend settings update failed:', e);
      }
    }
  }
}

export const api = new ApiService();

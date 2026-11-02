export interface ShopSettings {
  shopName: string;
  tamilShopName: string;
  addressLine1: string;
  addressLine2: string;
  goldPurity: string;
  silverPurity: string;
  footerText: string;
  whatsappNumber: string;
  subtitleText: string;
  goldLabelTamil: string;
  goldLabelEng: string;
  silverLabelTamil: string;
  silverLabelEng: string;
  weightLabel: string;
  datePrefix: string;
  customLogoUrl: string | null;
  tamilFont: 'Noto Sans Tamil' | 'Mukta Malar' | 'Baloo Thambi 2' | 'Anek Tamil';
  posterMode: 'original_match' | 'custom_modular';
  backendApiUrl: string;
  useBackendApi: boolean;
  whatsappCloudApiToken?: string;
  whatsappPhoneNumberId?: string;

  // Adjustable Rate & Date Axis Positions & Sizes on 1080x1920 canvas
  goldRateX: number;
  goldRateY: number;
  goldRateSize: number;
  goldBgPatch?: boolean;
  goldBgWidth?: number;
  goldBgHeight?: number;

  silverRateX: number;
  silverRateY: number;
  silverRateSize: number;
  silverBgPatch?: boolean;
  silverBgWidth?: number;
  silverBgHeight?: number;

  dateX: number;
  dateY: number;
  dateSize: number;
  dateBgPatch?: boolean;
  dateBgWidth?: number;
  dateBgHeight?: number;
}

export interface DailyRate {
  id: string;
  date: string; // DD-MM-YYYY
  goldRate: number; // e.g. 12985
  silverRate: number; // e.g. 190
  timestamp: string; // ISO string
  posterFilename: string;
  previewUrl?: string;
  notes?: string;
}

export interface PosterRenderOptions {
  goldRate: number;
  silverRate: number;
  dateStr: string; // DD-MM-YYYY
  settings: ShopSettings;
}

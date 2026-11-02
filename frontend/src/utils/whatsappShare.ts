import type { ShopSettings } from '../types';
import { formatIndianCurrency } from './dateUtils';
import { getPosterBlob } from './posterRenderer';

export interface ShareResult {
  success: boolean;
  method: 'native_share' | 'whatsapp_web' | 'whatsapp_app' | 'cloud_api';
  message: string;
  filename?: string;
  whatsappUrl?: string;
  whatsappAppUrl?: string;
}

/**
 * Format the standard WhatsApp message body
 */
export function generateWhatsAppMessage(
  goldRate: number,
  silverRate: number,
  dateStr: string,
  settings: ShopSettings
): string {
  const goldPerSovereign = goldRate * 8;
  const silverPerKg = silverRate * 1000;

  return `*${settings.shopName}*
_${settings.tamilShopName}_

✨ *${settings.subtitleText}*

🟡 *${settings.goldLabelTamil} (${settings.goldPurity}):*
• 1 கிராம்: *${formatIndianCurrency(goldRate)}*
• 8 கிராம் (1 பவுன்/சவரன்): *${formatIndianCurrency(goldPerSovereign)}*

⚪ *${settings.silverLabelTamil}:*
• 1 கிராம்: *${formatIndianCurrency(silverRate)}*
• 1 கிலோ: *${formatIndianCurrency(silverPerKg)}*

📅 *${settings.datePrefix}${dateStr}*

📍 *முகவரி / Address:*
${settings.addressLine1}
${settings.addressLine2}

🙏 *${settings.footerText}*`;
}

/**
 * Clean phone number for WhatsApp link
 */
export function sanitizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  // If 10 digits without country code, prepend 91 for India
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

/**
 * Get direct WhatsApp links for web and desktop app
 */
export function getWhatsAppUrls(phone: string, text: string): { webUrl: string; appUrl: string; directUrl: string } {
  const cleanPhone = sanitizePhoneNumber(phone);
  const encoded = encodeURIComponent(text);

  return {
    // Official direct click-to-chat
    directUrl: cleanPhone
      ? `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encoded}&type=phone_number&app_absent=0`
      : `https://api.whatsapp.com/send/?text=${encoded}`,
    // Direct WhatsApp Web chat with recipient
    webUrl: cleanPhone
      ? `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://web.whatsapp.com/send?text=${encoded}`,
    // Direct WhatsApp Desktop protocol
    appUrl: cleanPhone
      ? `whatsapp://send?phone=${cleanPhone}&text=${encoded}`
      : `whatsapp://send?text=${encoded}`,
  };
}

/**
 * Share poster via WhatsApp
 */
export async function sharePosterOnWhatsApp(
  canvas: HTMLCanvasElement,
  goldRate: number,
  silverRate: number,
  dateStr: string,
  settings: ShopSettings
): Promise<ShareResult> {
  const filename = `SRI_CHAIRMAN_JEWELLERS_DAILY_RATE_${dateStr}.png`;
  const messageText = generateWhatsAppMessage(goldRate, silverRate, dateStr, settings);
  const cleanPhone = sanitizePhoneNumber(settings.whatsappNumber);
  const { directUrl, appUrl } = getWhatsAppUrls(settings.whatsappNumber, messageText);

  // 1. Get Blob from Canvas
  const blob = await getPosterBlob(canvas);
  const file = new File([blob], filename, { type: 'image/png' });

  // 2. Check if native Web Share API with files is supported (mobile / tablet)
  const canShareFiles =
    typeof navigator !== 'undefined' &&
    !!navigator.canShare &&
    navigator.canShare({ files: [file] });

  if (canShareFiles) {
    try {
      await navigator.share({
        files: [file],
        title: `${settings.shopName} - Daily Rates`,
        text: messageText,
      });
      return {
        success: true,
        method: 'native_share',
        message: 'Shared successfully with image attached!',
        filename,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          success: false,
          method: 'native_share',
          message: 'Share was cancelled.',
        };
      }
      console.warn('Native share failed, falling back to direct launch:', err);
    }
  }

  // 3. Fallback for Desktop/PC:
  // Automatically copy poster PNG image to clipboard for instant Ctrl+V paste into chat!
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
    }
  } catch (e) {
    console.warn('Clipboard write image not supported or allowed:', e);
  }

  // Trigger download of poster
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);

  // Launch direct WhatsApp chat
  // We prefer directUrl or webUrl
  const targetUrl = directUrl;
  window.open(targetUrl, '_blank', 'noopener,noreferrer');

  return {
    success: true,
    method: 'whatsapp_web',
    message: `Poster downloaded and WhatsApp chat opened for ${cleanPhone ? '+' + cleanPhone : 'recipient'}!`,
    filename,
    whatsappUrl: targetUrl,
    whatsappAppUrl: appUrl,
  };
}

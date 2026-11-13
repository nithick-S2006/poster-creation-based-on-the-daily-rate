import type { ShopSettings } from '../types';
import { getPosterBlob } from './posterRenderer';

export interface ShareResult {
  success: boolean;
  method: 'native_share' | 'whatsapp_web' | 'clipboard_copy';
  message: string;
  filename?: string;
  whatsappUrl?: string;
}

/**
 * Copy poster PNG image directly to system clipboard
 */
export async function copyPosterImageToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await getPosterBlob(canvas);
    if (typeof window !== 'undefined' && navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return true;
    }
  } catch (e) {
    console.warn('Clipboard write failed:', e);
  }
  return false;
}

/**
 * Share poster via WhatsApp without any hardcoded contact and without description text.
 * Allows user to choose any contact or Status.
 */
export async function sharePosterOnWhatsApp(
  canvas: HTMLCanvasElement,
  dateStr: string,
  _settings?: ShopSettings
): Promise<ShareResult> {
  const filename = `SRI_CHAIRMAN_JEWELLERS_DAILY_RATE_${dateStr}.png`;

  // 1. Get Blob and File from Canvas
  const blob = await getPosterBlob(canvas);
  const file = new File([blob], filename, { type: 'image/png' });

  // 2. Check if native Web Share API with files is supported (mobile / tablet / supported desktop)
  const canShareFiles =
    typeof navigator !== 'undefined' &&
    !!navigator.canShare &&
    navigator.canShare({ files: [file] });

  if (canShareFiles) {
    try {
      // Share ONLY the image file with NO description text, letting user pick any WhatsApp contact/status
      await navigator.share({
        files: [file],
      });
      return {
        success: true,
        method: 'native_share',
        message: 'Shared poster image successfully! Selected contact receives the clean image.',
        filename,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          success: false,
          method: 'native_share',
          message: 'Share cancelled.',
        };
      }
      console.warn('Native share failed, falling back to Web/Clipboard:', err);
    }
  }

  // 3. Desktop / Web Fallback:
  // Copy image to clipboard so user can instantly press Ctrl+V into any WhatsApp chat or Status
  let clipboardOk = false;
  try {
    clipboardOk = await copyPosterImageToClipboard(canvas);
  } catch (e) {
    console.warn('Clipboard write not allowed or supported:', e);
  }

  // Also trigger download of the high-res PNG for easy drag-and-drop or attachment
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);

  // Open WhatsApp Web with NO default contact and NO text
  const targetUrl = 'https://web.whatsapp.com/';
  window.open(targetUrl, '_blank', 'noopener,noreferrer');

  return {
    success: true,
    method: 'whatsapp_web',
    message: clipboardOk
      ? 'Poster image copied to clipboard! WhatsApp Web opened — select any contact or status and press Ctrl + V.'
      : 'Poster image downloaded! WhatsApp Web opened — select any contact or status and attach the image.',
    filename,
    whatsappUrl: targetUrl,
  };
}

import type { PosterRenderOptions } from '../types';
import { formatIndianCurrency } from './dateUtils';

// Cache for preloaded images
const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!;
    if (cached.complete) return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (e) => reject(new Error(`Failed to load image at ${src}: ${e}`));
    img.src = src;
  });
}

/**
 * Render the 1080x1920 poster onto a canvas
 */
export async function renderPosterToCanvas(
  canvas: HTMLCanvasElement,
  options: PosterRenderOptions
): Promise<void> {
  const { goldRate, silverRate, dateStr, settings } = options;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  // Set standard poster dimensions
  const WIDTH = 1080;
  const HEIGHT = 1920;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // Decide which base template to use
  const isCustomModular = settings.posterMode === 'custom_modular';
  const baseTemplateSrc = isCustomModular
    ? '/assets/poster_template_custom_1080x1920.png'
    : '/assets/poster_template_clean_1080x1920.png?v=clean_v4';

  try {
    const baseImg = await loadImage(baseTemplateSrc);
    ctx.drawImage(baseImg, 0, 0, WIDTH, HEIGHT);
  } catch (err) {
    console.warn('Could not load clean template, rendering fallback luxury canvas:', err);
    renderLuxuryFallback(ctx, WIDTH, HEIGHT);
  }

  // Draw custom logo if uploaded
  if (settings.customLogoUrl) {
    try {
      const customLogo = await loadImage(settings.customLogoUrl);
      const logoW = 160;
      const logoH = 160;
      const logoX = (WIDTH - logoW) / 2;
      const logoY = 60;
      // Draw background patch to cover original logo
      ctx.fillStyle = '#120e09';
      ctx.beginPath();
      ctx.arc(WIDTH / 2, logoY + logoH / 2, logoW / 2 + 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.drawImage(customLogo, logoX, logoY, logoW, logoH);
    } catch (e) {
      console.error('Failed to load custom logo:', e);
    }
  }

  // In Custom Modular mode, render dynamic Tamil shop name and address
  if (isCustomModular) {
    renderCustomTypography(ctx, WIDTH, settings);
  }

  // 1. DYNAMIC GOLD RATE (Adjustable X, Y & Size)
  const goldX = settings.goldRateX ?? 685;
  const goldY = settings.goldRateY ?? 948;
  if (settings.goldBgPatch) {
    drawAdjustablePatch(ctx, goldX, goldY, settings.goldBgWidth ?? 480, settings.goldBgHeight ?? 110);
  }
  renderGoldRatePrice(ctx, goldX, goldY, goldRate, settings.goldRateSize ?? 104);

  // 2. DYNAMIC SILVER RATE (Adjustable X, Y & Size)
  const silverX = settings.silverRateX ?? 700;
  const silverY = settings.silverRateY ?? 1595;
  if (settings.silverBgPatch) {
    drawAdjustablePatch(ctx, silverX, silverY, settings.silverBgWidth ?? 480, settings.silverBgHeight ?? 110);
  }
  renderSilverRatePrice(ctx, silverX, silverY, silverRate, settings.silverRateSize ?? 104);

  // 3. DYNAMIC DATE (Adjustable X, Y & Size)
  const dateX = settings.dateX ?? 540;
  const dateY = settings.dateY ?? 1790;
  if (settings.dateBgPatch) {
    drawAdjustablePatch(ctx, dateX, dateY, settings.dateBgWidth ?? 380, settings.dateBgHeight ?? 45, 8);
  }
  renderDynamicDate(ctx, dateX, dateY, dateStr, settings);
}

/**
 * Draw adjustable dark background patch if explicitly enabled
 */
function drawAdjustablePatch(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  radius = 14
) {
  ctx.save();
  ctx.fillStyle = '#130e09';
  const left = centerX - width / 2;
  const top = centerY - height / 2;
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(left, top, width, height, radius);
    ctx.fill();
  } else {
    ctx.fillRect(left, top, width, height);
  }
  ctx.restore();
}

/**
 * Render dynamic Gold Rate price inside the gold glitter box
 */
function renderGoldRatePrice(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  rate: number,
  customFontSize = 104
) {
  const text = formatIndianCurrency(rate);
  
  let fontSize = customFontSize;
  if (text.length > 7) fontSize = Math.round(customFontSize * 0.88);
  if (text.length > 9) fontSize = Math.round(customFontSize * 0.75);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${fontSize}px "Outfit", "Noto Sans Tamil", sans-serif`;

  // Draw rich dark 3D drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = '#3a2202';
  ctx.fillText(text, centerX, centerY + 3);

  // Draw warm gold glow
  ctx.shadowColor = 'rgba(255, 215, 0, 0.45)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Create metallic gold vertical gradient
  const grad = ctx.createLinearGradient(0, centerY - fontSize * 0.45, 0, centerY + fontSize * 0.45);
  grad.addColorStop(0.0, '#FFFFFF');
  grad.addColorStop(0.2, '#FFF5BA');
  grad.addColorStop(0.45, '#FBD267');
  grad.addColorStop(0.75, '#D59A26');
  grad.addColorStop(1.0, '#91630A');

  ctx.fillStyle = grad;
  ctx.fillText(text, centerX, centerY);

  // Subtle metallic bevel stroke
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.strokeText(text, centerX, centerY);

  ctx.restore();
}

/**
 * Render dynamic Silver Rate price inside the silver glitter box
 */
function renderSilverRatePrice(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  rate: number,
  customFontSize = 104
) {
  const text = formatIndianCurrency(rate);

  let fontSize = customFontSize;
  if (text.length > 7) fontSize = Math.round(customFontSize * 0.88);
  if (text.length > 9) fontSize = Math.round(customFontSize * 0.75);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${fontSize}px "Outfit", "Noto Sans Tamil", sans-serif`;

  // Draw rich dark 3D drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = '#1c2229';
  ctx.fillText(text, centerX, centerY + 3);

  // Draw cool silver glow
  ctx.shadowColor = 'rgba(220, 235, 255, 0.5)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Create metallic silver vertical gradient
  const grad = ctx.createLinearGradient(0, centerY - fontSize * 0.45, 0, centerY + fontSize * 0.45);
  grad.addColorStop(0.0, '#FFFFFF');
  grad.addColorStop(0.25, '#F4F6F8');
  grad.addColorStop(0.5, '#CFD6DE');
  grad.addColorStop(0.8, '#8D99A6');
  grad.addColorStop(1.0, '#515B66');

  ctx.fillStyle = grad;
  ctx.fillText(text, centerX, centerY);

  // Subtle bevel stroke
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.strokeText(text, centerX, centerY);

  ctx.restore();
}

/**
 * Render dynamic Date
 */
function renderDynamicDate(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  dateStr: string,
  settings: PosterRenderOptions['settings']
) {
  const text = `${settings.datePrefix || 'தேதி: '}${dateStr}`;
  const fontSize = settings.dateSize || 38;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${fontSize}px "${settings.tamilFont}", sans-serif`;

  // Subtle drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  // Rich cream/gold-tinted white
  ctx.fillStyle = '#FFF8E7';
  ctx.fillText(text, centerX, centerY);

  ctx.restore();
}

/**
 * Render custom Tamil shop name and address for modular mode
 */
function renderCustomTypography(
  ctx: CanvasRenderingContext2D,
  WIDTH: number,
  settings: PosterRenderOptions['settings']
) {
  ctx.save();
  ctx.textAlign = 'center';

  // 1. Tamil Shop Name (Top embossed)
  ctx.font = `800 68px "${settings.tamilFont}", sans-serif`;
  ctx.shadowColor = '#593e09';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  const grad = ctx.createLinearGradient(0, 240, 0, 360);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.3, '#FFE699');
  grad.addColorStop(0.7, '#DCA334');
  grad.addColorStop(1, '#8B5B0B');
  ctx.fillStyle = grad;
  ctx.fillText(settings.tamilShopName, WIDTH / 2, 330);

  // 2. English Shop Name subtitle
  ctx.font = '700 28px "Cinzel", serif';
  ctx.fillStyle = '#E8C97A';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;
  ctx.fillText(settings.shopName, WIDTH / 2, 400);

  // 3. Address Lines
  ctx.font = '700 32px "Outfit", sans-serif';
  ctx.fillStyle = '#F4D489';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.fillText(settings.addressLine1, WIDTH / 2, 1665);
  ctx.fillText(settings.addressLine2, WIDTH / 2, 1712);

  ctx.restore();
}

/**
 * Luxury fallback background if image assets are still loading
 */
function renderLuxuryFallback(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const bgGrad = ctx.createRadialGradient(
    width / 2, height / 2, 100,
    width / 2, height / 2, width
  );
  bgGrad.addColorStop(0, '#1c1710');
  bgGrad.addColorStop(0.7, '#0e0b08');
  bgGrad.addColorStop(1, '#050403');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#c59a37';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = '#e8c97a';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, width - 90, height - 90);
}

/**
 * Generate high-quality PNG Blob from Canvas
 */
export function getPosterBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create poster image Blob'));
    }, 'image/png', 1.0);
  });
}

/**
 * Trigger immediate download of poster image
 */
export async function downloadPosterImage(
  canvas: HTMLCanvasElement,
  dateStr: string
): Promise<string> {
  const blob = await getPosterBlob(canvas);
  const filename = `SRI_CHAIRMAN_JEWELLERS_DAILY_RATE_${dateStr}.png`;
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return filename;
}

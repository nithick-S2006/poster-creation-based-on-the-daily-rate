/**
 * Date utility for Asia/Kolkata timezone with DD-MM-YYYY format
 */

export function getTodayKolkataDate(): string {
  // Use Intl.DateTimeFormat with Asia/Kolkata timezone
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const parts = formatter.formatToParts(new Date());
  const day = parts.find(p => p.type === 'day')?.value || '01';
  const month = parts.find(p => p.type === 'month')?.value || '01';
  const year = parts.find(p => p.type === 'year')?.value || '2026';
  
  return `${day}-${month}-${year}`;
}

export function getTodayKolkataTime(): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(new Date());
}

/**
 * Converts YYYY-MM-DD (from input type="date") to DD-MM-YYYY
 */
export function convertIsoToIndianDate(isoDate: string): string {
  if (!isoDate) return getTodayKolkataDate();
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return isoDate;
}

/**
 * Converts DD-MM-YYYY to YYYY-MM-DD (for input type="date")
 */
export function convertIndianDateToIso(indianDate: string): string {
  if (!indianDate) return new Date().toISOString().split('T')[0];
  const parts = indianDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return indianDate;
}

/**
 * Format Indian Currency: e.g. 12985 -> ₹12,985
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(amount);
  return `₹${formatted}`;
}

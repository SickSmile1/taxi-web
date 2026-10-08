export interface PriceBreakdown {
  base: number;
  rateTier1: number;
  rateTier2: number;
  kmTier1: number;
  kmTier2: number;
  kmCostTier1: number;
  kmCostTier2: number;
  kmCost: number;
  perKm: number;
  surcharge: number;
  total: number;
  isNightRate: boolean;
  waitingPerHour: number;
  largeVanSurcharge: number;
  totalLargeVan: number;
}

export const TARIFF_RATES = {
  day: {
    base: 5.0,
    tier1: 3.5, // bis 3 km: 3,50 € / km
    tier2: 2.5, // ab 3 km: 2,50 € / km
  },
  night: {
    base: 6.5, // 22:00–06:00 & Sonn-/Feiertage
    tier1: 4.0, // bis 3 km: 4,00 € / km
    tier2: 3.0, // ab 3 km: 3,00 € / km
  },
  tierThresholdKm: 3.0,
  waitingPerHour: 50.0,
  largeVanSurcharge: 10.0,
};

export function isNight(date: Date = new Date()): boolean {
  const h = date.getHours();
  return h >= 22 || h < 6;
}

export function isSundayOrHoliday(date: Date = new Date()): boolean {
  const d = date.getDay();
  return d === 0;
}

export function calculatePrice(
  distanceKm: number,
  options?: { date?: Date; isNight?: boolean; isSunday?: boolean },
): PriceBreakdown {
  const d = options?.date ?? new Date();
  const night =
    options?.isNight !== undefined
      ? options.isNight
      : options?.isSunday !== undefined
        ? options.isSunday
        : isNight(d) || isSundayOrHoliday(d);

  const rates = night ? TARIFF_RATES.night : TARIFF_RATES.day;
  const dist = Math.max(0, distanceKm);

  const kmTier1 = Math.min(dist, TARIFF_RATES.tierThresholdKm);
  const kmTier2 = Math.max(0, dist - TARIFF_RATES.tierThresholdKm);

  const kmCostTier1 = kmTier1 * rates.tier1;
  const kmCostTier2 = kmTier2 * rates.tier2;
  const kmCost = kmCostTier1 + kmCostTier2;
  const total = rates.base + kmCost;

  const baseSurcharge = night
    ? TARIFF_RATES.night.base - TARIFF_RATES.day.base
    : 0;
  const kmSurcharge = night
    ? kmTier1 * (TARIFF_RATES.night.tier1 - TARIFF_RATES.day.tier1) +
      kmTier2 * (TARIFF_RATES.night.tier2 - TARIFF_RATES.day.tier2)
    : 0;

  return {
    base: rates.base,
    rateTier1: rates.tier1,
    rateTier2: rates.tier2,
    kmTier1: Math.round(kmTier1 * 100) / 100,
    kmTier2: Math.round(kmTier2 * 100) / 100,
    kmCostTier1: Math.round(kmCostTier1 * 100) / 100,
    kmCostTier2: Math.round(kmCostTier2 * 100) / 100,
    kmCost: Math.round(kmCost * 100) / 100,
    perKm: dist > 0 ? Math.round((kmCost / dist) * 100) / 100 : rates.tier1,
    surcharge: Math.round((baseSurcharge + kmSurcharge) * 100) / 100,
    total: Math.round(total * 100) / 100,
    isNightRate: night,
    waitingPerHour: TARIFF_RATES.waitingPerHour,
    largeVanSurcharge: TARIFF_RATES.largeVanSurcharge,
    totalLargeVan:
      Math.round((total + TARIFF_RATES.largeVanSurcharge) * 100) / 100,
  };
}

export function formatPrice(euros: number): string {
  return euros.toFixed(2).replace('.', ',') + ' €';
}

export function getTariffLabel(date?: Date): string {
  const d = date ?? new Date();
  if (isNight(d)) return 'Nachttarif (22:00–06:00)';
  if (isSundayOrHoliday(d)) return 'Sonn- & Feiertagstarif';
  return 'Tagestarif (06:00–22:00)';
}

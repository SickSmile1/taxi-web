import prices from './prices.json';

interface PriceEntry {
  std: string;
  large: string;
}

export function getPrices(slug: string): PriceEntry | undefined {
  return (prices as Record<string, PriceEntry>)[slug];
}

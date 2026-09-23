/** Propuesta comercial del piloto; esta demo no factura ni llama APIs. */
export const PLAN = {
  name: 'Esencial',
  monthlyArs: 69000,
  setupArs: 49000,
  searches: 30,
  maxBusinesses: 20,
  extraSearches: 10,
  extraArs: 19000,
} as const;

export const ars = (value: number) =>
  '$' + new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value);

export function monthKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(date);
  return `${parts.find((p) => p.type === 'year')?.value}-${parts.find((p) => p.type === 'month')?.value}`;
}

import { PLAN } from './plan';
export type SearchSpec = { industry: string; place: string; count: number };
export type Lead = {
  id: string;
  name: string;
  industry: string;
  place: string;
  score: number;
  reason: string;
  signal: string;
  web: string;
  social: string;
  offer: string;
};
export function validSearch(s: SearchSpec): boolean {
  return (
    typeof s.industry === 'string' &&
    s.industry.trim().length > 0 &&
    s.industry.length <= 80 &&
    typeof s.place === 'string' &&
    s.place.trim().length > 0 &&
    s.place.length <= 100 &&
    Number.isInteger(s.count) &&
    s.count >= 1 &&
    s.count <= PLAN.maxBusinesses
  );
}
export function weekKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  const d = new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
export function createLeads(spec: SearchSpec, runId: string): Lead[] {
  const labels = [
    'Horizonte',
    'Distrito',
    'Punto Norte',
    'Origen',
    'Vértice',
    'Nexo',
    'Central',
    'Panorama',
    'Umbral',
    'Alameda',
  ];
  const patterns = [
    {
      reason:
        'Actividad en redes, pero sin un sitio propio donde ordenar sus servicios.',
      signal: 'Oportunidad de sitio web',
      web: 'Ejemplo: sin sitio propio identificado.',
      social: 'Ejemplo: publicaciones recientes. Seguidores sin verificar.',
      offer: 'Una web que presente sus servicios y facilite las consultas.',
    },
    {
      reason:
        'Tiene una web, pero consultar desde el celular podría ser más sencillo.',
      signal: 'Oportunidad de rediseño',
      web: 'Ejemplo: navegación móvil con margen de mejora.',
      social: 'Ejemplo: perfil comercial activo. Datos sin verificar.',
      offer:
        'Un rediseño pensado para celular y un recorrido de consulta más claro.',
    },
    {
      reason:
        'Su oferta está repartida entre publicaciones y mensajes de redes.',
      signal: 'Oportunidad de catálogo',
      web: 'Ejemplo: catálogo desactualizado o incompleto.',
      social: 'Ejemplo: productos o servicios publicados por separado.',
      offer:
        'Un catálogo web que reúna su oferta y facilite encontrar lo que vende.',
    },
  ];
  return Array.from({ length: spec.count }, (_, i) => ({
    id: `${runId}-${i}`,
    name: `${labels[i % labels.length]}${i >= labels.length ? ' ' + (Math.floor(i / labels.length) + 1) : ''}`,
    industry: spec.industry.trim(),
    place: spec.place.trim(),
    score: Math.max(62, 94 - i * 2),
    ...patterns[i % patterns.length],
  }));
}

import type { Lead, SearchSpec } from './prospecto';
export type View = 'home' | 'agent' | 'leads' | 'history' | 'agency' | 'plan';
export type Profile = {
  name: string;
  owner: string;
  service: string;
  area: string;
  ideal: string;
  agentName: string;
};
export type Run = SearchSpec & { id: string; date: string; leads: Lead[] };
export const KEY = 'prospecto-prototype-v1';
export const initialProfile: Profile = {
  agentName: '',
  name: 'Tu agencia',
  owner: 'equipo',
  service: 'Diseño y desarrollo de páginas web',
  area: 'Córdoba, Argentina',
  ideal: 'Negocios con una presencia digital que puedan mejorar con una web.',
};
export const initialSpec: SearchSpec = {
  industry: 'Inmobiliarias',
  place: 'Córdoba, Argentina',
  count: 10,
};

import type { Profile, View } from '@/lib/demo-model';
import { ars, availableSearches } from '@/lib/plan';
import {
  Building2,
  ChevronRight,
  History,
  House,
  SlidersHorizontal,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react';
import { BrandLogo } from './shared';
export const nav = [
  { id: 'home', label: 'Tu espacio', icon: House },
  { id: 'agent', label: 'Mi agente', icon: Sparkles },
  { id: 'leads', label: 'Mis leads', icon: Target },
  { id: 'history', label: 'Mis búsquedas', icon: History },
  { id: 'agency', label: 'Mi agencia', icon: Building2 },
  { id: 'plan', label: 'Mi saldo', icon: Wallet },
] as const;

export function Nav({
  view,
  go,
  profile,
  balance,
  includedRemaining,
  saved,
}: {
  view: View;
  go: (v: View) => void;
  profile: Profile;
  balance: number;
  includedRemaining: number;
  saved: number;
}) {
  const navigate = go;
  return (
    <aside className="app-sidebar" aria-label="Navegación de escritorio">
      <header className="side-head">
        <div className="brand">
          <span className="brand-symbol">
            <BrandLogo />
          </span>
          <span className="brand-wordmark">
            MI NEGOCIO
            <br />
            WEB<span>.</span>
          </span>
        </div>
        <span className="brand-caption">AGENTE DE CLIENTES</span>
      </header>
      <div className="side-content">
        <button className="workspace" onClick={() => navigate('home')}>
          <span className="agency-monogram">
            {profile.name.slice(0, 1).toUpperCase()}
          </span>
          <span>
            <strong>{profile.name}</strong>
            <small>Tu espacio de trabajo</small>
          </span>
          <ChevronRight size={15} />
        </button>
        <p className="nav-caption">TU ESPACIO</p>
        <nav>
          {nav.map((item) => (
            <div key={item.id}>
              <button
                aria-current={view === item.id ? 'page' : undefined}
                onClick={() => navigate(item.id)}
                className="nav-item"
              >
                <item.icon size={19} />
                <span>
                  {item.id === 'agent'
                    ? profile.agentName || 'Mi agente'
                    : item.label}
                </span>

                {item.id === 'leads' && saved > 0 && (
                  <span className="nav-count">{saved}</span>
                )}
              </button>
            </div>
          ))}
        </nav>
      </div>
      <footer className="side-footer">
        <button className="quota-card" onClick={() => navigate('plan')}>
          <span>
            Mi saldo de prueba <ChevronRight size={14} />
          </span>
          <strong>
            {ars(balance)}{' '}
            <small>
              {availableSearches(balance, includedRemaining)} búsquedas
              disponibles
            </small>
          </strong>
        </button>
        <button className="user-menu" onClick={() => navigate('agency')}>
          <span className="avatar">
            {profile.owner.slice(0, 1).toUpperCase()}
          </span>
          <span>
            <strong>{profile.owner}</strong>
            <small>Editar mi agencia</small>
          </span>
          <SlidersHorizontal size={16} />
        </button>
      </footer>
    </aside>
  );
}

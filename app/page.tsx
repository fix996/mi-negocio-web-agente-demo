import { AgencyIntro } from '@/components/agency-intro';
import { LeadDialog } from '@/components/lead-dialog';
import { Nav, nav } from '@/components/navigation';
import { BrandLogo } from '@/components/shared';
import { AgencyView } from '@/components/views/agency';
import { SearchView } from '@/components/views/agent';
import { HistoryView } from '@/components/views/history';
import { LeadsView } from '@/components/views/leads';
import { BalanceView } from '@/components/views/plan';
import { useDemo } from '@/hooks/use-demo';
import { ChevronRight, CircleHelp, X } from 'lucide-react';

export default function Home() {
  const demo = useDemo();
  const {
    view,
    setView,
    profile,
    saved,
    wallet,
    selected,
    setSelected,
    notice,
    setNotice,
  } = demo;
  return (
    <div className="app-layout">
      <Nav
        view={view}
        go={setView}
        profile={profile}
        balance={wallet.balance}
        includedRemaining={wallet.includedRemaining}
        saved={saved.length}
      />
      <main className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="mobile-brand">
              <BrandLogo />
            </span>
            <span>Mi espacio</span>
            <ChevronRight size={14} />
            <strong>{nav.find((n) => n.id === view)?.label}</strong>
          </div>
          <div className="top-right">
            <span className="demo-tag">
              <span /> Demo interactiva
            </span>
            <button
              className="round-button"
              aria-label="Cómo funciona la demo"
              onClick={() =>
                setNotice(
                  'Esta demo simula el agente y los negocios. No hace búsquedas reales, no cobra y guarda tus cambios solo en este navegador.',
                )
              }
            >
              <CircleHelp size={19} />
            </button>
            <button
              className="avatar top-avatar"
              aria-label="Editar mi agencia"
              onClick={() => setView('agency')}
            >
              {profile.owner.slice(0, 1).toUpperCase()}
            </button>
          </div>
        </header>
        <div className="page-content">
          {view === 'home' && (
            <AgencyIntro
              onSearch={() => setView('agent')}
              onProfile={() => setView('agency')}
              onBalance={() => setView('plan')}
            />
          )}
          {view === 'agent' && <SearchView {...demo} />}
          {view === 'leads' && <LeadsView {...demo} />}
          {view === 'history' && <HistoryView {...demo} />}
          {view === 'agency' && <AgencyView {...demo} />}
          {view === 'plan' && <BalanceView {...demo} />}
        </div>
        <footer className="page-footer">
          <span>MI NEGOCIO WEB</span>
          <span>Agente de clientes · Prototipo</span>
        </footer>
      </main>
      <nav className="mobile-dock" aria-label="Navegación principal móvil">
        {nav.map((item) => (
          <button
            key={item.id}
            aria-current={view === item.id ? 'page' : undefined}
            onClick={() => setView(item.id)}
          >
            <item.icon size={19} />
            <span>
              {
                {
                  home: 'Inicio',
                  agent: 'Buscar',
                  leads: 'Leads',
                  history: 'Historial',
                  agency: 'Agencia',
                  plan: 'Saldo',
                }[item.id]
              }
            </span>
          </button>
        ))}
      </nav>
      {selected && (
        <LeadDialog
          lead={selected}
          onClose={() => setSelected(null)}
          saved={saved}
          toggleSave={demo.toggleSave}
        />
      )}
      {notice && (
        <output className="toast">
          <CircleHelp size={18} />
          <span>{notice}</span>
          <button aria-label="Cerrar aviso" onClick={() => setNotice('')}>
            <X size={17} />
          </button>
        </output>
      )}
    </div>
  );
}

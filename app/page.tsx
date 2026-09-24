'use client';
import {
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
  type CSSProperties,
} from 'react';
import {
  ArrowRight,
  Bookmark,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Mail,
  Copy,
  Wallet,
  Globe,
  History,
  House,
  Camera,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  Radar,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  createLeads,
  demoContact,
  validSearch,
  type Lead,
  type SearchSpec,
} from '@/lib/prospecto';

import { PLAN, ars, availableSearches, validTopUp, spendSearch, type WalletState } from '@/lib/plan';
import { AgencyIntro } from '@/components/agency-intro';

type View = 'home' | 'agent' | 'leads' | 'history' | 'agency' | 'plan';
type Profile = {
  name: string;
  owner: string;
  service: string;
  area: string;
  ideal: string;
  agentName: string;
};
type Run = SearchSpec & { id: string; date: string; leads: Lead[] };
const KEY = 'prospecto-prototype-v1';
const initialProfile: Profile = {
  agentName: '',
  name: 'Tu agencia',
  owner: 'equipo',
  service: 'Diseño y desarrollo de páginas web',
  area: 'Córdoba, Argentina',
  ideal: 'Negocios con una presencia digital que puedan mejorar con una web.',
};
const initialSpec: SearchSpec = {
  industry: 'Inmobiliarias',
  place: 'Córdoba, Argentina',
  count: 10,
};
const nav = [
  { id: 'home', label: 'Tu espacio', icon: House },
  { id: 'agent', label: 'Mi agente', icon: Sparkles },
  { id: 'leads', label: 'Mis leads', icon: Target },
  { id: 'history', label: 'Mis búsquedas', icon: History },
  { id: 'agency', label: 'Mi agencia', icon: Building2 },
  { id: 'plan', label: 'Mi saldo', icon: Wallet },
] as const;

function Nav({
  view,
  go,
  profile,
  balance,
  saved,
  showAccess,
}: {
  view: View;
  go: (v: View) => void;
  profile: Profile;
  balance: number;
  saved: number;
  showAccess: () => void;
}) {
  const { setOpenMobile } = useSidebar();
  const navigate = (v: View) => {
    go(v);
    setOpenMobile(false);
  };
  return (
    <Sidebar className="app-sidebar">
      <SidebarHeader className="side-head">
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
      </SidebarHeader>
      <SidebarContent className="side-content">
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
        <SidebarMenu>
          {nav.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={view === item.id}
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
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="side-footer">
        <button className="quota-card" onClick={() => navigate('plan')}>
          <span>
            Mi saldo de prueba <ChevronRight size={14} />
          </span>
          <strong>
            {ars(balance)} <small>{availableSearches(balance)} búsquedas disponibles</small>
          </strong>
        </button>
        <button className="user-menu" onClick={showAccess}>
          <span className="avatar">
            {profile.owner.slice(0, 1).toUpperCase()}
          </span>
          <span>
            <strong>{profile.owner}</strong>
            <small>Ver pantalla de acceso</small>
          </span>
          <LockKeyhole size={16} />
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function Home() {
  const [view, setView] = useState<View>('home');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [spec, setSpec] = useState(initialSpec);
  const [input, setInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [runs, setRuns] = useState<Run[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [wallet, setWallet] = useState<WalletState>({ balance: PLAN.demoBalance, spent: 0 });
  const [topUpInput, setTopUpInput] = useState('30000');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [activeRun, setActiveRun] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const [access, setAccess] = useState(false);
  const runLock = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const remaining = availableSearches(wallet.balance);
  const topUpAmount = Number(topUpInput);
  const allLeads = runs.flatMap((r) => r.leads);
  const currentRun = runs.find((r) => r.id === activeRun) ?? runs[0];
  const shown = currentRun?.leads ?? [];
  const visibleLeads = allLeads.filter(
    (l) => filter === 'all' || saved.includes(l.id),
  );
  /* oxlint-disable react/react-compiler -- Hydrate browser-only demo state and report browser-storage errors. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (
          d.profile &&
          ['name', 'owner', 'service', 'area', 'ideal'].every(
            (k) => typeof d.profile[k] === 'string',
          )
        ) {
          const restored = {
            ...d.profile,
            agentName:
              typeof d.profile.agentName === 'string'
                ? d.profile.agentName.slice(0, 30)
                : '',
          };
          setProfile(restored);
          setDraft(restored);
        }
        if (Array.isArray(d.runs))
          setRuns(
            d.runs
              .filter(
                (r: Run) =>
                  r &&
                  validSearch(r) &&
                  typeof r.id === 'string' &&
                  !Number.isNaN(Date.parse(r.date)) &&
                  Array.isArray(r.leads) &&
                  r.leads.every(
                    (l) =>
                      l &&
                      typeof l.id === 'string' &&
                      typeof l.name === 'string' &&
                      typeof l.reason === 'string',
                  ),
              )
              .slice(0, 30),
          );
        if (Array.isArray(d.saved))
          setSaved(d.saved.filter((s: unknown) => typeof s === 'string'));
        // Only a validated prepaid wallet is restored; old monthly quotas do not become money.
        if (d.wallet && Number.isSafeInteger(d.wallet.balance) && d.wallet.balance >= 0 && d.wallet.balance <= PLAN.maxBalance && Number.isSafeInteger(d.wallet.spent) && d.wallet.spent >= 0) {
          setWallet(d.wallet);
        }
      }
    } catch {
      /* Demo remains usable without storage. */
    }
    setReady(true);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ profile, runs, saved, wallet }),
      );
    } catch {
      setNotice(
        'No se pudo guardar en este navegador. Podés seguir probando durante esta sesión.',
      );
    }
  }, [profile, runs, saved, wallet, ready]);
  /* oxlint-enable react/react-compiler */
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 5500);
    return () => clearTimeout(t);
  }, [notice]);
  const toggleSave = (id: string) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  function search(request: SearchSpec = spec) {
    if (runLock.current || !ready) return;
    if (!validSearch(request)) {
      setNotice(
        `Elegí un rubro, escribí una zona y pedí entre 1 y ${PLAN.maxBusinesses} negocios.`,
      );
      return;
    }
    if (remaining < 1) {
      setNotice('No alcanza tu saldo. Entrá a Mi saldo para simular una recarga.');
      return;
    }
    runLock.current = true;
    setBusy(true);
    setShowResults(true);
    setStage(0);
    setView('agent');
    const snapshot = { ...request };
    let step = 0;
    timer.current = setInterval(() => {
      step++;
      setStage(step);
      if (step >= 3) {
        if (timer.current) clearInterval(timer.current);
        const id = crypto.randomUUID();
        const run = {
          ...snapshot,
          id,
          date: new Date().toISOString(),
          leads: createLeads(snapshot, id),
        };
        setRuns((r) => [run, ...r].slice(0, 30));
        setActiveRun(id);
        setWallet((current) => spendSearch(current));
        setNotice('Búsqueda de ejemplo completada. Se descontaron ' + ars(PLAN.searchArs) + ' del saldo de prueba.');
        setBusy(false);
        runLock.current = false;
      }
    }, 750);
  }
  function saveProfile(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const clean = Object.fromEntries(
      Object.entries(draft).map(([k, v]) => [k, v.trim()]),
    ) as Profile;
    if (!clean.name || !clean.owner || !clean.service || !clean.area) {
      setNotice('Completá los campos de tu agencia.');
      return;
    }
    setProfile(clean);
    setDraft(clean);
    setSpec((s) => ({ ...s, place: clean.area }));
    setNotice('Perfil guardado en este navegador.');
    setView('agent');
  }
  function topUp(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready || busy || !validTopUp(topUpAmount, wallet.balance)) {
      setNotice('Ingresá un importe entero desde ' + ars(PLAN.minTopUp) + ', sin superar ' + ars(PLAN.maxBalance) + ' de saldo de prueba.');
      return;
    }
    setWallet((current) => ({ ...current, balance: current.balance + topUpAmount }));
    setNotice('Sumaste ' + ars(topUpAmount) + ' ficticios. No se realizó ningún pago.');
  }
  async function copyContact(lead: Lead) {
    try {
      await navigator.clipboard.writeText(demoContact(lead));
      setNotice('Correo de ejemplo copiado. No pertenece a un negocio real.');
    } catch {
      setNotice('No se pudo copiar. Podés seleccionar el correo en la ficha.');
    }
  }

  if (access)
    return (
      <main className="access-page">
        <div className="access-story">
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
          <div>
            <span className="eyebrow light">TU PRÓXIMA OPORTUNIDAD</span>
            <h1>
              Más tiempo creando.
              <br />
              Mejores negocios
              <br />
              por conocer.
            </h1>
            <p>Un agente de búsqueda pensado para tu agencia web.</p>
          </div>
          <span className="access-foot">
            Una idea que estamos construyendo juntos.
          </span>
        </div>
        <div className="access-form">
          <div className="access-box">
            <span className="small-pill blue">PROTOTIPO INTERACTIVO</span>
            <h2>Tu espacio te espera.</h2>
            <p>Así podría ser el acceso de cada agencia.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAccess(false);
              }}
            >
              <label>
                Usuario de ejemplo
                <input value="agencia.demo" readOnly autoComplete="off" />
              </label>
              <label>
                Contraseña de ejemplo
                <input
                  type="password"
                  value="demostracion"
                  readOnly
                  autoComplete="off"
                />
              </label>
              <button className="primary full">
                Entrar a la demo <ArrowRight size={18} />
              </button>
            </form>
            <p className="access-disclaimer">
              <LockKeyhole size={16} />
              Esta pantalla no autentica usuarios. No ingreses contraseñas
              reales. Las cuentas propias se conectarán después.
            </p>
            <button className="text-btn" onClick={() => setAccess(false)}>
              Volver al dashboard
            </button>
          </div>
        </div>
      </main>
    );
  return (
    <SidebarProvider style={{ '--sidebar-width': '246px' } as CSSProperties}>
      <Nav
        view={view}
        go={setView}
        profile={profile}
        balance={wallet.balance}
        saved={saved.length}
        showAccess={() => setAccess(true)}
      />
      <main className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <SidebarTrigger className="mobile-menu" />
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
            <span className="avatar top-avatar">
              {profile.owner.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        <div className="page-content">
          {view === 'home' && (
            <AgencyIntro onSearch={() => setView('agent')} onProfile={() => setView('agency')} onBalance={() => setView('plan')} />
          )}
          {view === 'agent' && (
            <div className="agent-home">
              <section
                className="search-home"
                aria-label="Buscador de clientes"
              >
                <div className="personal-mark">
                  <BrandLogo />
                </div>
                <button
                  className="agent-name-button"
                  onClick={() => setView('agency')}
                >
                  {profile.agentName || 'Poné nombre a tu agente'}{' '}
                  <SlidersHorizontal size={13} />
                </button>
                <h1>Hola, {profile.owner}.</h1>
                <p className="search-intro">¿A quién buscamos hoy?</p>
                <div className="search-surface">
                  <form
                    className="natural-search"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!input.trim()) {
                        search();
                        return;
                      }
                      const match = input
                        .trim()
                        .match(
                          /^(?:(?:busc[aá]|buscar|encontr[aá]|quiero)\s+)?(?:(\d+)\s+)?(.+?)\s+en\s+(.+?)[.!?]?$/i,
                        );
                      if (!match) {
                        setNotice(
                          'Probá con “10 inmobiliarias en Córdoba” o ajustá los campos de abajo.',
                        );
                        return;
                      }
                      const next = {
                        industry: match[2].trim(),
                        place: match[3].trim(),
                        count: match[1] ? Number(match[1]) : spec.count,
                      };
                      setSpec(next);
                      search(next);
                    }}
                  >
                    <label className="sr-only" htmlFor="lead-query">
                      Qué negocios querés encontrar
                    </label>
                    <textarea
                      id="lead-query"
                      rows={2}
                      value={input}
                      maxLength={300}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Encontrá 10 inmobiliarias en Córdoba…"
                      disabled={busy}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          e.currentTarget.form?.requestSubmit();
                        }
                      }}
                    />
                    <div className="search-action-row">
                      <span>
                        <Search size={15} /> Una búsqueda, a tu medida
                      </span>
                      <button
                        className="primary"
                        disabled={busy || remaining < 1 || !ready}
                      >
                        {busy ? (
                          <LoaderCircle className="spin" size={17} />
                        ) : (
                          <ArrowRight size={18} />
                        )}{' '}
                        {busy
                          ? 'Buscando…'
                          : remaining < 1
                            ? 'Recargá tu saldo'
                            : 'Buscar'}
                      </button>
                    </div>
                  </form>
                  <details className="search-options">
                    <summary>
                      <SlidersHorizontal size={14} /> Ajustar búsqueda
                      <span>
                        {spec.count} negocios · {spec.place}
                      </span>
                    </summary>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setInput('');
                        search();
                      }}
                    >
                      <div className="search-fields">
                        <label>
                          Tipo de negocio
                          <input
                            value={spec.industry}
                            onChange={(e) =>
                              setSpec({ ...spec, industry: e.target.value })
                            }
                            maxLength={80}
                            required
                            disabled={busy}
                          />
                        </label>
                        <label>
                          Ubicación
                          <input
                            value={spec.place}
                            onChange={(e) =>
                              setSpec({ ...spec, place: e.target.value })
                            }
                            maxLength={100}
                            required
                            disabled={busy}
                          />
                        </label>
                        <label>
                          Cantidad
                          <input
                            type="number"
                            min={1}
                            max={PLAN.maxBusinesses}
                            value={spec.count}
                            onChange={(e) =>
                              setSpec({
                                ...spec,
                                count: Number(e.target.value),
                              })
                            }
                            required
                            disabled={busy}
                          />
                        </label>
                      </div>
                      <p className="quantity-advice"><strong>{PLAN.recommendedBusinesses} recomendados</strong> · Máximo {PLAN.maxBusinesses} negocios. Pedir más puede incluir coincidencias menos ajustadas.</p>
                      <button
                        className="secondary"
                        disabled={busy || remaining < 1 || !ready}
                      >
                        Buscar con estos datos <ArrowRight size={15} />
                      </button>
                    </form>
                  </details>
                </div>
                <div className="search-context">
                  <span>
                    <Building2 size={13} />
                    {profile.name}
                  </span>
                  <button className="balance-inline" onClick={() => setView('plan')}>{ars(PLAN.searchArs)} por búsqueda · Saldo: {ars(wallet.balance)}</button>
                </div>
                {remaining < 1 && !busy && <button className="text-btn refill-link" onClick={() => setView('plan')}>Recargar saldo de prueba <ArrowRight size={14} /></button>}
                {busy && (
                  <output className="search-progress">
                    <LoaderCircle className="spin" size={16} />
                    {
                      [
                        'Preparando tu búsqueda de ejemplo…',
                        'Revisando negocios de ejemplo…',
                        'Ordenando tus resultados…',
                      ][Math.min(stage, 2)]
                    }
                  </output>
                )}
                {!busy && showResults && currentRun && (
                  <section
                    className="search-results"
                    aria-label="Resultados de ejemplo"
                  >
                    <div className="results-heading">
                      <h2>{currentRun.count} oportunidades</h2>
                      <span>Negocios ficticios</span>
                    </div>
                    <p>
                      {currentRun.industry} · {currentRun.place}
                    </p>
                    <div className="result-rows">
                      {shown.slice(0, 3).map((lead) => (
                        <button
                          className="result-row"
                          key={lead.id}
                          onClick={() => setSelected(lead)}
                        >
                          <span className="business-icon">
                            <Building2 size={18} />
                          </span>
                          <span>
                            <strong>{lead.name}</strong>
                            <small>{lead.signal} · Ver contacto</small>
                          </span>
                          <span className="score">{lead.score}/100</span>
                          <ChevronRight size={17} />
                        </button>
                      ))}
                    </div>
                    <button
                      className="text-btn"
                      onClick={() => {
                        setFilter('all');
                        setView('leads');
                      }}
                    >
                      Ver todos mis leads <ArrowRight size={14} />
                    </button>
                  </section>
                )}
                <p className="prototype-note">
                  Vista de prueba · todavía no se realizan búsquedas reales.
                </p>
              </section>
            </div>
          )}
          {view === 'leads' && (
            <>
              <PageHeading
                eyebrow="TUS OPORTUNIDADES"
                title="Mis leads"
                description="Revisá cada oportunidad y guardá las que te interesen."
              />
              <div className="section-toolbar">
                <Select
                  value={filter}
                  onValueChange={(v) => setFilter(v ?? 'all')}
                >
                  <SelectTrigger
                    className="filter-select"
                    aria-label="Filtrar leads"
                  >
                    <SelectValue>
                      {filter === 'all' ? 'Todos los leads' : 'Guardados'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los leads</SelectItem>
                    <SelectItem value="saved">Guardados</SelectItem>
                  </SelectContent>
                </Select>
                <span>{visibleLeads.length} negocios de ejemplo</span>
              </div>
              {visibleLeads.length ? (
                <div className="table-panel">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Negocio ficticio</TableHead>
                        <TableHead>Zona</TableHead>
                        <TableHead>Encaje de ejemplo</TableHead>
                        <TableHead>Oportunidad</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>
                          <span className="sr-only">Acciones</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleLeads.map((l) => (
                        <TableRow key={l.id}>
                          <TableCell>
                            <button
                              className="table-name"
                              onClick={() => setSelected(l)}
                            >
                              {l.name}
                              <span>{l.industry}</span>
                            </button>
                          </TableCell>
                          <TableCell>{l.place}</TableCell>
                          <TableCell>
                            <span className="score">{l.score}/100</span>
                          </TableCell>
                          <TableCell className="reason-cell">
                            {l.reason}
                          </TableCell>
                          <TableCell>
                            <button className="contact-link" onClick={() => setSelected(l)}><Mail size={15} /> Ver contacto</button>
                          </TableCell>
                          <TableCell>
                            <button
                              className={
                                'icon-button ' +
                                (saved.includes(l.id) ? 'is-saved' : '')
                              }
                              aria-label={
                                saved.includes(l.id)
                                  ? `Quitar ${l.name} de guardados`
                                  : `Guardar ${l.name}`
                              }
                              onClick={() => toggleSave(l.id)}
                            >
                              <Bookmark
                                size={18}
                                fill={
                                  saved.includes(l.id) ? 'currentColor' : 'none'
                                }
                              />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Empty
                  title={
                    filter === 'saved'
                      ? 'Todavía no guardaste leads'
                      : 'Tu próxima oportunidad está por aparecer'
                  }
                  text={
                    filter === 'saved'
                      ? 'Abrí una ficha y guardá los negocios que te interesen.'
                      : 'Pedile a tu agente una primera búsqueda de ejemplo.'
                  }
                  action={() => setView('agent')}
                  button="Ir a mi agente"
                />
              )}
            </>
          )}
          {view === 'history' && (
            <>
              <PageHeading
                eyebrow="A TU RITMO"
                title="Mis búsquedas"
                description="Cada búsqueda empieza cuando vos la pedís."
              />
              {runs.length ? (
                <div className="history-list">
                  {runs.map((r) => (
                    <button
                      className="history-card"
                      key={r.id}
                      onClick={() => {
                        setActiveRun(r.id);
                        setShowResults(true);
                        setView('agent');
                      }}
                    >
                      <span className="history-icon">
                        <Search size={20} />
                      </span>
                      <div>
                        <h2>
                          {r.industry} en {r.place}
                        </h2>
                        <p>
                          {new Intl.DateTimeFormat('es-AR', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          }).format(new Date(r.date))}{' '}
                          · Simulación
                        </p>
                      </div>
                      <span className="history-count">{r.count} leads</span>
                      <ArrowRight size={19} />
                    </button>
                  ))}
                </div>
              ) : (
                <Empty
                  title="Todavía no hiciste búsquedas"
                  text="Elegí lugar, rubro y cantidad. Tu historial aparecerá acá."
                  action={() => setView('agent')}
                  button="Hacer mi primera búsqueda"
                />
              )}
            </>
          )}
          {view === 'agency' && (
            <>
              <PageHeading
                eyebrow="EL PUNTO DE PARTIDA"
                title="Contame sobre tu agencia"
                description="Con estas preferencias, tu agente sabrá qué clientes querés encontrar."
              />
              <div className="profile-grid">
                <form className="profile-form surface" onSubmit={saveProfile}>
                  <div className="form-section-title">
                    <Building2 size={20} />
                    <h2>Tu negocio</h2>
                  </div>
                  <label>
                    ¿Cómo querés llamar a tu agente?
                    <input
                      id="agent-name"
                      maxLength={30}
                      value={draft.agentName}
                      onChange={(e) =>
                        setDraft({ ...draft, agentName: e.target.value })
                      }
                      placeholder="Elegí un nombre, por ejemplo: Milo"
                    />
                    <span className="field-note">
                      Este nombre aparece en tu buscador y en tu espacio de trabajo.
                    </span>
                  </label>
                  <div className="two-fields">
                    <label>
                      Nombre de la agencia
                      <input
                        required
                        maxLength={70}
                        value={draft.name}
                        onChange={(e) =>
                          setDraft({ ...draft, name: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Tu nombre
                      <input
                        required
                        maxLength={40}
                        value={draft.owner}
                        onChange={(e) =>
                          setDraft({ ...draft, owner: e.target.value })
                        }
                      />
                    </label>
                  </div>
                  <label>
                    ¿Qué servicios ofrecés?
                    <textarea
                      required
                      maxLength={500}
                      rows={3}
                      value={draft.service}
                      onChange={(e) =>
                        setDraft({ ...draft, service: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    ¿En qué zona querés buscar?
                    <input
                      required
                      maxLength={100}
                      value={draft.area}
                      onChange={(e) =>
                        setDraft({ ...draft, area: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    ¿Cómo sería tu cliente ideal?
                    <textarea
                      maxLength={600}
                      rows={4}
                      value={draft.ideal}
                      onChange={(e) =>
                        setDraft({ ...draft, ideal: e.target.value })
                      }
                    />
                  </label>
                  <button className="primary">
                    Guardar y volver a mi espacio <ArrowRight size={17} />
                  </button>
                </form>
                <div className="profile-tip">
                  <span className="agent-icon">
                    <Sparkles size={26} />
                  </span>
                  <h2>
                    Cuanto mejor te conozca,
                    <br />
                    mejor podrá buscar.
                  </h2>
                  <p>
                    Podés contarle qué tipo de webs hacés, con qué negocios te
                    gusta trabajar y cuáles preferís evitar.
                  </p>
                  <div>
                    <Check size={16} /> Podés cambiarlo cuando quieras.
                  </div>
                  <p className="muted-note">
                    En esta demo se guarda en tu navegador. La búsqueda real
                    usará estas preferencias cuando conectemos el agente.
                  </p>
                </div>
              </div>
            </>
          )}
          {view === 'plan' && (
            <>
              <PageHeading eyebrow="VOS ELEGÍS CUÁNTO" title="Tu saldo, a tu ritmo" description="Recargá cuando lo necesites y usá tu saldo para buscar. Sin abono mensual." />
              <div className="plan-grid">
                <section className="pricing-card wallet-card">
                  <div className="pricing-top"><span className="small-pill">SALDO DE PRUEBA</span><Wallet size={24} /></div>
                  <div className="price">{ars(wallet.balance)} <span>ARS</span></div>
                  <p>Disponible para <strong>{remaining} búsquedas</strong>.</p>
                  <div className="wallet-rate"><span>Una búsqueda</span><strong>{ars(PLAN.searchArs)} ARS</strong></div>
                  <p>Hasta {PLAN.maxBusinesses} negocios por búsqueda. Recomendamos empezar con {PLAN.recommendedBusinesses}.</p>
                  <form className="recharge-form" onSubmit={topUp}>
                    <label htmlFor="top-up">¿Cuánto querés recargar?</label>
                    <div className="amount-input"><span>ARS</span><input id="top-up" type="number" min={PLAN.minTopUp} max={PLAN.maxBalance} step={1} value={topUpInput} onChange={(e) => setTopUpInput(e.target.value)} required disabled={busy || !ready} /></div>
                    <div className="amount-options">
                      {[15000, 30000, 100000].map((amount) => <button type="button" key={amount} aria-pressed={topUpAmount === amount} onClick={() => setTopUpInput(String(amount))} disabled={busy}>{ars(amount)}</button>)}
                    </div>
                    <p className="recharge-preview" aria-live="polite">{validTopUp(topUpAmount, wallet.balance) ? <><strong>{availableSearches(topUpAmount)} búsquedas</strong> con esta recarga{topUpAmount % PLAN.searchArs ? ' + ' + ars(topUpAmount % PLAN.searchArs) + ' de saldo restante' : ''}.</> : 'Ingresá un importe válido desde ' + ars(PLAN.minTopUp) + '.'}</p>
                    <button className="primary full" disabled={!ready || busy || !validTopUp(topUpAmount, wallet.balance)}><CreditCard size={17} /> Simular recarga</button>
                  </form>
                  <p className="price-note">Solo dinero ficticio. No se solicita ni procesa ningún pago.</p>
                </section>
                <section className="surface plan-explainer">
                  <h2>Una búsqueda, un precio claro.</h2>
                  <p>Elegís el rubro, la zona y entre 1 y {PLAN.maxBusinesses} negocios. Cada búsqueda completada con resultados cuesta <strong>{ars(PLAN.searchArs)}</strong>, independientemente de la cantidad elegida.</p>
                  <div className="recharge-examples">
                    <div><span>{ars(30000)}</span><strong>10 búsquedas</strong><small>Hasta {10 * PLAN.maxBusinesses} resultados en total</small></div>
                    <div><span>{ars(100000)}</span><strong>33 búsquedas</strong><small>+ {ars(1000)} que quedan en tu saldo</small></div>
                  </div>
                  <h2>Empezá con {PLAN.recommendedBusinesses} negocios.</h2>
                  <p>Es una cantidad práctica para revisar cada oportunidad. Pedir más puede incluir coincidencias menos ajustadas; hacer más búsquedas no reduce por sí solo la calidad.</p>
                  <ul className="wallet-rules">
                    <li><Check size={15} />El saldo no vence al terminar el mes.</li>
                    <li><Check size={15} />Si la búsqueda falla o no encuentra negocios, no se descuenta saldo.</li>
                    <li><Check size={15} />Revisar fichas y guardar leads no tiene costo.</li>
                  </ul>
                  <p className="muted-note">La cantidad depende de los negocios disponibles. Los resultados pueden repetirse entre búsquedas: no equivalen a clientes nuevos ni a ventas garantizadas.</p>
                  <div className="manual-topup-note"><strong>Recarga asistida</strong><p>En el servicio real, MI NEGOCIO WEB acredita el saldo al confirmar tu pago. Esta pantalla permite probar cómo funcionaría.</p></div>
                </section>
              </div>
            </>
          )}
        </div>
        <footer className="page-footer">
          <span>MI NEGOCIO WEB</span>
          <span>Agente de clientes · Prototipo</span>
        </footer>
      </main>
      <Sheet
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <SheetContent className="lead-sheet">
          {selected && (
            <>
              <SheetHeader>
                <div className="example-label">
                  FICHA DE EJEMPLO · NEGOCIO FICTICIO
                </div>
                <SheetTitle className="sheet-title">{selected.name}</SheetTitle>
                <SheetDescription>
                  {selected.industry} · {selected.place}
                </SheetDescription>
              </SheetHeader>
              <div className="sheet-body">
                <div className="sheet-score">
                  <span>
                    <Target size={21} />
                    Encaje con tu búsqueda
                  </span>
                  <strong>
                    {selected.score}
                    <small>/100</small>
                  </strong>
                </div>
                <p className="muted-note">
                  Puntaje ilustrativo. No representa la probabilidad de venta.
                </p>
                <section className="contact-card" aria-label="Contacto del negocio">
                  <div className="contact-heading"><Mail size={19} /><h3>Contacto del negocio</h3><span>Ejemplo</span></div>
                  <span className="contact-label">Correo electrónico ilustrativo</span>
                  <p className="contact-email">{demoContact(selected)}</p>
                  <button className="secondary full" onClick={() => copyContact(selected)}><Copy size={16} /> Copiar correo de ejemplo</button>
                  <p className="contact-disclaimer">Negocio ficticio: este correo no recibe mensajes. En el servicio real, acá verás teléfono, WhatsApp, correo o red social cuando se pueda verificar.</p>
                </section>
                <h3>¿Por qué podría interesarte?</h3>
                <p>{selected.reason}</p>
                <h3>Presencia digital</h3>
                <div className="evidence-row">
                  <Globe size={18} />
                  <div>
                    <strong>Sitio web</strong>
                    <p>{selected.web}</p>
                  </div>
                </div>
                <div className="evidence-row">
                  <Camera size={18} />
                  <div>
                    <strong>Instagram y redes</strong>
                    <p>{selected.social}</p>
                  </div>
                </div>
                <h3>Qué podrías ofrecer</h3>
                <p>{selected.offer}</p>
                <div className="pending-box">
                  <CircleHelp size={19} />
                  <div>
                    <strong>Falta confirmar</strong>
                    <p>
                      Presupuesto, interés en contratar y persona que decide.
                      Los contactos reales y sus fuentes aparecerán cuando conectemos
                      la búsqueda.
                    </p>
                  </div>
                </div>
                {selected.id.startsWith('preview') ? (
                  <button
                    className="primary full"
                    onClick={() => {
                      setSelected(null);
                      setView('agent');
                    }}
                  >
                    Preparar mi primera búsqueda <ArrowRight size={17} />
                  </button>
                ) : (
                  <button
                    className="primary full"
                    onClick={() => toggleSave(selected.id)}
                  >
                    <Bookmark size={17} />
                    {saved.includes(selected.id)
                      ? 'Quitar de guardados'
                      : 'Guardar este lead'}
                  </button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      {notice && (
        <output className="toast">
          <CircleHelp size={18} />
          <span>{notice}</span>
          <button aria-label="Cerrar aviso" onClick={() => setNotice('')}>
            <X size={17} />
          </button>
        </output>
      )}
    </SidebarProvider>
  );
}
function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading compact">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>
          {title}
          <span className="accent-dot">.</span>
        </h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
function Empty({
  title,
  text,
  action,
  button,
}: {
  title: string;
  text: string;
  action: () => void;
  button: string;
}) {
  return (
    <div className="empty-state">
      <span>
        <Radar size={36} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="primary" onClick={action}>
        {button}
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

function BrandLogo() {
  return <img className="brand-logo" src={import.meta.env.BASE_URL + 'logo-mi-negocio-web.png'} alt="MI NEGOCIO WEB" width={64} height={64} />;
}

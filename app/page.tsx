'use client';
import {
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
  type CSSProperties,
} from 'react';
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUp,
  Bookmark,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Globe,
  History,
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
import { Progress } from '@/components/ui/progress';
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
  validSearch,
  type Lead,
  type SearchSpec,
} from '@/lib/prospecto';

import { PLAN, ars, monthKey } from '@/lib/plan';

type View = 'agent' | 'leads' | 'history' | 'agency' | 'plan';
type Profile = {
  name: string;
  owner: string;
  service: string;
  area: string;
  ideal: string;
  agentName: string;
};
type Message = { role: 'agent' | 'user'; text: string };
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
  { id: 'agent', label: 'Mi agente', icon: Sparkles },
  { id: 'leads', label: 'Mis leads', icon: Target },
  { id: 'history', label: 'Mis búsquedas', icon: History },
  { id: 'agency', label: 'Mi agencia', icon: Building2 },
  { id: 'plan', label: 'Mi plan', icon: CreditCard },
] as const;

function Nav({
  view,
  go,
  profile,
  used,
  saved,
  showAccess,
}: {
  view: View;
  go: (v: View) => void;
  profile: Profile;
  used: number;
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
            <Radar size={24} />
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
        <button className="workspace" onClick={() => navigate('agency')}>
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
            Plan Esencial <ChevronRight size={14} />
          </span>
          <strong>
            {Math.max(0, PLAN.searches - used)} de {PLAN.searches} <small>búsquedas este mes</small>
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
  const [view, setView] = useState<View>('agent');
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [spec, setSpec] = useState(initialSpec);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      text: '¡Hola! Soy tu agente de búsqueda. Contame qué negocios querés encontrar, en qué lugar y cuántos. También podés usar los campos de abajo.',
    },
  ]);
  const [input, setInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [runs, setRuns] = useState<Run[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [quota, setQuota] = useState({ month: '', used: 0 });
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [activeRun, setActiveRun] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const [access, setAccess] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const runLock = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const used = quota.month === monthKey() ? quota.used : 0;
  const allLeads = runs.flatMap((r) => r.leads);
  const currentRun = runs.find((r) => r.id === activeRun) ?? runs[0];
  const shown = currentRun?.leads ?? [];
  const agentName = profile.agentName.trim() || 'Tu agente';
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
        if (
          d.quota?.month === monthKey() &&
          Number.isInteger(d.quota.used) &&
          d.quota.used >= 0 &&
          d.quota.used <= PLAN.searches
        )
          setQuota(d.quota);
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
        JSON.stringify({ profile, runs, saved, quota }),
      );
    } catch {
      setNotice(
        'No se pudo guardar en este navegador. Podés seguir probando durante esta sesión.',
      );
    }
  }, [profile, runs, saved, quota, ready]);
  /* oxlint-enable react/react-compiler */
  useEffect(() => {
    if (messages.length > 1)
      chatEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, busy]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 5500);
    return () => clearTimeout(t);
  }, [notice]);
  const add = (role: Message['role'], text: string) =>
    setMessages((m) => [...m, { role, text }]);
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
    if (used >= PLAN.searches) {
      add(
        'agent',
        `Usaste las ${PLAN.searches} búsquedas de este mes de prueba. Podés revisar tus leads; el cupo se renueva el primer día del mes siguiente.`,
      );
      return;
    }
    runLock.current = true;
    setBusy(true);
    setShowResults(true);
    setStage(0);
    setView('agent');
    add(
      'user',
      `Buscá ${request.count} ${request.industry.toLowerCase()} en ${request.place}.`,
    );
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
        setQuota((q) => ({
          month: monthKey(),
          used: (q.month === monthKey() ? q.used : 0) + 1,
        }));
        add(
          'agent',
          `Listo: preparé ${snapshot.count} ejemplos de ${snapshot.industry.toLowerCase()} en ${snapshot.place}. Abrí cada ficha para ver la oportunidad. Son negocios ficticios: esta prueba no consultó internet.`,
        );
        setBusy(false);
        runLock.current = false;
      }
    }, 750);
  }
  function send(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || busy) return;
    setChatInput('');
    if (/^(s[ií]|dale|empez[aá]|buscar|vamos)[.!\s]*$/i.test(text)) {
      search();
      return;
    }
    add('user', text);
    const lower = text.toLowerCase();
    if (/precio|plan|cu[aá]nto cuesta/.test(lower)) {
      add(
        'agent',
        `La propuesta Esencial es ${ars(PLAN.monthlyArs)} ARS por mes: ${PLAN.searches} búsquedas de hasta ${PLAN.maxBusinesses} negocios. Configuración inicial: ${ars(PLAN.setupArs)} una sola vez. Esta demo no cobra ni busca negocios reales.`,
      );
      return;
    }
    if (/mi agencia|mi negocio|me llamo|configur/.test(lower)) {
      add(
        'agent',
        'Contame sobre tu agencia en “Mi agencia”: tu nombre, qué vendés y qué clientes buscás. Voy a guardar esas preferencias en esta demo.',
      );
      return;
    }
    const industry = [
      ['inmobiliari', 'Inmobiliarias'],
      ['restauran', 'Restaurantes'],
      ['odont', 'Clínicas odontológicas'],
      ['automotor', 'Concesionarias'],
      ['concesion', 'Concesionarias'],
      ['gimnas', 'Gimnasios'],
      ['hotel', 'Hoteles'],
    ].find(([key]) => lower.includes(key))?.[1];
    const number = text.match(/\b(\d+)\b/);
    const place = text.match(/\ben\s+(.+?)(?:[.!?]|$)/i)?.[1]?.trim();
    if (industry || number || place) {
      const next = {
        industry: industry ?? spec.industry,
        place: place ?? spec.place,
        count: number ? Number(number[1]) : spec.count,
      };
      if (!validSearch(next)) {
        add(
          'agent',
          `Para esta prueba podés pedir entre 1 y ${PLAN.maxBusinesses} negocios. Ajustá los campos de abajo para continuar.`,
        );
        return;
      }
      setSpec(next);
      add(
        'agent',
        `La búsqueda quedaría así: ${next.count} ${next.industry.toLowerCase()} en ${next.place}. Revisá los campos y tocá “Buscar leads”. Descontaría 1 búsqueda de tu plan.`,
      );
    } else
      add(
        'agent',
        'En esta demo puedo preparar pedidos como “10 inmobiliarias en Córdoba”. También podés usar los campos de abajo. La conversación con IA real se conectará después.',
      );
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
    add(
      'agent',
      `Ya actualicé tu perfil, ${clean.owner}. Tu agencia es ${clean.name}, ofrece ${clean.service.toLowerCase()} y busca clientes en ${clean.area}. ¿Qué negocios buscamos primero?`,
    );
    setNotice('Perfil guardado en este navegador.');
    setView('agent');
  }
  function exportLeads() {
    const safe = (v: string) =>
      '"' + (/^[=+@\-\t\r]/.test(v) ? "'" : '') + v.replaceAll('"', '""') + '"';
    const rows = [
      [
        'Nombre (ficticio)',
        'Rubro',
        'Zona',
        'Encaje de ejemplo',
        'Oportunidad',
      ],
      ...visibleLeads.map((l) => [
        l.name,
        l.industry,
        l.place,
        String(l.score),
        l.reason,
      ]),
    ];
    const blob = new Blob(
      ['\ufeff' + rows.map((r) => r.map(safe).join(';')).join('\r\n')],
      { type: 'text/csv;charset=utf-8;' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi-negocio-web-leads-de-ejemplo.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (access)
    return (
      <main className="access-page">
        <div className="access-story">
          <div className="brand">
            <span className="brand-symbol">
              <Radar />
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
        used={used}
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
          {view === 'agent' && (
            <div className="agent-home">
              <section
                className="search-home"
                aria-label="Buscador de clientes"
              >
                <div className="personal-mark">
                  <Sparkles size={27} strokeWidth={1.3} />
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
                        disabled={busy || used >= PLAN.searches || !ready}
                      >
                        {busy ? (
                          <LoaderCircle className="spin" size={17} />
                        ) : (
                          <ArrowRight size={18} />
                        )}{' '}
                        {busy
                          ? 'Buscando…'
                          : used >= PLAN.searches
                            ? 'Cupo agotado'
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
                      <button
                        className="secondary"
                        disabled={busy || used >= PLAN.searches || !ready}
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
                  <span>1 búsqueda de tu plan</span>
                </div>
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
                            <small>{lead.signal}</small>
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
                <details className="agent-conversation">
                  <summary>
                    Hablar con{' '}
                    {agentName === 'Tu agente' ? 'mi agente' : agentName}
                    <ChevronRight size={14} />
                  </summary>
                  <div
                    className="chat-messages"
                    role="log"
                    aria-label="Conversación de demostración"
                    aria-live="polite"
                  >
                    {messages.slice(-6).map((m, i) => (
                      <div className={'message ' + m.role} key={i}>
                        <strong>
                          {m.role === 'agent' ? agentName : profile.owner}
                        </strong>
                        <p>{m.text}</p>
                      </div>
                    ))}
                    <div ref={chatEnd} />
                  </div>
                  <form className="composer" onSubmit={send}>
                    <label className="sr-only" htmlFor="chat-input">
                      Mensaje para tu agente
                    </label>
                    <input
                      id="chat-input"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Escribile a tu agente…"
                      maxLength={500}
                      disabled={busy}
                    />
                    <button
                      aria-label="Enviar mensaje"
                      disabled={!chatInput.trim() || busy}
                    >
                      <ArrowUp size={17} />
                    </button>
                  </form>
                </details>
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
                <button
                  className="secondary"
                  disabled={!visibleLeads.length}
                  onClick={exportLeads}
                >
                  <ArrowDownToLine size={16} />
                  Exportar CSV
                </button>
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
                      Este nombre aparece en tu buscador y en la conversación.
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
              <PageHeading
                eyebrow="SIMPLE Y A TU RITMO"
                title="Un plan para empezar"
                description="Una propuesta simple para encontrar oportunidades para tu agencia."
              />
              <div className="plan-grid">
                <section className="pricing-card">
                  <div className="pricing-top">
                    <span className="small-pill blue">PROPUESTA PILOTO</span>
                    <Radar size={28} />
                  </div>
                  <h2>Esencial</h2>
                  <p>Para agencias de diseño y desarrollo web.</p>
                  <div className="price">
                    {ars(PLAN.monthlyArs)} <span>ARS / mes</span>
                  </div>
                  <div className="price-note">
                    Configuración inicial: {ars(PLAN.setupArs)} ARS, una sola vez.
                  </div>
                  <ul>
                    <li>
                      <Check />{PLAN.searches} búsquedas por mes
                    </li>
                    <li>
                      <Check />
                      Hasta {PLAN.maxBusinesses} negocios analizados por búsqueda
                    </li>
                    <li>
                      <Check />
                      Rubro y ubicación a elección
                    </li>
                    <li>
                      <Check />
                      Agente personalizado para tu agencia
                    </li>
                    <li>
                      <Check />
                      Historial y leads guardados
                    </li>
                  </ul>
                  <button
                    className="primary full"
                    onClick={() => setView('agent')}
                  >
                    Probar una búsqueda <ArrowRight size={17} />
                  </button>
                  <p className="price-note">Demo gratuita con datos ficticios. Servicio real en preparación; sin cobros habilitados.</p>
                </section>
                <section className="surface plan-explainer">
                  <h2>¿Qué cuenta como una búsqueda?</h2>
                  <p>
                    Un pedido con un tipo de negocio, una ubicación y una
                    cantidad. Por ejemplo:
                  </p>
                  <div className="request-example">
                    “Buscá 10 inmobiliarias en Córdoba”.
                  </div>
                  <p>
                    Un pedido completado con resultados descuenta{' '}
                    <strong>1 búsqueda</strong>. Chatear, revisar fichas y
                    guardar leads no descuenta búsquedas.
                  </p>
                  <p><strong>¿Necesitás más?</strong> {PLAN.extraSearches} búsquedas extra por {ars(PLAN.extraArs)} ARS, a pedido y válidas durante el ciclo vigente.</p>
                  <div className="usage-details">
                    <div>
                      <span>Usadas este mes en la demo</span>
                      <strong>{used} de {PLAN.searches}</strong>
                    </div>
                    <Progress locale="es-AR" value={(used / PLAN.searches) * 100} />
                    <span>
                      En la demo, el cupo se renueva el primer día de cada mes.
                      En el servicio, con cada renovación mensual. No se acumula.
                    </span>
                  </div>
                  <div className="muted-note">
                    Propuesta: si una búsqueda falla o no encuentra negocios, no consume cupo.
                    Los resultados dependen del rubro y la zona; no son ventas garantizadas.
                  </div>
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
                      Las fuentes y los contactos aparecerán cuando conectemos
                      la búsqueda real.
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

import {
  KEY,
  initialProfile,
  initialSpec,
  type Profile,
  type Run,
  type View,
} from '@/lib/demo-model';
import { restoreDemo } from '@/lib/demo-storage';
import {
  PLAN,
  ars,
  availableSearches,
  searchBudget,
  searchPrice,
  spendSearch,
  validTopUp,
  type WalletState,
} from '@/lib/plan';
import {
  createLeads,
  validSearch,
  type Lead,
  type SearchSpec,
} from '@/lib/prospecto';
import { useEffect, useRef, useState, type SyntheticEvent } from 'react';

export function useDemo() {
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
  const [wallet, setWallet] = useState<WalletState>({
    balance: PLAN.demoBalance,
    spent: 0,
    completedSearches: 0,
    includedRemaining: PLAN.includedSearches,
  });
  const [topUpInput, setTopUpInput] = useState('30000');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [activeRun, setActiveRun] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const runLock = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const remaining = availableSearches(wallet.balance, wallet.includedRemaining);
  const nextSearchPrice = searchPrice(wallet.includedRemaining);

  const topUpAmount = Number(topUpInput);
  const afterTopUp = searchBudget(
    wallet.balance + topUpAmount,
    wallet.includedRemaining,
  );
  const allLeads = runs.flatMap((r) => r.leads);
  const currentRun = runs.find((r) => r.id === activeRun) ?? runs[0];
  const shown = currentRun?.leads ?? [];
  const visibleLeads = allLeads.filter(
    (l) => filter === 'all' || saved.includes(l.id),
  );
  useEffect(() => {
    try {
      const restored = restoreDemo(localStorage.getItem(KEY));
      if (restored) {
        setProfile(restored.profile);
        setDraft(restored.profile);
        setRuns(restored.runs);
        setSaved(restored.saved);
        setWallet(restored.wallet);
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
      setNotice(
        'No alcanza tu saldo. Entrá a Mi saldo para simular una recarga.',
      );
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
        setNotice(
          nextSearchPrice === 0
            ? 'Búsqueda de ejemplo completada. Usaste una de las búsquedas incluidas.'
            : 'Búsqueda de ejemplo completada. Se descontaron ' +
                ars(nextSearchPrice) +
                ' del saldo de prueba.',
        );
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
      setNotice(
        'Ingresá un importe entero desde ' +
          ars(PLAN.minTopUp) +
          ', sin superar ' +
          ars(PLAN.maxBalance) +
          ' de saldo de prueba.',
      );
      return;
    }
    setWallet((current) => ({
      ...current,
      balance: current.balance + topUpAmount,
    }));
    setNotice(
      'Sumaste ' + ars(topUpAmount) + ' ficticios. No se realizó ningún pago.',
    );
  }

  return {
    view,
    setView,
    profile,
    draft,
    setDraft,
    spec,
    setSpec,
    input,
    setInput,
    showResults,
    setShowResults,
    runs,
    saved,
    wallet,
    topUpInput,
    setTopUpInput,
    ready,
    busy,
    stage,
    selected,
    setSelected,
    setActiveRun,
    filter,
    setFilter,
    notice,
    setNotice,
    remaining,
    nextSearchPrice,
    topUpAmount,
    afterTopUp,
    currentRun,
    shown,
    visibleLeads,
    toggleSave,
    search,
    saveProfile,
    topUp,
  };
}
export type DemoController = ReturnType<typeof useDemo>;

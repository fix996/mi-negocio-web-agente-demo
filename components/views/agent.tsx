import { BrandLogo } from '@/components/shared';
import type { DemoController } from '@/hooks/use-demo';
import { PLAN, ars } from '@/lib/plan';
import { parseSearch } from '@/lib/search-query';
import {
  ArrowRight,
  Building2,
  ChevronRight,
  LoaderCircle,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
type Props = Pick<
  DemoController,
  | 'setView'
  | 'profile'
  | 'spec'
  | 'setSpec'
  | 'input'
  | 'setInput'
  | 'showResults'
  | 'wallet'
  | 'ready'
  | 'busy'
  | 'stage'
  | 'setSelected'
  | 'setFilter'
  | 'setNotice'
  | 'remaining'
  | 'nextSearchPrice'
  | 'currentRun'
  | 'shown'
  | 'search'
>;
export function SearchView({
  setView,
  profile,
  spec,
  setSpec,
  input,
  setInput,
  showResults,
  wallet,
  ready,
  busy,
  stage,
  setSelected,
  setFilter,
  setNotice,
  remaining,
  nextSearchPrice,
  currentRun,
  shown,
  search,
}: Props) {
  return (
    <div className="agent-home">
      <section className="search-home" aria-label="Buscador de clientes">
        <div className="personal-mark">
          <BrandLogo />
        </div>
        <button className="agent-name-button" onClick={() => setView('agency')}>
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
              const next = parseSearch(input, spec.count);
              if (!next) {
                setNotice(
                  'Probá con “10 inmobiliarias en Córdoba” o ajustá los campos de abajo.',
                );
                return;
              }
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
              <p className="quantity-advice">
                <strong>{PLAN.recommendedBusinesses} recomendados</strong> ·
                Máximo {PLAN.maxBusinesses} negocios. Pedir más puede incluir
                coincidencias menos ajustadas.
              </p>
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
          <button className="balance-inline" onClick={() => setView('plan')}>
            {wallet.includedRemaining > 0
              ? 'Búsqueda incluida · Te quedan ' + wallet.includedRemaining
              : 'Próxima búsqueda: ' + ars(nextSearchPrice)}{' '}
            · Saldo: {ars(wallet.balance)}
          </button>
        </div>
        {remaining < 1 && !busy && (
          <button
            className="text-btn refill-link"
            onClick={() => setView('plan')}
          >
            Recargar saldo de prueba <ArrowRight size={14} />
          </button>
        )}
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
  );
}

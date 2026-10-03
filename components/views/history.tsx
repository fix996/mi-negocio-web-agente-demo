import { Empty, PageHeading } from '@/components/shared';
import type { DemoController } from '@/hooks/use-demo';
import { ArrowRight, Search } from 'lucide-react';
type Props = Pick<
  DemoController,
  'setView' | 'setShowResults' | 'runs' | 'setActiveRun'
>;
export function HistoryView({
  setView,
  setShowResults,
  runs,
  setActiveRun,
}: Props) {
  return (
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
  );
}

import { Empty, PageHeading } from '@/components/shared';
import type { DemoController } from '@/hooks/use-demo';
import { Bookmark, Mail } from 'lucide-react';
type Props = Pick<
  DemoController,
  | 'setView'
  | 'saved'
  | 'setSelected'
  | 'filter'
  | 'setFilter'
  | 'visibleLeads'
  | 'toggleSave'
>;
export function LeadsView({
  setView,
  saved,
  setSelected,
  filter,
  setFilter,
  visibleLeads,
  toggleSave,
}: Props) {
  return (
    <>
      <PageHeading
        eyebrow="TUS OPORTUNIDADES"
        title="Mis leads"
        description="Revisá cada oportunidad y guardá las que te interesen."
      />
      <div className="section-toolbar">
        <select
          className="filter-select"
          aria-label="Filtrar leads"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos los leads</option>
          <option value="saved">Guardados</option>
        </select>
        <span>{visibleLeads.length} negocios de ejemplo</span>
      </div>
      {visibleLeads.length ? (
        <div
          className="table-panel"
          role="region"
          aria-label="Resultados de leads"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th>Negocio ficticio</th>
                <th>Zona</th>
                <th>Encaje de ejemplo</th>
                <th>Oportunidad</th>
                <th>Contacto</th>
                <th>
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleLeads.map((l) => (
                <tr key={l.id}>
                  <td>
                    <button
                      className="table-name"
                      onClick={() => setSelected(l)}
                    >
                      {l.name}
                      <span>{l.industry}</span>
                    </button>
                  </td>
                  <td>{l.place}</td>
                  <td>
                    <span className="score">{l.score}/100</span>
                  </td>
                  <td className="reason-cell">{l.reason}</td>
                  <td>
                    <button
                      className="contact-link"
                      onClick={() => setSelected(l)}
                    >
                      <Mail size={15} /> Ver contacto
                    </button>
                  </td>
                  <td>
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
                        fill={saved.includes(l.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  );
}

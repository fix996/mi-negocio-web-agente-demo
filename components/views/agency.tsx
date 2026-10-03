import { PageHeading } from '@/components/shared';
import type { DemoController } from '@/hooks/use-demo';
import { ArrowRight, Building2, Check, Sparkles } from 'lucide-react';
type Props = Pick<DemoController, 'draft' | 'setDraft' | 'saveProfile'>;
export function AgencyView({ draft, setDraft, saveProfile }: Props) {
  return (
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
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label>
              Tu nombre
              <input
                required
                maxLength={40}
                value={draft.owner}
                onChange={(e) => setDraft({ ...draft, owner: e.target.value })}
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
              onChange={(e) => setDraft({ ...draft, service: e.target.value })}
            />
          </label>
          <label>
            ¿En qué zona querés buscar?
            <input
              required
              maxLength={100}
              value={draft.area}
              onChange={(e) => setDraft({ ...draft, area: e.target.value })}
            />
          </label>
          <label>
            ¿Cómo sería tu cliente ideal?
            <textarea
              maxLength={600}
              rows={4}
              value={draft.ideal}
              onChange={(e) => setDraft({ ...draft, ideal: e.target.value })}
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
            Podés contarle qué tipo de webs hacés, con qué negocios te gusta
            trabajar y cuáles preferís evitar.
          </p>
          <div>
            <Check size={16} /> Podés cambiarlo cuando quieras.
          </div>
          <p className="muted-note">
            En esta demo se guarda en tu navegador. La búsqueda real usará estas
            preferencias cuando conectemos el agente.
          </p>
        </div>
      </div>
    </>
  );
}

import { ArrowRight, Building2, Check, LockKeyhole, MapPin, SlidersHorizontal, Target } from 'lucide-react';
import { PLAN, ars } from '@/lib/plan';

export function AgencyIntro({ onSearch, onProfile, onBalance }: {
  onSearch: () => void;
  onProfile: () => void;
  onBalance: () => void;
}) {
  return (
    <section className="agency-intro" aria-label="Presentación del agente para agencias">
      <div className="intro-eyebrow"><span /> MI NEGOCIO WEB · PARA AGENCIAS WEB</div>
      <div className="intro-hero">
        <div className="intro-copy">
          <h1>Encontrá los próximos<br className="intro-break" /> clientes de <span>tu agencia.</span></h1>
          <p className="intro-lead">Tu propio agente de IA, pensado para encontrar negocios que podrían necesitar una página web o mejorar la que ya tienen.</p>
          <p className="intro-purpose">Un servicio para ayudarte a conseguir clientes para los servicios de diseño y desarrollo web que vos ofrecés.</p>
          <div className="intro-actions">
            <button className="primary" onClick={onSearch}>Probar mi agente <ArrowRight size={17} /></button>
            <button className="text-btn" onClick={onProfile}>Personalizar mi agencia <SlidersHorizontal size={15} /></button>
          </div>
          <p className="intro-demo-label">Demo interactiva · Sin registro ni pagos</p>
        </div>
        <aside className="intro-sample" aria-label="Ejemplo ficticio de oportunidad comercial">
          <div className="sample-topline"><Target size={18} /><span>UNA OPORTUNIDAD, CON CONTEXTO</span></div>
          <div className="sample-business"><span className="sample-icon"><Building2 size={23} /></span><div><h2>Horizonte</h2><p>Inmobiliaria · Córdoba</p></div></div>
          <div className="sample-detail"><span>Señal a investigar</span><p>Publica propiedades en redes. En este ejemplo, no se identificó un catálogo web propio.</p></div>
          <div className="sample-detail"><span>Una propuesta posible</span><p>Una web que reúna las propiedades y facilite las consultas de compradores.</p></div>
          <div className="sample-contact"><Check size={15} />Oportunidad · Motivo · Contacto disponible</div>
          <p className="sample-disclaimer">Caso ficticio para mostrar el formato. No es un lead real ni una venta asegurada.</p>
        </aside>
      </div>

      <section className="intro-workflow" aria-labelledby="workflow-title">
        <div className="intro-section-heading"><span>ASÍ ESTÁ PENSADO EL SERVICIO</span><h2 id="workflow-title">De saber a quién buscás, a saber a quién contactar.</h2></div>
        <div className="intro-steps">
          <article><span className="intro-step-number">01</span><h3>Conoce tu agencia</h3><p>Lo configuramos según tus servicios, tus clientes ideales y las oportunidades que querés encontrar. Vos elegís su nombre.</p></article>
          <article><span className="intro-step-number">02</span><h3>Investiga donde elijas</h3><p>Definís rubro, ciudad o provincia de Argentina. La propuesta es analizar información pública, webs y redes disponibles para detectar posibles necesidades.</p></article>
          <article><span className="intro-step-number">03</span><h3>Te ayuda a dar el primer paso</h3><p>Recibirías negocios con una explicación del posible encaje, fuentes y un contacto cuando se pueda verificar. Tu agencia decide a quién acercarse.</p></article>
        </div>
      </section>

      <div className="intro-service-notes">
        <div><LockKeyhole size={18} /><p><strong>Un espacio propio para cada agencia</strong><span>El servicio prevé una cuenta privada con su agente, preferencias e historial.</span></p></div>
        <div><MapPin size={18} /><p><strong>Pensado para buscar en toda Argentina</strong><span>Vos elegís la zona. La cantidad y calidad dependen de la información disponible.</span></p></div>
      </div>

      <div className="intro-bottom">
        <div><h2>Vos elegís cuándo buscar.</h2><p>Propuesta prepaga: {ars(PLAN.searchArs)} por búsqueda, hasta {PLAN.maxBusinesses} negocios. Empezá con {PLAN.recommendedBusinesses} para revisar las oportunidades con calma.</p><button className="text-btn" onClick={onBalance}>Ver cómo funcionan las recargas <ArrowRight size={15} /></button></div>
        <div className="intro-status"><span className="small-pill">ESTÁS EXPLORANDO UNA DEMO</span><p>Podés probar el recorrido con negocios, contactos y saldo ficticios. La búsqueda real con IA y las cuentas privadas todavía no están conectadas.</p></div>
      </div>
    </section>
  );
}

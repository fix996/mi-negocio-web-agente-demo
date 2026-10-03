import type { DemoController } from '@/hooks/use-demo';
import { demoContact, type Lead } from '@/lib/prospecto';
import {
  Bookmark,
  Camera,
  CircleHelp,
  Copy,
  Globe,
  Mail,
  Target,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
type Props = Pick<DemoController, 'saved' | 'toggleSave'> & {
  lead: Lead;
  onClose: () => void;
};
export function LeadDialog({ lead, onClose, saved, toggleSave }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copyMessage, setCopyMessage] = useState('');
  async function copyContact() {
    try {
      await navigator.clipboard.writeText(demoContact(lead));
      setCopyMessage(
        'Correo de ejemplo copiado. No pertenece a un negocio real.',
      );
    } catch {
      setCopyMessage(
        'No se pudo copiar. Podés seleccionar el correo en la ficha.',
      );
    }
  }
  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="lead-sheet"
      aria-labelledby="lead-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="dialog-close icon-button"
        aria-label="Cerrar ficha"
        onClick={onClose}
        autoFocus
      >
        <X size={20} />
      </button>
      <header className="sheet-header">
        <div className="example-label">FICHA DE EJEMPLO · NEGOCIO FICTICIO</div>
        <h2 className="sheet-title" id="lead-title">
          {lead.name}
        </h2>
        <p>
          {lead.industry} · {lead.place}
        </p>
      </header>
      <div className="sheet-body">
        <div className="sheet-score">
          <span>
            <Target size={21} />
            Encaje con tu búsqueda
          </span>
          <strong>
            {lead.score}
            <small>/100</small>
          </strong>
        </div>
        <p className="muted-note">
          Puntaje ilustrativo. No representa la probabilidad de venta.
        </p>
        <section className="contact-card" aria-label="Contacto del negocio">
          <div className="contact-heading">
            <Mail size={19} />
            <h3>Contacto del negocio</h3>
            <span>Ejemplo</span>
          </div>
          <span className="contact-label">Correo electrónico ilustrativo</span>
          <p className="contact-email">{demoContact(lead)}</p>
          <button className="secondary full" onClick={copyContact}>
            <Copy size={16} /> Copiar correo de ejemplo
          </button>
          <output className="contact-disclaimer">{copyMessage}</output>
          <p className="contact-disclaimer">
            Negocio ficticio: este correo no recibe mensajes. En el servicio
            real, acá verás teléfono, WhatsApp, correo o red social cuando se
            pueda verificar.
          </p>
        </section>
        <h3>¿Por qué podría interesarte?</h3>
        <p>{lead.reason}</p>
        <h3>Presencia digital</h3>
        <div className="evidence-row">
          <Globe size={18} />
          <div>
            <strong>Sitio web</strong>
            <p>{lead.web}</p>
          </div>
        </div>
        <div className="evidence-row">
          <Camera size={18} />
          <div>
            <strong>Instagram y redes</strong>
            <p>{lead.social}</p>
          </div>
        </div>
        <h3>Qué podrías ofrecer</h3>
        <p>{lead.offer}</p>
        <div className="pending-box">
          <CircleHelp size={19} />
          <div>
            <strong>Falta confirmar</strong>
            <p>
              Presupuesto, interés en contratar y persona que decide. Los
              contactos reales y sus fuentes aparecerán cuando conectemos la
              búsqueda.
            </p>
          </div>
        </div>
        <button className="primary full" onClick={() => toggleSave(lead.id)}>
          <Bookmark size={17} />
          {saved.includes(lead.id)
            ? 'Quitar de guardados'
            : 'Guardar este lead'}
        </button>
      </div>
    </dialog>
  );
}

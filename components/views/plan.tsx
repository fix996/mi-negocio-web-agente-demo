import { PageHeading } from '@/components/shared';
import type { DemoController } from '@/hooks/use-demo';
import { PLAN, ars, availableSearches, validTopUp } from '@/lib/plan';
import { Check, CreditCard, Wallet } from 'lucide-react';
type Props = Pick<
  DemoController,
  | 'wallet'
  | 'topUpInput'
  | 'setTopUpInput'
  | 'ready'
  | 'busy'
  | 'remaining'
  | 'nextSearchPrice'
  | 'topUpAmount'
  | 'afterTopUp'
  | 'topUp'
>;
export function BalanceView({
  wallet,
  topUpInput,
  setTopUpInput,
  ready,
  busy,
  remaining,
  nextSearchPrice,
  topUpAmount,
  afterTopUp,
  topUp,
}: Props) {
  return (
    <>
      <PageHeading
        eyebrow="PRECIOS CLAROS · EN PESOS ARGENTINOS"
        title="Activás una vez. Buscás a tu ritmo"
        description={`Activación y configuración: ${ars(PLAN.activationArs)}, con ${PLAN.includedSearches} búsquedas incluidas. Después, ${ars(PLAN.searchArs)} por búsqueda adicional. Sin abono mensual.`}
      />
      <div className="plan-grid">
        <section className="pricing-card wallet-card">
          <div className="pricing-top">
            <span className="small-pill">SALDO DE PRUEBA</span>
            <Wallet size={24} />
          </div>
          <div className="price">
            {ars(wallet.balance)} <span>ARS</span>
          </div>
          <p>
            <strong>
              {wallet.includedRemaining} búsquedas incluidas pendientes
            </strong>{' '}
            + {availableSearches(wallet.balance)} con tu saldo. Total:{' '}
            {remaining}.
          </p>
          <div className="wallet-rate">
            <span>Tu próxima búsqueda</span>
            <strong>
              {nextSearchPrice === 0
                ? 'Incluida'
                : ars(nextSearchPrice) + ' ARS'}
            </strong>
          </div>
          <p>
            Las búsquedas incluidas se usan primero y no descuentan dinero de tu
            saldo. Después, cada búsqueda cuesta {ars(PLAN.searchArs)}.
          </p>
          <p>
            Hasta {PLAN.maxBusinesses} negocios por búsqueda. Recomendamos
            empezar con {PLAN.recommendedBusinesses}.
          </p>
          <form className="recharge-form" onSubmit={topUp}>
            <label htmlFor="top-up">¿Cuánto querés recargar?</label>
            <div className="amount-input">
              <span>ARS</span>
              <input
                id="top-up"
                type="number"
                min={PLAN.minTopUp}
                max={PLAN.maxBalance}
                step={1}
                value={topUpInput}
                onChange={(e) => setTopUpInput(e.target.value)}
                required
                disabled={busy || !ready}
              />
            </div>
            <div className="amount-options">
              {[10000, 30000, 100000].map((amount) => (
                <button
                  type="button"
                  key={amount}
                  aria-pressed={topUpAmount === amount}
                  onClick={() => setTopUpInput(String(amount))}
                  disabled={busy}
                >
                  {ars(amount)}
                </button>
              ))}
            </div>
            <p className="recharge-preview" aria-live="polite">
              {validTopUp(topUpAmount, wallet.balance) ? (
                <>
                  Con esta recarga, tu saldo y las búsquedas incluidas
                  pendientes tendrás{' '}
                  <strong>{afterTopUp.count} búsquedas disponibles</strong>
                  {afterTopUp.remainder
                    ? ' + ' + ars(afterTopUp.remainder) + ' de saldo restante'
                    : ''}
                  .
                </>
              ) : (
                'Ingresá un importe válido desde ' + ars(PLAN.minTopUp) + '.'
              )}
            </p>
            <button
              className="primary full"
              disabled={
                !ready || busy || !validTopUp(topUpAmount, wallet.balance)
              }
            >
              <CreditCard size={17} /> Simular recarga
            </button>
          </form>
          <p className="price-note">
            Solo dinero ficticio. No se solicita ni procesa ningún pago.
          </p>
        </section>
        <section className="surface plan-explainer">
          <span className="small-pill">ACTIVACIÓN · PAGO ÚNICO</span>
          <h2 className="activation-price">
            {ars(PLAN.activationArs)} <small>ARS</small>
          </h2>
          <p>
            Incluye la configuración de tu agente según los servicios, rubros y
            zonas de tu agencia, tu acceso privado y{' '}
            <strong>{PLAN.includedSearches} búsquedas iniciales</strong>. La
            activación no se vuelve a cobrar al recargar.
          </p>
          <p>
            Después,{' '}
            <strong>{ars(PLAN.searchArs)} por búsqueda adicional</strong>.
            Elegís entre 1 y {PLAN.maxBusinesses} negocios. Se cobra por
            búsqueda con resultados, independientemente de la cantidad elegida.
          </p>
          <p className="muted-note">
            Ejemplos de recarga, además de las búsquedas incluidas que te
            queden:
          </p>
          <div className="recharge-examples">
            {[30000, 100000].map((amount) => (
              <div key={amount}>
                <span>{ars(amount)}</span>
                <strong>
                  {availableSearches(amount)} búsquedas adicionales
                </strong>
                <small>
                  Hasta {availableSearches(amount) * PLAN.maxBusinesses}{' '}
                  resultados en total
                </small>
              </div>
            ))}
          </div>
          <h2>Empezá con {PLAN.recommendedBusinesses} negocios.</h2>
          <p>
            Es una cantidad práctica para revisar cada oportunidad. Pedir más
            puede incluir coincidencias menos ajustadas; hacer más búsquedas no
            reduce por sí solo la calidad.
          </p>
          <ul className="wallet-rules">
            <li>
              <Check size={15} />
              Las 3 búsquedas incluidas se otorgan con la activación, una sola
              vez.
            </li>
            <li>
              <Check size={15} />
              El saldo no vence al terminar el mes.
            </li>
            <li>
              <Check size={15} />
              Si la búsqueda falla o no encuentra negocios, no se descuenta
              saldo.
            </li>
            <li>
              <Check size={15} />
              Revisar fichas y guardar leads no tiene costo.
            </li>
          </ul>
          <p className="muted-note">
            La cantidad depende de los negocios disponibles. Los resultados
            pueden repetirse entre búsquedas: no equivalen a clientes nuevos ni
            a ventas garantizadas.
          </p>
          <div className="manual-topup-note">
            <strong>Así será la recarga por WhatsApp</strong>
            <ol>
              <li>Elegís el importe y ves cuántas búsquedas suma.</li>
              <li>
                Solicitás la recarga por WhatsApp, con tu agencia e importe.
              </li>
              <li>Confirmamos el pago y acreditamos el saldo en tu cuenta.</li>
            </ol>
            <p>
              La acreditación es manual. En esta demo solo se simula: no se abre
              WhatsApp ni se procesa un pago.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

// The live DailyWire paywall modal (last screenshot), with the promo plan preselected.
// Kept faithful on purpose: this is the hosted checkout, not something this project redesigns.
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DATE, DISCLOSURE, FREE_TICKETS, TICKET_PRICE } from '../data/data';
import { useFlow } from '../store';
import { Icon } from './Icon';
import { Wordmark } from './ShowPage';

type PlanId = 'monthly' | 'annual' | 'aa';

const CARDS: { id: PlanId; name: string; price: string; was?: string; billed?: string; text: string }[] = [
  { id: 'monthly', name: 'Monthly', price: '$15', text: 'All articles, films, shows & documentaries.' },
  { id: 'annual', name: 'Annual', price: '$10', was: '$13', billed: 'billed yearly at $104.30.', text: 'All articles, films, shows & documentaries.' },
  { id: 'aa', name: 'All Access', price: '$15', was: '$21', billed: 'billed yearly at $174.30.', text: 'Full content library, plus private Q&As with hosts.' },
];

export default function Checkout() {
  const plan = useFlow((s) => s.checkout);
  const close = useFlow((s) => s.closeCheckout);
  useEffect(() => {
    if (!plan) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', k);
    document.documentElement.classList.add('locked');
    return () => { window.removeEventListener('keydown', k); document.documentElement.classList.remove('locked'); };
  }, [plan, close]);
  if (!plan) return null;
  return createPortal(
    <div className="pw-back" onPointerDown={(e) => e.target === e.currentTarget && close()}>
      <Paywall key={plan} plan={plan} />
    </div>,
    document.body,
  );
}

export function Paywall({ plan, onClose, onBack }: { plan: 'promo' | 'upgrade' | 'stream'; onClose?: () => void; onBack?: () => void }) {
  const closeCheckout = useFlow((s) => s.closeCheckout);
  const close = onClose ?? closeCheckout;
  const complete = useFlow((s) => s.completeCheckout);
  const user = useFlow((s) => s.user);
  const pick = useFlow((s) => s.pick);
  const [sel, setSel] = useState<PlanId>(plan === 'stream' ? 'annual' : 'aa');
  const [busy, setBusy] = useState(false);
  const guest = user === 'guest';
  const tickets = plan !== 'stream';

  const title = plan === 'upgrade' ? 'Upgrade to All Access' : plan === 'stream' ? 'Watch Confession on DailyWire+' : `All Access, with ${FREE_TICKETS} tickets to Confession`;
  const sub = plan === 'upgrade' ? `Your ${FREE_TICKETS} tickets to Confession are included.` : 'Cancel anytime.';

  const go = () => {
    setBusy(true);
    setTimeout(() => (sel === 'aa' || plan === 'stream' ? complete() : (close(), useFlow.getState().say(`Welcome to DailyWire+. Tickets are $${TICKET_PRICE} each on TicketSpice.`), useFlow.setState({ user: 'member' }))), 900);
  };

  return (
    <div className="pw" role="dialog" aria-modal="true" aria-labelledby="pw-title">
      <div className="pw-top">
        {onBack && <button className="pw-back-btn" aria-label="Back" onClick={onBack}><Icon name="left" size={18} /></button>}
        <span>{guest ? 'Create your account' : 'jo***es@gmail.com'}</span>
        <button className="pw-x" aria-label="Close" onClick={close}><Icon name="x" size={18} /></button>
      </div>
      <div className="pw-body">
        <Wordmark className="pw-logo" />
        <h2 id="pw-title">{title}</h2>
        <p className="pw-sub">{sub}</p>

        {tickets && pick && (
          <div className="pw-pick">
            <Icon name="ticket" size={18} />
            <p><b>{pick.t.name}</b><span>{DATE.chip} · {pick.s.time} · {pick.t.city}</span></p>
          </div>
        )}

        <div className="pw-plans" role="radiogroup">
          {CARDS.map((c) => {
            const current = plan === 'upgrade' && c.id === 'annual';
            const lower = plan === 'upgrade' && c.id === 'monthly';
            const tag = c.id === 'aa' && tickets ? `+${FREE_TICKETS} TICKETS` : c.id === 'annual' && !tickets ? 'MOST POPULAR' : current ? 'CURRENT PLAN' : null;
            return (
              <button key={c.id} role="radio" aria-checked={sel === c.id} disabled={current || lower} className={'pw-plan' + (sel === c.id ? ' on' : '') + (current || lower ? ' off' : '')} onClick={() => setSel(c.id)}>
                {tag && <span className={'pw-tag' + (current ? ' grey' : '')}>{tag}</span>}
                <span className="pw-pn">{c.name}</span>
                <span className="pw-pp">{c.was && <s>{c.was}</s>}{c.price}<small>/mo</small></span>
                {c.billed && <span className="pw-pb">{c.billed}</span>}
                <span className="pw-pt">{c.text}</span>
                {c.id === 'aa' && tickets && <span className="pw-pt pw-plus">Plus {FREE_TICKETS} tickets to Confession.</span>}
              </button>
            );
          })}
        </div>
        {tickets && sel !== 'aa' && <p className="pw-warn">Tickets aren’t included with this plan. Members pay ${TICKET_PRICE} per ticket.</p>}

        {guest && (
          <label className="pw-field"><span>Email address</span><input type="email" placeholder="you@email.com" autoComplete="email" /></label>
        )}
        <div className="pw-pay">
          <div className="pw-pay-h"><b>Payment method</b><span>Add payment method</span></div>
          {guest ? (
            <div className="pw-card-fields">
              <input placeholder="Card number" inputMode="numeric" autoComplete="off" />
              <input placeholder="MM / YY" inputMode="numeric" autoComplete="off" />
              <input placeholder="CVC" inputMode="numeric" autoComplete="off" />
            </div>
          ) : (
            <div className="pw-card"><span className="pw-cc" />Visa •••• 4242 (08/29)<span className="pw-edit">Edit</span><span className="pw-radio" /></div>
          )}
        </div>
        <button className="pw-offer">Have an offer code?</button>
        <p className="pw-legal">
          By clicking <b>Agree and Continue</b>, you authorize The Daily Wire to charge your card today with the amount shown plus tax, and again to automatically renew at the then-current rate plus tax. You can <u>cancel</u> any time before the next renewal. Fees for unused time are non-refundable.
        </p>
        {tickets && <p className="pw-disc"><Icon name="info" size={15} />{DISCLOSURE}</p>}
      </div>
      <div className="pw-foot">
        <button className="pw-btn" onClick={go} disabled={busy}>{busy ? <span className="spin dark" /> : 'AGREE AND CONTINUE'}</button>
        <p><Icon name="shield" size={14} />Secure and Encrypted</p>
      </div>
    </div>
  );
}

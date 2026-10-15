// Option 11's ticket flow, built as DW modals. Anatomy from the "Last Call Container" frames in the
// design file: 587 wide, #151515, a 64px bar with the account and a close button, centred heading,
// plan cards, a summary box, one white button at the bottom and a grey link under it.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { create } from 'zustand';
import { CODE, DATE, DISCLOSURE, FREE_TICKETS, TICKET_PRICE, firstOpen, type Show, type Theater } from '../data/data';
import { useFlow, useTier } from '../store';
import { Icon } from '../components/Icon';
import { Wordmark } from '../components/ShowPage';

type Step = 'tickets' | 'plans' | 'pay' | 'done';
type PlanId = 'monthly' | 'annual' | 'aa';
type Reason = 'tickets' | 'watch';

const PRICE: Record<PlanId, { name: string; mo: string; was?: string; year: number; billed: string }> = {
  monthly: { name: 'Monthly', mo: '$15', year: 15, billed: 'billed monthly' },
  annual: { name: 'Annual', mo: '$10', was: '$13', year: 104.3, billed: 'billed yearly at $104.30' },
  aa: { name: 'All Access', mo: '$15', was: '$21', year: 174.3, billed: 'billed yearly at $174.30' },
};
const money = (n: number) => '$' + n.toFixed(2);

interface M {
  open: boolean;
  step: Step;
  back: Step | null;
  reason: Reason;
  plan: PlanId;
  upgrade: boolean; // paying the difference to All Access
  from: PlanId; // the plan an upgrade starts from
  copied: boolean;
  show: (step: Step, reason: Reason, plan?: PlanId) => void;
  go: (step: Step, patch?: Partial<M>) => void;
  close: () => void;
}

export const useModal = create<M>((set, get) => ({
  open: false, step: 'tickets', back: null, reason: 'tickets', plan: 'aa', upgrade: false, from: 'annual', copied: false,
  show: (step, reason, plan = reason === 'watch' ? 'annual' : 'aa') => set({ open: true, step, back: null, reason, plan, upgrade: false, copied: false }),
  go: (step, patch = {}) => set({ back: get().step, step, ...patch }),
  close: () => set({ open: false }),
}));

/** Get tickets on a row: All Access and members land on their tickets, visitors on the plans. */
export function openTickets(t: Theater) {
  const s = firstOpen(t);
  if (!s) return;
  useFlow.getState().choose(t, s);
  const tier = useFlow.getState().joined ? 'aa' : useFlow.getState().user;
  useModal.getState().show(tier === 'guest' ? 'plans' : 'tickets', 'tickets');
}

export function openWatch() {
  useModal.getState().show('plans', 'watch');
}

export default function TicketModal() {
  const m = useModal();
  const box = useRef<HTMLDivElement>(null);
  const sheet = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;
  useEffect(() => {
    if (!m.open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && m.close();
    window.addEventListener('keydown', k);
    document.documentElement.classList.add('locked');
    box.current?.querySelector<HTMLElement>('.tm-x')?.focus({ preventScroll: true });
    return () => { window.removeEventListener('keydown', k); document.documentElement.classList.remove('locked'); };
  }, [m.open, m.close]);
  useEffect(() => { box.current?.querySelector('.tm-main')?.scrollTo(0, 0); }, [m.step]);
  if (!m.open) return null;
  return createPortal(
    <div className={'tm-back' + (sheet ? ' sheet' : '')} onPointerDown={(e) => e.target === e.currentTarget && m.close()}>
      <div className="tm" role="dialog" aria-modal="true" aria-labelledby="tm-title" ref={box} key={m.step}>
        <Body />
      </div>
    </div>,
    document.body,
  );
}

function Body() {
  const step = useModal((s) => s.step);
  const tier = useTier();
  if (step === 'plans') return <Plans />;
  if (step === 'pay') return <Pay />;
  if (step === 'done') return <Done />;
  return tier === 'aa' ? <Code /> : tier === 'member' ? <Choice /> : <Plans />;
}

function Bar({ label }: { label?: string }) {
  const tier = useTier();
  const close = useModal((s) => s.close);
  const back = useModal((s) => s.back);
  const go = useModal((s) => s.go);
  return (
    <div className="tm-bar">
      {back && <button className="tm-back-btn" aria-label="Back" onClick={() => go(back, { back: null })}><Icon name="left" size={20} /></button>}
      <span>{label ?? (tier === 'guest' ? 'Create your account' : 'jo***es@gmail.com')}</span>
      <button className="tm-x" aria-label="Close" onClick={close}><Icon name="x" size={20} /></button>
    </div>
  );
}

function Head({ icon, title, sub, logo }: { icon?: 'ticket' | 'check'; title: string; sub?: React.ReactNode; logo?: boolean }) {
  return (
    <div className="tm-head">
      {logo && <Wordmark className="tm-logo" />}
      {icon === 'ticket' && <Icon name="ticket" size={40} stroke={1.5} className="tm-ic" />}
      {icon === 'check' && <svg className="tm-ic" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M8.5 12.2l2.4 2.4 4.6-4.8" /></svg>}
      <h2 id="tm-title">{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

function Where() {
  const pick = useFlow((s) => s.pick);
  const release = useFlow((s) => s.release);
  if (!pick) return null;
  return <><b>{pick.t.name}</b> · {release === 'day' ? 'Tonight' : DATE.chip} · {pick.s.time}</>;
}

/** More than one showtime at the picked theater: pick it here, on cards shaped like the plan cards. */
function Times() {
  const pick = useFlow((s) => s.pick);
  const choose = useFlow((s) => s.choose);
  if (!pick || pick.t.shows.length < 2) return null;
  return (
    <div className="tm-times" role="radiogroup" aria-label="Showtime">
      {pick.t.shows.map((s: Show) => {
        const out = s.status === 'out';
        const on = pick.s.id === s.id;
        return (
          <button key={s.id} role="radio" aria-checked={on} disabled={out} className={'tm-card tm-time' + (on ? ' on' : '')} onClick={() => choose(pick.t, s)}>
            <span className="tm-c-big">{s.time}</span>
            <span className="tm-c-small">{out ? 'Sold out' : s.status === 'few' ? `${s.format} · Few seats left` : s.format}</span>
          </button>
        );
      })}
    </div>
  );
}

function CodeBox({ note }: { note: string }) {
  const copied = useModal((s) => s.copied);
  const copy = () => {
    navigator.clipboard?.writeText(CODE).catch(() => {});
    useModal.setState({ copied: true });
  };
  return (
    <div className="tm-box tm-code">
      <span className="tm-label">Your code</span>
      <div className="tm-code-row">
        <span className="tm-code-v" aria-label={CODE.split('').join(' ')}>{CODE}</span>
        <button className={'tm-copy' + (copied ? ' done' : '')} onClick={copy}><Icon name={copied ? 'check' : 'copy'} size={16} />{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <p className="tm-small">{note}</p>
    </div>
  );
}

function ToTicketSpice() {
  const copied = useModal((s) => s.copied);
  const handoff = useFlow((s) => s.handoff);
  return (
    <div className="tm-foot">
      <button className="tm-btn" onClick={() => { handoff(); useModal.setState({ copied: true }); }}>Continue to TicketSpice<Icon name="out" size={16} /></button>
      <p className={'tm-hint' + (copied ? ' ok' : '')}>
        {copied ? <><Icon name="check" size={15} />Code copied. Paste it under Promo code at checkout.</> : 'We copy the code for you. Paste it under Promo code at checkout.'}
      </p>
    </div>
  );
}

// ── All Access: the code ─────────────────────────────────────────────────────────────────────────
function Code() {
  return (
    <>
      <Bar />
      <div className="tm-main">
        <Head icon="ticket" title="Your seats are on us." sub={<Where />} />
        <Times />
        <CodeBox note={`Covers up to ${FREE_TICKETS} tickets in one checkout. We emailed it to you too.`} />
      </div>
      <ToTicketSpice />
    </>
  );
}

// ── DW+ member: buy, or take the last call to All Access ────────────────────────────────────────
function Choice() {
  const [pick, setPick] = useState<'buy' | 'aa'>('buy');
  const go = useModal((s) => s.go);
  const handoff = useFlow((s) => s.handoff);
  const close = useModal((s) => s.close);
  const diff = PRICE.aa.year - PRICE.annual.year;
  return (
    <>
      <Bar />
      <div className="tm-main">
        <Head logo title="Get your tickets" sub={<Where />} />
        <Times />
        <div className="tm-cards two" role="radiogroup" aria-label="How to get your seats">
          <button role="radio" aria-checked={pick === 'buy'} className={'tm-card' + (pick === 'buy' ? ' on' : '')} onClick={() => setPick('buy')}>
            <span className="tm-c-name">Buy tickets</span>
            <span className="tm-c-price">${TICKET_PRICE}<small>/ticket</small></span>
            <span className="tm-c-text">Pick seats and pay on TicketSpice, our ticketing partner.</span>
          </button>
          <button role="radio" aria-checked={pick === 'aa'} className={'tm-card' + (pick === 'aa' ? ' on' : '')} onClick={() => setPick('aa')}>
            <span className="tm-tag">{FREE_TICKETS} FREE TICKETS</span>
            <span className="tm-c-name">Upgrade to All Access</span>
            <span className="tm-c-price"><s>${TICKET_PRICE * FREE_TICKETS}</s>$0<small>for {FREE_TICKETS} tickets</small></span>
            <span className="tm-c-text">Your {FREE_TICKETS} tickets come with the plan. Pay {money(diff)} today.</span>
          </button>
        </div>
      </div>
      <div className="tm-foot">
        {pick === 'buy'
          ? <button className="tm-btn" onClick={() => { handoff(); close(); }}>Buy tickets on TicketSpice<Icon name="out" size={16} /></button>
          : <button className="tm-btn" onClick={() => go('pay', { plan: 'aa', upgrade: true, from: 'annual' })}>Upgrade for {money(diff)}</button>}
        <p className="tm-hint">{pick === 'buy' ? 'Opens ticketspice.com in a new tab' : 'You only pay the difference from your Annual plan'}</p>
      </div>
    </>
  );
}

// ── Visitor: choose a plan (the Figma plan picker) ──────────────────────────────────────────────
function Plans() {
  const reason = useModal((s) => s.reason);
  const plan = useModal((s) => s.plan);
  const go = useModal((s) => s.go);
  const release = useFlow((s) => s.release);
  const tickets = reason === 'tickets';
  const login = () => {
    useFlow.setState({ user: 'member' });
    useFlow.getState().say('Logged in as a DailyWire+ member (prototype).');
    if (tickets) useModal.setState({ step: 'tickets', back: null });
    else useModal.getState().close();
  };
  const title = tickets ? 'Choose a plan to get your seats.' : release === 'before' ? 'Choose a plan and watch Confession on Nov 11.' : 'Choose a plan and watch Confession tonight.';
  return (
    <>
      <Bar label={tickets ? 'Members-only screening' : 'Join DailyWire+'} />
      <div className="tm-main">
        <Head logo title={release === 'after' && !tickets ? 'Choose a plan and watch Confession now.' : title} sub={tickets ? <Where /> : undefined} />
        <div className="tm-cards three" role="radiogroup" aria-label="Plan">
          {(['monthly', 'annual', 'aa'] as PlanId[]).map((id) => {
            const p = PRICE[id];
            const tag = id === 'aa' && tickets ? `+${FREE_TICKETS} TICKETS` : id === 'annual' && !tickets ? 'MOST POPULAR' : id === 'aa' ? '25% OFF' : null;
            return (
              <button key={id} role="radio" aria-checked={plan === id} className={'tm-card' + (plan === id ? ' on' : '')} onClick={() => useModal.setState({ plan: id })}>
                {tag && <span className={'tm-tag' + (tag === '25% OFF' ? ' light' : '')}>{tag}</span>}
                <span className="tm-c-name">{p.name}</span>
                <span className="tm-c-price">{p.was && <s>{p.was}</s>}{p.mo}<small>/mo</small></span>
                <span className="tm-c-small">{p.billed}</span>
                <span className="tm-c-text">{id === 'aa' ? (tickets ? `Full library and Q&As with hosts, plus ${FREE_TICKETS} tickets to Confession.` : 'Full library plus private Q&As with hosts.') : 'All articles, films, shows & documentaries.'}</span>
              </button>
            );
          })}
        </div>
        {tickets && plan !== 'aa' && <p className="tm-note">With {PRICE[plan].name}, tickets are ${TICKET_PRICE} each.</p>}
        {tickets && <p className="tm-legal">{DISCLOSURE}</p>}
      </div>
      <div className="tm-foot">
        <button className="tm-btn" onClick={() => go('pay', { upgrade: false })}>Continue to payment</button>
        <button className="tm-link" onClick={login}>Already a member? Log in</button>
      </div>
    </>
  );
}

// ── Payment: summary box like the Last Call frames, then the card ───────────────────────────────
function Pay() {
  const plan = useModal((s) => s.plan);
  const upgrade = useModal((s) => s.upgrade);
  const from = useModal((s) => s.from);
  const reason = useModal((s) => s.reason);
  const go = useModal((s) => s.go);
  const user = useFlow((s) => s.user);
  const [busy, setBusy] = useState(false);
  const p = PRICE[plan];
  const credit = upgrade ? PRICE[from].year : 0;
  const today = p.year - credit;
  const withTickets = plan === 'aa' && reason === 'tickets';
  const pay = () => {
    setBusy(true);
    setTimeout(() => {
      if (plan === 'aa') useFlow.setState({ joined: true });
      else useFlow.setState({ user: 'member' });
      go('done', { back: null });
    }, 900);
  };
  return (
    <>
      <Bar />
      <div className="tm-main">
        <Head title={upgrade ? 'Upgrade to All Access' : 'Complete your purchase'} sub={withTickets ? <Where /> : undefined} />
        <div className="tm-box tm-sum">
          <div className="tm-row"><span>{p.name}, {plan === 'monthly' ? 'monthly' : 'billed yearly'}</span><span>{money(p.year)}</span></div>
          {upgrade && <div className="tm-row"><span>{PRICE[from].name} plan credit</span><span className="tm-green">−{money(credit)}</span></div>}
          {withTickets && <div className="tm-row"><span>{FREE_TICKETS} tickets to Confession</span><span className="tm-green">Included</span></div>}
          <div className="tm-row total"><span>Today</span><span>{money(today)}</span></div>
        </div>
        {user === 'guest' ? (
          <div className="tm-fields">
            <label className="tm-field"><span>Email address</span><input type="email" placeholder="you@email.com" autoComplete="email" /></label>
            <div className="tm-field"><span>Card</span><div className="tm-cardrow"><input placeholder="Card number" inputMode="numeric" autoComplete="off" /><input placeholder="MM / YY" inputMode="numeric" autoComplete="off" /><input placeholder="CVC" inputMode="numeric" autoComplete="off" /></div></div>
          </div>
        ) : (
          <div className="tm-saved"><span className="tm-cc" />Visa •••• 4242<span className="tm-exp">08/29</span></div>
        )}
        <p className="tm-legal">
          By clicking <b>Agree &amp; Continue</b>, you authorize The Daily Wire to charge your card today with the amount shown plus tax, and again to automatically renew at the then-current rate plus tax. You can cancel any time before the next renewal. Fees for unused time are non-refundable.
          {withTickets && <> {DISCLOSURE}</>}
        </p>
      </div>
      <div className="tm-foot">
        <button className="tm-btn" onClick={pay} disabled={busy}>{busy ? <span className="spin dark" /> : 'Agree & Continue'}</button>
      </div>
    </>
  );
}

// ── Done: success, then the code, or the last call for the tickets ──────────────────────────────
function Done() {
  const tier = useTier();
  const reason = useModal((s) => s.reason);
  const plan = useModal((s) => s.plan);
  const go = useModal((s) => s.go);
  const close = useModal((s) => s.close);
  const release = useFlow((s) => s.release);
  const handoff = useFlow((s) => s.handoff);
  const say = useFlow((s) => s.say);

  if (reason === 'watch')
    return (
      <>
        <Bar />
        <div className="tm-main">
          <Head icon="check" title="Your purchase was successful" sub={release === 'before' ? 'Confession streams on DailyWire+ on Wednesday, November 11. We’ll remind you that day.' : 'Confession is ready to watch on DailyWire+.'} />
        </div>
        <div className="tm-foot">
          {release === 'before'
            ? <button className="tm-btn" onClick={close}>Done</button>
            : <button className="tm-btn" onClick={() => { close(); say('Starts Confession on DailyWire+ (prototype).'); }}><Icon name="play" size={16} />Watch now</button>}
        </div>
      </>
    );

  if (tier === 'aa')
    return (
      <>
        <Bar />
        <div className="tm-main">
          <Head icon="check" title="Welcome to All Access" sub={<>Your seats are on us at <Where /></>} />
          <Times />
          <CodeBox note={`Covers up to ${FREE_TICKETS} tickets in one checkout. We emailed it to you too.`} />
        </div>
        <ToTicketSpice />
      </>
    );

  const diff = PRICE.aa.year - PRICE[plan].year;
  return (
    <>
      <Bar />
      <div className="tm-main">
        <Head icon="check" title="Your purchase was successful" />
        <div className="tm-box tm-last">
          <h3>Last call: your {FREE_TICKETS} tickets, free</h3>
          <p className="tm-small">You have {PRICE[plan].name}. Upgrade to All Access and the tickets to Confession come with it.</p>
          <p className="tm-hero-price"><s>${TICKET_PRICE * FREE_TICKETS}</s>$0<small>for {FREE_TICKETS} tickets</small></p>
          <div className="tm-rule" />
          <div className="tm-row"><span>All Access, billed yearly</span><span>{money(PRICE.aa.year)}</span></div>
          <div className="tm-row"><span>{PRICE[plan].name} plan credit</span><span className="tm-green">−{money(PRICE[plan].year)}</span></div>
          <div className="tm-row total"><span>All Access today</span><span>{money(diff)}</span></div>
        </div>
      </div>
      <div className="tm-foot">
        <button className="tm-btn" onClick={() => go('pay', { plan: 'aa', upgrade: true, from: plan, back: null })}>Upgrade for {money(diff)}</button>
        <button className="tm-link" onClick={() => { handoff(); close(); }}>No thanks, buy tickets for ${TICKET_PRICE} each</button>
      </div>
    </>
  );
}

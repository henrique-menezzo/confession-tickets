// What happens once a showtime is picked. Same rules in every option:
// All Access gets the code and a hand-off that copies it, members buy on TicketSpice (with an
// upgrade offer), visitors get the promo plan with the legal line right next to the button.
import { useState } from 'react';
import { CODE, DISCLOSURE, FREE_TICKETS, PLAN, TICKET_PRICE } from '../data/data';
import { useFlow, useTier } from '../store';
import { Icon } from './Icon';

export function CodeCard({ size = 'md' }: { size?: 'md' | 'lg' | 'sm' }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className={'code code-' + size}>
      <div className="code-main">
        <span className="code-l">Your code</span>
        <span className="code-v" aria-label={CODE.split('').join(' ')}>{CODE}</span>
      </div>
      <button className={'code-copy' + (copied ? ' done' : '')} onClick={copy}>
        <Icon name={copied ? 'check' : 'copy'} size={17} />{copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export function GoTicketSpice({ label = 'Continue to TicketSpice', block = true }: { label?: string; block?: boolean }) {
  const handoff = useFlow((s) => s.handoff);
  return (
    <button className={'btn btn-w' + (block ? ' block' : '')} onClick={() => handoff()}>
      {label}<Icon name="out" size={17} />
    </button>
  );
}

export function AAHelp() {
  const done = useFlow((s) => s.done);
  return done ? (
    <p className="act-help ok"><Icon name="check" size={15} />Code copied. Paste it under <b>Promo code</b> at checkout.</p>
  ) : (
    <p className="act-help">We copy the code when you continue. Paste it under <b>Promo code</b> at checkout.</p>
  );
}

export function JoinButton({ label = 'Join All Access', block = true }: { label?: string; block?: boolean }) {
  const openCheckout = useFlow((s) => s.openCheckout);
  return <button className={'btn btn-r' + (block ? ' block' : '')} onClick={() => openCheckout('promo')}>{label}</button>;
}

export function LoginAlt() {
  const setUser = useFlow((s) => s.setUser);
  const say = useFlow((s) => s.say);
  return (
    <p className="act-alt">Already a member? <button onClick={() => { setUser('member'); say('Logged in as a DailyWire+ member (prototype).'); }}>Log in</button></p>
  );
}

export function Upsell() {
  const openCheckout = useFlow((s) => s.openCheckout);
  return (
    <div className="upsell">
      <p><b>Or get {FREE_TICKETS} free with All Access.</b> Upgrade and the tickets come with your plan.</p>
      <button className="link-btn strong" onClick={() => openCheckout('upgrade')}>Upgrade<Icon name="right" size={15} /></button>
    </div>
  );
}

/** The whole post-pick block. `head={false}` drops the title when the container already has one. */
export function Action({ head = true, layout = 'stack' }: { head?: boolean; layout?: 'stack' | 'wide' }) {
  const tier = useTier();
  const joined = useFlow((s) => s.joined);

  if (tier === 'aa')
    return (
      <div className={'act act-aa act-' + layout}>
        <div className="act-copy">
          {joined && <p className="act-welcome"><Icon name="check" size={16} />Welcome to All Access. We emailed this code to you too.</p>}
          {head && !joined && <p className="eyebrow red">All Access perk</p>}
          {head && <h3 className="act-h">Your seats are on us.</h3>}
          <p className="act-p">Up to {FREE_TICKETS} tickets in one checkout with this code.</p>
          <CodeCard />
        </div>
        <div className="act-do">
          <GoTicketSpice />
          <AAHelp />
        </div>
      </div>
    );

  if (tier === 'member')
    return (
      <div className={'act act-member act-' + layout}>
        <div className="act-copy">
          {head && <p className="eyebrow">DailyWire+ members</p>}
          {head && <h3 className="act-h">Tickets are ${TICKET_PRICE} each.</h3>}
          <p className="act-p">You pick seats and pay on TicketSpice, our ticketing partner.</p>
        </div>
        <div className="act-do">
          <GoTicketSpice label="Buy tickets on TicketSpice" />
          <Upsell />
        </div>
      </div>
    );

  return (
    <div className={'act act-guest act-' + layout}>
      <div className="act-copy">
        {head && <p className="eyebrow red">Members-only screening</p>}
        {head && <h3 className="act-h">Join All Access and your {FREE_TICKETS} tickets come with it.</h3>}
        <p className="act-p">${PLAN.price}/mo, billed yearly at ${PLAN.yearly}. Includes the full DailyWire+ library.</p>
      </div>
      <div className="act-do">
        <JoinButton label={`Join All Access · ${FREE_TICKETS} tickets included`} />
        <p className="disclosure">{DISCLOSURE}</p>
        <LoginAlt />
      </div>
    </div>
  );
}

/** One line that says what this person gets, used above searches before anything is picked. */
export function Perk({ className = '' }: { className?: string }) {
  const tier = useTier();
  if (tier === 'aa') return <p className={'perk ' + className}><Icon name="ticket" size={18} /><span><b>{FREE_TICKETS} free tickets</b> come with your All Access membership.</span></p>;
  if (tier === 'member') return <p className={'perk ' + className}><Icon name="ticket" size={18} /><span>Members get tickets for <b>${TICKET_PRICE}</b>. All Access members get {FREE_TICKETS} free.</span></p>;
  return <p className={'perk ' + className}><Icon name="lock" size={18} /><span>A members-only screening. <b>All Access includes {FREE_TICKETS} tickets.</b></span></p>;
}

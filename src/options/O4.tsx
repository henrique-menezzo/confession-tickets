// 04 · Paywall modal. Every step uses the anatomy of the live paywall: account bar, wordmark,
// centered title, content, one white button. For visitors the plan step is the real paywall.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DATE, FREE_TICKETS, LOCATION_ZIP, RADIUS, THEATER_COUNT, TICKET_PRICE } from '../data/data';
import { useFlow, useTier } from '../store';
import { Hero, HeroTools, Nav, ShowBody, Wordmark } from '../components/ShowPage';
import { Far, PickLine, Searching, TheaterList } from '../components/Finder';
import { AAHelp, CodeCard, Perk, Upsell } from '../components/Action';
import { Paywall } from '../components/Checkout';
import { Chat } from '../components/Chrome';
import { Icon } from '../components/Icon';
import { GetTickets, HeroNote } from './O1';

export default function O4() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Nav />
      <Hero action={<><div className="hero-row"><GetTickets onClick={() => setOpen(true)} /><HeroTools /></div><HeroNote /></>} />
      <ShowBody />
      {open && createPortal(<div className="pw-back o4-back" onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}><Flow close={() => setOpen(false)} /></div>, document.body)}
      <Chat />
    </>
  );
}

function Flow({ close }: { close: () => void }) {
  const phase = useFlow((s) => s.phase);
  const found = useFlow((s) => s.found);
  const pick = useFlow((s) => s.pick);
  const user = useFlow((s) => s.user);
  const joined = useFlow((s) => s.joined);
  const search = useFlow((s) => s.search);
  const clear = useFlow((s) => s.clearSearch);
  const handoff = useFlow((s) => s.handoff);
  const tier = useTier();
  const [go, setGo] = useState(false);
  const [zip, setZip] = useState(useFlow.getState().zip);
  const [err, setErr] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const stage = phase === 'idle' ? 'zip' : pick && go ? 'act' : 'list';

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', k);
    document.documentElement.classList.add('locked');
    return () => { window.removeEventListener('keydown', k); document.documentElement.classList.remove('locked'); };
  }, [close]);
  useEffect(() => { if (stage === 'zip') input.current?.focus(); }, [stage]);

  if (stage === 'act' && tier === 'guest') return <Paywall plan="promo" onClose={close} onBack={() => setGo(false)} />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) { setErr('Enter a 5-digit ZIP code'); return; }
    setErr('');
    search(zip);
  };

  const top = stage === 'zip' ? 'Get tickets' : stage === 'list' ? `ZIP ${found?.zip ?? zip}` : pick?.t.name;
  const back = stage === 'list' ? () => { clear(); setGo(false); } : stage === 'act' ? () => setGo(false) : undefined;

  return (
    <div className="pw o4" role="dialog" aria-modal="true" aria-label="Get tickets">
      <div className="pw-top">
        {back && <button className="pw-back-btn" aria-label="Back" onClick={back}><Icon name="left" size={18} /></button>}
        <span>{top}</span>
        <button className="pw-x" aria-label="Close" onClick={close}><Icon name="x" size={18} /></button>
      </div>

      {stage === 'zip' && (
        <form className="o4-form" onSubmit={submit} noValidate>
          <div className="pw-body">
            <Wordmark className="pw-logo" />
            <h2>Find a theater near you</h2>
            <p className="pw-sub">Members-only screenings on {DATE.long}.</p>
            <Perk className="o4-perk" />
            <label className="pw-field big">
              <span>ZIP code</span>
              <input ref={input} value={zip} onChange={(e) => { setZip(e.target.value.replace(/\D/g, '').slice(0, 5)); setErr(''); }} inputMode="numeric" autoComplete="postal-code" placeholder="e.g. 37064" aria-invalid={!!err} />
              {err && <em>{err}</em>}
            </label>
            <button type="button" className="o4-loc" onClick={() => { setZip(LOCATION_ZIP); search(LOCATION_ZIP); }}><Icon name="locate" size={16} />Use my location</button>
          </div>
          <div className="pw-foot">
            <button className="pw-btn" type="submit">FIND THEATERS</button>
            <p>{THEATER_COUNT} theaters nationwide · one night only</p>
          </div>
        </form>
      )}

      {stage === 'list' && (
        <>
          <div className="pw-body o4-scroll">
            {phase === 'searching' && <><h2>Finding theaters</h2><p className="pw-sub">Within {RADIUS} miles of {zip}</p><Searching rows={4} /></>}
            {phase === 'results' && found && (
              <>
                <h2>{found.theaters.length} theaters near {found.place}</h2>
                <p className="pw-sub">{DATE.long} · pick a showtime</p>
                <TheaterList variant="compact" />
              </>
            )}
            {phase === 'far' && <Far compact />}
          </div>
          {(phase === 'results' || pick) && (
            <div className="pw-foot">
              <button className="pw-btn" disabled={!pick} onClick={() => setGo(true)}>CONTINUE</button>
              <p>{pick ? `${pick.t.name} · ${pick.s.time}` : 'Pick a showtime to continue'}</p>
            </div>
          )}
        </>
      )}

      {stage === 'act' && (
        <>
          <div className="pw-body">
            <Wordmark className="pw-logo" />
            {tier === 'aa' ? (
              <>
                {joined && <p className="act-welcome center"><Icon name="check" size={16} />Welcome to All Access</p>}
                <h2>Your seats are on us.</h2>
                <p className="pw-sub">Up to {FREE_TICKETS} tickets in one checkout with this code{user === 'aa' ? '' : '. We emailed it to you too'}.</p>
                <PickLine change={false} />
                <CodeCard size="lg" />
              </>
            ) : (
              <>
                <h2>Tickets are ${TICKET_PRICE} each.</h2>
                <p className="pw-sub">You pick seats and pay on TicketSpice, our ticketing partner.</p>
                <PickLine change={false} />
                <Upsell />
              </>
            )}
          </div>
          <div className="pw-foot">
            <button className="pw-btn" onClick={() => handoff()}>{tier === 'aa' ? 'CONTINUE TO TICKETSPICE' : 'BUY TICKETS ON TICKETSPICE'}<Icon name="out" size={16} /></button>
            {tier === 'aa' ? <AAHelp /> : <p>Opens ticketspice.com in a new tab</p>}
          </div>
        </>
      )}
    </div>
  );
}

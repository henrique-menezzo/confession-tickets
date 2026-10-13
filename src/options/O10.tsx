// 10 · Ticket bar. A slim bar at the bottom while you scroll; it opens into a sheet and folds back.
import { useEffect, useState } from 'react';
import { ART, DATE, FREE_TICKETS, TICKET_PRICE } from '../data/data';
import { useFlow, useTier } from '../store';
import { Hero, HeroTools, Nav, ShowBody } from '../components/ShowPage';
import { Far, ListHead, PickLine, Searching, TheaterList, ZipForm } from '../components/Finder';
import { Action, GoTicketSpice, JoinButton } from '../components/Action';
import { Chat } from '../components/Chrome';
import { Icon } from '../components/Icon';
import { GetTickets, HeroNote } from './O1';

export default function O10() {
  const phase = useFlow((s) => s.phase);
  const found = useFlow((s) => s.found);
  const pick = useFlow((s) => s.pick);
  const unpick = useFlow((s) => s.unpick);
  const clear = useFlow((s) => s.clearSearch);
  const tier = useTier();
  const [folded, setFolded] = useState(false);
  const open = phase !== 'idle' && !folded;

  useEffect(() => { if (phase === 'searching') setFolded(false); }, [phase]);
  useEffect(() => {
    document.documentElement.classList.toggle('locked', open && window.matchMedia('(max-width: 760px)').matches);
    return () => document.documentElement.classList.remove('locked');
  }, [open]);

  const focusBar = () => {
    if (phase !== 'idle') { setFolded(false); return; }
    const el = document.querySelector<HTMLInputElement>('.tb input');
    el?.focus();
    document.querySelector('.tb')?.classList.add('nudge');
    setTimeout(() => document.querySelector('.tb')?.classList.remove('nudge'), 700);
  };

  const line = tier === 'aa' ? `${FREE_TICKETS} free tickets with All Access` : tier === 'member' ? `Members $${TICKET_PRICE} per ticket` : `Members only · All Access includes ${FREE_TICKETS} tickets`;

  return (
    <div className="o10">
      <Nav />
      <Hero action={<><div className="hero-row"><GetTickets onClick={focusBar} /><HeroTools /></div><HeroNote /></>} />
      <ShowBody />
      <div className="tb-space" />
      <div className={'tb-dim' + (open ? ' on' : '')} onClick={() => setFolded(true)} />
      <div className={'tb' + (open ? ' open' : '')}>
        {open && (
          <div className="tb-sheet">
            <div className="tb-sh">
              {pick ? (
                <button className="back-btn" onClick={unpick}><Icon name="left" size={18} />All theaters</button>
              ) : phase === 'results' ? <ListHead /> : <span />}
              <button className="icon-btn" aria-label="Fold" onClick={() => setFolded(true)}><Icon name="chevdown" size={20} /></button>
            </div>
            <div className="tb-sb" key={pick ? 'p' : phase}>
              {phase === 'searching' && <Searching rows={3} />}
              {phase === 'results' && !pick && <TheaterList variant="compact" />}
              {phase === 'far' && !pick && <Far compact />}
              {pick && <div className="tb-act"><PickLine change={false} /><Action layout="wide" /></div>}
            </div>
          </div>
        )}
        <div className="tb-bar">
          <img className="tb-poster" src={ART.poster} alt="" />
          <div className="tb-t">
            <b>Confession in theaters · {DATE.chip}</b>
            <span>{pick && folded ? `${pick.t.name} · ${pick.s.time}` : found && folded ? `${found.theaters.length || 'No'} theaters near ${found.place}` : line}</span>
          </div>
          <div className="tb-r">
            {phase === 'idle' || open ? (
              <ZipForm variant="bar" cta="Find" locate={false} />
            ) : pick && tier === 'aa' ? (
              <><button className="btn btn-g sm" onClick={() => setFolded(false)}>Show code</button><GoTicketSpice block={false} label="TicketSpice" /></>
            ) : pick && tier === 'member' ? (
              <GoTicketSpice block={false} label="Buy tickets" />
            ) : pick ? (
              <JoinButton block={false} label="Join All Access" />
            ) : (
              <><button className="btn btn-g sm" onClick={clear}>New ZIP</button><button className="btn btn-w sm" onClick={() => setFolded(false)}>Show theaters<Icon name="chevup" size={16} /></button></>
            )}
          </div>
        </div>
      </div>
      <Chat />
    </div>
  );
}

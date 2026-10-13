// 08 · Ask the concierge. The ticket finder and the screening chatbot are one thread.
import { useEffect, useRef, useState } from 'react';
import { DATE, DISCLOSURE, FAQ, FREE_TICKETS, TICKET_PRICE, isOut } from '../data/data';
import { useFlow, useTier } from '../store';
import { Hero, HeroTools, Nav, ShowBody, Wordmark } from '../components/ShowPage';
import { Far, Showtimes, Status, ZipForm } from '../components/Finder';
import { AAHelp, CodeCard, GoTicketSpice, JoinButton, LoginAlt, Upsell } from '../components/Action';
import { Icon } from '../components/Icon';
import { GetTickets, HeroNote } from './O1';

function Bot({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return <div className={'msg bot' + (wide ? ' wide' : '')}>{children}</div>;
}
function Me({ children }: { children: React.ReactNode }) {
  return <div className="msg me">{children}</div>;
}

export default function O8() {
  const [open, setOpen] = useState(false);
  const phase = useFlow((s) => s.phase);
  const found = useFlow((s) => s.found);
  const zip = useFlow((s) => s.zip);
  const pick = useFlow((s) => s.pick);
  const joined = useFlow((s) => s.joined);
  const done = useFlow((s) => s.done);
  const locate = useFlow((s) => s.locate);
  const tier = useTier();
  const [asked, setAsked] = useState<number[]>([]);
  const [all, setAll] = useState(false);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = body.current;
    if (el) requestAnimationFrame(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }));
  }, [phase, pick, asked, joined, done, open, all]);

  const list = found?.theaters ?? [];
  const shown = all ? list : list.slice(0, 3);

  return (
    <>
      <Nav />
      <Hero action={<><div className="hero-row"><GetTickets onClick={() => setOpen(true)} /><HeroTools /></div><HeroNote /></>} />
      <ShowBody />
      <div className={'cc' + (open ? ' open' : '')}>
        {open && (
          <div className="cc-panel" role="dialog" aria-label="Tickets and questions">
            <header className="cc-h">
              <span className="cc-av"><Wordmark className="cc-logo" /></span>
              <div><b>Confession tickets</b><span>Ask anything about the screening</span></div>
              <button className="icon-btn" aria-label="Close" onClick={() => setOpen(false)}><Icon name="x" size={20} /></button>
            </header>
            <div className="cc-body" ref={body}>
              <Bot>Confession plays in theaters for one night, <b>{DATE.long}</b>. {tier === 'aa' ? `Your All Access membership includes ${FREE_TICKETS} free tickets.` : tier === 'member' ? `Members get tickets for $${TICKET_PRICE}.` : `It’s a members-only screening, and All Access includes ${FREE_TICKETS} tickets.`}</Bot>
              <Bot>Where are you watching from?</Bot>
              {phase !== 'idle' && <Me>{zip}</Me>}
              {phase === 'searching' && <div className="msg bot typing"><i /><i /><i /></div>}
              {phase === 'results' && (
                <Bot wide>
                  <p>{list.length} theaters within 50 miles of {found?.place}. Pick a showtime:</p>
                  <ul className="cc-list">
                    {shown.map((t) => (
                      <li key={t.id} className={isOut(t) ? 'out' : ''}>
                        <div className="cc-t"><b>{t.name}</b><span>{t.miles} mi · {t.city}</span><Status t={t} /></div>
                        <Showtimes t={t} size="sm" />
                      </li>
                    ))}
                  </ul>
                  {!all && list.length > 3 && <button className="link-btn" onClick={() => setAll(true)}>Show {list.length - 3} more</button>}
                </Bot>
              )}
              {phase === 'far' && <Bot wide><Far compact /></Bot>}
              {pick && <Me>{pick.t.name} · {pick.s.time}</Me>}
              {pick && tier === 'aa' && (
                <Bot wide>
                  {joined && <p className="act-welcome"><Icon name="check" size={16} />Welcome to All Access.</p>}
                  <p>Here’s your code. It covers up to {FREE_TICKETS} seats in one checkout{joined ? ', and it’s in your email too' : ''}.</p>
                  <CodeCard size="sm" />
                  <GoTicketSpice />
                  <AAHelp />
                </Bot>
              )}
              {pick && tier === 'member' && (
                <Bot wide>
                  <p>Tickets are ${TICKET_PRICE} each. You pick seats and pay on TicketSpice.</p>
                  <GoTicketSpice label="Buy tickets on TicketSpice" />
                  <Upsell />
                </Bot>
              )}
              {pick && tier === 'guest' && (
                <Bot wide>
                  <p>This screening is for members. Join All Access and your {FREE_TICKETS} tickets come with it.</p>
                  <JoinButton label={`Join All Access · ${FREE_TICKETS} tickets`} />
                  <p className="disclosure">{DISCLOSURE}</p>
                  <LoginAlt />
                </Bot>
              )}
              {asked.map((i) => (
                <div key={i} className="qa"><Me>{FAQ[i].q}</Me><Bot>{FAQ[i].a}</Bot></div>
              ))}
            </div>
            <footer className="cc-f">
              {phase !== 'idle' && (
                <div className="cc-chips">
                  {FAQ.map((f, i) => !asked.includes(i) && <button key={i} onClick={() => setAsked([...asked, i])}>{f.q}</button>)}
                </div>
              )}
              {phase === 'idle' ? (
                <>
                  <div className="cc-chips"><button onClick={locate}><Icon name="locate" size={15} />Use my location</button></div>
                  <ZipForm variant="chat" cta="" locate={false} autoFocus />
                </>
              ) : (
                <div className="cc-in"><input placeholder="Ask a question" aria-label="Ask a question" /><Icon name="send" size={18} /></div>
              )}
            </footer>
          </div>
        )}
        {!open && (
          <button className="cc-fab" onClick={() => setOpen(true)}>
            <Icon name="ticket" size={20} /><span><b>Get tickets</b> or ask a question</span>
          </button>
        )}
      </div>
    </>
  );
}

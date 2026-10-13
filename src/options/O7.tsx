// 07 · Closest showing. Location is guessed, the nearest open showing gets one button.
import { useEffect, useRef, useState } from 'react';
import { DATE, DISCLOSURE, FREE_TICKETS, LOCATION_ZIP, RADIUS, TICKET_PRICE, bestMatch, firstOpen } from '../data/data';
import { useFlow, useTier } from '../store';
import { Hero, HeroTools, Nav, ShowBody } from '../components/ShowPage';
import { Far, Searching, Showtimes, Status, TheaterList, ZipForm } from '../components/Finder';
import { AAHelp, CodeCard, GoTicketSpice, JoinButton, LoginAlt, Upsell } from '../components/Action';
import { Chat } from '../components/Chrome';
import { Icon } from '../components/Icon';

export default function O7() {
  const phase = useFlow((s) => s.phase);
  const found = useFlow((s) => s.found);
  const pick = useFlow((s) => s.pick);
  const search = useFlow((s) => s.search);
  const choose = useFlow((s) => s.choose);
  const joined = useFlow((s) => s.joined);
  const tier = useTier();
  const [edit, setEdit] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [others, setOthers] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // the location guess: in production this comes from IP or the member's saved ZIP
  useEffect(() => { if (useFlow.getState().phase === 'idle') search(LOCATION_ZIP); }, [search]);
  // the nearest open showing is preselected, so the main button works without a choice
  useEffect(() => {
    if (phase !== 'results' || !found || useFlow.getState().pick) return;
    const t = bestMatch(found.theaters);
    const s = t && firstOpen(t);
    if (t && s) choose(t, s);
  }, [phase, found, choose]);
  useEffect(() => { if (joined) setReveal(true); }, [joined]);

  const go = () => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const t = pick?.t;
  const nearest = found && bestMatch(found.theaters);
  const isNearest = t && nearest && t.id === nearest.id;

  return (
    <>
      <Nav />
      <Hero
        action={
          <>
            <div className="hero-row"><button className="btn btn-w hero-btn" onClick={go}><Icon name="ticket" size={20} />Get Tickets</button><HeroTools /></div>
            <p className="hero-note">{nearest ? <>Closest screening: <b>{nearest.name}</b>, {nearest.miles} mi · {DATE.chip}</> : `Members-only screenings · ${DATE.long}`}</p>
          </>
        }
      />
      <ShowBody
        before={
          <section className="o7" ref={ref}>
            <div className="o7-top">
              <div>
                <p className="eyebrow red">One night in theaters</p>
                <h2 className="sec-h">{phase === 'far' ? 'No screening near you.' : 'Your closest showing.'}</h2>
              </div>
              <div className="o7-where">
                {edit ? (
                  <ZipForm variant="bar" cta="Update" locate={false} autoFocus onSearch={() => setEdit(false)} />
                ) : (
                  <p><Icon name="pin" size={17} />Near <b>{found?.place ?? '…'}</b><button className="link-btn" onClick={() => setEdit(true)}>Change</button></p>
                )}
              </div>
            </div>

            {phase === 'searching' && <Searching rows={1} />}
            {phase === 'far' && <Far />}
            {phase === 'results' && t && pick && (
              <div className="o7-card" key={t.id}>
                <div className="o7-info">
                  <p className="o7-dist">{isNearest ? 'Closest to you' : 'Your pick'} · {t.miles} miles<Status t={t} s={pick.s} /></p>
                  <h3>{t.name}</h3>
                  <p className="o7-addr">{t.address}, {t.city}</p>
                  <p className="serif o7-date">{DATE.long}</p>
                  <Showtimes t={t} />
                </div>
                <div className="o7-do">
                  {tier === 'aa' && !reveal && (
                    <>
                      <p className="o7-lead">{FREE_TICKETS} seats included with All Access</p>
                      <button className="btn btn-w block big" onClick={() => setReveal(true)}><Icon name="ticket" size={20} />Get my {FREE_TICKETS} free tickets</button>
                    </>
                  )}
                  {tier === 'aa' && reveal && (
                    <div className="o7-code">
                      {joined && <p className="act-welcome"><Icon name="check" size={16} />Welcome to All Access. We emailed this code too.</p>}
                      <CodeCard />
                      <GoTicketSpice />
                      <AAHelp />
                    </div>
                  )}
                  {tier === 'member' && (
                    <>
                      <p className="o7-lead">${TICKET_PRICE} per ticket for members</p>
                      <GoTicketSpice label="Buy tickets on TicketSpice" />
                      <Upsell />
                    </>
                  )}
                  {tier === 'guest' && (
                    <>
                      <p className="o7-lead">Members only. All Access includes {FREE_TICKETS} tickets.</p>
                      <JoinButton label={`Join All Access · ${FREE_TICKETS} tickets included`} />
                      <p className="disclosure">{DISCLOSURE}</p>
                      <LoginAlt />
                    </>
                  )}
                </div>
              </div>
            )}
            {phase === 'results' && found && (
              <div className="o7-more">
                <button className="more-btn wide" onClick={() => setOthers(!others)} aria-expanded={others}>
                  {others ? 'Hide other theaters' : `${found.theaters.length - 1} more theaters within ${RADIUS} miles`}<Icon name={others ? 'chevup' : 'chevdown'} size={16} />
                </button>
                {others && <TheaterList variant="rows" exclude={t?.id} />}
              </div>
            )}
          </section>
        }
      />
      <Chat />
    </>
  );
}

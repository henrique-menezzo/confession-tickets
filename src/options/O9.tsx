// 09 · Tickets page. Its own page for emails and ads (ZIP can ride in the link); the show page links to it.
import { useEffect, useState } from 'react';
import { ART, DATE, FAQ, RADIUS, THEATER_COUNT, isOut, type Theater } from '../data/data';
import { useFlow } from '../store';
import { Hero, HeroTools, Nav, ShowBody, Wordmark } from '../components/ShowPage';
import { Far, PickLine, Searching, Showtimes, Status, ZipForm } from '../components/Finder';
import { Action, Perk } from '../components/Action';
import { Chat } from '../components/Chrome';
import { Icon } from '../components/Icon';
import { GetTickets, HeroNote } from './O1';

function byCity(list: Theater[]) {
  const m = new Map<string, Theater[]>();
  for (const t of list) m.set(t.city, [...(m.get(t.city) ?? []), t]);
  return [...m.entries()];
}

function TicketsPage() {
  const phase = useFlow((s) => s.phase);
  const found = useFlow((s) => s.found);
  const pick = useFlow((s) => s.pick);
  const setPage = useFlow((s) => s.setPage);
  const search = useFlow((s) => s.search);
  const setChat = useFlow((s) => s.setChat);
  const [open, setOpen] = useState<number | null>(0);
  const [radius, setRadius] = useState(RADIUS);

  // lifecycle emails carry the ZIP: /confession/tickets?zip=37064
  useEffect(() => {
    const z = new URLSearchParams(location.search).get('zip');
    if (z && /^\d{5}$/.test(z) && useFlow.getState().phase === 'idle') search(z);
  }, [search]);

  return (
    <>
      <Nav solid />
      <main className="o9">
        <div className="o9-crumb">
          <button className="back-btn" onClick={() => setPage('show')}><Icon name="left" size={18} />Confession</button>
          <span className="o9-url">dailywire.com/confession/tickets</span>
        </div>
        <header className="o9-head">
          <img className="o9-poster" src={ART.poster} alt="" />
          <div className="o9-ht">
            <p className="eyebrow red">Members-only screenings</p>
            <h1>Confession in theaters</h1>
            <p className="serif o9-date">{DATE.long} · {THEATER_COUNT} theaters nationwide</p>
            <Perk />
          </div>
          <div className="o9-art"><img src={ART.wide} alt="" /><button className="hero-play sm" aria-label="Play trailer"><Icon name="play" size={20} /></button></div>
        </header>

        <div className="o9-search">
          <ZipForm variant="big" cta="Find theaters" />
          <div className="o9-radius" role="radiogroup" aria-label="Distance">
            <span>Within</span>
            {[25, 50, 100].map((r) => <button key={r} className={radius === r ? 'on' : ''} onClick={() => setRadius(r)}>{r} mi</button>)}
          </div>
        </div>

        <div className="o9-grid">
          <div className="o9-results">
            {phase === 'idle' && (
              <div className="o9-empty">
                <Wordmark className="o9-wm" />
                <p>Enter a ZIP code to see showtimes. Tickets for these private screenings are sold only on this page.</p>
              </div>
            )}
            {phase === 'searching' && <Searching rows={5} />}
            {phase === 'far' && <Far />}
            {phase === 'results' && found && (
              <>
                <p className="o9-count"><b>{found.theaters.length} theaters</b> within {radius} miles of <b>{found.place}</b></p>
                {byCity(found.theaters).map(([city, list]) => (
                  <div key={city} className="o9-city">
                    <h3>{city}</h3>
                    <ul className="tl tl-rows">
                      {list.map((t) => (
                        <li key={t.id} className={'tl-row' + (pick?.t.id === t.id ? ' on' : '') + (isOut(t) ? ' out' : '')}>
                          <div className="tl-mi"><b>{t.miles}</b><span>mi</span></div>
                          <div className="tl-main"><p className="tl-name">{t.name}<Status t={t} /></p><p className="tl-addr">{t.address}</p></div>
                          <Showtimes t={t} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </div>
          <aside className="o9-side">
            <div className="o9-card">
              {pick ? (
                <><PickLine /><Action /></>
              ) : (
                <div className="o9-wait">
                  <span className="o9-wait-ic"><Icon name="ticket" size={22} /></span>
                  <h3>Your tickets</h3>
                  <p>Pick a showtime and your tickets show up here.</p>
                </div>
              )}
            </div>
          </aside>
        </div>

        <section className="o9-faq">
          <h2 className="h2">Questions</h2>
          <div className="faq">
            {FAQ.map((f, i) => (
              <div key={f.q} className={'faq-i' + (open === i ? ' open' : '')}>
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>{f.q}<Icon name={open === i ? 'chevup' : 'chevdown'} size={18} /></button>
                {open === i && <p>{f.a}</p>}
              </div>
            ))}
          </div>
          <button className="btn btn-g" onClick={() => setChat(true)}><Icon name="chat" size={18} />Ask our assistant</button>
        </section>
      </main>
      <footer className="foot">
        <Wordmark className="foot-logo" />
        <p className="foot-fine">© Copyright 2026, The Daily Wire LLC · Terms · Privacy</p>
      </footer>
      <Chat />
    </>
  );
}

export default function O9() {
  const page = useFlow((s) => s.page);
  const setPage = useFlow((s) => s.setPage);
  if (page === 'tickets') return <TicketsPage />;
  return (
    <>
      <Nav />
      <Hero action={<><div className="hero-row"><GetTickets onClick={() => setPage('tickets')} /><HeroTools /></div><HeroNote /></>} />
      <ShowBody />
    </>
  );
}

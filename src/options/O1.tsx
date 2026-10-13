// 01 · Tickets section. A section under the hero; the picked row opens in place.
import { useRef } from 'react';
import { DATE, THEATER_COUNT } from '../data/data';
import { useFlow } from '../store';
import { Hero, HeroTools, Nav, ShowBody } from '../components/ShowPage';
import { Far, ListHead, Searching, TheaterList, ZipForm } from '../components/Finder';
import { Action, Perk } from '../components/Action';
import { Chat } from '../components/Chrome';
import { Icon } from '../components/Icon';

export function GetTickets({ onClick, label = 'Get Tickets' }: { onClick: () => void; label?: string }) {
  return <button className="btn btn-w hero-btn" onClick={onClick}><Icon name="ticket" size={20} />{label}</button>;
}

export function HeroNote() {
  return <p className="hero-note">Members-only screenings in {THEATER_COUNT} theaters · {DATE.long}</p>;
}

export default function O1() {
  const phase = useFlow((s) => s.phase);
  const ref = useRef<HTMLElement>(null);
  const go = () => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <>
      <Nav />
      <Hero action={<><div className="hero-row"><GetTickets onClick={go} /><HeroTools /></div><HeroNote /></>} />
      <ShowBody
        before={
          <section className="o1" ref={ref}>
            <div className="o1-head">
              <div className="o1-title">
                <p className="eyebrow red">One night in theaters</p>
                <h2 className="sec-h">See it first, on the big screen.</h2>
                <p className="serif o1-date">{DATE.long} · {THEATER_COUNT} theaters</p>
              </div>
              <div className="o1-search">
                <Perk />
                <ZipForm variant="fill" />
              </div>
            </div>
            {phase === 'searching' && <Searching />}
            {phase === 'results' && (
              <div className="o1-list">
                <ListHead />
                <TheaterList expand={<Action layout="wide" />} />
                <p className="o1-fine">Private screenings. Tickets are sold only here, not at the theater.</p>
              </div>
            )}
            {phase === 'far' && <Far />}
          </section>
        }
      />
      <Chat />
    </>
  );
}

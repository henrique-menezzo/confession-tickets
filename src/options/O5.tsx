// 05 · Build your ticket. A ticket fills in as you choose; All Access sees the code first.
import { useRef } from 'react';
import { ART, CODE, DATE, DISCLOSURE, FREE_TICKETS, THEATER_COUNT, TICKET_PRICE } from '../data/data';
import { useFlow, useTier } from '../store';
import { Hero, HeroTools, Nav, ShowBody } from '../components/ShowPage';
import { Far, ListHead, Searching, TheaterList, ZipForm } from '../components/Finder';
import { AAHelp, CodeCard, GoTicketSpice, JoinButton, LoginAlt, Upsell } from '../components/Action';
import { Chat } from '../components/Chrome';
import { Icon } from '../components/Icon';
import { GetTickets, HeroNote } from './O1';

function Field({ label, value, empty }: { label: string; value?: React.ReactNode; empty: string }) {
  return (
    <div className={'stub-f' + (value ? ' set' : '')}>
      <span className="stub-l">{label}</span>
      {value ? <span className="stub-v" key={String(value)}>{value}</span> : <span className="stub-e">{empty}</span>}
    </div>
  );
}

function Stub() {
  const tier = useTier();
  const pick = useFlow((s) => s.pick);
  const found = useFlow((s) => s.found);
  return (
    <div className={'stub' + (pick ? ' full' : '')}>
      <div className="stub-art">
        <img className="stub-poster" src={ART.poster} alt="" />
        <span className="stub-admit">{tier === 'aa' ? `Admit ${FREE_TICKETS}` : 'Members only'}</span>
      </div>
      <div className="stub-fields">
        <Field label="Date" value={DATE.long} empty="" />
        <Field label="Theater" value={pick?.t.name} empty={found ? 'Pick a theater' : 'Enter your ZIP'} />
        <div className="stub-row">
          <Field label="Time" value={pick && `${pick.s.time}`} empty="" />
          <Field label="Screen" value={pick?.s.format} empty="" />
          <Field label="Seats" value={tier === 'aa' ? `Up to ${FREE_TICKETS}, free` : tier === 'member' ? `$${TICKET_PRICE} each` : `${FREE_TICKETS} with All Access`} empty="" />
        </div>
      </div>
      <div className="stub-perf" aria-hidden />
      <div className="stub-code">
        {tier === 'aa' ? (
          <CodeCard size="sm" />
        ) : tier === 'member' ? (
          <p className="stub-pay"><Icon name="ticket" size={18} />Paid on TicketSpice at checkout</p>
        ) : (
          <div className="stub-locked"><span className="stub-blur" aria-hidden>{CODE}</span><p><Icon name="lock" size={16} />Your code unlocks with All Access</p></div>
        )}
      </div>
    </div>
  );
}

export default function O5() {
  const phase = useFlow((s) => s.phase);
  const pick = useFlow((s) => s.pick);
  const found = useFlow((s) => s.found);
  const clear = useFlow((s) => s.clearSearch);
  const tier = useTier();
  const joined = useFlow((s) => s.joined);
  const ref = useRef<HTMLElement>(null);
  const go = () => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const step = pick ? 3 : phase === 'idle' ? 1 : 2;

  return (
    <>
      <Nav />
      <Hero action={<><div className="hero-row"><GetTickets onClick={go} label={tier === 'aa' ? 'Claim Your Tickets' : 'Get Tickets'} /><HeroTools /></div><HeroNote /></>} />
      <ShowBody
        before={
          <section className="o5" ref={ref}>
            <div className="o5-left"><Stub /></div>
            <div className="o5-right">
              <p className="eyebrow red">One night in theaters · {THEATER_COUNT} theaters</p>
              <h2 className="sec-h">{tier === 'aa' ? (joined ? 'Welcome in. Your tickets are ready.' : `Your ${FREE_TICKETS} tickets are waiting.`) : tier === 'member' ? 'Your ticket to Confession.' : 'A members-only screening.'}</h2>

              <div className={'o5-step' + (step === 1 ? ' now' : ' past')}>
                <span className="o5-n">{step > 1 ? <Icon name="check" size={14} stroke={2.4} /> : 1}</span>
                <div className="o5-c">
                  <h3>Where are you watching?</h3>
                  {step === 1 ? <ZipForm variant="fill" /> : <p className="o5-sum">{found?.place ?? '…'}<button className="link-btn" onClick={clear}>Change</button></p>}
                </div>
              </div>

              <div className={'o5-step' + (step === 2 ? ' now' : step > 2 ? ' past' : '')}>
                <span className="o5-n">{step > 2 ? <Icon name="check" size={14} stroke={2.4} /> : 2}</span>
                <div className="o5-c">
                  <h3>Pick a showtime</h3>
                  {step === 2 && phase === 'searching' && <Searching rows={3} />}
                  {step === 2 && phase === 'results' && <><ListHead change={false} /><TheaterList variant="rows" limit={4} /></>}
                  {step === 2 && phase === 'far' && <Far compact />}
                  {step > 2 && pick && <p className="o5-sum">{pick.t.name} · {pick.s.time}<button className="link-btn" onClick={() => useFlow.getState().unpick()}>Change</button></p>}
                </div>
              </div>

              <div className={'o5-step last' + (step === 3 ? ' now' : '')}>
                <span className="o5-n">3</span>
                <div className="o5-c">
                  <h3>{tier === 'aa' ? 'Use your code' : tier === 'member' ? 'Buy your tickets' : 'Join to get your tickets'}</h3>
                  {step === 3 && tier === 'aa' && <div className="o5-do"><GoTicketSpice /><AAHelp /></div>}
                  {step === 3 && tier === 'member' && <div className="o5-do"><GoTicketSpice label="Buy tickets on TicketSpice" /><Upsell /></div>}
                  {step === 3 && tier === 'guest' && (
                    <div className="o5-do"><JoinButton label={`Join All Access · ${FREE_TICKETS} tickets included`} /><p className="disclosure">{DISCLOSURE}</p><LoginAlt /></div>
                  )}
                </div>
              </div>
            </div>
          </section>
        }
      />
      <Chat />
    </>
  );
}

// 03 · Side drawer. Three short steps in a panel from the right; the page stays in view.
import { useEffect, useState } from 'react';
import { ART, DATE } from '../data/data';
import { useFlow } from '../store';
import { Hero, HeroTools, Nav, ShowBody } from '../components/ShowPage';
import { Far, ListHead, PickLine, Searching, TheaterList, ZipForm } from '../components/Finder';
import { Action, Perk } from '../components/Action';
import { Chat } from '../components/Chrome';
import { Icon } from '../components/Icon';
import { GetTickets, HeroNote } from './O1';

export default function O3() {
  const [open, setOpen] = useState(false);
  const phase = useFlow((s) => s.phase);
  const pick = useFlow((s) => s.pick);
  const unpick = useFlow((s) => s.unpick);
  const clear = useFlow((s) => s.clearSearch);
  const setChat = useFlow((s) => s.setChat);
  const step = pick ? 3 : phase === 'idle' ? 1 : 2;

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && !useFlow.getState().checkout && setOpen(false);
    window.addEventListener('keydown', k);
    document.documentElement.classList.add('locked');
    return () => { window.removeEventListener('keydown', k); document.documentElement.classList.remove('locked'); };
  }, [open]);

  return (
    <>
      <Nav />
      <Hero action={<><div className="hero-row"><GetTickets onClick={() => setOpen(true)} /><HeroTools /></div><HeroNote /></>} />
      <ShowBody />
      <div className={'dr-back' + (open ? ' on' : '')} onClick={() => setOpen(false)} />
      <aside className={'dr' + (open ? ' on' : '')} aria-hidden={!open} role="dialog" aria-label="Get tickets">
        <header className="dr-h">
          {step > 1 ? (
            <button className="icon-btn" aria-label="Back" onClick={() => (step === 3 ? unpick() : clear())}><Icon name="left" size={20} /></button>
          ) : <span className="icon-btn ghost" />}
          <div className="dr-film">
            <img src={ART.poster} alt="" />
            <div><b>Confession</b><span>{DATE.chip} · Members-only</span></div>
          </div>
          <button className="icon-btn" aria-label="Close" onClick={() => setOpen(false)}><Icon name="x" size={20} /></button>
        </header>
        <ol className="dr-steps">
          {['Location', 'Theater', 'Tickets'].map((l, i) => <li key={l} className={i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}><span>{i + 1}</span>{l}</li>)}
        </ol>
        <div className="dr-body" key={step}>
          {step === 1 && (
            <>
              <h3 className="dr-q">Where are you watching?</h3>
              <Perk />
              <ZipForm variant="big" autoFocus={open} />
            </>
          )}
          {step === 2 && phase === 'searching' && <Searching rows={4} />}
          {step === 2 && phase === 'results' && <><ListHead /><TheaterList variant="compact" /></>}
          {step === 2 && phase === 'far' && <Far compact />}
          {step === 3 && <><PickLine /><Action /></>}
        </div>
        <footer className="dr-f">
          <button className="link-btn" onClick={() => setChat(true)}><Icon name="chat" size={17} />Questions about the screening? Ask our assistant</button>
        </footer>
      </aside>
      <div className="o3-chat"><Chat fab={false} /></div>
    </>
  );
}

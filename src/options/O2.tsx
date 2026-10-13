// 02 · Hero finder. The ZIP field replaces Get Notified; results open on the hero's dark side.
import { useFlow } from '../store';
import { Hero, HeroTools, Nav, ShowBody } from '../components/ShowPage';
import { Far, ListHead, PickLine, Searching, TheaterList, ZipForm } from '../components/Finder';
import { Action, Perk } from '../components/Action';
import { Chat } from '../components/Chrome';
import { Icon } from '../components/Icon';

export default function O2() {
  const phase = useFlow((s) => s.phase);
  const pick = useFlow((s) => s.pick);
  const unpick = useFlow((s) => s.unpick);
  const clear = useFlow((s) => s.clearSearch);
  const open = phase !== 'idle';

  const panel = open && (
    <aside className="o2-panel" key={pick ? 'pick' : phase}>
      <div className="o2-ph">
        {pick ? (
          <button className="back-btn" onClick={unpick}><Icon name="left" size={18} />All theaters</button>
        ) : (
          <p className="o2-pt">Showtimes</p>
        )}
        <button className="icon-btn" aria-label="Close" onClick={clear}><Icon name="x" size={18} /></button>
      </div>
      <div className="o2-pb">
        {phase === 'searching' && <Searching rows={4} />}
        {phase === 'results' && !pick && <><ListHead change={false} /><TheaterList variant="compact" /></>}
        {phase === 'far' && !pick && <Far compact />}
        {pick && <><PickLine change={false} /><Action /></>}
      </div>
    </aside>
  );

  return (
    <>
      <Nav />
      <Hero
        className={'o2' + (open ? ' open' : '')}
        aside={panel}
        action={
          <>
            <p className="o2-ask">Find a members-only screening near you</p>
            <div className="hero-row">
              <ZipForm variant="hero" cta="Find Showtimes" locate={false} />
              <HeroTools />
            </div>
            <div className="o2-under"><Perk className="bare" /></div>
          </>
        }
      />
      <ShowBody />
      {open && <Chat />}
    </>
  );
}

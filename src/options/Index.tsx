import { ART, DATE } from '../data/data';
import { Icon } from '../components/Icon';
import { Wordmark } from '../components/ShowPage';
import { useFlow, type User } from '../store';
import { NOTES, OPTIONS, QUESTIONS } from './meta';

// Little wireframes so the grid reads before the text does.
function Sketch({ n }: { n: number }) {
  const hero = <rect x="0" y="0" width="160" height="44" fill="#2a2827" />;
  const page = <><rect x="10" y="52" width="70" height="4" rx="1" fill="#2a2a2a" /><rect x="10" y="60" width="90" height="3" rx="1" fill="#222" /><rect x="10" y="66" width="80" height="3" rx="1" fill="#222" /></>;
  const W = '#f2f2f2', R = '#db3d3b', S = '#1e1e1e';
  const shapes: Record<number, React.ReactNode> = {
    1: <>{hero}<rect x="10" y="50" width="140" height="44" fill={S} rx="2" /><rect x="16" y="56" width="60" height="5" fill={W} rx="1" /><rect x="16" y="66" width="128" height="7" fill="#262626" rx="1" /><rect x="16" y="75" width="128" height="14" fill="#2e2e2e" rx="1" /><rect x="118" y="79" width="22" height="6" fill={W} rx="1" /></>,
    2: <>{hero}<rect x="0" y="0" width="160" height="80" fill="#2a2827" /><rect x="96" y="8" width="56" height="66" fill="#121212" rx="2" /><rect x="101" y="14" width="40" height="4" fill={W} rx="1" /><rect x="101" y="24" width="46" height="9" fill="#232323" rx="1" /><rect x="101" y="36" width="46" height="9" fill="#232323" rx="1" /><rect x="8" y="62" width="44" height="7" fill="none" stroke="#fff" strokeWidth=".8" /><rect x="52" y="62" width="18" height="7" fill={W} /></>,
    3: <>{hero}{page}<rect x="0" y="0" width="160" height="100" fill="#000" opacity=".45" /><rect x="98" y="0" width="62" height="100" fill="#151515" /><rect x="104" y="8" width="30" height="4" fill={W} rx="1" /><rect x="104" y="18" width="50" height="10" fill="#242424" rx="1" /><rect x="104" y="31" width="50" height="10" fill="#242424" rx="1" /><rect x="104" y="86" width="50" height="8" fill={W} rx="1" /></>,
    4: <>{hero}{page}<rect x="0" y="0" width="160" height="100" fill="#000" opacity=".55" /><rect x="50" y="10" width="60" height="82" fill="#191919" rx="2" /><rect x="70" y="16" width="20" height="2" fill={W} /><rect x="58" y="24" width="44" height="4" fill={W} rx="1" /><rect x="56" y="34" width="14" height="22" fill="#242424" rx="1" /><rect x="73" y="34" width="14" height="22" fill="#242424" rx="1" /><rect x="90" y="34" width="14" height="22" fill="#242424" rx="1" stroke="#fff" strokeWidth=".7" /><rect x="56" y="80" width="48" height="7" fill={W} rx="1" /></>,
    5: <>{hero}<rect x="10" y="50" width="62" height="46" fill="#1f1c1c" rx="3" /><rect x="10" y="50" width="62" height="12" fill="#3a2a2a" rx="3" /><rect x="10" y="60" width="62" height="5" fill={R} /><rect x="16" y="70" width="34" height="3" fill={W} rx="1" /><rect x="16" y="76" width="24" height="3" fill="#777" rx="1" /><rect x="16" y="86" width="50" height="6" fill="#0c0c0c" rx="1" /><rect x="82" y="50" width="68" height="10" fill={S} rx="1" /><rect x="82" y="63" width="68" height="10" fill={S} rx="1" /><rect x="82" y="76" width="68" height="10" fill={S} rx="1" /></>,
    6: <>{hero}<rect x="10" y="50" width="140" height="46" fill="#121212" rx="2" />{Array.from({ length: 70 }, (_, i) => <circle key={i} cx={22 + (i % 14) * 8.5} cy={56 + Math.floor(i / 14) * 8} r="1.6" fill={[17, 23, 30, 38, 45, 52, 60].includes(i) ? W : '#2b2b2b'} />)}<circle cx="80" cy="72" r="16" fill="none" stroke={R} strokeWidth=".7" strokeDasharray="2 2" /></>,
    7: <>{hero}<rect x="10" y="50" width="140" height="34" fill={S} rx="2" /><rect x="16" y="56" width="50" height="6" fill={W} rx="1" /><rect x="16" y="66" width="34" height="3" fill="#666" rx="1" /><rect x="112" y="60" width="32" height="10" fill={W} rx="1" /><rect x="10" y="88" width="140" height="5" fill="#1a1a1a" rx="1" /></>,
    8: <>{hero}{page}<rect x="96" y="22" width="58" height="74" fill="#151515" rx="3" /><rect x="101" y="30" width="38" height="8" fill="#262626" rx="3" /><rect x="114" y="42" width="34" height="7" fill={W} rx="3" /><rect x="101" y="53" width="44" height="18" fill="#262626" rx="3" /><rect x="101" y="84" width="48" height="7" fill="#222" rx="3" /></>,
    9: <><rect x="0" y="0" width="160" height="8" fill="#111" /><rect x="10" y="14" width="14" height="22" fill="#3a2020" rx="1" /><rect x="28" y="18" width="50" height="6" fill={W} rx="1" /><rect x="28" y="28" width="36" height="3" fill="#666" rx="1" /><rect x="10" y="42" width="140" height="9" fill={S} rx="1" /><rect x="10" y="56" width="92" height="10" fill={S} rx="1" /><rect x="10" y="69" width="92" height="10" fill={S} rx="1" /><rect x="10" y="82" width="92" height="10" fill={S} rx="1" /><rect x="108" y="56" width="42" height="36" fill="#1a1a1a" rx="1" /><rect x="112" y="82" width="34" height="6" fill={W} rx="1" /></>,
    10: <>{hero}{page}<rect x="0" y="86" width="160" height="14" fill="#161616" /><rect x="6" y="89" width="6" height="8" fill="#3a2020" /><rect x="16" y="90" width="40" height="3" fill={W} rx="1" /><rect x="104" y="89" width="34" height="8" fill="#262626" rx="1" /><rect x="138" y="89" width="16" height="8" fill={W} rx="1" /></>,
  };
  return <svg viewBox="0 0 160 100" className="sketch" aria-hidden>{shapes[n]}</svg>;
}

const USERS: [User, string][] = [['guest', 'Not a member'], ['member', 'DW+ member'], ['aa', 'All Access']];

export default function Index() {
  const setOpt = useFlow((s) => s.setOpt);
  const user = useFlow((s) => s.user);
  const setUser = useFlow((s) => s.setUser);
  return (
    <main className="ix">
      <header className="ix-top">
        <Wordmark className="ix-logo" />
        <span>Confession · theatrical tickets</span>
      </header>
      <section className="ix-hero">
        <img className="ix-art" src={ART.title} alt="Confession" />
        <h1>Ten ways to get from the show page to a seat.</h1>
        <p>Each option is the whole experience, from the Confession page to TicketSpice: search, sold-out showings, nothing nearby, All Access code, member purchase and the plan for visitors. Members-only screenings on {DATE.long}, web only.</p>
        <div className="ix-view">
          <span>View as</span>
          <div className="proto-seg">
            {USERS.map(([u, l]) => <button key={u} className={user === u ? 'on' : ''} onClick={() => setUser(u)}>{l}</button>)}
          </div>
        </div>
      </section>
      <section className="ix-grid">
        {OPTIONS.map((o, i) => (
          <button key={o.name} className="ix-card" onClick={() => setOpt(i + 1)}>
            <Sketch n={i + 1} />
            <div className="ix-card-t">
              <span className="ix-n">{String(i + 1).padStart(2, '0')}</span>
              <span className={'ix-kind' + (o.modal ? ' m' : '')}>{o.kind}</span>
            </div>
            <h2>{o.name}</h2>
            <p>{o.desc}</p>
            <p className="ix-why">{o.why}</p>
            <span className="ix-open">Open<Icon name="right" size={15} /></span>
          </button>
        ))}
      </section>
      <section className="ix-notes">
        <div>
          <h2>What changed from the first build</h2>
          <ul>{NOTES.map(([b, t]) => <li key={b}><b>{b}</b> {t}</li>)}</ul>
        </div>
        <div>
          <h2>Still open</h2>
          <ul>{QUESTIONS.map((q) => <li key={q}>{q}</li>)}</ul>
          <p className="ix-fine">Theaters, prices and the plan are placeholders until the inventory sheet and the promo plan are final. Film art is pulled live from the DailyWire+ image CDN.</p>
        </div>
      </section>
    </main>
  );
}

// 06 · Theater map. The country first (scale), then a local map with the 50-mile circle.
import { useMemo, useRef, useState } from 'react';
import dots from '../data/dots.json';
import { RADIUS, THEATER_COUNT, firstOpen, isOut, type Theater } from '../data/data';
import { useFlow } from '../store';
import { Hero, HeroTools, Nav, ShowBody } from '../components/ShowPage';
import { Far, PickLine, Searching, Showtimes, Status, ZipForm } from '../components/Finder';
import { Action, Perk } from '../components/Action';
import { Chat } from '../components/Chrome';
import { Icon } from '../components/Icon';
import { GetTickets, HeroNote } from './O1';

const D = dots as unknown as { pitch: number; states: Record<string, [number, number][]> };
// Where the 100 placeholder theaters sit, roughly by population. Nothing in MT, WY, the Dakotas.
const SPREAD: Record<string, number> = {
  CA: 9, TX: 9, FL: 7, NY: 4, PA: 4, OH: 4, IL: 4, GA: 4, NC: 4, TN: 6, MI: 3, VA: 3, AZ: 3, CO: 3,
  WA: 2, IN: 2, MO: 2, AL: 2, SC: 2, KY: 2, OK: 2, LA: 2, MN: 2, WI: 2, UT: 2, NJ: 2,
  NV: 1, OR: 1, AR: 1, MS: 1, KS: 1, IA: 1, NE: 1, NM: 1, MD: 1,
};

function UsDots() {
  const { all, lit, vb } = useMemo(() => {
    const p = D.pitch;
    const all: [number, number][] = [];
    const lit: [number, number][] = [];
    let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
    for (const [st, cells] of Object.entries(D.states)) {
      const sorted = [...cells].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
      const n = SPREAD[st] ?? 0;
      const pickIdx = new Set(Array.from({ length: n }, (_, i) => Math.floor(((i + 0.5) * sorted.length) / n)));
      sorted.forEach(([c, r], i) => {
        const x = (c + 0.5) * p, y = (r + 0.5) * p;
        minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
        (pickIdx.has(i) ? lit : all).push([x, y]);
      });
    }
    const m = p;
    return { all, lit, vb: `${minX - m} ${minY - m} ${maxX - minX + 2 * m} ${maxY - minY + 2 * m}` };
  }, []);
  return (
    <svg className="usdots" viewBox={vb} role="img" aria-label={`${THEATER_COUNT} theaters across the country`}>
      {all.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} className="ud" />)}
      {lit.map(([x, y], i) => <circle key={'l' + i} cx={x} cy={y} r={4.4} className="ud lit" style={{ ['--i' as string]: i }} />)}
    </svg>
  );
}

function Radar({ list, hover, setHover }: { list: Theater[]; hover: string | null; setHover: (id: string | null) => void }) {
  const found = useFlow((s) => s.found);
  const pick = useFlow((s) => s.pick);
  const choose = useFlow((s) => s.choose);
  const far = !!found?.nearest && !found.theaters.length;
  const max = far ? 160 : 56;
  const rings = far ? [100, 150] : [10, 25];
  const R = 250;
  const k = R / max;
  const pos = (t: Theater) => {
    const a = (t.bearing * Math.PI) / 180;
    return [Math.sin(a) * t.miles * k, -Math.cos(a) * t.miles * k];
  };
  const sel = pick?.t;
  return (
    <svg className="radar" viewBox="-300 -300 600 600" role="img" aria-label="Theaters around your ZIP">
      {rings.map((m) => (
        <g key={m}>
          <circle r={m * k} className="ring" />
          <text x={m * k * 0.707 + 6} y={-m * k * 0.707 - 4} className="ring-t">{m} mi</text>
        </g>
      ))}
      <circle r={RADIUS * k} className="ring rule" />
      <text x={0} y={-RADIUS * k - 10} className="ring-t rule" textAnchor="middle">{RADIUS}-mile screening area</text>
      {sel && (() => { const [x, y] = pos(sel); return <line x1={0} y1={0} x2={x} y2={y} className="ray" />; })()}
      <circle r={22} className="you-pulse" />
      <circle r={6} className="you" />
      <text y={26} className="you-t" textAnchor="middle">{found?.place}</text>
      {list.map((t) => {
        const [x, y] = pos(t);
        const on = sel?.id === t.id;
        const hot = hover === t.id || on || far;
        const out = isOut(t);
        const few = t.shows.some((s) => s.status === 'few');
        return (
          <g
            key={t.id}
            className={'pin' + (out ? ' out' : few ? ' few' : '') + (hot ? ' hot' : '')}
            transform={`translate(${x} ${y})`}
            onMouseEnter={() => setHover(t.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => { const s = firstOpen(t); if (s) choose(t, s); }}
          >
            <circle r={hot ? 11 : 8} />
            {hot && <text x={16} y={4} className="pin-t">{t.name}{out ? ' · Sold out' : ''}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export default function O6() {
  const phase = useFlow((s) => s.phase);
  const found = useFlow((s) => s.found);
  const pick = useFlow((s) => s.pick);
  const unpick = useFlow((s) => s.unpick);
  const clear = useFlow((s) => s.clearSearch);
  const [hover, setHover] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const go = () => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const list = found ? (found.theaters.length ? found.theaters : found.nearest ? [found.nearest] : []) : [];

  return (
    <>
      <Nav />
      <Hero action={<><div className="hero-row"><GetTickets onClick={go} /><HeroTools /></div><HeroNote /></>} />
      <ShowBody
        before={
          <section className="o6" ref={ref}>
            <div className="o6-side">
              {phase === 'idle' && (
                <>
                  <p className="eyebrow red">One night · {THEATER_COUNT} theaters</p>
                  <h2 className="sec-h">Find your theater.</h2>
                  <Perk />
                  <ZipForm variant="fill" />
                </>
              )}
              {phase === 'searching' && <Searching rows={4} />}
              {phase === 'results' && !pick && found && (
                <>
                  <div className="o6-head">
                    <p><b>{found.theaters.length} theaters</b> near {found.place}</p>
                    <button className="link-btn" onClick={clear}><Icon name="edit" size={15} />Change</button>
                  </div>
                  <ul className="tl tl-compact o6-list">
                    {found.theaters.map((t) => (
                      <li key={t.id} className={'tl-row' + (isOut(t) ? ' out' : '') + (hover === t.id ? ' hover' : '')} onMouseEnter={() => setHover(t.id)} onMouseLeave={() => setHover(null)}>
                        <div className="tl-mi"><b>{t.miles}</b><span>mi</span></div>
                        <div className="tl-main"><p className="tl-name">{t.name}<Status t={t} /></p><p className="tl-addr">{t.address}, {t.city}</p></div>
                        <Showtimes t={t} size="sm" />
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {phase === 'far' && !pick && <Far compact />}
              {pick && (
                <div className="o6-pick">
                  <button className="back-btn" onClick={unpick}><Icon name="left" size={18} />All theaters</button>
                  <PickLine change={false} />
                  <Action />
                </div>
              )}
            </div>
            <div className={'o6-map' + (phase === 'results' || phase === 'far' ? ' grid' : '')}>
              {phase === 'idle' || phase === 'searching' ? (
                <>
                  <UsDots />
                  <p className="o6-legend"><i />Participating theater<span>No public listings. These screenings are only on this page.</span></p>
                </>
              ) : (
                <Radar list={list} hover={hover} setHover={setHover} />
              )}
            </div>
          </section>
        }
      />
      <Chat />
    </>
  );
}

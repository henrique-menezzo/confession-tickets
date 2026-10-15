// The pieces every option shares: ZIP search, the theater list, showtimes, the searching and
// nothing-nearby states. Options arrange them; the rules about what is sold out live here once.
import { useEffect, useRef, useState } from 'react';
import { DATE, LOCATION_ZIP, RADIUS, isOut, type Show, type Theater } from '../data/data';
import { useFlow, useTier } from '../store';
import { Icon } from './Icon';

type ZipVariant = 'hero' | 'fill' | 'big' | 'bar' | 'chat' | 'line';

/** `suggest`: no location link at rest; it shows up under the field while the empty field has focus. */
export function ZipForm({ variant = 'fill', cta = 'Find theaters', locate = true, suggest = false, autoFocus = false, onSearch }: { variant?: ZipVariant; cta?: string; locate?: boolean; suggest?: boolean; autoFocus?: boolean; onSearch?: () => void }) {
  const zip = useFlow((s) => s.zip);
  const search = useFlow((s) => s.search);
  const doLocate = useFlow((s) => s.locate);
  const [v, setV] = useState(zip);
  const [err, setErr] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => setV(zip), [zip]);
  useEffect(() => { if (autoFocus) ref.current?.focus({ preventScroll: true }); }, [autoFocus]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(v)) { setErr('Enter a 5-digit ZIP code'); ref.current?.focus(); return; }
    setErr('');
    search(v);
    onSearch?.();
  };
  const pickLocation = () => { setV(LOCATION_ZIP); setOpen(false); setErr(''); doLocate(); onSearch?.(); };
  return (
    <div
      className={'zip zip-' + variant}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
    >
      <form className="zip-form" onSubmit={submit} noValidate>
        <label className="zip-field">
          <Icon name="pin" size={variant === 'bar' ? 18 : 20} />
          <input
            ref={ref}
            value={v}
            onChange={(e) => { setV(e.target.value.replace(/\D/g, '').slice(0, 5)); setErr(''); }}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="ZIP code"
            aria-label="ZIP code"
            aria-invalid={!!err}
            onFocus={() => suggest && setOpen(true)}
            onClick={() => suggest && setOpen(true)}
          />
        </label>
        <button className="zip-go" type="submit">{cta}{variant !== 'chat' && <Icon name="right" size={16} />}{variant === 'chat' && <Icon name="send" size={18} />}</button>
      </form>
      {suggest && open && !v && (
        <div className="zip-suggest">
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={pickLocation}>
            <Icon name="locate" size={18} />Use my current location
          </button>
        </div>
      )}
      {(locate || err) && (
        <div className="zip-under">
          {err ? <span className="zip-err">{err}</span> : (
            <button className="zip-loc" type="button" onClick={pickLocation}>
              <Icon name="locate" size={16} />Use my location
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function Status({ t, s }: { t: Theater; s?: Show }) {
  if (s ? s.status === 'out' : isOut(t)) return <span className="tag out">Sold out</span>;
  if (s ? s.status === 'few' : t.shows.some((x) => x.status === 'few')) return <span className="tag few">Few seats left</span>;
  return null;
}

export function Showtimes({ t, size = 'md' }: { t: Theater; size?: 'sm' | 'md' }) {
  const pick = useFlow((s) => s.pick);
  const choose = useFlow((s) => s.choose);
  return (
    <div className={'times times-' + size}>
      {t.shows.map((s) => {
        const on = pick?.s.id === s.id;
        const out = s.status === 'out';
        return (
          <button key={s.id} className={'time' + (on ? ' on' : '') + (out ? ' out' : '') + (s.status === 'few' ? ' few' : '')} disabled={out} onClick={() => choose(t, s)} aria-pressed={on}>
            <span className="time-t">{s.time}</span>
            <span className="time-f">{out ? 'Sold out' : s.format}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ListHead({ change = true }: { change?: boolean }) {
  const found = useFlow((s) => s.found);
  const clear = useFlow((s) => s.clearSearch);
  if (!found) return null;
  const n = found.theaters.length;
  return (
    <div className="list-head">
      <p><b>{n} theaters</b> within {RADIUS} miles of <b>{found.place}</b></p>
      {change && <button className="link-btn" onClick={clear}><Icon name="edit" size={15} />Change</button>}
    </div>
  );
}

/** Theater rows. `expand` renders something under the picked row (the inline option). */
export function TheaterList({ variant = 'rows', expand, limit, onPick, exclude }: { variant?: 'rows' | 'tiles' | 'compact'; expand?: React.ReactNode; limit?: number; onPick?: (t: Theater) => void; exclude?: string }) {
  const found = useFlow((s) => s.found);
  const pick = useFlow((s) => s.pick);
  const [more, setMore] = useState(false);
  if (!found) return null;
  const all = exclude ? found.theaters.filter((t) => t.id !== exclude) : found.theaters;
  const list = limit && !more ? all.slice(0, limit) : all;
  return (
    <>
      <ul className={'tl tl-' + variant}>
        {list.map((t) => {
          const on = pick?.t.id === t.id;
          const out = isOut(t);
          return (
            <li key={t.id} className={'tl-row' + (on ? ' on' : '') + (out ? ' out' : '')} onClick={onPick && !out ? () => onPick(t) : undefined}>
              <div className="tl-mi"><b>{t.miles}</b><span>mi</span></div>
              <div className="tl-main">
                <p className="tl-name">{t.name}<Status t={t} /></p>
                <p className="tl-addr">{t.address}, {t.city}</p>
              </div>
              {!onPick && <Showtimes t={t} size={variant === 'compact' ? 'sm' : 'md'} />}
              {onPick && !out && <Icon name="next" size={18} className="tl-go" />}
              {on && expand && <div className="tl-expand" onClick={(e) => e.stopPropagation()}>{expand}</div>}
            </li>
          );
        })}
      </ul>
      {limit && all.length > limit && !more && (
        <button className="more-btn" onClick={() => setMore(true)}>Show {all.length - limit} more theaters<Icon name="chevdown" size={16} /></button>
      )}
    </>
  );
}

export function Searching({ rows = 3 }: { rows?: number }) {
  const zip = useFlow((s) => s.zip);
  return (
    <div className="searching" aria-live="polite">
      <p className="searching-t"><span className="spin" />Finding theaters near {zip}</p>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="sk-row"><i className="sk a" /><div><i className="sk b" /><i className="sk c" /></div><i className="sk d" /></div>
      ))}
    </div>
  );
}

/** Nothing inside the radius. Honest copy: it is not sold out, there is simply no screening near. */
export function Far({ compact = false }: { compact?: boolean }) {
  const found = useFlow((s) => s.found);
  const tier = useTier();
  const choose = useFlow((s) => s.choose);
  const openCheckout = useFlow((s) => s.openCheckout);
  const say = useFlow((s) => s.say);
  const clear = useFlow((s) => s.clearSearch);
  const [show, setShow] = useState(false);
  if (!found?.nearest) return null;
  const n = found.nearest;
  return (
    <div className={'far' + (compact ? ' compact' : '')}>
      <span className="far-ic"><Icon name="pin" size={22} /></span>
      <h3>No screenings near {found.place}</h3>
      <p>The closest one is <b>{n.name}</b> in {n.city}, {n.miles} miles away.</p>
      {show ? (
        <div className="far-near">
          <div className="far-near-t"><b>{n.name}</b><span>{n.address}, {n.city}</span></div>
          <button className="btn btn-w sm" onClick={() => choose(n, n.shows[0])}>{DATE.chip} · {n.shows[0].time}<Icon name="right" size={15} /></button>
        </div>
      ) : (
        <div className="far-acts">
          {tier === 'guest' ? (
            <>
              <button className="btn btn-w" onClick={() => openCheckout('stream')}>Stream it on DailyWire+</button>
              <button className="btn btn-g" onClick={() => setShow(true)}>See the {n.miles}-mile option</button>
            </>
          ) : (
            <>
              <button className="btn btn-w" onClick={() => say('We’ll email you the day Confession streams on DailyWire+.')}><Icon name="bell" size={17} />Tell me when it streams</button>
              <button className="btn btn-g" onClick={() => setShow(true)}>See the {n.miles}-mile option</button>
            </>
          )}
        </div>
      )}
      <button className="link-btn far-try" onClick={clear}>Try another ZIP</button>
    </div>
  );
}

export function PickLine({ change = true }: { change?: boolean }) {
  const pick = useFlow((s) => s.pick);
  const unpick = useFlow((s) => s.unpick);
  if (!pick) return null;
  return (
    <div className="pickline">
      <div>
        <p className="pickline-n">{pick.t.name}</p>
        <p className="pickline-d">{DATE.chip} · {pick.s.time} · {pick.s.format} · {pick.t.miles} mi</p>
      </div>
      {change && <button className="link-btn" onClick={unpick}>Change</button>}
    </div>
  );
}

// Ten ways to lay out the whole "Find a theater near you" block. Same content and meaning in all of
// them (title, what and when, ZIP search, the list, showtimes, seats, the action); each one is a web
// and a phone version of the same idea. 1 is the current layout and lives in O11.
import type { ReactNode } from 'react';
import { DATE, RADIUS, isOut, type Theater } from '../data/data';
import { useFlow, useTier } from '../store';
import { ZipForm } from '../components/Finder';
import { Icon } from '../components/Icon';
import { openTickets } from './TicketModal';

export type FV = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export const FV_NAMES: Record<FV, string> = {
  1: 'Current', 2: 'Timetable', 3: 'By city', 4: 'One line', 5: 'Tiles',
  6: 'Search first', 7: 'Time chips', 8: 'Closest first', 9: 'Distance bar', 10: 'Listing',
};

// ── shared bits ───────────────────────────────────────────────────────────────────────────────
const few = (t: Theater) => !isOut(t) && t.shows.some((s) => s.status === 'few');

export function Times({ t, chips = false, stacked = false }: { t: Theater; chips?: boolean; stacked?: boolean }) {
  return (
    <span className={'fv-times' + (chips ? ' chips' : '') + (stacked ? ' stacked' : '')}>
      {t.shows.map((s) => (
        <span key={s.id} className={'fv-t' + (s.status === 'out' ? ' gone' : '')}>
          {s.time}{s.format !== 'Standard' && <em> {s.format}</em>}
        </span>
      ))}
    </span>
  );
}

export function Go({ t, size = '' }: { t: Theater; size?: '' | 'sm' | 'block' }) {
  const tier = useTier();
  if (isOut(t)) return <span className="fv-out">Sold out</span>;
  return (
    <button className={'btn btn-w fv-go' + (size ? ' ' + size : '')} onClick={() => openTickets(t)}>
      {tier === 'aa' ? 'Claim tickets' : 'Get tickets'}
    </button>
  );
}

const Few = ({ t }: { t: Theater }) => (few(t) ? <span className="fv-few"><i />Few seats left</span> : null);
const where = (t: Theater, near: boolean) => (near ? `${t.city} · ${t.miles} mi` : t.city);

// ── header ────────────────────────────────────────────────────────────────────────────────────
export function Head({ fv }: { fv: FV }) {
  const release = useFlow((s) => s.release);
  const title = release === 'day' ? 'Find a theater for tonight' : 'Find a theater near you';
  const when = release === 'day' ? 'Tonight' : DATE.long;
  const lede = release === 'day'
    ? 'Confession screens tonight in 100 theaters for DailyWire+ members, and on DailyWire+ the same night. '
    : `Confession screens in 100 theaters nationwide on ${DATE.long} for DailyWire+ members. `;
  const search = (big = false) => (
    <div className={'f11-search' + (big ? ' big' : '')}><ZipForm variant="line" cta="Find theaters" locate={false} locateIcon auto iconGo /></div>
  );

  if (fv === 4)
    return (
      <>
        <div className="fvh fvh4">
          <h2 className="fvh-t">{title}</h2>
          <p className="fvh-meta">Members only · 100 theaters · {when}</p>
        </div>
        {search()}
      </>
    );
  if (fv === 6)
    return (
      <>
        <div className="fvh fvh6">
          <p className="fvh-eye">Members only · 100 theaters · {when}</p>
          <h2 className="fvh-t">{title}</h2>
        </div>
        {search(true)}
        <p className="fvh6-note">Enter your ZIP code for the closest showings, then claim your seats.</p>
      </>
    );
  if (fv === 8)
    return (
      <>
        <div className="fvh fvh8">
          <p className="fvh-eye red">One night · {when}</p>
          <h2 className="fvh-t">{title}</h2>
          <p className="fvh-p">100 theaters, members only. Enter your ZIP code to see the closest showings and claim your seats before they’re gone.</p>
        </div>
        {search()}
      </>
    );
  if (fv === 10)
    return (
      <>
        <div className="fvh fvh10">
          <h2 className="fvh-t serif">{title}</h2>
          <p className="fvh-p"><span className="f11-intro-a">{lede}</span>Enter your ZIP code to see the closest showings and claim your seats before they’re gone.</p>
        </div>
        {search()}
      </>
    );
  return (
    <>
      <div className="f11-head">
        <h2 className="f11-h">{title}</h2>
        <p className="f11-intro"><span className="f11-intro-a">{lede}</span>Enter your ZIP code to see the closest showings and claim your seats before they’re gone.</p>
      </div>
      {search()}
    </>
  );
}

// ── rows ──────────────────────────────────────────────────────────────────────────────────────
type RowsProps = { fv: FV; list: Theater[]; near: boolean; closestId?: string; lateFrom: number };
const delay = (i: number, from: number) => (i >= from ? { animationDelay: `${(i - from) * 60}ms` } : undefined);

export function Rows({ fv, list, near, closestId, lateFrom }: RowsProps): ReactNode {
  const late = (i: number) => (i >= lateFrom ? ' late' : '');

  // 2 · Timetable: columns you can scan down; miles lead each row
  if (fv === 2)
    return (
      <ul className="fv-list fv2">
        <li className="fv2-cols" aria-hidden><span>{near ? 'Miles' : ''}</span><span>Theater</span><span>Showtimes</span><span /></li>
        {list.map((t, i) => (
          <li key={t.id} className={'fv-row fv2-row' + (isOut(t) ? ' out' : '') + late(i)} style={delay(i, lateFrom)}>
            <span className="fv2-mi">{near ? <><b>{t.miles}</b><small>mi</small></> : <Icon name="pin" size={18} />}</span>
            <div className="fv2-th"><p className="fv-nm">{t.name}</p><p className="fv-sub">{t.city}</p><Few t={t} /></div>
            <div className="fv2-tm"><Times t={t} stacked /></div>
            <Go t={t} />
          </li>
        ))}
      </ul>
    );

  // 3 · By city: the list reads like a cinema listing, grouped under each town
  if (fv === 3) {
    const groups = new Map<string, Theater[]>();
    list.forEach((t) => groups.set(t.city, [...(groups.get(t.city) ?? []), t]));
    let n = 0;
    return (
      <div className="fv-list fv3">
        {[...groups.entries()].map(([city, ts]) => (
          <section key={city} className="fv3-g">
            <p className="fv3-city">{city}{near && <span>{ts[0].miles} mi</span>}</p>
            <ul>
              {ts.map((t) => {
                const i = n++;
                return (
                  <li key={t.id} className={'fv-row fv3-row' + (isOut(t) ? ' out' : '') + late(i)} style={delay(i, lateFrom)}>
                    <div className="fv3-info"><p className="fv-nm">{t.name}</p><p className="fv-line"><Times t={t} /><Few t={t} /></p></div>
                    <Go t={t} />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  // 4 · One line: everything on a single line on the web, two on the phone
  if (fv === 4)
    return (
      <ul className="fv-list fv4">
        {list.map((t, i) => (
          <li key={t.id} className={'fv-row fv4-row' + (isOut(t) ? ' out' : '') + late(i)} style={delay(i, lateFrom)}>
            <p className="fv4-a"><b className="fv-nm">{t.name}</b><span className="fv-sub">{where(t, near)}</span></p>
            <p className="fv4-b"><Times t={t} /><Few t={t} /></p>
            <Go t={t} size="sm" />
          </li>
        ))}
      </ul>
    );

  // 5 · Tiles: each theater is its own object
  if (fv === 5)
    return (
      <ul className="fv-list fv5">
        {list.map((t, i) => (
          <li key={t.id} className={'fv5-tile' + (isOut(t) ? ' out' : '') + late(i)} style={delay(i, lateFrom)}>
            <p className="fv-eye">{near ? `${t.miles} mi · ${t.city}` : t.city}</p>
            <p className="fv-nm big">{t.name}</p>
            <p className="fv-line"><Times t={t} /></p>
            <Few t={t} />
            <div className="fv5-go"><Go t={t} size="block" /></div>
          </li>
        ))}
      </ul>
    );

  // 7 · Time chips: showtimes as small labels you can read at a glance
  if (fv === 7)
    return (
      <ul className="fv-list fv7">
        {list.map((t, i) => (
          <li key={t.id} className={'fv-row fv7-row' + (isOut(t) ? ' out' : '') + late(i)} style={delay(i, lateFrom)}>
            <div className="fv7-info">
              <p className="fv7-top"><span className="fv-nm">{t.name}</span>{near && <span className="fv7-mi">{t.miles} mi</span>}</p>
              <p className="fv-sub">{t.city}</p>
              <p className="fv7-chips"><Times t={t} chips /><Few t={t} /></p>
            </div>
            <Go t={t} />
          </li>
        ))}
      </ul>
    );

  // 8 · Closest first: the nearest open theater gets the room, the rest follow quietly
  if (fv === 8) {
    const lead = near ? list.find((t) => t.id === closestId) : undefined;
    const rest = lead ? list.filter((t) => t !== lead) : list;
    return (
      <div className="fv-list fv8">
        {lead && (
          <div className="fv8-lead">
            <p className="fv-eye"><b>Closest to you</b> · {lead.miles} mi · {lead.city}</p>
            <p className="fv8-nm">{lead.name}</p>
            <p className="fv-sub">{lead.address}</p>
            <p className="fv8-times"><Times t={lead} /><Few t={lead} /></p>
            <div className="fv8-go"><Go t={lead} /></div>
          </div>
        )}
        {lead && <p className="fv8-more">More theaters nearby</p>}
        <ul className="fv8-list">
          {rest.map((t, i) => (
            <li key={t.id} className={'fv-row fv8-row' + (isOut(t) ? ' out' : '') + late(i + 1)} style={delay(i + 1, lateFrom)}>
              <div><p className="fv-nm">{t.name}</p><p className="fv-line"><span className="fv-sub">{where(t, near)}</span><Times t={t} /><Few t={t} /></p></div>
              <Go t={t} size="sm" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 9 · Distance bar: how far, drawn against the 50-mile screening area
  if (fv === 9)
    return (
      <ul className="fv-list fv9">
        {list.map((t, i) => (
          <li key={t.id} className={'fv-row fv9-row' + (isOut(t) ? ' out' : '') + late(i)} style={delay(i, lateFrom)}>
            <div className="fv9-info">
              <p className="fv-nm">{t.name}</p>
              <p className="fv-sub">{t.city}</p>
              {near && (
                <p className="fv9-bar"><b><i style={{ width: `${Math.min(100, (t.miles / RADIUS) * 100)}%` }} /></b><span>{t.miles} mi of {RADIUS}</span></p>
              )}
              <p className="fv-line"><Times t={t} /><Few t={t} /></p>
            </div>
            <Go t={t} />
          </li>
        ))}
      </ul>
    );

  // 10 · Listing: theater names set like a printed showtimes page
  if (fv === 10)
    return (
      <ul className="fv-list fv10">
        {list.map((t, i) => (
          <li key={t.id} className={'fv-row fv10-row' + (isOut(t) ? ' out' : '') + late(i)} style={delay(i, lateFrom)}>
            <div className="fv10-info">
              <p className="fv10-nm serif">{t.name}</p>
              <p className="fv-sub">{where(t, near)}</p>
              <p className="fv-line"><Times t={t} /><Few t={t} /></p>
            </div>
            <Go t={t} />
          </li>
        ))}
      </ul>
    );

  // 6 · Search first: plain rows, no icons, the search carries the block
  return (
    <ul className="fv-list fv6">
      {list.map((t, i) => (
        <li key={t.id} className={'fv-row fv6-row' + (isOut(t) ? ' out' : '') + late(i)} style={delay(i, lateFrom)}>
          <div className="fv6-info"><p className="fv-nm">{t.name}</p><p className="fv-sub">{where(t, near)}</p><p className="fv-line"><Times t={t} /><Few t={t} /></p></div>
          <Go t={t} />
        </li>
      ))}
    </ul>
  );
}

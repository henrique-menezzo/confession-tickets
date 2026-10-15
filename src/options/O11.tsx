// 11 · Henrique's Figma page ("1440" in the Untitled file), built for the web and cleaned up.
// The finder sits next to the poster, above the synopsis; Get tickets opens the DW ticket modal.
// The page follows the single release date: before Nov 11, the day itself, and after.
import { useEffect, useRef, useState } from 'react';
import { ART, CAST, DATE, SAMPLE, SAMPLE_MORE, SYNOPSIS, allOut, isOut, type Theater } from '../data/data';
import { useFlow, useTier } from '../store';
import { Nav, Wordmark } from '../components/ShowPage';
import { ListHead, ZipForm } from '../components/Finder';
import { Chat } from '../components/Chrome';
import { openTickets, openWatch } from './TicketModal';

import { Icon } from '../components/Icon';
import dwPlus from '../data/footer/dwplus-logo.svg';
import appStore from '../data/footer/app-store.svg';
import googlePlay from '../data/footer/google-play.svg';
import qr from '../data/footer/qr.svg';
import iab from '../data/footer/iab.png';
import s1 from '../data/footer/social-1.svg';
import s2 from '../data/footer/social-2.svg';
import s3 from '../data/footer/social-3.svg';
import s4 from '../data/footer/social-4.svg';

const LINKS = ['News', 'Shows & Movies', 'All Access', 'Shop', 'Kids', 'DWTV'];
const BACKGROUND = 'A standalone sequel to Run Hide Fight (2020)—The Daily Wire’s first feature film—and its second collaboration with writer-director Kyle Rankin.';

const BADGE = { before: 'Coming November 11', day: 'Premiere tonight', after: 'Now streaming' };

/** Same night at home: visitors join, members get a reminder before the 11th and play it from the 11th on. */
function WatchButton({ className, label }: { className: string; label?: string }) {
  const release = useFlow((s) => s.release);
  const tier = useTier();
  const say = useFlow((s) => s.say);
  if (tier === 'guest') return <button className={className} onClick={openWatch}><Icon name="play" size={18} />{label ?? 'Join to watch'}</button>;
  if (release === 'before') return <button className={className} onClick={() => say('We’ll remind you on November 11, when Confession streams.')}><Icon name="bell" size={18} />Remind me on Nov 11</button>;
  return <button className={className} onClick={() => say('Starts Confession on DailyWire+ (prototype).')}><Icon name="play" size={18} />{label ?? 'Watch now'}</button>;
}

function Hero({ onClaim }: { onClaim: () => void }) {
  const tier = useTier();
  const release = useFlow((s) => s.release);
  const label = release === 'day'
    ? (tier === 'aa' ? 'Claim your free tickets for tonight' : 'Get tickets for tonight')
    : (tier === 'aa' ? 'Claim your free movie tickets' : tier === 'member' ? 'Get your movie tickets' : 'Claim your movie tickets');
  const note = release === 'after'
    ? (tier === 'guest' ? 'Streaming on DailyWire+ · included with every membership' : 'Streaming now on DailyWire+')
    : release === 'day'
      ? 'Tonight in 100 theaters · or watch it at home on DailyWire+'
      : `Members-only screenings in 100 theaters · streaming on DailyWire+ the same night · ${DATE.long}`;
  return (
    <section className="h11">
      <picture className="hero-art">
        <source media="(max-width: 760px)" srcSet={ART.tall} />
        <img src={ART.wide} alt="" />
      </picture>
      <div className="h11-shade" />
      <button className="h11-play" aria-label="Play trailer"><Icon name="play" size={36} /></button>
      {/* sound sits at the top, under Sign up, on every screen size */}
      <button className="h11-mute h11-sound" aria-label="Unmute"><Icon name="mute" size={20} /></button>
      <div className="h11-inner">
        {/* desktop: the action row runs across the hero, Trailer and Share on the right */}
        <div className="h11-copy">
          <span className={'coming' + (release === 'day' ? ' live' : '')}>{release === 'day' && <i className="live-dot" />}{BADGE[release]}</span>
          <img className="h11-title" src={ART.title} alt="Confession. Rob Lowe, James Franco." />
        </div>
        <div className="h11-btns">
          {release === 'after' ? (
            <WatchButton className="btn btn-w h11-btn" />
          ) : (
            <>
              <button className="btn btn-w h11-btn" onClick={onClaim}>
                <Icon name="ticket" size={20} />{label}
              </button>
              {release === 'day' && <WatchButton className="btn h11-btn h11-btn2" />}
            </>
          )}
        </div>
        <div className="h11-tools">
          <button className="t11-b"><Icon name="movie" size={16} />Trailer</button>
          <button className="t11-b"><Icon name="share" size={16} />Share</button>
        </div>
        <p className="h11-note">{note}</p>
      </div>
    </section>
  );
}

/** One row for web and phone. Name first, with seats beside it, then where and how far, then the
 *  times; the action trails. The pin only shows on the web. */
function Row({ t, near, delay, closest = false }: { t: Theater; near: boolean; delay?: number; closest?: boolean }) {
  const tier = useTier();
  const out = isOut(t);
  const few = !out && t.shows.some((s) => s.status === 'few');
  return (
    <li className={'r11' + (out ? ' out' : '') + (closest ? ' closest' : '') + (delay !== undefined ? ' late' : '')} style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}>
      <Icon name="pin" size={22} className="r11-pin" />
      <div className="r11-main">
        <p className="r11-name"><span>{t.name}</span>{few && <span className="r11-few"><i />Few seats left</span>}</p>
        <p className="r11-meta">{closest && <b>Closest · </b>}{t.city}{near && <span className="r11-dist"> · {t.miles} miles</span>}</p>
        <p className="r11-times">
          {t.shows.map((s) => <span key={s.id} className={'r11-t' + (s.status === 'out' ? ' gone' : '')}>{s.time}{s.format !== 'Standard' && <em> {s.format}</em>}</span>)}
        </p>
      </div>
      {out
        ? <span className="r11-out">Sold out</span>
        : <button className="btn btn-w r11-go" onClick={() => openTickets(t)}>{tier === 'aa' ? 'Claim tickets' : 'Get tickets'}</button>}
    </li>
  );
}

/** No screening within 50 miles. Since it streams the same night, home is a real alternative. */
function NoneNear() {
  const found = useFlow((s) => s.found);
  const release = useFlow((s) => s.release);
  const clear = useFlow((s) => s.clearSearch);
  const [show, setShow] = useState(false);
  if (!found?.nearest) return null;
  const n = found.nearest;
  return (
    <div className="n11">
      <Icon name="pin" size={24} className="n11-ic" />
      <h3>No screenings near {found.place}</h3>
      <p>Confession streams on DailyWire+ the same night, so you can still watch it {release === 'day' ? 'tonight' : 'on November 11'}. The closest screening is {n.name}, {n.miles} miles away.</p>
      <div className="n11-acts">
        <WatchButton className="btn btn-w" label={release === 'day' ? 'Watch it tonight' : undefined} />
        {!show && <button className="btn btn-g" onClick={() => setShow(true)}>Show the {n.miles}-mile theater</button>}
        <button className="tm-link" onClick={clear}>Try another ZIP</button>
      </div>
      {show && <ul className="r11-list n11-list"><Row t={n} near /></ul>}
    </div>
  );
}

/** Every theater in range is sold out. They stay in the list for urgency; this says what to do instead. */
function SoldOutNote() {
  const found = useFlow((s) => s.found);
  const release = useFlow((s) => s.release);
  if (!found || !allOut(found.theaters)) return null;
  return (
    <div className="so11" role="status">
      <p><b>Every screening near {found.place} is sold out.</b> Watch it at home on DailyWire+ {release === 'day' ? 'tonight' : 'the same night'}.</p>
      <WatchButton className="btn btn-w sm" />
    </div>
  );
}

/** Title, what and when, and the search. */
function Head() {
  const release = useFlow((s) => s.release);
  return (
    <>
      <div className="f11-head">
        <h2 className="f11-h">{release === 'day' ? 'Find a theater for tonight' : 'Find a theater near you'}</h2>
        <p className="f11-intro">
          <span className="f11-intro-a">{release === 'day' ? 'Confession screens tonight in 100 theaters for DailyWire+ members, and on DailyWire+ the same night. ' : `Confession screens in 100 theaters nationwide on ${DATE.long} for DailyWire+ members. `}</span>
          Enter your ZIP code to see the closest showings and claim your seats before they’re gone.
        </p>
      </div>
      <div className="f11-search"><ZipForm variant="line" cta="Find theaters" locate={false} locateIcon auto iconGo /></div>
    </>
  );
}

const PAGE = 5;

/** Loading: the same rows as the results, drawn as quiet bars. No boxes, same rules, same spacing. */
function Skeleton() {
  const zip = useFlow((s) => s.zip);
  const widths = [[46, 30, 38], [38, 34, 26], [52, 28, 40], [42, 32, 30]];
  return (
    <div className="f11-list sk11" aria-live="polite" aria-busy="true">
      <p className="sk11-head"><span className="sr-only">Finding theaters near {zip}</span><i style={{ width: 220 }} /></p>
      <ul className="r11-list">
        {widths.map(([a, b, c], i) => (
          <li key={i} className="r11 sk11-row" style={{ ['--d' as string]: `${i * 90}ms` }}>
            <i className="sk11-pin" />
            <div className="r11-main">
              <i style={{ width: `${a}%`, height: 14 }} />
              <i style={{ width: `${b}%` }} />
              <i style={{ width: `${c}%` }} />
            </div>
            <i className="sk11-btn" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Finder() {
  const phase = useFlow((s) => s.phase);
  const found = useFlow((s) => s.found);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const moreBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => { setMore(false); setLoading(false); }, [found]);
  const near = phase === 'results' && !!found;
  const all = near ? [...found!.theaters, ...(found!.more ?? [])].sort((a, b) => a.miles - b.miles) : [...SAMPLE, ...SAMPLE_MORE];
  const list = more ? all : all.slice(0, PAGE);
  const closestId = all.find((t) => !isOut(t))?.id;
  const toggle = () => {
    if (loading) return;
    if (!more) {
      // a short load, so the new theaters read as fetched, then they come in one after another
      setLoading(true);
      setTimeout(() => { setLoading(false); setMore(true); }, 700);
      return;
    }
    setMore(false);
    // folding back up: keep the button where the eye is instead of leaving the reader at the footer
    requestAnimationFrame(() => moreBtn.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
  };
  return (
    <div className="f11">
      <Head />
      {phase === 'searching' && <Skeleton />}
      {phase === 'far' && <NoneNear />}
      {(phase === 'idle' || near) && (
        <div className="f11-list" key={found?.zip ?? 'sample'}>
          <SoldOutNote />
          {near ? <ListHead count={all.length} /> : <p className="f11-lh">A few of the 100 theaters · enter your ZIP for the ones nearest you</p>}
          <ul className="r11-list">{list.map((t, i) => <Row key={t.id} t={t} near={near} closest={near && t.id === closestId} delay={i >= PAGE ? (i - PAGE) * 60 : undefined} />)}</ul>
          {all.length > PAGE && (
            <button ref={moreBtn} className={'r11-more' + (loading ? ' loading' : '')} onClick={toggle} aria-expanded={more} aria-busy={loading}>
              {loading ? <><span className="spin" />Loading theaters</> : <>{more ? 'Show fewer theaters' : `Show ${all.length - PAGE} more theaters`}<Icon name={more ? 'chevup' : 'chevdown'} size={16} /></>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Footer() {
  const cols = [
    ['News', 'Shows & Movies', 'Shop', 'Kids'],
    ['About', 'Advertise With Us', 'Authors', 'Book our Speakers', 'Careers', 'Contact Support', 'Gift Membership'],
    ['Cookie Settings', 'Legal', 'Media & Press Inquiries', 'Shipping & Returns', 'Standards & Policies', 'Submit a News Tip'],
  ];
  return (
    <footer className="ft11">
      <div className="ft11-top"><Wordmark className="ft11-logo" /></div>
      <div className="ft11-links">
        <div className="ft11-mcols">
          <ul>{['News', 'Shows & Movies', 'Shop', 'Kids', 'About', 'Advertise With Us', 'Authors', 'Book our Speakers', 'Terms', 'Privacy'].map((l) => <li key={l} className={l === 'News' ? 'here' : ''}><a href="#" onClick={(e) => e.preventDefault()}>{l}</a></li>)}</ul>
          <ul>{['Careers', 'Contact Support', 'Gift Membership', 'Cookie Settings', 'Legal', 'Media & Press Inquiries', 'Shipping & Returns', 'Standards & Policies', 'Submit a News Tip'].map((l) => <li key={l}><a href="#" onClick={(e) => e.preventDefault()}>{l}</a></li>)}</ul>
        </div>
        <div className="ft11-cols">
          {cols.map((c, i) => (
            <ul key={i}>{c.map((l) => <li key={l} className={l === 'News' ? 'here' : ''}><a href="#" onClick={(e) => e.preventDefault()}>{l}</a></li>)}</ul>
          ))}
        </div>
        <div className="ft11-app">
          <div className="ft11-promo">
            <img className="ft11-plus" src={dwPlus} alt="Daily Wire+" />
            <p>Facts and headlines on the go.<br />Download the Daily Wire app.</p>
            <div className="ft11-stores"><img src={appStore} alt="Download on the App Store" /><img src={googlePlay} alt="Get it on Google Play" /></div>
          </div>
          <div className="ft11-qr"><img src={qr} alt="" /><span>Scan the QR Code to Download</span></div>
        </div>
      </div>
      <div className="ft11-bottom">
        <p className="ft11-legal"><span>© Copyright 2026, The Daily Wire LLC</span><a href="#" onClick={(e) => e.preventDefault()}>Terms</a><a href="#" onClick={(e) => e.preventDefault()}>Privacy</a></p>
        <div className="ft11-social">
          {[[s1, 'Facebook'], [s2, 'X'], [s3, 'Instagram'], [s4, 'YouTube']].map(([src, l]) => <a key={l} href="#" aria-label={l} onClick={(e) => e.preventDefault()}><img src={src} alt="" /></a>)}
          <img className="ft11-iab" src={iab} alt="IAB Tech Lab podcast measurement compliant" />
        </div>
      </div>
    </footer>
  );
}

export default function O11() {
  const release = useFlow((s) => s.release);
  const finder = useRef<HTMLDivElement>(null);
  const go = () => finder.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <div className="p11">
      <Nav links={LINKS} here="Shows & Movies" />
      <Hero onClaim={go} />
      {/* phones: Trailer and Share in their own strip under the hero, as in the PHONE frame */}
      <div className="t11">
        <button className="t11-m"><Icon name="movie" size={20} />Trailer</button>
        <button className="t11-m"><Icon name="share" size={20} />Share</button>
      </div>
      <section className="m11">
        <div className="m11-left">
          {release !== 'after' && <div ref={finder} className="m11-anchor"><Finder /></div>}
          <div className="m11-txt"><p className="label">Synopsis</p><p className="serif syn">{SYNOPSIS}</p></div>
          <div className="m11-txt"><p className="label">Background</p><p className="serif syn">{BACKGROUND}</p></div>
          <div className="m11-txt"><p className="label">Release Date</p><p className="serif syn">November 11, 2026</p></div>
        </div>
        <div className="m11-poster">
          <div className="poster">
            <img className="poster-glow" src={ART.poster} alt="" />
            <img className="poster-img" src={ART.poster} alt="Confession poster" />
          </div>
        </div>
      </section>
      <section className="s11">
        <h2 className="h2">Extras</h2>
        <div className="x11">
          <div className="x11-img"><img src={ART.teaser} alt="" /><span>2 min</span></div>
          <p>Confession | Official Teaser</p>
        </div>
      </section>
      <section className="s11">
        <h2 className="h2">Cast &amp; Crew</h2>
        <div className="c11">
          {CAST.map((c) => <figure key={c.name}><img src={c.img} alt="" loading="lazy" /><figcaption>{c.name}<span>Actor</span></figcaption></figure>)}
        </div>
      </section>
      <Footer />
      {release !== 'after' && <Chat />}
    </div>
  );
}

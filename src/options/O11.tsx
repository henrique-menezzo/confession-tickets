// 11 · Henrique's Figma page ("1440" in the Untitled file), built for the web and cleaned up.
// The finder sits next to the poster, above the synopsis; each theater row opens in place.
import { useRef } from 'react';
import { ART, CAST, DATE, SAMPLE, SYNOPSIS, firstOpen, isOut, type Theater } from '../data/data';
import { useFlow, useTier } from '../store';
import { Nav, Wordmark } from '../components/ShowPage';
import { Far, ListHead, Searching, Showtimes, Status, ZipForm } from '../components/Finder';
import { Action } from '../components/Action';
import { Chat } from '../components/Chrome';
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

function Hero({ onClaim }: { onClaim: () => void }) {
  const tier = useTier();
  const label = tier === 'aa' ? 'Claim your free movie tickets' : tier === 'member' ? 'Get your movie tickets' : 'Claim your movie tickets';
  return (
    <section className="h11">
      <picture className="hero-art">
        <source media="(max-width: 760px)" srcSet={ART.tall} />
        <img src={ART.wide} alt="" />
      </picture>
      <div className="h11-shade" />
      <button className="h11-play" aria-label="Play trailer"><Icon name="play" size={36} /></button>
      <div className="h11-inner">
        <div className="h11-copy">
          <span className="coming">Coming November 11</span>
          <img className="h11-title" src={ART.title} alt="Confession. Rob Lowe, James Franco." />
          <div className="h11-cta">
            <button className="btn btn-w h11-btn" onClick={onClaim}>
              <Icon name={tier === 'guest' ? 'lock' : 'ticket'} size={20} />{label}
            </button>
            <p className="h11-note">Members-only screenings in 100 theaters · streaming on DailyWire+ the same night · {DATE.long}</p>
          </div>
        </div>
        <button className="h11-mute" aria-label="Unmute"><Icon name="mute" size={20} /></button>
      </div>
    </section>
  );
}

function Row({ t, near }: { t: Theater; near: boolean }) {
  const pick = useFlow((s) => s.pick);
  const choose = useFlow((s) => s.choose);
  const unpick = useFlow((s) => s.unpick);
  const on = pick?.t.id === t.id;
  const out = isOut(t);
  const open = t.shows.filter((s) => s.status !== 'out');
  return (
    <li className={'r11' + (on ? ' on' : '') + (out ? ' out' : '')}>
      <Icon name="pin" size={22} className="r11-pin" />
      <div className="r11-main">
        <p className="r11-name">{t.name}<Status t={t} /></p>
        <p className="r11-meta">{near ? `${t.city} · ${t.miles} miles` : t.city}</p>
        <p className="r11-meta r11-times">
          {t.shows.map((s) => <span key={s.id} className={s.status === 'out' ? 'gone' : ''}>{s.time} · {s.format}</span>)}
        </p>
      </div>
      <button
        className={'btn btn-g r11-go' + (on ? ' on' : '')}
        disabled={out}
        aria-expanded={on}
        onClick={() => (on ? unpick() : choose(t, firstOpen(t)!))}
      >
        {out ? 'Sold out' : on ? 'Close' : 'Get tickets'}
      </button>
      {on && (
        <div className="r11-x">
          {open.length > 1 && <div className="r11-pick"><span>Pick a time</span><Showtimes t={t} size="sm" /></div>}
          <Action layout="wide" />
        </div>
      )}
    </li>
  );
}

function Finder() {
  const phase = useFlow((s) => s.phase);
  const found = useFlow((s) => s.found);
  const near = phase === 'results' && !!found;
  const list = near ? found!.theaters : SAMPLE;
  return (
    <div className="f11">
      <div className="f11-head">
        <h2 className="f11-h">Find a theater near you</h2>
        <p className="f11-intro">Confession screens in 100 theaters nationwide on {DATE.long} for DailyWire+ members. Enter your ZIP code to see the closest showings and claim your seats before they’re gone.</p>
        <ZipForm variant="line" cta="Find theaters" locate={false} suggest />
      </div>
      {phase === 'searching' && <Searching rows={4} />}
      {phase === 'far' && <Far />}
      {(phase === 'idle' || near) && (
        <div className="f11-list">
          {near ? <ListHead /> : <p className="f11-lh">A few of the 100 theaters · enter your ZIP for the ones nearest you</p>}
          <ul className="r11-list">{list.map((t) => <Row key={t.id} t={t} near={near} />)}</ul>
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
  const finder = useRef<HTMLDivElement>(null);
  const go = () => finder.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <div className="p11">
      <Nav links={LINKS} here="Shows & Movies" />
      <Hero onClaim={go} />
      <div className="t11">
        <button className="t11-b"><Icon name="movie" size={16} />Trailer</button>
        <button className="t11-b"><Icon name="share" size={16} />Share</button>
      </div>
      <section className="m11">
        <div className="m11-left">
          <div ref={finder} className="m11-anchor"><Finder /></div>
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
      <Chat />
    </div>
  );
}

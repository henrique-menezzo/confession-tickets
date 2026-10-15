// The Confession page as it is live on dailywire.com today (nav, hero, synopsis, extras, cast,
// footer), with slots where each option puts its ticket experience.
import { useEffect, useState, type ReactNode } from 'react';
import logo from '../data/logo.svg';
import { ART, CAST, SYNOPSIS } from '../data/data';
import { useFlow, useTier } from '../store';
import { Icon } from './Icon';

export function Wordmark({ className = '' }: { className?: string }) {
  return <span className={'wordmark ' + className} role="img" aria-label="Daily Wire" style={{ ['--logo' as string]: `url("${logo}")` }} />;
}

const LINKS = ['News', 'Shows & Movies', 'All Access', 'Sport & State', 'The Midterms'];

export function Nav({ solid = false, links = LINKS, here = 'The Midterms', className = '' }: { solid?: boolean; links?: string[]; here?: string; className?: string }) {
  const user = useFlow((s) => s.user);
  const tier = useTier();
  const setUser = useFlow((s) => s.setUser);
  const say = useFlow((s) => s.say);
  const openCheckout = useFlow((s) => s.openCheckout);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={'nav ' + className + (solid || scrolled ? ' solid' : '')}>
      <button className="nav-burger" aria-label="Menu"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg></button>
      <button className="nav-burger nav-search" aria-label="Search"><Icon name="search" size={20} /></button>
      <nav className="nav-links">
        {links.map((l) => <a key={l} href="#" className={l === here ? (here === 'The Midterms' ? 'mid' : 'here') : ''} onClick={(e) => e.preventDefault()}>{l}</a>)}
      </nav>
      <Wordmark className="nav-logo" />
      <div className="nav-right">
        <a href="#" className="nav-tool" onClick={(e) => e.preventDefault()}><Icon name="download" size={18} />Download App</a>
        <a href="#" className="nav-tool" onClick={(e) => e.preventDefault()}><Icon name="search" size={18} />Search</a>
        <span className="nav-div" />
        {user === 'guest' && tier === 'guest' ? (
          <>
            <button className="nav-login" onClick={() => { setUser('member'); say('Logged in as a DailyWire+ member (prototype).'); }}>LOG IN</button>
            <button className="nav-cta" onClick={() => openCheckout('stream')}>SIGN UP</button>
          </>
        ) : (
          <>
            {tier === 'member' && <button className="nav-cta up" onClick={() => openCheckout('upgrade')}>UPGRADE</button>}
            <span className="nav-av" aria-label="Account">JM</span>
          </>
        )}
      </div>
    </header>
  );
}

export function HeroTools() {
  return (
    <div className="hero-tools">
      <button className="tool"><Icon name="movie" size={20} />Trailer</button>
      <button className="tool"><Icon name="share" size={20} />Share</button>
    </div>
  );
}

/** The live hero action row: email capture for "Get Notified". Options swap it out. */
export function NotifyRow() {
  return (
    <>
      <div className="hero-row">
        <form className="notify" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Email Address" aria-label="Email Address" />
          <button>Get Notified <Icon name="right" size={16} /></button>
        </form>
        <HeroTools />
      </div>
      <p className="hero-fine">By submitting your email address, you agree to receive emails from The Daily Wire.</p>
    </>
  );
}

export function Hero({ action, aside, className = '', dim = false }: { action?: ReactNode; aside?: ReactNode; className?: string; dim?: boolean }) {
  return (
    <section className={'hero ' + className + (dim ? ' dim' : '')}>
      <picture className="hero-art">
        <source media="(max-width: 760px)" srcSet={ART.tall} />
        <img src={ART.wide} alt="" />
      </picture>
      <div className="hero-shade" />
      <button className="hero-play" aria-label="Play trailer"><Icon name="play" size={26} /></button>
      <div className="hero-inner">
        <span className="coming">Coming November 11</span>
        <img className="title-art" src={ART.title} alt="Confession. Rob Lowe, James Franco." />
        {action ?? <NotifyRow />}
      </div>
      {aside}
      <button className="hero-mute" aria-label="Unmute"><Icon name="mute" size={20} /></button>
    </section>
  );
}

export function ShowBody({ before, after }: { before?: ReactNode; after?: ReactNode }) {
  return (
    <>
      {before}
      <section className="body">
        <div className="body-main">
          <div className="body-text">
            <p className="label">Synopsis</p>
            <p className="serif syn">{SYNOPSIS}</p>
            <hr />
            <h3 className="label">Release Date</h3>
            <p className="serif">November 11, 2026</p>
          </div>
          <div className="poster">
            <img className="poster-glow" src={ART.poster} alt="" />
            <img className="poster-img" src={ART.poster} alt="Confession poster" />
          </div>
        </div>
        <hr className="wide" />
        <h2 className="h2">Extras</h2>
        <div className="extra">
          <div className="extra-img"><img src={ART.teaser} alt="" /><span>2 min</span></div>
          <p>Confession | Official Teaser</p>
        </div>
        <hr className="wide" />
        <h2 className="h2">Cast &amp; Crew</h2>
        <div className="cast">
          {CAST.map((c) => (
            <figure key={c.name}><img src={c.img} alt="" loading="lazy" /><figcaption>{c.name}<span>Actor</span></figcaption></figure>
          ))}
        </div>
      </section>
      {after}
      <footer className="foot">
        <Wordmark className="foot-logo" />
        <p>Facts and headlines on the go. Download the Daily Wire app.</p>
        <p className="foot-fine">© Copyright 2026, The Daily Wire LLC · Terms · Privacy</p>
      </footer>
    </>
  );
}

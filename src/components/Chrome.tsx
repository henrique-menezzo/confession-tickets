// Things that float over every option: the screening chatbot (vendor code in production),
// the toast, and the prototype controls.
import { useEffect, useState } from 'react';
import { FAQ } from '../data/data';
import { useFlow, type CodeV, type Release, type User } from '../store';
import { Icon } from './Icon';

export function Chat({ label = 'Questions about the screening?', fab = true }: { label?: string; fab?: boolean }) {
  const open = useFlow((s) => s.chat);
  const setChat = useFlow((s) => s.setChat);
  const [asked, setAsked] = useState<number[]>([]);
  return (
    <div className={'chat' + (open ? ' open' : '')}>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Screening help">
          <div className="chat-h">
            <div><b>Screening help</b><span>Answers about Confession in theaters</span></div>
            <button aria-label="Close" onClick={() => setChat(false)}><Icon name="x" size={18} /></button>
          </div>
          <div className="chat-body">
            <p className="bub">Hi. Ask me anything about the November 11 screenings.</p>
            {asked.map((i) => (
              <div key={i} className="qa"><p className="bub me">{FAQ[i].q}</p><p className="bub">{FAQ[i].a}</p></div>
            ))}
            <div className="chat-chips">
              {FAQ.map((f, i) => !asked.includes(i) && <button key={i} onClick={() => setAsked([...asked, i])}>{f.q}</button>)}
            </div>
          </div>
          <div className="chat-in"><input placeholder="Ask a question" aria-label="Ask a question" /><Icon name="send" size={18} /></div>
          <p className="chat-note">Vendor chatbot drops in here</p>
        </div>
      )}
      {fab && <button className="chat-fab" onClick={() => setChat(!open)} aria-expanded={open}>
        <Icon name={open ? 'x' : 'chat'} size={20} /><span>{open ? 'Close' : label}</span>
      </button>}
    </div>
  );
}

export function Toast() {
  const toast = useFlow((s) => s.toast);
  const [shown, setShown] = useState<typeof toast>(null);
  useEffect(() => {
    if (!toast) return;
    setShown(toast);
    const t = setTimeout(() => setShown(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);
  if (!shown) return null;
  return <div className="toast" key={shown.key} role="status"><Icon name="check" size={16} />{shown.text}</div>;
}

const USERS: [User, string][] = [['guest', 'Not a member'], ['member', 'DW+ member'], ['aa', 'All Access']];
const RELEASES: [Release, string][] = [['before', 'Before Nov 11'], ['day', 'Nov 11'], ['after', 'Nov 12 →']];

function Seg<T extends string | number>({ label, items, value, set, className = '' }: { label: string; items: [T, string][]; value: T; set: (v: T) => void; className?: string }) {
  return (
    <div className={'pt-group ' + className}>
      <span className="pt-label">{label}</span>
      <div className="proto-seg" role="radiogroup" aria-label={label}>
        {items.map(([v, l]) => (
          <button key={String(v)} role="radio" aria-checked={value === v} className={value === v ? 'on' : ''} onClick={() => set(v)}>{l}</button>
        ))}
      </div>
    </div>
  );
}

const CODES: [CodeV, string][] = [[1, 'Coupon'], [2, 'Field'], [3, 'Characters'], [4, 'Tap']];
const KEY = 'confession-proto-open';

/** Prototype controls: tabs at the bottom that fold into one small button. */
export function Proto() {
  const user = useFlow((s) => s.user);
  const setUser = useFlow((s) => s.setUser);
  const release = useFlow((s) => s.release);
  const setRelease = useFlow((s) => s.setRelease);
  const reset = useFlow((s) => s.reset);
  const codeV = useFlow((s) => s.codeV);
  const setCodeV = useFlow((s) => s.setCodeV);
  const [open, setOpen] = useState(() => {
    try { const v = localStorage.getItem(KEY); if (v !== null) return v === '1'; } catch { /* storage blocked */ }
    return !window.matchMedia('(max-width: 760px)').matches;
  });
  const toggle = (v: boolean) => { setOpen(v); try { localStorage.setItem(KEY, v ? '1' : '0'); } catch { /* storage blocked */ } };

  if (!open)
    return (
      <button className="pt-fab" onClick={() => toggle(true)} aria-label="Show prototype controls" title="Prototype controls">
        <Icon name="sliders" size={18} />
      </button>
    );
  return (
    <div className="pt" role="region" aria-label="Prototype controls">
      <Seg label="Viewer" items={USERS} value={user} set={setUser} />
      <Seg label="Date" items={RELEASES} value={release} set={setRelease} />
      <Seg label="Code" items={CODES} value={codeV} set={setCodeV} />
      <div className="pt-end">
        <p className="pt-hint">ZIP <b>37064</b> nearby · <b>30303</b> sold out · <b>59718</b> none</p>
        <button className="pt-icon" onClick={reset} aria-label="Start over" title="Start over"><Icon name="reset" size={16} /></button>
        <button className="pt-icon" onClick={() => toggle(false)} aria-label="Hide prototype controls" title="Hide"><Icon name="chevdown" size={18} /></button>
      </div>
    </div>
  );
}

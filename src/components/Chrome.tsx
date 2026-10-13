// Things that float over every option: the screening chatbot (vendor code in production),
// the toast, and the prototype controls.
import { useEffect, useState } from 'react';
import { FAQ } from '../data/data';
import { useFlow, type User } from '../store';
import { Icon } from './Icon';
import { OPTIONS } from '../options/meta';

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

export function Proto() {
  const opt = useFlow((s) => s.opt);
  const user = useFlow((s) => s.user);
  const setOpt = useFlow((s) => s.setOpt);
  const setUser = useFlow((s) => s.setUser);
  const reset = useFlow((s) => s.reset);
  const idle = useFlow((s) => s.phase === 'idle');
  const [min, setMin] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  if (!opt) return null;
  const meta = OPTIONS[opt - 1];
  return (
    <div className={'proto' + (min ? ' min' : '')}>
      <button className="proto-home" onClick={() => setOpt(0)} aria-label="All options"><Icon name="grid" size={16} /></button>
      <div className="proto-opt">
        <button aria-label="Previous option" onClick={() => setOpt(opt === 1 ? 10 : opt - 1)}><Icon name="left" size={16} /></button>
        <span><b>{String(opt).padStart(2, '0')}</b> {meta.name}</span>
        <button aria-label="Next option" onClick={() => setOpt(opt === 10 ? 1 : opt + 1)}><Icon name="next" size={16} /></button>
      </div>
      <div className="proto-seg" role="radiogroup" aria-label="Viewer">
        {USERS.map(([u, l]) => (
          <button key={u} role="radio" aria-checked={user === u} className={user === u ? 'on' : ''} onClick={() => setUser(u)}>{l}</button>
        ))}
      </div>
      <button className="proto-reset" onClick={reset} aria-label="Start over"><Icon name="reset" size={16} /></button>
      <button className="proto-min" onClick={() => setMin(!min)} aria-label={min ? 'Show controls' : 'Hide controls'}><Icon name={min ? 'chevup' : 'chevdown'} size={16} /></button>
      {idle && <p className="proto-hint">Try ZIP <b>37064</b> for theaters nearby, <b>59718</b> for none</p>}
    </div>
  );
}

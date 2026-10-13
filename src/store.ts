import { create } from 'zustand';
import { CODE, LOCATION_ZIP, lookup, type Lookup, type Show, type Theater } from './data/data';

export type User = 'guest' | 'member' | 'aa';
export type Phase = 'idle' | 'searching' | 'results' | 'far';
export type Plan = 'promo' | 'upgrade' | 'stream';

interface Flow {
  opt: number;
  user: User;
  joined: boolean; // a guest or member who finished checkout and now holds codes
  zip: string;
  phase: Phase;
  found: Lookup | null;
  pick: { t: Theater; s: Show } | null;
  done: boolean; // handed off to TicketSpice at least once
  checkout: Plan | null;
  chat: boolean;
  toast: { text: string; key: number } | null;
  page: 'show' | 'tickets'; // option 9 has a page of its own

  setOpt: (n: number) => void;
  setUser: (u: User) => void;
  search: (zip: string) => void;
  locate: () => void;
  choose: (t: Theater, s: Show) => void;
  unpick: () => void;
  clearSearch: () => void;
  openCheckout: (p: Plan) => void;
  closeCheckout: () => void;
  completeCheckout: () => void;
  handoff: () => void;
  setChat: (v: boolean) => void;
  say: (text: string) => void;
  setPage: (p: 'show' | 'tickets') => void;
  reset: () => void;
}

const params = new URLSearchParams(location.search);
const startUser = (['guest', 'member', 'aa'] as const).find((u) => u === params.get('u')) ?? 'aa';
const startOpt = Math.min(10, Math.max(0, Number(params.get('o') ?? 0) || 0));

function writeUrl(opt: number, user: User) {
  const q = new URLSearchParams(location.search);
  if (opt) q.set('o', String(opt)); else q.delete('o');
  q.set('u', user);
  try { history.replaceState(null, '', `${location.pathname}?${q}`); } catch { /* sandboxed hosts */ }
}

const blank = { zip: '', phase: 'idle' as Phase, found: null, pick: null, done: false, checkout: null, chat: false, joined: false, page: 'show' as const };
let timer: number | undefined;

export const useFlow = create<Flow>((set, get) => ({
  opt: startOpt,
  user: startUser,
  toast: null,
  ...blank,

  setOpt: (opt) => { writeUrl(opt, get().user); set({ opt, ...blank }); window.scrollTo(0, 0); },
  setUser: (user) => { writeUrl(get().opt, user); set({ user, joined: false, checkout: null, done: false }); },
  search: (zip) => {
    clearTimeout(timer);
    set({ zip, phase: 'searching', pick: null, done: false });
    // a short wait so the searching state is visible and nobody reads it as a page jump
    timer = window.setTimeout(() => {
      const found = lookup(zip);
      set({ found, phase: found.theaters.length ? 'results' : 'far' });
    }, 650);
  },
  locate: () => get().search(LOCATION_ZIP),
  choose: (t, s) => set({ pick: { t, s }, done: false }),
  unpick: () => set({ pick: null, done: false }),
  clearSearch: () => set({ zip: '', phase: 'idle', found: null, pick: null, done: false }),
  openCheckout: (checkout) => set({ checkout }),
  closeCheckout: () => set({ checkout: null }),
  completeCheckout: () => {
    const plan = get().checkout;
    set({ checkout: null, joined: plan !== 'stream' });
    // the ticket views show their own welcome; only the streaming plan needs a word here
    if (plan === 'stream') get().say('Welcome to DailyWire+. We’ll email you when Confession streams.');
  },
  handoff: () => {
    const { user, joined } = get();
    const hasCode = user === 'aa' || joined;
    if (hasCode) navigator.clipboard?.writeText(CODE).catch(() => {});
    set({ done: true });
    get().say(hasCode ? 'Code copied. Opening TicketSpice in a new tab.' : 'Opening TicketSpice in a new tab.');
  },
  setChat: (chat) => set({ chat }),
  say: (text) => set({ toast: { text, key: Date.now() } }),
  setPage: (page) => { set({ page }); window.scrollTo(0, 0); },
  reset: () => { clearTimeout(timer); set({ ...blank }); window.scrollTo(0, 0); },
}));

/** What the person can do with tickets right now: guests who joined behave like All Access. */
export const useTier = (): User => useFlow((s) => (s.joined ? 'aa' : s.user));

// Tabler outline icons, the set the DW design system ships.
const P: Record<string, string> = {
  ticket: 'M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2',
  pin: 'M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0M17.657 16.657l-4.243 4.243a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z',
  locate: 'M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 2v2M12 20v2M20 12h2M2 12h2',
  right: 'M5 12h14M13 18l6-6M13 6l6 6',
  down: 'M12 5v14M18 13l-6 6M6 13l6 6',
  out: 'M17 7L7 17M8 7h9v9',
  copy: 'M7 9.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333zM4.012 16.737A2.005 2.005 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1',
  check: 'M5 12l5 5L20 7',
  x: 'M18 6L6 18M6 6l12 12',
  left: 'M15 6l-6 6 6 6',
  next: 'M9 6l6 6-6 6',
  chevdown: 'M6 9l6 6 6-6',
  chevup: 'M6 15l6-6 6 6',
  share: 'M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 9l5-5 5 5M12 4v12',
  movie: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8 4v16M16 4v16M4 8h4M4 16h4M4 12h16M16 8h4M16 16h4',
  clock: 'M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0M12 7v5l3 3',
  search: 'M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0M21 21l-6-6',
  download: 'M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12',
  chat: 'M8 9h8M8 13h6M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z',
  mail: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l9 6 9-6',
  lock: 'M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM11 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0M8 11V7a4 4 0 1 1 8 0v4',
  shield: 'M11.46 20.846A12 12 0 0 1 3.5 6a12 12 0 0 0 8.5-3a12 12 0 0 0 8.5 3a12 12 0 0 1-.09 7.06M15 19l2 2 4-4',
  mute: 'M6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l3.5-4.5A.8.8 0 0 1 11 5v14a.8.8 0 0 1-1.5.5L6 15M16 10l4 4m0-4l-4 4',
  user: 'M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2',
  seat: 'M5 11a2 2 0 0 1 2 2v2h10v-2a2 2 0 1 1 4 0v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM5 11V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5M6 19v2M18 19v2',
  calendar: 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 3v4M8 3v4M4 11h16',
  bell: 'M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6M9 17v1a3 3 0 0 0 6 0v-1',
  send: 'M10 14L21 3M21 3l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1z',
  info: 'M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0M12 9h.01M11 12h1v4h1',
  reset: 'M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  edit: 'M4 20h4L18.5 9.5a2.828 2.828 0 1 0-4-4L4 16v4M13.5 6.5l4 4',
  list: 'M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01',
  map: 'M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3zM9 4v13M15 7v13',
};

export function Icon({ name, size = 20, stroke = 1.75, className }: { name: keyof typeof P | 'play'; size?: number; stroke?: number; className?: string }) {
  if (name === 'play')
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path d="M7 4.8v14.4a1 1 0 0 0 1.52.85l11.5-7.2a1 1 0 0 0 0-1.7L8.52 3.95A1 1 0 0 0 7 4.8z" fill="currentColor" />
      </svg>
    );
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={P[name]} />
    </svg>
  );
}

export type IconName = keyof typeof P;

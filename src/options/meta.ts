export interface Meta { name: string; kind: string; modal: boolean; desc: string; why: string }

export const OPTIONS: Meta[] = [
  {
    name: 'Tickets section',
    kind: 'On the page',
    modal: false,
    desc: 'A tickets section right under the hero. Pick a showtime and that row opens in place with your code, the price or the plan.',
    why: 'Closest to what dev built, cleaned up. Nothing covers the page and the list scans like a showtimes page.',
  },
  {
    name: 'Hero finder',
    kind: 'On the page',
    modal: false,
    desc: 'The ZIP field takes the place of Get Notified. Results open on the dark side of the hero, so the whole flow happens above the fold.',
    why: 'Uses the exact component the hero already has. Fastest path for someone who came from an ad or an email.',
  },
  {
    name: 'Side drawer',
    kind: 'Drawer',
    modal: true,
    desc: 'Get Tickets opens a panel from the right. Location, theater and tickets in three short steps while the film stays in view.',
    why: 'A pattern people know from Fandango and AMC. Easy to bring back from anywhere on the page.',
  },
  {
    name: 'Paywall modal',
    kind: 'Modal',
    modal: true,
    desc: 'The whole flow lives in the same modal as the live paywall. Visitors land in that modal anyway, so every step before it looks the same.',
    why: 'Most consistent with what exists. For visitors the plan step is just the next screen of the same box.',
  },
  {
    name: 'Build your ticket',
    kind: 'On the page',
    modal: false,
    desc: 'A ticket fills in as you choose: theater, time, then the code. All Access members see their code before anything else.',
    why: 'Turns the free tickets into an object you can see. The code stops being a step and becomes the reward.',
  },
  {
    name: 'Theater map',
    kind: 'On the page',
    modal: false,
    desc: 'All 100 theaters on a dot map of the country. Search a ZIP and it zooms to a local map with the 50-mile circle drawn and sold-out pins left in place.',
    why: 'Shows scale before anyone types, and makes the 50-mile rule visible instead of explained.',
  },
  {
    name: 'Closest showing',
    kind: 'On the page',
    modal: false,
    desc: 'We guess the location and show the nearest open showing with one button. The rest of the list is one tap away.',
    why: 'Most people go to the closest theater. One click for members, two for All Access.',
  },
  {
    name: 'Ask the concierge',
    kind: 'Chat panel',
    modal: true,
    desc: 'The finder and the chatbot are one panel. Questions about seats or streaming get answered in the same thread as the tickets.',
    why: 'They are shipping a chatbot anyway. Worth seeing what happens if it does the selling too.',
  },
  {
    name: 'Tickets page',
    kind: 'Separate page',
    modal: false,
    desc: 'A page of its own for lifecycle emails and ads, with the ZIP carried in the link. The show page only links to it.',
    why: 'The PRD asks for a theater showing page for members. This is that page done properly.',
  },
  {
    name: 'Ticket bar',
    kind: 'Bottom bar',
    modal: false,
    desc: 'A slim bar stays at the bottom of the show page while you scroll. It opens into a sheet with results and folds back into a summary.',
    why: 'Always one tap away without taking over the page. On a phone it is already a bottom sheet.',
  },
  {
    name: 'Finder by the poster',
    kind: 'On the page',
    modal: false,
    desc: 'The page from the design file: the finder sits beside the poster, above the synopsis. Get tickets opens a DW modal with the code, the price or the plans, and the page follows the release date: before Nov 11, the day, and after.',
    why: 'Built from the design file and cleaned up: one date for the whole list, quieter row buttons, no distance until there is a ZIP.',
  },
];

export const NOTES = [
  ['The page knows who is looking.', 'Dev shows two membership cards to everyone. Each option shows one line that fits the viewer: free tickets, member price or the plan.'],
  ['One action in the hero.', 'Get Notified and Find a Theater were fighting for the same spot.'],
  ['The button copies the code.', 'Continue to TicketSpice copies it on the way out, so the three numbered steps become one line.'],
  ['November 11, 2026 is a Wednesday.', 'The mock says Tue.'],
  ['50 miles.', 'The PRD says about 50 and the mock searches 100.'],
  ['Nothing nearby is not “sold out”.', 'The PRD asks for sold-out messaging when there is no theater near. We say there is no screening near you and offer streaming. Telling people it sold out when it never existed is the kind of thing that ends up in refund tickets.'],
  ['Sold-out showings stay in the list.', 'As agreed, for urgency. No waitlist, since nothing would feed it.'],
  ['The legal line sits next to the Join button.', 'And again in checkout, as the PRD asks.'],
  ['The nearest-theater copy was off.', 'State 2 says the closest theater to Bozeman is in Bozeman, 142 miles away.'],
];

export const QUESTIONS = [
  'Can TicketSpice take the promo code in the link? Then nobody has to paste anything. I couldn’t find it in their docs.',
  'How many tickets come with All Access? The prototype uses 3.',
  'Do members who upgrade to All Access get tickets? The member flow offers it.',
  'What do members pay per ticket? The prototype uses $15.',
  'One code for up to 3 seats, or 3 single-use codes?',
  'Can the vendor chatbot be opened from our own buttons? Options 3 and 8 need that.',
];

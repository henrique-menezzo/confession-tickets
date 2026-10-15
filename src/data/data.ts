// Everything the prototype pretends to know. Theaters, prices and the plan are placeholders until the
// inventory sheet and the promo plan land; the numbers live here so they change in one place.

// Film art from the DailyWire+ image CDN, saved with the project so the prototype works offline
// and inside sandboxed hosts that block outside images.
import wide from './film/hero-wide.jpg';
import tall from './film/hero-tall.jpg';
import title from './film/title.png';
import poster from './film/poster.jpg';
import teaser from './film/teaser.jpg';

export const ART = { wide, tall, title, poster, teaser };
const FACES = Object.values(import.meta.glob('./film/cast-*.jpg', { eager: true, import: 'default' })) as string[];

export const CAST = [
  ['James Franco', '18c96d6d-91f5-40d7-b165-8105ab7acd91'],
  ['Rob Lowe', 'bf8a78b1-6575-4738-98ca-31283976c5fa'],
  ['Dean Norris', '744df2ce-e995-4393-95b0-057119bc5721'],
  ['Richard Brake', 'd680e072-c7c8-40cc-aef0-6e18ca17697b'],
  ['Brad Dourif', 'f44baaaa-b567-4983-8cb8-6f4606ecfaa6'],
  ['Emile Hirsch', '648430c0-3356-48e2-b31f-3f260ad84dc2'],
  ['Jennifer Jason Leigh', '18f1e5f0-5db4-4374-b234-b29155e32c1a'],
  ['Nick Nolte', 'da850bdb-ed3f-42f1-a0f6-c0bc01484fde'],
].map(([name], i) => ({ name, img: FACES[i] }));

export const SYNOPSIS =
  'In Stalin’s 1938 Moscow, a disillusioned former literature professor, Alexei, is arrested and brought to the infamous Lubyanka Prison, charged with conspiring with his dissident priest. There, Alexei faces interrogation by his brilliant and brutal former student, Vladimir.';

// November 11, 2026 is a Wednesday (the dev mock says Tuesday).
export const DATE = { day: 'Wed', long: 'Wednesday, November 11', short: 'Nov 11', chip: 'Wed, Nov 11' };

export const FREE_TICKETS = 3; // PRD open question: how many tickets come with All Access
export const TICKET_PRICE = 15; // placeholder member price per ticket
export const RADIUS = 50; // PRD: "if a theater is within ~50 miles"
export const THEATER_COUNT = 100;
export const CODE = '7KQ2M9XT';
export const DISCLOSURE = 'Limited showings in select cities. Confirm local theater availability prior to subscribing.';

// The promo plan: All Access, billed like the live paywall, with the tickets attached.
export const PLAN = { name: 'All Access', price: 15, was: 21, yearly: '174.30' };

export type Status = 'open' | 'few' | 'out';
export interface Show { id: string; time: string; format: string; status: Status }
export interface Theater {
  id: string;
  name: string;
  address: string;
  city: string;
  miles: number;
  bearing: number; // degrees from north, for the map option
  shows: Show[];
}

const T = (id: string, name: string, address: string, city: string, miles: number, bearing: number, shows: [string, string, Status][]): Theater => ({
  id, name, address, city, miles, bearing,
  shows: shows.map(([time, format, status], i) => ({ id: `${id}-${i}`, time, format, status })),
});

// Around Franklin, TN 37064
const NEAR: Theater[] = [
  T('amc-thoroughbred', 'AMC Thoroughbred 20', '633 Frazier Dr', 'Franklin, TN', 4.2, 48, [['7:00 PM', 'Dolby Cinema', 'few'], ['9:30 PM', 'Standard', 'open']]),
  T('regal-green-hills', 'Regal Green Hills', '3815 Green Hills Village Dr', 'Nashville, TN', 13.5, 352, [['7:00 PM', 'Standard', 'open']]),
  T('regal-hollywood', 'Regal Hollywood 27', '719 Thompson Ln', 'Nashville, TN', 16.8, 12, [['7:30 PM', 'Standard', 'open']]),
  T('belcourt', 'Belcourt Theatre', '2102 Belcourt Ave', 'Nashville, TN', 19.1, 356, [['7:00 PM', 'Standard', 'out']]),
  T('regal-opry', 'Regal Opry Mills', '570 Opry Mills Dr', 'Nashville, TN', 27.4, 28, [['7:00 PM', 'Standard', 'out'], ['8:00 PM', 'IMAX', 'few']]),
  T('amc-murfreesboro', 'AMC Murfreesboro 16', '2626 Cason Square Blvd', 'Murfreesboro, TN', 31.6, 98, [['7:00 PM', 'Standard', 'open']]),
];

const FAR_NEAREST = T('cinemark-billings', 'Cinemark Billings', '2456 Central Ave', 'Billings, MT', 142, 78, [['7:00 PM', 'Standard', 'open']]);

// Ten more inside the 50-mile circle around Franklin. Only option 11 lists them, behind Show more.
const NEAR_MORE: Theater[] = [
  T('regal-brentwood', 'Regal Brentwood 12', '700 Old Hickory Blvd', 'Brentwood, TN', 8.7, 20, [['7:00 PM', 'Standard', 'open']]),
  T('marcus-spring-hill', 'Marcus Spring Hill Cinema', '5000 Northfield Ln', 'Spring Hill, TN', 9.6, 200, [['7:00 PM', 'UltraScreen', 'few'], ['9:15 PM', 'Standard', 'open']]),
  T('sm-grill-antioch', 'Studio Movie Grill', '5310 Cane Ridge Rd', 'Antioch, TN', 19.4, 70, [['7:30 PM', 'Standard', 'open']]),
  T('malco-smyrna', 'Malco Smyrna Cinema', '100 Movie Row', 'Smyrna, TN', 22.9, 105, [['7:00 PM', 'Standard', 'out']]),
  T('amc-columbia', 'AMC Columbia 8', '1155 Nashville Hwy', 'Columbia, TN', 24.3, 205, [['7:00 PM', 'Standard', 'open']]),
  T('regal-providence', 'Regal Providence', '401 S Mt Juliet Rd', 'Mt. Juliet, TN', 33.0, 60, [['7:00 PM', 'RPX', 'few']]),
  T('lewisburg-cinema', 'Lewisburg Cinema 5', '1110 N Ellington Pkwy', 'Lewisburg, TN', 34.8, 160, [['7:30 PM', 'Standard', 'open']]),
  T('premiere-dickson', 'Premiere Dickson 8', '226 Henslee Dr', 'Dickson, TN', 36.4, 285, [['7:00 PM', 'Standard', 'open']]),
  T('regal-indian-lake', 'Regal Indian Lake', '300 Indian Lake Blvd', 'Hendersonville, TN', 38.2, 25, [['7:30 PM', 'Standard', 'out']]),
  T('cinemark-lebanon', 'Cinemark Lebanon', '300 Leeville Pike', 'Lebanon, TN', 41.5, 75, [['7:00 PM', 'XD', 'open']]),
];

export interface Lookup { zip: string; place: string; theaters: Theater[]; nearest?: Theater; more?: Theater[] }

const PLACES: Record<string, string> = { '37064': 'Franklin, TN', '37067': 'Franklin, TN', '59718': 'Bozeman, MT', '37203': 'Nashville, TN', '30303': 'Atlanta, GA' };

// Around Atlanta, GA 30303: everything inside the circle is sold out, to show that state.
const SOLD: Theater[] = [
  T('regal-atlantic-sold', 'Regal Atlantic Station', '261 19th St NW', 'Atlanta, GA', 2.3, 330, [['7:00 PM', 'Standard', 'out'], ['9:30 PM', 'Standard', 'out']]),
  T('amc-phipps', 'AMC Phipps Plaza 14', '3500 Peachtree Rd NE', 'Atlanta, GA', 8.1, 8, [['7:00 PM', 'Dolby Cinema', 'out']]),
  T('regal-avalon', 'Regal Avalon', '3950 North Point Pkwy', 'Alpharetta, GA', 24.6, 12, [['7:30 PM', 'IMAX', 'out']]),
];

// Any ZIP works. Mountain West and Alaska ZIPs fall outside every 50-mile circle, everything else
// gets the Nashville set so the flow can be walked from any number.
export function lookup(zip: string): Lookup {
  const place = PLACES[zip] ?? `ZIP ${zip}`;
  const far = /^(59|82|83|99|97)/.test(zip);
  if (far) return { zip, place, theaters: [], nearest: FAR_NEAREST };
  if (zip === '30303') return { zip, place, theaters: SOLD };
  return { zip, place, theaters: NEAR, more: NEAR_MORE };
}

export const LOCATION_ZIP = '37064';

// Before a ZIP is in: a few theaters from across the country, so the list is never empty.
// No distance yet; we only know it once there is a ZIP.
export const SAMPLE: Theater[] = [
  T('amc-burbank', 'AMC Burbank 16', '125 E Palm Ave', 'Los Angeles, CA', 0, 0, [['7:00 PM', 'Dolby Cinema', 'open']]),
  T('regal-union-square', 'Regal Union Square', '850 Broadway', 'New York, NY', 0, 0, [['7:00 PM', 'Standard', 'few']]),
  T('amc-northpark', 'AMC NorthPark 15', '8687 N Central Expy', 'Dallas, TX', 0, 0, [['7:00 PM', 'Dolby Cinema', 'open']]),
  T('regal-atlantic', 'Regal Atlantic Station', '261 19th St NW', 'Atlanta, GA', 0, 0, [['7:30 PM', 'Standard', 'open']]),
  T('harkins-tempe', 'Harkins Tempe Marketplace', '2000 E Rio Salado Pkwy', 'Phoenix, AZ', 0, 0, [['7:00 PM', 'IMAX', 'out']]),
];

// Ten more of the 100, for Show more before a ZIP is in.
export const SAMPLE_MORE: Theater[] = [
  T('amc-river-east', 'AMC River East 21', '322 E Illinois St', 'Chicago, IL', 0, 0, [['7:00 PM', 'Dolby Cinema', 'open']]),
  T('regal-pinnacle', 'Regal Pinnacle', '11240 Parkside Dr', 'Knoxville, TN', 0, 0, [['7:00 PM', 'Standard', 'few']]),
  T('cinemark-west-plano', 'Cinemark West Plano', '3800 Dallas Pkwy', 'Plano, TX', 0, 0, [['7:30 PM', 'XD', 'open']]),
  T('amc-disney-springs', 'AMC Disney Springs 24', '1500 E Buena Vista Dr', 'Orlando, FL', 0, 0, [['7:00 PM', 'Dolby Cinema', 'open']]),
  T('regal-crossroads', 'Regal Crossroads', '206 Crossroads Blvd', 'Cary, NC', 0, 0, [['7:00 PM', 'IMAX', 'out']]),
  T('amc-easton', 'AMC Easton 30', '275 Easton Town Center', 'Columbus, OH', 0, 0, [['7:00 PM', 'Standard', 'open']]),
  T('marcus-majestic', 'Marcus Majestic Cinema', '770 N Springdale Rd', 'Brookfield, WI', 0, 0, [['7:30 PM', 'UltraScreen', 'open']]),
  T('regal-pioneer', 'Regal Pioneer Place', '340 SW Morrison St', 'Portland, OR', 0, 0, [['7:00 PM', 'Standard', 'open']]),
  T('amc-westminster', 'AMC Westminster Promenade 24', '10655 Westminster Blvd', 'Denver, CO', 0, 0, [['7:00 PM', 'Dolby Cinema', 'few']]),
  T('cinemark-tinseltown-jax', 'Cinemark Tinseltown', '4535 Southside Blvd', 'Jacksonville, FL', 0, 0, [['7:00 PM', 'XD', 'open']]),
];

export const isOut = (t: Theater) => t.shows.every((s) => s.status === 'out');
export const allOut = (list: Theater[]) => list.length > 0 && list.every(isOut);
export const firstOpen = (t: Theater) => t.shows.find((s) => s.status !== 'out');
export const bestMatch = (list: Theater[]) => list.find((t) => !isOut(t));

export const FAQ = [
  { q: 'How do my free tickets work?', a: `All Access members get up to ${FREE_TICKETS} tickets with one code. Pick a theater, then enter the code under Promo code at TicketSpice checkout.` },
  { q: 'Can I buy tickets at the theater?', a: 'No. These are private screenings and tickets are only sold through this page. Please don’t contact the theaters directly.' },
  { q: 'Can I bring friends?', a: `Yes. Your code covers up to ${FREE_TICKETS} seats in one checkout, so you can bring two people.` },
  { q: 'When can I stream it?', a: 'Confession comes to DailyWire+ after its theatrical run. Members will get it at no extra cost.' },
];

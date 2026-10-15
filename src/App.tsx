import { useFlow } from './store';
import Checkout from './components/Checkout';
import { Proto, Toast } from './components/Chrome';
import O11 from './options/O11';
import TicketModal from './options/TicketModal';

// One experience now: the finder by the poster (option 11). The other ten are in git history.
export default function App() {
  const user = useFlow((s) => s.user);
  return (
    <>
      {/* a new viewer starts the experience fresh */}
      <O11 key={user} />
      <Checkout />
      <TicketModal />
      <Toast />
      <Proto />
    </>
  );
}

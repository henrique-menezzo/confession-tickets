import { useFlow } from './store';
import Checkout from './components/Checkout';
import { Proto, Toast } from './components/Chrome';
import Index from './options/Index';
import O1 from './options/O1';
import O2 from './options/O2';
import O3 from './options/O3';
import O4 from './options/O4';
import O5 from './options/O5';
import O6 from './options/O6';
import O7 from './options/O7';
import O8 from './options/O8';
import O9 from './options/O9';
import O10 from './options/O10';

const VIEWS = [Index, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10];

export default function App() {
  const opt = useFlow((s) => s.opt);
  const user = useFlow((s) => s.user);
  const View = VIEWS[opt] ?? Index;
  return (
    <>
      {/* a new viewer or option starts the experience fresh */}
      <View key={`${opt}-${user}`} />
      <Checkout />
      <Toast />
      <Proto />
    </>
  );
}

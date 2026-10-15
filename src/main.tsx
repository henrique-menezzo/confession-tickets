import { createRoot } from 'react-dom/client';
import '@fontsource/libre-franklin/latin-400.css';
import '@fontsource/libre-franklin/latin-500.css';
import '@fontsource/libre-franklin/latin-600.css';
import '@fontsource/libre-franklin/latin-700.css';
import '@fontsource/libre-franklin/latin-800.css';
import '@fontsource/libre-caslon-text/latin-400.css';
import '@fontsource/libre-caslon-text/latin-400-italic.css';
import './styles/base.css';
import './styles/page.css';
import './styles/finder.css';
import './styles/o11.css';
import './styles/fv.css';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);

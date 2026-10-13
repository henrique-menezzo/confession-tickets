import { createRoot } from 'react-dom/client';
import '@fontsource/libre-franklin/400.css';
import '@fontsource/libre-franklin/500.css';
import '@fontsource/libre-franklin/600.css';
import '@fontsource/libre-franklin/700.css';
import '@fontsource/libre-franklin/800.css';
import '@fontsource/libre-caslon-text/400.css';
import '@fontsource/libre-caslon-text/400-italic.css';
import './styles/base.css';
import './styles/page.css';
import './styles/finder.css';
import './styles/options.css';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);

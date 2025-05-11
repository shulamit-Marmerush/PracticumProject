import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // ייבוא ה-Provider
import './index.css';
import App from './App.tsx';
import store from './redux/store'; // ייבוא ה-store שלך

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* עטיפת ה-App ב-Provider */}
      <App />
    </Provider>
  </StrictMode>,
);

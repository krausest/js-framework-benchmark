import { createRoot, StrictMode } from 'million/react';

import App from './App';

createRoot(document.getElementById('main')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
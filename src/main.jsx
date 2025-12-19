import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Importação do CSS do Bootstrap (necessária para Tabs, Buttons, Grid, etc.)
import 'bootstrap/dist/css/bootstrap.min.css';

// Opcional: Importe apenas os componentes do Bootstrap que você usa (reduz tamanho do bundle)
// Mas como você está usando Tabs, Tab, grid, buttons, etc., o import completo é mais prático.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/GlobalStyles.css';
import { ConfigProvider } from './contexts/ConfigContext';
import { CartProvider } from './contexts/CartContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ConfigProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ConfigProvider>
    </Router>
  </React.StrictMode>
);

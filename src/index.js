import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import UserProvider from './context/UserContext'; // Importa UserProvider
import './index.css';  // Importa Tailwind CSS

// Obtén el elemento 'root' del DOM
const container = document.getElementById('root');
const root = createRoot(container); // Crea el root con createRoot

// Renderiza la aplicación
root.render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import PlayerContextProvider from './context/PlayerContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>     
      <PlayerContextProvider>
        <App />
        </PlayerContextProvider>
      </BrowserRouter>
  </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import Observe from './observe.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <App />
  <Observe />
  // <React.StrictMode>
  // <App />
  // </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.hydrate(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
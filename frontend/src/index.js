import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import reportWebVitals from './reportWebVitals';
import { fetchAndDisplayAgents } from './api/agentsAPI';
import AgentDashboard from './components/AgentDashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AgentDashboard />
  </React.StrictMode>
);

reportWebVitals();

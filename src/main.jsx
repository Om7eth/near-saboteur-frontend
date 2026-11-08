import React from 'react';
import { createRoot } from 'react-dom/client';
import MovementDemo from './game.jsx';

createRoot(document.getElementById('root')).render(<MovementDemo />);
window.__nsBooted = true; // index.html stops showing its boot-error overlay / slow-download note

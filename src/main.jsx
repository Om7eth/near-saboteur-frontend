import React from 'react';
import { createRoot } from 'react-dom/client';
import MovementDemo from './game.jsx';

// [HOW TO PLAY] If a host rewrote /how-to-play to the game's index.html,
// hop to the real page file instead of loading the game.
if (/^\/how-to-play\/?$/.test(window.location.pathname)) window.location.replace(`${import.meta.env.BASE_URL || '/'}how-to-play/index.html`);

createRoot(document.getElementById('root')).render(<MovementDemo />);
window.__nsBooted = true; // index.html stops showing its boot-error overlay / slow-download note

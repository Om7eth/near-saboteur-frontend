// [IN-MATCH HUD KIT] Shared look for every in-match button and mission
// window: line icons instead of emoji, cut-corner buttons with a label,
// a one-time "tap me" glow for new players, and a floating mission window
// that stays readable on desktop. Pure presentation.
import React from 'react';

export const HUD_ICON = {
  missions: 'M9 5h10M9 12h10M9 19h10M4 5.5l1 1 2-2M4 12.5l1 1 2-2M4 19.5l1 1 2-2',
  sabotage: 'M12 3l2.2 5.3L20 9l-4.4 3.8L17 18.5 12 15.6 7 18.5l1.4-5.7L4 9l5.8-.7z',
  wallet: 'M4 7.5V18a2 2 0 002 2h13a1 1 0 001-1v-3M4 7.5A2 2 0 016 5.5h10.5M4 7.5h15a1 1 0 011 1V11M20 11h-4a2.5 2.5 0 000 5h4a1 1 0 001-1v-3a1 1 0 00-1-1z',
  map: 'M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5zM9 4v13.5M15 6.5V20',
  settings: 'M12 9a3 3 0 100 6 3 3 0 000-6zM19.4 13.5l1.6 1.2-1.8 3.1-1.9-.7a7 7 0 01-1.7 1l-.3 2H10.7l-.3-2a7 7 0 01-1.7-1l-1.9.7-1.8-3.1 1.6-1.2a7 7 0 010-2l-1.6-1.2 1.8-3.1 1.9.7a7 7 0 011.7-1l.3-2h3.6l.3 2a7 7 0 011.7 1l1.9-.7 1.8 3.1-1.6 1.2a7 7 0 010 2z',
  knife: 'M14.5 3.5L20.5 9.5 10 20l-3.5-1.2L5.3 15zM5.3 15l-2.8 2.8 3.7 3.7L9 18.7',
  report: 'M5 21V4M5 4h11l-2 4 2 4H5',
  ghost: 'M5 20V11a7 7 0 0114 0v9l-2.3-1.6L14.3 20 12 18.4 9.7 20l-2.4-1.6zM9.5 11h.01M14.5 11h.01',
  lock: 'M6 11V8a6 6 0 0112 0v3M5 11h14v10H5zM12 15v2.5',
  power: 'M13 2L5 13.5h6L10 22l9-12h-6z',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z',
  mask: 'M3 7c3-1.5 6-1.5 9 0 3-1.5 6-1.5 9 0v4c0 5-4 8-9 9-5-1-9-4-9-9zM8 11.5h2M14 11.5h2M9 16c2 1.2 4 1.2 6 0',
  clock: 'M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z',
  exit: 'M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10',
  pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21zM12 7.5a2 2 0 100 4 2 2 0 000-4z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  siren: 'M6 18v-6a6 6 0 0112 0v6M4 18h16v3H4zM12 2v2M3.5 6l1.5 1.5M20.5 6L19 7.5',
  camera: 'M3 7h4l2-2.5h6L17 7h4v12H3zM12 10a3.5 3.5 0 100 7 3.5 3.5 0 000-7z',
  chart: 'M4 20h16M6 16l4-5 3 3 5-7M15 7h3v3',
  gift: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1-3-5-3.5-5-1s5 1 5 1zm0 0c1-3 5-3.5 5-1s-5 1-5 1z',
  chip: 'M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4',
  cart: 'M3 4h2l2.4 11h10.2L20 8H6.2M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z',
  rocket: 'M12 3c3 2 5 5.5 5 10l-2.5 3h-5L7 13c0-4.5 2-8 5-10zM12 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM9.5 16L8 21l4-2 4 2-1.5-5',
  columns: 'M3 9l9-5 9 5zM5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18',
  swap: 'M7 7h13l-4-4M17 17H4l4 4',
  coin: 'M12 3a9 9 0 100 18 9 9 0 000-18zM9.5 9.5c.4-.9 1.4-1.5 2.5-1.5 1.4 0 2.5.9 2.5 2s-1.1 1.6-2.5 2-2.5.9-2.5 2 1.1 2 2.5 2c1.1 0 2.1-.6 2.5-1.5M12 6.5v1.5M12 16v1.5',
  bolt: 'M13 2L5 13.5h6L10 22l9-12h-6z',
  walletCheck: 'M4 7.5V18a2 2 0 002 2h13a1 1 0 001-1v-3M4 7.5A2 2 0 016 5.5h10.5M4 7.5h15a1 1 0 011 1V11M14 14.5l2 2 4-4',
  hand: 'M8 13V5.5a1.5 1.5 0 013 0V12M11 11V4.5a1.5 1.5 0 013 0V12M14 11.5V6a1.5 1.5 0 013 0v7.5c0 4-2.5 7-6.5 7-2.7 0-4.3-1.3-5.6-3.4L3.4 13.6a1.5 1.5 0 012.5-1.6L8 15',
};

// Mission room -> icon (replaces the emoji that used to lead each label).
export const MISSION_ICON = {
  medbay: 'walletCheck', reactor: 'lock', upper_eng: 'chart', lower_eng: 'gift', electrical: 'bolt',
  storage: 'chip', comms: 'cart', o2: 'rocket', admin: 'columns', shields: 'swap', weapons: 'coin',
  navigation: 'shield', wallet_balance: 'wallet', security: 'camera', cafeteria: 'siren',
};

export function HudIcon({ name, size = 18, color = '#6effc0', w = 1.7, style }) {
  const d = HUD_ICON[name] || HUD_ICON[MISSION_ICON[name]] || HUD_ICON.hand;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...style }} aria-hidden="true">
      <path d={d} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const HUD_CSS = `
.hud-b{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:0;cursor:pointer;
  background:linear-gradient(180deg,rgba(14,22,20,.92),rgba(6,10,9,.92));border:1px solid var(--hc,rgba(110,255,192,.4));
  clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px);
  color:var(--hc-t,#6effc0);font-family:'IBM Plex Mono',monospace;font-weight:600;letter-spacing:.08em;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.06);transition:transform .1s ease,filter .15s;-webkit-tap-highlight-color:transparent}
.hud-b:active{transform:scale(.94)}
.hud-b:hover{filter:brightness(1.15)}
.hud-b>small{font-size:8.5px;line-height:1;color:var(--hc-t,#6effc0);opacity:.9}
.hud-wrap{position:relative;display:inline-flex}
.hud-badge{position:absolute;top:-5px;right:-5px;min-width:17px;height:17px;border-radius:9px;padding:0 4px;display:flex;align-items:center;justify-content:center;font:700 9.5px 'IBM Plex Mono',monospace;color:#fff;background:#ff5a5a;border:1px solid rgba(0,0,0,.4);z-index:2}
.hud-badge.cd{background:rgba(0,0,0,.88);color:var(--hc-t,#ff5c5c);border-color:var(--hc,rgba(255,85,85,.5))}
.hud-badge.ok{top:auto;bottom:-5px;background:#6effc0;color:#06140d}
.hud-glow::before,.hud-glow::after{content:"";position:absolute;inset:-6px;border:2px solid var(--hc-t,#6effc0);pointer-events:none;
  clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px);animation:hudRing 1.6s ease-out infinite}
.hud-glow::after{animation-delay:.8s}
.hud-glow .hud-b{animation:hudPulse 1.6s ease-in-out infinite}
@keyframes hudRing{0%{opacity:.9;transform:scale(.92)}100%{opacity:0;transform:scale(1.35)}}
@keyframes hudPulse{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 22px 2px var(--hc-t,#6effc0)}}
.hud-tip{position:absolute;right:calc(100% + 12px);top:50%;transform:translateY(-50%);white-space:nowrap;pointer-events:none;
  padding:7px 11px;background:var(--hc-t,#6effc0);color:#04130c;font:700 10.5px 'IBM Plex Mono',monospace;letter-spacing:.08em;
  clip-path:polygon(0 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,0 100%);padding-right:16px;animation:hudTip 1.6s ease-in-out infinite}
@keyframes hudTip{0%,100%{transform:translate(0,-50%)}50%{transform:translate(-5px,-50%)}}
.hud-kc{position:absolute;font:700 8.5px 'IBM Plex Mono',monospace;color:#cfe;background:rgba(0,0,0,.85);border:1px solid rgba(255,255,255,.25);border-radius:4px;padding:1px 4px;z-index:2;line-height:1.2}
.mf-back{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;z-index:30;
  background:radial-gradient(ellipse at center,rgba(0,0,0,.55),rgba(0,0,0,.78));backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);animation:mfIn .18s ease-out}
.mf-col{display:flex;flex-direction:column;align-items:stretch;max-height:100%;animation:mfPop .22s cubic-bezier(.2,.9,.3,1.2)}
.mf-tag{align-self:center;display:flex;align-items:center;gap:7px;margin-bottom:8px;padding:5px 12px;background:rgba(6,12,10,.9);border:1px solid rgba(110,255,192,.35);
  font:600 10px 'IBM Plex Mono',monospace;letter-spacing:.14em;color:#6effc0;clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)}
.mf-tag span{color:#7d8d86}
.mf-body{overflow:auto;max-height:100%;display:flex;justify-content:center}
@keyframes mfIn{from{opacity:0}to{opacity:1}}
@keyframes mfPop{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
`;

/**
 * Square HUD button: icon + short label, optional badge/keycap, and a
 * one-time glow + pointer tip for players who haven't opened it yet.
 */
export function HudButton({ icon, label, onClick, color = '#6effc0', border, size = 52, badge, badgeKind, keycap, keyAt, glow, tip, ariaLabel, sfx, children, iconSize }) {
  return (
    <span className={`hud-wrap ${glow ? 'hud-glow' : ''}`} style={{ '--hc': border || `${color}66`, '--hc-t': color }}>
      <button type="button" className="hud-b" onClick={onClick} aria-label={ariaLabel || label} data-sfx={sfx}
        style={{ width: size, height: size }}>
        {children || <HudIcon name={icon} size={iconSize || Math.round(size * 0.42)} color={color} />}
        {label ? <small>{label}</small> : null}
      </button>
      {badge != null && badge !== false && <span className={`hud-badge ${badgeKind || ''}`}>{badge}</span>}
      {keycap && <span className="hud-kc" style={keyAt || { top: -6, left: -6 }}>{keycap}</span>}
      {glow && tip && <span className="hud-tip">{tip}</span>}
    </span>
  );
}

/**
 * Floating mission window: keeps the map visible behind a light dim, shows
 * which mission/room this is, and scales the (phone-sized) mission card up
 * on desktop so it reads properly on a big screen.
 */
export function MissionFloat({ k = 1, title, place, children }) {
  const maxH = typeof window !== 'undefined' ? Math.max(300, (window.innerHeight - 32) / k) : undefined;
  return (
    <div className="mf-back">
      <div className="mf-col" style={{ zoom: k, maxHeight: maxH }}>
        {title && <div className="mf-tag"><HudIcon name={place} size={13} />MISSION · {title}</div>}
        <div className="mf-body">{children}</div>
      </div>
    </div>
  );
}

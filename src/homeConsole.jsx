// [HOME CONSOLE] Desktop: one big "console" window over the hangar art with a
// left rail (Activity, Wallet, Ranks, Inbox, Friends, News, Settings), so every
// Home button opens a real desktop layout instead of a phone-sized popup.
// Mobile: each one is a full-screen page with a back button. Pure presentation -
// all data and actions come in as props from game.jsx (approved mockup:
// mockups/console-activity-mockup.html).
import React, { useEffect, useMemo, useState } from 'react';

const P = {
  activity: 'M3 12h4l2.5-6 4 12 2.5-6H21',
  wallet: 'M4 7.5V18a2 2 0 002 2h13a1 1 0 001-1v-3M4 7.5A2 2 0 016 5.5h10.5M4 7.5h15a1 1 0 011 1V11M20 11h-4a2.5 2.5 0 000 5h4a1 1 0 001-1v-3a1 1 0 00-1-1z',
  ranks: 'M9 20V11h6v9M3 20v-5h6M15 20v-7h6v7M2 20h20M12 3.5l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z',
  inbox: 'M3 13l3-8h12l3 8v6H3zM3 13h5l1.5 2.5h5L16 13h5',
  friends: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6M16 4.5a3.5 3.5 0 010 6.5M18 14.5c2.1.8 3.5 2.9 3.5 5.5',
  news: 'M4 5h13v14H6a2 2 0 01-2-2zM17 9h3v8a2 2 0 01-2 2M7.5 9h6M7.5 12.5h6M7.5 16h3.5',
  settings: 'M12 9a3 3 0 100 6 3 3 0 000-6zM19.4 13.5l1.6 1.2-1.8 3.1-1.9-.7a7 7 0 01-1.7 1l-.3 2H10.7l-.3-2a7 7 0 01-1.7-1l-1.9.7-1.8-3.1 1.6-1.2a7 7 0 010-2l-1.6-1.2 1.8-3.1 1.9.7a7 7 0 011.7-1l.3-2h3.6l.3 2a7 7 0 011.7 1l1.9-.7 1.8 3.1-1.6 1.2a7 7 0 010 2z',
  free: 'M7 8h10a4 4 0 014 4v1.5a3.5 3.5 0 01-6.3 2.1L13.5 14h-3l-1.2 1.6A3.5 3.5 0 013 13.5V12a4 4 0 014-4zM8 10.5v3M6.5 12h3',
  pool: 'M12 7.5a2 2 0 100-4 2 2 0 000 4zM4 16c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 16v2c0 1.7 3.6 3 8 3s8-1.3 8-3v-2',
  paid: 'M3 7.5h14a1 1 0 011 1V17a1 1 0 01-1 1H3a1 1 0 01-1-1V8.5a1 1 0 011-1zM6 5h15a1 1 0 011 1v8.5M10 10.5c-.6-.6-1.3-.8-2-.8-1 0-1.8.5-1.8 1.3 0 1.8 3.8.9 3.8 2.7 0 .8-.8 1.3-1.9 1.3-.8 0-1.5-.3-2.1-.9',
  back: 'M15 5l-7 7 7 7',
  clock: 'M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z',
  report: 'M4 4h16v12H8l-4 4z',
  eye: 'M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12zM12 9.3a2.7 2.7 0 100 5.4 2.7 2.7 0 000-5.4z',
  eyeOff: 'M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12zM12 9.3a2.7 2.7 0 100 5.4 2.7 2.7 0 000-5.4zM4 20L20 4',
  refresh: 'M19 9a7 7 0 10.7 5M19 3.5V9h-5.5',
  send: 'M12 19V5M6 11l6-6 6 6',
  receive: 'M12 5v14M6 13l6 6 6-6',
  swap: 'M7 7h13l-4-4M17 17H4l4 4',
  trash: 'M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13',
  chev: 'M9 5l7 7-7 7',
};
const MODE_C = { free: '#6effc0', pool: '#8fe3ff', paid: '#ffd75e', sponsor: '#ffd75e' };

function Ico({ d, c = '#7dffc8', w = 1.7, s }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={s ? { width: s, height: s } : undefined}>
      <path d={d} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CSS = `
.hc{position:fixed;inset:0;z-index:300;color:#e6ece9;font-family:'IBM Plex Sans',system-ui,sans-serif;--m:#6effc0;--c:#8fe3ff;--g:#ffd75e;--r:#ff6b6b;--dim:#7d8d86;--line:rgba(255,255,255,.07);--mono:'IBM Plex Mono',monospace;--disp:'Space Grotesk',sans-serif;background:#030605}
.hc *{box-sizing:border-box}
.hc-win button,.hc-m button{font:inherit;color:inherit;background:none;border:none;cursor:pointer;padding:0;margin:0;-webkit-tap-highlight-color:transparent}
.hc a{color:inherit}
.hc-bg{position:absolute;inset:-6%;background-size:cover;background-position:center;filter:blur(18px) brightness(.32) saturate(.8);pointer-events:none}
.hc ::-webkit-scrollbar{width:5px;height:5px}.hc ::-webkit-scrollbar-thumb{background:rgba(110,255,192,.22);border-radius:4px}
/* desktop window */
.hc-win{position:absolute;inset:clamp(14px,3.5vh,36px) clamp(14px,3vw,44px);display:grid;grid-template-columns:232px minmax(0,1fr);border:1px solid rgba(110,255,192,.22);background:rgba(4,9,8,.92);clip-path:polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px));box-shadow:0 30px 80px rgba(0,0,0,.6)}
.hc-win:before{content:"";position:absolute;left:0;top:0;width:180px;height:2px;background:var(--m);box-shadow:0 0 12px var(--m);z-index:1}
.hc-rail{border-right:1px solid var(--line);padding:22px 14px;display:flex;flex-direction:column;gap:4px;background:linear-gradient(180deg,rgba(110,255,192,.04),transparent 40%);min-height:0;overflow:auto}
.hc-me{display:flex;gap:10px;align-items:center;padding:4px 6px 18px;border-bottom:1px solid var(--line);margin-bottom:12px;min-width:0}
.hc-me img{width:44px;height:44px;flex-shrink:0;object-fit:cover;object-position:top;border-radius:50%;background:#0b1512;border:1px solid rgba(110,255,192,.35)}
.hc-me b{display:block;font-family:var(--disp);font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hc-me span{display:block;font:11px var(--mono);color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-nav{display:flex !important;align-items:center;gap:11px;padding:10px 12px !important;border-radius:8px;color:#a9b8b1 !important;font:500 13px var(--disp) !important;letter-spacing:.14em;text-align:left;position:relative;width:100%}
.hc-nav svg{width:19px;height:19px;flex-shrink:0}
.hc-nav:hover{background:rgba(255,255,255,.035) !important;color:#dfe9e4 !important}
.hc-nav.on{background:rgba(110,255,192,.1) !important;color:var(--m) !important}
.hc-nav.on:before{content:"";position:absolute;left:-14px;top:8px;bottom:8px;width:3px;background:var(--m);box-shadow:0 0 10px var(--m)}
.hc-nav i{margin-left:auto;font:600 10px var(--mono);font-style:normal;background:var(--r);color:#fff;border-radius:99px;padding:1px 6px}
.hc-back{margin-top:auto !important;display:flex !important;gap:10px;align-items:center;padding:12px !important;border-radius:8px;border:1px solid var(--line) !important;font:500 12px var(--mono) !important;color:var(--dim) !important;letter-spacing:.08em;white-space:nowrap}
.hc-back svg{width:16px;height:16px;flex-shrink:0}.hc-back:hover{color:#dfe9e4 !important}
.hc-back kbd{margin-left:auto;font:10px var(--mono);border:1px solid #333;border-radius:4px;padding:1px 5px}
.hc-main{display:flex;flex-direction:column;min-width:0;min-height:0}
.hc-hd{display:flex;align-items:flex-end;gap:16px;padding:22px 28px 16px;flex-wrap:wrap}
.hc-hd h1{margin:0;font:700 26px var(--disp);letter-spacing:.2em}
.hc-hd p{margin:4px 0 0;font:12px var(--mono);color:var(--dim)}
.hc-hd-r{margin-left:auto;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.hc-stats{display:flex;gap:10px}
.hc-st{min-width:112px;padding:9px 14px;border:1px solid var(--line);background:rgba(255,255,255,.02);clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)}
.hc-st b{display:flex;align-items:center;gap:6px;font:600 20px var(--disp)}.hc-st b img{width:17px}
.hc-st span{font:10px var(--mono);color:var(--dim);letter-spacing:.1em;text-transform:uppercase}
.hc-filters{display:flex;gap:6px;padding:0 28px 14px;border-bottom:1px solid var(--line);overflow-x:auto}
.hc-chip{padding:6px 13px !important;border-radius:99px;border:1px solid var(--line) !important;font:500 11px var(--mono) !important;letter-spacing:.1em;color:#9fb0a8 !important;white-space:nowrap}
.hc-chip.on{border-color:rgba(110,255,192,.5) !important;color:var(--m) !important;background:rgba(110,255,192,.08) !important}
.hc-chip em{font-style:normal;opacity:.6;margin-left:5px}
.hc-split{flex:1;display:grid;grid-template-columns:minmax(300px,372px) minmax(0,1fr);min-height:0}
.hc-split.bt{border-top:1px solid var(--line)}
.hc-split.wide{grid-template-columns:minmax(340px,440px) minmax(0,1fr)}
.hc-split.rk{grid-template-columns:minmax(380px,500px) minmax(0,1fr)}
.hc-list{overflow:auto;padding:14px 14px 30px 28px;border-right:1px solid var(--line);min-height:0}
.hc-det{overflow:auto;padding:22px 26px 34px;min-height:0;min-width:0}
.hc-pane{flex:1;overflow:auto;padding:22px 28px 34px;border-top:1px solid var(--line);min-height:0}
.hc-day{font:600 10.5px var(--mono);letter-spacing:.18em;color:var(--dim);margin:14px 0 8px;text-transform:uppercase}
.hc-day:first-child{margin-top:0}
.hc-empty{padding:36px 12px;text-align:center;font:12.5px var(--mono);color:var(--dim);border:1px dashed rgba(255,255,255,.12)}
.hc-err{color:#ff8a8a}
.hc-skel{height:64px;margin-bottom:7px;background:rgba(255,255,255,.045);animation:hcPulse 1.4s ease-in-out infinite}
@keyframes hcPulse{0%,100%{opacity:.5}50%{opacity:1}}
/* game card */
.hc-gc{width:100%;display:grid !important;grid-template-columns:40px minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 12px !important;border:1px solid var(--line) !important;background:rgba(255,255,255,.018) !important;margin-bottom:7px !important;text-align:left;position:relative;border-radius:4px}
.hc-gc:hover{border-color:rgba(255,255,255,.16) !important}
.hc-gc.on{border-color:rgba(110,255,192,.55) !important;background:rgba(110,255,192,.06) !important}
.hc-gc.on:after{content:"";position:absolute;right:-15px;top:50%;width:14px;height:1px;background:rgba(110,255,192,.55)}
.hc-mi{width:40px;height:40px;display:flex;align-items:center;justify-content:center;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)}
.hc-mi svg{width:20px;height:20px}
.hc-mi.free{background:rgba(110,255,192,.13)}.hc-mi.pool{background:rgba(143,227,255,.14)}.hc-mi.paid,.hc-mi.sponsor{background:rgba(255,215,94,.14)}
.hc-gc .t{min-width:0}.hc-gc .t b{display:block;font:600 14px var(--disp);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-gc .t span{display:block;font:11px var(--mono);color:var(--dim);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-md{font-style:normal;font-weight:600;letter-spacing:.1em}
.hc-pips{display:flex;gap:3px;margin-top:7px;align-items:center;flex-wrap:wrap}.hc-pips i{width:14px;height:4px;border-radius:2px;background:var(--r);opacity:.85}.hc-pips i.w{background:var(--m)}
.hc-pips small{font:10.5px var(--mono);color:var(--dim);margin-left:6px;line-height:4px}
.hc-gc .v{text-align:right}.hc-gc .v b{display:block;font:600 15px var(--disp);color:var(--g)}
.hc-gc .v span{display:block;font:11px var(--mono);color:var(--c);margin-top:2px;white-space:nowrap}
.hc-tag{display:inline-block;font:600 9px var(--mono);letter-spacing:.12em;padding:2px 6px;border-radius:3px}
.hc-tag.free{color:var(--m);background:rgba(110,255,192,.1)}.hc-tag.pool{color:var(--c);background:rgba(143,227,255,.12)}.hc-tag.paid,.hc-tag.sponsor{color:var(--g);background:rgba(255,215,94,.12)}
/* detail */
.hc-dtop{display:flex;align-items:flex-start;gap:14px}
.hc-dtop h2{margin:8px 0 0;font:700 24px var(--disp);letter-spacing:.04em;word-break:break-word}
.hc-dtop p{margin:5px 0 0;font:12px var(--mono);color:var(--dim)}
.hc-dtop .res{margin-left:auto;text-align:right}
.hc-big{display:inline-block;white-space:nowrap;font:700 13px var(--mono);letter-spacing:.2em;padding:6px 12px;border:1px solid}
.hc-big.w{color:var(--m);border-color:rgba(110,255,192,.45);background:rgba(110,255,192,.07)}
.hc-big.l{color:var(--r);border-color:rgba(255,107,107,.4);background:rgba(255,107,107,.06)}
.hc-big.e{color:var(--g);border-color:rgba(255,215,94,.4);background:rgba(255,215,94,.06)}
.hc-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:20px 0 22px}
.hc-tile{padding:13px 15px;border:1px solid var(--line);background:rgba(255,255,255,.02);min-width:0}
.hc-tile b{display:block;font:600 22px var(--disp);white-space:nowrap}.hc-tile>span{font:10.5px var(--mono);color:var(--dim);letter-spacing:.08em}
.hc-tile small{display:block;font:11px var(--mono);color:#9fb0a8;margin-top:5px}
.hc-sec{font:600 10.5px var(--mono);letter-spacing:.18em;color:var(--dim);margin:6px 0 9px;display:flex;align-items:center;gap:10px}
.hc-sec:after{content:"";flex:1;height:1px;background:var(--line)}
.hc-tw{overflow-x:auto}
.hc table{width:100%;border-collapse:collapse}
.hc th{font:500 9.5px var(--mono);letter-spacing:.08em;color:var(--dim);text-align:left;padding:0 7px 8px;text-transform:uppercase;white-space:nowrap}
.hc th.n,.hc td.n{text-align:right}
.hc td{padding:11px 7px;border-top:1px solid var(--line);font:12.5px var(--mono);color:#cfd8d3;white-space:nowrap}
.hc tr.best td{background:rgba(255,215,94,.04)}
.hc-role{font:600 10px var(--mono);letter-spacing:.1em;padding:3px 7px;border-radius:3px}
.hc-role.s{color:#ff8a8a;background:rgba(255,107,107,.12)}.hc-role.c{color:var(--m);background:rgba(110,255,192,.1)}
.hc-wl{font-weight:600}.hc-wl.w{color:var(--m)}.hc-wl.l{color:var(--r)}
.hc-pts{color:var(--g) !important;font-weight:600}
.hc-cap{display:inline-block;margin-left:6px;font:10px var(--mono);color:#ffb84d;border:1px solid rgba(255,184,77,.35);border-radius:3px;padding:0 4px;cursor:help}
.hc-sab{color:var(--c) !important}.hc-sab a{color:var(--c);opacity:.75;margin-left:4px;text-decoration:none}
.hc-dash{color:#4b5752}
.hc-note{margin-top:10px;font:11.5px var(--mono);color:#9fb0a8;line-height:1.5}
.hc-note b{color:#ffb84d;font-weight:500}
.hc-podium{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.hc-pl{display:flex;align-items:center;gap:9px;padding:10px;border:1px solid var(--line);background:rgba(255,255,255,.02);min-width:0}
.hc-pl.me{border-color:rgba(110,255,192,.5);background:rgba(110,255,192,.06)}
.hc-pl .rk{font:700 18px var(--disp);width:20px;flex-shrink:0}
.hc-pl img{width:34px;height:34px;flex-shrink:0;object-fit:cover;object-position:top;border-radius:50%;background:#0b1512}
.hc-pl .nm{min-width:0;flex:1}.hc-pl .nm b,.hc-pl .nm span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-pl .nm b{font:600 13px var(--disp)}.hc-pl .nm span{font:10.5px var(--mono);color:var(--dim)}
.hc-pl .pz{text-align:right;font:600 12px var(--mono);color:var(--m);white-space:nowrap}.hc-pl .pz small{display:block;color:var(--g);font-weight:500}
.hc-you{font:600 9.5px var(--mono);color:var(--m);margin-left:4px;letter-spacing:.08em}
/* buttons */
.hc-gear{display:flex !important;align-items:center;gap:8px;padding:8px 13px !important;border:1px solid var(--line) !important;border-radius:6px;font:500 11px var(--mono) !important;letter-spacing:.1em;color:#9fb0a8 !important;white-space:nowrap}
.hc-gear svg{width:15px;height:15px}.hc-gear:hover{border-color:rgba(255,255,255,.2) !important}
.hc-gear.hi{border-color:rgba(110,255,192,.4) !important;color:var(--m) !important}
.hc-gear.red{border-color:rgba(255,107,107,.35) !important;color:#ff8a8a !important}
.hc-act{display:flex !important;align-items:center;justify-content:center;gap:8px;padding:11px 16px !important;background:var(--m) !important;color:#04130c !important;font:700 12px var(--disp) !important;letter-spacing:.16em;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))}
.hc-act svg{width:15px;height:15px}.hc-act.ghost{background:rgba(110,255,192,.1) !important;color:var(--m) !important;box-shadow:inset 0 0 0 1px rgba(110,255,192,.4)}
.hc-act:disabled{opacity:.45;cursor:default}
.hc-seg{display:inline-flex;padding:3px;border:1px solid var(--line);border-radius:7px;background:rgba(0,0,0,.3)}
.hc-seg button{padding:7px 16px !important;border-radius:5px;font:600 11px var(--mono) !important;letter-spacing:.12em;color:var(--dim) !important}
.hc-seg button.on{background:rgba(110,255,192,.13) !important;color:var(--m) !important}
/* wallet */
.hc-vault{position:relative;padding:20px;border:1px solid rgba(110,255,192,.3);background:radial-gradient(120% 140% at 0 0,rgba(110,255,192,.12),transparent 60%),rgba(255,255,255,.02);clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))}
.hc-vault .lab{display:flex;align-items:center;gap:6px;font:500 10.5px var(--mono);letter-spacing:.16em;color:var(--dim)}
.hc-vault .lab button{width:28px;height:28px;display:flex !important;align-items:center;justify-content:center;border:1px solid var(--line) !important;border-radius:6px}
.hc-vault .lab button:first-of-type{margin-left:auto}
.hc-vault .lab svg{width:15px;height:15px}
.hc-vault .amt{display:block;font:700 40px var(--disp);margin:6px 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hc-vault .amt small{font-size:16px;color:var(--m)}
.hc-vault .sub{font:11.5px var(--mono);color:var(--dim)}
.hc-testnet{display:flex;gap:9px;align-items:flex-start;margin-top:12px;padding:9px 11px;border:1px solid rgba(255,207,110,.4);background:rgba(255,207,110,.08)}
.hc-testnet b{flex-shrink:0;font:700 10px var(--mono);letter-spacing:.14em;color:#1c1203;background:#ffcf6e;padding:2px 6px}
.hc-testnet span{font:11.5px var(--mono);color:#e9d7a8;line-height:1.45}
.hc-addr{display:flex;align-items:center;gap:8px;margin-top:12px;padding:8px 10px;background:rgba(0,0,0,.32);border:1px solid var(--line);font:12px var(--mono);color:#c7d0cb;min-width:0}
.hc-addr span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-acts{display:flex;gap:8px;margin-top:16px}.hc-acts .hc-act{flex:1;padding:11px 6px !important}
.hc-row{width:100%;display:flex !important;align-items:center;gap:12px;padding:12px 6px !important;border-bottom:1px solid var(--line) !important;text-align:left}
.hc-row:hover{background:rgba(255,255,255,.02) !important}
.hc-row .tt{flex:1;min-width:0}
.hc-row .tt b{display:block;font:600 14px var(--disp);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-row .tt span{display:block;font:11px var(--mono);color:var(--dim);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-row .ta{text-align:right;font:600 14px var(--mono);white-space:nowrap}.hc-row .ta small{display:block;font:10.5px var(--mono);color:var(--dim);font-weight:400}
.hc-ti{width:36px;height:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid currentColor;border-radius:8px;background:rgba(255,255,255,.02)}
.hc-ti svg{width:17px;height:17px}
.hc-tokimg{width:36px;height:36px;border-radius:50%;flex-shrink:0;object-fit:cover;background:rgba(255,255,255,.04)}
.hc-row .tt b .hc-badge,.hc-badge{display:inline-block !important;margin-top:0 !important;font:600 9px var(--mono) !important;letter-spacing:.1em;padding:2px 6px;border-radius:3px;margin-left:6px;vertical-align:middle}
.hc-utabs{display:flex;gap:22px;border-bottom:1px solid var(--line)}
.hc-utabs button{padding:10px 0 !important;font:600 12px var(--disp) !important;letter-spacing:.16em;color:var(--dim) !important;border-bottom:2px solid transparent !important;margin-bottom:-1px !important}
.hc-utabs button.on{color:var(--m) !important;border-color:var(--m) !important}
.hc-utabs em{font:10px var(--mono);font-style:normal;margin-left:6px;opacity:.7}
.hc-nfts{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;padding-top:12px}
.hc-nft{border:1px solid var(--line);background:rgba(255,255,255,.02);overflow:hidden}
.hc-nft .im{aspect-ratio:1/1;background:linear-gradient(135deg,#062019,#0f3a2e);display:flex;align-items:center;justify-content:center;position:relative}
.hc-nft .im img{width:100%;height:100%;object-fit:cover}
.hc-nft b{display:block;font:600 13px var(--disp);padding:8px 10px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-nft span{display:block;font:10.5px var(--mono);color:var(--dim);padding:2px 10px 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* ranks */
.hc-reset{display:flex;align-items:center;gap:7px;font:11.5px var(--mono);color:var(--dim)}.hc-reset svg{width:15px;height:15px}
.hc-pod{display:grid;grid-template-columns:1fr 1.15fr 1fr;align-items:end;gap:10px;margin:6px 0 18px}
.hc-pc{text-align:center;display:flex;flex-direction:column;align-items:center;min-width:0}
.hc-pc img{width:92px;height:92px;object-fit:contain;filter:drop-shadow(0 8px 12px rgba(0,0,0,.6))}.hc-pc.r1 img{width:120px;height:120px}
.hc-pc b{font:600 15px var(--disp);margin-top:4px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hc-pc>span{font:10.5px var(--mono);color:var(--dim);max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-crown{font:700 12px var(--mono);letter-spacing:.1em;margin-bottom:4px}
.hc-pc.r1 .hc-crown{color:var(--g)}.hc-pc.r2 .hc-crown{color:#c9d3d9}.hc-pc.r3 .hc-crown{color:#d9965c}
.hc-ped{width:100%;margin-top:10px;padding:12px 0;border:1px solid var(--line);border-bottom:none;background:linear-gradient(180deg,rgba(255,255,255,.05),transparent)}
.hc-pc.r1 .hc-ped{padding:22px 0;border-color:rgba(255,215,94,.4);background:linear-gradient(180deg,rgba(255,215,94,.12),transparent)}
.hc-pc.r2 .hc-ped{padding:15px 0}
.hc-ped em{display:block;font:700 19px var(--disp);font-style:normal;color:var(--g)}.hc-ped small{font:10px var(--mono);color:var(--dim);letter-spacing:.14em}
.hc-lr{display:grid;grid-template-columns:40px 34px minmax(0,1fr) 90px;align-items:center;gap:10px;padding:9px 10px;border-bottom:1px solid var(--line)}
.hc-lr.head{font:500 10px var(--mono);letter-spacing:.12em;color:var(--dim);padding-top:0}
.hc-lr .rk{font:600 13px var(--mono);color:var(--dim)}
.hc-lr img{width:32px;height:32px;object-fit:cover;object-position:top;border-radius:50%;background:#0b1512}
.hc-lr .nm{min-width:0}.hc-lr .nm b{display:flex;align-items:center;gap:4px;font:600 14px var(--disp);white-space:nowrap;overflow:hidden}
.hc-lr .nm span{display:block;font:10.5px var(--mono);color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-lr .pt{font:600 14px var(--mono);color:var(--g);text-align:right}
.hc-lr.me{border:1px solid rgba(110,255,192,.45);background:rgba(110,255,192,.07)}.hc-lr.me .rk{color:var(--m)}
.hc-gap{text-align:center;color:#4b5752;padding:4px 0;letter-spacing:.3em}
/* inbox + news */
.hc-ml{width:100%;display:flex !important;align-items:flex-start;gap:12px;padding:13px 12px !important;border:1px solid var(--line) !important;margin-bottom:7px !important;text-align:left;background:rgba(255,255,255,.018) !important;position:relative;border-radius:4px}
.hc-ml:hover{border-color:rgba(255,255,255,.16) !important}
.hc-ml.on{border-color:rgba(110,255,192,.55) !important;background:rgba(110,255,192,.06) !important}
.hc-ml .tt{flex:1;min-width:0}
.hc-ml .tt b{display:block;font:600 14px var(--disp);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#cfd8d3}
.hc-ml .tt span{display:block;font:11px var(--mono);color:var(--dim);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-ml .tt .tg{display:block;font:600 9.5px var(--mono);letter-spacing:.12em;color:var(--m);margin-bottom:4px}
.hc-ml small{font:10.5px var(--mono);color:var(--dim);white-space:nowrap}
.hc-ml.un:before{content:"";position:absolute;left:-5px;top:50%;width:8px;height:8px;margin-top:-4px;border-radius:50%;background:var(--m);box-shadow:0 0 8px var(--m)}
.hc-ml.un .tt b{color:#fff}
.hc-ah{margin:0;font:700 22px var(--disp);letter-spacing:.02em;word-break:break-word}
.hc-am{margin:5px 0 0;font:11.5px var(--mono);color:var(--dim)}
.hc-art{margin-top:20px;font-size:15px;line-height:1.65;color:#c9d4cf;max-width:680px;white-space:pre-wrap;word-break:break-word}
.hc-art img{display:block;max-width:100%;margin-top:16px;border:1px solid var(--line)}
.hc-form{display:flex;flex-direction:column;gap:14px;margin-top:18px;max-width:560px}
.hc-form label{display:flex;flex-direction:column;gap:7px;font:500 10.5px var(--mono);letter-spacing:.14em;color:var(--dim)}
.hc-form input,.hc-form textarea{background:rgba(0,0,0,.4);border:1px solid rgba(110,255,192,.22);color:#fff;padding:11px 12px;font:14px 'IBM Plex Sans',sans-serif;outline:none;border-radius:4px;resize:vertical;width:100%}
.hc-form input:focus,.hc-form textarea:focus{border-color:var(--m)}
/* friends */
.hc-soon{max-width:620px;margin:10px auto;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
.hc-soon img{width:76px;height:76px;object-fit:contain}.hc-soon h2{margin:0;font:700 26px var(--disp)}.hc-soon p{margin:0;color:#9fb0a8;line-height:1.6;max-width:480px}
.hc-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;margin-top:8px}
.hc-steps div{padding:14px 10px;border:1px solid var(--line);font:12px var(--mono);color:#cfd8d3;background:rgba(255,255,255,.02)}
.hc-steps b{display:block;font:700 22px var(--disp);color:var(--m);margin-bottom:4px}
/* settings */
.hc-sets{max-width:760px;display:flex;flex-direction:column;gap:14px}
.hc-sc{border:1px solid var(--line);background:rgba(255,255,255,.02);padding:6px 18px}
.hc-sc.prof{display:flex;align-items:center;gap:14px;padding:16px 18px;border-color:rgba(110,255,192,.25)}
.hc-sc.prof img{width:56px;height:56px;flex-shrink:0;object-fit:cover;object-position:top;border-radius:50%;background:#0b1512;border:1px solid rgba(110,255,192,.4)}
.hc-sc.prof .nm{min-width:0}
.hc-sc.prof b{display:block;font:600 18px var(--disp);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hc-sc.prof span{font:11.5px var(--mono);color:var(--dim)}.hc-sc.prof .hc-gear{margin-left:auto}
.hc-sh{font:600 10.5px var(--mono);letter-spacing:.18em;color:var(--dim);padding:10px 0 4px}
.hc-srow{width:100%;display:flex !important;align-items:center;gap:12px;padding:13px 0 !important;border-top:1px solid var(--line) !important;text-align:left}
.hc-sh+.hc-srow{border-top:none !important}
.hc-srow b{display:block;font:600 14px var(--disp)}.hc-srow span{font:11px var(--mono);color:var(--dim)}
.hc-srow>div{flex:1}.hc-srow svg{width:16px;height:16px}.hc-srow.danger b{color:var(--r)}
.hc-tg{width:44px;height:24px;border-radius:99px;background:#26302c;position:relative;flex-shrink:0;transition:background .2s}
.hc-tg i{position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:#9fb0a8;transition:all .2s}
.hc-tg.on{background:rgba(110,255,192,.35)}.hc-tg.on i{left:23px;background:var(--m);box-shadow:0 0 8px var(--m)}
/* mobile */
.hc-m .hc-bg{inset:0;filter:blur(20px) brightness(.22)}
.hc-page{position:absolute;inset:0;display:flex;flex-direction:column;transition:transform .28s cubic-bezier(.2,.8,.2,1),opacity .28s;background:transparent}
.hc-page.sub{transform:translateX(100%);background:#040807}
.hc-mwrap{position:absolute;inset:0;overflow:hidden}
.hc-mwrap.open .hc-page.sub{transform:none}
.hc-mwrap.open .hc-page.top{transform:translateX(-30%);opacity:0;pointer-events:none}
.hc-mh{display:flex;align-items:center;gap:10px;padding:calc(14px + env(safe-area-inset-top,0px)) 16px 12px;flex-shrink:0}
.hc-mh .bk{width:40px;height:40px;flex-shrink:0;border-radius:10px;border:1px solid var(--line) !important;display:flex !important;align-items:center;justify-content:center;background:rgba(255,255,255,.03) !important}
.hc-mh .bk svg{width:18px;height:18px}
.hc-mh h1{margin:0;font:700 19px var(--disp);letter-spacing:.18em}
.hc-mh p{margin:2px 0 0;font:10.5px var(--mono);color:var(--dim)}
.hc-mh .r{margin-left:auto}
.hc-mbody{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 16px calc(30px + env(safe-area-inset-bottom,0px));min-height:0}
.hc-mstats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:0 16px 12px;flex-shrink:0}
.hc-mstats div{padding:8px 4px;border:1px solid var(--line);background:rgba(255,255,255,.025);text-align:center;min-width:0}
.hc-mstats b{display:block;font:600 16px var(--disp);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hc-mstats span{font:8.5px var(--mono);color:var(--dim);letter-spacing:.06em;text-transform:uppercase}
.hc-m .hc-filters{padding:0 16px 10px;border:none;flex-shrink:0}
.hc-m .hc-chip{padding:8px 13px !important}
.hc-m .hc-gc{grid-template-columns:38px minmax(0,1fr) auto;padding:12px !important;min-height:64px}
.hc-m .hc-gc.on{border-color:var(--line) !important;background:rgba(255,255,255,.018) !important}.hc-m .hc-gc.on:after{display:none}
.hc-m .hc-mi{width:38px;height:38px}
.hc-m .hc-dtop{flex-direction:column;gap:10px}.hc-m .hc-dtop h2{font-size:20px}.hc-m .hc-dtop .res{margin-left:0}
.hc-m .hc-tiles{grid-template-columns:1fr 1fr;gap:8px;margin:14px 0 18px}
.hc-m .hc-tile{padding:11px 12px}.hc-m .hc-tile b{font-size:19px}
.hc-mm{border:1px solid var(--line);background:rgba(255,255,255,.02);padding:11px 12px;margin-bottom:8px}
.hc-mm.best{border-color:rgba(255,215,94,.4)}
.hc-mm .r1{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.hc-mm .r1 .n{font:600 11px var(--mono);color:var(--dim)}
.hc-mm .r1 .p{margin-left:auto;font:600 15px var(--disp);color:var(--g)}
.hc-mm .r2{display:grid;grid-template-columns:repeat(4,1fr);margin-top:10px;gap:4px}
.hc-mm .r2 div{text-align:center}.hc-mm .r2 b{display:block;font:600 14px var(--mono)}.hc-mm .r2 span{font:8.5px var(--mono);color:var(--dim);letter-spacing:.06em;text-transform:uppercase}
.hc-mm .r3{margin-top:8px;font:11px var(--mono);color:var(--c);display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.hc-mm .r3 a{color:var(--c);text-decoration:none}.hc-mm .r3 .hc-cap{margin-left:0}
.hc-m .hc-podium{grid-template-columns:1fr;gap:6px}
.hc-m .hc-vault .amt{font-size:34px}.hc-m .hc-acts .hc-act{font-size:11px !important;letter-spacing:.1em}
.hc-m .hc-utabs{margin-top:16px;justify-content:space-between}
.hc-m .hc-nfts{grid-template-columns:1fr 1fr}
.hc-m .hc-seg{display:flex;margin-bottom:12px}.hc-m .hc-seg button{flex:1}
.hc-m .hc-pc img{width:70px;height:70px}.hc-m .hc-pc.r1 img{width:90px;height:90px}.hc-m .hc-ped em{font-size:16px}
.hc-m .hc-lr{grid-template-columns:30px 30px minmax(0,1fr) 70px;gap:8px;padding:9px 6px}
.hc-msticky{flex-shrink:0;padding:8px 16px calc(14px + env(safe-area-inset-bottom,0px));background:linear-gradient(180deg,transparent,#040807 30%)}
.hc-m .hc-ml.un:before{left:5px}.hc-m .hc-ml.un{padding-left:20px !important}
.hc-m .hc-art{font-size:14.5px}.hc-m .hc-soon h2{font-size:21px}.hc-m .hc-steps{grid-template-columns:1fr}
.hc-m .hc-sc.prof{flex-wrap:wrap}.hc-m .hc-sc.prof .hc-gear{margin-left:0;width:100%;justify-content:center}
.hc-m .hc-sc{padding:4px 14px}
.hc-m .hc-form{margin-top:4px}
`;

/* ---------------- shared helpers ---------------- */
const dayKey = (iso) => { const d = new Date(iso); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
function dayLabel(iso) {
  if (!iso) return '';
  const now = new Date();
  if (dayKey(iso) === dayKey(now)) return 'Today';
  if (dayKey(iso) === dayKey(new Date(now.getTime() - 864e5))) return 'Yesterday';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: new Date(iso).getFullYear() === now.getFullYear() ? undefined : 'numeric' });
}
const tm = (iso) => (iso ? new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '');
const shortDate = (iso) => (iso ? `${dayLabel(iso)}, ${tm(iso)}` : '');
const nearFmt = (n) => (typeof n === 'number' ? (Math.abs(n) >= 1 ? n.toFixed(2) : n.toFixed(3)).replace(/0+$/, '').replace(/\.$/, '') : '');

function MobileHead({ title, sub, onBack, right }) {
  return (
    <div className="hc-mh">
      <button type="button" className="bk" onClick={onBack} aria-label="Back"><Ico d={P.back} c="#cfe" /></button>
      <div style={{ minWidth: 0 }}><h1>{title}</h1>{sub ? <p>{sub}</p> : null}</div>
      {right ? <div className="r">{right}</div> : null}
    </div>
  );
}
function DeskHead({ title, sub, children }) {
  return (
    <div className="hc-hd">
      <div><h1>{title}</h1>{sub ? <p>{sub}</p> : null}</div>
      {children ? <div className="hc-hd-r">{children}</div> : null}
    </div>
  );
}

/* ---------------- SHELL ---------------- */
export const CONSOLE_NAV = [['activity', 'Activity'], ['wallet', 'Wallet'], ['ranks', 'Ranks'], ['inbox', 'Inbox'], ['friends', 'Friends'], ['news', 'News'], ['settings', 'Settings']];

export function HomeConsole({ mobile, active, onNav, onClose, me, badges = {}, bgImg, children, escBlocked, noRail, accent, topBar, topOffset = 90 }) {
  useEffect(() => {
    if (mobile) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      // A wallet sheet (send / receive / swap / tx detail) sits above the
      // console - don't close everything underneath it.
      if (escBlocked) return;
      onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobile, onClose, escBlocked]);

  if (mobile) {
    return (
      <div className={`hc hc-m ${accent || ''}`}>
        <style>{CSS + CSS2}</style>
        {bgImg && <div className="hc-bg" style={{ backgroundImage: `url(${bgImg})` }} />}
        {children}
      </div>
    );
  }
  return (
    <div className="hc hc-d">
      <style>{CSS + CSS2}</style>
      {bgImg && <div className="hc-bg" style={{ backgroundImage: `url(${bgImg})` }} />}
      {topBar ? <div className="hc-tb">{topBar}</div> : null}
      <div className={`hc-win ${noRail || topBar ? 'solo' : ''} ${accent || ''}`} style={topBar ? { top: topOffset } : undefined}>
        {noRail || topBar ? null : <aside className="hc-rail">
          <div className="hc-me">
            {me?.avatar && <img src={me.avatar} alt="" />}
            <div style={{ minWidth: 0 }}><b>{me?.name || 'Crewmate'}</b><span>{me?.handle || ''}</span></div>
          </div>
          {CONSOLE_NAV.map(([k, label]) => (
            <button type="button" key={k} className={`hc-nav ${k === active ? 'on' : ''}`} onClick={() => onNav(k)}>
              <Ico d={P[k]} c={k === active ? '#6effc0' : '#8fa39a'} />{label.toUpperCase()}
              {badges[k] > 0 && <i>{badges[k] > 9 ? '9+' : badges[k]}</i>}
            </button>
          ))}
          <button type="button" className="hc-back" onClick={onClose}><Ico d={P.back} c="#7d8d86" />BACK TO HANGAR<kbd>ESC</kbd></button>
        </aside>}
        <section className="hc-main">{children}</section>
      </div>
    </div>
  );
}

/* ---------------- ACTIVITY ---------------- */
function normGame(g) {
  const matches = (g.matches || []).map((m) => ({ ...m, saboteur: m.saboteur || null }));
  const mode = g.mode || (g.isPaid ? 'paid' : 'free');
  const wins = matches.filter((m) => m.won).length;
  const t = g.totals || {};
  const end = g.endedAt || g.earnedAtUtc;
  const start = g.startedAt || g.earnedAtUtc;
  const displayName = !g.displayName || g.displayName === g.roomCode ? (mode === 'free' ? 'Free game' : mode === 'pool' ? 'Pool game' : 'Paid game') : g.displayName;
  return {
    ...g, displayName, mode, matches, end, start,
    wins, losses: matches.length - wins,
    pts: typeof t.points === 'number' ? t.points : matches.reduce((a, m) => a + (m.points || 0), 0),
    sab: typeof t.saboteur === 'number' ? t.saboteur : matches.reduce((a, m) => a + (m.saboteur ? m.saboteur.amount || 0 : 0), 0),
    hasSab: matches.some((m) => m.saboteur),
    missions: matches.reduce((a, m) => a + (m.missionsDone || 0), 0),
    kills: matches.reduce((a, m) => a + (m.killsCount || 0), 0),
    time: start && end && dayKey(start) === dayKey(end) && tm(start) !== tm(end) ? `${tm(start)} – ${tm(end)}` : tm(end),
  };
}
const bestIdx = (g) => g.matches.reduce((b, m, i, a) => ((m.points || 0) > (a[b].points || 0) ? i : b), 0);
const capped = (m) => m.reduced && m.rawPoints > m.points;

function GameCard({ g, on, onClick }) {
  let right;
  if (g.mode !== 'free' && typeof g.poolNearWon === 'number') {
    right = g.poolNearWon > 0
      ? <span style={{ color: '#6effc0' }}>{g.myPoolRank ? `#${g.myPoolRank} · ` : ''}+{nearFmt(g.poolNearWon)} NEAR</span>
      : <span style={{ color: '#7d8d86' }}>{g.myPoolRank ? `#${g.myPoolRank} · ` : ''}no prize</span>;
  } else if (g.sab > 0) right = <span>+{g.sab} $SAB</span>;
  return (
    <button type="button" className={`hc-gc ${on ? 'on' : ''}`} onClick={onClick}>
      <div className={`hc-mi ${g.mode}`}><Ico d={P[g.mode] || P.paid} c={MODE_C[g.mode]} /></div>
      <div className="t">
        <b>{g.displayName}</b>
        <span><em className="hc-md" style={{ color: MODE_C[g.mode] }}>{g.mode.toUpperCase()}</em> · {g.time}</span>
        <div className="hc-pips">
          {g.matches.slice(0, 12).map((m, i) => <i key={i} className={m.won ? 'w' : ''} />)}
          <small>{g.wins}W {g.losses}L</small>
        </div>
      </div>
      <div className="v"><b>+{g.pts}</b>{right}</div>
    </button>
  );
}

function ResultBadge({ g }) {
  if (g.mode !== 'free') {
    if (g.myPoolRank) return <span className={`hc-big ${g.myPoolRank <= 3 ? 'w' : 'l'}`}>PLACED #{g.myPoolRank}</span>;
    if (typeof g.poolNearWon === 'number') return <span className={`hc-big ${g.poolNearWon > 0 ? 'w' : 'l'}`}>{g.poolNearWon > 0 ? 'PRIZE WON' : 'NO PRIZE'}</span>;
    return <span className="hc-big e">NOT SETTLED YET</span>;
  }
  if (g.wins > g.losses) return <span className="hc-big w">MORE WINS</span>;
  if (g.wins < g.losses) return <span className="hc-big l">MORE LOSSES</span>;
  return <span className="hc-big e">EVEN</span>;
}

function GameDetail({ g, kit, mobile }) {
  const b = bestIdx(g);
  const many = g.matches.length > 1;
  const hasNear = g.mode !== 'free' && (typeof g.entryFeeNear === 'number' || typeof g.poolNearWon === 'number');
  const fee = g.entryFeeNear || 0, won = g.poolNearWon || 0, net = won - fee;
  const capAny = g.matches.some(capped);
  const bonus = g.matches.findIndex((m) => m.bonusMissionDone && m.bonusMissionPoints > 0);
  return (
    <>
      <div className="hc-dtop">
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`hc-tag ${g.mode}`}>{g.mode.toUpperCase()} GAME</span>
            {g.roomCode && <span style={{ font: '11px var(--mono)', color: 'var(--dim)' }}>ROOM {g.roomCode}</span>}
          </div>
          <h2>{g.displayName}</h2>
          <p>{dayLabel(g.end)} · {g.time}{typeof g.entryFeeNear === 'number' ? ` · entry ${nearFmt(g.entryFeeNear)} NEAR` : ''}</p>
        </div>
        <div className="res"><ResultBadge g={g} /></div>
      </div>
      <div className="hc-tiles">
        <div className="hc-tile"><b style={{ color: 'var(--g)' }}>+{g.pts}</b><span>POINTS COUNTED</span><small>adds to your rank</small></div>
        <div className="hc-tile"><b><span style={{ color: 'var(--m)' }}>{g.wins}W</span> <span style={{ color: 'var(--r)' }}>{g.losses}L</span></b><span>RECORD</span><small>{g.matches.length} match{g.matches.length === 1 ? '' : 'es'} played</small></div>
        {g.hasSab
          ? <div className="hc-tile"><b style={{ color: 'var(--c)' }}>+{g.sab}</b><span>$SABOTEUR EARNED</span><small>sent to your wallet</small></div>
          : <div className="hc-tile"><b>{g.missions}</b><span>MISSIONS DONE</span><small>{g.kills} kill{g.kills === 1 ? '' : 's'} as saboteur</small></div>}
        {hasNear
          ? <div className="hc-tile"><b style={{ color: net >= 0 ? 'var(--m)' : 'var(--r)' }}>{net >= 0 ? '+' : '−'}{nearFmt(Math.abs(net)) || '0'}</b><span>NEAR NET</span><small>won {nearFmt(won) || '0'} − fee {nearFmt(fee) || '0'}</small></div>
          : g.hasSab
            ? <div className="hc-tile"><b>{g.missions}</b><span>MISSIONS DONE</span><small>{g.kills} kill{g.kills === 1 ? '' : 's'} as saboteur</small></div>
            : <div className="hc-tile"><b>{g.matches.filter((m) => m.survived).length}</b><span>TIMES SURVIVED</span><small>out of {g.matches.length}</small></div>}
      </div>

      <div className="hc-sec">MATCH BY MATCH</div>
      {mobile ? g.matches.map((m, i) => (
        <div key={i} className={`hc-mm ${i === b && many ? 'best' : ''}`}>
          <div className="r1">
            <span className="n">MATCH {i + 1}{i === b && many ? <span style={{ color: 'var(--g)' }}> ★ BEST</span> : null}</span>
            <span className={`hc-role ${m.role === 'saboteur' ? 's' : 'c'}`}>{m.role === 'saboteur' ? 'SABOTEUR' : 'CREWMATE'}</span>
            <span className={`hc-wl ${m.won ? 'w' : 'l'}`} style={{ font: '600 11px var(--mono)' }}>{m.won ? 'WON' : 'LOST'}</span>
            <span className="p">+{m.points}</span>
          </div>
          <div className="r2">
            <div><b>{m.missionsDone || 0}</b><span>Missions</span></div>
            <div><b>{m.killsCount || 0}</b><span>Kills</span></div>
            <div><b>{m.meetingsSurvivedCount || 0}</b><span>Meetings</span></div>
            <div><b style={{ color: m.survived ? 'var(--m)' : '#4b5752' }}>{m.survived ? 'Yes' : 'No'}</b><span>Survived</span></div>
          </div>
          {(m.saboteur || capped(m)) && (
            <div className="r3">
              {m.saboteur?.rank ? <span>#{m.saboteur.rank}{m.saboteur.players ? ` of ${m.saboteur.players}` : ''}</span> : null}
              {m.saboteur && m.saboteur.amount > 0 ? (m.saboteur.txUrl ? <a href={m.saboteur.txUrl} target="_blank" rel="noreferrer">+{m.saboteur.amount} $SAB ↗</a> : <span>+{m.saboteur.amount} $SAB{m.saboteur.status !== 'sent' ? ' · sending' : ''}</span>) : null}
              {capped(m) ? <span className="hc-cap">capped {m.rawPoints}→{m.points}</span> : null}
            </div>
          )}
        </div>
      )) : (
        <div className="hc-tw">
          <table>
            <thead><tr><th>#</th><th>Role</th><th>Result</th><th>Placed</th><th className="n">Missions</th><th className="n">Kills</th><th className="n">Meetings</th><th>Survived</th><th className="n">Points</th><th className="n">$SAB</th></tr></thead>
            <tbody>
              {g.matches.map((m, i) => (
                <tr key={i} className={i === b && many ? 'best' : ''}>
                  <td>{i + 1}{i === b && many ? <span style={{ color: 'var(--g)' }}> ★</span> : null}</td>
                  <td><span className={`hc-role ${m.role === 'saboteur' ? 's' : 'c'}`}>{m.role === 'saboteur' ? 'SABOTEUR' : 'CREWMATE'}</span></td>
                  <td className={`hc-wl ${m.won ? 'w' : 'l'}`}>{m.won ? 'WON' : 'LOST'}</td>
                  <td>{m.saboteur?.rank ? `#${m.saboteur.rank}${m.saboteur.players ? ` of ${m.saboteur.players}` : ''}` : <span className="hc-dash">—</span>}</td>
                  <td className="n">{m.missionsDone || 0}</td>
                  <td className="n">{m.killsCount ? m.killsCount : <span className="hc-dash">0</span>}</td>
                  <td className="n">{m.meetingsSurvivedCount || 0}</td>
                  <td>{m.survived ? 'Yes' : <span className="hc-dash">No</span>}</td>
                  <td className="n hc-pts">+{m.points}{capped(m) ? <span className="hc-cap" title={`Earned ${m.rawPoints}, only ${m.points} counted: daily full-points limit reached`}>capped {m.rawPoints}→{m.points}</span> : null}</td>
                  <td className="n hc-sab">
                    {m.saboteur && m.saboteur.amount > 0
                      ? <>+{m.saboteur.amount}{m.saboteur.status !== 'sent' ? <span className="hc-dash"> …</span> : null}{m.saboteur.txUrl ? <a href={m.saboteur.txUrl} target="_blank" rel="noreferrer" title="View on NEAR explorer">↗</a> : null}</>
                      : <span className="hc-dash">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {capAny && <div className="hc-note"><b>capped</b> — after your first few matches each day, points count at a reduced rate. The match still counts, it just adds less to your rank.</div>}
      {bonus >= 0 && <div className="hc-note" style={{ color: 'var(--m)' }}>Bonus mission done in match {bonus + 1}: +{g.matches[bonus].bonusMissionPoints} pts (included above)</div>}

      {Array.isArray(g.topThree) && g.topThree.length > 0 && (
        <>
          <div className="hc-sec" style={{ marginTop: 24 }}>TOP 3 · THIS GAME</div>
          <div className="hc-podium">
            {g.topThree.map((p, i) => (
              <div key={p.rank} className={`hc-pl ${p.isMe ? 'me' : ''}`}>
                <span className="rk" style={{ color: ['#ffd75e', '#c9d3d9', '#d9965c'][i] }}>{p.rank}</span>
                <img src={kit.avatarImg(p.avatarId, p.avatarVariantId)} alt="" />
                <div className="nm"><b>{p.name}{p.isMe ? <span className="hc-you">YOU</span> : null}</b><span>@{p.username}</span></div>
                <div className="pz">{typeof p.nearWon === 'number' && p.nearWon > 0 ? `+${nearFmt(p.nearWon)} NEAR` : ''}<small>{p.points} pts</small></div>
              </div>
            ))}
          </div>
          {g.myPoolRank > 3 && <div className="hc-note">You finished #{g.myPoolRank}. Only the top 3 share the prize.</div>}
        </>
      )}
    </>
  );
}

export function ActivityScreen({ mobile, data, loading, error, onClose, kit }) {
  const [filt, setFilt] = useState('all');
  const [selId, setSelId] = useState(null);
  const [open, setOpen] = useState(false);
  const games = useMemo(() => (data?.games || []).map(normGame), [data]);
  const shown = games.filter((g) => filt === 'all' || g.mode === filt || (filt === 'paid' && g.mode === 'sponsor'));
  const sel = shown.find((g) => g.id === selId) || (!mobile ? shown[0] : null);
  const s = data?.summary;
  const count = (k) => games.filter((g) => k === 'all' || g.mode === k).length;
  const stats = s ? [
    { v: s.weekPoints ?? s.totalPoints ?? 0, l: s.weekPoints != null ? 'Pts this week' : 'Total points', c: 'var(--g)', coin: true },
    { v: s.matchesPlayed ?? s.gamesPlayed ?? 0, l: 'Matches' },
    { v: `${s.winRate ?? ((s.gamesPlayed || 0) > 0 ? Math.round(((s.gamesWon || 0) / s.gamesPlayed) * 100) : 0)}%`, l: 'Win rate', c: 'var(--m)' },
    ...(typeof s.saboteurEarned === 'number' ? [{ v: s.saboteurEarned.toLocaleString(), l: '$SABOTEUR earned', c: 'var(--c)' }] : []),
  ] : [];

  const list = (
    <>
      {loading && !data && [0, 1, 2, 3, 4].map((i) => <div key={i} className="hc-skel" style={{ animationDelay: `${i * 0.1}s` }} />)}
      {error && !data && <div className="hc-empty hc-err">{error}</div>}
      {data && shown.length === 0 && <div className="hc-empty">{games.length === 0 ? 'No games played yet — your history will show up here.' : 'No games of this type yet.'}</div>}
      {(() => {
        const out = []; let last = '';
        shown.forEach((g) => {
          const lab = dayLabel(g.end);
          if (lab !== last) { out.push(<div key={`d-${g.id}`} className="hc-day">{lab}</div>); last = lab; }
          out.push(<GameCard key={g.id} g={g} on={!mobile && sel && sel.id === g.id} onClick={() => { setSelId(g.id); if (mobile) setOpen(true); }} />);
        });
        return out;
      })()}
    </>
  );
  const filters = (
    <div className="hc-filters">
      {['all', 'free', 'pool', 'paid'].map((k) => (
        <button type="button" key={k} className={`hc-chip ${filt === k ? 'on' : ''}`} onClick={() => setFilt(k)}>{k.toUpperCase()}<em>{count(k)}</em></button>
      ))}
    </div>
  );

  if (mobile) {
    return (
      <MobileWrap open={open}>
        <div className="hc-page top">
          <MobileHead title="ACTIVITY" sub="Last 20 games · your local time" onBack={onClose} />
          {stats.length > 0 && <div className="hc-mstats" style={{ gridTemplateColumns: `repeat(${stats.length},1fr)` }}>{stats.map((t) => <div key={t.l}><b style={{ color: t.c }}>{t.v}</b><span>{t.l.replace('Pts this week', 'Pts week').replace('$SABOTEUR earned', '$SAB')}</span></div>)}</div>}
          {filters}
          <div className="hc-mbody">{list}</div>
        </div>
        <div className="hc-page sub">
          <MobileHead title="GAME DETAILS" onBack={() => setOpen(false)} />
          <div className="hc-mbody">{sel && <GameDetail g={sel} kit={kit} mobile />}</div>
        </div>
      </MobileWrap>
    );
  }
  return (
    <>
      <DeskHead title="ACTIVITY" sub="Your last 20 games · times in your local time">
        <div className="hc-stats">{stats.map((t) => <div className="hc-st" key={t.l}><b style={{ color: t.c }}>{t.coin && kit.pointCoin ? <img src={kit.pointCoin} alt="" /> : null}{t.v}</b><span>{t.l}</span></div>)}</div>
      </DeskHead>
      {filters}
      <div className="hc-split">
        <div className="hc-list">{list}</div>
        <div className="hc-det">{sel ? <GameDetail g={sel} kit={kit} /> : null}</div>
      </div>
    </>
  );
}

// Mobile list/detail pager: lets each screen flip between its two pages.
function MobileWrap({ open, children }) {
  return <div className={`hc-mwrap ${open ? 'open' : ''}`}>{children}</div>;
}

/* ---------------- WALLET ---------------- */
export function WalletScreen({ mobile, onClose, w }) {
  const deskTab = w.tab === 'coins' ? 'activity' : w.tab;
  const tab = mobile ? w.tab : deskTab;
  const vault = (
    <div className="hc-vault">
      <div className="lab">
        PORTFOLIO VALUE · IN NEAR
        <button type="button" onClick={w.onToggleHidden} aria-label={w.hidden ? 'Show balance' : 'Hide balance'}><Ico d={w.hidden ? P.eyeOff : P.eye} c="#8fa39a" w={1.5} /></button>
        <button type="button" onClick={w.onRefresh} aria-label="Refresh balance"><Ico d={P.refresh} c="#8fa39a" w={1.6} s={15} /></button>
      </div>
      {w.loading && w.balance === null ? <span className="amt" style={{ fontSize: 16, color: '#7fd9b8' }}>Loading…</span>
        : w.error ? <button type="button" className="amt" onClick={w.onRefresh} style={{ fontSize: 14, color: '#ff8a8a', textAlign: 'left' }}>Couldn't load balance — tap to retry</button>
        : <span className="amt">{w.hidden ? '••••••' : w.totalText} <small>{w.network !== 'mainnet' ? 'TEST NEAR' : 'NEAR'}</small></span>}
      <span className="sub">{w.subline}</span>
      {w.network !== 'mainnet' && (
        <div className="hc-testnet"><b>TESTNET</b><span>Test NEAR for playing — it has no real money value and can't be sold.</span></div>
      )}
      <div className="hc-addr"><span>{w.address || 'No wallet set up yet.'}</span>{w.address && w.copyButton}</div>
      <div className="hc-acts">
        <button type="button" className="hc-act" disabled={!w.hasWallet} onClick={w.onSend}><Ico d={P.send} c="#04130c" w={2} />SEND</button>
        <button type="button" className="hc-act" disabled={!w.hasWallet} onClick={w.onReceive}><Ico d={P.receive} c="#04130c" w={2} />RECEIVE</button>
        <button type="button" className="hc-act ghost" disabled={!w.hasWallet} onClick={w.onSwap}><Ico d={P.swap} c="#6effc0" w={1.8} />SWAP</button>
      </div>
    </div>
  );
  const coins = (
    <div>
      {w.sabRow}
      {w.hasWallet && (
        <button type="button" className="hc-row" onClick={() => w.onSendAsset(null)}>
          {w.nearLogo ? <img className="hc-tokimg" src={w.nearLogo} alt="" /> : null}
          <div className="tt"><b>NEAR<span className="hc-badge" style={{ color: 'var(--m)', background: 'rgba(110,255,192,.12)' }}>NATIVE</span></b><span>NEAR Protocol</span></div>
          <div className="ta">{w.hidden ? '••••' : (w.balance ?? '—')}<small>NEAR</small></div>
        </button>
      )}
      {w.tokens.map((t) => (
        <button type="button" key={t.contractId} className="hc-row" onClick={() => w.onSendAsset(t.contractId)}>
          {t.icon ? <img className="hc-tokimg" src={t.icon} alt="" /> : <span className="hc-tokimg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c)', font: '700 13px var(--disp)', border: '1px solid rgba(143,227,255,.35)' }}>{(t.symbol || '?').slice(0, 1).toUpperCase()}</span>}
          <div className="tt"><b>{t.symbol}</b><span>{t.name}</span></div>
          <div className="ta">{w.hidden ? '••••' : w.fmtAmt(Number(t.amount))}<small>{t.valueNear == null ? 'no market price' : `≈ ${w.hidden ? '••••' : Number(t.valueNear).toFixed(4)} NEAR`}</small></div>
        </button>
      ))}
      {w.portfolioLoading && !w.portfolio && <div className="hc-note">Loading tokens…</div>}
      {w.portfolioError && !w.portfolio && <button type="button" className="hc-note hc-err" onClick={w.onRetryPortfolio}>{w.portfolioError} Tap to retry.</button>}
      {!w.hasWallet && <div className="hc-empty" style={{ marginTop: 12 }}>No wallet set up yet.</div>}
      {w.hasWallet && <div className="hc-note">Tap a coin to send (withdraw) it. Tokens without a market price are listed but not counted in the total.</div>}
    </div>
  );
  const nfts = w.nfts.length > 0 ? (
    <div className="hc-nfts">
      {w.nfts.map((n) => (
        <div className="hc-nft" key={`${n.contractId}:${n.tokenId}`}>
          <div className="im">{n.media ? <img src={n.media} alt="" loading="lazy" /> : null}{n.isSbt && <span className="hc-badge" style={{ position: 'absolute', top: 7, left: 1, color: 'var(--g)', background: 'rgba(5,8,10,.75)' }}>SBT</span>}</div>
          <b>{n.title}</b><span>{n.collection}</span>
        </div>
      ))}
    </div>
  ) : <div className="hc-empty" style={{ marginTop: 12 }}>{w.portfolioLoading && !w.portfolio ? 'Loading NFTs…' : 'No NFTs yet — NFTs in this wallet will show up here.'}</div>;
  const activity = (
    <>
      <div style={{ display: 'flex', gap: 6, padding: '12px 0 4px', flexWrap: 'wrap' }}>
        {[['all', 'ALL'], ['games', 'GAMES'], ['transfers', 'TRANSFERS'], ['sab', '$SABOTEUR']].map(([id, l]) => (
          <button type="button" key={id} className={`hc-chip ${w.txFilter === id ? 'on' : ''}`} onClick={() => w.setTxFilter(id)}>{l}</button>
        ))}
      </div>
      {w.txFilter === 'sab' ? w.sabHistory : (
        <div>
          {w.txLoading && w.txCount === 0 && <div className="hc-note">Loading…</div>}
          {w.txError && <div className="hc-note hc-err">{w.txError}</div>}
          {!w.txLoading && !w.txError && w.groups.length === 0 && <div className="hc-empty" style={{ marginTop: 10 }}>No transactions yet.</div>}
          {w.groups.map((g) => (
            <div key={g.label}>
              <div className="hc-day" style={{ marginTop: 14 }}>{g.label}</div>
              {g.items.map(({ tx, time }, i) => {
                const ic = w.txKindIcon(tx);
                const zero = Number(tx.amountNear) === 0;
                const won = tx.gameOutcome === 'won' || tx.gameOutcome === 'placed';
                return (
                  <button type="button" key={i} className="hc-row" onClick={() => w.onSelectTx(tx)}>
                    <span className="hc-ti" style={{ color: ic.c }}><svg viewBox="0 0 20 20" fill="none"><path d={ic.d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    <div className="tt">
                      <b>{w.kindLabel(tx)}
                        {won && <span className="hc-badge" style={{ color: 'var(--g)', background: 'rgba(255,207,110,.15)' }}>{tx.gameOutcome === 'placed' ? (tx.poolRank === 1 ? '1ST' : tx.poolRank === 2 ? '2ND' : '3RD') : 'WON'}</span>}
                        {tx.gameOutcome === 'lost' && <span className="hc-badge" style={{ color: '#ff8a8a', background: 'rgba(255,138,138,.12)' }}>LOST</span>}
                      </b>
                      <span>{tx.counterparty}</span>
                    </div>
                    <div className="ta" style={{ color: zero ? '#6c7a73' : tx.type === 'received' ? 'var(--m)' : '#ff9a8a' }}>
                      {zero ? '0' : `${tx.type === 'received' ? '+' : '−'}${tx.amountNear}`}<small>{zero ? 'gas only' : `${time} UTC`}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </>
  );
  const tabs = (keys) => (
    <div className="hc-utabs">
      {keys.map(([k, l, n]) => <button type="button" key={k} className={tab === k ? 'on' : ''} onClick={() => w.setTab(k)}>{l}<em>{n}</em></button>)}
    </div>
  );
  const nAct = w.txCount, nNft = w.nfts.length, nCoin = (w.hasWallet ? 1 + w.tokens.length : 0) + (w.sabRow ? 1 : 0);
  if (mobile) {
    return (
      <div className="hc-page">
        <MobileHead title="WALLET" sub="Your in-game NEAR wallet" onBack={onClose}
          right={<button type="button" className="hc-gear" onClick={w.onSettings} aria-label="Wallet settings"><Ico d={P.settings} c="#9fb0a8" /></button>} />
        <div className="hc-mbody">
          {vault}
          {tabs([['coins', 'COINS', nCoin], ['nfts', 'NFTs', nNft], ['activity', 'ACTIVITY', nAct]])}
          {tab === 'coins' ? coins : tab === 'nfts' ? nfts : activity}
        </div>
      </div>
    );
  }
  return (
    <>
      <DeskHead title="WALLET" sub="Your in-game NEAR wallet">
        <button type="button" className="hc-gear" onClick={w.onSettings}><Ico d={P.settings} c="#9fb0a8" />WALLET SETTINGS</button>
      </DeskHead>
      <div className="hc-split wide bt">
        <div className="hc-list" style={{ paddingTop: 22 }}>
          {vault}
          <div className="hc-sec" style={{ marginTop: 20 }}>COINS</div>
          {coins}
        </div>
        <div className="hc-det" style={{ paddingTop: 14 }}>
          {tabs([['activity', 'ACTIVITY', nAct], ['nfts', 'NFTs', nNft]])}
          {tab === 'nfts' ? nfts : activity}
        </div>
      </div>
    </>
  );
}

/* ---------------- RANKS ---------------- */
function RankRow({ p, me, kit }) {
  const NameTag = kit.NameTag, Badge = kit.LegionBadge;
  return (
    <div className={`hc-lr ${me ? 'me' : ''}`}>
      <span className="rk">{p.rank}</span>
      <img src={kit.avatarImg(p.avatarId, p.avatarVariantId)} alt="" />
      <div className="nm">
        <b><span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{NameTag ? <NameTag name={p.name} premium={p.hasPlayPass} /> : p.name}</span>{p.hasLegionBadge && Badge ? <Badge size={11} /> : null}{me ? <span className="hc-you">YOU</span> : null}</b>
        <span>@{p.username}</span>
      </div>
      <span className="pt">{Number(p.points || 0).toLocaleString()}</span>
    </div>
  );
}
export function RanksScreen({ mobile, onClose, kit, tab, onTab, data, loading, error, resetText }) {
  const list = data?.leaderboard || [];
  const top = list.slice(0, 3), rest = list.slice(3);
  const my = data?.myRank || null;
  const myInList = my && list.some((p) => p.rank === my.rank);
  const above = my && my.rank > 1 ? list.find((p) => p.rank === my.rank - 1) : null;
  const gapTxt = above ? `${Math.max(1, (above.points || 0) - (my.points || 0) + 1)} more pts to pass @${above.username}` : my && my.rank === 1 ? "You're #1 — hold on to it!" : '';
  const seg = (
    <div className="hc-seg">
      {['weekly', 'monthly'].map((k) => <button type="button" key={k} className={tab === k ? 'on' : ''} onClick={() => onTab(k)}>{k.toUpperCase()}</button>)}
    </div>
  );
  const pod = top.length > 0 && (
    <div className="hc-pod">
      {[1, 0, 2].map((i) => { const p = top[i]; if (!p) return <div key={i} />; return (
        <div key={i} className={`hc-pc r${i + 1}`}>
          <span className="hc-crown">#{i + 1}</span>
          <img src={kit.avatarImg(p.avatarId, p.avatarVariantId)} alt="" />
          <b>{p.name}</b><span>@{p.username}</span>
          <div className="hc-ped"><em>{Number(p.points || 0).toLocaleString()}</em><small>PTS</small></div>
        </div>
      ); })}
    </div>
  );
  const states = (
    <>
      {loading && !data && [0, 1, 2, 3, 4].map((i) => <div key={i} className="hc-skel" style={{ height: 50 }} />)}
      {error && !data && <div className="hc-empty hc-err">{error}</div>}
      {data && list.length === 0 && <div className="hc-empty">{tab === 'weekly' ? 'Nobody has scored any points this week yet.' : 'Nobody has scored any points this month yet.'}</div>}
    </>
  );
  const rows = rest.map((p) => <RankRow key={p.rank} p={p} kit={kit} me={my && my.rank === p.rank} />);
  const meRow = my && !myInList ? <><div className="hc-gap">···</div><RankRow p={my} kit={kit} me /></> : null;
  if (mobile) {
    return (
      <div className="hc-page">
        <MobileHead title="RANKS" sub={resetText} onBack={onClose} />
        <div className="hc-mbody">
          {seg}{states}{pod}
          {top.map((p) => (my && my.rank === p.rank ? <RankRow key={`t${p.rank}`} p={p} kit={kit} me /> : null))}
          {rows}
          {data && !my && list.length > 0 && <div className="hc-note" style={{ textAlign: 'center' }}>Play a match to get on the board.</div>}
        </div>
        {meRow && <div className="hc-msticky">{meRow}{gapTxt && <div className="hc-note" style={{ textAlign: 'center', marginTop: 6 }}>{gapTxt}</div>}</div>}
      </div>
    );
  }
  return (
    <>
      <DeskHead title="RANKS" sub={tab === 'weekly' ? 'Top players by points this week' : 'Top players by points this month'}>
        {resetText && <span className="hc-reset"><Ico d={P.clock} c="#7d8d86" />{resetText}</span>}
        {seg}
      </DeskHead>
      <div className="hc-split rk bt">
        <div className="hc-list" style={{ paddingTop: 26 }}>
          {pod || states}
          {my && <div className="hc-note" style={{ textAlign: 'center' }}>{my.rank === 1 ? <span style={{ color: 'var(--m)' }}>{gapTxt}</span> : <><span style={{ color: myInList ? 'var(--m)' : undefined }}>You're #{my.rank}. </span>{gapTxt}</>}</div>}
          {data && !my && list.length > 0 && <div className="hc-note" style={{ textAlign: 'center' }}>Play a match to get on the board.</div>}
        </div>
        <div className="hc-det" style={{ paddingTop: 22 }}>
          <div className="hc-lr head"><span className="rk">#</span><span /><div className="nm">PLAYER</div><span className="pt" style={{ color: 'var(--dim)', font: 'inherit' }}>POINTS</span></div>
          {top.map((p) => <RankRow key={`t${p.rank}`} p={p} kit={kit} me={my && my.rank === p.rank} />)}
          {rows}
          {meRow}
        </div>
      </div>
    </>
  );
}

/* ---------------- INBOX ---------------- */
function ReportForm({ r }) {
  return (
    <div className="hc-form">
      <div className="hc-seg" style={{ alignSelf: 'flex-start' }}>
        {[['feedback', 'FEEDBACK'], ['dispute', 'DISPUTE']].map(([k, l]) => <button type="button" key={k} className={r.type === k ? 'on' : ''} onClick={() => r.setType(k)}>{l}</button>)}
      </div>
      <label>SUBJECT<input value={r.subject} maxLength={150} onChange={(e) => r.setSubject(e.target.value)} placeholder="e.g. Stuck on the loading screen" /></label>
      <label>{r.type === 'dispute' ? 'WHAT HAPPENED?' : 'YOUR FEEDBACK'}<textarea rows={6} value={r.body} maxLength={3000} onChange={(e) => r.setBody(e.target.value)} placeholder={r.type === 'dispute' ? 'What happened? Include the room code / match if you can.' : 'Tell us what you think…'} /></label>
      <button type="button" className="hc-act" disabled={r.busy} onClick={r.submit}>{r.busy ? 'SENDING…' : 'SEND REPORT'}</button>
      {r.status && <div className="hc-note" style={{ color: r.status.startsWith('Sent') ? 'var(--m)' : '#ff8a8a', textAlign: 'center' }}>{r.status}</div>}
    </div>
  );
}
// [INBOX READABILITY] Bigger, brighter text; one sentence per line; NEAR /
// $SABOTEUR amounts in gold and wallet addresses in a mono chip.
const INBOX_CSS = `
.hc-inbox .hc-ml{padding:14px 14px !important;gap:10px}
.hc-inbox .hc-ml .tt b{font:600 15px var(--disp);white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.3}
.hc-inbox .hc-ml .tt span{font:13px/1.45 'IBM Plex Sans',var(--disp),sans-serif;color:#9fb0a8;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-top:5px}
.hc-inbox .hc-ml .tt .tg{font-size:10px;margin-bottom:6px}
.hc-inbox .hc-ml.un .tt span{color:#c3cfc9}
.hc-inbox .hc-ml small{font-size:11px}
.hc-msgcard{margin-top:18px;max-width:660px;padding:20px 22px;border:1px solid var(--line);background:rgba(255,255,255,.025);border-radius:6px}
.hc-msgcard p{margin:0 0 12px;font:16px/1.7 'IBM Plex Sans',var(--disp),sans-serif;color:#e2e9e5;word-break:break-word}
.hc-msgcard p:last-child{margin-bottom:0}
.hc-msgcard .amt{color:#ffd75e;font-weight:700;white-space:nowrap}
.hc-msgcard .wal{font:13px var(--mono);color:#6effc0;background:rgba(110,255,192,.08);border:1px solid rgba(110,255,192,.25);padding:1px 6px;border-radius:4px;word-break:break-all}
.hc-msgcard img{display:block;max-width:100%;margin-top:14px;border:1px solid var(--line)}
.hc-m .hc-msgcard{padding:16px;margin-top:14px}.hc-m .hc-msgcard p{font-size:15px}
`;
const MSG_TOKEN = /([+−-]?\d[\d,]*(?:\.\d+)?\s?(?:tNEAR|NEAR|\$SABOTEUR|SABOTEUR))|((?:[a-z0-9_-]+\.)+(?:near|testnet|tg)\b|\b[0-9a-f]{64}\b|\b0x[0-9a-fA-F]{40}\b)/g;
function richLine(text, key) {
  const out = []; let last = 0; let m;
  MSG_TOKEN.lastIndex = 0;
  while ((m = MSG_TOKEN.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(m[1] ? <span key={`${key}a${m.index}`} className="amt">{m[1]}</span> : <span key={`${key}w${m.index}`} className="wal">{m[2]}</span>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
function MessageBody({ body, imageUrl }) {
  const paras = String(body || '').split(/\n+/).flatMap((para) => para.split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/)).map((x) => x.trim()).filter(Boolean);
  return (
    <div className="hc-msgcard">
      {paras.length ? paras.map((t, i) => <p key={i}>{richLine(t, i)}</p>) : <p style={{ color: 'var(--dim)' }}>No details in this message.</p>}
      {imageUrl && <img src={imageUrl} alt="" />}
    </div>
  );
}

export function InboxScreen({ mobile, onClose, messages, onRead, onMarkAll, onDelete, report, startInReport }) {
  const [selId, setSelId] = useState(null);
  const [rep, setRep] = useState(!!startInReport);
  const [open, setOpen] = useState(!!startInReport && mobile);
  const unread = messages.filter((m) => !m.read).length;
  const sel = messages.find((m) => m._id === selId) || (!mobile && !rep ? messages[0] : null);
  useEffect(() => { if (!mobile && sel && !sel.read && !rep) onRead(sel._id); }, [mobile, sel && sel._id, rep]); // eslint-disable-line react-hooks/exhaustive-deps
  const pick = (m) => { setSelId(m._id); setRep(false); if (!m.read) onRead(m._id); if (mobile) setOpen(true); };
  const list = messages.length === 0
    ? <div className="hc-empty">Inbox is empty. Prizes, updates and replies to your reports land here.</div>
    : messages.map((m) => (
      <button type="button" key={m._id} className={`hc-ml ${!mobile && !rep && sel && sel._id === m._id ? 'on' : ''} ${m.read ? '' : 'un'}`} onClick={() => pick(m)}>
        <div className="tt"><span className="tg">{(m.nameTag || 'NEAR Saboteur').toUpperCase()}</span><b>{m.title}</b>{m.body ? <span>{m.body}</span> : null}</div>
        {m.createdAt && <small>{dayLabel(m.createdAt)}</small>}
      </button>
    ));
  const reading = sel && (
    <>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <span className="hc-tag pool">{(sel.nameTag || 'NEAR Saboteur').toUpperCase()}</span>
          <h2 className="hc-ah" style={{ marginTop: 10 }}>{sel.title}</h2>
          {sel.createdAt && <p className="hc-am">{shortDate(sel.createdAt)}</p>}
        </div>
        <button type="button" className="hc-gear red" style={{ marginLeft: 'auto' }} onClick={() => { onDelete(sel._id); setSelId(null); if (mobile) setOpen(false); }}><Ico d={P.trash} c="#ff8a8a" />DELETE</button>
      </div>
      <MessageBody body={sel.body} imageUrl={sel.imageUrl} />
    </>
  );
  const repView = (
    <>
      <h2 className="hc-ah">Report an issue</h2>
      <p className="hc-am">Goes straight to the team. Use Dispute for prize or payment problems.</p>
      <ReportForm r={report} />
    </>
  );
  if (mobile) {
    return (
      <MobileWrap open={open}>
        <style>{INBOX_CSS}</style>
        <div className="hc-page top hc-inbox">
          <MobileHead title="INBOX" sub={unread ? `${unread} unread` : 'All caught up'} onBack={onClose} />
          <div className="hc-filters">
            {unread > 0 && <button type="button" className="hc-chip" onClick={onMarkAll}>MARK ALL READ</button>}
            <button type="button" className="hc-chip on" onClick={() => { setRep(true); setOpen(true); }}>REPORT AN ISSUE</button>
          </div>
          <div className="hc-mbody">{list}</div>
        </div>
        <div className="hc-page sub">
          <MobileHead title={rep ? 'REPORT' : 'MESSAGE'} onBack={() => setOpen(false)} />
          <div className="hc-mbody">{rep ? repView : reading}</div>
        </div>
      </MobileWrap>
    );
  }
  return (
    <>
      <DeskHead title="INBOX" sub="Prizes, updates and replies to your reports">
        {unread > 0 && <button type="button" className="hc-gear" onClick={onMarkAll}>MARK ALL AS READ</button>}
        <button type="button" className="hc-gear hi" onClick={() => setRep(true)}><Ico d={P.report} c="#6effc0" />REPORT AN ISSUE</button>
      </DeskHead>
      <style>{INBOX_CSS}</style>
      <div className="hc-split bt wide hc-inbox">
        <div className="hc-list" style={{ paddingTop: 18 }}>{list}</div>
        <div className="hc-det">{rep ? repView : reading || <div className="hc-empty" style={{ marginTop: 40 }}>Nothing to read yet.</div>}</div>
      </div>
    </>
  );
}

/* ---------------- NEWS ---------------- */
export function NewsScreen({ mobile, onClose, items }) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const n = items[idx];
  const list = items.length === 0
    ? <div className="hc-empty">Nothing posted yet — check back soon.</div>
    : items.map((a, i) => (
      <button type="button" key={i} className={`hc-ml ${!mobile && i === idx ? 'on' : ''}`} onClick={() => { setIdx(i); if (mobile) setOpen(true); }}>
        <div className="tt"><span className="tg" style={{ color: 'var(--g)' }}>{(a.nameTag || 'NEAR Saboteur').toUpperCase()}</span><b>{a.title}</b>{a.body ? <span>{a.body}</span> : null}</div>
        {a.createdAt && <small>{dayLabel(a.createdAt)}</small>}
      </button>
    ));
  const art = n && (
    <>
      <span className="hc-tag paid">{(n.nameTag || 'NEAR Saboteur').toUpperCase()}</span>
      <h2 className="hc-ah" style={{ marginTop: 10, fontSize: mobile ? 21 : 26 }}>{n.title}</h2>
      {n.createdAt && <p className="hc-am">{shortDate(n.createdAt)}</p>}
      <div className="hc-art">{n.body}{n.imageUrl && <img src={n.imageUrl} alt="" />}</div>
    </>
  );
  if (mobile) {
    return (
      <MobileWrap open={open}>
        <div className="hc-page top">
          <MobileHead title="NEWS" sub={items.length ? `${items.length} update${items.length === 1 ? '' : 's'}` : ''} onBack={onClose} />
          <div className="hc-mbody">{list}</div>
        </div>
        <div className="hc-page sub">
          <MobileHead title="NEWS" onBack={() => setOpen(false)} />
          <div className="hc-mbody">{art}</div>
        </div>
      </MobileWrap>
    );
  }
  return (
    <>
      <DeskHead title="NEWS" sub="Updates and events from the team" />
      <div className="hc-split bt">
        <div className="hc-list" style={{ paddingTop: 18 }}>{list}</div>
        <div className="hc-det">{art}</div>
      </div>
    </>
  );
}

/* ---------------- FRIENDS ---------------- */
export function FriendsScreen({ mobile, onClose, img }) {
  const body = (
    <div className="hc-soon">
      {img && <img src={img} alt="" />}
      <span className="hc-tag pool">COMING SOON</span>
      <h2>Invite your friends</h2>
      <p>You'll get your own invite link, and you'll be able to track every friend who joins with it right here.</p>
      <div className="hc-steps"><div><b>1</b>Share your link</div><div><b>2</b>Friend signs up and plays</div><div><b>3</b>Track it here</div></div>
    </div>
  );
  if (mobile) return <div className="hc-page"><MobileHead title="FRIENDS" onBack={onClose} /><div className="hc-mbody">{body}</div></div>;
  return <><DeskHead title="FRIENDS" sub="Invite friends to play" /><div className="hc-pane">{body}</div></>;
}

/* ---------------- SETTINGS ---------------- */
export function SettingsScreen({ mobile, onClose, me, soundOn, onSound, musicOn, onMusic, onProfile, onResetPassword, onReport, onLogout }) {
  const Tg = ({ on, onClick, label }) => <button type="button" className={`hc-tg ${on ? 'on' : ''}`} onClick={onClick} aria-label={label} data-sfx="none"><i /></button>;
  const Link = ({ title, sub, onClick, danger }) => (
    <button type="button" className={`hc-srow ${danger ? 'danger' : ''}`} onClick={onClick}>
      <div><b>{title}</b><span>{sub}</span></div><Ico d={P.chev} c="#7d8d86" />
    </button>
  );
  const body = (
    <div className="hc-sets">
      <div className="hc-sc prof">
        {me?.avatar && <img src={me.avatar} alt="" />}
        <div className="nm"><b>{me?.name || 'Crewmate'}</b><span>{me?.handle}{me?.pass ? ' · Play Pass' : ''}</span></div>
        <button type="button" className="hc-gear hi" onClick={onProfile}>EDIT PROFILE</button>
      </div>
      <div className="hc-sc">
        <div className="hc-sh">AUDIO</div>
        <div className="hc-srow" style={{ cursor: 'default' }}><div><b>Sound effects</b><span>Clicks, kills, alarms</span></div><Tg on={soundOn} onClick={onSound} label="Sound effects" /></div>
        <div className="hc-srow" style={{ cursor: 'default' }}><div><b>Music</b><span>Hangar, ship and meeting music</span></div><Tg on={musicOn} onClick={onMusic} label="Music" /></div>
      </div>
      <div className="hc-sc">
        <div className="hc-sh">ACCOUNT</div>
        <Link title="Reset password" sub="Change the password you sign in with" onClick={onResetPassword} />
        <Link title="Report an issue" sub="Send feedback or a dispute to the team" onClick={onReport} />
        <Link title="Log out" sub="You can sign back in any time" onClick={onLogout} danger />
      </div>
    </div>
  );
  if (mobile) return <div className="hc-page"><MobileHead title="SETTINGS" onBack={onClose} /><div className="hc-mbody">{body}</div></div>;
  return <><DeskHead title="SETTINGS" sub="Profile, audio and account" /><div className="hc-pane">{body}</div></>;
}

/* ================================================================
   PLAY PASS + FREE PLAY - full screens (no rail), same console look.
   ================================================================ */
const CSS2 = `
.hc-win.solo{grid-template-columns:minmax(0,1fr)}
.hc-tb{position:absolute;left:0;right:0;top:0;z-index:2}.hc-tb .dh-top{position:relative}
.hc-win.gold{border-color:rgba(255,215,94,.3)}
.hc-win.gold:before{background:#ffd75e;box-shadow:0 0 12px #ffd75e}
.hc-closeb{display:flex !important;gap:9px;align-items:center;padding:9px 13px !important;border-radius:7px;border:1px solid var(--line) !important;font:500 11.5px var(--mono) !important;color:var(--dim) !important;letter-spacing:.08em;white-space:nowrap}
.hc-closeb svg{width:15px;height:15px}.hc-closeb:hover{color:#dfe9e4 !important}
.hc-closeb kbd{font:10px var(--mono);border:1px solid #333;border-radius:4px;padding:1px 5px}
.hc-gold{--m:#ffd75e}
.hc-pp{flex:1;display:grid;grid-template-columns:minmax(320px,400px) minmax(0,1fr);min-height:0;border-top:1px solid var(--line)}
.hc-pp-l{padding:26px 28px 30px;border-right:1px solid var(--line);overflow:auto;display:flex;flex-direction:column;gap:16px;background:radial-gradient(120% 70% at 50% 0,rgba(255,215,94,.1),transparent 70%)}
.hc-pp-r{padding:22px 26px 30px;overflow:auto;min-width:0}
.hc-pp-hero{display:block;width:78%;max-width:300px;margin:4px auto 0;filter:drop-shadow(0 0 24px rgba(255,200,60,.35))}
.hc-price{padding:18px;border:1px solid rgba(255,215,94,.35);background:rgba(255,215,94,.05);clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));text-align:center}
.hc-price .off{display:inline-block;font:700 11px var(--mono);letter-spacing:.12em;color:#fff;background:#e84a4a;padding:3px 10px;border-radius:99px;margin-bottom:8px}
.hc-price b{display:block;font:700 36px var(--disp);color:#ffd75e;line-height:1.1}
.hc-price s{font:500 14px var(--mono);color:var(--dim);margin-left:8px}
.hc-price span{display:block;font:11px var(--mono);color:var(--dim);margin-top:6px;letter-spacing:.06em}
.hc-buy{width:100%;display:flex !important;align-items:center;justify-content:center;gap:10px;padding:15px !important;background:linear-gradient(135deg,#ffe08f,#f2b84b 55%,#c98a1e) !important;color:#1c1203 !important;font:700 14px var(--disp) !important;letter-spacing:.2em;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
.hc-buy:disabled{opacity:.55;cursor:default}
.hc-owned{padding:16px;border:1px solid rgba(110,255,192,.4);background:rgba(110,255,192,.06);text-align:center}
.hc-owned b{display:block;font:700 17px var(--disp);color:#6effc0;letter-spacing:.06em}.hc-owned span{display:block;font:12px var(--mono);color:#9fb0a8;margin-top:6px;line-height:1.5}
.hc-prog{height:6px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden;margin-top:12px}
.hc-prog i{display:block;height:100%;background:linear-gradient(90deg,#f2b84b,#ffe08f);border-radius:99px}
.hc-feats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.hc-feat{border:1px solid var(--line);background:rgba(255,255,255,.02);padding:16px;min-width:0}
.hc-feat.wide{grid-column:span 2}
.hc-feat h3{margin:0;font:700 13px var(--disp);letter-spacing:.16em;color:#ffd75e}
.hc-feat p{margin:6px 0 12px;font-size:13px;color:#9fb0a8;line-height:1.5}
.hc-skins{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}
.hc-skin{position:relative;border:1px solid var(--line);background:rgba(255,255,255,.03);padding:8px 6px 7px;text-align:center}
.hc-skin.on{border-color:rgba(255,215,94,.5);background:rgba(255,215,94,.06)}
.hc-skin img{width:100%;aspect-ratio:1/1.15;object-fit:contain;display:block}
.hc-skin.off img{filter:grayscale(1) brightness(.5)}
.hc-skin b{display:block;font:600 11px var(--disp);margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#cfd8d3}
.hc-skin.off b{color:#6a7570}
.hc-skin em{position:absolute;top:5px;right:5px;width:18px;height:18px;border-radius:50%;background:rgba(10,8,4,.85);border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center}
.hc-skin em svg{width:9px;height:9px}
.hc-skin.req{border-style:dashed;border-color:rgba(255,215,94,.4);cursor:pointer}
.hc-skin.req .q{aspect-ratio:1/1.15;display:flex;align-items:center;justify-content:center;font:700 26px var(--disp);color:rgba(255,215,94,.55);background:#050505}
.hc-skin.req b{color:#ffd75e;white-space:normal;font-size:10px;line-height:1.25}
.hc-demo{background:#0b1310;border:1px solid var(--line);padding:12px;display:flex;flex-direction:column;gap:8px}
.hc-bub{align-self:flex-start;max-width:85%;padding:7px 11px;border-radius:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);font-size:12.5px;color:#e8e8f0}
.hc-bub.gold{background:linear-gradient(135deg,#ffd75e,#e8a831);border-color:rgba(255,255,255,.4);box-shadow:0 0 12px rgba(255,215,94,.5);color:#241a00;font-weight:800}
.hc-gif{align-self:flex-end;width:110px;height:70px;border-radius:8px;background:linear-gradient(135deg,#2a2440,#1a1830);border:1px solid rgba(110,255,192,.3);display:flex;align-items:center;justify-content:center;font:800 11px var(--mono);color:rgba(255,255,255,.45);position:relative}
.hc-gif small{position:absolute;right:5px;bottom:3px;font-size:8px;opacity:.7}
.hc-frame{width:56px;height:56px;flex-shrink:0;position:relative;background:#06140d;border-radius:10px;display:flex;align-items:center;justify-content:center}
.hc-frame:before{content:"";position:absolute;inset:2px;border-radius:8px;border:1.5px solid rgba(255,215,80,.85);box-shadow:0 0 9px rgba(255,215,80,.6),inset 0 0 6px rgba(255,215,80,.25)}
.hc-frame img{width:64%;position:relative}
.hc-mbuy{flex-shrink:0;display:flex;align-items:center;gap:12px;padding:12px 16px calc(14px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(255,215,94,.25);background:rgba(8,6,2,.96)}
.hc-mbuy .pr{min-width:0}.hc-mbuy .pr b{display:block;font:700 20px var(--disp);color:#ffd75e;white-space:nowrap}.hc-mbuy .pr span{font:10px var(--mono);color:var(--dim)}
.hc-mbuy .hc-buy{flex:1;padding:13px !important;font-size:13px !important}
.hc-m .hc-feats{grid-template-columns:1fr}.hc-m .hc-feat.wide{grid-column:auto}
.hc-m .hc-skins{grid-template-columns:repeat(3,minmax(0,1fr))}
/* free play */
.hc-banner{position:relative;flex-shrink:0;height:clamp(140px,22vh,200px);overflow:hidden;border-bottom:1px solid var(--line);background:#030605}
.hc-banner img{position:absolute;left:50%;top:0;transform:translateX(-50%);height:100%;width:auto;-webkit-mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent);mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)}
.hc-banner:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent 70%,rgba(4,9,8,.9))}
.hc-banner .bh{position:absolute;left:28px;bottom:14px;z-index:1}
.hc-banner .bh p{margin:0;font:12px var(--mono);color:#cfe;letter-spacing:.08em}
.hc-banner .bh p em{font-style:normal;color:var(--m)}
.hc-banner .hc-closeb{position:absolute;right:20px;top:16px;z-index:1;background:rgba(4,9,8,.75) !important}
.hc-fp{flex:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);min-height:0}
.hc-fp>section{display:flex;flex-direction:column;min-height:0;overflow:auto;padding:20px 28px 26px}
.hc-fp>section:first-child{border-right:1px solid var(--line)}
.hc-fh{display:flex;align-items:center;gap:10px;margin-bottom:16px}
.hc-fh h2{margin:0;font:700 17px var(--disp);letter-spacing:.2em}
.hc-fh em{font:600 10.5px var(--mono);font-style:normal;padding:2px 7px;border-radius:3px;background:rgba(255,255,255,.08);color:#b8c4bf}
.hc-fh .r{margin-left:auto}
.hc-fl{display:flex;flex-direction:column;gap:7px;margin-bottom:15px}
.hc-fl>label,.hc-fl>.lb{display:flex;justify-content:space-between;font:500 10.5px var(--mono);letter-spacing:.14em;color:var(--dim)}
.hc-fl>label b,.hc-fl>.lb b{color:var(--m);font-weight:600}
.hc-fl>label small,.hc-fl>.lb small{color:#46534e;font-size:10px;letter-spacing:.06em}
.hc-in{width:100%;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.1);color:#f2f7f5;padding:11px 12px;font:15px var(--disp);outline:none;border-radius:6px;resize:none}
.hc-in:focus{border-color:rgba(110,255,192,.55);box-shadow:0 0 0 3px rgba(110,255,192,.08)}
.hc-in::placeholder{color:#4d5c56}
.hc-sq{width:44px;flex-shrink:0;display:flex !important;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.1) !important;border-radius:6px;background:rgba(0,0,0,.4) !important}
.hc-sq svg{width:17px;height:17px}
.hc-tags{display:flex;gap:6px;flex-wrap:wrap}
.hc-tags button{padding:6px 10px !important;border-radius:4px;border:1px solid rgba(255,255,255,.1) !important;font:500 10.5px var(--mono) !important;letter-spacing:.06em;color:#7d8d86 !important}
.hc-tags button.on{border-color:rgba(110,255,192,.5) !important;background:rgba(110,255,192,.1) !important;color:var(--m) !important}
.hc-step{flex:1;display:flex;border:1px solid rgba(110,255,192,.35);border-radius:6px;overflow:hidden;background:rgba(0,0,0,.4);height:46px}
.hc-step.dim{border-color:rgba(255,255,255,.07);opacity:.45}
.hc-step button{width:46px;display:flex !important;align-items:center;justify-content:center;font:600 18px var(--mono) !important;color:#cfd8d4 !important}
.hc-step button:first-child{border-right:1px solid rgba(255,255,255,.07) !important}.hc-step button:last-child{border-left:1px solid rgba(255,255,255,.07) !important}
.hc-step div{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;font:700 20px var(--disp)}
.hc-step div small{font:500 10px var(--mono);color:var(--dim);letter-spacing:.08em}
.hc-nl{width:140px;display:flex !important;align-items:center;justify-content:center;gap:8px;border:1px solid rgba(255,255,255,.12) !important;border-radius:6px;font:700 12px var(--disp) !important;letter-spacing:.1em;color:#9aaaa3 !important;background:rgba(0,0,0,.4) !important}
.hc-nl.on{border-color:rgba(110,255,192,.55) !important;background:rgba(110,255,192,.12) !important;color:var(--m) !important}
.hc-acc{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hc-acc button{display:flex !important;align-items:center;justify-content:center;gap:8px;height:44px;border:1px solid rgba(255,255,255,.1) !important;border-radius:6px;font:700 12.5px var(--disp) !important;letter-spacing:.1em;color:#6f8079 !important}
.hc-acc button svg{width:15px;height:15px}
.hc-acc button.on{border-color:rgba(110,255,192,.5) !important;background:rgba(110,255,192,.1) !important;color:var(--m) !important}
.hc-acc button.on.pv{border-color:rgba(255,207,110,.5) !important;background:rgba(255,207,110,.08) !important;color:#ffcf6e !important}
.hc-hint{margin:2px 0 0;font-size:12px;color:#5d6d66;line-height:1.45}
.hc-prev{display:flex;gap:12px;align-items:center;padding:12px 14px;border:1px solid rgba(110,255,192,.25);background:#08100d;clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)}
.hc-prev img{width:34px;height:40px;object-fit:contain;flex-shrink:0}
.hc-prev .t{flex:1;min-width:0}.hc-prev b{display:block;font:600 15px var(--disp);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-prev span{display:block;font-size:12px;color:#7d8d86;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.hc-prev small{font:10.5px var(--mono);color:#6f8079;text-align:right;line-height:1.5;flex-shrink:0}
.hc-create{margin-top:auto;width:100%;display:flex !important;align-items:center;justify-content:center;gap:10px;padding:16px !important;background:var(--m) !important;color:#04110b !important;font:700 15px var(--disp) !important;letter-spacing:.22em;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));flex-shrink:0}
.hc-create:disabled{opacity:.5}
.hc-code{display:flex;gap:8px}
.hc-code .box{flex:1;display:flex;align-items:center;gap:10px;padding:0 12px;height:46px;border:1px solid rgba(255,255,255,.1);border-radius:6px;background:rgba(0,0,0,.4)}
.hc-code .box span{font:500 10.5px var(--mono);letter-spacing:.14em;color:var(--dim)}
.hc-code input{flex:1;min-width:0;border:none;background:transparent;color:#f2f7f5;font:600 16px var(--mono);letter-spacing:.3em;text-transform:uppercase;outline:none}
.hc-code .go{padding:0 20px !important;background:rgba(143,227,255,.14) !important;color:#8fe3ff !important;font:700 13px var(--disp) !important;letter-spacing:.14em;border-radius:6px}
.hc-rm{width:100%;display:flex !important;align-items:center;gap:12px;padding:11px 10px !important;border:1px solid var(--line) !important;margin-bottom:7px !important;background:rgba(255,255,255,.018) !important;text-align:left;border-radius:4px}
.hc-rm:hover{border-color:rgba(110,255,192,.35) !important}
.hc-rm img{width:30px;height:36px;object-fit:contain;flex-shrink:0}
.hc-rm .t{flex:1;min-width:0}.hc-rm b{display:flex;align-items:baseline;gap:8px;font:600 14.5px var(--disp);white-space:nowrap;overflow:hidden}
.hc-rm b small{font:500 10.5px var(--mono);color:#5d6d66}
.hc-seats{display:flex;align-items:center;gap:8px;margin-top:6px}
.hc-seats i{display:inline-block;width:6px;height:9px;background:rgba(255,255,255,.1);margin-right:2px}
.hc-seats i.f{background:var(--m)}.hc-seats i.x{background:#ff9a8a}
.hc-seats span{font:10.5px var(--mono);color:#6f8079}
.hc-rdet h2{margin:4px 0 0;font:700 24px var(--disp);word-break:break-word}
.hc-rdet .lab{font:600 10.5px var(--mono);letter-spacing:.16em;color:var(--m)}
.hc-rcode{display:inline-flex;align-items:center;gap:6px;font:600 14px var(--mono);letter-spacing:.2em;background:rgba(255,255,255,.06);padding:6px 8px 6px 12px}
.hc-rgrid{display:grid;grid-template-columns:1.3fr 1fr 1fr;border:1px solid var(--line);margin:14px 0}
.hc-rgrid>div{padding:11px 13px;min-width:0}.hc-rgrid>div+div{border-left:1px solid var(--line)}
.hc-rgrid small{display:block;font:500 9.5px var(--mono);letter-spacing:.12em;color:#5d6d66}
.hc-rgrid b{display:flex;align-items:center;gap:5px;margin-top:4px;font:600 14px var(--disp);white-space:nowrap;overflow:hidden}
.hc-crew{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:6px;margin:8px 0 18px}
.hc-crew div{aspect-ratio:1/1.25;border-radius:6px 6px 2px 2px;border:1px solid rgba(255,255,255,.14);display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
.hc-crew div.f{border-color:rgba(110,255,192,.3);background:rgba(110,255,192,.05)}
.hc-crew img{width:92%;height:92%;object-fit:contain}
.hc-two{display:flex;gap:10px}
.hc-two .bk2{flex:1;height:50px;border:1px solid rgba(255,255,255,.14) !important;border-radius:6px;font:700 13px var(--disp) !important;letter-spacing:.14em;color:#9aaaa3 !important}
.hc-two .hc-create{flex:2;margin-top:0}
.hc-m .hc-banner{height:auto;border:none}
.hc-m .hc-banner img{position:static;transform:none;width:108%;margin-left:-4%;height:auto;display:block;-webkit-mask-image:none;mask-image:none}
.hc-m .hc-banner:after{background:linear-gradient(180deg,rgba(4,7,6,.85) 0,rgba(4,7,6,0) 22%,rgba(4,7,6,0) 60%,#040706 100%)}
.hc-m .hc-banner .bk{position:absolute;left:14px;top:calc(12px + env(safe-area-inset-top,0px));z-index:1;width:40px;height:40px;border-radius:10px;border:1px solid rgba(110,255,192,.3) !important;background:rgba(4,7,6,.75) !important;display:flex !important;align-items:center;justify-content:center}
.hc-m .hc-banner .bk svg{width:18px;height:18px}
.hc-mtabs{display:grid;grid-template-columns:1fr 1fr;margin:0 16px 4px;padding:3px;border:1px solid var(--line);border-radius:8px;background:rgba(0,0,0,.35);flex-shrink:0}
.hc-mtabs button{height:38px;border-radius:6px;font:700 12.5px var(--disp) !important;letter-spacing:.14em;color:#6f8079 !important;display:flex !important;align-items:center;justify-content:center;gap:7px}
.hc-mtabs button.on{background:rgba(110,255,192,.12) !important;color:var(--m) !important;box-shadow:inset 0 0 0 1px rgba(110,255,192,.35)}
.hc-mtabs em{font:600 10px var(--mono);font-style:normal;padding:1px 5px;border-radius:3px;background:rgba(255,255,255,.08);color:#b8c4bf}
.hc-m .hc-fp-m{flex:1;overflow-y:auto;display:flex;flex-direction:column;padding:14px 16px calc(18px + env(safe-area-inset-bottom,0px));min-height:0}
.hc-m .hc-crew{gap:4px}
`;
const LOCK_P = 'M6 11V8a6 6 0 0112 0v3M5 11h14v10H5z';
const DICE_P = 'M4 4h16v16H4zM8.5 8.5h.01M15.5 15.5h.01M12 12h.01';
const GLOBE_P = 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18';

function CloseBtn({ onClose }) {
  return <button type="button" className="hc-closeb" onClick={onClose}><Ico d={P.back} c="#7d8d86" />BACK TO HANGAR<kbd>ESC</kbd></button>;
}

// [PLAY PASS - REAL NEAR] what you pay, where it goes, and the refund rule
function PayNote({ cfg, ready, compact }) {
  const [open, setOpen] = useState(false);
  if (ready && compact && !open) {
    return (
      <button type="button" onClick={() => setOpen(true)} style={{ display: 'block', width: '100%', textAlign: 'center', font: '11px var(--mono)', color: '#9fb0a8', padding: '8px 0 2px' }}>
        <b style={{ color: '#ffcf6e' }}>Real NEAR</b> · paid to <b style={{ color: '#ffcf6e' }}>{cfg.receivingAccountId}</b> · <span style={{ textDecoration: 'underline' }}>How it works ›</span>
      </button>
    );
  }
  if (!ready) {
    return <div className="hc-note" style={{ textAlign: 'center', fontSize: 12, padding: '10px 12px', border: '1px solid rgba(255,207,110,.25)', marginTop: 10 }}>Play Pass payments are being updated. Buying opens again in a few minutes — nothing is charged until then.</div>;
  }
  return (
    <div className="hc-note" style={{ textAlign: 'left', fontSize: 11.5, lineHeight: 1.55, padding: '10px 12px', border: '1px solid rgba(255,207,110,.25)', background: 'rgba(255,207,110,.05)', marginTop: 10 }}>
      <b style={{ color: '#ffcf6e' }}>Real NEAR on mainnet.</b> You pay from your own NEAR wallet (HOT, Meteor or Intear) straight to the game's official wallet <b style={{ color: '#ffcf6e' }}>{cfg.receivingAccountId}</b>. You approve it inside your wallet — the game never sees your keys.
      <br /><span style={{ color: '#9fb0a8' }}>{cfg.refundPolicy || "If your payment arrives but Play Pass isn't switched on, we send the NEAR back. Once Play Pass is active, purchases are final."}</span>
    </div>
  );
}

export function PlayPassScreen({ mobile, onClose, pp }) {
  const owned = !!pp.owned;
  const total = pp.skins.length;
  const unlocked = owned ? Math.min(pp.status?.unlockedVariantCount ?? 0, total) : 0;
  const next = owned && pp.status && unlocked < total ? pp.skins[unlocked] : null;
  const NameTag = pp.NameTag;
  const cfg = pp.config;
  const buyArea = owned ? (
    <div className="hc-owned">
      <b>✓ YOU HAVE PLAY PASS</b>
      <span>{unlocked}/{total} skins unlocked{next && pp.status ? ` · play ${pp.status.gamesUntilNextUnlock} more game${pp.status.gamesUntilNextUnlock === 1 ? '' : 's'} for ${next.name}` : unlocked >= total ? ' · all current skins unlocked' : ''}</span>
      <div className="hc-prog"><i style={{ width: `${total ? (unlocked / total) * 100 : 0}%` }} /></div>
      <span style={{ marginTop: 10 }}>Change your skin from the hangar with the arrows under your crewmate.</span>
    </div>
  ) : !cfg ? <div className="hc-note" style={{ textAlign: 'center' }}>Loading…</div>
    : !cfg.enabled ? <div className="hc-note" style={{ textAlign: 'center' }}>Play Pass purchases are unavailable right now. Check back soon!</div>
    : (
      <>
        <div className="hc-price">
          {cfg.discountPercent > 0 && <span className="off">{cfg.discountPercent}% OFF</span>}
          <b>{cfg.effectivePriceNear} NEAR{cfg.discountPercent > 0 && <s>{cfg.priceNear}</s>}</b>
          <span>REAL NEAR · ONE-TIME · YOURS FOREVER</span>
        </div>
        {pp.error && <div className="hc-note hc-err" style={{ textAlign: 'center' }}>{pp.error}</div>}
        {pp.busy && pp.step && <div className="hc-note" style={{ textAlign: 'center', color: '#ffcf6e' }}>{pp.step}</div>}
        <button type="button" className="hc-buy" disabled={pp.busy || !pp.payReady} onClick={pp.onBuy}>{pp.busy ? 'WAITING FOR YOUR WALLET…' : !pp.payReady ? 'PAYMENTS UPDATING…' : `PAY ${cfg.effectivePriceNear} NEAR WITH YOUR WALLET`}</button>
        <PayNote cfg={cfg} ready={pp.payReady} />
      </>
    );
  const lockIco = <svg viewBox="0 0 24 24" fill="none"><path d={LOCK_P} stroke="#9aa0ad" strokeWidth="2.2" strokeLinejoin="round" /></svg>;
  const feats = (
    <div className="hc-feats">
      <div className="hc-feat wide">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h3>PREMIUM SKINS</h3>
          {owned && pp.status && <span style={{ marginLeft: 'auto', font: '11px var(--mono)', color: 'var(--dim)' }}>{unlocked}/{total} UNLOCKED</span>}
        </div>
        <p>{owned ? 'A new skin unlocks as you keep playing.' : `Ironclaw unlocks the moment you buy, then a new skin every ${cfg?.unlockGamesGap || 2} games.`}</p>
        <div className="hc-skins">
          {pp.skins.map((v, i) => {
            const on = owned && i < unlocked;
            return (
              <div key={v.id} className={`hc-skin ${on ? 'on' : 'off'}`}>
                <img src={v.img} alt="" />
                <b>{v.name}</b>
                {!on && <em>{lockIco}</em>}
              </div>
            );
          })}
          <button type="button" className="hc-skin req" onClick={pp.onRequestCustom}>
            <div className="q">+</div>
            <b>Request your own character</b>
          </button>
        </div>
      </div>
      <div className="hc-feat">
        <h3>GIFS IN CHAT</h3>
        <p>Search and send GIFs in Lobby, Meeting and Ghost chat.</p>
        <div className="hc-demo">
          <span className="hc-bub">anyone see red near reactor?</span>
          <span className="hc-gif">GIF<small>KLIPY</small></span>
        </div>
      </div>
      <div className="hc-feat">
        <h3>SHOUT HIGHLIGHT</h3>
        <p>Type IN ALL CAPS and your message lights up gold, so nobody misses it.</p>
        <div className="hc-demo">
          <span className="hc-bub">i think it's red tbh</span>
          <span className="hc-bub gold">IT'S RED, VOTE NOW</span>
        </div>
      </div>
      <div className="hc-feat wide">
        <h3>2× $SABOTEUR EVERY MATCH</h3>
        <p>Every match reward in $SABOTEUR testnet tokens is doubled for Play Pass holders. These are testnet tokens: they have no value today, and nothing is promised about the future.</p>
        <div className="hc-demo" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <span className="hc-bub">#2 finish · +600 $SABOTEUR</span>
          <span className="hc-bub gold">WITH PLAY PASS · +1,200 $SABOTEUR</span>
        </div>
      </div>
      <div className="hc-feat wide">
        <h3>GOLD NAME TAG + PROFILE FRAME</h3>
        <p>A gold sigil on your name everywhere — lobby, match, chat, votes, ranks — and a glowing frame on your profile picture.</p>
        <div className="hc-demo" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="hc-frame">{pp.skins[0] && <img src={pp.skins[0].img} alt="" />}</div>
          <div>
            <div style={{ font: '10.5px var(--mono)', color: 'var(--dim)', marginBottom: 4 }}>YOUR NAME SHOWS AS</div>
            <span style={{ fontSize: 16 }}>{NameTag ? <NameTag name={pp.name || 'YourName'} premium /> : pp.name}</span>
          </div>
        </div>
      </div>
      <div className="hc-feat wide" style={{ borderStyle: 'dashed', borderColor: 'rgba(255,215,94,.35)' }}>
        <h3>MORE PERKS COMING · INCLUDED</h3>
        <p>New premium features are added to Play Pass over time. If you have Play Pass, each new perk unlocks for you automatically — no extra payment.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="hc-demo" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 84, opacity: 1 - (i - 1) * 0.18 }}>
              <span style={{ width: 22, height: 22, display: 'block' }}>{lockIco}</span>
              <span style={{ font: '600 10px var(--mono)', letterSpacing: '.14em', color: '#ffd75e' }}>NEW PERK · SOON</span>
            </div>
          ))}
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 12 }}>Got an idea for a perk? Send it from <b style={{ color: '#cfd8d3' }}>Inbox → Report an issue → Feedback</b>.</p>
      </div>
    </div>
  );
  if (mobile) {
    return (
      <div className="hc-page">
        <MobileHead title="PLAY PASS" sub="One-time purchase · yours forever" onBack={onClose} />
        <div className="hc-mbody">
          <img className="hc-pp-hero" src={pp.passImg} alt="Play Pass" style={{ width: '70%', marginBottom: 16 }} />
          {owned && <div style={{ marginBottom: 14 }}>{buyArea}</div>}
          {feats}
        </div>
        {!owned && cfg && cfg.enabled && (
          <div className="hc-mbuy">
            <div className="pr"><b>{cfg.effectivePriceNear} NEAR</b><span>{cfg.discountPercent > 0 ? `${cfg.discountPercent}% OFF · was ${cfg.priceNear}` : 'one-time · forever'}</span></div>
            <button type="button" className="hc-buy" disabled={pp.busy || !pp.payReady} onClick={pp.onBuy}>{pp.busy ? 'WAITING…' : !pp.payReady ? 'UPDATING…' : 'PAY WITH WALLET'}</button>
          </div>
        )}
        {!owned && cfg && cfg.enabled && <div style={{ padding: '0 16px 10px' }}>{pp.busy && pp.step && <div className="hc-note" style={{ textAlign: 'center', color: '#ffcf6e', marginBottom: 6 }}>{pp.step}</div>}<PayNote cfg={cfg} ready={pp.payReady} compact /></div>}
        {!owned && pp.error && <div className="hc-note hc-err" style={{ textAlign: 'center', padding: '0 16px 10px' }}>{pp.error}</div>}
        {!owned && cfg && !cfg.enabled && <div className="hc-note" style={{ textAlign: 'center', padding: '0 16px 16px' }}>Play Pass purchases are unavailable right now.</div>}
      </div>
    );
  }
  return (
    <>
      <DeskHead title="PLAY PASS" sub="Premium skins, GIFs, gold name tag · one-time purchase">
        <CloseBtn onClose={onClose} />
      </DeskHead>
      <div className="hc-pp">
        <div className="hc-pp-l">
          <img className="hc-pp-hero" src={pp.passImg} alt="Play Pass" />
          {buyArea}
          {!owned && <button type="button" className="hc-note" style={{ textAlign: 'center' }} onClick={onClose}>Not now</button>}
        </div>
        <div className="hc-pp-r">
          <div className="hc-sec">WHAT YOU GET</div>
          {feats}
        </div>
      </div>
    </>
  );
}

export function FreePlayScreen({ mobile, onClose, f }) {
  const [mOpen, setMOpen] = useState(false);
  const matchesText = (lim) => (lim == null ? 'NO LIMIT' : `${lim} MATCH${lim > 1 ? 'ES' : ''}`);
  const NameTag = f.NameTag, Badge = f.LegionBadge;
  const nl = f.noLimit;
  const host = (
    <>
      <div className="hc-fl">
        <label htmlFor="hcFpName"><span><b>01</b> · ROOM NAME</span><small>OPTIONAL · {f.name.length}/24</small></label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input id="hcFpName" className="hc-in" maxLength={24} placeholder="Friday Night Saboteurs" value={f.name} onChange={(e) => f.setName(e.target.value)} />
          <button type="button" className="hc-sq" title="Random name" aria-label="Random room name" onClick={f.randomName}><Ico d={DICE_P} c="#9aaaa3" w={1.5} /></button>
        </div>
      </div>
      <div className="hc-fl">
        <label htmlFor="hcFpBrief"><span><b>02</b> · BRIEFING</span><small>OPTIONAL · {f.briefing.length}/120</small></label>
        <textarea id="hcFpBrief" className="hc-in" rows={2} maxLength={120} style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 13.5 }} placeholder="House rules, voice chat link, or a note for your crew" value={f.briefing} onChange={(e) => f.setBriefing(e.target.value)} />
        <div className="hc-tags">
          {f.allTags.map((t) => <button type="button" key={t} className={f.tags.includes(t) ? 'on' : ''} onClick={() => f.toggleTag(t)}>{t}</button>)}
        </div>
      </div>
      <div className="hc-fl">
        <div className="lb"><span><b>03</b> · MATCHES</span></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className={`hc-step ${nl ? 'dim' : ''}`}>
            <button type="button" aria-label="Fewer matches" onClick={() => (nl ? f.setNoLimit(false) : f.setCount(Math.max(1, f.count - 1)))}>−</button>
            <div>{f.count}<small>{f.count === 1 ? 'MATCH' : 'MATCHES'}</small></div>
            <button type="button" aria-label="More matches" onClick={() => (nl ? f.setNoLimit(false) : f.setCount(Math.min(50, f.count + 1)))}>+</button>
          </div>
          <button type="button" className={`hc-nl ${nl ? 'on' : ''}`} aria-pressed={nl} onClick={() => f.setNoLimit(!nl)}>∞ NO LIMIT</button>
        </div>
      </div>
      <div className="hc-fl">
        <div className="lb"><span><b>04</b> · ACCESS</span></div>
        <div className="hc-acc">
          <button type="button" className={!f.isPrivate ? 'on' : ''} onClick={() => f.setPrivate(false)}><Ico d={GLOBE_P} c="currentColor" w={1.5} />PUBLIC</button>
          <button type="button" className={f.isPrivate ? 'on pv' : ''} onClick={() => f.setPrivate(true)}><Ico d={LOCK_P} c="currentColor" w={1.6} />PRIVATE</button>
        </div>
        <p className="hc-hint">{f.isPrivate ? 'Hidden from the list — players join by code and you approve each one.' : 'Listed under Find a Room — anyone can take a seat.'}</p>
      </div>
      <div className="hc-fl">
        <div className="lb"><span style={{ color: '#46534e' }}>PREVIEW · HOW YOUR CREW SEES IT</span></div>
        <div className="hc-prev">
          {f.myAvatar ? <img src={f.myAvatar} alt="" /> : null}
          <div className="t">
            <b style={{ color: f.name ? '#f2f7f5' : '#5d6d66' }}>{f.name || 'Untitled room'}</b>
            <span>{f.briefing || (f.tags.length ? f.tags.join(' · ') : 'No briefing — players just jump in.')}</span>
          </div>
          <small>1/10<br />{matchesText(nl ? null : f.count)}<br />{f.isPrivate ? 'PRIVATE' : 'PUBLIC'}</small>
        </div>
      </div>
      {f.createError && <div className="hc-note hc-err" style={{ textAlign: 'center', marginBottom: 10 }}>{f.createError}</div>}
      <button type="button" className="hc-create" disabled={f.createBusy} onClick={f.onCreate}>{f.createBusy ? 'CREATING…' : 'CREATE ROOM »'}</button>
    </>
  );
  const sel = f.selected;
  const roomList = (
    <>
      <div className="hc-code">
        <div className="box"><span>CODE</span>
          <input maxLength={6} placeholder="– – – –" aria-label="Room code" value={f.code} onChange={(e) => f.setCode(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === 'Enter') f.onFindCode(); }} />
        </div>
        <button type="button" className="go" disabled={f.joinBusy} onClick={f.onFindCode}>{f.joinBusy && !sel ? '…' : 'FIND'}</button>
      </div>
      <p className="hc-hint" style={{ margin: '8px 0 14px' }}>Private rooms only show up by code. The host approves your request.</p>
      {f.joinError && !sel && <div className="hc-note hc-err" style={{ marginBottom: 10 }}>{f.joinError}</div>}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <span className="hc-day" style={{ margin: 0, color: '#b8c4bf' }}>OPEN FREE ROOMS</span>
        <button type="button" className={`hc-chip ${f.seatsOnly ? 'on' : ''}`} style={{ marginLeft: 'auto' }} onClick={() => f.setSeatsOnly(!f.seatsOnly)}>HAS SEATS</button>
      </div>
      {f.rooms.length > 0 ? f.rooms.map((r) => {
        const n = r.playerCount || 0, full = n >= 10;
        return (
          <button type="button" key={r.code} className="hc-rm" onClick={() => { f.select(r.code); if (mobile) setMOpen(true); }}>
            {f.hostImg(r) ? <img src={f.hostImg(r)} alt="" /> : <span style={{ width: 30 }} />}
            <div className="t">
              <b><span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name || `Room ${r.code}`}</span><small>{r.code}</small></b>
              <div className="hc-seats"><span style={{ display: 'flex' }}>{Array.from({ length: 10 }, (_, k) => <i key={k} className={k < n ? (full ? 'x' : 'f') : ''} />)}</span><span style={{ color: full ? '#ff9a8a' : undefined }}>{n}/10 · {matchesText(r.matchLimit)}</span></div>
            </div>
            <Ico d={P.chev} c="#5d6d66" s={16} />
          </button>
        );
      }) : (
        <div className="hc-empty">
          {f.totalRooms ? 'Every open room is full right now.' : 'No free rooms are open right now.'}
          {!mobile ? <><br />Host one on the left — it shows up here for everyone.</> : <><br /><button type="button" style={{ color: 'var(--m)', marginTop: 8, font: '700 12px var(--disp)', letterSpacing: '.1em' }} onClick={() => f.setTab('host')}>HOST ONE →</button></>}
        </div>
      )}
    </>
  );
  const detail = sel && (
    <div className="hc-rdet">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <span className="lab">FREE PLAY · WAITING IN LOBBY</span>
          <h2>{sel.name || `Room ${sel.code}`}</h2>
        </div>
        <span className="hc-rcode" style={{ marginLeft: 'auto' }}>{sel.code}{f.copyButton(sel.code)}</span>
      </div>
      <p className="hc-hint" style={{ fontSize: 13.5, color: sel.briefing ? '#9aaaa3' : '#5d6d66', margin: '12px 0 8px' }}>{sel.briefing || 'No briefing from the host — just jump in.'}</p>
      {Array.isArray(sel.tags) && sel.tags.length > 0 && <div className="hc-tags">{sel.tags.map((t) => <button type="button" key={t} className="on" style={{ cursor: 'default' }}>{t}</button>)}</div>}
      <div className="hc-rgrid">
        <div><small>HOST</small><b><span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{NameTag ? <NameTag name={sel.hostUsername ? `@${sel.hostUsername}` : sel.hostName} premium={sel.hostHasPlayPass} /> : sel.hostName}</span>{sel.hostHasLegionBadge && Badge ? <Badge size={12} /> : null}</b></div>
        <div><small>MATCHES</small><b>{sel.matchLimit == null ? 'No limit' : `${sel.matchesPlayed || 0}/${sel.matchLimit}`}</b></div>
        <div><small>ENTRY</small><b style={{ color: 'var(--m)' }}>Free</b></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="hc-day" style={{ margin: 0 }}>CREW ON BOARD</span>
        <span style={{ font: '10.5px var(--mono)', color: '#b8c4bf' }}>{sel.playerCount}/10 · {Math.max(0, 10 - (sel.playerCount || 0))} SEATS OPEN</span>
      </div>
      <div className="hc-crew">
        {Array.from({ length: 10 }, (_, k) => { const seat = (sel.seats || [])[k]; return <div key={k} className={seat ? 'f' : ''}>{seat && seat.avatarId ? <img src={f.seatImg(seat)} alt="" /> : null}</div>; })}
      </div>
      {f.joinError && <div className="hc-note hc-err" style={{ textAlign: 'center', marginBottom: 10 }}>{f.joinError}</div>}
      <div className="hc-two">
        <button type="button" className="bk2" onClick={() => { f.select(null); setMOpen(false); }}>BACK</button>
        <button type="button" className="hc-create" disabled={f.joinBusy || (sel.playerCount || 0) >= 10} onClick={f.onTakeSeat}>
          {(sel.playerCount || 0) >= 10 ? 'ROOM FULL' : f.joinBusy ? 'JOINING…' : 'TAKE A SEAT'}
        </button>
      </div>
    </div>
  );
  if (mobile) {
    return (
      <MobileWrap open={mOpen && !!sel}>
        <div className="hc-page top">
          <div className="hc-fp-m" style={{ padding: 0 }}>
            <div className="hc-banner">
              <img src={f.bannerImg} alt="Create Free Play" draggable={false} />
              <button type="button" className="bk" onClick={onClose} aria-label="Back"><Ico d={P.back} c="#6effc0" /></button>
            </div>
            <div style={{ textAlign: 'center', font: '10.5px var(--mono)', letterSpacing: '.12em', color: '#8a9a93', margin: '-4px 0 10px' }}>ENTRY <span style={{ color: 'var(--m)' }}>FREE</span> · NO WALLET NEEDED</div>
            <div className="hc-mtabs">
              <button type="button" className={f.tab === 'host' ? 'on' : ''} onClick={() => f.setTab('host')}>HOST A ROOM</button>
              <button type="button" className={f.tab === 'find' ? 'on' : ''} onClick={() => f.setTab('find')}>FIND A ROOM <em>{f.totalRooms}</em></button>
            </div>
            <div style={{ padding: '14px 16px calc(18px + env(safe-area-inset-bottom,0px))', display: 'flex', flexDirection: 'column', flex: 1 }}>
              {f.tab === 'host' ? host : roomList}
            </div>
          </div>
        </div>
        <div className="hc-page sub">
          <MobileHead title="ROOM" onBack={() => { setMOpen(false); f.select(null); }} />
          <div className="hc-mbody">{detail}</div>
        </div>
      </MobileWrap>
    );
  }
  return (
    <>
      <div className="hc-banner">
        <img src={f.bannerImg} alt="Create Free Play" draggable={false} />
        <div className="bh"><p>ENTRY <em>FREE</em> · NO WALLET NEEDED · UP TO 10 PLAYERS</p></div>
        <CloseBtn onClose={onClose} />
      </div>
      <div className="hc-fp">
        <section>
          <div className="hc-fh"><h2>HOST A ROOM</h2></div>
          {host}
        </section>
        <section>
          {sel ? detail : (
            <>
              <div className="hc-fh"><h2>FIND A ROOM</h2><em>{f.totalRooms} OPEN</em></div>
              {roomList}
            </>
          )}
        </section>
      </div>
    </>
  );
}

/* ---------------- PAID GAMES ---------------- */
// Testnet only (test NEAR). PC: settings | live pot calculator | live games,
// plus a History tab. Phone: Create / Live / History tabs.
const PAID_CSS = `
.pd{--g:#ffcf6e;flex:1;display:flex;flex-direction:column;min-height:0;color:#e6ece9}
.pd-top{display:flex;align-items:center;gap:6px;padding:12px 24px;border-bottom:1px solid var(--line);flex-shrink:0}
.pd-top h1{margin:0 18px 0 0;font:700 19px var(--disp);letter-spacing:.18em;display:flex;align-items:center;gap:10px}
.pd-top h1 i{width:30px;height:30px;background-size:contain;background-repeat:no-repeat;background-position:center;filter:drop-shadow(0 0 10px rgba(255,200,60,.5))}
.pd-tab{font:700 11.5px var(--disp) !important;letter-spacing:.14em;padding:8px 13px !important;color:#6f8079 !important;border:1px solid transparent !important}
.pd-tab.on{color:var(--g) !important;border-color:rgba(255,207,110,.45) !important;background:rgba(255,207,110,.08) !important}
.pd-tn{margin-left:auto;font:600 10.5px var(--mono);padding:5px 9px;border:1px solid rgba(255,207,110,.4);color:var(--g);letter-spacing:.12em}
.pd-cols{flex:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,370px) minmax(0,1fr);min-height:0}
.pd-cols>section{padding:20px 24px;overflow:auto;display:flex;flex-direction:column;gap:15px;min-height:0}
.pd-cols>section+section{border-left:1px solid var(--line)}
.pd h2{margin:0;font:700 15.5px var(--disp);letter-spacing:.2em}
.pd .k{font:600 10.5px var(--mono);letter-spacing:.14em;color:var(--dim);margin-bottom:7px;display:flex;justify-content:space-between}
.pd .k b{color:var(--g);font-weight:600}.pd .k small{color:#46534e;font-size:10px;letter-spacing:.06em}
.pd-seg{display:grid;gap:7px}
.pd-seg button{height:42px;border:1px solid rgba(255,255,255,.1) !important;border-radius:6px;font:700 13px var(--disp) !important;color:#6f8079 !important}
.pd-seg button.on{border-color:rgba(255,207,110,.6) !important;background:rgba(255,207,110,.1) !important;color:var(--g) !important}
.pd-fee{display:flex;align-items:center;gap:10px;border:1px solid rgba(255,207,110,.4);border-radius:6px;background:rgba(0,0,0,.45);padding:0 12px}
.pd-fee img{width:22px;height:22px;border-radius:50%}
.pd-fee input{flex:1;min-width:0;background:transparent;border:none;outline:none;color:#fff7e0;font:600 21px var(--disp);padding:11px 0}
.pd-fee span{font:600 12px var(--mono);color:var(--g)}
.pd-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.pd-chips button{font:600 11px var(--mono) !important;padding:5px 10px !important;border:1px solid rgba(255,255,255,.1) !important;color:#9fb0a8 !important;border-radius:4px}
.pd-chips button.on{border-color:rgba(255,207,110,.5) !important;color:var(--g) !important}
.pd-bal{display:flex;justify-content:space-between;gap:8px;font:11.5px var(--mono);color:var(--dim);padding:9px 12px;border:1px dashed rgba(255,255,255,.12)}
.pd-bal b{color:#fff7e0;font-weight:600}.pd-bal .ok{color:var(--m)}.pd-bal .no{color:#ff9a8a}
.pd-cta{width:100%;height:54px;display:flex !important;align-items:center;justify-content:center;font:700 14.5px var(--disp) !important;letter-spacing:.2em;color:#1c1203 !important;background:linear-gradient(135deg,#ffe08f,#ffcf6e 55%,#c98a1e) !important;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));flex-shrink:0}
.pd-cta:disabled{opacity:.45;filter:grayscale(.4)}
.pd-pot{text-align:center;padding:22px 16px;border:1px solid rgba(255,207,110,.4);background:radial-gradient(120% 80% at 50% 0,rgba(255,207,110,.14),transparent 70%);clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))}
.pd-pot .coin{width:58px;height:58px;margin:0 auto;background-size:contain;background-repeat:no-repeat;background-position:center;filter:drop-shadow(0 0 16px rgba(255,200,60,.5))}
.pd-pot .big{font:700 44px var(--disp);color:#fff;margin:6px 0 2px}.pd-pot .big small{font:600 15px var(--mono);color:var(--g)}
.pd-pot .sub{font:11px var(--mono);color:var(--dim)}
.pd-places{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px}
.pd-places div{padding:10px 6px;border:1px solid var(--line);background:rgba(0,0,0,.3)}
.pd-places b{display:block;font:700 18px var(--disp)}.pd-places span{font:10px var(--mono);color:var(--dim)}
.pd-range{width:100%;margin-top:16px;accent-color:#ffcf6e}
.pd-ends{display:flex;justify-content:space-between;font:10.5px var(--mono);color:var(--dim);margin-top:2px}
.pd-row{width:100%;display:grid !important;grid-template-columns:34px minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px !important;border:1px solid var(--line) !important;background:rgba(255,255,255,.02) !important;text-align:left;margin-bottom:8px}
.pd-row:hover{border-color:rgba(255,207,110,.4) !important}
.pd-row .ic{width:32px;height:32px;background-size:contain;background-repeat:no-repeat;background-position:center}
.pd-row .n{font:600 15px var(--disp);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pd-row .s{font:11px var(--mono);color:var(--dim);margin-top:3px}
.pd-row .pt{text-align:right}.pd-row .pt b{display:block;font:700 15.5px var(--disp);color:var(--g)}.pd-row .pt small{font:10.5px var(--mono);color:var(--dim)}
.pd-tag{font:600 9.5px var(--mono);padding:2px 6px;margin-left:6px;border-radius:3px;letter-spacing:.06em}
.pd-tag.mine{background:rgba(110,255,192,.14);color:var(--m)}.pd-tag.open{background:rgba(255,207,110,.14);color:var(--g)}
.pd-tag.paid{background:rgba(110,255,192,.14);color:var(--m)}.pd-tag.refund{background:rgba(110,200,255,.14);color:#6ec8ff}.pd-tag.live{background:rgba(255,207,110,.14);color:var(--g)}
.pd-empty{padding:30px 12px;text-align:center;font:12.5px var(--mono);color:var(--dim);border:1px dashed rgba(255,255,255,.12);line-height:1.6}
.pd-hint{font:12px/1.5 var(--disp);color:#5d6d66;margin:0}
.pd-err{font:12px var(--mono);color:#ff8a8a;text-align:center}
.pd-hist{flex:1;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);min-height:0}
.pd-hist>section{padding:20px 24px;overflow:auto;min-height:0}.pd-hist>section+section{border-left:1px solid var(--line)}
.pd-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
.pd-stats div{padding:10px 12px;border:1px solid var(--line);background:rgba(255,255,255,.02)}.pd-stats b{display:block;font:700 20px var(--disp)}.pd-stats span{font:10px var(--mono);color:var(--dim);letter-spacing:.1em}
.pd-filt{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}
.pd-filt button{font:600 10.5px var(--mono) !important;padding:5px 10px !important;border:1px solid rgba(255,255,255,.1) !important;color:#8a9a93 !important;letter-spacing:.08em}
.pd-filt button.on{border-color:rgba(255,207,110,.5) !important;color:var(--g) !important;background:rgba(255,207,110,.07) !important}
.pd-h{width:100%;display:grid !important;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:12px 14px !important;border:1px solid var(--line) !important;background:rgba(255,255,255,.02) !important;margin-bottom:8px;text-align:left}
.pd-h.sel{border-color:rgba(255,207,110,.55) !important;background:rgba(255,207,110,.05) !important}
.pd-h .n{font:600 15px var(--disp)}.pd-h .s{font:11px var(--mono);color:var(--dim);margin-top:3px}
.pd-h .r{text-align:right}.pd-h .r b{display:block;font:700 15px var(--disp)}.pd-h .r small{font:10.5px var(--mono)}
.pd .won{color:var(--m)}.pd .lost{color:#8a9590}.pd .ref{color:#6ec8ff}
.pd-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0 14px}
.pd-meta div{padding:9px 10px;border:1px solid var(--line)}.pd-meta b{display:block;font:600 15px var(--disp)}.pd-meta span{font:9.5px var(--mono);color:var(--dim);letter-spacing:.1em}
.pd-st{width:100%;border-collapse:collapse;font:12.5px var(--mono)}
.pd-st th{text-align:left;font:600 9.5px var(--mono);color:var(--dim);letter-spacing:.12em;padding:6px;border-bottom:1px solid var(--line)}
.pd-st td{padding:8px 6px;border-bottom:1px solid rgba(255,255,255,.04)}.pd-st td img{width:20px;vertical-align:middle;margin-right:6px}
.pd-st tr.me td{background:rgba(110,255,192,.06)}.pd-st .pz{color:var(--g);font-weight:600;text-align:right}
.pd-tx{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:14px;padding:10px 12px;border:1px solid rgba(110,255,192,.3);background:rgba(110,255,192,.05);font:11.5px var(--mono);color:#b8c4bf}
.pd-tx a{color:var(--m)}
.pd-m .pd-top{padding:10px 14px}.pd-m .pd-top h1{font-size:15px;margin-right:auto}
.pd-mt{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--line);flex-shrink:0}
.pd-mt button{padding:12px 0 !important;font:700 11.5px var(--disp) !important;letter-spacing:.14em;color:#6f8079 !important}
.pd-mt button.on{color:var(--g) !important;box-shadow:inset 0 -2px 0 var(--g)}
.pd-mb{flex:1;overflow:auto;padding:14px 16px calc(18px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:14px}
.pd-potm{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 14px;border:1px solid rgba(255,207,110,.35);background:rgba(255,207,110,.06)}
.pd-potm b{font:700 19px var(--disp);color:#fff}.pd-potm span{font:10.5px var(--mono);color:var(--dim)}
`;
const PD_SPLIT = [50, 30, 20];
const r3 = (x) => Math.round(x * 1000) / 1000;
const fmtDay = (d) => { try { return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }); } catch (e) { return ''; } };

function PaidHistory({ f, mobile }) {
  const h = f.history;
  const [filt, setFilt] = useState('all');
  const [selId, setSelId] = useState(null);
  useEffect(() => { if (!h.data && !h.loading) h.load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  const all = [...((h.data && h.data.hosted) || []), ...((h.data && h.data.joined) || [])]
    .filter((x) => x.kind === 'auto' && x.paid)
    .filter((x, i, arr) => arr.findIndex((y) => y.id === x.id) === i)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const list = all.filter((x) => filt === 'all' || (filt === 'hosted' && x.hosted) || (filt === 'joined' && !x.hosted) || (filt === 'won' && x.myRank));
  const won = r3(all.reduce((a, x) => a + (x.myPrize || 0), 0));
  const top3 = all.filter((x) => x.myRank).length;
  const sel = list.find((x) => x.id === selId) || (mobile ? null : list[0]);
  const status = (x) => (x.state === 'Distributed' ? ['paid', 'PAID OUT'] : x.state === 'Refunded' ? ['refund', 'REFUNDED'] : ['live', x.state === 'Locked' ? 'LIVE' : 'OPEN']);
  const result = (x) => {
    if (x.state === 'Refunded') return <><b className="ref">{x.entryFeeNear} back</b><small className="ref">refunded</small></>;
    if (x.state !== 'Distributed') return <><b>{x.matchesPlayed}/{x.maxMatches}</b><small style={{ color: 'var(--g)' }}>in progress</small></>;
    if (x.myRank) return <><b className="won">#{x.myRank} · +{x.myPrize}</b><small className="won">tNEAR</small></>;
    return <><b className="lost">{x.iPaidIn ? 'No prize' : 'Hosted'}</b><small className="lost">{x.iPaidIn ? `−${x.entryFeeNear}` : 'did not play'}</small></>;
  };
  const detail = (x) => {
    const nM = Math.max(x.matchesPlayed || 0, ...(x.standings || []).map((e) => (e.matches || []).length), 0);
    const prizeOf = (name) => (x.winners || []).find((w) => w.name === name);
    return (
      <div>
        <div className="k" style={{ color: 'var(--g)', marginBottom: 2 }}>{fmtDay(x.createdAt)} · {x.hosted ? 'HOSTED BY YOU' : 'YOU JOINED'}</div>
        <div style={{ font: '700 21px var(--disp)' }}>{x.name}</div>
        <div className="pd-meta"><div><b>{x.matchesPlayed}/{x.maxMatches}</b><span>MATCHES</span></div><div><b>{x.players}</b><span>PLAYERS</span></div><div><b>{x.entryFeeNear}</b><span>ENTRY tNEAR</span></div><div><b style={{ color: 'var(--g)' }}>{x.potNear}</b><span>POT tNEAR</span></div></div>
        {(x.standings || []).length > 0 ? (
          <table className="pd-st"><tbody>
            <tr><th>#</th><th>PLAYER</th>{!mobile && Array.from({ length: nM }, (_, k) => <th key={k}>M{k + 1}</th>)}<th>TOTAL</th><th style={{ textAlign: 'right' }}>PRIZE</th></tr>
            {x.standings.map((e, i) => { const w = prizeOf(e.name); return (
              <tr key={i} className={e.me ? 'me' : ''}><td>{i + 1}</td><td>{e.avatarId && f.avatarImg ? <img src={f.avatarImg(e.avatarId)} alt="" /> : null}{e.me ? 'You' : e.name}</td>
                {!mobile && Array.from({ length: nM }, (_, k) => <td key={k}>{(e.matches || [])[k] != null ? `+${e.matches[k]}` : '—'}</td>)}
                <td><b>{e.total}</b></td><td className="pz" style={w ? undefined : { color: '#5d6d66' }}>{w ? w.amountNear : '—'}</td></tr>
            ); })}
          </tbody></table>
        ) : <p className="pd-hint">{x.state === 'Refunded' ? 'No match was finished, so every entry fee went back.' : 'Standings show up here once the game pays out.'}</p>}
        {x.payoutTxHash && <div className="pd-tx"><span>Paid by the contract{x.finishedAt ? ` · ${fmtDay(x.finishedAt)}` : ''}</span><a href={`${f.explorer}/txns/${x.payoutTxHash}`} target="_blank" rel="noreferrer">View on NEAR explorer ↗</a></div>}
        {x.state !== 'Distributed' && x.state !== 'Refunded' && x.roomCode && <button type="button" className="pd-cta" style={{ marginTop: 14 }} onClick={() => f.onRejoin(x)}>OPEN THIS GAME »</button>}
      </div>
    );
  };
  const listEl = (
    <>
      <div className="pd-stats"><div><b>{all.length}</b><span>PLAYED</span></div><div><b className="won">+{won}</b><span>tNEAR WON</span></div><div><b>{top3}</b><span>TOP-3 FINISHES</span></div></div>
      <div className="pd-filt">{['all', 'joined', 'hosted', 'won'].map((k) => <button type="button" key={k} className={filt === k ? 'on' : ''} onClick={() => setFilt(k)}>{k.toUpperCase()}</button>)}</div>
      {h.loading && !h.data && <p className="pd-hint">Loading your paid games…</p>}
      {h.error && <p className="pd-err">{h.error}</p>}
      {h.data && list.length === 0 && <div className="pd-empty">{all.length ? 'Nothing in this filter yet.' : 'No paid games yet. Create one or join a live game — every result lands here.'}</div>}
      {list.map((x) => { const [cls, txt] = status(x); return (
        <React.Fragment key={x.id}>
          <button type="button" className={`pd-h ${sel && sel.id === x.id ? 'sel' : ''}`} onClick={() => setSelId(sel && sel.id === x.id && mobile ? null : x.id)}>
            <div style={{ minWidth: 0 }}><div className="n">{x.name}<span className={`pd-tag ${cls}`}>{txt}</span></div>
              <div className="s">{fmtDay(x.createdAt)} · {x.matchesPlayed}/{x.maxMatches} matches · {x.players} players · {x.entryFeeNear} each{x.hosted ? ' · you hosted' : ''}</div></div>
            <div className="r">{result(x)}</div>
          </button>
          {mobile && sel && sel.id === x.id && <div style={{ padding: '4px 4px 14px' }}>{detail(x)}</div>}
        </React.Fragment>
      ); })}
    </>
  );
  if (mobile) return <div className="pd-mb">{listEl}</div>;
  return (
    <div className="pd-hist">
      <section><h2 style={{ marginBottom: 14 }}>YOUR PAID GAMES</h2>{listEl}</section>
      <section>{sel ? detail(sel) : <div className="pd-empty">Pick a game on the left to see its standings and payout.</div>}</section>
    </div>
  );
}

export function PaidGamesScreen({ mobile, onClose, f }) {
  const [mTab, setMTab] = useState('create');
  const [crowd, setCrowd] = useState(6);
  const fee = parseFloat(f.fee) || 0;
  const ready = !!f.matches && fee > 0;
  const bal = f.balance != null ? Number(f.balance) : null;
  const enough = bal == null ? null : bal >= fee + 0.05; // a little extra for gas
  const pot = r3(fee * crowd * 0.95);
  const places = PD_SPLIT.map((p) => r3(pot * p / 100));
  const coinBg = { backgroundImage: `url(${f.coinImg})` };
  const create = (
    <>
      <div><div className="k"><span><b>01</b> · GAME NAME</span><small>OPTIONAL · {f.name.length}/40</small></div>
        <input className="hc-in" maxLength={40} placeholder="Friday High Rollers" value={f.name} onChange={(e) => f.setName(e.target.value)} /></div>
      <div><div className="k"><span><b>02</b> · MATCHES</span><small>DEFAULT 3</small></div>
        <div className="pd-seg" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>{[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} className={f.matches === n ? 'on' : ''} onClick={() => f.setMatches(n)}>{n}</button>)}</div>
        <p className="pd-hint" style={{ marginTop: 6 }}>Points from every match add up — the top 3 totals win.</p></div>
      <div><div className="k"><span><b>03</b> · ENTRY FEE PER PLAYER</span><small>YOU PAY IT TOO</small></div>
        <div className="pd-fee"><img src={f.nearImg} alt="NEAR" /><input type="number" min="0" step="0.05" inputMode="decimal" placeholder="0.00" aria-label="Entry fee in test NEAR" value={f.fee} onChange={(e) => f.setFee(e.target.value)} /><span>tNEAR</span></div>
        <div className="pd-chips">{[0.1, 0.25, 0.5, 1, 2].map((v) => <button type="button" key={v} className={fee === v ? 'on' : ''} onClick={() => f.setFee(String(v))}>{v}</button>)}</div></div>
      <div><div className="k"><span><b>04</b> · WHO CAN JOIN</span></div>
        <div className="pd-seg" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <button type="button" className={!f.isPrivate ? 'on' : ''} onClick={() => f.setPrivate(false)}>PUBLIC</button>
          <button type="button" className={f.isPrivate ? 'on' : ''} onClick={() => f.setPrivate(true)}>PRIVATE</button>
        </div>
        <p className="pd-hint" style={{ marginTop: 6 }}>{f.isPrivate ? 'Hidden from the list. Share the invite link from the lobby — you approve each player before they pay.' : 'Listed under Live Games — anyone can pay the fee and join. You can still share the invite link.'}</p></div>
      <div className="pd-bal">
        <span>Your test wallet: <b>{bal == null ? '—' : `${bal.toFixed(2)} tNEAR`}</b></span>
        {bal != null && fee > 0 && <span className={enough ? 'ok' : 'no'}>{enough ? 'enough for your entry ✓' : 'not enough — top up first'}</span>}
      </div>
      {f.error && <div className="pd-err">{f.error}</div>}
      <button type="button" className="pd-cta" disabled={f.busy || !ready || enough === false} onClick={f.onCreate}>
        {f.busy ? 'CONFIRM IN YOUR WALLET…' : ready ? 'CREATE PAID GAME »' : 'PICK AN ENTRY FEE'}
      </button>
      {f.pending && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          <button type="button" onClick={f.onRetry} style={{ color: 'var(--g)', textDecoration: 'underline', font: '12px var(--mono)' }}>Retry room setup (game #{f.pending}) — won't charge again</button>
          <button type="button" onClick={f.onReport} style={{ color: f.reportStatus === 'sent' ? '#6effc0' : '#ff9a9a', textDecoration: 'underline', font: '11.5px var(--mono)' }}>
            {f.reportStatus === 'sending' ? 'Reporting…' : f.reportStatus === 'sent' ? '✓ Reported — we’ll sort this out' : 'Still stuck? Report this payment'}
          </button>
        </div>
      )}
    </>
  );
  const potCard = (
    <div className="pd-pot">
      <div className="coin" style={coinBg} />
      <div className="k" style={{ justifyContent: 'center', color: 'var(--g)', margin: '8px 0 0' }}>IF {crowd} PLAYERS JOIN</div>
      <div className="big">{pot} <small>tNEAR</small></div>
      <div className="sub">{fee || 0} × {crowd} players − 5% fee</div>
      <div className="pd-places">
        {places.map((v, i) => <div key={i}><b style={{ color: ['#ffd75e', '#c9d3d9', '#d9965c'][i] }}>{v}</b><span>{['1ST', '2ND', '3RD'][i]} · {PD_SPLIT[i]}%</span></div>)}
      </div>
      <input className="pd-range" type="range" min={3} max={10} value={crowd} onChange={(e) => setCrowd(Number(e.target.value))} aria-label="Number of players" />
      <div className="pd-ends"><span>3 players</span><span>10 players</span></div>
    </div>
  );
  const live = (
    <>
      {f.loading && f.items.length === 0 && <p className="pd-hint">Checking for live games…</p>}
      {f.items.length > 0 ? f.items.map((it) => (
        <button type="button" key={it.key} className="pd-row" onClick={it.onClick}>
          <span className="ic" style={coinBg} />
          <div style={{ minWidth: 0 }}><div className="n">{it.title || 'Paid Game'}<span className={`pd-tag ${it.mine ? 'mine' : 'open'}`}>{it.mine ? "YOU'RE IN" : 'OPEN'}</span></div><div className="s">{it.metaLeft}</div></div>
          <div className="pt"><b>{it.fee} tNEAR</b><small>per player</small></div>
        </button>
      )) : !f.loading && <div className="pd-empty">No live paid games yet.<br />{mobile ? 'Create one in the first tab.' : 'Create one on the left — it shows up here for everyone.'}</div>}
      <p className="pd-hint">Private games aren't listed — open their invite link, or enter the code on Home.</p>
    </>
  );
  const head = (tabs) => (
    <div className="pd-top">
      <h1><i style={coinBg} />PAID GAMES</h1>
      {tabs}
      <span className="pd-tn">{mobile ? 'TESTNET' : 'TESTNET · TEST NEAR ONLY'}</span>
      {!mobile && <CloseBtn onClose={onClose} />}
      {mobile && <button type="button" onClick={onClose} aria-label="Back" style={{ marginLeft: 8, color: 'var(--m)', font: '600 12px var(--mono)' }}>✕</button>}
    </div>
  );
  if (mobile) {
    return (
      <MobileWrap open={false}><div className="hc-page top"><div className="pd pd-m">
        <style>{PAID_CSS}</style>
        {head(null)}
        <div className="pd-mt">
          {[['create', 'CREATE'], ['live', `LIVE · ${f.items.length}`], ['hist', 'HISTORY']].map(([k, t]) => <button type="button" key={k} className={mTab === k ? 'on' : ''} onClick={() => setMTab(k)}>{t}</button>)}
        </div>
        {mTab === 'hist' ? <PaidHistory f={f} mobile /> : (
          <div className="pd-mb">
            {mTab === 'create' ? <>
              {create.props.children.slice(0, 4)}
              <div className="pd-potm"><div><span>POT IF {crowd} JOIN</span><br /><b>{pot} tNEAR</b></div><div style={{ textAlign: 'right' }}><span>1ST / 2ND / 3RD</span><br /><b style={{ fontSize: 14, color: 'var(--g)' }}>{places.join(' · ')}</b></div></div>
              <input className="pd-range" type="range" min={3} max={10} value={crowd} onChange={(e) => setCrowd(Number(e.target.value))} aria-label="Number of players" style={{ marginTop: -6 }} />
              {create.props.children.slice(4)}
            </> : live}
          </div>
        )}
      </div></div></MobileWrap>
    );
  }
  return (
    <div className="pd">
      <style>{PAID_CSS}</style>
      {head(<>
        <button type="button" className={`pd-tab ${f.tab !== 'hist' ? 'on' : ''}`} onClick={() => f.setTab('play')}>CREATE &amp; JOIN</button>
        <button type="button" className={`pd-tab ${f.tab === 'hist' ? 'on' : ''}`} onClick={() => f.setTab('hist')}>HISTORY</button>
      </>)}
      {f.tab === 'hist' ? <PaidHistory f={f} /> : (
        <div className="pd-cols">
          <section><h2>CREATE A PAID GAME</h2>{create}</section>
          <section style={{ background: 'rgba(255,207,110,.02)' }}>
            <h2>THE POT</h2>
            {potCard}
            <p className="pd-hint" style={{ textAlign: 'center' }}>Drag to see the pot for any room size. The contract holds every entry fee and pays the top 3 the moment the last match ends.</p>
          </section>
          <section><h2>LIVE GAMES <span className="pd-tag open" style={{ verticalAlign: 'middle' }}>{f.items.length} OPEN</span></h2>{live}</section>
        </div>
      )}
    </div>
  );
}

/* ---------------- POINTS (this week) ---------------- */
const CSS3 = `
.hc-pts{flex:1;display:grid;grid-template-columns:minmax(320px,420px) minmax(0,1fr);min-height:0;border-top:1px solid var(--line)}
.hc-pts>div{padding:26px 28px;overflow:auto;min-height:0}
.hc-pts>div:first-child{border-right:1px solid var(--line);background:radial-gradient(120% 70% at 50% 0,rgba(255,215,94,.09),transparent 70%)}
.hc-ptbig{text-align:center;padding:22px 16px;border:1px solid rgba(255,215,94,.35);background:rgba(255,215,94,.05);clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))}
.hc-ptbig img{width:54px;filter:drop-shadow(0 0 12px rgba(255,200,60,.5))}
.hc-ptbig small{display:block;font:600 10.5px var(--mono);letter-spacing:.2em;color:#c9a862;margin-top:8px}
.hc-ptbig b{display:block;font:700 54px var(--disp);color:#fff;line-height:1.05;margin:4px 0 10px}
.hc-trend{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:99px;font:600 11.5px var(--mono)}
.hc-trend.up{background:rgba(110,255,192,.14);color:#6effc0}.hc-trend.dn{background:rgba(255,92,92,.14);color:#ff8a8a}
.hc-ptbig p{margin:12px 0 0;font:11.5px var(--mono);color:var(--dim)}.hc-ptbig p b{display:inline;font:inherit;color:#cfd3da;margin:0}
.hc-ptgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:12px}
.hc-ptgrid div{padding:14px;border:1px solid var(--line);background:rgba(255,255,255,.02);min-width:0}
.hc-ptgrid svg{width:18px;height:18px;margin-bottom:8px}
.hc-ptgrid b{display:block;font:600 22px var(--disp);color:#fff}.hc-ptgrid span{font:10px var(--mono);letter-spacing:.1em;color:var(--dim)}
.hc-m .hc-ptgrid{grid-template-columns:1fr 1fr}
.hc-sharebtn{width:100%;display:flex !important;align-items:center;justify-content:center;gap:9px;padding:14px !important;margin-top:16px;background:linear-gradient(135deg,#ffe08f,#f2b84b 55%,#c98a1e) !important;color:#1c1203 !important;font:700 13px var(--disp) !important;letter-spacing:.18em;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
.hc-sharebtn svg{width:16px;height:16px}
`;
const PT_ICON = {
  last: 'M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z',
  rank: 'M9 20V11h6v9M3 20v-5h6M15 20v-7h6v7M2 20h20',
  matches: 'M7 8h10a4 4 0 014 4v1.5a3.5 3.5 0 01-6.3 2.1L13.5 14h-3l-1.2 1.6A3.5 3.5 0 013 13.5V12a4 4 0 014-4z',
  best: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z',
  missions: 'M9 5h10M9 12h10M9 19h10M4 5.5l1 1 2-2M4 12.5l1 1 2-2M4 19.5l1 1 2-2',
  wins: 'M7 4h10v4a5 5 0 01-10 0zM7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3M12 13v4M8 21h8M9 17h6',
  kills: 'M14.5 3.5L20.5 9.5 10 20l-3.5-1.2L5.3 15zM5.3 15l-2.8 2.8 3.7 3.7L9 18.7',
  share: 'M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6',
};
export function PointsScreen({ mobile, onClose, pts }) {
  const s = pts.summary;
  const cur = pts.current || 0;
  const big = !s ? null : (() => {
    const last = s.lastWeekPoints || 0, diff = cur - last;
    const pct = last > 0 ? Math.round((diff / last) * 100) : (cur > 0 ? 100 : 0);
    const ms = s.weekResetsAt ? new Date(s.weekResetsAt).getTime() - Date.now() : 0;
    const d = Math.max(0, Math.floor(ms / 864e5)), h = Math.max(0, Math.floor((ms % 864e5) / 36e5));
    return (
      <div className="hc-ptbig">
        {pts.coin && <img src={pts.coin} alt="" />}
        <small>POINTS THIS WEEK</small>
        <b>{cur}</b>
        {(last > 0 || cur > 0) && <span className={`hc-trend ${diff >= 0 ? 'up' : 'dn'}`}>{diff >= 0 ? '▲' : '▼'} {diff >= 0 ? '+' : ''}{diff} ({pct >= 0 ? '+' : ''}{pct}%) vs last week</span>}
        <p>Weekly board resets in <b>{d}d {h}h</b></p>
      </div>
    );
  })();
  const tile = (k, v, l) => <div key={l}><Ico d={PT_ICON[k]} c="#ffd75e" s={18} /><b>{v}</b><span>{l}</span></div>;
  const tiles = s && (
    <>
      <div className="hc-sec">THIS WEEK</div>
      <div className="hc-ptgrid">
        {tile('rank', s.weeklyRank ? `#${s.weeklyRank}` : '—', 'WEEKLY RANK')}
        {tile('matches', s.matchesThisWeek ?? 0, 'MATCHES')}
        {tile('wins', s.winsThisWeek ?? 0, 'WINS')}
        {tile('missions', s.missionsThisWeek ?? 0, 'MISSIONS')}
        {tile('kills', s.killsThisWeek ?? 0, 'KILLS')}
        {tile('last', s.lastWeekPoints || 0, 'LAST WEEK')}
        {tile('best', s.bestWeekPoints ?? 0, 'BEST WEEK')}
      </div>
      <div className="hc-note">Points turn into $SABOTEUR (testnet) by rank after every match. <button type="button" style={{ color: 'var(--c)', textDecoration: 'underline' }} onClick={pts.onWallet}>See it in Wallet →</button></div>
    </>
  );
  const states = (
    <>
      {pts.loading && !s && <div className="hc-skel" style={{ height: 200 }} />}
      {pts.error && !pts.loading && <div className="hc-empty hc-err">{pts.error}</div>}
    </>
  );
  const share = s && <button type="button" className="hc-sharebtn" onClick={pts.onShare}><Ico d={PT_ICON.share} c="#1c1203" w={2} />SHARE MY POINTS</button>;
  if (mobile) {
    return (
      <div className="hc-page">
        <style>{CSS3}</style>
        <MobileHead title="POINTS" sub="This week" onBack={onClose} />
        <div className="hc-mbody">{states}{big}{share}<div style={{ height: 16 }} />{tiles}</div>
      </div>
    );
  }
  return (
    <>
      <style>{CSS3}</style>
      <DeskHead title="POINTS" sub="How your week is going" />
      <div className="hc-pts">
        <div>{states}{big}{share}</div>
        <div>{tiles}</div>
      </div>
    </>
  );
}

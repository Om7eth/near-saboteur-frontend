// [POOL v2] Pool Games screen - Create / Live pools (+ join) / My history
// (+ pay winners). Desktop and mobile layouts, same look as the Home console.
// Two payout modes: "Testnet · auto payout" (on-chain contract, fixed 50/30/20)
// and "Real NEAR · host pays" (host sets the split and pays winners by hand).
import React, { useEffect, useMemo, useState } from 'react';

const P = {
  back: 'M15 5l-7 7 7 7', auto: 'M4 12a8 8 0 0113.7-5.6L20 9M20 4v5h-5M20 12a8 8 0 01-13.7 5.6L4 15M4 20v-5h5',
  hand: 'M3 7h18v10H3zM7 12h.01M17 12h.01M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18',
  lock: 'M6 11V8a6 6 0 0112 0v3M5 11h14v10H5z', play: 'M7 4.5v15l12-7.5z',
  eye: 'M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12zM12 9.3a2.7 2.7 0 100 5.4 2.7 2.7 0 000-5.4z',
  host: 'M4 20V9l8-5 8 5v11M9 20v-6h6v6', info: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v6M12 7.5h.01', warn: 'M12 3l10 18H2zM12 10v5M12 18h.01',
  refresh: 'M19 9a7 7 0 10.7 5M19 3.5V9h-5.5', chev: 'M9 5l7 7-7 7',
};
const Ico = ({ d, c = '#8fe3ff', w = 1.7, s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d={d} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /></svg>;
const RANKC = ['#ffd75e', '#c9d3d9', '#d9965c'];
const rk = (i) => <span style={{ color: RANKC[i] || '#9fb0a8' }}>#{i + 1}</span>;
const fmt = (n) => (Math.round(n * 1000) / 1000).toString();
const NEAR_RE = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
// Any mainnet NEAR account: name.near, name.tg (HOT), 64-hex implicit, 0x… - just not a testnet one.
export const isNearMainnetAddress = (w) => { const v = String(w || '').trim().toLowerCase(); return v.length >= 2 && v.length <= 64 && NEAR_RE.test(v) && !v.endsWith('.testnet') && (v.includes('.') || /^[0-9a-f]{64}$/.test(v) || /^0x[0-9a-f]{40}$/.test(v)); };
const PRESETS = { winner: [100], top3: [50, 30, 20], top5: [40, 25, 15, 12, 8], custom: null };
const PRESET_LABEL = { winner: 'WINNER TAKES ALL', top3: 'TOP 3 · 50/30/20', top5: 'TOP 5', custom: 'CUSTOM' };

const CSS = `
.pg{--c:#8fe3ff;--m:#6effc0;--g:#ffd75e;--r:#ff6b6b;--dim:#7d8d86;--line:rgba(255,255,255,.07);--mono:'IBM Plex Mono',monospace;--disp:'Space Grotesk',sans-serif;display:flex;flex-direction:column;min-height:0;flex:1;color:#e6ece9}
.pg *{box-sizing:border-box}
.pg button{font:inherit;color:inherit;background:none;border:none;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}
.pg input{font:inherit;color:inherit}
.pg-hd{display:flex;align-items:flex-end;gap:16px;padding:20px 28px 14px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.pg-hd h1{margin:0;font:700 26px var(--disp);letter-spacing:.2em}.pg-hd p{margin:4px 0 0;font:12px var(--mono);color:var(--dim)}
.pg-hd .r{margin-left:auto;display:flex;gap:8px;align-items:center}
.pg-tabs{display:flex;gap:4px;padding:3px;border:1px solid var(--line);border-radius:8px;background:rgba(0,0,0,.35)}
.pg-tabs button{padding:8px 16px !important;border-radius:6px;font:600 11.5px var(--mono) !important;letter-spacing:.12em;color:var(--dim) !important}
.pg-tabs button.on{background:rgba(143,227,255,.13) !important;color:var(--c) !important}
.pg-body{flex:1;min-height:0;display:grid}
.pg-col{overflow:auto;min-height:0;padding:20px 28px 28px;min-width:0}
.pg-col+.pg-col{border-left:1px solid var(--line)}
.pg-sec{font:600 10.5px var(--mono);letter-spacing:.18em;color:var(--dim);margin:0 0 10px;display:flex;align-items:center;gap:10px}
.pg-sec b{color:var(--c);font-weight:600}.pg-sec:after{content:"";flex:1;height:1px;background:var(--line)}
.pg-fld{margin-bottom:18px}
.pg-in{width:100%;height:46px;padding:0 13px;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.1);border-radius:6px;outline:none;font:15px var(--disp)}
.pg-in:focus{border-color:rgba(143,227,255,.6)}
.pg-in.mono{font-family:var(--mono);font-size:14px}
.pg-amt{display:flex;align-items:center;height:56px;border:1px solid rgba(143,227,255,.35);border-radius:6px;background:rgba(0,0,0,.4);overflow:hidden}
.pg-amt input{flex:1;min-width:0;height:100%;padding:0 14px;background:none;border:none;outline:none;font:700 24px var(--disp)}
.pg-amt span{padding:0 16px;font:600 12px var(--mono);color:var(--c);letter-spacing:.1em;border-left:1px solid var(--line);height:100%;display:flex;align-items:center}
.pg-quick{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;align-items:center}
.pg-quick button{padding:5px 11px !important;border:1px solid var(--line) !important;border-radius:99px;font:11px var(--mono) !important;color:#9fb0a8 !important}
.pg-seg{display:grid;gap:6px}
.pg-seg button{height:48px;border:1px solid rgba(255,255,255,.1) !important;border-radius:6px;font:700 17px var(--disp) !important;color:#9fb0a8 !important;background:rgba(0,0,0,.35) !important}
.pg-seg button.on{border-color:rgba(143,227,255,.6) !important;background:rgba(143,227,255,.12) !important;color:var(--c) !important}
.pg-seg small{display:block;font:500 9px var(--mono);letter-spacing:.08em;color:var(--dim);margin-top:2px}
.pg-cards{display:grid;gap:8px}
.pg-card{text-align:left;padding:13px 14px !important;border:1px solid rgba(255,255,255,.1) !important;border-radius:6px;background:rgba(0,0,0,.3) !important;display:flex;gap:11px;align-items:flex-start;position:relative}
.pg-card b{display:block;font:600 14px var(--disp);padding-right:18px}.pg-card span{display:block;font-size:12px;color:#8fa39a;margin-top:3px;line-height:1.4}
.pg-card.on{border-color:rgba(143,227,255,.6) !important;background:rgba(143,227,255,.08) !important}
.pg-card.on.gold{border-color:rgba(255,215,94,.6) !important;background:rgba(255,215,94,.07) !important}
.pg-card i{position:absolute;top:10px;right:10px;width:16px;height:16px;border-radius:50%;border:1.5px solid rgba(255,255,255,.25)}
.pg-card.on i{border-color:var(--c);background:var(--c);box-shadow:inset 0 0 0 3px #0a1512}
.pg-card.on.gold i{border-color:var(--g);background:var(--g)}
.pg-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.pg-chip{padding:7px 12px !important;border-radius:99px;border:1px solid var(--line) !important;font:500 11px var(--mono) !important;letter-spacing:.06em;color:#9fb0a8 !important}
.pg-chip.on{border-color:rgba(143,227,255,.55) !important;color:var(--c) !important;background:rgba(143,227,255,.08) !important}
.pg-split{border:1px solid var(--line)}
.pg-sr{display:grid;grid-template-columns:44px 1fr 96px 100px 26px;align-items:center;gap:10px;padding:8px 12px;border-top:1px solid var(--line)}
.pg-sr:first-child{border-top:none}
.pg-sr .rk{font:700 14px var(--disp)}
.pg-sr .bar{height:8px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}.pg-sr .bar i{display:block;height:100%;background:linear-gradient(90deg,var(--c),#4fbfe6);border-radius:99px}
.pg-sr .pc{display:flex;align-items:center;border:1px solid rgba(255,255,255,.12);border-radius:5px;height:32px;background:rgba(0,0,0,.4)}
.pg-sr .pc input{width:100%;min-width:0;background:none;border:none;outline:none;text-align:right;font:600 14px var(--mono);padding:0 4px}
.pg-sr .pc span{padding:0 8px;font:12px var(--mono);color:var(--dim)}
.pg-sr .nr{text-align:right;font:600 13px var(--mono);color:var(--g)}
.pg-sr .x{color:#5d6d66 !important;font-size:18px !important}
.pg-sfoot{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-top:1px solid var(--line);font:11.5px var(--mono)}
.pg-ok{color:var(--m)}.pg-bad{color:var(--r)}
.pg-warn,.pg-info{display:flex;gap:10px;padding:11px 13px;font-size:12.5px;line-height:1.5}
.pg-warn{border:1px solid rgba(255,207,110,.4);background:rgba(255,207,110,.07);color:#e9d7a8}.pg-warn b{color:var(--g)}
.pg-info{border:1px solid rgba(143,227,255,.3);background:rgba(143,227,255,.06);color:#cfe7ef}.pg-info b{color:var(--c)}
.pg-big{width:100%;display:flex !important;align-items:center;justify-content:center;gap:10px;padding:16px !important;background:var(--c) !important;color:#04121a !important;font:700 15px var(--disp) !important;letter-spacing:.2em;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
.pg-big.gold{background:linear-gradient(135deg,#ffe08f,#f2b84b 55%,#c98a1e) !important;color:#1c1203 !important}
.pg-big:disabled{opacity:.45;cursor:default}
.pg-sub{text-align:center;font:11px var(--mono);color:var(--dim);margin-top:8px}
.pg-err{color:#ff8a8a;font:12px var(--mono);text-align:center;margin-top:8px}
.pg-tag{display:inline-block;font:600 9.5px var(--mono);letter-spacing:.12em;padding:3px 7px;border-radius:3px;white-space:nowrap}
.t-test{color:var(--c);background:rgba(143,227,255,.12)}.t-real{color:var(--g);background:rgba(255,215,94,.13)}
.t-open{color:var(--m);background:rgba(110,255,192,.1)}.t-live{color:#ff8a8a;background:rgba(255,107,107,.12)}.t-done{color:#9fb0a8;background:rgba(255,255,255,.07)}.t-priv{color:#ffcf6e;background:rgba(255,207,110,.1)}
.pg-pc{border:1px solid rgba(143,227,255,.35);background:linear-gradient(180deg,rgba(143,227,255,.07),rgba(0,0,0,.2));clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))}
.pg-pc.real{border-color:rgba(255,215,94,.4);background:linear-gradient(180deg,rgba(255,215,94,.07),rgba(0,0,0,.2))}
.pg-top{display:flex;gap:14px;align-items:center;padding:18px;flex-wrap:wrap}
.pg-coin{width:58px;height:58px;flex-shrink:0;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe9a0,#e0a52a 60%,#8a5a10);display:flex;align-items:center;justify-content:center;box-shadow:0 0 22px rgba(255,200,60,.35);font:800 21px var(--disp);color:#5a3a05}
.pg-top h3{margin:0;font:700 20px var(--disp);word-break:break-word}
.pg-top p{margin:4px 0 0;font:12px var(--mono);color:var(--dim);display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.pg-amtb{margin-left:auto;text-align:right}.pg-amtb b{display:block;font:700 30px var(--disp);color:var(--g);line-height:1}.pg-amtb span{font:10.5px var(--mono);color:var(--dim)}
.pg-facts{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line)}
.pg-facts div{padding:11px 14px;min-width:0}.pg-facts div+div{border-left:1px solid var(--line)}
.pg-facts small{display:block;font:500 9.5px var(--mono);letter-spacing:.12em;color:#5d6d66}.pg-facts b{display:block;font:600 14px var(--disp);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pg-prz{border-top:1px solid var(--line);padding:12px 18px 16px}
.pg-prz h4{margin:0 0 8px;font:600 10.5px var(--mono);letter-spacing:.14em;color:var(--dim)}
.pg-pz{display:flex;align-items:center;gap:10px;padding:5px 0;font:13px var(--mono)}
.pg-pz .rk{width:34px;font:700 14px var(--disp)}
.pg-pz .bar{flex:1;height:6px;border-radius:99px;background:rgba(255,255,255,.06);overflow:hidden}.pg-pz .bar i{display:block;height:100%;background:var(--g)}
.pg-pz .v{width:110px;text-align:right;color:var(--g);font-weight:600}
.pg-pl{display:grid !important;grid-template-columns:44px minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px !important;border:1px solid var(--line) !important;background:rgba(255,255,255,.018) !important;margin-bottom:8px !important;border-radius:4px;text-align:left;width:100%}
.pg-pl.on{border-color:rgba(143,227,255,.55) !important;background:rgba(143,227,255,.06) !important}
.pg-pl.real{border-left:3px solid rgba(255,215,94,.7) !important}
.pg-pl .ic{width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe9a0,#e0a52a 60%,#8a5a10);display:flex;align-items:center;justify-content:center;font:800 15px var(--disp);color:#5a3a05}
.pg-pl b{display:flex;align-items:center;gap:8px;font:600 14.5px var(--disp);min-width:0}
.pg-pl b em{font-style:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pg-pl .s{display:block;font:11px var(--mono);color:var(--dim);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pg-pl .v{text-align:right}.pg-pl .v b{justify-content:flex-end;font:700 17px var(--disp);color:var(--g)}.pg-pl .v .pg-tag{margin-top:4px}
.pg-seats{display:inline-flex;gap:2px;vertical-align:middle;margin-right:6px}.pg-seats i{width:5px;height:8px;background:rgba(255,255,255,.12)}.pg-seats i.f{background:var(--c)}
.pg-empty{padding:28px 12px;text-align:center;font:12.5px var(--mono);color:var(--dim);border:1px dashed rgba(255,255,255,.12)}
.pg-steps{display:flex;margin:18px 0}
.pg-steps div{flex:1;padding:8px 0;border-bottom:2px solid var(--line);font:600 10.5px var(--mono);letter-spacing:.12em;color:#5d6d66;text-align:center}
.pg-steps div.on{border-color:var(--c);color:var(--c)}.pg-steps div.done{border-color:rgba(143,227,255,.35);color:#8fb4bf}
.pg-stat{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:16px}
.pg-stat div{padding:13px 15px;border:1px solid var(--line);background:rgba(255,255,255,.02);min-width:0}
.pg-stat b{display:block;font:600 22px var(--disp)}.pg-stat span{font:10px var(--mono);letter-spacing:.1em;color:var(--dim)}
.pg table{width:100%;border-collapse:collapse}
.pg th{font:500 9.5px var(--mono);letter-spacing:.1em;color:var(--dim);text-align:left;padding:0 8px 8px;text-transform:uppercase;white-space:nowrap}
.pg td{padding:11px 8px;border-top:1px solid var(--line);font:12.5px var(--mono);color:#cfd8d3;white-space:nowrap}
.pg td.n,.pg th.n{text-align:right}
.pg-paid{color:var(--m);font-weight:600}.pg-due{color:var(--g);font-weight:600}
.pg-gear{display:inline-flex !important;align-items:center;gap:7px;padding:7px 11px !important;border:1px solid var(--line) !important;border-radius:6px;font:500 11px var(--mono) !important;letter-spacing:.08em;color:#9fb0a8 !important;white-space:nowrap}
.pg-gear.hi{border-color:rgba(143,227,255,.45) !important;color:var(--c) !important}
.pg-mh{display:flex;align-items:center;gap:10px;padding:calc(14px + env(safe-area-inset-top,0px)) 16px 12px;flex-shrink:0}
.pg-mh .bk{width:40px;height:40px;border-radius:10px;border:1px solid var(--line) !important;display:flex !important;align-items:center;justify-content:center;background:rgba(255,255,255,.03) !important}
.pg-mh h1{margin:0;font:700 19px var(--disp);letter-spacing:.18em}.pg-mh p{margin:2px 0 0;font:10.5px var(--mono);color:var(--dim)}
.pg-m .pg-tabs{margin:0 16px 10px;display:flex}.pg-m .pg-tabs button{flex:1;padding:9px 4px !important;font-size:10.5px !important}
.pg-mb{flex:1;overflow:auto;padding:4px 16px 24px;min-height:0}
.pg-mst{flex-shrink:0;padding:12px 16px calc(14px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--line);background:rgba(4,8,7,.97)}
.pg-m .pg-facts{grid-template-columns:1fr 1fr}.pg-m .pg-facts div:nth-child(3){border-left:none;border-top:1px solid var(--line)}.pg-m .pg-facts div:nth-child(4){border-top:1px solid var(--line)}
.pg-m .pg-amtb{margin-left:0;width:100%;text-align:left;display:flex;align-items:baseline;gap:8px}
.pg-m .pg-sr{grid-template-columns:40px 1fr 74px 26px;gap:8px}.pg-m .pg-sr .bar{display:none}
.pg-m .pg-stat{grid-template-columns:1fr 1fr}
.pg-m .pg-r3{grid-template-columns:1fr !important}
.pg-m .pg-seg button{height:44px}
.pg-wr{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:11px;align-items:center;padding:10px 2px;border-bottom:1px solid var(--line)}
.pg-wr b{display:block;font:600 14px var(--disp)}.pg-wr span{display:block;font:11px var(--mono);color:var(--dim);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pg-wr .rk{font:700 15px var(--disp)}
`;

/* ---------------- CREATE ---------------- */
function CreateForm({ c, setC, mobile }) {
  const split = c.split;
  const sum = split.reduce((a, b) => a + (Number(b) || 0), 0);
  const real = c.fund === 'real';
  const amount = Number(c.amount) || 0;
  const setSplitAt = (i, v) => { const n = [...split]; n[i] = Math.max(0, Math.min(100, parseInt(v, 10) || 0)); setC({ split: n, preset: 'custom' }); };
  return (
    <>
      <div className="pg-sec"><b>01</b> · POOL NAME</div>
      <div className="pg-fld"><input className="pg-in" maxLength={40} placeholder="Friday Night Pool" value={c.name} onChange={(e) => setC({ name: e.target.value })} /></div>

      <div className="pg-sec"><b>02</b> · HOW WILL WINNERS BE PAID?</div>
      <div className="pg-fld pg-cards pg-r3" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <button type="button" className={`pg-card ${!real ? 'on' : ''}`} onClick={() => setC({ fund: 'test', split: [50, 30, 20], preset: 'top3' })}>
          <Ico d={P.auto} /><div><b>Testnet · auto payout</b><span>The prize sits in the game contract and is paid to the top 3 automatically. Test NEAR — no real value.</span></div><i />
        </button>
        <button type="button" className={`pg-card gold ${real ? 'on' : ''}`} onClick={() => setC({ fund: 'real' })}>
          <Ico d={P.hand} c="#ffd75e" /><div><b>Real NEAR · you pay</b><span>You send real NEAR to the winners yourself after the game. Players give their .near address when they join.</span></div><i />
        </button>
      </div>
      {real && (
        <div className="pg-fld pg-warn"><Ico d={P.warn} c="#ffd75e" s={18} /><div><b>You're responsible for paying.</b> The game shows you who won and their wallets — it never holds or sends real NEAR. Players see: "Prizes are paid by the host, not by NEAR Saboteur."</div></div>
      )}

      <div className="pg-sec"><b>03</b> · PRIZE POOL</div>
      <div className="pg-fld">
        <div className="pg-amt"><input inputMode="decimal" value={c.amount} onChange={(e) => setC({ amount: e.target.value.replace(/[^\d.]/g, '') })} placeholder="0" /><span>{real ? 'NEAR' : 'TEST NEAR'}</span></div>
        <div className="pg-quick">
          {[1, 5, 10, 25].map((v) => <button type="button" key={v} onClick={() => setC({ amount: String(v) })}>{v}</button>)}
          {!real && c.balance != null && <span style={{ marginLeft: 'auto', font: '11px var(--mono)', color: 'var(--dim)' }}>Your wallet: {c.balance} test NEAR</span>}
        </div>
      </div>

      <div className="pg-sec"><b>04</b> · WHO GETS WHAT</div>
      {real ? (
        <>
          <div className="pg-chips">
            {Object.keys(PRESETS).map((k) => <button type="button" key={k} className={`pg-chip ${c.preset === k ? 'on' : ''}`} onClick={() => setC({ preset: k, split: PRESETS[k] ? [...PRESETS[k]] : split })}>{PRESET_LABEL[k]}</button>)}
          </div>
          <div className="pg-fld pg-split">
            {split.map((p, i) => (
              <div className="pg-sr" key={i}>
                <span className="rk">{rk(i)}</span>
                <span className="bar"><i style={{ width: `${Math.min(100, p)}%` }} /></span>
                <span className="pc"><input inputMode="numeric" value={p} onChange={(e) => setSplitAt(i, e.target.value)} /><span>%</span></span>
                <span className="nr">{fmt(amount * p / 100)} N</span>
                {split.length > 1 ? <button type="button" className="x" aria-label="Remove place" onClick={() => setC({ split: split.filter((_, j) => j !== i), preset: 'custom' })}>×</button> : <span />}
              </div>
            ))}
            <div className="pg-sfoot">
              {split.length < 10 ? <button type="button" style={{ color: 'var(--c)', font: '11.5px var(--mono)' }} onClick={() => setC({ split: [...split, 0], preset: 'custom' })}>+ ADD PLACE</button> : <span />}
              <span className={sum === 100 ? 'pg-ok' : 'pg-bad'}>{sum === 100 ? '✓ 100% split' : `${sum}% — must add up to 100%`}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="pg-fld pg-info"><Ico d={P.info} s={18} /><div>Testnet pools pay the <b>top 3: 50% / 30% / 20%</b> (after the contract's 5% fee) — the split is set by the pool contract. Pick <b>Real NEAR</b> to set your own split.</div></div>
      )}

      <div className="pg-sec"><b>05</b> · MATCHES</div>
      <div className="pg-fld pg-seg" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
        {[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} className={c.matches === n ? 'on' : ''} onClick={() => setC({ matches: n })}>{n}{n === 3 && <small>DEFAULT</small>}</button>)}
      </div>

      <div className="pg-sec"><b>06</b> · WHO CAN JOIN</div>
      <div className="pg-fld pg-cards pg-r3" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <button type="button" className={`pg-card ${c.access === 'public' ? 'on' : ''}`} onClick={() => setC({ access: 'public' })}><Ico d={P.globe} /><div><b>Public</b><span>Listed under Live Pools. Anyone can join, and anyone can share the link.</span></div><i /></button>
        <button type="button" className={`pg-card ${c.access === 'private' ? 'on' : ''}`} onClick={() => setC({ access: 'private' })}><Ico d={P.lock} /><div><b>Private · you approve</b><span>Hidden. Only you get the invite link, and you accept or decline each player.</span></div><i /></button>
      </div>

      <div className="pg-sec"><b>07</b> · YOUR ROLE · DECIDED NOW, CAN'T CHANGE LATER</div>
      <div className="pg-fld pg-cards pg-r3" style={{ gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)' }}>
        <button type="button" className={`pg-card ${c.role === 'play' ? 'on' : ''}`} onClick={() => setC({ role: 'play' })}><Ico d={P.play} /><div><b>Host & play</b><span>You take a seat and compete for the prize like everyone else.</span></div><i /></button>
        <button type="button" className={`pg-card ${c.role === 'watch' ? 'on' : ''}`} onClick={() => setC({ role: 'watch' })}><Ico d={P.eye} /><div><b>Host & watch</b><span>You don't play — you watch the whole match live, every player.</span></div><i /></button>
        <button type="button" className={`pg-card ${c.role === 'host' ? 'on' : ''}`} onClick={() => setC({ role: 'host' })}><Ico d={P.host} /><div><b>Host only</b><span>Run it for your community: let players in, start it, pay the winners.</span></div><i /></button>
      </div>
      {real && c.role === 'play' && (
        <>
          <div className="pg-sec">YOUR .NEAR WALLET · IN CASE YOU PLACE</div>
          <div className="pg-fld"><input className="pg-in mono" placeholder="yourname.near / yourname.tg" value={c.wallet} onChange={(e) => setC({ wallet: e.target.value.trim().toLowerCase() })} /></div>
        </>
      )}
    </>
  );
}

function PoolCard({ pool, me }) {
  const real = pool.payout === 'manual';
  const amt = Number(pool.prizeNear || 0);
  const split = pool.split || [50, 30, 20];
  const payPool = real ? amt : amt * 0.95;
  const unit = real ? 'NEAR' : 'tNEAR';
  return (
    <div className={`pg-pc ${real ? 'real' : ''}`}>
      <div className="pg-top">
        <div className="pg-coin">N</div>
        <div style={{ minWidth: 0 }}>
          <h3>{pool.poolName || 'Pool game'}</h3>
          <p>Hosted by {pool.poolHostUsername ? `@${pool.poolHostUsername}` : (pool.poolHostName || me || 'you')} <span className={`pg-tag ${real ? 't-real' : 't-test'}`}>{real ? 'REAL NEAR · HOST PAYS' : 'TESTNET · AUTO PAYOUT'}</span></p>
        </div>
        <div className="pg-amtb"><b>{fmt(amt)}</b><span>{real ? 'NEAR PRIZE' : 'TEST NEAR PRIZE'}</span></div>
      </div>
      <div className="pg-facts">
        <div><small>MATCHES</small><b>{pool.maxMatches || 3}</b></div>
        <div><small>SEATS</small><b>{pool.seats ?? 0}/10</b></div>
        <div><small>ENTRY</small><b style={{ color: 'var(--m)' }}>Free</b></div>
        <div><small>HOST</small><b>{pool.hostRole === 'watch' ? 'Watching' : pool.hostRole === 'host' ? 'Hosting only' : 'Playing'}</b></div>
      </div>
      <div className="pg-prz">
        <h4>HOW THE PRIZE IS SPLIT · BY TOTAL POINTS OVER {pool.maxMatches || 3} MATCHES</h4>
        {split.map((p, i) => (
          <div className="pg-pz" key={i}><span className="rk">{rk(i)}</span><span className="bar"><i style={{ width: `${p}%` }} /></span><span className="v">{fmt(payPool * p / 100)} {unit}</span></div>
        ))}
        {!real && <div style={{ font: '10.5px var(--mono)', color: 'var(--dim)', marginTop: 6 }}>After the contract's 5% fee.</div>}
      </div>
    </div>
  );
}

/* ---------------- JOIN ---------------- */
function JoinPanel({ pool, j, mobile }) {
  const real = pool.payout === 'manual';
  const [wallet, setWallet] = useState(j.savedWallet || '');
  useEffect(() => { setWallet(j.savedWallet || ''); }, [pool.roomCode]); // eslint-disable-line react-hooks/exhaustive-deps
  const valid = !real || isNearMainnetAddress(wallet);
  const mine = pool.mine;
  const full = (pool.seats || 0) >= 10;
  const started = pool.state && pool.state !== 'Open';
  const action = mine ? 'ENTER LOBBY' : !pool.isPublic ? 'REQUEST TO JOIN' : 'JOIN POOL';
  return (
    <>
      <PoolCard pool={pool} />
      {!mine && (
        <div className="pg-steps"><div className="done">1 · READ</div><div className={real ? 'on' : 'done'}>2 · WALLET</div><div className={real ? '' : 'on'}>3 · JOIN</div></div>
      )}
      {!mine && real && (
        <>
          <div className="pg-sec">YOUR .NEAR WALLET · FOR YOUR PRIZE</div>
          <div className="pg-fld">
            <input className="pg-in mono" placeholder="yourname.near / yourname.tg" value={wallet} onChange={(e) => setWallet(e.target.value.trim().toLowerCase())} />
            {wallet && <p style={{ font: '11px var(--mono)', margin: '6px 0 0', color: valid ? 'var(--m)' : '#ff8a8a' }}>{valid ? '✓ Looks like a valid mainnet address · saved for next time' : wallet.endsWith('.testnet') ? 'That is a testnet address — prizes here are real NEAR, so use your mainnet wallet (yourname.near, yourname.tg …)' : 'Needs to be a mainnet NEAR address, like yourname.near or yourname.tg'}</p>}
          </div>
          <div className="pg-fld pg-info"><Ico d={P.info} s={18} /><div>Your address is shared <b>only with the host</b> so they can send your prize. Prizes in this pool are paid <b>by the host</b>, not by NEAR Saboteur.</div></div>
        </>
      )}
      {!mine && !real && (
        <div className="pg-fld pg-info"><Ico d={P.auto} s={18} /><div>Prizes go automatically to your in-game wallet. Test NEAR has no real value.</div></div>
      )}
      {!mine && !pool.isPublic && <div className="pg-fld pg-info"><Ico d={P.lock} s={18} /><div>Private pool — the host gets your request{real ? ' with your wallet' : ''} and lets you in.</div></div>}
      <button type="button" className={`pg-big ${real ? 'gold' : ''}`} disabled={j.busy || !valid || (!mine && (full || started))} onClick={() => j.onJoin(pool, real ? wallet : null)}>
        {j.busy ? 'PLEASE WAIT…' : full && !mine ? 'POOL FULL' : started && !mine ? 'ALREADY STARTED' : action}
      </button>
      {j.error && <div className="pg-err">{j.error}</div>}
      {!mine && <div className="pg-sub">Free to join · you can leave before the game starts</div>}
    </>
  );
}

/* ---------------- HISTORY + PAY ---------------- */
function PayWinners({ item, onBack, onMarkPaid, busyRank, mobile }) {
  const winners = item.winners || [];
  const total = winners.reduce((a, w) => a + (w.amountNear || 0), 0);
  const paid = winners.filter((w) => w.paidAt).reduce((a, w) => a + (w.amountNear || 0), 0);
  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) { /* no clipboard */ } };
  const csv = () => copy(['rank,name,wallet,points,amount_near,paid', ...winners.map((w) => `${w.rank},${w.name},${w.wallet || ''},${w.points},${w.amountNear},${w.paidAt ? 'yes' : 'no'}`)].join('\n'));
  return (
    <>
      <button type="button" className="pg-gear" style={{ marginBottom: 14 }} onClick={onBack}><Ico d={P.back} s={14} c="#9fb0a8" />HISTORY</button>
      <h2 style={{ margin: '0 0 4px', font: '700 22px var(--disp)' }}>Pay winners · {item.name}</h2>
      <p style={{ margin: '0 0 16px', font: '12px var(--mono)', color: 'var(--dim)' }}>{item.state === 'Finished' ? 'Finished' : item.state} · {item.maxMatches} matches · {item.players} players</p>
      <div className="pg-stat">
        <div><b style={{ color: 'var(--g)' }}>{fmt(total)} NEAR</b><span>TOTAL TO PAY</span></div>
        <div><b style={{ color: 'var(--m)' }}>{fmt(paid)} NEAR</b><span>PAID</span></div>
        <div><b>{fmt(total - paid)} NEAR</b><span>LEFT</span></div>
        <div><b>{winners.filter((w) => w.paidAt).length} / {winners.length}</b><span>WINNERS PAID</span></div>
      </div>
      <div className="pg-info" style={{ marginBottom: 16 }}><Ico d={P.info} s={18} /><div>Send each amount from your own NEAR wallet, then press <b>Mark as paid</b>. The winner gets an Inbox message.</div></div>
      {winners.length === 0 ? <div className="pg-empty">No one scored in this pool, so there's no one to pay.</div> : mobile ? winners.map((w) => (
        <div className="pg-wr" key={w.rank}>
          <span className="rk">{rk(w.rank - 1)}</span>
          <div style={{ minWidth: 0 }}><b>{w.name} · <span style={{ display: 'inline', color: 'var(--g)', font: '600 14px var(--disp)' }}>{fmt(w.amountNear)} NEAR</span></b><span>{w.wallet || 'no wallet given'} · {w.points} pts</span></div>
          {w.paidAt ? <span className="pg-paid" style={{ font: '600 11px var(--mono)' }}>✓ PAID</span> : <span style={{ display: 'flex', gap: 6 }}>{w.wallet && <button type="button" className="pg-gear" onClick={() => copy(w.wallet)}>COPY</button>}<button type="button" className="pg-gear hi" disabled={busyRank === w.rank} onClick={() => onMarkPaid(item.id, w.rank)}>PAID</button></span>}
        </div>
      )) : (
        <table>
          <thead><tr><th>Rank</th><th>Player</th><th>Wallet</th><th className="n">Points</th><th className="n">Send</th><th>Status</th><th /></tr></thead>
          <tbody>
            {winners.map((w) => (
              <tr key={w.rank}>
                <td>{rk(w.rank - 1)}</td>
                <td style={{ fontFamily: 'var(--disp)', fontSize: 14 }}>{w.name}</td>
                <td style={{ color: 'var(--c)' }}>{w.wallet || <span style={{ color: '#ffb84d' }}>not given</span>} {w.wallet && <button type="button" className="pg-gear" style={{ marginLeft: 6, padding: '3px 8px' }} onClick={() => copy(w.wallet)}>COPY</button>}</td>
                <td className="n">{w.points}</td>
                <td className="n" style={{ color: 'var(--g)', fontWeight: 600 }}>{fmt(w.amountNear)} NEAR</td>
                <td>{w.paidAt ? <span className="pg-paid">✓ PAID</span> : <span className="pg-due">TO PAY</span>}</td>
                <td>{!w.paidAt && <button type="button" className="pg-gear hi" disabled={busyRank === w.rank} onClick={() => onMarkPaid(item.id, w.rank)}>{busyRank === w.rank ? '…' : 'MARK AS PAID'}</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {winners.length > 0 && <div style={{ marginTop: 16, maxWidth: 260 }}><button type="button" className="pg-gear" onClick={csv}>COPY ALL (CSV)</button></div>}
    </>
  );
}

function History({ h, mobile }) {
  const [tab, setTab] = useState('hosted');
  const [payId, setPayId] = useState(null);
  const [busyRank, setBusyRank] = useState(null);
  useEffect(() => { h.load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const data = h.data;
  if (payId && data) {
    const item = (data.hosted || []).find((x) => x.id === payId);
    if (item) return <PayWinners item={item} mobile={mobile} busyRank={busyRank} onBack={() => setPayId(null)} onMarkPaid={async (id, rank) => { setBusyRank(rank); await h.markPaid(id, rank); setBusyRank(null); }} />;
  }
  const hosted = data?.hosted || [], joined = data?.joined || [];
  const given = hosted.reduce((a, x) => a + (x.prizeNear || 0), 0);
  const won = joined.reduce((a, x) => a + (x.myPrize || 0), 0);
  const stateTag = (x) => {
    if (x.kind === 'manual' && x.state === 'Finished') {
      const all = (x.winners || []).length;
      return x.paidCount >= all ? <span className="pg-paid">All paid</span> : <span className="pg-due">{x.paidCount}/{all} paid</span>;
    }
    const st = String(x.state || '');
    return <span className={`pg-tag ${/Open|Live|Locked/.test(st) ? 't-open' : st === 'Distributed' ? 't-done' : 't-done'}`}>{st === 'Distributed' ? 'AUTO-PAID' : st.toUpperCase()}</span>;
  };
  return (
    <>
      <div className="pg-stat">
        <div><b>{hosted.length}</b><span>POOLS HOSTED</span></div>
        <div><b style={{ color: 'var(--g)' }}>{fmt(given)}</b><span>NEAR PUT UP</span></div>
        <div><b>{joined.length}</b><span>POOLS JOINED</span></div>
        <div><b style={{ color: 'var(--m)' }}>{fmt(won)}</b><span>NEAR WON</span></div>
      </div>
      <div className="pg-tabs" style={{ display: 'inline-flex', marginBottom: 14 }}>
        <button type="button" className={tab === 'hosted' ? 'on' : ''} onClick={() => setTab('hosted')}>HOSTED · {hosted.length}</button>
        <button type="button" className={tab === 'joined' ? 'on' : ''} onClick={() => setTab('joined')}>JOINED · {joined.length}</button>
      </div>
      {h.loading && !data && <div className="pg-empty">Loading…</div>}
      {h.error && !data && <div className="pg-empty" style={{ color: '#ff8a8a' }}>{h.error}</div>}
      {data && (tab === 'hosted' ? hosted : joined).length === 0 && <div className="pg-empty">{tab === 'hosted' ? "You haven't hosted a pool yet." : "You haven't joined a pool yet."}</div>}
      {(tab === 'hosted' ? hosted : joined).map((x) => (
        <button type="button" key={x.id} className={`pg-pl ${x.kind === 'manual' ? 'real' : ''}`} onClick={() => { if (tab === 'hosted' && x.kind === 'manual' && x.state === 'Finished') setPayId(x.id); }}>
          <span className="ic">N</span>
          <div style={{ minWidth: 0 }}>
            <b><em>{x.name}</em><span className={`pg-tag ${x.kind === 'manual' ? 't-real' : 't-test'}`}>{x.kind === 'manual' ? 'REAL' : 'TESTNET'}</span></b>
            <span className="s">{new Date(x.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {fmt(x.prizeNear || 0)} {x.kind === 'manual' ? 'NEAR' : 'tNEAR'} · {x.players} players{tab === 'joined' && x.myRank ? ` · you placed #${x.myRank}` : ''}</span>
          </div>
          <div className="v">
            {tab === 'joined' && x.myPrize ? <b style={{ color: 'var(--m)' }}>+{fmt(x.myPrize)}</b> : null}
            <div style={{ font: '600 11px var(--mono)' }}>{tab === 'joined' && x.myPrize != null ? (x.myPaid ? <span className="pg-paid">Paid</span> : <span className="pg-due">Waiting for host</span>) : stateTag(x)}</div>
            {tab === 'hosted' && x.kind === 'manual' && x.state === 'Finished' && <div style={{ font: '600 10px var(--mono)', color: 'var(--c)', marginTop: 4 }}>PAY WINNERS ›</div>}
          </div>
        </button>
      ))}
    </>
  );
}

/* ---------------- MAIN ---------------- */
export function PoolGamesScreen({ mobile, onClose, tab, setTab, create, live, history }) {
  const [c, setCRaw] = useState({ name: '', fund: 'test', amount: '5', split: [50, 30, 20], preset: 'top3', matches: 3, access: 'public', role: 'play', wallet: live.savedWallet || '', balance: create.balance });
  const setC = (u) => setCRaw((x) => ({ ...x, ...u }));
  useEffect(() => { setC({ balance: create.balance }); }, [create.balance]); // eslint-disable-line react-hooks/exhaustive-deps
  const sum = c.split.reduce((a, b) => a + (Number(b) || 0), 0);
  const amount = Number(c.amount) || 0;
  const real = c.fund === 'real';
  const createOk = amount > 0 && (!real || sum === 100) && (!real || c.role !== 'play' || !c.wallet || isNearMainnetAddress(c.wallet));
  const submit = () => create.onCreate({ fund: c.fund, name: c.name.trim(), amount, split: real ? c.split : [50, 30, 20], matches: c.matches, access: c.access, role: c.role, wallet: c.wallet });
  const preview = { poolName: c.name || 'Untitled pool', payout: real ? 'manual' : 'auto', prizeNear: amount, split: real ? c.split.filter((x) => x > 0) : [50, 30, 20], maxMatches: c.matches, seats: c.role === 'play' ? 1 : 0, hostRole: c.role };
  const all = useMemo(() => [...(live.mine || []).map((p) => ({ ...p, mine: true })), ...(live.open || [])], [live.mine, live.open]);
  const [selCode, setSelCode] = useState(null);
  useEffect(() => { if (live.focusCode) { setSelCode(live.focusCode); setTab('live'); } }, [live.focusCode]); // eslint-disable-line react-hooks/exhaustive-deps
  const sel = all.find((p) => (p.roomCode || p.onChainPoolId) === selCode) || live.focusPool || (!mobile ? all[0] : null);
  const [mOpen, setMOpen] = useState(false);
  const tabs = (
    <div className="pg-tabs">
      {[['create', 'CREATE'], ['live', mobile ? 'LIVE' : 'LIVE POOLS'], ['history', mobile ? 'HISTORY' : 'MY HISTORY']].map(([k, l]) => <button type="button" key={k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setMOpen(false); }}>{l}</button>)}
    </div>
  );
  const poolRow = (p) => {
    const key = p.roomCode || p.onChainPoolId;
    const real = p.payout === 'manual';
    return (
      <button type="button" key={key} className={`pg-pl ${real ? 'real' : ''} ${!mobile && sel && (sel.roomCode || sel.onChainPoolId) === key ? 'on' : ''}`} onClick={() => { setSelCode(key); if (mobile) setMOpen(true); }}>
        <span className="ic">N</span>
        <div style={{ minWidth: 0 }}>
          <b><em>{p.poolName || 'Pool game'}</em><span className={`pg-tag ${real ? 't-real' : 't-test'}`}>{real ? 'REAL NEAR' : 'TESTNET'}</span>{!p.isPublic && <span className="pg-tag t-priv">PRIVATE</span>}</b>
          <span className="s"><span className="pg-seats">{Array.from({ length: 10 }, (_, k) => <i key={k} className={k < (p.seats || 0) ? 'f' : ''} />)}</span>{p.seats || 0}/10 · {p.maxMatches} matches{p.poolHostUsername ? ` · by @${p.poolHostUsername}` : ''}</span>
        </div>
        <div className="v"><b>{fmt(Number(p.prizeNear || 0))}</b><span className={`pg-tag ${p.mine ? 't-priv' : p.state === 'Open' ? 't-open' : 't-live'}`}>{p.mine ? (p.isHost ? 'YOURS' : 'JOINED') : p.state === 'Open' ? 'OPEN' : 'IN GAME'}</span></div>
      </button>
    );
  };
  const liveList = (
    <>
      <div className="pg-fld" style={{ display: 'flex', gap: 8 }}>
        <input className="pg-in mono" placeholder="Paste invite link or room code" value={live.code} onChange={(e) => live.setCode(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') live.onFindCode(); }} />
        <button type="button" className="pg-gear hi" onClick={live.onFindCode}>FIND</button>
      </div>
      {live.findError && <div className="pg-err" style={{ textAlign: 'left', marginTop: -10, marginBottom: 12 }}>{live.findError}</div>}
      <div className="pg-sec">LIVE POOLS · {all.length} <button type="button" style={{ marginLeft: 'auto' }} aria-label="Refresh" onClick={live.onRefresh}><Ico d={P.refresh} s={15} c="#7d8d86" /></button></div>
      {live.loading && all.length === 0 && <div className="pg-empty">Checking for live pools…</div>}
      {!live.loading && all.length === 0 && <div className="pg-empty">No live pools right now — create one and share the link.</div>}
      {all.map(poolRow)}
    </>
  );
  const createPreviewCol = (
    <>
      <div className="pg-sec">PREVIEW · WHAT PLAYERS SEE BEFORE JOINING</div>
      <PoolCard pool={preview} me={create.myName} />
      <div className="pg-info" style={{ marginTop: 14 }}><Ico d={P.info} s={18} /><div>After you create it you get an invite link like <b>{create.linkExample}</b> to share on Telegram, X or anywhere.</div></div>
    </>
  );
  const createBtn = (
    <>
      <button type="button" className={`pg-big ${real ? 'gold' : ''}`} disabled={!createOk || create.busy} onClick={submit}>{create.busy ? 'CREATING…' : real ? 'CREATE POOL' : `FUND ${fmt(amount)} tNEAR & CREATE`}</button>
      {create.error ? <div className="pg-err">{create.error}</div> : <div className="pg-sub">{real ? 'Nothing is charged now — you pay the winners after the game.' : `${fmt(amount)} test NEAR moves into the pool contract.`}</div>}
    </>
  );

  if (mobile) {
    let body, foot = null, title = 'POOL GAMES', sub = 'Prize pools for your crew', back = onClose;
    if (tab === 'create') { body = <><CreateForm c={c} setC={setC} mobile />{createPreviewCol}</>; foot = createBtn; }
    else if (tab === 'live' && mOpen && sel) { body = <JoinPanel pool={sel} j={live} mobile />; title = 'JOIN POOL'; sub = ''; back = () => setMOpen(false); }
    else if (tab === 'live') body = liveList;
    else body = <History h={history} mobile />;
    return (
      <div className="pg pg-m" style={{ position: 'absolute', inset: 0 }}>
        <style>{CSS}</style>
        <div className="pg-mh"><button type="button" className="bk" onClick={back} aria-label="Back"><Ico d={P.back} c="#cfe" s={18} /></button><div><h1>{title}</h1>{sub && <p>{sub}</p>}</div></div>
        {!(tab === 'live' && mOpen) && tabs}
        <div className="pg-mb">{body}</div>
        {foot && <div className="pg-mst">{foot}</div>}
      </div>
    );
  }
  return (
    <div className="pg">
      <style>{CSS}</style>
      <div className="pg-hd"><div><h1>POOL GAMES</h1><p>{tab === 'create' ? 'Host a prize pool for your crew or community' : tab === 'live' ? 'Prize pools hosted by players and communities' : 'Everything you hosted and joined'}</p></div><div className="r">{tabs}</div></div>
      {tab === 'create' && (
        <div className="pg-body" style={{ gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)' }}>
          <div className="pg-col"><CreateForm c={c} setC={setC} /></div>
          <div className="pg-col">{createPreviewCol}<div style={{ marginTop: 16 }}>{createBtn}</div></div>
        </div>
      )}
      {tab === 'live' && (
        <div className="pg-body" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)' }}>
          <div className="pg-col">{liveList}</div>
          <div className="pg-col">{sel ? <JoinPanel pool={sel} j={live} /> : <div className="pg-empty" style={{ marginTop: 40 }}>Pick a pool to see the prize and join.</div>}</div>
        </div>
      )}
      {tab === 'history' && <div className="pg-body" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}><div className="pg-col"><History h={history} /></div></div>}
    </div>
  );
}

/* ---------------- LOBBY: pool panel (invite link, split, wallets) ---------------- */
const LCSS = `
.lp-btn{position:fixed;top:calc(58px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:70;display:flex;align-items:center;gap:9px;padding:8px 16px 8px 9px;border:1px solid rgba(255,215,94,.55);background:rgba(10,8,3,.92);color:#ffd75e;font:700 12px 'IBM Plex Mono',monospace;letter-spacing:.1em;cursor:pointer;clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);box-shadow:0 4px 18px rgba(0,0,0,.5)}
.lp-btn i{width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe9a0,#e0a52a 60%,#8a5a10);display:flex;align-items:center;justify-content:center;font:800 11px 'Space Grotesk',sans-serif;font-style:normal;color:#5a3a05}
.lp-btn em{font-style:normal;color:#cfd8d3;font-weight:500}
.lp-chip{position:fixed;top:calc(58px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:70;padding:7px 14px;border:1px solid rgba(255,215,94,.55);background:rgba(10,8,3,.92);color:#ffd75e;font:700 11px 'IBM Plex Mono',monospace;letter-spacing:.14em;white-space:nowrap;pointer-events:none;clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px)}
.lp-back{position:fixed;inset:0;z-index:600;background:rgba(0,0,0,.6);display:flex;justify-content:flex-end}
.lp{width:min(440px,100%);height:100%;overflow:auto;background:linear-gradient(180deg,#0b1210,#060a09);border-left:1px solid rgba(255,215,94,.3);padding:calc(18px + env(safe-area-inset-top,0px)) 20px calc(24px + env(safe-area-inset-bottom,0px));animation:lpIn .22s ease-out}
@keyframes lpIn{from{transform:translateX(30px);opacity:0}to{transform:none;opacity:1}}
.lp-link{display:flex;border:1px solid rgba(143,227,255,.4);background:rgba(0,0,0,.4)}
.lp-link span{flex:1;min-width:0;padding:12px;font:600 12.5px var(--mono);color:var(--c);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lp-link button{padding:0 14px !important;border-left:1px solid rgba(143,227,255,.3) !important;font:700 11px var(--mono) !important;letter-spacing:.1em;color:var(--c) !important}
.lp-share{display:flex;gap:8px;margin-top:8px}.lp-share a,.lp-share button{flex:1;text-align:center;padding:9px !important;border:1px solid var(--line) !important;border-radius:5px;font:600 11px var(--mono) !important;letter-spacing:.08em;color:#cfd8d3 !important;text-decoration:none}
`;
export function LobbyPoolPanel({ pool, isPoolHost, code, link, myWallet, onSaveWallet, fetchWallets, iAmSpectator, open, onClose }) {
  const setOpen = (v) => { if (!v) onClose(); };
  const [list, setList] = useState(null);
  const [w, setW] = useState(myWallet || '');
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState('');
  const real = pool.mode === 'manual';
  const amt = Number(real ? pool.prizeNear : pool.entryFeeNear) || 0;
  const split = real ? (pool.split || []) : [50, 30, 20];
  const canShare = isPoolHost || pool.isPublicRoom;
  useEffect(() => { if (open && isPoolHost && real) fetchWallets().then(setList).catch(() => {}); }, [open, isPoolHost, real, pool]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setW(myWallet || ''); }, [myWallet]);
  const copy = (t, k) => { try { navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(''), 1500); } catch (e) { /* no clipboard */ } };
  const text = `Join my ${fmt(amt)} ${real ? 'NEAR' : 'test NEAR'} pool on NEAR Saboteur — ${pool.maxMatches} matches, top ${split.length} win.`;
  return (
    <div className="pg">
      <style>{CSS + LCSS}</style>
      {iAmSpectator && (
        <div className="lp-chip">{pool.hostRole === 'host' ? 'HOSTING ONLY · NOT PLAYING' : 'HOSTING & WATCHING · NOT PLAYING'}</div>
      )}
      {open && (
        <div className="lp-back" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="lp">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><span className={`pg-tag ${real ? 't-real' : 't-test'}`}>{real ? 'REAL NEAR · HOST PAYS' : 'TESTNET · AUTO PAYOUT'}</span>{!pool.isPublicRoom && <span className="pg-tag t-priv">PRIVATE</span>}</div>
                <h2 style={{ margin: '8px 0 0', font: '700 21px var(--disp)' }}>{pool.poolName || 'Pool game'}</h2>
              </div>
              <button type="button" style={{ marginLeft: 'auto', width: 34, height: 34, border: '1px solid var(--line)', borderRadius: 8, color: '#cfd8d3' }} onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>
            <div className="pg-sec">INVITE LINK</div>
            {canShare ? (
              <div className="pg-fld">
                <div className="lp-link"><span>{link.replace(/^https?:\/\//, '')}</span><button type="button" onClick={() => copy(link, 'l')}>{copied === 'l' ? 'COPIED' : 'COPY'}</button></div>
                <div className="lp-share">
                  <a href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">TELEGRAM</a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`} target="_blank" rel="noreferrer">X</a>
                  <button type="button" onClick={() => copy(code, 'c')}>{copied === 'c' ? 'COPIED' : `CODE ${code}`}</button>
                </div>
                {!pool.isPublicRoom && <p style={{ font: '11px var(--mono)', color: 'var(--dim)', margin: '8px 0 0' }}>Private pool · only you have this link · you approve each player</p>}
              </div>
            ) : <div className="pg-fld pg-info"><Ico d={P.lock} s={18} /><div>Private pool — only the host can invite players.</div></div>}

            <div className="pg-sec">PRIZE · {fmt(amt)} {real ? 'NEAR' : 'TEST NEAR'}</div>
            <div className="pg-fld">
              {split.map((p, i) => <div className="pg-pz" key={i}><span className="rk">{rk(i)}</span><span className="bar"><i style={{ width: `${p}%` }} /></span><span className="v">{fmt((real ? amt : amt * 0.95) * p / 100)} {real ? 'NEAR' : 'tNEAR'}</span></div>)}
              <p style={{ font: '11px var(--mono)', color: 'var(--dim)', margin: '6px 0 0' }}>Ranked by total points over {pool.maxMatches} match{pool.maxMatches > 1 ? 'es' : ''}.{real ? ' Paid by the host after the last match.' : ' Paid automatically by the contract.'}</p>
            </div>

            {real && !iAmSpectator && (
              <>
                <div className="pg-sec">YOUR PRIZE WALLET</div>
                <div className="pg-fld">
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="pg-in mono" value={w} placeholder="yourname.near / yourname.tg" onChange={(e) => setW(e.target.value.trim().toLowerCase())} />
                    <button type="button" className="pg-gear hi" disabled={!isNearMainnetAddress(w) || w === myWallet} onClick={async () => { setMsg(''); try { await onSaveWallet(w); setMsg('Saved'); } catch (e) { setMsg(e.message || 'Could not save'); } }}>SAVE</button>
                  </div>
                  {msg && <p style={{ font: '11px var(--mono)', margin: '6px 0 0', color: msg === 'Saved' ? 'var(--m)' : '#ff8a8a' }}>{msg}</p>}
                  <p style={{ font: '11px var(--mono)', color: 'var(--dim)', margin: '6px 0 0' }}>Only the host sees this address.</p>
                </div>
              </>
            )}

            {isPoolHost && real && (
              <>
                <div className="pg-sec">PLAYERS & WALLETS · {list ? list.length : '…'} {list && list.length > 0 && <button type="button" className="pg-gear" style={{ marginLeft: 'auto' }} onClick={() => copy(list.map((x) => `${x.name}\t${x.wallet || ''}`).join('\n'), 'a')}>{copied === 'a' ? 'COPIED' : 'COPY ALL'}</button>}</div>
                {(list || []).map((x) => (
                  <div className="pg-wr" key={x.accountId} style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                    <div style={{ minWidth: 0 }}><b>{x.name}</b><span>{x.wallet || 'no wallet yet'}</span></div>
                    {x.wallet && <button type="button" className="pg-gear" onClick={() => copy(x.wallet, x.accountId)}>{copied === x.accountId ? '✓' : 'COPY'}</button>}
                  </div>
                ))}
                {list && list.length === 0 && <div className="pg-empty">No players yet — share the link.</div>}
              </>
            )}
            <div className="pg-info" style={{ marginTop: 16 }}><Ico d={P.info} s={18} /><div>Host is <b>{pool.hostRole === 'watch' ? 'watching' : pool.hostRole === 'host' ? 'hosting only' : 'playing'}</b> this pool.{pool.hostRole !== 'play' ? ' Any player can start the match.' : ''}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

// [MATCH MOMENTS] The big full-screen beats of a match: your role, the
// meeting verdict, the ejection reveal and the end-of-match Saboteur reveal.
// One component per moment, each with a wide (PC / laptop) and a stacked
// (phone) layout - matches mockups/endgame-mockup.html.
// Avatars and names arrive already resolved (src + node) so this file
// doesn't depend on game.jsx.
import React from 'react';

const RED = '#ff3b4e', CREW = '#6ec8ff', MINT = '#6effc0';
const MONO = "'IBM Plex Mono', monospace", DISP = "'Space Grotesk', sans-serif";

export const MOMENT_CSS = `
  @keyframes mmPop { from { transform: scale(.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes mmRise { from { transform: translateY(16px); opacity: 0; } to { transform: none; opacity: 1; } }
  @keyframes mmSweep { from { transform: translateX(-60%) skewX(-18deg); } to { transform: translateX(420%) skewX(-18deg); } }
  @keyframes mmDrift { 0% { transform: translate(-20vw, 0) rotate(0deg); } 100% { transform: translate(120vw, -6vh) rotate(540deg); } }
  @keyframes mmStamp { 0% { transform: translateX(-50%) scale(2.2) rotate(-14deg); opacity: 0; } 60% { transform: translateX(-50%) scale(.94) rotate(-8deg); opacity: 1; } 100% { transform: translateX(-50%) scale(1) rotate(-8deg); opacity: 1; } }
  .mm-a1 { animation: mmRise .5s .1s both; } .mm-a2 { animation: mmRise .5s .25s both; }
  .mm-a3 { animation: mmRise .5s .4s both; } .mm-a4 { animation: mmRise .5s .55s both; }
`;

const kicker = (color) => ({ font: `600 ${11}px ${MONO}`, letterSpacing: 4, textTransform: 'uppercase', color });
const chip = (color, border) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, font: `600 11px ${MONO}`, letterSpacing: 1, padding: '6px 11px', color, border: `1px solid ${border}`, background: 'rgba(8,12,10,0.8)' });
const STARS = 'radial-gradient(1px 1px at 12% 22%, #fff9, transparent), radial-gradient(1px 1px at 33% 64%, #fff7, transparent), radial-gradient(1.5px 1.5px at 58% 18%, #fff8, transparent), radial-gradient(1px 1px at 76% 74%, #fff6, transparent), radial-gradient(1px 1px at 90% 34%, #fff8, transparent), radial-gradient(1px 1px at 46% 88%, #fff5, transparent), radial-gradient(1px 1px at 22% 46%, #fff6, transparent), radial-gradient(1px 1px at 67% 50%, #fff4, transparent)';
const full = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: DISP, color: '#e6ece9' };

// ---- Your role (start of match) ------------------------------------------
export function RoleRevealMoment({ wide, role, avatarSrc, saboteurCount, mates, hostRole }) {
  const sab = role === 'saboteur';
  const spectator = role === 'spectator';
  const c = sab ? RED : spectator ? '#ffd75e' : CREW;
  const glow = sab ? '#3a0a12' : spectator ? '#2a2208' : '#0e2a3a';
  const title = sab ? 'SABOTEUR' : spectator ? (hostRole === 'host' ? 'HOSTING' : 'WATCHING') : 'CREWMATE';
  const goals = sab
    ? ['Eliminate crewmates without being seen.', 'Sabotage and use vents to escape. Blend in at meetings.']
    : spectator
      ? ["You're hosting this pool — move around freely and see every player.", "You don't play or score."]
      : ['Finish your missions around the ship.', 'Report bodies and vote the Saboteur out in meetings.'];
  const artSize = wide ? 'min(420px, 58vh)' : 'min(250px, 34vh)';
  return (
    <div style={{ ...full, background: `radial-gradient(ellipse at ${wide ? '30% 50%' : '50% 28%'}, ${glow} 0%, #050607 62%)` }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(115deg, transparent 0 46px, rgba(255,255,255,.018) 46px 48px)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, width: '30%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent)', animation: 'mmSweep 2.6s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', display: 'flex', flexDirection: wide ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: wide ? '6vw' : 22, inset: 0, padding: wide ? '0 6vw' : '0 26px' }}>
        <div style={{ position: 'relative', width: artSize, height: artSize, flexShrink: 0, display: 'grid', placeItems: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${c}`, opacity: 0.35, boxShadow: `0 0 60px ${c}, inset 0 0 40px ${c}` }} />
          <img src={avatarSrc} alt="" style={{ width: '60%', height: 'auto', filter: `drop-shadow(0 0 40px ${c})`, animation: 'mmPop .5s both' }} />
        </div>
        <div style={{ maxWidth: wide ? 560 : '100%', width: wide ? 'auto' : '100%' }}>
          <div className="mm-a1" style={kicker(c)}>{spectator ? 'This pool' : 'Your role this match'}</div>
          <h1 className="mm-a2" style={{ margin: '6px 0 0', font: `700 ${wide ? 'clamp(56px, min(7vw, 12vh), 104px)' : 'clamp(38px, 12vw, 52px)'} ${DISP}`, letterSpacing: wide ? 6 : 4, color: c, textShadow: `0 0 40px ${c}`, lineHeight: 0.95 }}>{title}</h1>
          <div className="mm-a3" style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: wide ? '24px 0 20px' : '18px 0 16px' }}>
            {goals.map((g, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', font: `500 ${wide ? 16 : 14}px/1.45 ${DISP}`, color: '#c9d3ce' }}>
                <i style={{ flex: '0 0 22px', height: 22, display: 'grid', placeItems: 'center', font: `700 11px ${MONO}`, fontStyle: 'normal', color: '#04120b', background: c }}>{i + 1}</i>{g}
              </div>
            ))}
          </div>
          {role === 'crewmate' && saboteurCount > 0 && (
            <div className="mm-a4" style={chip('#ff9aa6', 'rgba(255,59,78,.4)')}>{saboteurCount} SABOTEUR{saboteurCount > 1 ? 'S ARE' : ' IS'} HIDING AMONG YOU</div>
          )}
          {sab && mates && mates.length > 0 && (
            <div className="mm-a4">
              <div style={{ ...kicker('#ff9aa6'), fontSize: 10, letterSpacing: 3, marginBottom: 8 }}>Your partner{mates.length > 1 ? 's' : ''}</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {mates.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 6px', border: '1px solid rgba(255,59,78,.45)', background: 'rgba(255,59,78,.08)', font: `600 13px ${DISP}` }}>
                    <img src={m.avatarSrc} alt="" style={{ width: 30, height: 'auto' }} />{m.nameNode}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Meeting verdict + who voted for whom --------------------------------
// rows: [{ key, avatarSrc|null (skip), nameNode, count, voters: [src] }] sorted, biggest first
export function VoteResultMoment({ wide, out, rows, totalVotes }) {
  const maxN = Math.max(1, ...rows.map((r) => r.count));
  const accent = out ? RED : MINT;
  const verdict = (
    <div style={{ textAlign: 'center', width: wide ? 'min(520px, 42vw)' : '100%' }}>
      <div className="mm-a1" style={kicker(accent)}>Meeting result</div>
      {out ? (
        <div style={{ position: 'relative', display: 'inline-block', marginTop: 14 }}>
          <img src={out.avatarSrc} alt="" style={{ width: wide ? 'min(220px, 30vh)' : 'min(140px, 20vh)', height: 'auto', filter: 'grayscale(.2) drop-shadow(0 0 30px rgba(255,59,78,.5))', animation: 'mmPop .5s both' }} />
          <div style={{ position: 'absolute', left: '50%', bottom: '6%', font: `700 ${wide ? 22 : 18}px ${DISP}`, letterSpacing: 5, color: RED, border: `3px solid ${RED}`, padding: '4px 14px', background: 'rgba(5,5,6,.8)', whiteSpace: 'nowrap', animation: 'mmStamp .5s .3s both' }}>EJECTED</div>
        </div>
      ) : (
        <div className="mm-a1" style={{ margin: '20px auto 0', width: wide ? 150 : 110, height: wide ? 150 : 110, border: '2px dashed #2f3c37', display: 'grid', placeItems: 'center', font: `700 44px ${DISP}`, color: '#3c4a44' }}>—</div>
      )}
      <h2 className="mm-a2" style={{ margin: '14px 0 4px', font: `700 ${wide ? 34 : 26}px ${DISP}` }}>{out ? <>{out.nameNode} is out</> : 'Nobody was ejected'}</h2>
      <div className="mm-a3" style={{ font: `13px ${MONO}`, color: '#7d8d86' }}>
        {out ? `${out.count} of ${totalVotes} vote${totalVotes === 1 ? '' : 's'} · the group voted them off the ship` : 'Votes were tied or most people skipped'}
      </div>
    </div>
  );
  const tally = rows.length > 0 && (
    <div style={{ width: wide ? 'min(520px, 42vw)' : '100%' }}>
      <div className="mm-a1" style={{ ...kicker('#7d8d86'), marginBottom: 10 }}>Who voted for whom</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: wide ? '60vh' : '34vh', overflowY: 'auto' }}>
        {rows.map((r, i) => {
          const top = out && i === 0 && r.key !== 'skip';
          return (
            <div key={r.key} className={i < 3 ? `mm-a${i + 2}` : undefined} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 10, alignItems: 'center', padding: wide ? '9px 12px' : '8px 10px', border: `1px solid ${top ? 'rgba(255,59,78,.55)' : '#1f2925'}`, background: top ? 'rgba(255,59,78,.07)' : 'rgba(255,255,255,.025)' }}>
              {r.avatarSrc
                ? <img src={r.avatarSrc} alt="" style={{ width: 34, height: 'auto' }} />
                : <div style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', font: `700 10px ${MONO}`, color: '#7d8d86', border: '1px dashed #3a4641' }}>SKIP</div>}
              <div style={{ minWidth: 0 }}>
                <div style={{ font: `600 15px ${DISP}`, color: r.key === 'skip' ? '#7d8d86' : '#e6ece9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.nameNode}</div>
                <div style={{ height: 5, background: '#1a2320', marginTop: 6, position: 'relative' }}><span style={{ position: 'absolute', inset: 0, width: `${(r.count / maxN) * 100}%`, background: r.key === 'skip' ? '#7d8d86' : RED }} /></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: wide ? 160 : 110 }}>
                  {r.voters.map((v, k) => <img key={k} src={v.src} alt="" title={v.name} style={{ width: wide ? 22 : 18, height: 'auto' }} />)}
                </div>
                <div style={{ font: `700 20px ${DISP}`, minWidth: 22, textAlign: 'right' }}>{r.count}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <div style={{ ...full, background: `radial-gradient(ellipse at 50% 30%, ${out ? '#1a1012' : '#0f1a16'} 0%, #050506 65%)` }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: STARS }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: wide ? 'row' : 'column', alignItems: 'center', justifyContent: wide ? 'space-evenly' : 'center', gap: wide ? 40 : 26, padding: wide ? '0 5vw' : '24px 20px', overflowY: 'auto' }}>
        {verdict}
        {tally}
      </div>
    </div>
  );
}

// ---- "X was / was not the Saboteur" --------------------------------------
export function EjectRevealMoment({ wide, avatarSrc, nameNode, wasSaboteur, saboteursLeft }) {
  return (
    <div style={{ ...full, background: '#020304' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: STARS }} />
      <div style={{ position: 'absolute', top: wide ? '26%' : '28%', left: 0 }}>
        {avatarSrc && <img src={avatarSrc} alt="" style={{ width: wide ? 'min(120px, 16vh)' : 80, height: 'auto', animation: 'mmDrift 3.5s linear both' }} />}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: wide ? '54%' : '50%', textAlign: 'center', padding: '0 18px' }}>
        <div className="mm-a1" style={{ font: `500 ${wide ? 20 : 16}px ${DISP}`, color: '#c9d3ce' }}>{nameNode} was</div>
        <div className="mm-a2" style={{ font: `700 ${wide ? 'clamp(44px, min(5vw, 9vh), 72px)' : 'clamp(28px, 9vw, 36px)'} ${DISP}`, letterSpacing: 4, marginTop: 6, color: wasSaboteur ? RED : '#fff', textShadow: wasSaboteur ? '0 0 40px rgba(255,59,78,.6)' : '0 2px 6px rgba(0,0,0,.7)' }}>
          {wasSaboteur ? 'THE SABOTEUR' : 'NOT THE SABOTEUR'}
        </div>
        {saboteursLeft != null && (
          <div className="mm-a3" style={{ marginTop: 16 }}>
            {saboteursLeft === 0
              ? <span style={chip(MINT, 'rgba(110,255,192,.4)')}>NO SABOTEURS LEFT</span>
              : <span style={chip('#ff9aa6', 'rgba(255,59,78,.4)')}>{saboteursLeft} SABOTEUR{saboteursLeft > 1 ? 'S' : ''} STILL ON BOARD</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- End of match: who the Saboteur(s) were -------------------------------
// list: [{ avatarSrc, nameNode, kills }]
export function SaboteurRevealMoment({ wide, list }) {
  const many = list.length > 1;
  return (
    <div style={{ ...full, background: 'radial-gradient(ellipse at 50% 0%, #3b0d14 0%, #0a0406 55%, #030203 100%)' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', width: wide ? '70vw' : '110vw', height: '100%', background: 'linear-gradient(180deg, rgba(255,90,110,.28), rgba(255,90,110,0) 80%)', clipPath: 'polygon(38% 0,62% 0,100% 100%,0 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: wide ? '5vh' : 30, padding: '0 16px' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="mm-a1" style={kicker('#ff9aa6')}>Match over · the truth</div>
          <h1 className="mm-a2" style={{ margin: '8px 0 0', font: `700 ${wide ? 'clamp(40px, min(4.4vw, 8vh), 60px)' : 'clamp(28px, 8.6vw, 34px)'} ${DISP}`, letterSpacing: wide ? 5 : 3, color: '#fff', lineHeight: 1.1 }}>
            THE <span style={{ color: RED, textShadow: '0 0 30px rgba(255,59,78,.7)' }}>SABOTEUR{many ? 'S' : ''}</span> {many ? 'WERE' : 'WAS'}
          </h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: wide ? 28 : 12, flexWrap: 'wrap' }}>
          {list.map((s, i) => (
            <div key={i} style={{ boxSizing: 'border-box', width: wide ? 'min(230px, 30vh)' : (many ? 'min(160px, 42vw)' : 190), textAlign: 'center', padding: '18px 12px 14px', border: '1px solid rgba(255,59,78,.5)', background: 'linear-gradient(180deg, rgba(255,59,78,.14), rgba(10,4,6,.9))', animation: `mmPop .5s ${0.2 + i * 0.2}s both` }}>
              <img src={s.avatarSrc} alt="" style={{ width: '70%', height: 'auto', margin: '0 auto', display: 'block', filter: 'drop-shadow(0 0 26px rgba(255,59,78,.75))' }} />
              <div style={{ font: `700 ${wide ? 20 : 16}px ${DISP}`, marginTop: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.nameNode}</div>
              {s.kills != null && <div style={{ font: `12px ${MONO}`, color: '#ff9aa6', marginTop: 6 }}>{s.kills} elimination{s.kills === 1 ? '' : 's'}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

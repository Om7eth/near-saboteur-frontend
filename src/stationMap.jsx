// [MAP v2] Location card (top-left in a match) + floating station map.
// Everything is drawn from the game's real tile grid, passed in as `geo`:
//   { GRID_W, GRID_H, TILE, ROOMS, tileAt, isWalkableTile, roomName }
// Performance (phones lagged): the whole station is painted ONCE into an
// off-screen canvas; the card only re-crops it when you step onto a new tile.
import React, { useEffect, useMemo, useRef, useState } from 'react';

const SCALE = 6; // px per tile in the pre-painted station image
const C = { wall: '#24332e', corridor: '#16211e', door: '#3a6152', floor: '#232d2a', here: '#1f4a3c', mission: '#4a3f1c', target: '#7a6424', done: '#18352b', locked: '#3a2a12' };

function roomAt(geo, x, y) { return geo.ROOMS.find((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) || null; }

// one shared painted station per geo
const baseCache = new WeakMap();
function baseCanvas(geo) {
  let c = baseCache.get(geo);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = geo.GRID_W * SCALE; c.height = geo.GRID_H * SCALE;
  const g = c.getContext('2d');
  for (let y = 0; y < geo.GRID_H; y++) for (let x = 0; x < geo.GRID_W; x++) {
    const ch = geo.tileAt(x, y);
    if (ch === ' ') continue;
    g.fillStyle = ch === '#' ? C.wall : ch === 'c' ? C.corridor : ch === 'D' ? C.door : C.floor;
    g.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
  }
  baseCache.set(geo, c);
  return c;
}

// tile the route should aim for inside a room
function roomGoal(geo, r) {
  const cx = Math.floor(r.x + r.w / 2), cy = Math.floor(r.y + r.h / 2);
  for (let d = 0; d < 8; d++) for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++) {
    const ch = geo.tileAt(cx + dx, cy + dy);
    if (ch === '.' || ch === 'c') return { x: cx + dx, y: cy + dy };
  }
  return { x: cx, y: cy };
}
// shortest walkable path (BFS on tiles); cached per (from, to)
const routeCache = new Map();
function route(geo, from, to) {
  const key = `${from.x},${from.y}>${to.x},${to.y}`;
  if (routeCache.has(key)) return routeCache.get(key);
  const W = geo.GRID_W, prev = new Map([[from.y * W + from.x, -1]]), q = [[from.x, from.y]];
  let end = -1;
  for (let i = 0; i < q.length && i < 14000; i++) {
    const [x, y] = q[i];
    if (x === to.x && y === to.y) { end = y * W + x; break; }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = ny * W + nx;
      if (prev.has(k) || !geo.isWalkableTile(nx, ny)) continue;
      prev.set(k, y * W + x); q.push([nx, ny]);
    }
  }
  const path = [];
  if (end !== -1) { for (let k = end; k !== -1; k = prev.get(k)) path.push({ x: k % W, y: Math.floor(k / W) }); path.reverse(); }
  if (routeCache.size > 400) routeCache.clear();
  routeCache.set(key, path);
  return path;
}

// the mission rooms still to do (rooms that exist on the map), nearest first
export function pendingMissionRooms(geo, missions, tile) {
  const out = [];
  for (const m of missions || []) {
    if (m.done) continue;
    const r = geo.ROOMS.find((rr) => rr.id === m.room);
    if (!r || out.some((o) => o.room.id === r.id)) continue;
    out.push({ room: r, label: m.label, dist: Math.hypot(r.x + r.w / 2 - tile.x, r.y + r.h / 2 - tile.y) });
  }
  return out.sort((a, b) => a.dist - b.dist);
}

// paint mission rooms / current room on top of the base image
function tintRooms(g, geo, { here, missionIds, targetId, doneIds, lockedId }, s, ox = 0, oy = 0) {
  for (const r of geo.ROOMS) {
    let col = null;
    if (r.id === lockedId) col = C.locked;
    else if (r.id === targetId) col = C.target;
    else if (missionIds.has(r.id)) col = C.mission;
    else if (here && r.id === here.id) col = C.here;
    else if (doneIds.has(r.id)) col = C.done;
    if (!col) continue;
    g.fillStyle = col;
    for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) {
      const ch = geo.tileAt(x, y);
      if (ch === '.' || ch === 'T') g.fillRect((x - ox) * s, (y - oy) * s, Math.ceil(s), Math.ceil(s));
    }
  }
}

// The station with rooms already coloured (current room / missions / target),
// rebuilt only when those change - so following the player is just a crop.
let tintCache = { key: '', canvas: null };
function tintedStation(geo, key, opts) {
  if (tintCache.key === key && tintCache.canvas) return tintCache.canvas;
  const base = baseCanvas(geo);
  const c = tintCache.canvas && tintCache.canvas.width === base.width ? tintCache.canvas : document.createElement('canvas');
  c.width = base.width; c.height = base.height;
  const g = c.getContext('2d');
  g.clearRect(0, 0, c.width, c.height); g.drawImage(base, 0, 0);
  tintRooms(g, geo, opts, SCALE);
  tintCache = { key, canvas: c };
  return c;
}

// ---------------- location card ----------------
export function LocationCard({ geo, posPx, missions, targetRoomId, crew, showTasks, lockedVault, desktop, hudK = 1, onOpen }) {
  const ref = useRef(null);
  const tile = { x: Math.floor(posPx.x / geo.TILE), y: Math.floor(posPx.y / geo.TILE) };
  const here = roomAt(geo, tile.x, tile.y);
  const pending = useMemo(() => pendingMissionRooms(geo, missions, tile), [geo, missions, tile.x, tile.y]); // eslint-disable-line react-hooks/exhaustive-deps
  const target = (targetRoomId && pending.find((p) => p.room.id === targetRoomId)) || pending[0] || null;
  const missionKey = pending.map((p) => p.room.id).join(',');
  const layerKey = `${here ? here.id : '-'}|${missionKey}|${target ? target.room.id : ''}|${lockedVault ? 1 : 0}`;
  // [SMOOTH] follow the player's exact position (not whole tiles); a frame is
  // only a crop of the pre-coloured station + the route + your dot.
  const drawKey = `${Math.round(posPx.x * 2)},${Math.round(posPx.y * 2)}|${layerKey}`;
  useEffect(() => {
    const cv = ref.current; if (!cv || cv.dataset.k === drawKey) return; // a re-mounted canvas has no key -> always redrawn
    cv.dataset.k = drawKey;
    const g = cv.getContext('2d'), Wpx = cv.width, Hpx = cv.height;
    const VIEW = 46, s = Wpx / VIEW, viewH = Hpx / s;
    const fx = posPx.x / geo.TILE, fy = posPx.y / geo.TILE;
    const x0 = fx - VIEW / 2, y0 = fy - viewH / 2;
    g.fillStyle = '#050807'; g.fillRect(0, 0, Wpx, Hpx);
    g.imageSmoothingEnabled = false;
    const layer = tintedStation(geo, layerKey, { here, missionIds: new Set(pending.map((p) => p.room.id)), targetId: target && target.room.id, doneIds: new Set(), lockedId: lockedVault ? 'reactor' : null });
    g.drawImage(layer, x0 * SCALE, y0 * SCALE, VIEW * SCALE, viewH * SCALE, 0, 0, Wpx, Hpx);
    if (target) {
      const path = route(geo, tile, roomGoal(geo, target.room));
      g.strokeStyle = '#ffd75e'; g.lineWidth = Math.max(2, s * 0.35); g.setLineDash([s * 0.9, s * 0.6]); g.beginPath();
      path.forEach((p, i) => { const px = (p.x + 0.5 - x0) * s, py = (p.y + 0.5 - y0) * s; if (i) g.lineTo(px, py); else g.moveTo(px, py); });
      g.stroke(); g.setLineDash([]);
      // gold marker on the edge when the mission room is outside the view
      const goal = roomGoal(geo, target.room), dx = goal.x + 0.5 - fx, dy = goal.y + 0.5 - fy;
      if (Math.abs(dx) > VIEW / 2 - 2 || Math.abs(dy) > viewH / 2 - 2) {
        const a = Math.atan2(dy, dx), m = s * 1.6;
        const k = Math.min((Wpx / 2 - m) / Math.abs(Math.cos(a) || 1e-6), (Hpx / 2 - m) / Math.abs(Math.sin(a) || 1e-6));
        g.save(); g.translate(Wpx / 2 + Math.cos(a) * k, Hpx / 2 + Math.sin(a) * k); g.rotate(a);
        g.fillStyle = '#ffd75e'; g.beginPath(); g.moveTo(s * 1.4, 0); g.lineTo(-s, -s * 1.1); g.lineTo(-s, s * 1.1); g.closePath(); g.fill(); g.restore();
      }
    }
    // you, always in the middle
    g.beginPath(); g.arc(Wpx / 2, Hpx / 2, s * 2.2, 0, 7); g.fillStyle = 'rgba(110,255,192,.28)'; g.fill();
    g.beginPath(); g.arc(Wpx / 2, Hpx / 2, s * 1.1, 0, 7); g.fillStyle = '#6effc0'; g.fill(); g.lineWidth = 2; g.strokeStyle = '#04130c'; g.stroke();
  }); // runs every render; the key check above keeps it cheap
  const w = desktop ? 126 : 128; // base size - the HUD zoom (hudK) scales it up on big screens
  return (
    <div onClick={onOpen} role="button" aria-label="Open the station map" style={{
      position: 'absolute', top: 8, left: 8, zIndex: 20, width: w, zoom: hudK, cursor: 'pointer',
      background: 'rgba(5,9,8,0.88)', border: '1px solid rgba(110,255,192,0.32)', borderRadius: 11,
      padding: 5, boxShadow: '0 4px 14px rgba(0,0,0,0.45)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 3px 4px', fontSize: desktop ? 11.5 : 10.5, whiteSpace: 'nowrap', overflow: 'hidden' }}>
        <span style={{ color: '#6effc0', fontSize: 9 }}>◉</span>
        <span style={{ color: '#e6ece9', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>{here ? geo.roomName(here.id) : 'Corridor'}</span>
        {desktop && <span style={{ marginLeft: 'auto', font: '800 8.5px ui-monospace,monospace', background: '#e9efec', color: '#111', borderRadius: 3, padding: '0 4px' }}>M</span>}
      </div>
      <canvas ref={ref} width={w * 2} height={Math.round(w * 2 * 0.58)} style={{ display: 'block', width: '100%', borderRadius: 7, border: '1px solid rgba(255,255,255,0.06)' }} />
      {showTasks && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 3px 1px', font: '700 8px ui-monospace,monospace', letterSpacing: 0.8, color: '#8b9893' }}>
          TASKS
          <span style={{ flex: 1, height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${crew}%`, background: 'linear-gradient(90deg,#6effc0,#2bb88a)', transition: 'width .4s' }} />
          </span>
          <b style={{ color: '#6effc0', fontSize: 10, letterSpacing: 0 }}>{crew}%</b>
        </div>
      )}
    </div>
  );
}

// ---------------- floating station map ----------------
export function StationMapWindow({ geo, posPx, missions, targetRoomId, onTarget, lockedVault, desktop, hudK = 1, onClose }) {
  const ref = useRef(null);
  const winRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const [at, setAt] = useState(null); // dragged position (px), null = centred
  const tile = { x: Math.floor(posPx.x / geo.TILE), y: Math.floor(posPx.y / geo.TILE) };
  const here = roomAt(geo, tile.x, tile.y);
  const pending = useMemo(() => pendingMissionRooms(geo, missions, tile), [geo, missions, tile.x, tile.y]); // eslint-disable-line react-hooks/exhaustive-deps
  const target = (targetRoomId && pending.find((p) => p.room.id === targetRoomId)) || pending[0] || null;
  const list = (missions || []).filter((m) => geo.ROOMS.some((r) => r.id === m.room));
  const wide = typeof window !== 'undefined' && window.innerWidth >= 720;
  const steps = target ? Math.max(0, route(geo, tile, roomGoal(geo, target.room)).length - 1) : 0;
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const g = cv.getContext('2d'), s = cv.width / geo.GRID_W;
    g.fillStyle = '#050807'; g.fillRect(0, 0, cv.width, cv.height);
    g.imageSmoothingEnabled = false;
    g.drawImage(baseCanvas(geo), 0, 0, cv.width, cv.height);
    const doneIds = new Set((missions || []).filter((m) => m.done).map((m) => m.room));
    tintRooms(g, geo, { here, missionIds: new Set(pending.map((p) => p.room.id)), targetId: target && target.room.id, doneIds, lockedId: lockedVault ? 'reactor' : null }, s);
    if (target) {
      const path = route(geo, tile, roomGoal(geo, target.room));
      g.strokeStyle = '#ffd75e'; g.lineWidth = Math.max(2, s * 0.45); g.setLineDash([s * 1.2, s * 0.8]); g.beginPath();
      path.forEach((p, i) => { const px = (p.x + 0.5) * s, py = (p.y + 0.5) * s; if (i) g.lineTo(px, py); else g.moveTo(px, py); });
      g.stroke(); g.setLineDash([]);
    }
    // names inside the rooms
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const pinned = new Set([...pending.map((p) => p.room.id), ...doneIds]);
    for (const r of geo.ROOMS) {
      const name = r.id === 'reactor' && lockedVault ? `🔒 ${geo.roomName(r.id)}` : geo.roomName(r.id);
      const fs = Math.max(9, Math.min((r.w * s) / 6.5, s * 1.7));
      g.font = `700 ${fs}px system-ui,sans-serif`;
      g.fillStyle = pending.some((p) => p.room.id === r.id) ? '#ffe7a0' : here && here.id === r.id ? '#b9ffe0' : 'rgba(220,230,226,.78)';
      const words = name.split(' ');
      const lines = g.measureText(name).width > r.w * s * 0.9 && words.length > 1 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [name];
      const lift = pinned.has(r.id) ? fs * 0.9 : 0;
      lines.forEach((ln, i) => g.fillText(ln, (r.x + r.w / 2) * s, (r.y + r.h / 2) * s + (i - (lines.length - 1) / 2) * fs * 1.1 - lift));
    }
    // numbered pins (✓ when done)
    list.forEach((m, i) => {
      const r = geo.ROOMS.find((rr) => rr.id === m.room); if (!r) return;
      const x = (r.x + r.w / 2) * s, y = (r.y + r.h / 2) * s + s * 2.1;
      g.beginPath(); g.arc(x, y, s * 1.35, 0, 7); g.fillStyle = m.done ? '#6effc0' : '#ffd75e'; g.fill();
      g.fillStyle = '#111'; g.font = `800 ${s * 1.4}px ui-monospace,monospace`; g.fillText(m.done ? '✓' : String(i + 1), x, y + 1);
    });
    // you
    const yx = (posPx.x / geo.TILE) * s, yy = (posPx.y / geo.TILE) * s;
    g.beginPath(); g.arc(yx, yy, s * 2.3, 0, 7); g.fillStyle = 'rgba(110,255,192,.25)'; g.fill();
    g.beginPath(); g.arc(yx, yy, s * 1.1, 0, 7); g.fillStyle = '#6effc0'; g.fill(); g.lineWidth = 2; g.strokeStyle = '#04130c'; g.stroke();
  }, [geo, tile.x, tile.y, missions, target && target.room.id, lockedVault]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDown = (e) => {
    if (!desktop || e.target.closest('button')) return;
    const r = winRef.current.getBoundingClientRect();
    setDrag({ dx: e.clientX - r.left, dy: e.clientY - r.top });
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => { if (drag) setAt({ x: e.clientX - drag.dx, y: e.clientY - drag.dy }); };
  const placed = at ? { left: at.x / hudK, top: at.y / hudK, transform: 'none' } : wide ? { left: '50%', top: '52%', transform: 'translate(-50%,-50%)' } : { left: 8, top: 150 };
  return (
    <div ref={winRef} onClick={(e) => e.stopPropagation()} style={{
      position: 'fixed', zIndex: 60, zoom: hudK, width: wide ? 'min(900px, 86vw)' : 'calc(100vw - 16px)',
      ...placed, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: 'rgba(8,12,11,0.97)', border: '1px solid rgba(110,255,192,0.45)', borderRadius: 14,
      boxShadow: '0 18px 50px rgba(0,0,0,0.65)',
    }}>
      <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => setDrag(null)} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '7px 7px 7px 13px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        cursor: desktop ? 'move' : 'default', userSelect: 'none', touchAction: 'none',
      }}>
        <b style={{ font: '800 12px system-ui', letterSpacing: 1.6, color: '#6effc0' }}>STATION MAP</b>
        <span style={{ fontSize: 11.5, color: '#8b9893', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          You're in <span style={{ color: '#fff' }}>{here ? geo.roomName(here.id) : 'a corridor'}</span>
        </span>
        <button onClick={onClose} aria-label="Close map" style={{
          marginLeft: 'auto', width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 14, cursor: 'pointer', flexShrink: 0,
        }}>✕</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: wide && list.length ? 'minmax(0,1fr) 200px' : '1fr', gap: 10, padding: 10, maxHeight: wide ? undefined : '70vh', overflowY: wide ? undefined : 'auto' }}>
        <canvas ref={ref} width={geo.GRID_W * 10} height={geo.GRID_H * 10} style={{ width: '100%', display: 'block', borderRadius: 8, background: '#050807' }} />
        {list.length > 0 && (
          <div>
            <div style={{ font: '700 9.5px ui-monospace,monospace', letterSpacing: 1.4, color: '#8b9893', margin: '0 0 6px' }}>YOUR MISSIONS · {pending.length} LEFT</div>
            {list.map((m, i) => {
              const on = target && target.room.id === m.room && !m.done;
              return (
                <button key={m.room} type="button" disabled={m.done} onClick={() => onTarget && onTarget(m.room)} style={{
                  display: 'flex', gap: 8, alignItems: 'center', width: '100%', textAlign: 'left', padding: '6px 8px', marginBottom: 5,
                  borderRadius: 9, cursor: m.done ? 'default' : 'pointer', opacity: m.done ? 0.5 : 1,
                  border: `1px solid ${on ? '#ffd75e' : 'rgba(255,255,255,0.08)'}`, background: on ? 'rgba(255,215,94,0.08)' : 'rgba(255,255,255,0.02)', color: '#e6ece9',
                }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 10px ui-monospace,monospace', background: m.done ? '#6effc0' : '#ffd75e', color: '#111' }}>{m.done ? '✓' : i + 1}</span>
                  <span style={{ minWidth: 0 }}>
                    <b style={{ display: 'block', fontSize: 12 }}>{m.label}</b>
                    <small style={{ color: '#8b9893', fontSize: 10.5 }}>{geo.roomName(m.room)}{on ? ` · ${steps} steps` : m.done ? ' · done' : ''}</small>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

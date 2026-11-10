#!/usr/bin/env node
// ============================================================
// Map cleanup: rebuilds every corridor and door in src/game.jsx from a
// clean spec, keeping every ROOM exactly where it is (room walls,
// furniture, mission stations, vents and spawn points are untouched).
//
// Rules of the new layout:
//   - every corridor is 5 tiles wide (110px - room for 4 players abreast)
//   - every door is 3 tiles wide, on the room wall, lined up with the
//     middle of its corridor
//   - same room-to-room connections as the original map (a few duplicate
//     side doors that led into the same junction were dropped)
//
// Usage:  node scripts/rebuild-corridors.js          (dry run + checks)
//         node scripts/rebuild-corridors.js --write  (patch src/game.jsx)
// After --write, re-run near-saboteur-backend/scripts/sync-map-from-frontend.js
// so the bots use the same map.
// ============================================================
const fs = require("fs");
const path = require("path");

const GAME = path.join(__dirname, "..", "src", "game.jsx");
const src = fs.readFileSync(GAME, "utf8");

const num = (name) => Number(new RegExp(`^const ${name}\\s*=\\s*(\\d+)`, "m").exec(src)[1]);
const W = num("GRID_W"), H = num("GRID_H");
const gridMatch = /^const GRID = '([^']*)';$/m.exec(src);
if (!gridMatch || gridMatch[1].length !== W * H) throw new Error("GRID literal not found / wrong size");
const grid = gridMatch[1].split("");
// ROOMS literal -> objects
const roomsText = /^const ROOMS = \[([\s\S]*?)^\];/m.exec(src)[1];
const ROOMS = [...roomsText.matchAll(/id:'(\w+)'.*?x:(\d+), y:(\d+), w:(\d+), h:(\d+)/g)]
  .map(([, id, x, y, w, h]) => ({ id, x: +x, y: +y, w: +w, h: +h }));

const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? " " : grid[y * W + x]);
const set = (x, y, c) => { grid[y * W + x] = c; };
const roomAt = (x, y) => ROOMS.find((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h);

// ---- Spec ----------------------------------------------------------
// Corridors: inclusive tile rectangles.
const CORRIDORS = [
  { name: "Staking Vault - Verification Center", x1: 28, y1: 14, x2: 48, y2: 18 },
  { name: "Verification Center - Assembly Hall", x1: 60, y1: 14, x2: 65, y2: 18 },
  { name: "Assembly Hall - Meme Market", x1: 86, y1: 10, x2: 107, y2: 14 },
  { name: "Assembly/Meme corridor - Legion Hub", x1: 93, y1: 15, x2: 97, y2: 25 },
  { name: "Assembly Hall - Near AI", x1: 70, y1: 20, x2: 74, y2: 43 },
  { name: "Meme Market - Ironclaw Hub", x1: 111, y1: 16, x2: 115, y2: 21 },
  { name: "East hub: Legion / Ironclaw / Cyber Defense", x1: 103, y1: 33, x2: 114, y2: 37 },
  { name: "Legion Hub - Exchange Hub", x1: 97, y1: 40, x2: 101, y2: 55 },
  { name: "Near Merch Store - Exchange Hub", x1: 93, y1: 60, x2: 97, y2: 64 },
  { name: "Near AI (side) - Near Merch Store (top)", x1: 82, y1: 51, x2: 91, y2: 55 },
  { name: "Near AI (bottom) - down", x1: 71, y1: 58, x2: 75, y2: 63 },
  { name: "Near AI (bottom) - Near Merch Store (side)", x1: 76, y1: 59, x2: 83, y2: 63 },
  { name: "Electrical - Near AI", x1: 60, y1: 48, x2: 65, y2: 52 },
  { name: "Claim Vault - Electrical", x1: 28, y1: 47, x2: 48, y2: 51 },
  { name: "Verification Center - Electrical", x1: 52, y1: 22, x2: 56, y2: 43 },
  { name: "Security - Verification/Electrical", x1: 43, y1: 31, x2: 51, y2: 35 },
  // keeps the original link from this junction down to the Claim Vault -
  // Electrical corridor (players could go Security/Verification -> Claim
  // Vault without walking through Electrical)
  { name: "Security junction - Claim/Electrical corridor", x1: 44, y1: 36, x2: 48, y2: 46 },
  { name: "Staking Vault - Claim Vault", x1: 20, y1: 22, x2: 24, y2: 43 },
  { name: "Confidential Vault - Security", x1: 12, y1: 31, x2: 33, y2: 35 },
];
// Doors: room id + wall side + first tile along that wall (3 tiles long).
// side L/R: vertical door at the room's left/right wall, `at` = first row.
// side T/B: horizontal door at the room's top/bottom wall, `at` = first column.
const DOOR_SPEC = [
  ["upper_eng", "R", 15], ["upper_eng", "B", 21],
  ["medbay", "L", 15], ["medbay", "R", 15], ["medbay", "B", 53],
  ["cafeteria", "L", 15], ["cafeteria", "R", 11], ["cafeteria", "B", 71],
  ["weapons", "L", 11], ["weapons", "B", 112],
  ["o2", "T", 112], ["o2", "B", 111],
  ["admin", "T", 94], ["admin", "R", 34], ["admin", "B", 98],
  ["navigation", "T", 112],
  ["shields", "T", 99], ["shields", "L", 61],
  ["comms", "T", 87], ["comms", "L", 60], ["comms", "R", 61],
  ["storage", "T", 71], ["storage", "L", 49], ["storage", "R", 52], ["storage", "B", 72],
  ["electrical", "T", 53], ["electrical", "L", 48], ["electrical", "R", 49],
  ["lower_eng", "T", 21], ["lower_eng", "R", 48],
  ["security", "L", 32], ["security", "R", 32],
  ["reactor", "R", 32],
];
const DOOR_LEN = 3;

// ---- Build ---------------------------------------------------------
const errors = [];
// 1) remove old corridors and doors (doors become wall again)
for (let i = 0; i < grid.length; i++) {
  if (grid[i] === "c") grid[i] = " ";
  else if (grid[i] === "D") grid[i] = "#";
}
// 2) corridors
for (const c of CORRIDORS) {
  for (let y = c.y1; y <= c.y2; y++) for (let x = c.x1; x <= c.x2; x++) {
    const ch = at(x, y);
    if (ch !== " " && ch !== "c") errors.push(`corridor "${c.name}" hits '${ch}' at ${x},${y}`);
    else set(x, y, "c");
  }
}
// 3) doors + gates
const doors = [];
for (const [roomId, side, start] of DOOR_SPEC) {
  const r = ROOMS.find((rm) => rm.id === roomId);
  const cells = [];
  for (let k = 0; k < DOOR_LEN; k++) {
    if (side === "L") cells.push([r.x, start + k, -1, 0]);
    if (side === "R") cells.push([r.x + r.w - 1, start + k, 1, 0]);
    if (side === "T") cells.push([start + k, r.y, 0, -1]);
    if (side === "B") cells.push([start + k, r.y + r.h - 1, 0, 1]);
  }
  for (const [x, y, ox, oy] of cells) {
    if (at(x, y) !== "#") errors.push(`door ${roomId}/${side}@${start}: ${x},${y} is '${at(x, y)}', not a wall`);
    if (at(x + ox, y + oy) !== "c") errors.push(`door ${roomId}/${side}@${start}: outside ${x + ox},${y + oy} is '${at(x + ox, y + oy)}', not corridor`);
    if (at(x - ox, y - oy) !== ".") errors.push(`door ${roomId}/${side}@${start}: inside ${x - ox},${y - oy} is '${at(x - ox, y - oy)}', not floor`);
    set(x, y, "D");
  }
  const xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1]);
  doors.push({ roomId, side, x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs) + 1, h: Math.max(...ys) - Math.min(...ys) + 1 });
}

// ---- Checks --------------------------------------------------------
// every corridor tile must belong to a corridor 5 wide in its narrow axis
const widths = {};
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (at(x, y) !== "c") continue;
  let l = x, r = x, u = y, d = y;
  while ("cD".includes(at(l - 1, y))) l--; while ("cD".includes(at(r + 1, y))) r++;
  while ("cD".includes(at(x, u - 1))) u--; while ("cD".includes(at(x, d + 1))) d++;
  const w = Math.min(r - l + 1, d - u + 1);
  widths[w] = (widths[w] || 0) + 1;
}
// room-to-room connections through corridors
const conn = {};
for (const dr of doors) {
  const start = [];
  for (let y = dr.y - 1; y <= dr.y + dr.h; y++) for (let x = dr.x - 1; x <= dr.x + dr.w; x++) if (at(x, y) === "c") start.push([x, y]);
  const seen = new Set(start.map((s) => s.join())); const q = [...start];
  while (q.length) {
    const [a, b] = q.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = a + dx, ny = b + dy, k = nx + "," + ny;
      if (seen.has(k)) continue;
      const ch = at(nx, ny);
      if (ch === "c") { seen.add(k); q.push([nx, ny]); }
      else if (ch === "D") { const rr = roomAt(nx, ny); if (rr && rr.id !== dr.roomId) (conn[dr.roomId] = conn[dr.roomId] || new Set()).add(rr.id); }
    }
  }
}

console.log(`corridor width histogram (tiles -> corridor tiles):`, widths);
console.log(`doors: ${doors.length}, all ${DOOR_LEN} tiles wide`);
for (const r of ROOMS) console.log(`  ${r.id.padEnd(11)} -> ${[...(conn[r.id] || [])].sort().join(", ")}`);
if (errors.length) { console.log("\nERRORS:"); errors.forEach((e) => console.log("  " + e)); process.exit(1); }

// ---- Emit ----------------------------------------------------------
const newGrid = grid.join("");
// Sabotage gate groups: A = west half (doors left of x 70), B = east half
// (same split as before: Assembly Hall's left door and Near AI's left door
// were in A).
const gates = doors.map((d, i) => ({ id: `g${i}`, ...d, orient: d.w === 1 ? "v" : "h" }));
const groupA = gates.filter((g) => g.x < 70).map((g) => g.id);
const groupB = gates.filter((g) => g.x >= 70).map((g) => g.id);
const doorsText = "const DOORS = [\n" + gates.map((g, i) =>
  `  { id:'door${i}', x:${g.x}, y:${g.y}, w:${g.w}, h:${g.h}, side:'${g.side}', locked:false },`).join("\n") + "\n];";
const gatesText = "const GATES = [\n" + gates.map((g) =>
  `  { id:'${g.id}', x:${g.x}, y:${g.y}, w:${g.w}, h:${g.h}, orient:'${g.orient}' }, // ${g.roomId} ${g.side}`).join("\n") + "\n];";
const groupAText = `const GATE_GROUP_A = [${groupA.map((id) => `'${id}'`).join(", ")}];`;
const groupBText = `const GATE_GROUP_B = [${groupB.map((id) => `'${id}'`).join(", ")}];`;

if (!process.argv.includes("--write")) {
  console.log(`\nDry run OK. ${gates.length} gates (A: ${groupA.length}, B: ${groupB.length}). Re-run with --write to patch src/game.jsx.`);
  fs.writeFileSync(path.join(require("os").tmpdir(), "new-grid.txt"), newGrid);
  process.exit(0);
}
let out = src;
const replaceOnce = (re, text, label) => {
  const m = out.match(re);
  if (!m) throw new Error(`couldn't find ${label}`);
  out = out.replace(re, () => text);
};
replaceOnce(/^const GRID = '[^']*';$/m, `const GRID = '${newGrid}';`, "GRID");
replaceOnce(/^const DOORS = \[[\s\S]*?^\];/m, doorsText, "DOORS");
replaceOnce(/^const GATES = \[[\s\S]*?^\];/m, gatesText, "GATES");
replaceOnce(/^const GATE_GROUP_A = \[.*\];$/m, groupAText, "GATE_GROUP_A");
replaceOnce(/^const GATE_GROUP_B = \[.*\];$/m, groupBText, "GATE_GROUP_B");
fs.writeFileSync(GAME, out);
console.log(`\nWrote src/game.jsx: new GRID, ${gates.length} doors/gates (A: ${groupA.length}, B: ${groupB.length}).`);

// NEAR Saboteur music + UI sounds. Everything is synthesised live with the
// Web Audio API: no audio files, zero download weight, original music.
//   const bgm = createBgm();
//   bgm.play('menu' | 'game' | 'meeting' | null)   crossfades between tracks
//   bgm.click('pop' | 'blip' | 'tick' | 'confirm')
//   bgm.setMusicVolume(0..1)  bgm.setSfxVolume(0..1)

export function createBgm() {
  let ctx = null, musicBus, sfxBus, reverbIn, delayIn, noiseBuf;
  let current = null, currentName = null;
  let musicVol = 0.45, sfxVol = 0.7;

  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  // every sound a track starts is remembered so Stop can kill it for sure
  const reg = (out, n) => { if (out._src) { out._src.add(n); n.onended = () => out._src.delete(n); } return n; };
  let suspendTimer = null;

  function impulse(seconds, decay) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  }

  function init() {
    if (ctx) return ctx;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 3;
    comp.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = musicVol; musicBus.connect(comp);
    sfxBus = ctx.createGain(); sfxBus.gain.value = sfxVol; sfxBus.connect(comp);

    const rev = ctx.createConvolver(); rev.buffer = impulse(2.4, 2.4); // shorter tail = lighter on phones
    const revOut = ctx.createGain(); revOut.gain.value = 0.6;
    reverbIn = rev; rev.connect(revOut); revOut.connect(musicBus);

    const dl = ctx.createDelay(2); dl.delayTime.value = 0.42;
    const fb = ctx.createGain(); fb.gain.value = 0.38;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    const dOut = ctx.createGain(); dOut.gain.value = 0.45;
    dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(dOut);
    dOut.connect(musicBus); dOut.connect(rev);
    delayIn = dl;

    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    return ctx;
  }

  function unlock() {
    init();
    // 'interrupted' = iPhone after a call / app switch; resume that too
    if (ctx && ctx.state !== 'running' && ctx.state !== 'closed') ctx.resume().catch(() => {});
  }

  // ---------- instruments ----------
  function pad(out, t, notes, dur, { cutoff = 900, gain = 0.03, attack = 2, release = 2.5 } = {}) {
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cutoff; f.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.setValueAtTime(gain, t + dur);
    g.gain.linearRampToValueAtTime(0, t + dur + release);
    f.connect(g); g.connect(out);
    const end = t + dur + release + 0.1;
    notes.forEach((m) => {
      [-7, 7].forEach((cents) => {
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.value = mtof(m); o.detune.value = cents;
        reg(out, o); o.connect(f); o.start(t); o.stop(end);
      });
    });
  }

  function bell(out, t, m, vel = 1, decay = 1.6) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.09 * vel, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    g.connect(out); if (!out._echo) { out._echo = ctx.createGain(); out._echo.connect(delayIn); } g.connect(out._echo);
    const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = mtof(m);
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = mtof(m) * 2.005;
    const g2 = ctx.createGain(); g2.gain.value = 0.18;
    reg(out, o1); reg(out, o2); o1.connect(g); o2.connect(g2); g2.connect(g);
    o1.start(t); o2.start(t); o1.stop(t + decay + 0.05); o2.stop(t + decay + 0.05);
  }

  function sub(out, t, m, dur, gain = 0.13) {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(m);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.4);
    g.gain.setValueAtTime(gain, t + dur - 0.6);
    g.gain.linearRampToValueAtTime(0, t + dur + 0.3);
    reg(out, o); o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.4);
  }

  function thump(out, t, gain = 0.3) {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(72, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.22);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    reg(out, o); o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.45);
  }

  function shaker(out, t, gain = 0.012) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    reg(out, s); s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + 0.08);
  }

  function scheduler(stepDur, onStep) {
    let next = ctx.currentTime + 0.15, i = 0;
    const tick = () => {
      while (next < ctx.currentTime + 0.5) { onStep(i, next); i++; next += stepDur; }
    };
    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }

  function trackOut(level) {
    const out = ctx.createGain();
    out._src = new Set();
    out.gain.setValueAtTime(0, ctx.currentTime);
    out.gain.linearRampToValueAtTime(level, ctx.currentTime + 1.5);
    out.connect(musicBus);
    const send = ctx.createGain(); send.gain.value = 0.55;
    out.connect(send); send.connect(reverbIn);
    return out;
  }

  // ---------- extra instruments ----------
  function pluck(out, t, m, vel = 1, { type = 'square', bright = 2600, decay = 0.32, gain = 0.06 } = {}) {
    const o = reg(out, ctx.createOscillator()); o.type = type; o.frequency.value = mtof(m);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 1;
    f.frequency.setValueAtTime(bright, t); f.frequency.exponentialRampToValueAtTime(500, t + decay);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain * vel, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(f); f.connect(g); g.connect(out);
    o.start(t); o.stop(t + decay + 0.05);
    return g;
  }

  function kick(out, t, gain = 0.32) {
    const o = reg(out, ctx.createOscillator()); o.type = 'sine';
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.32);
  }

  function snap(out, t, gain = 0.05) {
    const s = reg(out, ctx.createBufferSource()); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 1.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + 0.14);
  }

  // ---------- track: HANGAR (home / menus / lobby) ----------
  // Bright, friendly, a bit bouncy: F major, 100 bpm, a catchy little
  // melody, plucky bass and a soft beat. "Hang out before the match."
  function menuTrack() {
    const out = trackOut(0.85);
    const eighth = 60 / 100 / 2;
    const bars = [
      { pad: [53, 57, 60, 64], bass: 41, mel: [72, -1, 76, -1, 77, 76, 72, -1] }, // Fmaj7
      { pad: [52, 55, 60, 67], bass: 40, mel: [74, -1, 72, -1, 67, -1, 72, 74] }, // C/E
      { pad: [50, 57, 60, 65], bass: 38, mel: [77, -1, 76, 74, -1, 72, 74, -1] }, // Dm7
      { pad: [46, 53, 57, 62], bass: 34, mel: [70, -1, 74, -1, 77, -1, 74, 72] }, // Bbmaj7
    ];
    const bassPat = [0, -1, -1, 0, 0, -1, 12, -1];
    const stop = scheduler(eighth, (i, t) => {
      const step = i % 8, bar = bars[Math.floor(i / 8) % 4], pass = Math.floor(i / 32);
      if (step === 0) pad(out, t, bar.pad, eighth * 8 - 0.2, { cutoff: 1400, gain: 0.014, attack: 0.4, release: 1 });
      if (bassPat[step] >= 0) pluck(out, t, bar.bass + bassPat[step], 1, { type: 'triangle', bright: 900, decay: 0.28, gain: 0.16 });
      if (pass >= 1) {
        if (step === 0 || step === 4) kick(out, t, 0.26);
        if (step === 2 || step === 6) snap(out, t, 0.04);
        if (step % 2 === 1) shaker(out, t, 0.014);
      }
      // melody comes in on the 2nd pass; every 3rd pass it rests so it never nags
      const m = bar.mel[step];
      if (pass >= 1 && pass % 3 !== 0 && m >= 0) {
        const g = pluck(out, t, m + (pass % 3 === 2 ? 12 : 0), 0.9, { type: 'square', bright: 3200, decay: 0.35, gain: 0.045 });
        if (!out._echo) { out._echo = ctx.createGain(); out._echo.gain.value = 0.5; out._echo.connect(delayIn); }
        g.connect(out._echo);
      }
    });
    return { out, stop };
  }

  // ---------- track: SHIP (gameplay) ----------
  // Dark and tense, no melody: low ship hum, a nervous ticking bass
  // pulse, slow heartbeat and the odd metallic creak. Quiet so footsteps,
  // kills and alarms still cut through.
  function gameTrack() {
    const out = trackOut(0.8);
    // drone + air hum
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 300; lp.Q.value = 2;
    const lfo = reg(out, ctx.createOscillator()); lfo.frequency.value = 0.05;
    const lfoAmt = ctx.createGain(); lfoAmt.gain.value = 120;
    lfo.connect(lfoAmt); lfoAmt.connect(lp.frequency);
    const dg = ctx.createGain(); dg.gain.value = 0.045;
    lp.connect(dg); dg.connect(out);
    [[26, 'sawtooth', -5], [26, 'sawtooth', 5], [33, 'triangle', 0]].forEach(([m, type, det]) => {
      const o = reg(out, ctx.createOscillator()); o.type = type; o.frequency.value = mtof(m); o.detune.value = det;
      o.connect(lp); o.start();
    });
    lfo.start();
    const hs = reg(out, ctx.createBufferSource()); hs.buffer = noiseBuf; hs.loop = true;
    const hf = ctx.createBiquadFilter(); hf.type = 'bandpass'; hf.frequency.value = 160; hf.Q.value = 0.9;
    const hg = ctx.createGain(); hg.gain.value = 0.04;
    hs.connect(hf); hf.connect(hg); hg.connect(out); hs.start();

    const s16 = 0.2; // a nervous 16th-note pulse
    const tick = [38, -1, 38, 38, -1, 38, 39, -1, 38, -1, 38, 38, -1, 41, 39, -1];
    const swell = [[38, 44, 50], [37, 44, 49], [38, 45, 51], [36, 43, 49]];
    const stop = scheduler(s16, (i, t) => {
      const p = i % 16;
      // ticking bass pulse, slowly opening and closing
      if (i >= 8 && tick[p] >= 0) {
        const bright = 380 + 260 * (0.5 + 0.5 * Math.sin(i / 30));
        pluck(out, t, tick[p], p % 4 === 0 ? 1 : 0.6, { type: 'sawtooth', bright, decay: 0.16, gain: 0.07 });
      }
      if (i % 24 === 0) { thump(out, t, 0.24); thump(out, t + 0.3, 0.13); } // heartbeat
      if (i % 96 === 0) pad(out, t, swell[Math.floor(i / 96) % swell.length], s16 * 96 - 2, { cutoff: 420, gain: 0.02, attack: 5, release: 4 });
      if (i % 64 === 40 && Math.random() < 0.5) { // metal creak
        const o = reg(out, ctx.createOscillator()); o.type = 'sawtooth';
        o.frequency.setValueAtTime(190 + Math.random() * 60, t); o.frequency.linearRampToValueAtTime(140, t + 1.4);
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 8;
        const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.03, t + 0.3); g.gain.linearRampToValueAtTime(0, t + 1.4);
        o.connect(f); f.connect(g); g.connect(out); o.start(t); o.stop(t + 1.5);
      }
    });
    return { out, stop };
  }

  // ---------- track: MEETING (emergency meeting / voting) ----------
  // "Who did it?" Quiet suspense under the chat: a clock that keeps
  // ticking, a slow low pulse, a hanging question-like chime. Soft so
  // people can think and read.
  function meetingTrack() {
    const out = trackOut(0.7);
    const beat = 60 / 84;
    const chords = [[45, 52, 57, 60], [44, 52, 56, 59], [45, 52, 57, 60], [41, 48, 53, 57]]; // Am  E/G#  Am  F
    const ask = [[69, 72], [68, 71], [69, 74], [65, 69]];
    const stop = scheduler(beat / 2, (i, t) => {
      const s = i % 16, bar = Math.floor(i / 16) % 4;
      if (s === 0) pad(out, t, chords[bar], beat * 8 - 0.3, { cutoff: 700, gain: 0.018, attack: 1.2, release: 1.5 });
      // clock: tick on every beat, tock a little lower
      if (s % 2 === 0) {
        const o = reg(out, ctx.createOscillator()); o.type = 'sine';
        o.frequency.value = (s / 2) % 2 ? 1500 : 2100;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.035, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
        o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.05);
      }
      // low pulse on beats 1 and 3
      if (s === 0 || s === 8) pluck(out, t, chords[bar][0] - 12, 1, { type: 'triangle', bright: 500, decay: 0.5, gain: 0.14 });
      // a two-note "question" every 2 bars, after the first one
      if (i >= 16 && s === 12 && bar % 2 === 1) { bell(out, t, ask[bar][0], 0.45, 1.8); bell(out, t + beat, ask[bar][1], 0.4, 2.4); }
    });
    return { out, stop };
  }

  const TRACKS = { menu: menuTrack, game: gameTrack, meeting: meetingTrack };

  function kill(track) {
    track.stop();
    const t = ctx.currentTime;
    track.out.gain.cancelScheduledValues(t);
    track.out.gain.setValueAtTime(track.out.gain.value, t);
    track.out.gain.linearRampToValueAtTime(0, t + 1);
    setTimeout(() => {
      track.out._src.forEach((n) => { try { n.stop(); } catch {} });
      track.out._src.clear();
      try { track.out.disconnect(); } catch {}
      try { track.out._echo && track.out._echo.disconnect(); } catch {}
    }, 1100);
  }

  function play(name) {
    if (!init()) return;
    if (name && name === currentName) return;
    clearTimeout(suspendTimer);
    if (current) kill(current);
    currentName = name && TRACKS[name] ? name : null;
    if (currentName) {
      unlock();
      current = TRACKS[currentName]();
    } else {
      current = null;
      // nothing should be playing: after the fade, pause the whole engine
      suspendTimer = setTimeout(() => { if (!currentName && ctx.state === 'running') ctx.suspend(); }, 1500);
    }
  }

  // ---------- UI sounds ----------
  function click(kind = 'pop') {
    if (!init()) return;
    clearTimeout(suspendTimer);
    unlock();
    if (!currentName) suspendTimer = setTimeout(() => { if (!currentName && ctx.state === 'running') ctx.suspend(); }, 1500);
    const t = ctx.currentTime + 0.005;
    const tone = (type, f0, f1, dur, gain, at = 0) => {
      const o = ctx.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(f0, t + at); o.frequency.exponentialRampToValueAtTime(f1, t + at + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t + at); g.gain.linearRampToValueAtTime(gain, t + at + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + at + dur);
      o.connect(g); g.connect(sfxBus); o.start(t + at); o.stop(t + at + dur + 0.02);
    };
    if (kind === 'pop') { tone('triangle', 520, 900, 0.07, 0.32); tone('sine', 1100, 1300, 0.05, 0.08, 0.01); }
    else if (kind === 'blip') { tone('sine', 1250, 1250, 0.06, 0.18); tone('sine', 1870, 1870, 0.05, 0.06); }
    else if (kind === 'tick') { tone('square', 2600, 1800, 0.025, 0.05); tone('sine', 700, 500, 0.04, 0.12); }
    else if (kind === 'back') { tone('triangle', 800, 420, 0.09, 0.28); }
    else if (kind === 'open') { tone('sine', 380, 760, 0.16, 0.18); tone('triangle', 760, 1140, 0.12, 0.12, 0.06); }
    else if (kind === 'success') { [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, f, 0.22, 0.2, i * 0.08)); tone('sine', 2093, 2093, 0.35, 0.05, 0.32); }
    else if (kind === 'confirm') { tone('triangle', 660, 660, 0.12, 0.25); tone('triangle', 990, 990, 0.22, 0.25, 0.09); tone('sine', 1980, 1980, 0.2, 0.05, 0.09); }
  }

  return {
    play, click, unlock,
    get current() { return currentName; },
    get state() { return ctx ? ctx.state : 'none'; },
    get liveSounds() { return current ? current.out._src.size : 0; },
    setMusicVolume(v) { musicVol = v; if (musicBus) musicBus.gain.setTargetAtTime(v, ctx.currentTime, 0.05); },
    setSfxVolume(v) { sfxVol = v; if (sfxBus) sfxBus.gain.setTargetAtTime(v, ctx.currentTime, 0.05); },
    suspend() { if (ctx && ctx.state === 'running') ctx.suspend(); },
    resume() { if (ctx && ctx.state !== 'running' && ctx.state !== 'closed') ctx.resume().catch(() => {}); },
  };
}

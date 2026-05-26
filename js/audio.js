/* ═══════════════════════════════════════════════════════════
   SURVIVOR'S GAMBIT — AUDIO ENGINE
   Uses Web Audio API — no files needed, works offline
   ═══════════════════════════════════════════════════════════ */

const Audio = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function tone({ freq = 440, type = 'sine', duration = 0.15, volume = 0.18, delay = 0 } = {}) {
    try {
      const ac  = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
      gain.gain.setValueAtTime(0, ac.currentTime + delay);
      gain.gain.linearRampToValueAtTime(volume, ac.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
      osc.start(ac.currentTime + delay);
      osc.stop(ac.currentTime + delay + duration + 0.05);
    } catch(e) { /* Audio blocked — silently ignore */ }
  }

  return {
    tap()      { tone({ freq: 600, type: 'sine',     duration: 0.08, volume: 0.12 }); },
    select()   { tone({ freq: 880, type: 'triangle', duration: 0.12, volume: 0.15 }); },
    lock()     { tone({ freq: 440, type: 'square',   duration: 0.06, volume: 0.08 });
                 tone({ freq: 660, type: 'square',   duration: 0.12, volume: 0.08, delay: 0.07 }); },
    reveal()   {
      [400, 500, 650, 800].forEach((f, i) =>
        tone({ freq: f, type: 'sine', duration: 0.18, volume: 0.14, delay: i * 0.07 })
      );
    },
    strong()   {
      [523, 659, 784, 1047].forEach((f, i) =>
        tone({ freq: f, type: 'triangle', duration: 0.25, volume: 0.18, delay: i * 0.08 })
      );
    },
    weak()     { tone({ freq: 200, type: 'sawtooth', duration: 0.4, volume: 0.12 }); },
    partial()  { tone({ freq: 500, type: 'sine',     duration: 0.2, volume: 0.12 }); },
    win()      {
      [523, 659, 784, 659, 784, 1047].forEach((f, i) =>
        tone({ freq: f, type: 'triangle', duration: 0.3, volume: 0.2, delay: i * 0.1 })
      );
    },
    tie()      {
      [523, 523, 784].forEach((f, i) =>
        tone({ freq: f, type: 'sine', duration: 0.3, volume: 0.15, delay: i * 0.15 })
      );
    },
  };
})();
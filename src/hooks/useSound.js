import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'globalization-terminal-sound-enabled';

const noteToFreq = (note) => 440 * Math.pow(2, (note - 69) / 12);

/* ─── Arcade background music sequences ─── */
const BEAT_SEC = 60 / 145 / 4; // 16th note at 145 BPM ≈ 0.103 s

// C minor pentatonic arpeggio melody (MIDI notes, 0 = rest)
const MEL_A = [72, 75, 77, 79, 82, 79, 77, 75, 72, 70, 72, 75, 79, 82, 79, 77];
const MEL_B = [70, 72, 75, 77, 79, 77, 75, 72, 70, 67, 70, 72, 75, 79, 82, 84];
const MEL_C = [84, 82, 79, 77, 75, 77, 79, 82, 84, 87, 84, 82, 79, 77, 75, 72];
const MELODY_BARS = [MEL_A, MEL_B, MEL_A, MEL_C];

// Bass notes (every 4 steps = quarter note)
const BASS_SEQ = [48, 0, 0, 0, 55, 0, 0, 0, 48, 0, 0, 0, 53, 0, 0, 0,
                  46, 0, 0, 0, 55, 0, 0, 0, 48, 0, 0, 0, 53, 0, 0, 0,
                  48, 0, 0, 0, 55, 0, 0, 0, 48, 0, 0, 0, 53, 0, 0, 0,
                  46, 0, 0, 0, 53, 0, 0, 0, 48, 0, 0, 0, 55, 0, 0, 0];

// Chord stabs every 8 steps
const CHORD_SEQ = [
  [60, 63, 67], null, null, null, null, null, null, null,
  [58, 62, 65], null, null, null, null, null, null, null,
  [60, 63, 67], null, null, null, null, null, null, null,
  [58, 62, 65], null, null, null, null, null, null, null,
  [60, 63, 67], null, null, null, null, null, null, null,
  [58, 62, 65], null, null, null, null, null, null, null,
  [60, 63, 67], null, null, null, null, null, null, null,
  [55, 58, 62], null, null, null, null, null, null, null,
];

const TOTAL_STEPS = MELODY_BARS.length * 16; // 64 steps per loop

export default function useSound() {
  const audioCtxRef = useRef(null);
  const bgRef = useRef({ playing: false, timer: null, nextTime: 0, step: 0 });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, String(soundEnabled));
    }
  }, [soundEnabled]);

  const getCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  /* ─── Generic note scheduler ─── */
  const playSequence = useCallback(
    (steps) => {
      if (!soundEnabled) return;
      const ctx = getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      steps.forEach((step, i) => {
        const t = now + (step.delay ?? i * 0.08);
        const dur = step.duration ?? 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = step.type ?? 'triangle';
        osc.frequency.value = step.frequency;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(step.volume ?? 0.07, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
      });
    },
    [getCtx, soundEnabled],
  );

  /* ─── SFX: UI click (generic) ─── */
  const playUiClick = useCallback(
    () => playSequence([{ frequency: noteToFreq(76), duration: 0.06, volume: 0.04, type: 'triangle' }]),
    [playSequence],
  );

  /* ─── SFX: Hint / clue reveal ─── */
  const playHintReveal = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(84), duration: 0.06, volume: 0.04, type: 'sine', delay: 0 },
        { frequency: noteToFreq(88), duration: 0.08, volume: 0.045, type: 'sine', delay: 0.05 },
        { frequency: noteToFreq(91), duration: 0.10, volume: 0.05, type: 'triangle', delay: 0.10 },
      ]),
    [playSequence],
  );

  /* ─── SFX: Pin drop on globe ─── */
  const playPinDrop = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(90), duration: 0.05, volume: 0.05, type: 'sine', delay: 0 },
        { frequency: noteToFreq(80), duration: 0.07, volume: 0.04, type: 'sine', delay: 0.04 },
        { frequency: noteToFreq(70), duration: 0.1, volume: 0.035, type: 'triangle', delay: 0.09 },
      ]),
    [playSequence],
  );

  /* ─── SFX: Submit / lock-in answer ─── */
  const playSubmit = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(67), duration: 0.08, volume: 0.05, type: 'square', delay: 0 },
        { frequency: noteToFreq(72), duration: 0.08, volume: 0.055, type: 'square', delay: 0.07 },
        { frequency: noteToFreq(79), duration: 0.14, volume: 0.06, type: 'square', delay: 0.14 },
      ]),
    [playSequence],
  );

  /* ─── SFX: Navigate / next ─── */
  const playNavigate = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(72), duration: 0.07, volume: 0.045, type: 'triangle', delay: 0 },
        { frequency: noteToFreq(76), duration: 0.09, volume: 0.05, type: 'triangle', delay: 0.06 },
      ]),
    [playSequence],
  );

  /* ─── SFX: Correct answer ─── */
  const playSuccess = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(72), duration: 0.10, volume: 0.055, type: 'triangle', delay: 0 },
        { frequency: noteToFreq(76), duration: 0.12, volume: 0.06, type: 'triangle', delay: 0.08 },
        { frequency: noteToFreq(79), duration: 0.16, volume: 0.065, type: 'triangle', delay: 0.16 },
        { frequency: noteToFreq(84), duration: 0.20, volume: 0.07, type: 'triangle', delay: 0.24 },
      ]),
    [playSequence],
  );

  /* ─── SFX: Wrong answer ─── */
  const playWarning = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(60), duration: 0.10, volume: 0.05, type: 'sawtooth', delay: 0 },
        { frequency: noteToFreq(55), duration: 0.14, volume: 0.05, type: 'sawtooth', delay: 0.09 },
        { frequency: noteToFreq(50), duration: 0.18, volume: 0.04, type: 'sawtooth', delay: 0.18 },
      ]),
    [playSequence],
  );

  /* ─── SFX: Magic / grimoire button click ─── */
  const playMagicClick = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(96), duration: 0.09, volume: 0.038, type: 'sine', delay: 0 },
        { frequency: noteToFreq(100), duration: 0.07, volume: 0.03, type: 'sine', delay: 0.04 },
        { frequency: noteToFreq(103), duration: 0.10, volume: 0.022, type: 'sine', delay: 0.07 },
      ]),
    [playSequence],
  );

  /* ─── SFX: Congratulations / project complete fanfare ─── */
  const playCongratsFinish = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(60), duration: 0.12, volume: 0.07, type: 'triangle', delay: 0 },
        { frequency: noteToFreq(64), duration: 0.12, volume: 0.07, type: 'triangle', delay: 0.10 },
        { frequency: noteToFreq(67), duration: 0.12, volume: 0.08, type: 'triangle', delay: 0.20 },
        { frequency: noteToFreq(72), duration: 0.12, volume: 0.08, type: 'square',   delay: 0.30 },
        { frequency: noteToFreq(76), duration: 0.12, volume: 0.09, type: 'square',   delay: 0.40 },
        { frequency: noteToFreq(79), duration: 0.12, volume: 0.09, type: 'triangle', delay: 0.50 },
        { frequency: noteToFreq(84), duration: 0.20, volume: 0.10, type: 'triangle', delay: 0.60 },
        { frequency: noteToFreq(91), duration: 0.10, volume: 0.055, type: 'sine',    delay: 0.72 },
        { frequency: noteToFreq(96), duration: 0.10, volume: 0.05,  type: 'sine',    delay: 0.80 },
        { frequency: noteToFreq(84), duration: 0.55, volume: 0.09, type: 'triangle', delay: 0.88 },
        { frequency: noteToFreq(88), duration: 0.55, volume: 0.08, type: 'triangle', delay: 0.92 },
        { frequency: noteToFreq(91), duration: 0.55, volume: 0.07, type: 'sine',     delay: 0.96 },
      ]),
    [playSequence],
  );

  /* ─── SFX: Stage win fanfare ─── */
  const playWin = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(67), duration: 0.1, volume: 0.07, type: 'triangle', delay: 0 },
        { frequency: noteToFreq(72), duration: 0.1, volume: 0.08, type: 'triangle', delay: 0.1 },
        { frequency: noteToFreq(76), duration: 0.1, volume: 0.08, type: 'triangle', delay: 0.2 },
        { frequency: noteToFreq(79), duration: 0.1, volume: 0.09, type: 'triangle', delay: 0.3 },
        { frequency: noteToFreq(84), duration: 0.35, volume: 0.10, type: 'triangle', delay: 0.4 },
      ]),
    [playSequence],
  );

  /* ─── SFX: Lose ─── */
  const playLose = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(72), duration: 0.15, volume: 0.07, type: 'sawtooth', delay: 0 },
        { frequency: noteToFreq(67), duration: 0.15, volume: 0.07, type: 'sawtooth', delay: 0.16 },
        { frequency: noteToFreq(62), duration: 0.15, volume: 0.07, type: 'sawtooth', delay: 0.32 },
        { frequency: noteToFreq(57), duration: 0.35, volume: 0.07, type: 'sawtooth', delay: 0.48 },
      ]),
    [playSequence],
  );

  /* ─── Background music scheduler ─── */
  const scheduleBgStep = useCallback((ac, stepIndex) => {
    const t = bgRef.current.nextTime;
    const loopStep = stepIndex % TOTAL_STEPS;
    const barIdx = Math.floor(loopStep / 16) % MELODY_BARS.length;
    const beatIdx = loopStep % 16;
    const melNote = MELODY_BARS[barIdx][beatIdx];
    const bassNote = BASS_SEQ[loopStep % BASS_SEQ.length];
    const chordNotes = CHORD_SEQ[loopStep % CHORD_SEQ.length];

    /* Melody */
    if (melNote) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'square';
      osc.frequency.value = noteToFreq(melNote);
      g.gain.setValueAtTime(0.022, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + BEAT_SEC * 0.78);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(t);
      osc.stop(t + BEAT_SEC);
    }

    /* Bass */
    if (bassNote) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = noteToFreq(bassNote);
      g.gain.setValueAtTime(0.018, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + BEAT_SEC * 3.5);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(t);
      osc.stop(t + BEAT_SEC * 4);
    }

    /* Chord stab */
    if (chordNotes) {
      chordNotes.forEach((n) => {
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.value = noteToFreq(n);
        g.gain.setValueAtTime(0.012, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + BEAT_SEC * 6);
        osc.connect(g);
        g.connect(ac.destination);
        osc.start(t);
        osc.stop(t + BEAT_SEC * 7);
      });
    }

    bgRef.current.nextTime += BEAT_SEC;
    bgRef.current.step = stepIndex + 1;
  }, []);

  const startBgMusic = useCallback(() => {
    if (bgRef.current.playing) return;
    const ctx = getCtx();
    if (!ctx) return;

    bgRef.current.playing = true;
    bgRef.current.nextTime = ctx.currentTime + 0.08;
    bgRef.current.step = 0;

    const schedule = () => {
      if (!bgRef.current.playing) return;
      const ac = audioCtxRef.current;
      if (!ac) return;
      while (bgRef.current.nextTime < ac.currentTime + 0.25) {
        scheduleBgStep(ac, bgRef.current.step);
      }
    };

    schedule();
    bgRef.current.timer = setInterval(schedule, 40);
  }, [getCtx, scheduleBgStep]);

  const stopBgMusic = useCallback(() => {
    bgRef.current.playing = false;
    if (bgRef.current.timer) {
      clearInterval(bgRef.current.timer);
      bgRef.current.timer = null;
    }
  }, []);

  /* Stop music when hook unmounts */
  useEffect(() => () => stopBgMusic(), [stopBgMusic]);

  return {
    soundEnabled,
    setSoundEnabled,
    toggleSound: () => setSoundEnabled((v) => !v),
    playUiClick,
    playMagicClick,
    playCongratsFinish,
    playHintReveal,
    playPinDrop,
    playSubmit,
    playNavigate,
    playSuccess,
    playWarning,
    playWin,
    playLose,
    startBgMusic,
    stopBgMusic,
  };
}

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'globalization-terminal-sound-enabled';

const noteToFreq = (note) => 440 * Math.pow(2, (note - 69) / 12);

export default function useSound() {
  const audioCtxRef = useRef(null);
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

  const playUiClick = useCallback(
    () => playSequence([{ frequency: noteToFreq(76), duration: 0.07, volume: 0.04, type: 'triangle' }]),
    [playSequence],
  );

  const playSuccess = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(72), duration: 0.12, volume: 0.05, type: 'triangle', delay: 0 },
        { frequency: noteToFreq(76), duration: 0.14, volume: 0.055, type: 'triangle', delay: 0.09 },
        { frequency: noteToFreq(79), duration: 0.18, volume: 0.06, type: 'triangle', delay: 0.18 },
      ]),
    [playSequence],
  );

  const playWarning = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(62), duration: 0.11, volume: 0.04, type: 'sawtooth', delay: 0 },
        { frequency: noteToFreq(58), duration: 0.11, volume: 0.04, type: 'sawtooth', delay: 0.1 },
      ]),
    [playSequence],
  );

  const playWin = useCallback(
    () =>
      playSequence([
        { frequency: noteToFreq(67), duration: 0.1, volume: 0.07, type: 'triangle', delay: 0 },
        { frequency: noteToFreq(72), duration: 0.1, volume: 0.08, type: 'triangle', delay: 0.1 },
        { frequency: noteToFreq(76), duration: 0.1, volume: 0.08, type: 'triangle', delay: 0.2 },
        { frequency: noteToFreq(79), duration: 0.1, volume: 0.09, type: 'triangle', delay: 0.3 },
        { frequency: noteToFreq(84), duration: 0.35, volume: 0.1, type: 'triangle', delay: 0.4 },
      ]),
    [playSequence],
  );

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

  return {
    soundEnabled,
    setSoundEnabled,
    toggleSound: () => setSoundEnabled((v) => !v),
    playUiClick,
    playSuccess,
    playWarning,
    playWin,
    playLose,
  };
}

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Flag, Globe2, Users } from 'lucide-react';
import TutorialModal from './TutorialModal.jsx';

const TOUR_SEEN_KEY = 'gt-tour-seen';

const decodeToken = (raw) => {
  try {
    const data = JSON.parse(atob(raw.trim()));
    if (!data.u || data.t == null) return null;
    return {
      username: data.u,
      stage1Score: data.s1 ?? 0,
      stage2Score: data.s2 ?? 0,
      stage3Score: data.s3 ?? 0,
      total: data.t,
    };
  } catch {
    return null;
  }
};

const STAGES_INFO = [
  {
    icon: Globe2,
    label: 'STAGE 01',
    name: 'GEO-GUESSR',
    color: '#00FFFF',
    desc: 'Drop a pin on the globe. 30 s per clue. Map the flows of history.',
  },
  {
    icon: Flag,
    label: 'STAGE 02',
    name: 'FLAG SORT',
    color: '#FFD700',
    desc: 'Ten nations. Three portals. Classify by World-Systems position.',
  },
  {
    icon: Users,
    label: 'STAGE 03',
    name: 'GLOBAL FEUD',
    color: '#FF0080',
    desc: '8 questions. 2-minute clock. Skipped Qs return later.',
  },
];

export default function LandingPage({ onStartSolo, onStartChallenger, onOpenLibrary }) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState('idle'); // 'idle' | 'token' | 'lobby'
  const [token, setToken] = useState('');
  const [challenger, setChallenger] = useState(null);
  const [error, setError] = useState('');
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialStart, setTutorialStart] = useState(0);

  const openTour = (start = 0) => {
    setMode('idle');
    setTutorialStart(start);
    setTutorialOpen(true);
  };

  const closeTour = () => {
    setTutorialOpen(false);
    try {
      localStorage.setItem(TOUR_SEEN_KEY, '1');
    } catch { /* ignore */ }
  };

  /* First visit — auto-start the guided tour */
  useEffect(() => {
    try {
      if (localStorage.getItem(TOUR_SEEN_KEY)) return undefined;
      const t = setTimeout(() => openTour(0), 700);
      return () => clearTimeout(t);
    } catch {
      return undefined;
    }
  }, []);

  const nameOk = name.trim().length > 0;

  const guard = (msg) => {
    if (!nameOk) { setError(msg); return false; }
    setError('');
    return true;
  };

  const handleSolo = () => {
    if (!guard('ENTER YOUR NAME FIRST.')) return;
    onStartSolo(name.trim().toUpperCase());
  };

  const handleDecodeToken = () => {
    if (!token.trim()) { setError('PASTE THE TOKEN FROM YOUR OPPONENT.'); return; }
    const decoded = decodeToken(token);
    if (!decoded) { setError('INVALID TOKEN — CHECK THE CODE AND TRY AGAIN.'); return; }
    setChallenger(decoded);
    setMode('lobby');
    setError('');
  };

  const handleConfirmChallenge = () => {
    if (!guard('YOU NEED A NAME TO ACCEPT THE CHALLENGE.')) return;
    onStartChallenger(name.trim().toUpperCase(), challenger);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-3 sm:px-4 pb-24 sm:pb-20 relative overflow-x-hidden">
      {/* Grid overlay */}
      <div className="fixed inset-0 arcade-grid-bg opacity-100 pointer-events-none" />
      {/* World map ghost */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'url("https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1280px-World_map_-_low_resolution.svg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'invert(1) hue-rotate(280deg)',
        }}
      />

      {/* ── HERO TITLE ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mt-6 sm:mt-10 mb-3 sm:mb-5 text-center"
      >
        <p className="font-mono-arcade text-[10px] text-[#FF0080] tracking-[0.45em] uppercase mb-3 opacity-75">
          ■ ACADEMIC SIMULATION SYSTEM ■
        </p>

        <div className="glitch-wrap inline-block leading-none mb-1">
          <h1 className="font-display text-[clamp(3.5rem,14vw,8rem)] text-white tracking-wider leading-none">
            GLOBALIZATION
          </h1>
          <span className="glitch-layer-m font-display text-[clamp(3.5rem,14vw,8rem)] tracking-wider leading-none" aria-hidden="true">
            GLOBALIZATION
          </span>
          <span className="glitch-layer-c font-display text-[clamp(3.5rem,14vw,8rem)] tracking-wider leading-none" aria-hidden="true">
            GLOBALIZATION
          </span>
        </div>

        <h2 className="font-display text-[clamp(2rem,8vw,4.5rem)] text-[#FF0080] text-glow-magenta tracking-widest leading-none">
          TERMINAL
        </h2>
        <p className="font-mono-arcade text-[8px] sm:text-[10px] text-[#444] mt-2 sm:mt-3 tracking-[0.18em] sm:tracking-[0.28em] leading-relaxed px-1">
          ABSURDIST ARCADE EDITION ◆ WORLD-SYSTEMS THEORY UNLOCKED
        </p>
      </motion.div>

      {/* ── STAGE PREVIEW CARDS ────────────────────────── */}
      <motion.div
        id="tour-stages"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-x-1.5 sm:gap-x-2 gap-y-1 w-full max-w-lg mb-3 sm:mb-5 items-start"
      >
        {STAGES_INFO.map((s, i) => (
          <div key={s.name} className="flex flex-col items-center min-w-0">
            <button
              id={i === 0 ? 'tour-stage-geo' : i === 1 ? 'tour-stage-flag' : 'tour-stage-feud'}
              type="button"
              onClick={() => openTour(i + 1)}
              className="arcade-card w-full p-2 sm:p-3 text-center transition-all hover:brightness-110 min-h-[88px] sm:min-h-[104px] flex flex-col items-center justify-center"
              style={{ borderColor: s.color, borderWidth: '2px' }}
            >
              <s.icon size={16} style={{ color: s.color }} className="mx-auto mb-1 sm:mb-1.5" />
              <p className="font-mono-arcade text-[6px] sm:text-[7px] tracking-widest opacity-50 mb-0.5">{s.label}</p>
              <p className="font-display text-[11px] sm:text-sm leading-none mb-0.5 sm:mb-1" style={{ color: s.color }}>
                {s.name}
              </p>
              <p className="text-[6px] sm:text-[8px] text-[#666] leading-snug hidden sm:block">{s.desc}</p>
            </button>

            {i === 1 ? (
              <motion.button
                id="tour-how-to-play"
                type="button"
                onClick={() => openTour(0)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94, y: 3 }}
                aria-label="How to play"
                className="mt-2 w-full btn-arcade btn-cyan py-1.5 px-0.5 font-mono-arcade text-[6px] sm:text-[8px] tracking-[0.12em] sm:tracking-widest leading-none shrink-0 whitespace-nowrap"
                style={{ boxShadow: '0 0 12px rgba(0,255,255,0.25)' }}
              >
                ◈ HOW TO PLAY
              </motion.button>
            ) : (
              <div className="mt-2 w-full py-1.5 shrink-0 invisible" aria-hidden="true" />
            )}
          </div>
        ))}
      </motion.div>

      {/* ── FORM CARD ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="arcade-card w-full max-w-md p-4 sm:p-6"
        style={{ borderColor: '#2A2A2A' }}
      >
        <AnimatePresence mode="wait">
          {/* ── IDLE MODE ── */}
          {mode === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div id="tour-call-sign" className="mb-3 sm:mb-4">
                <label
                  htmlFor="call-sign-input"
                  className="font-mono-arcade text-[10px] sm:text-[11px] text-[#CCCCCC] tracking-widest uppercase block mb-2"
                >
                  ▶ YOUR CALL SIGN
                </label>
                <input
                  id="call-sign-input"
                  className="arcade-input"
                  type="text"
                  maxLength={20}
                  placeholder="COMMANDER..."
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSolo(); }}
                  autoFocus
                />
              </div>

              {error && (
                <p className="font-mono-arcade text-[9px] text-[#FF0080] mb-3 tracking-widest">{error}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3">
                <motion.button
                  type="button"
                  onClick={handleSolo}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.94, y: 5 }}
                  className="btn-arcade btn-lime w-full sm:flex-1 py-3 text-[11px] sm:text-sm"
                >
                  ▶ PLAY SOLO
                </motion.button>
                <motion.button
                  id="tour-challenger"
                  type="button"
                  onClick={() => { setMode('token'); setError(''); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.94, y: 5 }}
                  className="btn-arcade btn-cyan w-full sm:flex-1 py-3 text-[11px] sm:text-sm"
                >
                  ◈ CHALLENGER
                </motion.button>
              </div>

              <button
                id="tour-grimoire"
                type="button"
                onClick={() => onOpenLibrary()}
                className="w-full py-2.5 font-mono-arcade text-[9px] text-[#333] tracking-widest uppercase border border-[#222] hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
              >
                ◈ OPEN GRIMOIRE / STUDY DOSSIER
              </button>
            </motion.div>
          )}

          {/* ── TOKEN ENTRY ── */}
          {mode === 'token' && (
            <motion.div
              key="token"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={14} className="text-[#FFD700] shrink-0" />
                <p className="font-mono-arcade text-[9px] text-[#FFD700] tracking-widest uppercase">
                  PASTE CHALLENGER TOKEN
                </p>
              </div>

              <label className="font-mono-arcade text-[10px] text-[#666] tracking-widest uppercase block mb-2">
                ▶ YOUR CALL SIGN
              </label>
              <input
                className="arcade-input mb-3"
                type="text"
                maxLength={20}
                placeholder="COMMANDER..."
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
              />

              <label className="font-mono-arcade text-[10px] text-[#666] tracking-widest uppercase block mb-2">
                ▶ OPPONENT'S BASE64 TOKEN
              </label>
              <textarea
                className="arcade-input mb-3 resize-none text-[11px] h-[72px]"
                placeholder="eyJ1IjoiUExBWUVSMSIs..."
                value={token}
                onChange={(e) => { setToken(e.target.value); setError(''); }}
              />

              {error && (
                <p className="font-mono-arcade text-[9px] text-[#FF0080] mb-3 tracking-widest">{error}</p>
              )}

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={handleDecodeToken}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.94, y: 5 }}
                  className="btn-arcade btn-magenta flex-1 py-3"
                >
                  ⚡ DECODE &amp; CONFIRM
                </motion.button>
                <button
                  type="button"
                  onClick={() => { setMode('idle'); setError(''); setToken(''); }}
                  className="btn-arcade btn-ghost px-5 py-3"
                >
                  ← BACK
                </button>
              </div>
            </motion.div>
          )}

          {/* ── CHALLENGER LOBBY ── */}
          {mode === 'lobby' && challenger && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-5">
                <motion.div
                  animate={{ boxShadow: ['0 0 8px rgba(255,0,128,0.4)', '0 0 25px rgba(255,0,128,0.9)', '0 0 8px rgba(255,0,128,0.4)'] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="inline-block border-2 border-[#FF0080] px-4 py-1.5 mb-4"
                >
                  <p className="font-mono-arcade text-[9px] text-[#FF0080] tracking-widest">
                    ⚠ CHALLENGER LOCKED IN ⚠
                  </p>
                </motion.div>

                <p className="font-display text-4xl text-white mb-0.5">
                  {challenger.username}
                </p>
                <p className="font-mono-arcade text-[10px] text-[#555] tracking-widest">
                  HAS LOCKED IN A TOTAL SCORE OF
                </p>
                <p className="font-display text-7xl text-[#FFD700] text-glow-gold leading-tight">
                  {challenger.total}
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { l: 'GEO', v: challenger.stage1Score, c: '#00FFFF' },
                    { l: 'FLAGS', v: challenger.stage2Score, c: '#FFD700' },
                    { l: 'FEUD', v: challenger.stage3Score, c: '#FF0080' },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="border border-[#2A2A2A] p-2 text-center"
                    >
                      <p className="font-mono-arcade text-[8px] text-[#444] mb-0.5">{s.l}</p>
                      <p className="font-display text-2xl" style={{ color: s.c }}>{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="font-mono-arcade text-[9px] text-[#555] text-center tracking-widest mb-4">
                DO YOU ACCEPT THIS CHALLENGE, {name.toUpperCase() || 'PLAYER'}?
              </p>

              {error && (
                <p className="font-mono-arcade text-[9px] text-[#FF0080] mb-3 tracking-widest text-center">{error}</p>
              )}

              <motion.button
                type="button"
                onClick={handleConfirmChallenge}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94, y: 5 }}
                className="btn-arcade btn-magenta w-full py-4 text-sm"
              >
                ⚡ CONFIRM AND START
              </motion.button>
              <button
                type="button"
                onClick={() => { setMode('idle'); setChallenger(null); setError(''); setToken(''); }}
                className="w-full mt-2 py-2 font-mono-arcade text-[9px] text-[#333] tracking-widest uppercase hover:text-[#666] transition-all"
              >
                ← DECLINE CHALLENGE
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <TutorialModal
        isOpen={tutorialOpen}
        startStep={tutorialStart}
        onClose={closeTour}
      />
    </div>
  );
}

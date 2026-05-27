import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BookOpen } from 'lucide-react';

const encodeToken = (username, scores) => {
  try {
    const data = { u: username, s1: scores.stage1, s2: scores.stage2, s3: scores.stage3, t: scores.total, ts: Date.now() };
    return btoa(JSON.stringify(data));
  } catch {
    return '';
  }
};

const PB_KEY = 'gt-personal-best';

const loadBest = () => {
  try {
    const raw = localStorage.getItem(PB_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveBest = (name, total) => {
  try {
    localStorage.setItem(PB_KEY, JSON.stringify({ name, score: total, date: new Date().toISOString().slice(0, 10) }));
  } catch { /* ignore */ }
};

export default function ResultsScreen({ username, scores, challengerData, onPlayAgain, onOpenLibrary, onCongratsSound }) {
  const [copied, setCopied] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [prevBest, setPrevBest] = useState(null);

  const isVs = !!challengerData;
  const won = isVs && scores.total > challengerData.total;
  const lost = isVs && scores.total <= challengerData.total;

  useEffect(() => {
    if (!isVs || won) {
      const burst = (o) =>
        confetti({
          particleCount: 140,
          spread: 85,
          origin: o,
          colors: ['#FF0080', '#00FFFF', '#39FF14', '#FFD700', '#FFFFFF'],
        });
      burst({ y: 0.55, x: 0.4 });
      setTimeout(() => burst({ y: 0.5, x: 0.6 }), 250);
      if (onCongratsSound) onCongratsSound();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Personal best tracking (solo only) ── */
  useEffect(() => {
    if (isVs) return;
    const existing = loadBest();
    if (!existing || scores.total > existing.score) {
      setIsNewBest(true);
      saveBest(username, scores.total);
    } else {
      setPrevBest(existing);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const token = encodeToken(username, scores);

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Grid overlay */}
      <div className="fixed inset-0 arcade-grid-bg opacity-100 pointer-events-none" />

      {/* Defeat atmosphere */}
      {lost && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(180,0,0,0.18) 0%, transparent 70%)',
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 16 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* ── Result headline ── */}
        <div className="text-center mb-8">
          {isVs ? (
            won ? (
              <>
                <p className="font-mono-arcade text-[10px] text-[#39FF14] tracking-widest mb-2">
                  ⚡ VICTORY ACHIEVED ⚡
                </p>
                <div className="glitch-wrap inline-block">
                  <h1 className="font-display text-[clamp(3rem,12vw,5.5rem)] text-[#39FF14] text-glow-lime leading-none">
                    VICTORY
                  </h1>
                  <span className="glitch-layer-m font-display text-[clamp(3rem,12vw,5.5rem)] leading-none" aria-hidden="true">VICTORY</span>
                  <span className="glitch-layer-c font-display text-[clamp(3rem,12vw,5.5rem)] leading-none" aria-hidden="true">VICTORY</span>
                </div>
                <p className="font-display text-3xl text-white mt-1">
                  OVER {challengerData.username}
                </p>
              </>
            ) : (
              <>
                <p className="font-mono-arcade text-[10px] text-[#FF0080] tracking-widest mb-2">
                  ✗ SESSION TERMINATED ✗
                </p>
                <h1 className="font-display text-[clamp(3rem,12vw,5rem)] text-[#FF0080] text-glow-magenta leading-none">
                  DEFEATED
                </h1>
                <p className="font-display text-3xl text-white mt-1">
                  BY {challengerData.username}
                </p>
              </>
            )
          ) : (
            <>
              <p className="font-mono-arcade text-[10px] text-[#FFD700] tracking-widest mb-2">
                SESSION COMPLETE
              </p>
              <h1 className="font-display text-[clamp(2.5rem,10vw,5rem)] text-white leading-none">
                {username}
              </h1>
              <h2 className="font-display text-3xl text-[#FFD700] text-glow-gold mt-1">
                RESULTS LOCKED IN
              </h2>
            </>
          )}
        </div>

        {/* ── Score breakdown card ── */}
        <div
          className="arcade-card p-5 mb-4"
          style={{
            borderColor: isVs ? (won ? '#39FF14' : '#FF0080') : '#FFD700',
            borderWidth: '2px',
          }}
        >
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'GEO-GUESSR', val: scores.stage1, color: '#00FFFF' },
              { label: 'FLAG SORT', val: scores.stage2, color: '#FFD700' },
              { label: 'GLOBAL FEUD', val: scores.stage3, color: '#FF0080' },
            ].map((s) => (
              <div key={s.label} className="text-center border border-[#2A2A2A] p-2">
                <p className="font-mono-arcade text-[7px] text-[#444] tracking-widest mb-1">{s.label}</p>
                <p className="font-display text-3xl" style={{ color: s.color }}>
                  {s.val}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#2A2A2A] pt-4 text-center">
            <p className="font-mono-arcade text-[9px] text-[#555] mb-1 tracking-widest">YOUR TOTAL</p>
            <p className="font-display text-7xl text-[#FFD700] text-glow-gold leading-none">
              {scores.total}
            </p>

            {/* ── Personal best badge (solo only) ── */}
            {!isVs && (
              isNewBest ? (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', damping: 12 }}
                  className="font-mono-arcade text-[10px] tracking-widest mt-2 text-glow-gold"
                  style={{ color: '#FFD700' }}
                >
                  ★ NEW PERSONAL BEST ★
                </motion.p>
              ) : prevBest && (
                <p className="font-mono-arcade text-[9px] text-[#444] tracking-widest mt-2">
                  ◈ YOUR BEST: {prevBest.score} by {prevBest.name.toUpperCase()}
                </p>
              )
            )}
          </div>

          {isVs && (
            <div className="border-t border-[#2A2A2A] pt-4 mt-4 text-center">
              <p className="font-mono-arcade text-[9px] text-[#555] mb-1 tracking-widest">
                {challengerData.username}'S SCORE
              </p>
              <p
                className="font-display text-4xl"
                style={{ color: won ? '#FF0080' : '#39FF14' }}
              >
                {challengerData.total}
              </p>
              <p
                className="font-mono-arcade text-[10px] mt-1 tracking-widest"
                style={{ color: won ? '#39FF14' : '#FF0080' }}
              >
                {won
                  ? `▲ YOU WIN BY ${scores.total - challengerData.total} POINTS`
                  : `▼ LOST BY ${challengerData.total - scores.total} POINTS`}
              </p>
            </div>
          )}
        </div>

        {/* ── Solo: challenger token ── */}
        {!isVs && (
          <div
            className="arcade-card p-4 mb-4"
            style={{ borderColor: '#FFD700', borderWidth: '1px', borderStyle: 'dashed' }}
          >
            <p className="font-mono-arcade text-[9px] text-[#FFD700] tracking-widest mb-2 uppercase">
              ◈ CHALLENGE SOMEONE — SHARE THIS TOKEN
            </p>
            <div
              className="p-2 mb-3 font-mono-arcade text-[9px] text-[#555] break-all select-all cursor-text"
              style={{ background: '#0A0A0A', border: '1px solid #1A1A1A' }}
            >
              {token}
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.94, y: 5 }}
              onClick={handleCopy}
              className={`btn-arcade w-full py-3 ${copied ? 'btn-lime' : 'btn-gold'}`}
            >
              {copied ? '✓ COPIED TO CLIPBOARD!' : '⧉ COPY CHALLENGER TOKEN'}
            </motion.button>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.94, y: 5 }}
            onClick={onPlayAgain}
            className="btn-arcade btn-magenta flex-1 py-3"
          >
            ↺ PLAY AGAIN
          </motion.button>
          <button
            type="button"
            onClick={() => onOpenLibrary()}
            className="btn-arcade btn-ghost px-5 py-3 flex items-center gap-2 hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
          >
            <BookOpen size={13} />
            GRIMOIRE
          </button>
        </div>
      </motion.div>
    </div>
  );
}

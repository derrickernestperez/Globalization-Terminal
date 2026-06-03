import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronUp, Users } from 'lucide-react';

const DEVELOPERS = [
  {
    name: 'Delos Trinos, Cedric Vincent',
    nickname: 'Cedric',
    age: 22,
    globalizationForMeIs: 'Working with people from other places and learning from how they do things.',
    color: '#FF6B35',
    shadow: '0 0 18px rgba(255,107,53,0.45)',
  },
  {
    name: 'Gito, Rhic Emmanuel',
    nickname: 'Rhic',
    age: 21,
    globalizationForMeIs: 'Opening my phone and seeing the same apps, videos, and trends people use abroad.',
    color: '#00FFFF',
    shadow: '0 0 18px rgba(0,255,255,0.45)',
  },
  {
    name: 'Mallari, Russell Mark A.',
    nickname: 'Russell',
    age: 22,
    globalizationForMeIs: 'How one product can be designed here, built there, and sold almost anywhere.',
    color: '#FF0080',
    shadow: '0 0 18px rgba(255,0,128,0.45)',
  },
  {
    name: 'Ocubillo, Gypsy Brygxs',
    nickname: 'Gypsy',
    age: 23,
    globalizationForMeIs: 'When songs, shows, and styles from other countries become normal in daily life.',
    color: '#FFD700',
    shadow: '0 0 18px rgba(255,215,0,0.45)',
  },
  {
    name: 'Perez, Derrick Ernest',
    nickname: 'Derrick',
    age: 24,
    globalizationForMeIs: 'The world feels closer, but some countries still get more of the benefits than others.',
    color: '#39FF14',
    shadow: '0 0 18px rgba(57,255,20,0.45)',
  },
  {
    name: 'Relosa, John Carlo B.',
    nickname: 'Carlo',
    age: 22,
    globalizationForMeIs: 'Families sending money home from abroad just to keep everyday life going here.',
    color: '#BF5FFF',
    shadow: '0 0 18px rgba(191,95,255,0.45)',
  },
];

function nicknameInitials(nickname) {
  const parts = nickname.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nickname.slice(0, 2).toUpperCase();
}

function HexAvatar({ nickname, color, shadow }) {
  const initials = nicknameInitials(nickname);
  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: 80, height: 80 }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <polygon
          points="50,4 94,27 94,73 50,96 6,73 6,27"
          fill={`${color}10`}
          stroke={color}
          strokeWidth="2.5"
          style={{ filter: `drop-shadow(0 0 8px ${color}70)` }}
        />
        <polygon
          points="50,16 82,33 82,67 50,84 18,67 18,33"
          fill={`${color}08`}
          stroke={color}
          strokeWidth="1"
          opacity="0.4"
        />
      </svg>
      <span
        className="font-display text-[1.5rem] relative z-10 select-none"
        style={{ color, textShadow: shadow }}
      >
        {initials}
      </span>
    </div>
  );
}

const slideVariants = {
  enter: (d) => ({ opacity: 0, x: d * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -48 }),
};

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const goTo = (newIdx) => {
    setDir(newIdx > idx ? 1 : -1);
    setIdx(newIdx);
  };

  const prev = () => goTo((idx - 1 + DEVELOPERS.length) % DEVELOPERS.length);
  const next = () => goTo((idx + 1) % DEVELOPERS.length);

  const dev = DEVELOPERS[idx];

  return (
    <footer
      className="relative w-full"
      style={{ background: '#0A0A0A', borderTop: '2px solid #FF0080' }}
    >
      <div className="absolute inset-0 arcade-grid-bg opacity-30 pointer-events-none" />

      {/* ── Expandable developer carousel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="crew-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="relative px-4 pt-6 pb-4 max-w-md mx-auto"
              style={{ borderBottom: '1px solid #1E1E1E' }}
            >
              <p className="font-mono-arcade text-[9px] tracking-[0.3em] text-[#555] uppercase text-center mb-5">
                — Meet the Developers —
              </p>

              {/* Card viewport */}
              <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={idx}
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <div
                      className="arcade-card p-5 h-full flex flex-col items-center text-center"
                      style={{
                        borderColor: `${dev.color}40`,
                        borderWidth: '2px',
                        background: `linear-gradient(135deg, #111 60%, ${dev.color}08 100%)`,
                        boxShadow: `inset 0 0 40px ${dev.color}06`,
                      }}
                    >
                      <HexAvatar nickname={dev.nickname} color={dev.color} shadow={dev.shadow} />

                      <h3
                        className="font-display text-[1.25rem] mt-3 tracking-wide"
                        style={{ color: dev.color, textShadow: dev.shadow }}
                      >
                        {dev.name}
                      </h3>

                      <div className="flex items-center gap-3 mt-1.5 mb-3">
                        <span
                          className="font-mono-arcade text-[8px] tracking-widest px-2 py-0.5 uppercase"
                          style={{
                            color: dev.color,
                            border: `1px solid ${dev.color}50`,
                            background: `${dev.color}12`,
                          }}
                        >
                          {dev.nickname}
                        </span>
                        <span className="font-mono-arcade text-[8px] text-[#444] tracking-widest">
                          AGE {dev.age}
                        </span>
                      </div>

                      <p className="font-mono-arcade text-[9px] text-[#555] tracking-widest uppercase mb-1.5">
                        Globalization for me is
                      </p>
                      <p className="font-body text-[0.85rem] text-[#AAA] italic leading-relaxed max-w-[17rem]">
                        &ldquo;{dev.globalizationForMeIs}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between mt-4 gap-3">
                <button
                  type="button"
                  onClick={prev}
                  className="btn-arcade btn-ghost flex items-center gap-1 px-4 py-2 font-mono-arcade text-[9px] tracking-widest"
                >
                  <ChevronLeft size={11} /> PREV
                </button>

                <div className="flex items-center gap-2">
                  {DEVELOPERS.map((d, i) => (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Developer ${i + 1}`}
                      style={{
                        height: 6,
                        width: i === idx ? 20 : 6,
                        background: i === idx ? dev.color : '#2A2A2A',
                        boxShadow: i === idx ? dev.shadow : 'none',
                        transition: 'width 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={next}
                  className="btn-arcade btn-ghost flex items-center gap-1 px-4 py-2 font-mono-arcade text-[9px] tracking-widest"
                >
                  NEXT <ChevronRight size={11} />
                </button>
              </div>

              <p className="font-mono-arcade text-[8px] text-[#333] text-center mt-2 tracking-widest">
                {idx + 1} / {DEVELOPERS.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Compact credit bar + toggle button ── */}
      <div className="relative px-4 py-3 flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-4">
        {/* Project info */}
        <div className="text-center sm:text-left">
          <p className="font-mono-arcade text-[8px] tracking-[0.32em] text-[#FF0080] uppercase opacity-70 mb-0.5">
            ◈ Academic Submission ◈
          </p>
          <p className="font-display text-[clamp(0.85rem,2.8vw,1.1rem)] text-white tracking-widest uppercase leading-tight">
            A Project for{' '}
            <span className="text-[#FFD700] text-glow-gold">GNED 07</span>
            <span className="text-[#555]"> : </span>
            <span className="text-[#888]">The Contemporary World</span>
          </p>
        </div>

        {/* Eye-catching crew button */}
        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94, y: 3 }}
          animate={
            open
              ? {}
              : {
                  boxShadow: [
                    '0 4px 0 #8B0040, 0 0 12px rgba(255,0,128,0.3)',
                    '0 4px 0 #8B0040, 0 0 28px rgba(255,0,128,0.75)',
                    '0 4px 0 #8B0040, 0 0 12px rgba(255,0,128,0.3)',
                  ],
                }
          }
          transition={{ duration: 1.8, repeat: open ? 0 : Infinity, ease: 'easeInOut' }}
          className="shrink-0 btn-arcade btn-magenta flex items-center gap-2 px-5 py-2.5 text-[10px]"
          style={{ minWidth: 160 }}
        >
          {open ? (
            <>
              <ChevronUp size={12} />
              HIDE CREW
            </>
          ) : (
            <>
              <Users size={12} />
              ◈ MEET THE CREW ◈
            </>
          )}
        </motion.button>
      </div>

      {/* Bottom strip */}
      <div
        className="relative text-center py-2 px-4"
        style={{ borderTop: '1px solid #1A1A1A' }}
      >
        <p className="font-mono-arcade text-[7px] text-[#2A2A2A] tracking-[0.28em] uppercase">
          Globalization Terminal · GNED 07 · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

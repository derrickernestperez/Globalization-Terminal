import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DEVELOPERS = [
  {
    name: 'Gito, Rhic Emmanuel',
    initials: 'RE',
    age: 20,
    role: 'Frontend Developer',
    motto: '"The code is the map; the world is just data."',
    color: '#00FFFF',
    shadow: '0 0 18px rgba(0,255,255,0.45)',
  },
  {
    name: 'Mallari, Russell Mark A.',
    initials: 'RM',
    age: 21,
    role: 'Backend Developer',
    motto: '"Logic is the only language that never lies."',
    color: '#FF0080',
    shadow: '0 0 18px rgba(255,0,128,0.45)',
  },
  {
    name: 'Ocubillo, Gypsy Brygxs',
    initials: 'GB',
    age: 20,
    role: 'UI/UX Designer',
    motto: '"Good design speaks before you even click."',
    color: '#FFD700',
    shadow: '0 0 18px rgba(255,215,0,0.45)',
  },
  {
    name: 'Perez, Derrick Ernest',
    initials: 'DE',
    age: 22,
    role: 'Project Lead',
    motto: '"A team aligned always beats a genius alone."',
    color: '#39FF14',
    shadow: '0 0 18px rgba(57,255,20,0.45)',
  },
  {
    name: 'Relosa, John Carlo B.',
    initials: 'JC',
    age: 21,
    role: 'Full Stack Developer',
    motto: '"Build it. Break it. Fix it. Ship it."',
    color: '#BF5FFF',
    shadow: '0 0 18px rgba(191,95,255,0.45)',
  },
];

/* Hexagonal avatar using initials */
function HexAvatar({ initials, color, shadow }) {
  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: 88, height: 88 }}>
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
        className="font-display text-[1.6rem] relative z-10 select-none"
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
    <footer className="relative w-full" style={{ background: '#0A0A0A', borderTop: '2px solid #FF0080' }}>
      {/* Subtle grid — matches the rest of the app */}
      <div className="absolute inset-0 arcade-grid-bg opacity-40 pointer-events-none" />

      {/* ── Project credit banner ── */}
      <div
        className="relative text-center py-5 px-6"
        style={{ borderBottom: '1px solid #1E1E1E' }}
      >
        <p className="font-mono-arcade text-[9px] tracking-[0.35em] text-[#FF0080] uppercase mb-2 opacity-80">
          ◈ Academic Submission ◈
        </p>
        <p className="font-display text-[clamp(1rem,3.5vw,1.5rem)] text-white tracking-widest uppercase leading-tight">
          A Project for{' '}
          <span className="text-[#FFD700] text-glow-gold">GNED 07</span>
          <span className="text-[#888]"> : </span>
          The Contemporary World
        </p>
      </div>

      {/* ── Developer carousel ── */}
      <div className="relative px-4 pt-7 pb-8 max-w-md mx-auto">
        <p className="font-mono-arcade text-[9px] tracking-[0.3em] text-[#555] uppercase text-center mb-6">
          — Meet the Developers —
        </p>

        {/* Card viewport */}
        <div className="relative overflow-hidden" style={{ minHeight: 272 }}>
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
                className="arcade-card p-6 h-full flex flex-col items-center text-center"
                style={{
                  borderColor: `${dev.color}40`,
                  borderWidth: '2px',
                  background: `linear-gradient(135deg, #111 60%, ${dev.color}08 100%)`,
                  boxShadow: `inset 0 0 40px ${dev.color}06`,
                }}
              >
                <HexAvatar initials={dev.initials} color={dev.color} shadow={dev.shadow} />

                <h3
                  className="font-display text-[1.35rem] mt-4 tracking-wide"
                  style={{ color: dev.color, textShadow: dev.shadow }}
                >
                  {dev.name}
                </h3>

                <div className="flex items-center gap-3 mt-2 mb-4">
                  <span
                    className="font-mono-arcade text-[8px] tracking-widest px-2 py-0.5 uppercase"
                    style={{
                      color: dev.color,
                      border: `1px solid ${dev.color}50`,
                      background: `${dev.color}12`,
                    }}
                  >
                    {dev.role}
                  </span>
                  <span className="font-mono-arcade text-[8px] text-[#444] tracking-widest">
                    AGE {dev.age}
                  </span>
                </div>

                <p className="font-mono-arcade text-[10px] text-[#666] italic tracking-wide leading-relaxed max-w-[18rem]">
                  {dev.motto}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between mt-5 gap-3">
          <button
            type="button"
            onClick={prev}
            className="btn-arcade btn-ghost flex items-center gap-1 px-4 py-2 font-mono-arcade text-[9px] tracking-widest"
          >
            <ChevronLeft size={11} />
            PREV
          </button>

          {/* Dot indicators */}
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
            NEXT
            <ChevronRight size={11} />
          </button>
        </div>

        <p className="font-mono-arcade text-[8px] text-[#333] text-center mt-3 tracking-widest">
          {idx + 1} / {DEVELOPERS.length}
        </p>
      </div>

      {/* ── Bottom strip ── */}
      <div
        className="relative text-center py-3 px-4"
        style={{ borderTop: '1px solid #1A1A1A' }}
      >
        <p className="font-mono-arcade text-[8px] text-[#2E2E2E] tracking-[0.28em] uppercase">
          Globalization Terminal · GNED 07 · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

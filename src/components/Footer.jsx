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
  },
  {
    name: 'Mallari, Russell Mark A.',
    initials: 'RM',
    age: 21,
    role: 'Backend Developer',
    motto: '"Logic is the only language that never lies."',
    color: '#FF0080',
  },
  {
    name: 'Ocubillo, Gypsy Brygxs',
    initials: 'GB',
    age: 20,
    role: 'UI/UX Designer',
    motto: '"Good design speaks before you even click."',
    color: '#FFD700',
  },
  {
    name: 'Perez, Derrick Ernest',
    initials: 'DE',
    age: 22,
    role: 'Project Lead',
    motto: '"A team aligned always beats a genius alone."',
    color: '#39FF14',
  },
  {
    name: 'Relosa, John Carlo B.',
    initials: 'JC',
    age: 21,
    role: 'Full Stack Developer',
    motto: '"Build it. Break it. Fix it. Ship it."',
    color: '#BF5FFF',
  },
];

function HexAvatar({ initials, color }) {
  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <polygon
          points="50,4 94,27 94,73 50,96 6,73 6,27"
          fill="none"
          stroke={color}
          strokeWidth="2"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
        <polygon
          points="50,14 84,32.5 84,67.5 50,86 16,67.5 16,32.5"
          fill={`${color}12`}
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
      <span
        className="font-display text-2xl relative z-10 select-none"
        style={{ color, textShadow: `0 0 14px ${color}90` }}
      >
        {initials}
      </span>
    </div>
  );
}

export default function Footer() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const prev = () => {
    setDir(-1);
    setIdx((i) => (i - 1 + DEVELOPERS.length) % DEVELOPERS.length);
  };

  const next = () => {
    setDir(1);
    setIdx((i) => (i + 1) % DEVELOPERS.length);
  };

  const dev = DEVELOPERS[idx];

  return (
    <footer
      className="relative z-10 w-full mt-0"
      style={{ borderTop: '2px solid #1A1A1A', background: '#070707' }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)',
        }}
      />

      {/* ── Project credit ── */}
      <div
        className="relative text-center py-6 px-4"
        style={{ borderBottom: '1px solid #1A1A1A' }}
      >
        <p className="font-mono-arcade text-[9px] tracking-[0.3em] text-[#444] uppercase mb-1">
          ◈ Academic Submission
        </p>
        <h2 className="font-display text-[clamp(0.9rem,3vw,1.35rem)] text-white tracking-widest uppercase">
          A Project for{' '}
          <span
            className="text-[#FFD700]"
            style={{ textShadow: '0 0 10px #FFD70060' }}
          >
            GNED 07
          </span>
          : The Contemporary World
        </h2>
      </div>

      {/* ── Meet the Developers ── */}
      <div className="relative px-4 py-8 max-w-lg mx-auto">
        <p className="font-mono-arcade text-[9px] tracking-[0.3em] text-[#555] uppercase text-center mb-6">
          ◈ MEET THE DEVELOPERS ◈
        </p>

        <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              variants={{
                enter: (d) => ({ opacity: 0, x: d * 60 }),
                center: { opacity: 1, x: 0 },
                exit: (d) => ({ opacity: 0, x: d * -60 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <div
                className="rounded-none p-6 h-full flex flex-col items-center text-center"
                style={{
                  background: `${dev.color}08`,
                  border: `1px solid ${dev.color}30`,
                }}
              >
                <HexAvatar initials={dev.initials} color={dev.color} />

                <h3
                  className="font-display text-lg mt-4 tracking-wide"
                  style={{ color: dev.color, textShadow: `0 0 10px ${dev.color}50` }}
                >
                  {dev.name}
                </h3>

                <div className="flex items-center gap-3 mt-1 mb-3">
                  <span
                    className="font-mono-arcade text-[8px] tracking-widest px-2 py-0.5 uppercase"
                    style={{
                      color: dev.color,
                      border: `1px solid ${dev.color}40`,
                      background: `${dev.color}10`,
                    }}
                  >
                    {dev.role}
                  </span>
                  <span className="font-mono-arcade text-[8px] text-[#444] tracking-widest">
                    AGE {dev.age}
                  </span>
                </div>

                <p
                  className="font-mono-arcade text-[10px] text-[#666] leading-relaxed italic tracking-wide max-w-xs"
                  style={{ lineHeight: '1.7' }}
                >
                  {dev.motto}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Carousel controls ── */}
        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            type="button"
            onClick={prev}
            className="btn-arcade btn-ghost px-4 py-2 flex items-center gap-1 font-mono-arcade text-[9px] tracking-widest transition-all"
            style={{ borderColor: '#333' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = dev.color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#333')}
          >
            <ChevronLeft size={12} /> PREV
          </button>

          <div className="flex items-center gap-1.5">
            {DEVELOPERS.map((d, i) => (
              <button
                key={d.name}
                type="button"
                onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                className="transition-all rounded-none"
                style={{
                  width: i === idx ? 18 : 6,
                  height: 6,
                  background: i === idx ? dev.color : '#2A2A2A',
                  boxShadow: i === idx ? `0 0 6px ${dev.color}80` : 'none',
                }}
                aria-label={`Go to developer ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="btn-arcade btn-ghost px-4 py-2 flex items-center gap-1 font-mono-arcade text-[9px] tracking-widest transition-all"
            style={{ borderColor: '#333' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = dev.color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#333')}
          >
            NEXT <ChevronRight size={12} />
          </button>
        </div>

        <p className="font-mono-arcade text-[8px] text-[#2A2A2A] text-center mt-3 tracking-widest">
          {idx + 1} / {DEVELOPERS.length}
        </p>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="text-center py-3 px-4"
        style={{ borderTop: '1px solid #111' }}
      >
        <p className="font-mono-arcade text-[8px] text-[#222] tracking-[0.25em] uppercase">
          Globalization Terminal · GNED 07 · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

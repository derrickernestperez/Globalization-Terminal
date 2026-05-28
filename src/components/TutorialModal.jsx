import { AnimatePresence, motion } from 'framer-motion';
import { Flag, Globe2, Users, X } from 'lucide-react';

const STAGES = [
  {
    icon: Globe2,
    label: 'STAGE 01',
    name: 'GEO-GUESSR',
    color: '#00FFFF',
    steps: [
      'Read the clue and drop a pin on the globe.',
      'Drag to rotate · scroll or +/- to zoom.',
      'Pin the correct country for a perfect score.',
      '30 seconds per clue · 4 clues total.',
    ],
  },
  {
    icon: Flag,
    label: 'STAGE 02',
    name: 'FLAG SORT',
    color: '#FFD700',
    steps: [
      'A country flag appears on screen.',
      'Sort it into CORE, SEMI, or PERIPHERY.',
      'Uses World-Systems Theory from class.',
      '10 flags · 50 pts each correct sort.',
    ],
  },
  {
    icon: Users,
    label: 'STAGE 03',
    name: 'GLOBAL FEUD',
    color: '#FF0080',
    steps: [
      '8 questions · 2-minute clock.',
      'Type an answer and hit SUBMIT.',
      'Get one right → jumps to the next unanswered Q.',
      'PASS skips ahead · skipped Qs come back later.',
    ],
  },
];

export default function TutorialModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center p-3 sm:p-5"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.88, y: 36 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.88, y: 36 }}
            transition={{ type: 'spring', damping: 20 }}
            className="arcade-card w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            style={{ borderColor: '#FF0080', borderWidth: '2px' }}
          >
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
              style={{ background: '#0A0A0A', borderBottom: '1px solid #2A2A2A' }}
            >
              <div>
                <p className="font-mono-arcade text-[9px] text-[#FF0080] tracking-[0.35em] uppercase">
                  ◈ Mission Briefing
                </p>
                <h2 className="font-display text-2xl text-white tracking-wide">HOW TO PLAY</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-arcade btn-ghost p-2"
                aria-label="Close tutorial"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div
                className="arcade-card p-4"
                style={{ borderColor: '#39FF14', borderWidth: '1px' }}
              >
                <p className="font-mono-arcade text-[9px] text-[#39FF14] tracking-widest mb-2 uppercase">
                  ▶ Getting Started
                </p>
                <ul className="space-y-1.5 text-xs text-[#888]">
                  <li className="flex gap-2"><span className="text-[#39FF14]">▸</span>Enter your call sign, then choose <strong className="text-[#39FF14]">PLAY SOLO</strong> or <strong className="text-[#00FFFF]">◈ CHALLENGER</strong>.</li>
                  <li className="flex gap-2"><span className="text-[#39FF14]">▸</span>Complete all 3 stages to lock in your total score.</li>
                  <li className="flex gap-2"><span className="text-[#39FF14]">▸</span>Open the <strong className="text-[#FFD700]">GRIMOIRE</strong> anytime to review course PDFs.</li>
                </ul>
              </div>

              {STAGES.map((s) => (
                <div
                  key={s.name}
                  className="arcade-card p-4"
                  style={{ borderColor: s.color, borderWidth: '2px' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <s.icon size={20} style={{ color: s.color }} />
                    <div>
                      <p className="font-mono-arcade text-[7px] tracking-widest opacity-50">{s.label}</p>
                      <p className="font-display text-lg leading-none" style={{ color: s.color }}>{s.name}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {s.steps.map((step) => (
                      <li key={step} className="flex gap-2 text-xs text-[#777] leading-snug">
                        <span style={{ color: s.color }}>▸</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div
                className="arcade-card p-4"
                style={{ borderColor: '#FFD700', borderWidth: '1px', borderStyle: 'dashed' }}
              >
                <p className="font-mono-arcade text-[9px] text-[#FFD700] tracking-widest mb-2 uppercase">
                  ◈ Challenge a Friend
                </p>
                <ul className="space-y-1.5 text-xs text-[#888]">
                  <li className="flex gap-2"><span className="text-[#FFD700]">▸</span>After solo play, tap <strong className="text-[#FFD700]">COPY CODE</strong> on the results screen.</li>
                  <li className="flex gap-2"><span className="text-[#FFD700]">▸</span>Send the code to a friend via Messenger, FB, or Viber.</li>
                  <li className="flex gap-2"><span className="text-[#FFD700]">▸</span>They open the game → <strong className="text-[#00FFFF]">◈ CHALLENGER</strong> → paste the code → beat your score.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 pt-0">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94, y: 5 }}
                onClick={onClose}
                className="btn-arcade btn-lime w-full py-3"
              >
                ▶ GOT IT — LET&apos;S PLAY
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

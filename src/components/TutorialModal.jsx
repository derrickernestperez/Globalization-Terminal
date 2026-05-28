import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const TOUR_STEPS = [
  {
    target: null,
    color: '#FF0080',
    label: 'WELCOME',
    title: 'GLOBALIZATION TERMINAL',
    lines: [
      'This quick tour walks you through all 3 stages.',
      'Tap NEXT to spotlight each part of the game.',
      'Takes less than a minute — let\'s go.',
    ],
  },
  {
    target: 'tour-stage-geo',
    color: '#00FFFF',
    label: 'STAGE 01',
    title: 'GEO-GUESSR',
    lines: [
      'Read the clue and drop a pin on the globe.',
      'Drag to rotate · scroll or +/- to zoom.',
      'Pin the correct country for a perfect score.',
      '30 seconds per clue · 4 clues total.',
    ],
  },
  {
    target: 'tour-stage-flag',
    color: '#FFD700',
    label: 'STAGE 02',
    title: 'FLAG SORT',
    lines: [
      'A country flag appears on screen.',
      'Sort it into CORE, SEMI, or PERIPHERY.',
      'Uses World-Systems Theory from class.',
      '10 flags · 50 pts each correct sort.',
    ],
  },
  {
    target: 'tour-stage-feud',
    color: '#FF0080',
    label: 'STAGE 03',
    title: 'GLOBAL FEUD',
    lines: [
      '8 questions · 2-minute clock.',
      'Type an answer and hit SUBMIT.',
      'Get one right → jumps to the next unanswered Q.',
      'PASS skips ahead · skipped Qs come back later.',
    ],
  },
  {
    target: 'tour-form',
    color: '#39FF14',
    label: 'GET STARTED',
    title: 'YOUR CALL SIGN',
    lines: [
      'Enter your name, then choose PLAY SOLO.',
      'Complete all 3 stages to lock in your score.',
      'Your personal best saves on this device.',
    ],
  },
  {
    target: 'tour-challenger',
    color: '#00FFFF',
    label: 'CHALLENGER',
    title: 'BEAT A FRIEND',
    lines: [
      'After solo play, copy your challenge code.',
      'Send it via Messenger, FB, or Viber.',
      'Friend pastes it here in ◈ CHALLENGER mode.',
    ],
  },
  {
    target: 'tour-grimoire',
    color: '#FFD700',
    label: 'GRIMOIRE',
    title: 'STUDY DOSSIER',
    lines: [
      'Open the Grimoire anytime during the game.',
      'Review course PDFs tied to each stage.',
      'Use it to prep before you play.',
    ],
  },
];

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

export default function TutorialModal({ isOpen, onClose, startStep = 0 }) {
  const [step, setStep] = useState(startStep);
  const [spot, setSpot] = useState(null);

  const current = TOUR_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;

  const measureTarget = useCallback(() => {
    if (!current.target) {
      setSpot(null);
      return;
    }
    const el = document.getElementById(current.target);
    if (!el) {
      setSpot(null);
      return;
    }
    const pad = 10;
    const r = el.getBoundingClientRect();
    setSpot({
      top: r.top - pad,
      left: r.left - pad,
      width: r.width + pad * 2,
      height: r.height + pad * 2,
    });
  }, [current.target]);

  useEffect(() => {
    if (!isOpen) return undefined;
    setStep(startStep);
  }, [isOpen, startStep]);

  useEffect(() => {
    if (!isOpen) return undefined;

    if (current.target) {
      const el = document.getElementById(current.target);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    measureTarget();
    const t1 = setTimeout(measureTarget, 350);
    const t2 = setTimeout(measureTarget, 700);

    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
    };
  }, [isOpen, step, measureTarget, current.target]);

  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const next = () => {
    if (isLast) onClose();
    else setStep((s) => s + 1);
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  /* Tooltip position */
  const tooltipStyle = (() => {
    if (!spot) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(92vw, 22rem)',
      };
    }
    const cardH = 260;
    const gap = 16;
    const vw = window.innerWidth;
    const cardW = Math.min(vw - 24, 360);
    let top = spot.top + spot.height + gap;
    if (top + cardH > window.innerHeight - 12) {
      top = spot.top - cardH - gap;
    }
    top = clamp(top, 12, window.innerHeight - cardH - 12);
    const left = clamp(spot.left + spot.width / 2 - cardW / 2, 12, vw - cardW - 12);
    return { top, left, width: cardW, transform: 'none' };
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200]"
        >
          {/* Full dim or spotlight cutout */}
          {spot ? (
            <motion.div
              key={`spot-${step}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="fixed pointer-events-none rounded-lg"
              style={{
                top: spot.top,
                left: spot.left,
                width: spot.width,
                height: spot.height,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.88)',
                border: `2px solid ${current.color}`,
                zIndex: 201,
              }}
            />
          ) : (
            <div className="fixed inset-0 bg-black/88" style={{ zIndex: 201 }} />
          )}

          {/* Step card */}
          <motion.div
            key={`card-${step}`}
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed z-[202] arcade-card p-4"
            style={{
              ...tooltipStyle,
              borderColor: current.color,
              borderWidth: '2px',
              boxShadow: `0 0 30px ${current.color}33, 0 20px 60px rgba(0,0,0,0.9)`,
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p
                  className="font-mono-arcade text-[8px] tracking-[0.35em] uppercase mb-1"
                  style={{ color: current.color }}
                >
                  ◈ Step {step + 1} / {TOUR_STEPS.length} · {current.label}
                </p>
                <h3 className="font-display text-2xl text-white tracking-wide leading-none">
                  {current.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-arcade btn-ghost p-1.5 shrink-0"
                aria-label="Skip tour"
              >
                <X size={14} />
              </button>
            </div>

            <ul className="space-y-2 mb-4">
              {current.lines.map((line) => (
                <li key={line} className="flex gap-2 text-xs text-[#888] leading-snug">
                  <span style={{ color: current.color }} className="shrink-0">▸</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mb-4">
              {TOUR_STEPS.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setStep(i)}
                  aria-label={`Go to step ${i + 1}`}
                  style={{
                    width: i === step ? 18 : 6,
                    height: 6,
                    background: i === step ? current.color : '#2A2A2A',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'width 0.2s ease, background 0.2s ease',
                  }}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {!isFirst ? (
                <button
                  type="button"
                  onClick={back}
                  className="btn-arcade btn-ghost flex items-center gap-1 px-4 py-2.5 text-[10px]"
                >
                  <ChevronLeft size={12} /> BACK
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-arcade btn-ghost px-4 py-2.5 text-[10px]"
                >
                  SKIP
                </button>
              )}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94, y: 4 }}
                onClick={next}
                className="btn-arcade btn-lime flex-1 py-2.5 flex items-center justify-center gap-1 text-[10px]"
              >
                {isLast ? '▶ START PLAYING' : (
                  <>NEXT <ChevronRight size={12} /></>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { TOUR_STEPS };

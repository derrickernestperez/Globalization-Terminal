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
    target: 'tour-call-sign',
    color: '#39FF14',
    label: 'GET STARTED',
    title: 'ENTER YOUR NAME',
    lines: [
      'Type your call sign in the box below.',
      'Then hit PLAY SOLO to start the run.',
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
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 640,
  );

  const current = TOUR_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;
  const isCentered = !current.target || isMobile;

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
    const pad = isMobile ? 6 : 10;
    const r = el.getBoundingClientRect();
    setSpot({
      top: r.top - pad,
      left: r.left - pad,
      width: r.width + pad * 2,
      height: r.height + pad * 2,
    });
  }, [current.target, isMobile]);

  useEffect(() => {
    if (!isOpen) return undefined;
    setStep(startStep);
  }, [isOpen, startStep]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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

  /* Elevate highlighted target above blur overlay */
  useEffect(() => {
    if (!isOpen || !current.target || isMobile) return undefined;
    const el = document.getElementById(current.target);
    if (!el) return undefined;
    const prev = {
      position: el.style.position,
      zIndex: el.style.zIndex,
      boxShadow: el.style.boxShadow,
    };
    el.style.position = 'relative';
    el.style.zIndex = '203';
    el.style.boxShadow = `0 0 0 3px ${current.color}, 0 0 24px ${current.color}55`;
    return () => {
      el.style.position = prev.position;
      el.style.zIndex = prev.zIndex;
      el.style.boxShadow = prev.boxShadow;
    };
  }, [isOpen, step, current.target, current.color, isMobile]);

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

  const tooltipStyle = (() => {
    const cardW = Math.min(
      typeof window !== 'undefined' ? window.innerWidth - 24 : 360,
      360,
    );

    if (isCentered && isFirst) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: cardW,
      };
    }

    if (isMobile) {
      return {
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: cardW,
        top: 'auto',
      };
    }

    if (!spot) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: cardW,
      };
    }

    const cardH = 280;
    const gap = 16;
    const vw = window.innerWidth;
    let top = spot.top + spot.height + gap;
    if (top + cardH > window.innerHeight - 12) {
      top = spot.top - cardH - gap;
    }
    top = clamp(top, 72, window.innerHeight - cardH - 12);
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
          {/* Blurred backdrop — always on */}
          <div
            className="fixed inset-0 z-[201] backdrop-blur-md"
            style={{ background: 'rgba(0,0,0,0.72)' }}
          />

          {/* Desktop spotlight cutout (skip on welcome + mobile) */}
          {spot && !isMobile && (
            <motion.div
              key={`spot-${step}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="fixed pointer-events-none rounded-lg z-[202]"
              style={{
                top: spot.top,
                left: spot.left,
                width: spot.width,
                height: spot.height,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                border: `2px solid ${current.color}`,
              }}
            />
          )}

          {/* Step card */}
          <motion.div
            key={`card-${step}`}
            initial={{ opacity: 0, y: isCentered && isFirst ? 0 : 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed z-[204] arcade-card p-4 sm:p-5 max-h-[85vh] overflow-y-auto"
            style={{
              ...tooltipStyle,
              borderColor: current.color,
              borderWidth: '2px',
              boxShadow: `0 0 30px ${current.color}33, 0 20px 60px rgba(0,0,0,0.9)`,
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p
                  className="font-mono-arcade text-[8px] sm:text-[9px] tracking-[0.3em] uppercase mb-1"
                  style={{ color: current.color }}
                >
                  ◈ Step {step + 1} / {TOUR_STEPS.length} · {current.label}
                </p>
                <h3 className="font-display text-xl sm:text-2xl text-white tracking-wide leading-none">
                  {current.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-arcade btn-ghost p-1.5 shrink-0"
                aria-label="Close tour"
              >
                <X size={14} />
              </button>
            </div>

            <ul className="space-y-2 mb-4">
              {current.lines.map((line) => (
                <li key={line} className="flex gap-2 text-[11px] sm:text-xs text-[#AAA] leading-snug">
                  <span style={{ color: current.color }} className="shrink-0">▸</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

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
                  className="btn-arcade btn-ghost flex items-center gap-1 px-3 sm:px-4 py-2.5 text-[9px] sm:text-[10px]"
                >
                  <ChevronLeft size={12} /> BACK
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-arcade btn-ghost px-3 sm:px-4 py-2.5 text-[9px] sm:text-[10px]"
                >
                  SKIP
                </button>
              )}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94, y: 4 }}
                onClick={next}
                className="btn-arcade btn-lime flex-1 py-2.5 flex items-center justify-center gap-1 text-[9px] sm:text-[10px]"
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

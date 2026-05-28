import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const MOBILE_QUERY = '(max-width: 639px)';

/** Stage preview cards — pin tour card to bottom on desktop so it clears the stage row */
const STAGE_TOUR_TARGETS = new Set(['tour-stage-geo', 'tour-stage-flag', 'tour-stage-feud']);

const TOUR_Z = {
  overlay: 500,
  backdrop: 501,
  spotlight: 502,
  card: 503,
};

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
    mobileLine: 'Quick tour of all 3 stages — tap NEXT, takes under a minute.',
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
    mobileLine: 'Drop a pin on the globe · drag/zoom · 100 pts if correct · 30s × 4 clues.',
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
    mobileLine: 'Sort each flag into CORE, SEMI, or PERIPHERY · 10 flags · 50 pts each.',
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
    mobileLine: '8 Qs · 2-min clock · SUBMIT answers · PASS skips · skipped Qs return.',
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
    mobileLine: 'Enter your call sign · hit PLAY SOLO · personal best saves locally.',
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
    mobileLine: 'Copy your challenge code after solo · friend pastes it in CHALLENGER.',
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
    mobileLine: 'Open the Grimoire anytime · review course PDFs before you play.',
  },
];

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

export default function TutorialModal({ isOpen, onClose, startStep = 0 }) {
  const [step, setStep] = useState(startStep);
  const [spot, setSpot] = useState(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

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
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    if (current.target && !isMobile) {
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
  }, [isOpen, step, measureTarget, current.target, isMobile]);

  /* Subtle ring on target — no z-index (page z-index would paint above the portal) */
  useEffect(() => {
    if (!isOpen || !current.target || isMobile) return undefined;
    const el = document.getElementById(current.target);
    if (!el) return undefined;
    const prev = { boxShadow: el.style.boxShadow };
    el.style.boxShadow = `0 0 0 2px ${current.color}88`;
    return () => { el.style.boxShadow = prev.boxShadow; };
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

  /* Desktop-only anchored position (mobile uses flex bottom sheet) */
  const desktopStyle = (() => {
    if (isMobile) return null;

    const cardW = Math.min(window.innerWidth - 24, 360);

    if (!current.target) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: cardW,
      };
    }

    if (!spot) return null;

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

  const useMobileSheet = isMobile;
  const isStageStep = current.target && STAGE_TOUR_TARGETS.has(current.target);
  const useDesktopCenter = !isMobile && !current.target;
  const useDesktopStageBottom = !isMobile && isStageStep;
  const useDesktopAnchored = !isMobile && current.target && !isStageStep;

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0"
          style={{ zIndex: TOUR_Z.overlay }}
          role="dialog"
          aria-modal="true"
          aria-label="How to play tour"
        >
          {/* Dim + blur backdrop */}
          <div
            className={`fixed inset-0 ${isMobile ? 'backdrop-blur-md' : ''}`}
            style={{ zIndex: TOUR_Z.backdrop, background: isMobile ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.78)' }}
          />

          {/* Desktop spotlight frame — drawn inside portal so it never covers the tour card */}
          {spot && !isMobile && current.target && (
            <motion.div
              key={`spot-${step}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed pointer-events-none rounded-lg"
              style={{
                zIndex: TOUR_Z.spotlight,
                top: spot.top,
                left: spot.left,
                width: spot.width,
                height: spot.height,
                border: `3px solid ${current.color}`,
                boxShadow: `0 0 28px ${current.color}55, inset 0 0 20px ${current.color}15`,
              }}
            />
          )}

          {/* Step card — mobile: bottom sheet; desktop: bottom / center / anchored */}
          <div
            className={
              useMobileSheet
                ? 'fixed inset-x-0 bottom-0 flex justify-center px-3 pt-2 pointer-events-none'
                : useDesktopStageBottom
                  ? 'fixed inset-x-0 bottom-0 flex justify-center px-3 pb-10 pointer-events-none'
                  : useDesktopCenter
                    ? 'fixed inset-0 flex items-center justify-center px-3 pointer-events-none'
                    : 'fixed inset-0 pointer-events-none'
            }
            style={{
              zIndex: TOUR_Z.card,
              ...(useMobileSheet
                ? { paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }
                : undefined),
            }}
          >
            <motion.div
              key={`card-${step}`}
              initial={{ opacity: 0, y: (useMobileSheet || useDesktopStageBottom) ? 24 : 0, scale: (useMobileSheet || useDesktopStageBottom) ? 1 : 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: (useMobileSheet || useDesktopStageBottom) ? 16 : 0, scale: (useMobileSheet || useDesktopStageBottom) ? 1 : 0.96 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              className="pointer-events-auto arcade-card p-4 sm:p-5 w-full max-w-sm max-h-[min(70vh,520px)] overflow-y-auto box-border"
              style={{
                ...(useMobileSheet || useDesktopCenter || useDesktopStageBottom ? {} : desktopStyle),
                background: '#111111',
                borderColor: current.color,
                borderWidth: '2px',
                boxShadow: `0 0 30px ${current.color}33, 0 20px 60px rgba(0,0,0,0.9)`,
                maxWidth: useMobileSheet || useDesktopStageBottom ? 'min(100%, 24rem)' : undefined,
                ...(useDesktopAnchored && !useDesktopCenter ? { position: 'fixed' } : {}),
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

            {isMobile ? (
              <p className="font-mono-arcade text-[6px] leading-[1.35] text-[#AAA] mb-3 tracking-[0.01em]">
                <span style={{ color: current.color }}>▸ </span>
                {current.mobileLine ?? current.lines.join(' · ')}
              </p>
            ) : (
              <ul className="space-y-2 mb-4">
                {current.lines.map((line) => (
                  <li key={line} className="flex gap-2 text-[11px] sm:text-xs text-[#AAA] leading-snug">
                    <span style={{ color: current.color }} className="shrink-0">▸</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}

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

            <div className="flex gap-2 min-w-0">
              {!isFirst ? (
                <button
                  type="button"
                  onClick={back}
                  className="btn-arcade btn-ghost flex items-center gap-1 px-3 sm:px-4 py-2.5 text-[9px] sm:text-[10px] shrink-0"
                >
                  <ChevronLeft size={12} /> BACK
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-arcade btn-ghost px-3 sm:px-4 py-2.5 text-[9px] sm:text-[10px] shrink-0"
                >
                  SKIP
                </button>
              )}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94, y: 4 }}
                onClick={next}
                className="btn-arcade btn-lime flex-1 min-w-0 py-2.5 flex items-center justify-center gap-1 text-[9px] sm:text-[10px]"
              >
                {isLast ? '▶ START PLAYING' : (
                  <>NEXT <ChevronRight size={12} /></>
                )}
              </motion.button>
            </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}

export { TOUR_STEPS };

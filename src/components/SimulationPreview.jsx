import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { feudQuestionPool, flagCountryPool, geoFlowPrompts, stageRecaps } from '../data/gameData.js';
import useSound from '../hooks/useSound.js';

/* ─────────────── Constants ─────────────── */
const GEO_GUESSES = 4;
const FLAGS_COUNT = 10;
const GEO_TIMER_SEC = 30;
const FEUD_TIMER_SEC = 120;

const WORLD_ATLAS_URL = 'https://unpkg.com/world-atlas@2.0.2/land-110m.json';

/* ─────────────── Helpers ─────────────── */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function geoPoints(dist) {
  if (dist < 400) return 100;
  if (dist < 1200) return 75;
  if (dist < 3500) return 45;
  return 10;
}

/* Country label look-up for globe pins */
const COUNTRY_HINTS = [
  { n: 'Philippines', lat: 12.88, lng: 121.77 },
  { n: 'South Korea', lat: 35.91, lng: 127.77 },
  { n: 'Bangladesh', lat: 23.68, lng: 90.36 },
  { n: 'Netherlands', lat: 52.13, lng: 5.29 },
  { n: 'United States', lat: 37.09, lng: -95.71 },
  { n: 'Switzerland', lat: 46.82, lng: 8.23 },
  { n: 'China', lat: 35.86, lng: 104.20 },
  { n: 'India', lat: 20.59, lng: 78.96 },
  { n: 'Brazil', lat: -14.24, lng: -51.93 },
  { n: 'Nigeria', lat: 9.08, lng: 8.68 },
  { n: 'Germany', lat: 51.17, lng: 10.45 },
  { n: 'Russia', lat: 61.52, lng: 105.32 },
  { n: 'Australia', lat: -25.27, lng: 133.78 },
  { n: 'Japan', lat: 36.20, lng: 138.25 },
  { n: 'United Kingdom', lat: 55.38, lng: -3.44 },
  { n: 'France', lat: 46.23, lng: 2.21 },
  { n: 'Mexico', lat: 23.63, lng: -102.55 },
  { n: 'Argentina', lat: -38.42, lng: -63.62 },
  { n: 'Indonesia', lat: -0.79, lng: 113.92 },
  { n: 'Egypt', lat: 26.82, lng: 30.80 },
];

function nearestCountry(lat, lng) {
  let best = COUNTRY_HINTS[0];
  let minD = Infinity;
  for (const c of COUNTRY_HINTS) {
    const d = haversine(lat, lng, c.lat, c.lng);
    if (d < minD) { minD = d; best = c; }
  }
  return best.n;
}

/* Decode world-atlas topojson → array of [lng,lat][] polygon rings */
function decodeTopojson(topo) {
  const sc = topo.transform?.scale ?? [1, 1];
  const tr = topo.transform?.translate ?? [0, 0];
  const rings = [];
  const decodeArc = (idx) => {
    const rev = idx < 0;
    const arc = topo.arcs[rev ? ~idx : idx];
    let x = 0, y = 0;
    const pts = arc.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * sc[0] + tr[0], y * sc[1] + tr[1]];
    });
    return rev ? pts.reverse() : pts;
  };
  for (const geo of topo.objects.land.geometries) {
    const polys = geo.type === 'Polygon' ? [geo.arcs] : geo.arcs;
    for (const poly of polys) {
      for (const ringArcs of poly) {
        rings.push(ringArcs.flatMap(decodeArc));
      }
    }
  }
  return rings;
}

/* ═══════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════ */

/* ── Globe Board ── */
function GlobeBoard({ onPin, pinned, revealTarget }) {
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(-8);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const inertiaRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const ringsRef = useRef(null); // decoded topojson rings

  /* Fetch world atlas topojson once */
  useEffect(() => {
    fetch(WORLD_ATLAS_URL)
      .then((r) => r.json())
      .then((topo) => { ringsRef.current = decodeTopojson(topo); })
      .catch(() => { ringsRef.current = []; });
  }, []);

  /* Draw continents on canvas whenever rotation or zoom changes */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rings = ringsRef.current;
    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    /* Wait for data — schedule a redraw once it arrives */
    if (!rings) {
      const id = setTimeout(() => {
        if (ringsRef.current) {
          const c2 = canvasRef.current;
          if (!c2) return;
          const ctx2 = c2.getContext('2d');
          ctx2.clearRect(0, 0, c2.width, c2.height);
          drawRings(ctx2, ringsRef.current, rotY, rotX, zoom, c2.width, c2.height);
        }
      }, 150);
      return () => clearTimeout(id);
    }

    drawRings(ctx, rings, rotY, rotX, zoom, W, H);
  }, [rotY, rotX, zoom]);

  /* Auto-rotate & inertia */
  useEffect(() => {
    if (dragging) return undefined;
    const spin = setInterval(() => setRotY((r) => r + 0.15), 40);
    return () => clearInterval(spin);
  }, [dragging]);

  useEffect(() => {
    if (dragging) return undefined;
    const { x, y } = inertiaRef.current;
    if (Math.abs(x) < 0.05 && Math.abs(y) < 0.05) return undefined;
    frameRef.current = requestAnimationFrame(() => {
      setRotY((r) => r + x);
      setRotX((r) => Math.max(-65, Math.min(65, r + y)));
      inertiaRef.current = { x: x * 0.88, y: y * 0.88 };
    });
    return () => cancelAnimationFrame(frameRef.current);
  }, [dragging, rotY, rotX]);

  const startDrag = (cx, cy) => {
    setDragging(true);
    dragRef.current = { cx, cy };
    inertiaRef.current = { x: 0, y: 0 };
  };
  const moveDrag = (cx, cy) => {
    if (!dragging || !dragRef.current) return;
    const dx = (cx - dragRef.current.cx) * 0.32;
    const dy = (cy - dragRef.current.cy) * 0.32;
    inertiaRef.current = { x: dx, y: dy };
    setRotY((r) => r + dx);
    setRotX((r) => Math.max(-65, Math.min(65, r + dy)));
    dragRef.current = { cx, cy };
  };
  const stopDrag = () => { setDragging(false); dragRef.current = null; };

  /* Click on sphere → lat/lng via inverse orthographic projection */
  const handleClick = (e) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const R  = Math.min(rect.width, rect.height) / 2 - 2;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const nx = (e.clientX - rect.left  - cx) / R; /* normalised -1..1 */
    const ny = (e.clientY - rect.top   - cy) / R;
    if (nx * nx + ny * ny > 1) return; /* outside sphere */

    /* Sphere surface z (front hemisphere) */
    const z3 = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    /* x3 = nx, y3 = -ny in screen coords */
    const x3 =  nx;
    const y3 = -ny;

    /* Inverse tilt rotation */
    const tilt   = rotX * Math.PI / 180;
    const y3pre  = y3 * Math.cos(tilt) - z3 * Math.sin(tilt);
    const z3pre  = y3 * Math.sin(tilt) + z3 * Math.cos(tilt);

    const lat = Math.asin(Math.max(-1, Math.min(1, y3pre))) * 180 / Math.PI;
    const lng = ((Math.atan2(x3, z3pre) * 180 / Math.PI + rotY + 540) % 360) - 180;
    onPin({ lat, lng, label: nearestCountry(lat, lng) });
  };

  /* Project lat/lng → % position on the globe div (for pin markers) */
  const project = (lat, lng) => {
    const { x: px, y: py } = orthoProject(lng, lat, rotY, rotX, 47, 50, 50);
    return { x: px, y: py };
  };

  return (
    <div className="relative mx-auto" style={{ width: '100%', maxWidth: '390px', aspectRatio: '1' }}>
      {/* Zoom controls */}
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1">
        {[['＋', 1.28], ['－', 0.78]].map(([lbl, f]) => (
          <button
            key={lbl}
            type="button"
            onClick={() => setZoom((z) => Math.max(1, Math.min(2.4, z * f)))}
            className="w-8 h-8 font-mono-arcade text-[#00FFFF] text-sm flex items-center justify-center transition-all"
            style={{
              background: 'rgba(0,0,0,0.75)',
              border: '1px solid rgba(0,255,255,0.4)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,255,255,0.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Globe sphere */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Interactive globe — click to place pin"
        className="w-full h-full rounded-full overflow-hidden cursor-crosshair select-none"
        style={{
          background: 'radial-gradient(circle at 38% 35%, #0A1F3A 0%, #040C18 60%, #020810 100%)',
          border: '2px solid rgba(255,0,128,0.35)',
          boxShadow:
            '0 0 40px rgba(255,0,128,0.25), 0 0 80px rgba(0,0,0,0.9), inset 0 0 50px rgba(0,0,0,0.6)',
        }}
        onClick={handleClick}
        onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
        onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); }}
        onTouchEnd={stopDrag}
        onWheel={(e) => setZoom((z) => Math.max(1, Math.min(2.4, z - e.deltaY * 0.001)))}
        onKeyDown={(e) => {
          if (e.key === '+') setZoom((z) => Math.min(2.4, z * 1.2));
          if (e.key === '-') setZoom((z) => Math.max(1, z * 0.8));
        }}
      >
        {/* Canvas map layer */}
        <canvas
          ref={canvasRef}
          width={390}
          height={390}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ mixBlendMode: 'screen', opacity: 0.92 }}
        />

        {/* Atmosphere gradient */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 33% 30%, rgba(0,60,120,0.15) 0%, rgba(0,8,22,0.45) 65%, rgba(0,0,0,0.82) 100%)',
          }}
        />
        {/* Latitude/longitude grid */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            opacity: 0.12,
            backgroundImage:
              'repeating-linear-gradient(0deg,rgba(0,255,255,0.1) 0px,transparent 1px,transparent 45px,rgba(0,255,255,0.1) 45px),' +
              'repeating-linear-gradient(90deg,rgba(0,255,255,0.1) 0px,transparent 1px,transparent 45px,rgba(0,255,255,0.1) 45px)',
          }}
        />
        {/* Edge glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, transparent 58%, rgba(255,0,128,0.22) 83%, rgba(255,0,128,0.1) 100%)',
          }}
        />

        {/* User pin */}
        {pinned && (() => {
          const { x, y } = project(pinned.lat, pinned.lng);
          return (
            <div
              className="absolute z-10 pointer-events-none"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-100%)' }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full"
                style={{ background: '#FF0080', boxShadow: '0 0 12px #FF0080, 0 0 24px rgba(255,0,128,0.5)' }}
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap font-mono-arcade text-[8px] text-[#FF0080] bg-black/85 px-1.5 py-0.5">
                📍 {pinned.label}
              </div>
            </div>
          );
        })()}

        {/* Target pin (revealed after guess) */}
        {revealTarget && (() => {
          const { x, y } = project(revealTarget.lat, revealTarget.lng);
          return (
            <div
              className="absolute z-10 pointer-events-none"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-100%)' }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full"
                style={{ background: '#39FF14', boxShadow: '0 0 12px #39FF14, 0 0 24px rgba(57,255,20,0.5)' }}
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap font-mono-arcade text-[8px] text-[#39FF14] bg-black/85 px-1.5 py-0.5">
                ✓ TARGET
              </div>
            </div>
          );
        })()}

        {/* Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="font-mono-arcade text-[7px] text-[#333] tracking-widest whitespace-nowrap">
            DRAG·ROTATE ◆ SCROLL·ZOOM
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Orthographic projection helpers ────────────────────────────────
   Converts (lng, lat) + globe rotation to canvas (x, y).
   Returns { x, y, visible } — visible = false when point is on the back
   hemisphere and should not be drawn. */
function orthoProject(lng, lat, rotY, rotX, R, cx, cy) {
  const phi   = ((lng - rotY + 540) % 360 - 180) * Math.PI / 180;
  const theta = lat * Math.PI / 180;
  const tilt  = rotX * Math.PI / 180;

  /* Unit-sphere 3-D coordinates (before tilt) */
  const x3      =  Math.cos(theta) * Math.sin(phi);
  const y3pre   =  Math.sin(theta);
  const z3pre   =  Math.cos(theta) * Math.cos(phi);

  /* Rotate around X-axis by tilt angle */
  const y3 = y3pre * Math.cos(tilt) + z3pre * Math.sin(tilt);
  const z3 = -y3pre * Math.sin(tilt) + z3pre * Math.cos(tilt);

  return {
    x: cx + x3 * R,
    y: cy - y3 * R,
    visible: z3 > 0,
  };
}

/* Draw decoded topojson rings onto a canvas using orthographic projection */
function drawRings(ctx, rings, rotY, rotX, zoom, W, H) {
  ctx.save();
  const R  = (W / 2 - 2) * zoom;
  const cx = W / 2;
  const cy = H / 2;

  /* Clip strictly to the sphere circle */
  ctx.beginPath();
  ctx.arc(cx, cy, W / 2 - 1, 0, Math.PI * 2);
  ctx.clip();

  ctx.shadowColor = '#00FFCC';
  ctx.shadowBlur  = 4;
  ctx.lineWidth   = 0.65;

  for (const ring of rings) {
    /* Pre-project every vertex so we can check all-visible in one pass */
    const pts = ring.map(([lng, lat]) => orthoProject(lng, lat, rotY, rotX, R, cx, cy));
    const fullyVisible = pts.every((p) => p.visible);

    ctx.beginPath();
    let penDown = false;
    for (const { x, y, visible } of pts) {
      if (!visible) { penDown = false; continue; }      /* lift pen at terminator */
      if (!penDown) { ctx.moveTo(x, y); penDown = true; }
      else ctx.lineTo(x, y);
    }

    if (fullyVisible) {
      /* Complete polygon — close + fill with no chord artifacts */
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 210, 185, 0.18)';
      ctx.fill();
    }
    /* Always stroke the visible arcs */
    ctx.strokeStyle = '#00FFDD';
    ctx.stroke();
  }

  /* Specular highlight */
  ctx.shadowBlur = 0;
  const grad = ctx.createRadialGradient(cx - W * 0.12, cy - H * 0.18, 0, cx, cy, R);
  grad.addColorStop(0,   'rgba(140,220,255,0.10)');
  grad.addColorStop(0.5, 'rgba(60,120,200,0.04)');
  grad.addColorStop(1,   'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}

/* ── Feud Answer Slot ── */
function FeudSlot({ answer, isRevealed, index }) {
  return (
    <div className="flip-container" style={{ height: '48px' }}>
      <div className={`flip-inner h-full ${isRevealed ? 'flipped' : ''}`}>
        {/* Front face */}
        <div
          className="flip-front absolute inset-0 flex items-center justify-between px-3"
          style={{ background: '#111', border: '1px solid #2A2A2A' }}
        >
          <span className="font-mono-arcade text-[10px] text-[#2A2A2A]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-mono-arcade text-[10px] text-[#222] tracking-wider flex-1 text-center">
            {'▬'.repeat(Math.min(12, Math.ceil(answer.label.length / 2)))}
          </span>
          <span className="font-mono-arcade text-[10px] text-[#2A2A2A]">+{answer.points}</span>
        </div>
        {/* Back face */}
        <div
          className="flip-back absolute inset-0 flex items-center justify-between px-3"
          style={{
            background: 'linear-gradient(135deg,#001400,#0A2800)',
            border: '1px solid #39FF14',
            boxShadow: '0 0 12px rgba(57,255,20,0.35)',
          }}
        >
          <span className="font-mono-arcade text-[9px] text-[#39FF14] flex-1 truncate">
            {answer.label}
          </span>
          <span className="font-display text-xl text-[#FFD700] ml-3">+{answer.points}</span>
        </div>
      </div>
    </div>
  );
}

/* ── HUD ── */
function GameHUD({ stageLabel, cumulative, timer, timerMax, challengerTotal }) {
  const isLow = timer !== null && timer <= 10;
  const pct = timerMax > 0 && timer !== null ? Math.max(0, (timer / timerMax) * 100) : null;

  return (
    <div className="hud-panel sticky top-8 z-40 px-4 py-2 flex flex-wrap items-center gap-3 gap-y-1.5">
      <span className="font-mono-arcade text-[9px] text-[#FF0080] tracking-widest uppercase">
        {stageLabel}
      </span>
      <div className="flex-1" />
      {pct !== null && (
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-[#1A1A1A]" style={{ border: '1px solid #2A2A2A' }}>
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${pct}%`,
                background: isLow ? '#FF0080' : '#00FFFF',
                boxShadow: `0 0 6px ${isLow ? '#FF0080' : '#00FFFF'}`,
              }}
            />
          </div>
          <span
            className={`font-mono-arcade text-sm tracking-wide ${isLow ? 'text-[#FF0080] animate-pulse' : 'text-[#00FFFF]'}`}
          >
            {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
          </span>
        </div>
      )}
      <span className="font-mono-arcade text-sm text-[#FFD700]">
        {String(cumulative).padStart(4, '0')} PTS
      </span>
      {challengerTotal != null && (
        <span
          className="font-mono-arcade text-[9px] text-[#FF0080] px-2 py-0.5 tracking-widest animate-pulse"
          style={{ border: '1px solid rgba(255,0,128,0.5)' }}
        >
          TARGET: {challengerTotal}
        </span>
      )}
    </div>
  );
}

/* ── Stage Recap Overlay ── */
function RecapOverlay({ recap, onContinue, onOpenLibrary }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.82, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 18 }}
        className="arcade-card w-full max-w-lg p-6"
        style={{ borderColor: '#00FFFF', borderWidth: '2px' }}
      >
        <p className="font-mono-arcade text-[9px] text-[#00FFFF] tracking-widest mb-2 uppercase">
          ◈ STAGE COMPLETE — INTEL BRIEFING
        </p>
        <h2 className="font-display text-3xl text-white mb-4">{recap.title}</h2>
        <p className="text-sm text-[#888] leading-relaxed mb-4">{recap.summary}</p>
        <ul className="space-y-2 mb-6">
          {recap.bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm text-[#666]">
              <span className="text-[#39FF14] shrink-0 mt-px">▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.94, y: 5 }}
            onClick={onContinue}
            className="btn-arcade btn-lime flex-1 py-3"
          >
            ▶ CONTINUE
          </motion.button>
          {onOpenLibrary && (
            <button
              type="button"
              onClick={() => onOpenLibrary(recap.resourceIds?.[0])}
              className="btn-arcade btn-ghost px-4 py-3 flex items-center gap-2"
              style={{ borderColor: '#333' }}
            >
              <BookOpen size={13} />
              GRIMOIRE
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN SIMULATION
══════════════════════════════════════════════════ */
export default function SimulationPreview({
  username,
  challengerData,
  isMuted,
  onComplete,
  onOpenLibrary,
}) {
  const seed = useMemo(() => {
    let s = 0;
    for (let i = 0; i < username.length; i++) s += username.charCodeAt(i);
    return s + (Date.now() % 9999);
  }, [username]);

  const geoPrompts = useMemo(
    () => seededShuffle(geoFlowPrompts, seed).slice(0, GEO_GUESSES),
    [seed],
  );
  const flagDeck = useMemo(
    () => seededShuffle(flagCountryPool, seed + 1).slice(0, FLAGS_COUNT),
    [seed],
  );
  const feudDeck = useMemo(
    () => seededShuffle(feudQuestionPool, seed + 2).slice(0, 8),
    [seed],
  );

  const { playUiClick, playPinDrop, playSubmit, playNavigate, playSuccess, playWarning } = useSound();

  const sfx = useMemo(
    () => ({
      click:    () => { if (!isMuted) playUiClick(); },
      pin:      () => { if (!isMuted) playPinDrop(); },
      submit:   () => { if (!isMuted) playSubmit(); },
      navigate: () => { if (!isMuted) playNavigate(); },
      good:     () => { if (!isMuted) playSuccess(); },
      bad:      () => { if (!isMuted) playWarning(); },
    }),
    [isMuted, playUiClick, playPinDrop, playSubmit, playNavigate, playSuccess, playWarning],
  );

  /* ── Running score refs (avoid stale closure) ── */
  const s1Ref = useRef(0);
  const s2Ref = useRef(0);
  const s3Ref = useRef(0);

  /* ── Game stage ── */
  const [gameStage, setGameStage] = useState('stage1');

  /* ── Display scores ── */
  const [displayS1, setDisplayS1] = useState(0);
  const [displayS2, setDisplayS2] = useState(0);
  const [displayS3, setDisplayS3] = useState(0);

  const addS1 = useCallback((pts) => { s1Ref.current += pts; setDisplayS1(s1Ref.current); }, []);
  const addS2 = useCallback((pts) => { s2Ref.current += pts; setDisplayS2(s2Ref.current); }, []);
  const addS3 = useCallback((pts) => { s3Ref.current += pts; setDisplayS3(s3Ref.current); }, []);

  /* ── STAGE 1 state ── */
  const [geoIndex, setGeoIndex] = useState(0);
  const [geoTimer, setGeoTimer] = useState(GEO_TIMER_SEC);
  const [pinnedPt, setPinnedPt] = useState(null);
  const [geoFeedback, setGeoFeedback] = useState(null);

  /* ── STAGE 2 state ── */
  const [flagIndex, setFlagIndex] = useState(0);
  const [flagFlash, setFlagFlash] = useState(null); // 'correct' | 'wrong' | null

  /* ── STAGE 3 state ── */
  const [feudQIdx, setFeudQIdx] = useState(0);
  const [feudTimer, setFeudTimer] = useState(FEUD_TIMER_SEC);
  const [feudInput, setFeudInput] = useState('');
  const [feudActive, setFeudActive] = useState(false);
  const [revealedByQ, setRevealedByQ] = useState({}); // { qId: Set<number> }
  const [feudAutoAdvancing, setFeudAutoAdvancing] = useState(false); // brief pause after correct
  const [feudFinishConfirm, setFeudFinishConfirm] = useState(false); // early-exit modal

  const cumulative = displayS1 + displayS2 + displayS3;
  const challengerTotal = challengerData?.total ?? null;

  /* ───── Stage 1 timer ───── */
  useEffect(() => {
    if (gameStage !== 'stage1' || geoFeedback !== null) return undefined;
    if (geoTimer <= 0) {
      handleGeoSubmit();
      return undefined;
    }
    const id = setInterval(() => setGeoTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStage, geoTimer, geoFeedback]);

  /* ───── Stage 3 timer ───── */
  useEffect(() => {
    if (gameStage !== 'stage3' || !feudActive) return undefined;
    if (feudTimer <= 0) { endFeud(); return undefined; }
    const id = setInterval(() => setFeudTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [gameStage, feudTimer, feudActive]);

  /* ───── Stage 1 handlers ───── */
  function handleGeoSubmit() {
    const p = geoPrompts[geoIndex];
    let pts = 0;
    let dist = null;
    if (pinnedPt) {
      dist = Math.round(haversine(pinnedPt.lat, pinnedPt.lng, p.lat, p.lng));
      pts = geoPoints(dist);
    }
    addS1(pts);
    if (pts >= 70) sfx.good(); else sfx.bad();
    setGeoFeedback({ dist, pts, trivia: p.trivia, location: p.location, lat: p.lat, lng: p.lng });
  }

  function handleGeoNext() {
    if (geoIndex + 1 >= geoPrompts.length) {
      setGameStage('s1-recap');
    } else {
      setGeoIndex((i) => i + 1);
      setPinnedPt(null);
      setGeoFeedback(null);
      setGeoTimer(GEO_TIMER_SEC);
    }
  }

  /* ───── Stage 2 handlers ───── */
  function handleFlagChoice(cat) {
    if (flagFlash !== null) return;
    const correct = flagDeck[flagIndex].category === cat;
    const pts = correct ? 50 : 0;
    addS2(pts);
    if (correct) sfx.good(); else sfx.bad();
    setFlagFlash(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      setFlagFlash(null);
      if (flagIndex + 1 >= flagDeck.length) {
        setGameStage('s2-recap');
      } else {
        setFlagIndex((i) => i + 1);
      }
    }, 900);
  }

  /* ───── Stage 3 handlers ───── */
  function handleFeudSubmit() {
    const q = feudDeck[feudQIdx];
    const val = feudInput.trim().toLowerCase();
    if (!val || feudAutoAdvancing) return;
    const already = revealedByQ[q.id] ?? new Set();
    let matched = false;
    q.answers.forEach((ans, idx) => {
      if (already.has(idx)) return;
      if (ans.match.some((m) => val.includes(m))) {
        matched = true;
        setRevealedByQ((prev) => {
          const nxt = { ...prev };
          nxt[q.id] = new Set([...(prev[q.id] ?? []), idx]);
          return nxt;
        });
        addS3(ans.points);
      }
    });
    if (matched) {
      sfx.good();
      setFeudInput('');
      /* Auto-advance to next question after the flip animation plays */
      setFeudAutoAdvancing(true);
      setTimeout(() => {
        setFeudAutoAdvancing(false);
        setFeudQIdx((i) => (i + 1) % feudDeck.length);
        setFeudInput('');
      }, 900);
    } else {
      sfx.bad();
      setFeudInput('');
    }
  }

  function handleFeudPass() {
    if (feudAutoAdvancing) return;
    sfx.navigate();
    setFeudQIdx((i) => (i + 1) % feudDeck.length);
    setFeudInput('');
  }

  function endFeud() {
    setFeudFinishConfirm(false);
    setFeudActive(false);
    setGameStage('s3-recap');
  }

  /* ───── Recap continuation ───── */
  function handleRecapContinue(from) {
    sfx.navigate();
    if (from === 's1-recap') setGameStage('stage2');
    else if (from === 's2-recap') { setGameStage('stage3'); }
    else {
      onComplete({
        stage1: s1Ref.current,
        stage2: s2Ref.current,
        stage3: s3Ref.current,
        total: s1Ref.current + s2Ref.current + s3Ref.current,
      });
    }
  }

  /* ───── HUD metadata ───── */
  const hudLabel = {
    stage1: 'STAGE 01 · GEO-GUESSR',
    's1-recap': 'STAGE 01 · COMPLETE',
    stage2: 'STAGE 02 · FLAG SORT',
    's2-recap': 'STAGE 02 · COMPLETE',
    stage3: 'STAGE 03 · GLOBAL FEUD',
    's3-recap': 'STAGE 03 · COMPLETE',
  }[gameStage] ?? 'GLOBALIZATION TERMINAL';

  const hudTimer = gameStage === 'stage1' ? geoTimer : gameStage === 'stage3' ? feudTimer : null;
  const hudTimerMax = gameStage === 'stage1' ? GEO_TIMER_SEC : gameStage === 'stage3' ? FEUD_TIMER_SEC : null;

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="min-h-screen pb-20">
      <GameHUD
        stageLabel={hudLabel}
        cumulative={cumulative}
        timer={hudTimer}
        timerMax={hudTimerMax}
        challengerTotal={challengerTotal}
      />

      <AnimatePresence mode="wait">
        {/* ══════ STAGE 1 ══════ */}
        {gameStage === 'stage1' && (
          <motion.div
            key="stage1"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            className="max-w-xl mx-auto px-4 pt-5"
          >
            {/* Clue header */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono-arcade text-[10px] text-[#555] tracking-widest">
                CLUE {geoIndex + 1} / {geoPrompts.length}
              </p>
              {pinnedPt && (
                <span className="font-mono-arcade text-[9px] text-[#FF0080]">
                  📍 {pinnedPt.label}
                </span>
              )}
            </div>

            <div
              className="arcade-card p-4 mb-4"
              style={{ borderColor: '#FF0080', borderWidth: '2px' }}
            >
              <p className="font-mono-arcade text-[9px] text-[#FF0080] tracking-widest uppercase mb-2">
                {geoPrompts[geoIndex].title}
              </p>
              <p className="text-sm text-[#CCC] leading-relaxed">{geoPrompts[geoIndex].prompt}</p>
            </div>

            <GlobeBoard
              onPin={(pt) => { if (!geoFeedback) { setPinnedPt(pt); sfx.pin(); } }}
              pinned={pinnedPt}
              revealTarget={geoFeedback ? { lat: geoFeedback.lat, lng: geoFeedback.lng } : null}
            />

            {/* Submit or feedback */}
            {!geoFeedback ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94, y: 5 }}
                onClick={() => { sfx.submit(); handleGeoSubmit(); }}
                disabled={!pinnedPt}
                className={`btn-arcade w-full mt-4 py-3 ${pinnedPt ? 'btn-lime' : 'btn-ghost'}`}
                style={pinnedPt ? {} : { borderColor: '#1A1A1A', color: '#333' }}
              >
                {pinnedPt ? '▶ LOCK IN ANSWER' : '← PLACE YOUR PIN ON THE GLOBE'}
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 arcade-card p-4"
                style={{
                  borderColor:
                    geoFeedback.pts >= 75 ? '#39FF14' : geoFeedback.pts >= 45 ? '#FFD700' : '#FF0080',
                  borderWidth: '2px',
                  boxShadow:
                    geoFeedback.pts >= 75
                      ? '0 0 20px rgba(57,255,20,0.25)'
                      : '0 0 20px rgba(255,0,128,0.2)',
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono-arcade text-[9px] text-[#555] tracking-widest mb-1">
                      ACTUAL LOCATION
                    </p>
                    <p className="font-display text-2xl text-white">{geoFeedback.location}</p>
                    {geoFeedback.dist !== null && (
                      <p className="font-mono-arcade text-[10px] text-[#555] mt-1">
                        {geoFeedback.dist.toLocaleString()} KM FROM TARGET
                      </p>
                    )}
                    {geoFeedback.dist === null && (
                      <p className="font-mono-arcade text-[10px] text-[#555] mt-1">NO PIN PLACED</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-mono-arcade text-[9px] text-[#555] mb-0.5">EARNED</p>
                    <p
                      className="font-display text-4xl text-glow-gold"
                      style={{ color: '#FFD700' }}
                    >
                      +{geoFeedback.pts}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#666] leading-relaxed border-t border-[#2A2A2A] pt-3">
                  {geoFeedback.trivia}
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.94, y: 5 }}
                  onClick={() => { sfx.navigate(); handleGeoNext(); }}
                  className="btn-arcade btn-cyan w-full mt-3 py-2.5"
                >
                  {geoIndex + 1 < geoPrompts.length ? '▶ NEXT CLUE' : '▶ SEE STAGE RECAP'}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ══════ STAGE 2 ══════ */}
        {gameStage === 'stage2' && (
          <motion.div
            key="stage2"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            className="max-w-lg mx-auto px-4 pt-5"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono-arcade text-[10px] text-[#555] tracking-widest">
                FLAG {flagIndex + 1} / {flagDeck.length}
              </p>
              <p className="font-mono-arcade text-[10px] text-[#FFD700]">
                {Math.round((flagIndex / flagDeck.length) * 100)}% FILED
              </p>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 mb-6" style={{ background: '#111', border: '1px solid #222' }}>
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(flagIndex / flagDeck.length) * 100}%`,
                  background: 'linear-gradient(90deg,#FF0080,#FFD700)',
                  boxShadow: '0 0 8px rgba(255,0,128,0.5)',
                }}
              />
            </div>

            {/* Flag card */}
            <motion.div
              key={flagIndex}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-6"
            >
              <div
                className="mx-auto mb-4 overflow-hidden"
                style={{
                  width: '168px',
                  height: '112px',
                  border: '3px solid #2A2A2A',
                  boxShadow: '0 0 35px rgba(0,0,0,0.8)',
                }}
              >
                <img
                  src={`https://flagcdn.com/w320/${flagDeck[flagIndex].code}.webp`}
                  alt={flagDeck[flagIndex].name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <p className="font-display text-4xl text-white">{flagDeck[flagIndex].name}</p>
              <p className="font-mono-arcade text-[10px] text-[#444] mt-1 tracking-widest">
                CLASSIFY THIS NATION — WORLD-SYSTEMS THEORY
              </p>
            </motion.div>

            {/* Portals */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'CORE', label: 'CORE', sub: 'Dominant', cls: 'portal-core', c: '#FFD700' },
                { key: 'SEMI_PERIPHERY', label: 'SEMI', sub: 'Bridging', cls: 'portal-semi', c: '#00FFFF' },
                { key: 'PERIPHERY', label: 'PERIPHERY', sub: 'Extractive', cls: 'portal-periphery', c: '#FF0080' },
              ].map(({ key, label, sub, cls, c }) => (
                <motion.button
                  key={key}
                  type="button"
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.94, y: 2 }}
                  onClick={() => handleFlagChoice(key)}
                  disabled={!!flagFlash}
                  className={`${cls} p-4 text-center`}
                >
                  <p className="font-display text-lg leading-tight" style={{ color: c }}>{label}</p>
                  <p className="font-mono-arcade text-[8px] text-[#666] mt-1">{sub}</p>
                </motion.button>
              ))}
            </div>

            {/* Flash feedback */}
            <AnimatePresence>
              {flagFlash && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="mt-4 py-3 text-center border-2 font-display text-2xl"
                  style={{
                    borderColor: flagFlash === 'correct' ? '#39FF14' : '#FF0080',
                    color: flagFlash === 'correct' ? '#39FF14' : '#FF0080',
                    boxShadow:
                      flagFlash === 'correct'
                        ? '0 0 20px rgba(57,255,20,0.4)'
                        : '0 0 20px rgba(255,0,128,0.4)',
                  }}
                >
                  {flagFlash === 'correct'
                    ? '✓ CORRECT! +50 PTS'
                    : `✗ WRONG — ${flagDeck[flagIndex]?.category.replace('_', '-') ?? ''}`}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ══════ STAGE 3 ══════ */}
        {gameStage === 'stage3' && (
          <motion.div
            key="stage3"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            className="max-w-xl mx-auto px-4 pt-5"
          >
            {!feudActive ? (
              /* Start screen */
              <div className="text-center py-12">
                <p className="font-mono-arcade text-[10px] text-[#555] tracking-widest mb-4 uppercase">
                  STAGE 03 · GLOBAL FEUD
                </p>
                <p className="font-display text-6xl text-[#FF0080] text-glow-magenta mb-2">
                  FAST MONEY
                </p>
                <p className="font-display text-4xl text-white mb-6">RULES</p>
                <ul className="text-sm text-[#666] mb-8 space-y-2 max-w-xs mx-auto text-left">
                  <li className="flex gap-3"><span className="text-[#FF0080]">▸</span>8 questions, hidden answer slots</li>
                  <li className="flex gap-3"><span className="text-[#FF0080]">▸</span>2-minute clock — race the board</li>
                  <li className="flex gap-3"><span className="text-[#FF0080]">▸</span>Get 1 correct → auto-advance to next Q</li>
                  <li className="flex gap-3"><span className="text-[#FF0080]">▸</span>Don't know it? Hit PASS to skip</li>
                  <li className="flex gap-3"><span className="text-[#FF0080]">▸</span>Timer hits zero → round ends automatically</li>
                </ul>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.94, y: 5 }}
                  onClick={() => { setFeudActive(true); sfx.submit(); }}
                  className="btn-arcade btn-magenta px-12 py-4 text-base"
                >
                  ▶ START THE CLOCK
                </motion.button>
              </div>
            ) : (
              /* Active feud */
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono-arcade text-[9px] text-[#555] tracking-widest">
                    Q {feudQIdx + 1} / {feudDeck.length}
                  </p>
                  <p className="font-mono-arcade text-[10px] text-[#FFD700]">{displayS3} PTS THIS ROUND</p>
                </div>

                {/* Question */}
                <div
                  className="arcade-card p-3 mb-3"
                  style={{ borderColor: '#FF0080', borderWidth: '2px' }}
                >
                  <p className="text-sm text-[#CCC] leading-relaxed">{feudDeck[feudQIdx].question}</p>
                </div>

                {/* Answer slots */}
                <div className="space-y-1.5 mb-4">
                  {feudDeck[feudQIdx].answers.map((ans, idx) => {
                    const revealed = revealedByQ[feudDeck[feudQIdx].id]?.has(idx) ?? false;
                    return <FeudSlot key={idx} answer={ans} isRevealed={revealed} index={idx} />;
                  })}
                </div>

                {/* Auto-advancing indicator */}
                {feudAutoAdvancing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-3 py-2 text-center font-mono-arcade text-[11px] tracking-widest"
                    style={{
                      border: '1px solid #39FF14',
                      color: '#39FF14',
                      boxShadow: '0 0 14px rgba(57,255,20,0.3)',
                    }}
                  >
                    ✓ CORRECT — NEXT QUESTION IN...
                  </motion.div>
                )}

                {/* Input + buttons */}
                <div className="flex gap-2 mb-2">
                  <input
                    className="arcade-input flex-1"
                    type="text"
                    placeholder={feudAutoAdvancing ? 'ADVANCING...' : 'TYPE YOUR ANSWER...'}
                    value={feudInput}
                    disabled={feudAutoAdvancing}
                    onChange={(e) => setFeudInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleFeudSubmit(); }}
                    autoComplete="off"
                    style={{ opacity: feudAutoAdvancing ? 0.4 : 1 }}
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: feudAutoAdvancing ? 1 : 1.03 }}
                    whileTap={{ scale: feudAutoAdvancing ? 1 : 0.94, y: feudAutoAdvancing ? 0 : 5 }}
                    onClick={handleFeudSubmit}
                    disabled={feudAutoAdvancing}
                    className="btn-arcade btn-lime px-5"
                    style={{ opacity: feudAutoAdvancing ? 0.4 : 1 }}
                  >
                    SUBMIT
                  </motion.button>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: feudAutoAdvancing ? 1 : 1.02 }}
                    whileTap={{ scale: feudAutoAdvancing ? 1 : 0.94, y: feudAutoAdvancing ? 0 : 5 }}
                    onClick={handleFeudPass}
                    disabled={feudAutoAdvancing}
                    className="btn-arcade btn-cyan flex-1 py-3 text-sm"
                    style={{ opacity: feudAutoAdvancing ? 0.4 : 1 }}
                  >
                    ⟳ PASS
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setFeudFinishConfirm(true)}
                    className="btn-arcade btn-ghost px-5 py-3 text-xs hover:border-[#FF0080] hover:text-[#FF0080] transition-all"
                  >
                    FINISH
                  </button>
                </div>

                {/* Early-exit confirmation modal */}
                <AnimatePresence>
                  {feudFinishConfirm && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.85, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', damping: 18 }}
                        className="arcade-card w-full max-w-sm p-6"
                        style={{ borderColor: '#FF0080', borderWidth: '2px' }}
                      >
                        <p className="font-mono-arcade text-[9px] text-[#FF0080] tracking-widest mb-3 uppercase">
                          ⚠ CONFIRM EARLY EXIT
                        </p>
                        <p className="font-display text-3xl text-white mb-2">End Round Early?</p>
                        <p className="text-sm text-[#666] leading-relaxed mb-6">
                          You still have{' '}
                          <span className="text-[#FFD700] font-mono-arcade">
                            {`${String(Math.floor(feudTimer / 60)).padStart(2, '0')}:${String(feudTimer % 60).padStart(2, '0')}`}
                          </span>{' '}
                          remaining. Unscored answers will be lost.
                        </p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => { sfx.click(); setFeudFinishConfirm(false); }}
                            className="btn-arcade btn-ghost flex-1 py-3"
                          >
                            ← KEEP PLAYING
                          </button>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.94, y: 5 }}
                            onClick={() => { sfx.bad(); endFeud(); }}
                            className="btn-arcade btn-magenta flex-1 py-3"
                          >
                            END NOW
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}

        {/* ══════ RECAPS ══════ */}
        {(gameStage === 's1-recap' || gameStage === 's2-recap' || gameStage === 's3-recap') && (
          <RecapOverlay
            key={gameStage}
            recap={
              stageRecaps[
                gameStage === 's1-recap' ? 'stage1' : gameStage === 's2-recap' ? 'stage2' : 'stage3'
              ]
            }
            onContinue={() => handleRecapContinue(gameStage)}
            onOpenLibrary={onOpenLibrary}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

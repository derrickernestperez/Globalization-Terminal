import { AnimatePresence, motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { ContentLibrary } from '../data/ContentLibrary.js';

export default function LibraryModal({ isOpen, selectedId, onSelect, onClose }) {
  const resources = ContentLibrary.resources;
  const selected = resources.find((r) => r.id === selectedId) ?? resources[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/96 flex items-center justify-center p-3 sm:p-5"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.88, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.88, y: 40 }}
            transition={{ type: 'spring', damping: 20 }}
            className="dossier-bg w-full max-w-4xl flex overflow-hidden"
            style={{
              maxHeight: '90vh',
              border: '2px solid #1A3A1A',
              boxShadow: '0 0 60px rgba(0,180,0,0.12), 0 0 120px rgba(0,0,0,0.9)',
            }}
          >
            {/* ── Sidebar ── */}
            <div
              className="w-44 shrink-0 flex flex-col overflow-hidden"
              style={{ borderRight: '1px solid #1A3A1A' }}
            >
              <div className="p-3" style={{ borderBottom: '1px solid #1A3A1A' }}>
                <p className="font-mono-arcade text-[8px] text-[#39FF14]/50 tracking-[0.3em] uppercase">
                  ◈ DOSSIER FILES
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {resources.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelect(r.id)}
                    className="w-full text-left transition-all"
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid rgba(26,58,26,0.5)',
                      borderLeft: r.id === selectedId ? '3px solid #39FF14' : '3px solid transparent',
                      background: r.id === selectedId ? 'rgba(10,42,10,0.8)' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (r.id !== selectedId) e.currentTarget.style.background = 'rgba(10,26,10,0.6)'; }}
                    onMouseLeave={(e) => { if (r.id !== selectedId) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <p className="font-mono-arcade text-[7px] text-[#39FF14]/30 mb-1">
                      FILE-{String(i + 1).padStart(2, '0')}
                    </p>
                    <p
                      className="text-[10px] font-mono leading-tight"
                      style={{ color: r.id === selectedId ? '#39FF14' : '#4A6A4A' }}
                    >
                      {r.topic}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Main content ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Content header */}
              <div
                className="flex items-start justify-between p-4 shrink-0"
                style={{ borderBottom: '1px solid #1A3A1A' }}
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p className="font-mono-arcade text-[8px] text-[#39FF14]/40 tracking-widest uppercase mb-1">
                    CLASSIFIED DOSSIER ◆ {selected.notebookLabel.toUpperCase()}
                  </p>
                  <h2 className="font-display text-2xl text-[#39FF14] leading-tight">
                    {selected.topic.toUpperCase()}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 p-2 transition-all"
                  style={{ border: '1px solid #1A3A1A', color: '#4A6A4A' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF0080'; e.currentTarget.style.color = '#FF0080'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A3A1A'; e.currentTarget.style.color = '#4A6A4A'; }}
                  aria-label="Close grimoire"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* Spotlight key insight */}
                {selected.spotlight && (
                  <div style={{ background: 'rgba(10,26,10,0.7)', borderLeft: '3px solid #39FF14', padding: '12px 14px' }}>
                    <p className="font-mono-arcade text-[8px] text-[#39FF14]/50 tracking-[0.3em] uppercase mb-1.5">
                      ◈ KEY INSIGHT
                    </p>
                    <p className="font-mono-arcade text-[10px] text-[#39FF14] leading-relaxed">
                      {selected.spotlight}
                    </p>
                  </div>
                )}

                {/* Summary */}
                <section>
                  <p className="font-mono-arcade text-[8px] text-[#3A5A3A] tracking-[0.3em] uppercase mb-2">
                    EXECUTIVE SUMMARY
                  </p>
                  <p className="text-sm text-[#7A9A7A] leading-relaxed font-mono">{selected.summary}</p>
                </section>

                {/* Key Points */}
                {selected.keyPoints?.length > 0 && (
                  <section>
                    <p className="font-mono-arcade text-[8px] text-[#3A5A3A] tracking-[0.3em] uppercase mb-3">
                      CRITICAL FINDINGS
                    </p>
                    <div className="space-y-1.5">
                      {selected.keyPoints.map((pt, i) => (
                        <div
                          key={i}
                          className="flex gap-3 py-2 px-2"
                          style={{ border: '1px solid rgba(26,58,26,0.4)' }}
                        >
                          <span className="font-mono-arcade text-[10px] text-[#39FF14]/40 shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <p className="text-[11px] text-[#7A9A7A] leading-relaxed font-mono">{pt}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Deep Dive */}
                {selected.deepDive?.length > 0 && (
                  <section>
                    <p className="font-mono-arcade text-[8px] text-[#3A5A3A] tracking-[0.3em] uppercase mb-2">
                      FIELD ANALYST NOTES
                    </p>
                    <div className="space-y-1.5">
                      {selected.deepDive.map((note, i) => (
                        <p
                          key={i}
                          className="text-[11px] text-[#5A7A5A] leading-relaxed font-mono pl-3 py-1"
                          style={{ borderLeft: '1px solid rgba(26,58,26,0.5)' }}
                        >
                          ▸ {note}
                        </p>
                      ))}
                    </div>
                  </section>
                )}

                {/* Real-world questions */}
                {selected.realWorldQuestions?.length > 0 && (
                  <section>
                    <p className="font-mono-arcade text-[8px] text-[#3A5A3A] tracking-[0.3em] uppercase mb-2">
                      INTERROGATION QUESTIONS
                    </p>
                    <div className="space-y-1.5">
                      {selected.realWorldQuestions.map((q, i) => (
                        <div
                          key={i}
                          className="flex gap-2 p-2"
                          style={{ border: '1px solid rgba(26,58,26,0.4)' }}
                        >
                          <span className="font-mono-arcade text-[9px] text-[#39FF14]/35 shrink-0 mt-px">
                            Q{i + 1}
                          </span>
                          <p className="text-[11px] text-[#7A9A7A] font-mono italic leading-relaxed">{q}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Document scan */}
                {selected.documentScan?.length > 0 && (
                  <section>
                    <p className="font-mono-arcade text-[8px] text-[#3A5A3A] tracking-[0.3em] uppercase mb-2">
                      DOCUMENT SCAN — RAW EVIDENCE
                    </p>
                    <div className="space-y-1">
                      {selected.documentScan.map((scan, i) => (
                        <p
                          key={i}
                          className="text-[10px] text-[#3A5A3A] font-mono py-1 pl-3"
                          style={{ borderLeft: '1px solid rgba(26,58,26,0.4)' }}
                        >
                          {scan}
                        </p>
                      ))}
                    </div>
                  </section>
                )}

                {/* Recap */}
                {selected.recap && (
                  <section
                    style={{
                      background: 'rgba(5,18,5,0.8)',
                      border: '1px solid rgba(26,58,26,0.6)',
                      padding: '12px 14px',
                    }}
                  >
                    <p className="font-mono-arcade text-[8px] text-[#39FF14]/40 tracking-widest uppercase mb-1.5">
                      DEBRIEF NOTE
                    </p>
                    <p className="text-[11px] text-[#5A7A5A] font-mono italic leading-relaxed">{selected.recap}</p>
                  </section>
                )}

                {/* PDF link */}
                <div style={{ paddingTop: '8px', borderTop: '1px solid #1A3A1A' }}>
                  <a
                    href={selected.pdfHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-mono-arcade text-[9px] text-[#39FF14]/50 tracking-widest uppercase transition-all hover:text-[#39FF14]"
                  >
                    <Download size={12} />
                    ACCESS ORIGINAL CLASSIFIED DOCUMENT
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

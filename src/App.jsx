import { useState } from 'react';
import LandingPage from './components/LandingPage.jsx';
import SimulationPreview from './components/SimulationPreview.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import LibraryModal from './components/LibraryModal.jsx';
import { ContentLibrary } from './data/ContentLibrary.js';

const TICKER_ITEMS = [
  'SILK_ROUTE/DUCAT ▲ 14.88',
  'COLONIAL_BOND/GBP ▼ 0.0042',
  'TRADE_WAR/CNY ▲ 89.99',
  'BTC/COWRIE_SHELL ▼ 0.0001',
  'OFFSHORE_LABOR/USD ▲ 0.23',
  'SOVEREIGNTY/IMF ▼ 1.44',
  'GLOBALIZATION/FEAR ▲ 420.69',
  'RARE_EARTH/YUAN ▼ 7.72',
  'WORLD_BANK/TRUST ▲ 0.01',
  'CULTURAL_FLOW/BARTER ▼ NULL',
  'EMPIRE_DEBT/COWRIE ▲ 888.0',
  'SWEATSHOP_INDEX ▼ -12.5',
  'FREE_MARKET/IRONY ▲ ∞',
  'COLD_WAR_REMNANTS ▼ 0.33',
  'HEGEMONY_FUTURES ▲ 1776',
  'PERIPHERY_EXPORTS/CORE_PROFITS ▼ 0.04',
];

const tickerStr = TICKER_ITEMS.join(' ◆◆ ');

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [username, setUsername] = useState('');
  const [challengerData, setChallengerData] = useState(null);
  const [scores, setScores] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(ContentLibrary.resources[0].id);

  const openLibrary = (resourceId = ContentLibrary.resources[0].id) => {
    setSelectedResourceId(resourceId);
    setIsLibraryOpen(true);
  };

  const handleStartSolo = (name) => {
    setUsername(name);
    setChallengerData(null);
    setCurrentView('game');
  };

  const handleStartChallenger = (name, decoded) => {
    setUsername(name);
    setChallengerData(decoded);
    setCurrentView('game');
  };

  const handleGameComplete = (gameScores) => {
    setScores(gameScores);
    setCurrentView('results');
  };

  const handlePlayAgain = () => {
    setUsername('');
    setChallengerData(null);
    setScores(null);
    setCurrentView('landing');
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* ── Marquee ticker bar ─────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-8 bg-[#0A0A0A] flex items-center overflow-hidden"
        style={{ borderBottom: '2px solid #FF0080' }}
      >
        <div className="marquee-wrap">
          <div className="marquee-inner font-mono-arcade text-[10px] text-[#FF0080] tracking-[0.18em] uppercase opacity-90 leading-none">
            <span className="pr-12">{tickerStr}</span>
            <span className="pr-12">{tickerStr}</span>
          </div>
        </div>
        {/* Mute toggle */}
        <button
          type="button"
          onClick={() => setIsMuted((m) => !m)}
          className="shrink-0 h-full px-4 font-mono-arcade text-[9px] uppercase tracking-widest transition-colors"
          style={{
            borderLeft: '2px solid #FF0080',
            color: isMuted ? '#444' : '#FF0080',
            background: 'transparent',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,0,128,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          {isMuted ? '◼ OFF' : '◼ SFX'}
        </button>
      </div>

      {/* ── Main content ───────────────────────────────────── */}
      <div className="pt-8 relative z-10">
        {currentView === 'landing' && (
          <LandingPage
            onStartSolo={handleStartSolo}
            onStartChallenger={handleStartChallenger}
            onOpenLibrary={openLibrary}
          />
        )}
        {currentView === 'game' && (
          <SimulationPreview
            username={username}
            challengerData={challengerData}
            isMuted={isMuted}
            onComplete={handleGameComplete}
            onOpenLibrary={openLibrary}
          />
        )}
        {currentView === 'results' && scores && (
          <ResultsScreen
            username={username}
            scores={scores}
            challengerData={challengerData}
            onPlayAgain={handlePlayAgain}
            onOpenLibrary={openLibrary}
          />
        )}
      </div>

      <LibraryModal
        isOpen={isLibraryOpen}
        selectedId={selectedResourceId}
        onSelect={setSelectedResourceId}
        onClose={() => setIsLibraryOpen(false)}
      />
    </div>
  );
}

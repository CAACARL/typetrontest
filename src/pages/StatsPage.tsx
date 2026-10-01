import { useState } from "react";
import { Link } from "react-router-dom";
import type { TestResult } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAudio } from "../hooks/useAudio";
import { GameDetailModal } from "../components/modals/GameDetailModal";
import { ConfirmModal } from "../components/modals/ConfirmModal";
import { TermsModal } from "../components/modals/TermsModal";
import { PrivacyModal } from "../components/modals/PrivacyModal";

export const StatsPage = () => {
  const [testHistory, setTestHistory] = useLocalStorage<TestResult[]>("typingTestHistory", []);
  const [soundEnabled] = useLocalStorage("soundEnabled", true);
  const [statsFilterMode, setStatsFilterMode] = useState<string>("all");
  const [statsFilterDuration, setStatsFilterDuration] = useState<number | "all">("all");
  const [selectedGame, setSelectedGame] = useState<TestResult | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  const { playSound } = useAudio(soundEnabled);

  const filtered = testHistory.filter(t => {
    const modeMatch = statsFilterMode === "all" || t.mode === statsFilterMode;
    const durationMatch = statsFilterDuration === "all" || t.selectedDuration === statsFilterDuration;
    return modeMatch && durationMatch;
  });

  const sorted = [...filtered].sort((a, b) => b.wpm - a.wpm);

  const averageWpm = testHistory.length > 0
    ? Math.round(testHistory.reduce((sum, test) => sum + test.wpm, 0) / testHistory.length)
    : 0;

  const bestWpm = testHistory.length > 0 ? Math.max(...testHistory.map((t) => t.wpm)) : 0;

  const getModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      javascript: "JS",
      python: "PY",
      cpp: "C++",
      java: "JAVA",
      php: "PHP",
      text: "TXT"
    };
    return labels[mode] || "—";
  };

  const handleClearStats = () => {
    setTestHistory([]);
    setShowClearConfirm(false);
    playSound(300, 0.2, "sawtooth");
  };

  return (
    <div className="app">
      <div className="scanlines"></div>
      <div className="grid-bg"></div>
      
      <header className="navbar">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <div className="logo-bracket">[</div>
          <span className="logo-text">TYPE<span className="logo-finale" data-text="TRON">TRON</span><span className="logo-text">TEST</span></span>
          <div className="logo-bracket">]</div>
        </Link>
        <nav className="nav-menu">
          <Link to="/" className="nav-btn">
            <span className="btn-label">BACK TO GAME</span>
            <span className="btn-underline"></span>
          </Link>
        </nav>
      </header>

      <main className="main">
        <div className="stats-page">
          <div className="stats-page-header">
            <h1 className="stats-page-title">PERFORMANCE STATS</h1>
          </div>
          
          <div className="stats-content">
            {testHistory.length === 0 ? (
              <div className="empty-stats-state">
                <div className="empty-icon">📊</div>
                <h2 className="empty-title">NO STATS YET</h2>
                <p className="empty-text">Complete your first typing test to see your performance stats here.</p>
                <Link to="/" className="empty-cta">
                  <span className="btn-text">START TYPING</span>
                </Link>
              </div>
            ) : (
              <>
                {filtered.length >= 3 && (
                  <div className="podium-section-page">
                    <h3 className="section-title">🏆 TOP 3 CHAMPIONS</h3>
                    <div className="podium">
                      <div className="podium-place second">
                        <div className="podium-icon">{sorted[1].profileIcon}</div>
                        <div className="podium-wpm">{sorted[1].wpm} <span style={{fontSize:'14px'}}>WPM</span></div>
                        <div className="podium-name">{sorted[1].playerName}</div>
                        <div className="podium-rank">2ND</div>
                        <div className="podium-bar silver"></div>
                      </div>
                      <div className="podium-place first">
                        <div className="podium-trophy">👑</div>
                        <div className="podium-icon">{sorted[0].profileIcon}</div>
                        <div className="podium-wpm">{sorted[0].wpm} <span style={{fontSize:'14px'}}>WPM</span></div>
                        <div className="podium-name">{sorted[0].playerName}</div>
                        <div className="podium-rank">1ST</div>
                        <div className="podium-bar gold"></div>
                      </div>
                      <div className="podium-place third">
                        <div className="podium-icon">{sorted[2].profileIcon}</div>
                        <div className="podium-wpm">{sorted[2].wpm} <span style={{fontSize:'14px'}}>WPM</span></div>
                        <div className="podium-name">{sorted[2].playerName}</div>
                        <div className="podium-rank">3RD</div>
                        <div className="podium-bar bronze"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="stats-grid-page">
                  <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-value">{averageWpm}</div>
                    <div className="stat-label">AVG WPM</div>
                    <div className="stat-bar">
                      <div className="stat-bar-fill" style={{ width: bestWpm > 0 ? `${(averageWpm / bestWpm) * 100}%` : '0%' }}></div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🚀</div>
                    <div className="stat-value">{bestWpm}</div>
                    <div className="stat-label">BEST WPM</div>
                    <div className="stat-bar">
                      <div className="stat-bar-fill" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-value">{testHistory.length}</div>
                    <div className="stat-label">TESTS</div>
                    <div className="stat-bar">
                      <div className="stat-bar-fill" style={{ width: `${Math.min((testHistory.length / 20) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">✓</div>
                    <div className="stat-value">
                      {testHistory.length > 0 
                        ? Math.round(testHistory.reduce((sum, t) => sum + t.accuracy, 0) / testHistory.length)
                        : 0}%
                    </div>
                    <div className="stat-label">AVG ACCURACY</div>
                    <div className="stat-bar">
                      <div className="stat-bar-fill" style={{ 
                        width: testHistory.length > 0 
                          ? `${testHistory.reduce((sum, t) => sum + t.accuracy, 0) / testHistory.length}%` 
                          : '0%' 
                      }}></div>
                    </div>
                  </div>
                </div>

                <div className="history-section-page">
                  <div className="history-header">
                    <h3 className="section-title">📋 MATCH HISTORY</h3>
                    <button className="danger-btn" onClick={() => setShowClearConfirm(true)}>
                      <span></span>
                      <span></span>
                      <span>CLEAR ALL DATA</span>
                    </button>
                  </div>

                  <div className="history-filters">
                    <div className="filter-group">
                      <span className="filter-label">
                        LANGUAGE
                      </span>
                      <div className="filter-pills">
                        {[
                          { value: "all", label: "ALL" },
                          { value: "javascript", label: "JS"},
                          { value: "python", label: "PY"},
                          { value: "java", label: "JAVA"},
                          { value: "cpp", label: "C++"},
                          { value: "php", label: "PHP"},
                          { value: "text", label: "TEXT"},
                        ].map(({ value, label}) => (
                          <button
                            key={value}
                            className={`filter-pill ${statsFilterMode === value ? "active" : ""}`}
                            onClick={() => setStatsFilterMode(value)}
                          >
                            <span className="filter-pill-text">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="filter-group">
                      <span className="filter-label">
                        DURATION
                      </span>
                      <div className="filter-pills">
                        {[
                          { value: "all" as const, label: "ALL" },
                          { value: 15, label: "15s" },
                          { value: 30, label: "30s" },
                          { value: 60, label: "60s" },
                          { value: 120, label: "120s" }
                        ].map(({ value, label }) => (
                          <button
                            key={value}
                            className={`filter-pill ${statsFilterDuration === value ? "active" : ""}`}
                            onClick={() => setStatsFilterDuration(value)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="empty-filter-state">
                      <p className="empty-state-icon">🔍</p>
                      <p className="empty-state-text">No matches found for the selected filters.</p>
                      <button className="filter-reset-btn" onClick={() => {
                        setStatsFilterMode("all");
                        setStatsFilterDuration("all");
                      }}>
                        RESET FILTERS
                      </button>
                    </div>
                  ) : (
                    <div className="history-list">
                      {filtered.map((test, index) => (
                        <div 
                          key={index} 
                          className="history-item"
                          onClick={() => setSelectedGame(test)}
                        >
                          <div className="history-rank">#{index + 1}</div>
                          <div className="history-icon">{test.profileIcon}</div>
                          <div className="history-name">{test.playerName}</div>
                          <div className="history-wpm">{test.wpm} WPM</div>
                          <div className="history-details">
                            <span className="history-accuracy">{test.accuracy}%</span>
                            <span className="history-badge mode-badge">{getModeLabel(test.mode)}</span>
                            <span className="history-badge duration-badge">{test.selectedDuration ?? test.duration}s</span>
                            <span className="history-date">{new Date(test.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-text">
          <button 
            className="footer-link" 
            onClick={() => setShowTerms(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Terms
          </button>
          <span className="footer-separator">|</span>
          <button 
            className="footer-link" 
            onClick={() => setShowPrivacy(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Privacy
          </button>
        </div>
        <div className="footer-version">v1.0.0</div>
      </footer>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}

      {selectedGame && (
        <GameDetailModal 
          game={selectedGame} 
          onClose={() => setSelectedGame(null)} 
        />
      )}

      {showClearConfirm && (
        <ConfirmModal
          title="CLEAR ALL DATA"
          message="This will permanently delete all your test history and statistics. This action cannot be undone."
          confirmText="CLEAR DATA"
          cancelText="CANCEL"
          onConfirm={handleClearStats}
          onCancel={() => setShowClearConfirm(false)}
          isDanger={true}
        />
      )}
    </div>
  );
};
import type { TestResult } from '../../types';

interface StatsModalProps {
  testHistory: TestResult[];
  statsFilterMode: string;
  statsFilterDuration: number | "all";
  onClose: () => void;
  onFilterModeChange: (mode: string) => void;
  onFilterDurationChange: (duration: number | "all") => void;
  onGameClick: (game: TestResult) => void;
}

export const StatsModal = ({
  testHistory,
  statsFilterMode,
  statsFilterDuration,
  onClose,
  onFilterModeChange,
  onFilterDurationChange,
  onGameClick,
}: StatsModalProps) => {
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal stats-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">PERFORMANCE STATS</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="close-x">×</span>
          </button>
        </div>

        <div className="stats-modal-content">
          {filtered.length >= 3 && (
            <div className="podium-section">
              <h3 className="section-title">TOP 3 CHAMPIONS</h3>
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

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{averageWpm}</div>
              <div className="stat-label">AVG WPM</div>
              <div className="stat-bar">
                <div className="stat-bar-fill" style={{ width: bestWpm > 0 ? `${(averageWpm / bestWpm) * 100}%` : '0%' }}></div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{testHistory.length}</div>
              <div className="stat-label">TESTS</div>
              <div className="stat-bar">
                <div className="stat-bar-fill" style={{ width: `${Math.min((testHistory.length / 20) * 100, 100)}%` }}></div>
              </div>
            </div>
            <div className="stat-card">
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

          <div className="history-section">
            <div className="history-filters">
              <div className="filter-group">
                <span className="filter-label">LANGUAGE</span>
                <div className="filter-pills">
                  {["all", "javascript", "python", "java", "cpp", "php", "text"].map(m => (
                    <button
                      key={m}
                      className={`filter-pill ${statsFilterMode === m ? "active" : ""}`}
                      onClick={() => onFilterModeChange(m)}
                    >
                      {m === "all" ? "ALL" : m === "cpp" ? "C++" : m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <span className="filter-label">DURATION</span>
                <div className="filter-pills">
                  {(["all", 15, 30, 60, 120] as const).map(d => (
                    <button
                      key={d}
                      className={`filter-pill ${statsFilterDuration === d ? "active" : ""}`}
                      onClick={() => onFilterDurationChange(d)}
                    >
                      {d === "all" ? "ALL" : `${d}s`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="section-title">RECENT MATCHES</h3>
            {filtered.length === 0 ? (
              <p className="empty-state">No matches found for the selected filters.</p>
            ) : (
              <div className="history-list">
                {filtered.map((test, index) => (
                  <div 
                    key={index} 
                    className="history-item"
                    onClick={() => onGameClick(test)}
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
        </div>
      </div>
    </div>
  );
};

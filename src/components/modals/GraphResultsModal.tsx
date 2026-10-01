import { WpmGraph } from '../WpmGraph';
import type { TestResult, WpmDataPoint } from '../../types';

interface GraphResultsModalProps {
  pendingResult: Omit<TestResult, "playerName" | "profileIcon">;
  wpmHistory: WpmDataPoint[];
  maxCombo: number;
  elapsedTime: number;
  onContinue: () => void;
  onSkip: () => void;
}

export const GraphResultsModal = ({
  pendingResult,
  wpmHistory,
  maxCombo,
  elapsedTime,
  onContinue,
  onSkip,
}: GraphResultsModalProps) => {
  return (
    <div className="modal-overlay" onClick={onSkip}>
      <div className="modal graph-results-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">PERFORMANCE ANALYSIS</h2>
        </div>
        <div className="graph-results-content">
          <div className="results-summary">
            <div className="summary-stat">
              <div className="summary-label">FINAL SPEED</div>
              <div className="summary-value">{pendingResult.wpm} WPM</div>
            </div>
            <div className="summary-stat">
              <div className="summary-label">ACCURACY</div>
              <div className="summary-value">{pendingResult.accuracy}%</div>
            </div>
            <div className="summary-stat">
              <div className="summary-label">ERRORS</div>
              <div className="summary-value">{pendingResult.errors}</div>
            </div>
            <div className="summary-stat">
              <div className="summary-label">MAX COMBO</div>
              <div className="summary-value">{maxCombo}</div>
            </div>
          </div>

          <WpmGraph data={wpmHistory} duration={elapsedTime} />

          <div className="graph-actions">
            <button className="game-btn primary" onClick={onContinue}>
              <span className="btn-text">CONTINUE</span>
            </button>
            <button className="game-btn danger" onClick={onSkip}>
              <span className="btn-text">SKIP SAVE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

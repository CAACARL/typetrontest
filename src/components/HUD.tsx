interface HUDProps {
  timeLeft: number;
  wpm: number;
  accuracy: number;
  errors: number;
  isFinished: boolean;
  bestWpm: number;
}

export const HUD = ({ timeLeft, wpm, accuracy, errors, isFinished, bestWpm }: HUDProps) => {
  return (
    <div className="hud">
      {isFinished && (
        <div className="hud-complete-message">
          <div className="complete-title">RACE COMPLETE</div>
          {wpm > bestWpm && bestWpm > 0 && (
            <div className="complete-record">NEW RECORD!</div>
          )}
        </div>
      )}
      <div className="hud-item">
        <div className="hud-label">TIME</div>
        <div className="hud-value">{timeLeft}s</div>
      </div>
      <div className="hud-item highlight">
        <div className="hud-label">SPEED</div>
        <div className="hud-value">{wpm}</div>
      </div>
      <div className="hud-item">
        <div className="hud-label">ACCURACY</div>
        <div className="hud-value">{accuracy}%</div>
      </div>
      <div className="hud-item">
        <div className="hud-label">ERRORS</div>
        <div className="hud-value">{errors}</div>
      </div>
    </div>
  );
};

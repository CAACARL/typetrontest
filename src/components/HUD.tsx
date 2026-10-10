interface HUDProps {
  timeLeft: number;
  wpm: number;
  accuracy: number;
  errors: number;
  isFinished: boolean;
  bestWpm: number;
  isNewRecord: boolean;
}

export const HUD = ({ timeLeft, wpm, accuracy, errors, isFinished, isNewRecord }: HUDProps) => {
  if (isFinished) {
    return (
      <div className="hud-complete-message">
        <div className="complete-title">RACE COMPLETE</div>
        {isNewRecord && (
          <div className="complete-record">NEW RECORD!</div>
        )}
      </div>
    );
  }

  return (
    <div className="hud">
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

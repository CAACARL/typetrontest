import { useRef, useEffect } from 'react';

interface TypingAreaProps {
  isStarted: boolean;
  isFinished: boolean;
  targetText: string;
  userInput: string;
  visibleStartIndex: number;
  onInputChange: (value: string) => void;
  onRestart: () => void;
  onQuit: () => void;
  maxCombo: number;
  wpm: number;
  accuracy: number;
  errors: number;
  elapsedTime: number;
}

export const TypingArea = ({
  isStarted,
  isFinished,
  targetText,
  userInput,
  visibleStartIndex,
  onInputChange,
  onRestart,
  onQuit,
  maxCombo,
  wpm,
  accuracy,
  errors,
  elapsedTime,
}: TypingAreaProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when test starts
  useEffect(() => {
    if (isStarted && !isFinished) {
      inputRef.current?.focus();
    }
  }, [isStarted, isFinished]);

  const charsPerLine = 60;
  const startChar = visibleStartIndex * charsPerLine;
  const endChar = startChar + (charsPerLine * 3);
  const visibleText = targetText.slice(startChar, endChar);

  return (
    <div className="typing-area" onClick={() => inputRef.current?.focus()}>
      <div className="text-display">
        {visibleText.split("").map((character, index) => {
          const actualIndex = startChar + index;
          const typedCharacter = userInput[actualIndex];
          let className = "char";

          if (typedCharacter === undefined) {
            className = "char pending";
          } else if (typedCharacter === character) {
            className = "char correct";
          } else {
            className = "char incorrect";
          }

          if (actualIndex === userInput.length && isStarted) {
            className += " current";
          }

          return (
            <span key={actualIndex} className={className}>
              {character}
            </span>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="text"
        className="hidden-input"
        value={userInput}
        maxLength={targetText.length}
        onChange={(e) => onInputChange(e.target.value)}
        autoFocus
        disabled={!isStarted || isFinished}
      />

      {(isStarted || isFinished) && (
        <div className="typing-controls">
          <button className="game-btn secondary" onClick={onRestart}>
            <span className="btn-text">RESTART</span>
            <span className="btn-glow"></span>
          </button>
          <button className="game-btn danger" onClick={onQuit}>
            <span className="btn-text">QUIT</span>
            <span className="btn-glow"></span>
          </button>
        </div>
      )}

      {isFinished && (
        <div className="results">
          <div className="results-grid">
            <div className="result-card">
              <div className="result-label">WPM</div>
              <div className="result-value primary">{wpm}</div>
            </div>
            <div className="result-card">
              <div className="result-label">ACCURACY</div>
              <div className="result-value">{accuracy}%</div>
            </div>
            <div className="result-card">
              <div className="result-label">ERRORS</div>
              <div className="result-value">{errors}</div>
            </div>
            <div className="result-card">
              <div className="result-label">TIME</div>
              <div className="result-value">{elapsedTime}s</div>
            </div>
            <div className="result-card">
              <div className="result-label">MAX COMBO</div>
              <div className="result-value">{maxCombo}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

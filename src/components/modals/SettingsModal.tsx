interface SettingsModalProps {
  mode: string;
  difficulty: string;
  soundEnabled: boolean;
  onClose: () => void;
  onModeChange: (mode: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onSoundToggle: (enabled: boolean) => void;
  playSound: (frequency: number, duration: number, type: OscillatorType) => void;
}

export const SettingsModal = ({
  mode,
  difficulty,
  soundEnabled,
  onClose,
  onModeChange,
  onDifficultyChange,
  onSoundToggle,
  playSound,
}: SettingsModalProps) => {
  const modes = [
    { id: "javascript", label: "JAVASCRIPT" },
    { id: "python", label: "PYTHON" },
    { id: "java", label: "JAVA" },
    { id: "cpp", label: "C++" },
    { id: "php", label: "PHP" },
    { id: "text", label: "TEXT" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">CONFIGURATION</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="close-x">×</span>
          </button>
        </div>
        <div className="settings-section">
          <div className="setting-group">
            <label className="setting-label">MODE</label>
            <div className="button-group mode-grid">
              {modes.map(m => (
                <button
                  key={m.id}
                  className={`config-btn ${mode === m.id ? "active" : ""}`}
                  onClick={() => onModeChange(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          
          {mode === "text" && (
            <div className="setting-group">
              <label className="setting-label">DIFFICULTY LEVEL</label>
              <div className="button-group">
                {["easy", "medium", "hard"].map(d => (
                  <button
                    key={d}
                    className={`config-btn ${difficulty === d ? "active" : ""}`}
                    onClick={() => onDifficultyChange(d)}
                  >
                    {d.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="setting-group">
            <label className="setting-label">AUDIO FEEDBACK</label>
            <div className="button-group">
              <button
                className={`config-btn ${soundEnabled ? "active" : ""}`}
                onClick={() => {
                  onSoundToggle(true);
                  playSound(600, 0.1, "square");
                }}
              >
                ENABLED
              </button>
              <button
                className={`config-btn ${!soundEnabled ? "active" : ""}`}
                onClick={() => onSoundToggle(false)}
              >
                DISABLED
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

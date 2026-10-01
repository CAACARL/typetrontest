const profileIcons = ["👤", "🎮", "⚡", "🔥", "💎", "🌟", "🚀", "🎯", "👾", "🤖", "🦾", "💀"];

interface NameInputModalProps {
  playerName: string;
  selectedIcon: string;
  onNameChange: (name: string) => void;
  onIconSelect: (icon: string) => void;
  onSave: () => void;
  onSkip: () => void;
  canSave: boolean;
}

export const NameInputModal = ({
  playerName,
  selectedIcon,
  onNameChange,
  onIconSelect,
  onSave,
  onSkip,
  canSave,
}: NameInputModalProps) => {
  return (
    <div className="modal-overlay" onClick={onSkip}>
      <div className="modal name-input-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">SAVE YOUR SCORE</h2>
        </div>
        <div className="name-input-content">
          <p className="input-label">Enter your name</p>
          <input
            type="text"
            className="name-input"
            value={playerName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Player name..."
            maxLength={20}
            autoFocus
          />
          <p className="input-label">Select your profile icon</p>
          <div className="icon-grid">
            {profileIcons.map((icon) => (
              <button
                key={icon}
                className={`icon-btn ${selectedIcon === icon ? "active" : ""}`}
                onClick={() => onIconSelect(icon)}
              >
                {icon}
              </button>
            ))}
          </div>
          <div className="input-buttons">
            <button className="game-btn danger" onClick={onSkip}>
              <span className="btn-text">SKIP</span>
            </button>
            <button
              className="game-btn primary"
              onClick={onSave}
              disabled={!canSave}
            >
              <span className="btn-text">SAVE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

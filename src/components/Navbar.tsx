interface NavbarProps {
  onShowSettings: () => void;
  onNavigateStats: () => void;
  isGameActive?: boolean;
}

export const Navbar = ({ onShowSettings, onNavigateStats }: NavbarProps) => {
  return (
    <header className="navbar">
      <div className="logo">
        <div className="logo-bracket">[</div>
        <span className="logo-text">TYPE<span className="logo-finale" data-text="TRON">TRON</span><span className="logo-text">TEST</span></span>
        <div className="logo-bracket">]</div>
      </div>

      <nav className="nav-menu">
        <button className="nav-btn" onClick={onNavigateStats}>
          <span className="btn-label">STATS</span>
          <span className="btn-underline"></span>
        </button>
        <button className="nav-btn" onClick={onShowSettings}>
          <span className="btn-label">CONFIG</span>
          <span className="btn-underline"></span>
        </button>
      </nav>
    </header>
  );
};

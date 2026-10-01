import { Link } from "react-router-dom";
import "../App.css";

export const PrivacyPage = () => {
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
        <div className="legal-page">
          <h1 className="legal-title">PRIVACY POLICY</h1>
          
          <div className="legal-content">
            <p className="legal-text legal-updated">Last Updated: October 1, 2026</p>

            <h2 className="legal-subtitle">1. Information We Collect</h2>
            <p className="legal-text">
              TypeTronTest does not collect, transmit, or store any personal information on
              external servers. All data is stored locally in your browser using localStorage.
            </p>

            <h2 className="legal-subtitle">2. Local Data Storage</h2>
            <p className="legal-text">
              The following data is stored locally in your browser:
            </p>
            <ul className="legal-list">
              <li>Typing test statistics (WPM, accuracy, errors)</li>
              <li>Game history and results</li>
              <li>User preferences (sound settings, difficulty, mode)</li>
              <li>Player names and profile icons (if provided)</li>
            </ul>

            <h2 className="legal-subtitle">3. Data Control</h2>
            <p className="legal-text">
              You have complete control over your data. You can clear all stored data at any
              time through the settings menu or by clearing your browser's localStorage.
            </p>

            <h2 className="legal-subtitle">4. Third-Party Services</h2>
            <p className="legal-text">
              TypeTronTest does not use any third-party analytics, tracking, or advertising
              services. No data is shared with external parties.
            </p>

            <h2 className="legal-subtitle">5. Cookies</h2>
            <p className="legal-text">
              This application does not use cookies. All data storage is handled through
              browser localStorage API.
            </p>

            <h2 className="legal-subtitle">6. Children's Privacy</h2>
            <p className="legal-text">
              TypeTronTest does not knowingly collect any information from anyone. Since all
              data remains local to the user's browser, there is no data collection process.
            </p>

            <h2 className="legal-subtitle">7. Changes to Privacy Policy</h2>
            <p className="legal-text">
              We may update this Privacy Policy from time to time. Any changes will be posted
              on this page with an updated revision date.
            </p>

            <h2 className="legal-subtitle">8. Contact</h2>
            <p className="legal-text">
              For questions about this Privacy Policy, please visit the project repository on
              GitHub.
            </p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-text">
          <Link to="/terms" className="footer-link">Terms</Link>
          <span className="footer-separator">|</span>
          <Link to="/privacy" className="footer-link">Privacy</Link>
        </div>
        <div className="footer-version">v1.0.0</div>
      </footer>
    </div>
  );
};

import { Link } from "react-router-dom";
import "../App.css";

export const TermsPage = () => {
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
          <h1 className="legal-title">TERMS OF SERVICE</h1>
          
          <div className="legal-content">
            <h2 className="legal-subtitle">1. Acceptance of Terms</h2>
            <p className="legal-text">
              By accessing and using TypeTronTest, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>

            <h2 className="legal-subtitle">2. Use License</h2>
            <p className="legal-text">
              TypeTronTest is provided as an open-source project under the MIT License. You are
              free to use, modify, and distribute the software according to the terms of the
              MIT License.
            </p>

            <h2 className="legal-subtitle">3. User Data</h2>
            <p className="legal-text">
              All typing test data, statistics, and preferences are stored locally in your
              browser's localStorage. We do not collect, transmit, or store any personal
              information on external servers.
            </p>

            <h2 className="legal-subtitle">4. Disclaimer</h2>
            <p className="legal-text">
              The application is provided "as is" without warranty of any kind, either expressed
              or implied. We do not guarantee that the service will be uninterrupted or
              error-free.
            </p>

            <h2 className="legal-subtitle">5. Modifications</h2>
            <p className="legal-text">
              We reserve the right to modify or replace these Terms at any time. Continued use
              of the application following any changes constitutes acceptance of those changes.
            </p>

            <h2 className="legal-subtitle">6. Contact</h2>
            <p className="legal-text">
              For questions about these Terms, please visit the project repository on GitHub.
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

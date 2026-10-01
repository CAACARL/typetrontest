interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal = ({ onClose }: PrivacyModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal legal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">PRIVACY POLICY</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="close-x">×</span>
          </button>
        </div>
        <div className="legal-modal-content">
          <p className="legal-modal-updated">Last Updated: October 1, 2026</p>

          <h3 className="legal-modal-subtitle">1. Information We Collect</h3>
          <p className="legal-modal-text">
            TypeTronTest does not collect, transmit, or store any personal information on
            external servers. All data is stored locally in your browser using localStorage.
          </p>

          <h3 className="legal-modal-subtitle">2. Local Data Storage</h3>
          <p className="legal-modal-text">
            The following data is stored locally in your browser:
          </p>
          <ul className="legal-modal-list">
            <li>Typing test statistics (WPM, accuracy, errors)</li>
            <li>Game history and results</li>
            <li>User preferences (sound settings, difficulty, mode)</li>
            <li>Player names and profile icons (if provided)</li>
          </ul>

          <h3 className="legal-modal-subtitle">3. Data Control</h3>
          <p className="legal-modal-text">
            You have complete control over your data. You can clear all stored data at any
            time through the settings menu or by clearing your browser's localStorage.
          </p>

          <h3 className="legal-modal-subtitle">4. Third-Party Services</h3>
          <p className="legal-modal-text">
            TypeTronTest does not use any third-party analytics, tracking, or advertising
            services. No data is shared with external parties.
          </p>

          <h3 className="legal-modal-subtitle">5. Cookies</h3>
          <p className="legal-modal-text">
            This application does not use cookies. All data storage is handled through
            browser localStorage API.
          </p>

          <h3 className="legal-modal-subtitle">6. Children's Privacy</h3>
          <p className="legal-modal-text">
            TypeTronTest does not knowingly collect any information from anyone. Since all
            data remains local to the user's browser, there is no data collection process.
          </p>

          <h3 className="legal-modal-subtitle">7. Changes to Privacy Policy</h3>
          <p className="legal-modal-text">
            We may update this Privacy Policy from time to time. Any changes will be posted
            on this page with an updated revision date.
          </p>

          <h3 className="legal-modal-subtitle">8. Contact</h3>
          <p className="legal-modal-text">
            For questions about this Privacy Policy, please visit the project repository on
            GitHub.
          </p>
        </div>
      </div>
    </div>
  );
};

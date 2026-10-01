interface TermsModalProps {
  onClose: () => void;
}

export const TermsModal = ({ onClose }: TermsModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal legal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">TERMS OF SERVICE</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="close-x">×</span>
          </button>
        </div>
        <div className="legal-modal-content">
          <h3 className="legal-modal-subtitle">1. Acceptance of Terms</h3>
          <p className="legal-modal-text">
            By accessing and using TypeTronTest, you accept and agree to be bound by the terms
            and provision of this agreement.
          </p>

          <h3 className="legal-modal-subtitle">2. Use License</h3>
          <p className="legal-modal-text">
            TypeTronTest is provided as an open-source project under the MIT License. You are
            free to use, modify, and distribute the software according to the terms of the
            MIT License.
          </p>

          <h3 className="legal-modal-subtitle">3. User Data</h3>
          <p className="legal-modal-text">
            All typing test data, statistics, and preferences are stored locally in your
            browser's localStorage. We do not collect, transmit, or store any personal
            information on external servers.
          </p>

          <h3 className="legal-modal-subtitle">4. Disclaimer</h3>
          <p className="legal-modal-text">
            The application is provided "as is" without warranty of any kind, either expressed
            or implied. We do not guarantee that the service will be uninterrupted or
            error-free.
          </p>

          <h3 className="legal-modal-subtitle">5. Modifications</h3>
          <p className="legal-modal-text">
            We reserve the right to modify or replace these Terms at any time. Continued use
            of the application following any changes constitutes acceptance of those changes.
          </p>

          <h3 className="legal-modal-subtitle">6. Contact</h3>
          <p className="legal-modal-text">
            For questions about these Terms, please visit the project repository on GitHub.
          </p>
        </div>
      </div>
    </div>
  );
};

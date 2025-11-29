import '../styles/components/Footer.css'

/**
 * Footer Component
 * Professional footer with project information and links
 * 
 * @returns {JSX.Element} Footer component
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">PredictMyFight</h3>
          <p className="footer-description">
            A machine learning-based web application for predicting MMA fight outcomes 
            using historical fighter statistics.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Project</h4>
          <ul className="footer-links">
            <li><a href="#about">About</a></li>
            <li><a href="#methodology">Methodology</a></li>
            <li><a href="#features">Features</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Resources</h4>
          <ul className="footer-links">
            <li>
              <a 
                href="https://github.com/sammanbasnet/predictmyfight" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </li>
            <li>
              <a href="/ARCHITECTURE.md" target="_blank" rel="noopener noreferrer">
                Architecture
              </a>
            </li>
            <li>
              <a href="/METHODOLOGY.md" target="_blank" rel="noopener noreferrer">
                Methodology
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Technologies</h4>
          <div className="tech-badges">
            <span className="tech-badge">React</span>
            <span className="tech-badge">Vite</span>
            <span className="tech-badge">Recharts</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} PredictMyFight. Academic Thesis Project.
        </p>
        <p className="footer-author">
          Developed by <strong>Samman Basnet</strong>
        </p>
      </div>
    </footer>
  )
}

export default Footer


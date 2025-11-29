import { Link } from 'react-router-dom'
import '../styles/components/Navbar.css'

/**
 * Navbar Component
 * Navigation bar for the application
 * 
 * @returns {JSX.Element} Navbar component
 */
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img 
            src="/logo.png" 
            alt="PredictMyFight Logo" 
            className="logo-image"
            onError={(e) => {
              // Fallback to text if image doesn't load
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <span className="logo-text">Predict My Fight</span>
          <span className="logo-text-fallback" style={{ display: 'none' }}>
            <span className="logo-icon">🥊</span>
            <span className="logo-text">PredictMyFight</span>
          </span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar


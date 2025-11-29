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
          <span className="logo-icon">🥊</span>
          <span className="logo-text">PredictMyFight</span>
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


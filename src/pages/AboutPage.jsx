import About from '../components/About'
import '../styles/pages/AboutPage.css'

/**
 * About Page Component
 * Separate page for About section
 * 
 * @returns {JSX.Element} About page component
 */
function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-page-container">
        <About />
      </div>
    </div>
  )
}

export default AboutPage


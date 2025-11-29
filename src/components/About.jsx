import '../styles/components/About.css'

/**
 * About Component
 * Displays information about the PredictMyFight project
 * 
 * @returns {JSX.Element} About component
 */
function About() {
  return (
    <div className="about-section" id="about">
      <div className="about-container">
        <h2 className="about-title">About PredictMyFight</h2>
        
        <div className="about-content">
          <div className="about-text">
            <p>
              PredictMyFight is a web application designed to predict Mixed Martial Arts (MMA) 
              fight outcomes using historical fighter statistics and advanced algorithms.
            </p>
            
            <p>
              The system analyzes multiple performance metrics including win rates, knockout rates, 
              submission rates, striking accuracy, and takedown accuracy to generate accurate 
              predictions with confidence levels.
            </p>
            
            <h3>How It Works</h3>
            <p>
              Our prediction algorithm uses a weighted scoring system that evaluates fighters across 
              five key performance metrics. Each metric is assigned a specific weight based on its 
              importance in determining fight outcomes:
            </p>
            
            <ul className="about-list">
              <li><strong>Win Rate (25%)</strong> - Overall performance indicator</li>
              <li><strong>Finishing Rate (20%)</strong> - Ability to finish fights</li>
              <li><strong>KO Rate (15%)</strong> - Knockout power and finishing ability</li>
              <li><strong>Submission Rate (10%)</strong> - Grappling proficiency</li>
              <li><strong>Striking Accuracy (15%)</strong> - Technical striking ability</li>
              <li><strong>Takedown Accuracy (10%)</strong> - Wrestling and control ability</li>
            </ul>
            
            <h3>Features</h3>
            <ul className="about-list">
              <li>Comprehensive fighter database with current UFC fighters</li>
              <li>Weight class filtering for accurate matchups</li>
              <li>Interactive stat comparison charts</li>
              <li>Detailed prediction breakdowns</li>
              <li>Confidence level indicators</li>
              <li>Side-by-side fighter comparison tables</li>
            </ul>
            
            <h3>Project Information</h3>
            <p>
              This project was developed as part of a final year thesis project, demonstrating 
              the application of statistical analysis and web development technologies to create 
              a practical prediction system for combat sports.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About


import { useState } from 'react'
import '../styles/App.css'
import FighterSelector from '../components/FighterSelector'
import FighterStats from '../components/FighterStats'
import PredictionResult from '../components/PredictionResult'
import ErrorNotification from '../components/ErrorNotification'
import { predictFight } from '../utils/prediction'

/**
 * Home Page Component
 * Main prediction interface
 * 
 * @returns {JSX.Element} Home page component
 */
function Home() {
  const [fighter1, setFighter1] = useState(null)
  const [fighter2, setFighter2] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Handles the prediction generation process
   * Validates inputs and generates fight prediction
   */
  const handlePredict = () => {
    // Clear previous errors
    setError(null)

    // Validation
    if (!fighter1 || !fighter2) {
      setError('Please select both fighters to generate a prediction.')
      return
    }

    if (fighter1.id === fighter2.id) {
      setError('Please select two different fighters.')
      return
    }

    // Warn if fighters are from different weight classes (but allow it)
    if (fighter1.weightClass !== fighter2.weightClass) {
      // Show a warning but don't block - cross-weight class fights are possible
      console.warn(`Cross-weight class fight: ${fighter1.weightClass} vs ${fighter2.weightClass}`)
    }

    // Generate prediction with loading state
    setIsLoading(true)
    
    // Simulate slight delay for better UX (optional)
    setTimeout(() => {
      try {
        const prediction = predictFight(fighter1, fighter2)
        setPrediction(prediction)
        setIsLoading(false)
        
        // Scroll to results
        setTimeout(() => {
          const resultsElement = document.querySelector('.prediction-result')
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      } catch (err) {
        setError('An error occurred while generating the prediction. Please try again.')
        setIsLoading(false)
      }
    }, 300)
  }

  /**
   * Handles fighter selection and clears prediction when fighters change
   * @param {Function} setFighter - State setter function
   * @param {Object|null} fighter - Selected fighter object
   */
  const handleFighterChange = (setFighter, fighter) => {
    setFighter(fighter)
    // Clear prediction when fighters change
    if (prediction) {
      setPrediction(null)
    }
    // Clear errors
    if (error) {
      setError(null)
    }
  }

  return (
    <>
      <ErrorNotification 
        message={error} 
        onClose={() => setError(null)} 
      />

      <header className="app-header">
        <h1 className="app-title">PredictMyFight</h1>
        <p className="app-subtitle">
          Machine Learning-Based Prediction System for MMA Fight Outcomes
        </p>
        <p className="app-description">
          Analyze historical fighter statistics and predict fight outcomes using 
          advanced weighted algorithms and statistical analysis.
        </p>
      </header>

      <main className="app-main">
        <div className="fighters-container">
          <div className="fighter-section">
            <h2>Fighter 1</h2>
            <FighterSelector
              selectedFighter={fighter1}
              onSelectFighter={(fighter) => handleFighterChange(setFighter1, fighter)}
            />
            {fighter1 && <FighterStats fighter={fighter1} />}
          </div>

          <div className="vs-divider">
            <span className="vs-text">VS</span>
          </div>

          <div className="fighter-section">
            <h2>Fighter 2</h2>
            <FighterSelector
              selectedFighter={fighter2}
              onSelectFighter={(fighter) => handleFighterChange(setFighter2, fighter)}
            />
            {fighter2 && <FighterStats fighter={fighter2} />}
          </div>
        </div>

        <button 
          className={`predict-button ${isLoading ? 'loading' : ''}`}
          onClick={handlePredict}
          disabled={!fighter1 || !fighter2 || isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Analyzing...
            </>
          ) : (
            'Predict Winner'
          )}
        </button>

        {prediction && (
          <PredictionResult 
            prediction={prediction} 
            fighter1={fighter1}
            fighter2={fighter2}
          />
        )}
      </main>
    </>
  )
}

export default Home


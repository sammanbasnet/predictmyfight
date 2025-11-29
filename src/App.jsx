import { useState } from 'react'
import './styles/App.css'
import FighterSelector from './components/FighterSelector'
import FighterStats from './components/FighterStats'
import PredictionResult from './components/PredictionResult'
import { predictFight } from './utils/prediction'

function App() {
  const [fighter1, setFighter1] = useState(null)
  const [fighter2, setFighter2] = useState(null)
  const [prediction, setPrediction] = useState(null)

  const handlePredict = () => {
    if (!fighter1 || !fighter2) {
      alert('Please select both fighters!')
      return
    }

    const prediction = predictFight(fighter1, fighter2)
    setPrediction(prediction)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">PredictMyFight</h1>
        <p className="app-subtitle">Predict MMA Fight Outcomes Using Historical Fighter Stats</p>
      </header>

      <main className="app-main">
        <div className="fighters-container">
          <div className="fighter-section">
            <h2>Fighter 1</h2>
            <FighterSelector
              selectedFighter={fighter1}
              onSelectFighter={setFighter1}
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
              onSelectFighter={setFighter2}
            />
            {fighter2 && <FighterStats fighter={fighter2} />}
          </div>
        </div>

        <button 
          className="predict-button"
          onClick={handlePredict}
          disabled={!fighter1 || !fighter2}
        >
          Predict Winner
        </button>

        {prediction && <PredictionResult prediction={prediction} />}
      </main>
    </div>
  )
}

export default App


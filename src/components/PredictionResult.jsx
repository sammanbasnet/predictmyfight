import '../styles/components/PredictionResult.css'

function PredictionResult({ prediction }) {
  const fighter1Prob = parseFloat(prediction.fighter1.probability)
  const fighter2Prob = parseFloat(prediction.fighter2.probability)

  return (
    <div className="prediction-result">
      <h2 className="prediction-title">Prediction Result</h2>
      
      <div className="prediction-content">
        <div className="probability-card">
          <div className="fighter-name-large">{prediction.fighter1.name}</div>
          <div className="probability-value">{fighter1Prob}%</div>
          <div className="probability-bar-container">
            <div 
              className="probability-bar fighter1-bar"
              style={{ width: `${fighter1Prob}%` }}
            ></div>
          </div>
        </div>

        <div className="vs-divider-small">VS</div>

        <div className="probability-card">
          <div className="fighter-name-large">{prediction.fighter2.name}</div>
          <div className="probability-value">{fighter2Prob}%</div>
          <div className="probability-bar-container">
            <div 
              className="probability-bar fighter2-bar"
              style={{ width: `${fighter2Prob}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="winner-announcement">
        <div className="winner-label">Predicted Winner</div>
        <div className="winner-name">{prediction.winner}</div>
        <div className="confidence-level">
          Confidence: {Math.max(fighter1Prob, fighter2Prob).toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

export default PredictionResult


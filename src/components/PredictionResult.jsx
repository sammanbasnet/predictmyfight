import '../styles/components/PredictionResult.css'
import StatComparisonChart from './StatComparisonChart'
import PredictionBreakdown from './PredictionBreakdown'
import FighterComparisonTable from './FighterComparisonTable'
import FighterPhoto from './FighterPhoto'

function PredictionResult({ prediction, fighter1, fighter2 }) {
  const fighter1Prob = parseFloat(prediction.fighter1.probability)
  const fighter2Prob = parseFloat(prediction.fighter2.probability)

  return (
    <div className="prediction-result">
      <h2 className="prediction-title">Prediction Result</h2>
      
      <div className="prediction-content">
        <div className="probability-card">
          <FighterPhoto fighterName={prediction.fighter1.name} size="xlarge" className="prediction-photo" />
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
          <FighterPhoto fighterName={prediction.fighter2.name} size="xlarge" className="prediction-photo" />
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

      {/* Fighter Comparison Table */}
      <FighterComparisonTable fighter1={fighter1} fighter2={fighter2} />

      {/* Stat Comparison Charts */}
      <StatComparisonChart fighter1={fighter1} fighter2={fighter2} />

      {/* Detailed Prediction Breakdown */}
      <PredictionBreakdown 
        prediction={prediction} 
        fighter1={fighter1}
        fighter2={fighter2}
      />
    </div>
  )
}

export default PredictionResult


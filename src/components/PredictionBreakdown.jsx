import '../styles/components/PredictionBreakdown.css'

function PredictionBreakdown({ prediction, fighter1, fighter2 }) {
  const winnerAdvantages = prediction.advantages.filter(adv => adv.fighter === prediction.winner)
  const loserAdvantages = prediction.advantages.filter(adv => adv.fighter !== prediction.winner)

  return (
    <div className="prediction-breakdown">
      <h3 className="breakdown-title">Why {prediction.winner} is Predicted to Win</h3>
      
      <div className="confidence-badge">
        <span className="confidence-label">Confidence Level:</span>
        <span className={`confidence-value confidence-${prediction.confidenceLevel.toLowerCase().replace('-', '')}`}>
          {prediction.confidenceLevel}
        </span>
        <span className="confidence-detail">
          ({prediction.probabilityDiff}% probability difference)
        </span>
      </div>

      <div className="breakdown-content">
        <div className="advantages-section">
          <h4 className="section-title">
            {prediction.winner}'s Key Advantages
          </h4>
          <div className="advantages-list">
            {winnerAdvantages.slice(0, 5).map((advantage, index) => (
              <div key={index} className="advantage-item winner-advantage">
                <div className="advantage-header">
                  <span className="advantage-category">{advantage.category}</span>
                  <span className="advantage-value">+{advantage.advantage}</span>
                </div>
                <div className="advantage-comparison">
                  <span className="comparison-fighter">{fighter1.name}: {advantage.fighter1Value}</span>
                  <span className="comparison-vs">vs</span>
                  <span className="comparison-fighter">{fighter2.name}: {advantage.fighter2Value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {loserAdvantages.length > 0 && (
          <div className="advantages-section">
            <h4 className="section-title">
              {prediction.winner === fighter1.name ? fighter2.name : fighter1.name}'s Advantages
            </h4>
            <div className="advantages-list">
              {loserAdvantages.slice(0, 3).map((advantage, index) => (
                <div key={index} className="advantage-item loser-advantage">
                  <div className="advantage-header">
                    <span className="advantage-category">{advantage.category}</span>
                    <span className="advantage-value">+{advantage.advantage}</span>
                  </div>
                  <div className="advantage-comparison">
                    <span className="comparison-fighter">{fighter1.name}: {advantage.fighter1Value}</span>
                    <span className="comparison-vs">vs</span>
                    <span className="comparison-fighter">{fighter2.name}: {advantage.fighter2Value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="score-breakdown">
          <h4 className="section-title">Overall Score Breakdown</h4>
          <div className="score-items">
            <div className="score-item">
              <span className="score-fighter">{prediction.fighter1.name}</span>
              <div className="score-bar-container">
                <div 
                  className="score-bar fighter1-bar"
                  style={{ width: `${prediction.fighter1.probability}%` }}
                >
                  <span className="score-value">{prediction.fighter1.score}</span>
                </div>
              </div>
            </div>
            <div className="score-item">
              <span className="score-fighter">{prediction.fighter2.name}</span>
              <div className="score-bar-container">
                <div 
                  className="score-bar fighter2-bar"
                  style={{ width: `${prediction.fighter2.probability}%` }}
                >
                  <span className="score-value">{prediction.fighter2.score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictionBreakdown


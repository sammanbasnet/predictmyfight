import '../styles/components/FighterStats.css'
import FighterPhoto from './FighterPhoto'

function FighterStats({ fighter }) {
  const winRate = ((fighter.wins / (fighter.wins + fighter.losses)) * 100).toFixed(1)
  const koRate = fighter.wins > 0 ? ((fighter.knockouts / fighter.wins) * 100).toFixed(1) : 0
  const submissionRate = fighter.wins > 0 ? ((fighter.submissions / fighter.wins) * 100).toFixed(1) : 0

  return (
    <div className="fighter-stats">
      <div className="stats-header">
        <FighterPhoto fighterName={fighter.name} size="large" />
        <h3>{fighter.name}</h3>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Record</div>
          <div className="stat-value">
            {fighter.wins}-{fighter.losses}
          </div>
          <div className="stat-detail">Win Rate: {winRate}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Knockouts</div>
          <div className="stat-value">{fighter.knockouts}</div>
          <div className="stat-detail">KO Rate: {koRate}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Submissions</div>
          <div className="stat-value">{fighter.submissions}</div>
          <div className="stat-detail">Sub Rate: {submissionRate}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Striking Accuracy</div>
          <div className="stat-value">{fighter.strikingAccuracy}%</div>
          <div className="stat-bar">
            <div 
              className="stat-bar-fill"
              style={{ width: `${fighter.strikingAccuracy}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Takedown Accuracy</div>
          <div className="stat-value">{fighter.takedownAccuracy}%</div>
          <div className="stat-bar">
            <div 
              className="stat-bar-fill"
              style={{ width: `${fighter.takedownAccuracy}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FighterStats


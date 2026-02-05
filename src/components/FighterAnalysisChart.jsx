import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import '../styles/components/FighterAnalysisChart.css'

function FighterAnalysisChart({ fighter }) {
  // Calculate stats
  const winRate = parseFloat(((fighter.wins / (fighter.wins + fighter.losses)) * 100).toFixed(1))
  const koRate = fighter.wins > 0 ? parseFloat(((fighter.knockouts / fighter.wins) * 100).toFixed(1)) : 0
  const subRate = fighter.wins > 0 ? parseFloat(((fighter.submissions / fighter.wins) * 100).toFixed(1)) : 0
  const strikingAcc = fighter.strikingAccuracy || 0
  const takedownAcc = fighter.takedownAccuracy || 0

  // Prepare data for radar chart
  const radarData = [
    {
      category: 'Win Rate',
      value: winRate,
      fullMark: 100
    },
    {
      category: 'KO Rate',
      value: koRate,
      fullMark: 100
    },
    {
      category: 'Sub Rate',
      value: subRate,
      fullMark: 100
    },
    {
      category: 'Striking',
      value: strikingAcc,
      fullMark: 100
    },
    {
      category: 'Takedown',
      value: takedownAcc,
      fullMark: 100
    }
  ]

  // Prepare data for bar chart
  const barData = [
    {
      stat: 'Win Rate',
      value: winRate
    },
    {
      stat: 'KO Rate',
      value: koRate
    },
    {
      stat: 'Sub Rate',
      value: subRate
    },
    {
      stat: 'Striking',
      value: strikingAcc
    },
    {
      stat: 'Takedown',
      value: takedownAcc
    }
  ]

  // Determine strong points (above 60%)
  const strongPoints = []
  if (winRate >= 60) strongPoints.push({ name: 'Win Rate', value: winRate, description: 'Excellent win percentage' })
  if (koRate >= 60) strongPoints.push({ name: 'KO Rate', value: koRate, description: 'High knockout finishing ability' })
  if (subRate >= 60) strongPoints.push({ name: 'Sub Rate', value: subRate, description: 'Strong submission game' })
  if (strikingAcc >= 60) strongPoints.push({ name: 'Striking Accuracy', value: strikingAcc, description: 'Precise striking' })
  if (takedownAcc >= 60) strongPoints.push({ name: 'Takedown Accuracy', value: takedownAcc, description: 'Effective takedowns' })

  // Determine weak points (below 40%)
  const weakPoints = []
  if (winRate < 40 && fighter.wins + fighter.losses > 5) weakPoints.push({ name: 'Win Rate', value: winRate, description: 'Needs to improve overall performance' })
  if (koRate < 40 && fighter.wins > 0) weakPoints.push({ name: 'KO Rate', value: koRate, description: 'Low knockout rate' })
  if (subRate < 40 && fighter.wins > 0) weakPoints.push({ name: 'Sub Rate', value: subRate, description: 'Limited submission finishes' })
  if (strikingAcc < 40) weakPoints.push({ name: 'Striking Accuracy', value: strikingAcc, description: 'Striking accuracy needs work' })
  if (takedownAcc < 40) weakPoints.push({ name: 'Takedown Accuracy', value: takedownAcc, description: 'Takedown game needs improvement' })

  // Sort by value (highest first for strong, lowest first for weak)
  strongPoints.sort((a, b) => b.value - a.value)
  weakPoints.sort((a, b) => a.value - b.value)

  return (
    <div className="fighter-analysis-chart">
      <h3 className="analysis-title">Performance Analysis</h3>
      
      <div className="charts-section">
        {/* Radar Chart */}
        <div className="chart-wrapper">
          <h4 className="chart-subtitle">Radar Chart</h4>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fill: '#ffffff', fontSize: 13, fontWeight: 600 }} 
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: '#888', fontSize: 11 }} 
              />
              <Radar
                name={fighter.name}
                dataKey="value"
                stroke="#d20a0a"
                fill="#d20a0a"
                fillOpacity={0.7}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '2px solid #d20a0a',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: 600
                }}
                formatter={(value) => `${value}%`}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-wrapper">
          <h4 className="chart-subtitle">Bar Chart</h4>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="stat" 
                tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 600 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: '#ffffff', fontSize: 12 }}
                domain={[0, 100]}
                label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#ffffff', style: { fontWeight: 600 } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '2px solid #d20a0a',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: 600
                }}
                formatter={(value) => `${value}%`}
              />
              <Bar 
                dataKey="value" 
                fill="#d20a0a"
                radius={[10, 10, 0, 0]}
                stroke="#ffffff"
                strokeWidth={1}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strong Points and Weak Points */}
      <div className="analysis-points">
        {/* Strong Points */}
        <div className="points-section strong-points">
          <h4 className="points-title">
            <span className="points-icon">💪</span>
            Strong Points
          </h4>
          {strongPoints.length > 0 ? (
            <div className="points-list">
              {strongPoints.map((point, index) => (
                <div key={index} className="point-item strong">
                  <div className="point-header">
                    <span className="point-name">{point.name}</span>
                    <span className="point-value">{point.value}%</span>
                  </div>
                  <div className="point-bar">
                    <div 
                      className="point-bar-fill strong-fill"
                      style={{ width: `${point.value}%` }}
                    ></div>
                  </div>
                  <p className="point-description">{point.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-points">No exceptional strengths identified</p>
          )}
        </div>

        {/* Weak Points */}
        <div className="points-section weak-points">
          <h4 className="points-title">
            <span className="points-icon">⚠️</span>
            Areas for Improvement
          </h4>
          {weakPoints.length > 0 ? (
            <div className="points-list">
              {weakPoints.map((point, index) => (
                <div key={index} className="point-item weak">
                  <div className="point-header">
                    <span className="point-name">{point.name}</span>
                    <span className="point-value">{point.value}%</span>
                  </div>
                  <div className="point-bar">
                    <div 
                      className="point-bar-fill weak-fill"
                      style={{ width: `${point.value}%` }}
                    ></div>
                  </div>
                  <p className="point-description">{point.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-points">No significant weaknesses identified</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FighterAnalysisChart


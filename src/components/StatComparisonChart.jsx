import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import '../styles/components/StatComparisonChart.css'

function StatComparisonChart({ fighter1, fighter2 }) {
  // Prepare data for radar chart
  const radarData = [
    {
      category: 'Win Rate',
      fighter1: parseFloat(((fighter1.wins / (fighter1.wins + fighter1.losses)) * 100).toFixed(1)),
      fighter2: parseFloat(((fighter2.wins / (fighter2.wins + fighter2.losses)) * 100).toFixed(1)),
      fullMark: 100
    },
    {
      category: 'KO Rate',
      fighter1: parseFloat(((fighter1.knockouts / fighter1.wins) * 100 || 0).toFixed(1)),
      fighter2: parseFloat(((fighter2.knockouts / fighter2.wins) * 100 || 0).toFixed(1)),
      fullMark: 100
    },
    {
      category: 'Sub Rate',
      fighter1: parseFloat(((fighter1.submissions / fighter1.wins) * 100 || 0).toFixed(1)),
      fighter2: parseFloat(((fighter2.submissions / fighter2.wins) * 100 || 0).toFixed(1)),
      fullMark: 100
    },
    {
      category: 'Striking',
      fighter1: fighter1.strikingAccuracy,
      fighter2: fighter2.strikingAccuracy,
      fullMark: 100
    },
    {
      category: 'Takedown',
      fighter1: fighter1.takedownAccuracy,
      fighter2: fighter2.takedownAccuracy,
      fullMark: 100
    }
  ]

  // Prepare data for bar chart
  const barData = [
    {
      stat: 'Win Rate',
      [fighter1.name]: parseFloat(((fighter1.wins / (fighter1.wins + fighter1.losses)) * 100).toFixed(1)),
      [fighter2.name]: parseFloat(((fighter2.wins / (fighter2.wins + fighter2.losses)) * 100).toFixed(1))
    },
    {
      stat: 'KO Rate',
      [fighter1.name]: parseFloat(((fighter1.knockouts / fighter1.wins) * 100 || 0).toFixed(1)),
      [fighter2.name]: parseFloat(((fighter2.knockouts / fighter2.wins) * 100 || 0).toFixed(1))
    },
    {
      stat: 'Sub Rate',
      [fighter1.name]: parseFloat(((fighter1.submissions / fighter1.wins) * 100 || 0).toFixed(1)),
      [fighter2.name]: parseFloat(((fighter2.submissions / fighter2.wins) * 100 || 0).toFixed(1))
    },
    {
      stat: 'Striking Acc',
      [fighter1.name]: fighter1.strikingAccuracy,
      [fighter2.name]: fighter2.strikingAccuracy
    },
    {
      stat: 'Takedown Acc',
      [fighter1.name]: fighter1.takedownAccuracy,
      [fighter2.name]: fighter2.takedownAccuracy
    }
  ]

  return (
    <div className="stat-comparison-chart">
      <h3 className="chart-title">Stat Comparison</h3>
      
      <div className="charts-container">
        {/* Radar Chart */}
        <div className="chart-wrapper">
          <h4 className="chart-subtitle">Radar Comparison</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#ffffff', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#888' }} />
              <Radar
                name={fighter1.name}
                dataKey="fighter1"
                stroke="#ffd700"
                fill="#ffd700"
                fillOpacity={0.6}
              />
              <Radar
                name={fighter2.name}
                dataKey="fighter2"
                stroke="#ff6b6b"
                fill="#ff6b6b"
                fillOpacity={0.6}
              />
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
                iconType="circle"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: '1px solid #ffd700',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-wrapper">
          <h4 className="chart-subtitle">Bar Comparison</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="stat" 
                tick={{ fill: '#ffffff', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: '#ffffff', fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: '1px solid #ffd700',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
              />
              <Bar 
                dataKey={fighter1.name} 
                fill="#ffd700" 
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey={fighter2.name} 
                fill="#ff6b6b" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default StatComparisonChart


import '../styles/components/FighterComparisonTable.css'

/**
 * FighterComparisonTable Component
 * Displays a side-by-side comparison table of fighter statistics
 * 
 * @param {Object} props - Component props
 * @param {Object} props.fighter1 - First fighter object
 * @param {Object} props.fighter2 - Second fighter object
 * @returns {JSX.Element} Comparison table component
 */
function FighterComparisonTable({ fighter1, fighter2 }) {
  // Calculate derived stats
  const fighter1WinRate = ((fighter1.wins / (fighter1.wins + fighter1.losses)) * 100).toFixed(1)
  const fighter2WinRate = ((fighter2.wins / (fighter2.wins + fighter2.losses)) * 100).toFixed(1)
  
  const fighter1KORate = fighter1.wins > 0 ? ((fighter1.knockouts / fighter1.wins) * 100).toFixed(1) : 0
  const fighter2KORate = fighter2.wins > 0 ? ((fighter2.knockouts / fighter2.wins) * 100).toFixed(1) : 0
  
  const fighter1SubRate = fighter1.wins > 0 ? ((fighter1.submissions / fighter1.wins) * 100).toFixed(1) : 0
  const fighter2SubRate = fighter2.wins > 0 ? ((fighter2.submissions / fighter2.wins) * 100).toFixed(1) : 0

  const totalFights1 = fighter1.wins + fighter1.losses
  const totalFights2 = fighter2.wins + fighter2.losses

  // Comparison data
  const comparisonData = [
    {
      category: 'Record',
      fighter1Value: `${fighter1.wins}-${fighter1.losses}`,
      fighter2Value: `${fighter2.wins}-${fighter2.losses}`,
      type: 'record'
    },
    {
      category: 'Win Rate',
      fighter1Value: `${fighter1WinRate}%`,
      fighter2Value: `${fighter2WinRate}%`,
      type: 'percentage',
      fighter1Num: parseFloat(fighter1WinRate),
      fighter2Num: parseFloat(fighter2WinRate)
    },
    {
      category: 'Total Fights',
      fighter1Value: totalFights1,
      fighter2Value: totalFights2,
      type: 'number',
      fighter1Num: totalFights1,
      fighter2Num: totalFights2
    },
    {
      category: 'Knockouts',
      fighter1Value: fighter1.knockouts,
      fighter2Value: fighter2.knockouts,
      type: 'number',
      fighter1Num: fighter1.knockouts,
      fighter2Num: fighter2.knockouts
    },
    {
      category: 'KO Rate',
      fighter1Value: `${fighter1KORate}%`,
      fighter2Value: `${fighter2KORate}%`,
      type: 'percentage',
      fighter1Num: parseFloat(fighter1KORate),
      fighter2Num: parseFloat(fighter2KORate)
    },
    {
      category: 'Submissions',
      fighter1Value: fighter1.submissions,
      fighter2Value: fighter2.submissions,
      type: 'number',
      fighter1Num: fighter1.submissions,
      fighter2Num: fighter2.submissions
    },
    {
      category: 'Submission Rate',
      fighter1Value: `${fighter1SubRate}%`,
      fighter2Value: `${fighter2SubRate}%`,
      type: 'percentage',
      fighter1Num: parseFloat(fighter1SubRate),
      fighter2Num: parseFloat(fighter2SubRate)
    },
    {
      category: 'Striking Accuracy',
      fighter1Value: `${fighter1.strikingAccuracy}%`,
      fighter2Value: `${fighter2.strikingAccuracy}%`,
      type: 'percentage',
      fighter1Num: fighter1.strikingAccuracy,
      fighter2Num: fighter2.strikingAccuracy
    },
    {
      category: 'Takedown Accuracy',
      fighter1Value: `${fighter1.takedownAccuracy}%`,
      fighter2Value: `${fighter2.takedownAccuracy}%`,
      type: 'percentage',
      fighter1Num: fighter1.takedownAccuracy,
      fighter2Num: fighter2.takedownAccuracy
    }
  ]

  /**
   * Determines which fighter has the advantage for a given stat
   * @param {Object} row - Comparison row data
   * @returns {string|null} 'fighter1', 'fighter2', or null for ties
   */
  const getAdvantage = (row) => {
    if (row.type === 'record' || !row.fighter1Num || !row.fighter2Num) {
      return null
    }
    if (row.fighter1Num > row.fighter2Num) return 'fighter1'
    if (row.fighter2Num > row.fighter1Num) return 'fighter2'
    return null
  }

  return (
    <div className="fighter-comparison-table">
      <h3 className="table-title">Fighter Comparison</h3>
      
      <div className="table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="category-column">Stat</th>
              <th className={`fighter-column ${getAdvantage({ type: 'header' }) === 'fighter1' ? 'advantage' : ''}`}>
                {fighter1.name}
              </th>
              <th className={`fighter-column ${getAdvantage({ type: 'header' }) === 'fighter2' ? 'advantage' : ''}`}>
                {fighter2.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => {
              const advantage = getAdvantage(row)
              return (
                <tr key={index} className={advantage ? `row-${advantage}` : ''}>
                  <td className="category-cell">{row.category}</td>
                  <td className={`value-cell ${advantage === 'fighter1' ? 'winner' : ''}`}>
                    {row.fighter1Value}
                    {advantage === 'fighter1' && <span className="advantage-badge">↑</span>}
                  </td>
                  <td className={`value-cell ${advantage === 'fighter2' ? 'winner' : ''}`}>
                    {row.fighter2Value}
                    {advantage === 'fighter2' && <span className="advantage-badge">↑</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="table-legend">
        <div className="legend-item">
          <span className="legend-indicator winner"></span>
          <span>Advantage</span>
        </div>
      </div>
    </div>
  )
}

export default FighterComparisonTable


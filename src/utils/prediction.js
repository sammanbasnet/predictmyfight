/**
 * Calculate fighter score based on weighted statistics
 * @param {Object} fighter - Fighter object with stats
 * @returns {number} - Calculated score
 */
export const calculateFighterScore = (fighter) => {
  // Weighted scoring system
  const winRate = (fighter.wins / (fighter.wins + fighter.losses)) * 100
  const koRate = (fighter.knockouts / fighter.wins) * 100 || 0
  const submissionRate = (fighter.submissions / fighter.wins) * 100 || 0
  const avgStrikingAccuracy = fighter.strikingAccuracy || 0
  const avgTakedownAccuracy = fighter.takedownAccuracy || 0

  // Weighted formula
  return (
    winRate * 0.3 +
    koRate * 0.2 +
    submissionRate * 0.15 +
    avgStrikingAccuracy * 0.2 +
    avgTakedownAccuracy * 0.15
  )
}

/**
 * Calculate detailed stat breakdown for a fighter
 * @param {Object} fighter - Fighter object
 * @returns {Object} - Detailed stat breakdown
 */
const calculateStatBreakdown = (fighter) => {
  const winRate = (fighter.wins / (fighter.wins + fighter.losses)) * 100
  const koRate = (fighter.knockouts / fighter.wins) * 100 || 0
  const submissionRate = (fighter.submissions / fighter.wins) * 100 || 0

  return {
    winRate: winRate.toFixed(1),
    koRate: koRate.toFixed(1),
    submissionRate: submissionRate.toFixed(1),
    strikingAccuracy: fighter.strikingAccuracy,
    takedownAccuracy: fighter.takedownAccuracy,
    totalFights: fighter.wins + fighter.losses,
    wins: fighter.wins,
    losses: fighter.losses,
    knockouts: fighter.knockouts,
    submissions: fighter.submissions
  }
}

/**
 * Compare two fighters and get advantages
 * @param {Object} fighter1 - First fighter
 * @param {Object} fighter2 - Second fighter
 * @returns {Array} - Array of advantages
 */
const getAdvantages = (fighter1, fighter2) => {
  const breakdown1 = calculateStatBreakdown(fighter1)
  const breakdown2 = calculateStatBreakdown(fighter2)
  const advantages = []

  // Win Rate
  if (parseFloat(breakdown1.winRate) > parseFloat(breakdown2.winRate)) {
    advantages.push({
      category: 'Win Rate',
      fighter: fighter1.name,
      advantage: (parseFloat(breakdown1.winRate) - parseFloat(breakdown2.winRate)).toFixed(1) + '%',
      fighter1Value: breakdown1.winRate + '%',
      fighter2Value: breakdown2.winRate + '%'
    })
  } else if (parseFloat(breakdown2.winRate) > parseFloat(breakdown1.winRate)) {
    advantages.push({
      category: 'Win Rate',
      fighter: fighter2.name,
      advantage: (parseFloat(breakdown2.winRate) - parseFloat(breakdown1.winRate)).toFixed(1) + '%',
      fighter1Value: breakdown1.winRate + '%',
      fighter2Value: breakdown2.winRate + '%'
    })
  }

  // Striking Accuracy
  if (breakdown1.strikingAccuracy > breakdown2.strikingAccuracy) {
    advantages.push({
      category: 'Striking Accuracy',
      fighter: fighter1.name,
      advantage: (breakdown1.strikingAccuracy - breakdown2.strikingAccuracy) + '%',
      fighter1Value: breakdown1.strikingAccuracy + '%',
      fighter2Value: breakdown2.strikingAccuracy + '%'
    })
  } else if (breakdown2.strikingAccuracy > breakdown1.strikingAccuracy) {
    advantages.push({
      category: 'Striking Accuracy',
      fighter: fighter2.name,
      advantage: (breakdown2.strikingAccuracy - breakdown1.strikingAccuracy) + '%',
      fighter1Value: breakdown1.strikingAccuracy + '%',
      fighter2Value: breakdown2.strikingAccuracy + '%'
    })
  }

  // Takedown Accuracy
  if (breakdown1.takedownAccuracy > breakdown2.takedownAccuracy) {
    advantages.push({
      category: 'Takedown Accuracy',
      fighter: fighter1.name,
      advantage: (breakdown1.takedownAccuracy - breakdown2.takedownAccuracy) + '%',
      fighter1Value: breakdown1.takedownAccuracy + '%',
      fighter2Value: breakdown2.takedownAccuracy + '%'
    })
  } else if (breakdown2.takedownAccuracy > breakdown1.takedownAccuracy) {
    advantages.push({
      category: 'Takedown Accuracy',
      fighter: fighter2.name,
      advantage: (breakdown2.takedownAccuracy - breakdown1.takedownAccuracy) + '%',
      fighter1Value: breakdown1.takedownAccuracy + '%',
      fighter2Value: breakdown2.takedownAccuracy + '%'
    })
  }

  // KO Rate
  if (parseFloat(breakdown1.koRate) > parseFloat(breakdown2.koRate)) {
    advantages.push({
      category: 'KO Rate',
      fighter: fighter1.name,
      advantage: (parseFloat(breakdown1.koRate) - parseFloat(breakdown2.koRate)).toFixed(1) + '%',
      fighter1Value: breakdown1.koRate + '%',
      fighter2Value: breakdown2.koRate + '%'
    })
  } else if (parseFloat(breakdown2.koRate) > parseFloat(breakdown1.koRate)) {
    advantages.push({
      category: 'KO Rate',
      fighter: fighter2.name,
      advantage: (parseFloat(breakdown2.koRate) - parseFloat(breakdown1.koRate)).toFixed(1) + '%',
      fighter1Value: breakdown1.koRate + '%',
      fighter2Value: breakdown2.koRate + '%'
    })
  }

  // Experience (Total Fights)
  if (breakdown1.totalFights > breakdown2.totalFights) {
    advantages.push({
      category: 'Experience',
      fighter: fighter1.name,
      advantage: (breakdown1.totalFights - breakdown2.totalFights) + ' fights',
      fighter1Value: breakdown1.totalFights + ' fights',
      fighter2Value: breakdown2.totalFights + ' fights'
    })
  } else if (breakdown2.totalFights > breakdown1.totalFights) {
    advantages.push({
      category: 'Experience',
      fighter: fighter2.name,
      advantage: (breakdown2.totalFights - breakdown1.totalFights) + ' fights',
      fighter1Value: breakdown1.totalFights + ' fights',
      fighter2Value: breakdown2.totalFights + ' fights'
    })
  }

  return advantages.sort((a, b) => {
    // Sort by advantage magnitude (convert to numbers for comparison)
    const aVal = parseFloat(a.advantage.replace(/[^0-9.]/g, ''))
    const bVal = parseFloat(b.advantage.replace(/[^0-9.]/g, ''))
    return bVal - aVal
  })
}

/**
 * Predict fight outcome between two fighters
 * @param {Object} fighter1 - First fighter object
 * @param {Object} fighter2 - Second fighter object
 * @returns {Object} - Prediction result with probabilities, winner, and detailed breakdown
 */
export const predictFight = (fighter1, fighter2) => {
  const fighter1Score = calculateFighterScore(fighter1)
  const fighter2Score = calculateFighterScore(fighter2)

  const totalScore = fighter1Score + fighter2Score
  const fighter1WinProbability = (fighter1Score / totalScore) * 100
  const fighter2WinProbability = (fighter2Score / totalScore) * 100

  const breakdown1 = calculateStatBreakdown(fighter1)
  const breakdown2 = calculateStatBreakdown(fighter2)
  const advantages = getAdvantages(fighter1, fighter2)

  // Determine confidence level
  const probabilityDiff = Math.abs(fighter1WinProbability - fighter2WinProbability)
  let confidenceLevel = 'Medium'
  if (probabilityDiff > 20) confidenceLevel = 'High'
  else if (probabilityDiff < 10) confidenceLevel = 'Low'

  return {
    fighter1: {
      name: fighter1.name,
      probability: fighter1WinProbability.toFixed(1),
      score: fighter1Score.toFixed(2),
      breakdown: breakdown1
    },
    fighter2: {
      name: fighter2.name,
      probability: fighter2WinProbability.toFixed(1),
      score: fighter2Score.toFixed(2),
      breakdown: breakdown2
    },
    winner: fighter1Score > fighter2Score ? fighter1.name : fighter2.name,
    confidenceLevel,
    advantages,
    probabilityDiff: probabilityDiff.toFixed(1)
  }
}


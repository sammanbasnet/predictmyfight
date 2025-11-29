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
 * Predict fight outcome between two fighters
 * @param {Object} fighter1 - First fighter object
 * @param {Object} fighter2 - Second fighter object
 * @returns {Object} - Prediction result with probabilities and winner
 */
export const predictFight = (fighter1, fighter2) => {
  const fighter1Score = calculateFighterScore(fighter1)
  const fighter2Score = calculateFighterScore(fighter2)

  const totalScore = fighter1Score + fighter2Score
  const fighter1WinProbability = (fighter1Score / totalScore) * 100
  const fighter2WinProbability = (fighter2Score / totalScore) * 100

  return {
    fighter1: {
      name: fighter1.name,
      probability: fighter1WinProbability.toFixed(1)
    },
    fighter2: {
      name: fighter2.name,
      probability: fighter2WinProbability.toFixed(1)
    },
    winner: fighter1Score > fighter2Score ? fighter1.name : fighter2.name
  }
}


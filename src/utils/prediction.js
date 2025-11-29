/**
 * Calculate fighter score based on weighted statistics with improved accuracy
 * @param {Object} fighter - Fighter object with stats
 * @returns {number} - Calculated score
 */
export const calculateFighterScore = (fighter) => {
  const totalFights = fighter.wins + fighter.losses
  
  // Win rate calculation with experience adjustment
  // Penalize fighters with very few fights to avoid overvaluing small sample sizes
  let winRate = (fighter.wins / totalFights) * 100
  
  // Experience factor: More fights = more reliable data
  // Apply a reliability multiplier based on total fights
  const experienceFactor = Math.min(1, totalFights / 20) // Max reliability at 20+ fights
  const reliabilityBonus = experienceFactor * 5 // Up to 5 point bonus for experience
  
  // Penalize losses more heavily - each loss reduces score
  const lossPenalty = (fighter.losses / totalFights) * 15 // Up to 15 point penalty
  
  // Finishing ability (KO + Submissions) - more important than just win rate
  const totalFinishes = fighter.knockouts + fighter.submissions
  const finishRate = fighter.wins > 0 ? (totalFinishes / fighter.wins) * 100 : 0
  
  // KO rate - finishing ability is crucial
  const koRate = fighter.wins > 0 ? (fighter.knockouts / fighter.wins) * 100 : 0
  
  // Submission rate - grappling proficiency
  const submissionRate = fighter.wins > 0 ? (fighter.submissions / fighter.wins) * 100 : 0
  
  // Striking accuracy - normalized
  const strikingAccuracy = fighter.strikingAccuracy || 0
  
  // Takedown accuracy - normalized
  const takedownAccuracy = fighter.takedownAccuracy || 0
  
  // Undefeated bonus - being undefeated is significant
  const undefeatedBonus = fighter.losses === 0 && fighter.wins >= 5 ? 8 : 0
  
  // Improved weighted formula with better balance
  const baseScore = (
    winRate * 0.25 +           // Win rate (reduced from 0.3)
    finishRate * 0.20 +         // Overall finishing ability (new)
    koRate * 0.15 +             // KO rate (reduced from 0.2)
    submissionRate * 0.10 +      // Submission rate (reduced from 0.15)
    strikingAccuracy * 0.15 +    // Striking accuracy (reduced from 0.2)
    takedownAccuracy * 0.10      // Takedown accuracy (reduced from 0.15)
  )
  
  // Apply bonuses and penalties
  const adjustedScore = baseScore + reliabilityBonus + undefeatedBonus - lossPenalty
  
  // Ensure score is positive and reasonable
  return Math.max(0, Math.min(100, adjustedScore))
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
/**
 * Predict fight outcome between two fighters with improved accuracy
 * @param {Object} fighter1 - First fighter object
 * @param {Object} fighter2 - Second fighter object
 * @returns {Object} - Prediction result with probabilities, winner, and detailed breakdown
 */
export const predictFight = (fighter1, fighter2) => {
  const fighter1Score = calculateFighterScore(fighter1)
  const fighter2Score = calculateFighterScore(fighter2)

  // Use a more sophisticated probability calculation
  // Add a base probability to prevent extreme predictions
  const scoreDifference = Math.abs(fighter1Score - fighter2Score)
  const totalScore = fighter1Score + fighter2Score
  
  // Base probability calculation
  let fighter1WinProbability = (fighter1Score / totalScore) * 100
  let fighter2WinProbability = (fighter2Score / totalScore) * 100
  
  // Apply adjustment for close fights - less extreme predictions
  // If scores are very close, make prediction less confident
  if (scoreDifference < 5) {
    // Close fight - pull probabilities toward 50/50
    const adjustment = (5 - scoreDifference) * 2
    if (fighter1Score > fighter2Score) {
      fighter1WinProbability = Math.min(60, fighter1WinProbability + adjustment)
      fighter2WinProbability = 100 - fighter1WinProbability
    } else {
      fighter2WinProbability = Math.min(60, fighter2WinProbability + adjustment)
      fighter1WinProbability = 100 - fighter2WinProbability
    }
  }
  
  // Ensure probabilities sum to 100
  const totalProb = fighter1WinProbability + fighter2WinProbability
  fighter1WinProbability = (fighter1WinProbability / totalProb) * 100
  fighter2WinProbability = (fighter2WinProbability / totalProb) * 100

  const breakdown1 = calculateStatBreakdown(fighter1)
  const breakdown2 = calculateStatBreakdown(fighter2)
  const advantages = getAdvantages(fighter1, fighter2)

  // Improved confidence level determination
  const probabilityDiff = Math.abs(fighter1WinProbability - fighter2WinProbability)
  let confidenceLevel = 'Medium'
  
  // More nuanced confidence levels
  if (probabilityDiff > 25) {
    confidenceLevel = 'High'
  } else if (probabilityDiff > 15) {
    confidenceLevel = 'Medium-High'
  } else if (probabilityDiff > 8) {
    confidenceLevel = 'Medium'
  } else if (probabilityDiff > 3) {
    confidenceLevel = 'Low-Medium'
  } else {
    confidenceLevel = 'Low'
  }

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


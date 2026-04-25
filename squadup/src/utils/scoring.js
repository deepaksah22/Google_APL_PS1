// Points calculation logic

export function calculatePredictionPoints(prediction, actual) {
  let points = 0;

  // Score prediction - exact match = 50, within 10 = 25, within 20 = 10
  const scoreDiff = Math.abs(prediction.score - actual.score);
  if (scoreDiff === 0) points += 50;
  else if (scoreDiff <= 10) points += 25;
  else if (scoreDiff <= 20) points += 10;

  // MVP prediction
  if (prediction.mvp && actual.mvp && prediction.mvp.toLowerCase() === actual.mvp.toLowerCase()) {
    points += 30;
  }

  // First event prediction
  if (prediction.firstEvent && actual.firstEvent && prediction.firstEvent === actual.firstEvent) {
    points += 20;
  }

  return points;
}

export function calculateChallengePoints(isCorrect, squadAllCorrect) {
  let points = 0;
  if (isCorrect) {
    points += 10;
    if (squadAllCorrect) points += 5; // squad bonus
  }
  return points;
}

export function calculateRewardPoints(basePoints, squadCount) {
  const multiplier = squadCount >= 3 ? 2 : 1;
  return basePoints * multiplier;
}

export function getRewardTier(totalPoints) {
  if (totalPoints >= 500) return { tier: 'Diamond', emoji: '💎', nextAt: null };
  if (totalPoints >= 350) return { tier: 'Gold', emoji: '🥇', nextAt: 500 };
  if (totalPoints >= 200) return { tier: 'Silver', emoji: '🥈', nextAt: 350 };
  if (totalPoints >= 100) return { tier: 'Bronze', emoji: '🥉', nextAt: 200 };
  return { tier: 'Starter', emoji: '⭐', nextAt: 100 };
}

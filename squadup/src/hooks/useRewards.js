// Rewards state management hook
import { useState, useCallback } from 'react';

export function useRewards() {
  const [rewards, setRewards] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);

  const addReward = useCallback((reward) => {
    setRewards(prev => [reward, ...prev].slice(0, 20));
  }, []);

  const claimReward = useCallback((rewardId, memberId) => {
    setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, claimed: true, claimedBy: [...(r.claimedBy || []), memberId] } : r));
    setClaimedRewards(prev => [...prev, { rewardId, memberId, at: Date.now() }]);
  }, []);

  const activeRewards = rewards.filter(r => !r.claimed);
  const totalRewardPoints = claimedRewards.length * 20; // simplified

  return { rewards, activeRewards, claimedRewards, addReward, claimReward, totalRewardPoints };
}

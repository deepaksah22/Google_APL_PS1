// Orchestrator Agent — coordinates all agents, manages global state
import { generateChallenge, resolveChallenge } from './predictionAgent.js';
import { generateReward } from './crowdRewardAgent.js';
import { getRecommendation } from './foodAgent.js';
import { getEntryRecommendation, getExitRecommendation } from './navAgent.js';
import { generateZoneData, VENUE } from '../data/venueData.js';

export class Orchestrator {
  constructor(squad, matchState, onUpdate) {
    this.squad = squad;
    this.matchState = matchState;
    this.onUpdate = onUpdate;
    this.challenges = [];
    this.rewards = [];
    this.zoneData = generateZoneData();
    this.intervals = [];
  }

  start() {
    // Update zone data every 30s
    this.intervals.push(setInterval(() => {
      this.zoneData = generateZoneData();
      this.onUpdate('zones', this.zoneData);
    }, 30000));

    // Generate new challenge every 45s (accelerated for demo)
    this.intervals.push(setInterval(async () => {
      if (this.matchState.matchEnded) return;
      const challenge = await generateChallenge(this.matchState);
      this.challenges.push(challenge);
      this.onUpdate('challenge', challenge);

      // Auto-resolve after 40s for demo
      setTimeout(() => {
        const resolved = resolveChallenge(challenge);
        const idx = this.challenges.findIndex(c => c.id === challenge.id);
        if (idx !== -1) this.challenges[idx] = resolved;
        this.onUpdate('challengeResolved', resolved);
      }, 40000);
    }, 45000));

    // Generate reward offers every 60s
    this.intervals.push(setInterval(async () => {
      const reward = await generateReward(
        this.zoneData,
        this.squad.section,
        this.matchState.phase
      );
      this.rewards.push(reward);
      this.onUpdate('reward', reward);
    }, 60000));

    // Generate initial challenge and reward
    setTimeout(async () => {
      const challenge = await generateChallenge(this.matchState);
      this.challenges.push(challenge);
      this.onUpdate('challenge', challenge);
      setTimeout(() => {
        const resolved = resolveChallenge(challenge);
        const idx = this.challenges.findIndex(c => c.id === challenge.id);
        if (idx !== -1) this.challenges[idx] = resolved;
        this.onUpdate('challengeResolved', resolved);
      }, 40000);
    }, 3000);

    setTimeout(async () => {
      const reward = await generateReward(this.zoneData, this.squad.section, this.matchState.phase);
      this.rewards.push(reward);
      this.onUpdate('reward', reward);
    }, 8000);
  }

  updateMatchState(match) {
    this.matchState = match;
  }

  async getFoodRecommendation(orderItems) {
    return getRecommendation(this.squad.section, orderItems, this.zoneData, this.squad.members);
  }

  getEntryGate() {
    return getEntryRecommendation(this.squad.section, VENUE.gates);
  }

  getExitGate() {
    return getExitRecommendation(this.squad.section, VENUE.gates);
  }

  stop() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }
}

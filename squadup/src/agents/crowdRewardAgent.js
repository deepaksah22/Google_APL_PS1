// Crowd Reward Agent — generates dynamic reward offers based on venue density
import { callGemini } from '../utils/gemini.js';

const SYSTEM_PROMPT = `You are the Crowd-Reward Agent for SquadUp. You analyze venue crowd density
data and generate reward offers that incentivize fans to move to less
crowded areas. Rules:
- Higher points for more urgent crowd situations (>80% density = 40pts, >60% = 20pts)
- Always suggest the specific zone/stand with lowest wait
- Include estimated wait time savings
- Tone: helpful and exciting, not bossy — fans should WANT to take the action
- Squad multiplier: mention "bring your squad for 2x points" when applicable

Respond in JSON: { "offer": "...", "action": "...", "points": 20, "savings": "8 min less wait", "zone": "Section E", "emoji": "🚻" }`;

const FALLBACK_REWARDS = [
  { offer: "Restrooms in Section E have ZERO wait right now!", action: "Use restroom in Section E", points: 20, savings: "8 min less wait", zone: "Section E", emoji: "🚻" },
  { offer: "Pre-order food NOW — skip the innings break rush!", action: "Pre-order at Counter B7", points: 30, savings: "12 min less wait", zone: "Counter B7", emoji: "🍔" },
  { offer: "Exit via East Gate after match — least crowded!", action: "Plan exit via East Gate", points: 40, savings: "15 min faster exit", zone: "East Gate", emoji: "🚪" },
  { offer: "Head to your seat before the next innings starts!", action: "Return to seat now", points: 15, savings: "Avoid rush", zone: "Your Section", emoji: "💺" },
  { offer: "Section D food counter is nearly EMPTY right now!", action: "Grab snacks at Counter D5", points: 25, savings: "10 min less wait", zone: "Section D", emoji: "🍿" },
  { offer: "Beat the crowd — restroom break during this over!", action: "Quick restroom visit", points: 20, savings: "7 min saved", zone: "Section D", emoji: "⚡" },
];

let rewardIndex = 0;

export async function generateReward(zoneData, userSection, matchPhase) {
  // Find lowest density zone
  const zones = Object.entries(zoneData);
  const leastCrowded = zones.reduce((min, curr) => curr[1].density < min[1].density ? curr : min);

  const result = await callGemini(
    SYSTEM_PROMPT,
    JSON.stringify({ zone_densities: zoneData, user_section: userSection, match_phase: matchPhase, least_crowded: leastCrowded[0] })
  );

  if (result && result.offer) {
    return { id: Date.now(), ...result, timestamp: Date.now(), claimed: false, claimedBy: [] };
  }

  const reward = FALLBACK_REWARDS[rewardIndex % FALLBACK_REWARDS.length];
  rewardIndex++;
  return { id: Date.now(), ...reward, timestamp: Date.now(), claimed: false, claimedBy: [] };
}

// Prediction Agent — generates live micro-challenges based on match state
import { callGemini } from '../utils/gemini.js';

const SYSTEM_PROMPT = `You are the Prediction Agent for SquadUp, a live stadium experience app.
Your job is to generate fun, engaging prediction challenges based on
the current match state. Rules:
- Challenges must be resolvable within 5-15 minutes of play
- Binary (Yes/No) or max 3 options
- Fun, conversational tone — you're talking to excited fans at a stadium
- Include a fun fact or stat to make it interesting
- Never repeat a challenge type within 30 minutes

Respond ONLY in JSON: { "challenge": "...", "options": [...], "resolve_after": "...", "points": 10, "fun_fact": "..." }`;

const FALLBACK_CHALLENGES = [
  { challenge: "Will there be a SIX in the next over? 💥", options: ["Yes! 🔥", "No way"], resolve_after: "1 over", points: 10, fun_fact: "Delhi Capitals average 2.3 sixes per 5 overs here!" },
  { challenge: "Will a wicket fall in the next 2 overs? 🏏", options: ["Wicket incoming!", "Batsmen survive"], resolve_after: "2 overs", points: 10, fun_fact: "PBKS bowlers have taken 3 wickets in powerplay this season!" },
  { challenge: "Over or under 8 runs in the next over?", options: ["Over 8 🚀", "Under 8 🛡️"], resolve_after: "1 over", points: 10, fun_fact: "The average runs per over at Arun Jaitley is 8.7 this season!" },
  { challenge: "Will the batting team hit a FOUR next ball? 🎯", options: ["FOUR! 💪", "Nope"], resolve_after: "1 ball", points: 15, fun_fact: "34% of boundaries at Arun Jaitley come through covers!" },
  { challenge: "How many runs in the next 3 overs?", options: ["20+ runs 🔥", "15-19 runs", "Under 15 🛡️"], resolve_after: "3 overs", points: 10, fun_fact: "The highest-scoring 3-over spell this IPL was 38 runs!" },
  { challenge: "Will there be a dot ball in the next 3 deliveries?", options: ["Yes, dots happen", "All scoring!"], resolve_after: "3 balls", points: 10, fun_fact: "Even the best batsmen play 35% dot balls on average!" },
  { challenge: "Will the required rate go above 10 in the next 2 overs?", options: ["Pressure builds! 📈", "They'll keep up"], resolve_after: "2 overs", points: 10, fun_fact: "Teams chasing 10+ RPR win only 28% of the time!" },
  { challenge: "Next boundary — will it be a FOUR or a SIX?", options: ["FOUR 🏏", "SIX 💥", "No boundary coming"], resolve_after: "2 overs", points: 10, fun_fact: "At Arun Jaitley, SIXes outnumber FOURs 55% to 45%!" },
];

let challengeIndex = 0;

export async function generateChallenge(matchState) {
  // Try Gemini first
  const result = await callGemini(
    SYSTEM_PROMPT,
    `Current match state: ${JSON.stringify({
      batting: matchState.team1.batting ? matchState.team1.short : matchState.team2.short,
      score: matchState.team1.batting ? `${matchState.team1.runs}/${matchState.team1.wickets}` : `${matchState.team2.runs}/${matchState.team2.wickets}`,
      overs: matchState.team1.batting ? matchState.team1.overs : matchState.team2.overs,
      target: matchState.target,
      requiredRate: matchState.requiredRate,
      phase: matchState.phase,
      lastEvent: matchState.lastEvent,
    })}`
  );

  if (result && result.challenge) {
    return {
      id: Date.now(),
      ...result,
      timestamp: Date.now(),
      resolved: false,
      responses: {},
    };
  }

  // Fallback to pre-built challenges
  const challenge = FALLBACK_CHALLENGES[challengeIndex % FALLBACK_CHALLENGES.length];
  challengeIndex++;
  return {
    id: Date.now(),
    ...challenge,
    timestamp: Date.now(),
    resolved: false,
    responses: {},
  };
}

export function resolveChallenge(challenge) {
  // Randomly resolve (for demo purposes)
  const winningOption = challenge.options[Math.floor(Math.random() * challenge.options.length)];
  return {
    ...challenge,
    resolved: true,
    correctAnswer: winningOption,
    resolvedAt: Date.now(),
  };
}

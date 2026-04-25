// Simulated live match data for IPL cricket
const MATCH_EVENTS = [
  { type: 'runs', value: 0, desc: 'Dot ball' },
  { type: 'runs', value: 1, desc: 'Single' },
  { type: 'runs', value: 1, desc: 'Single' },
  { type: 'runs', value: 2, desc: 'Couple' },
  { type: 'runs', value: 4, desc: 'FOUR! Boundary' },
  { type: 'runs', value: 4, desc: 'FOUR! Through covers' },
  { type: 'runs', value: 6, desc: 'SIX! Into the stands!' },
  { type: 'runs', value: 0, desc: 'Dot ball' },
  { type: 'runs', value: 1, desc: 'Quick single' },
  { type: 'runs', value: 2, desc: 'Two runs' },
];

const WICKET_EVENTS = [
  'Caught behind!',
  'Bowled! Clean bowled!',
  'LBW! Plumb in front!',
  'Caught at slip!',
  'Run out! Direct hit!',
  'Stumped! Quick work!',
];

const BATSMEN = {
  DC: ['David Warner', 'Prithvi Shaw', 'Rishabh Pant', 'Mitchell Marsh', 'Tristan Stubbs', 'Axar Patel', 'Lalit Yadav'],
  PBKS: ['Shikhar Dhawan', 'Jonny Bairstow', 'Prabhsimran Singh', 'Liam Livingstone', 'Sam Curran', 'Jitesh Sharma', 'Shashank Singh'],
};

const BOWLERS = {
  DC: ['Anrich Nortje', 'Kuldeep Yadav', 'Khaleel Ahmed', 'Mukesh Kumar'],
  PBKS: ['Kagiso Rabada', 'Arshdeep Singh', 'Harshal Patel', 'Rahul Chahar'],
};

export function createMockMatch() {
  const match = {
    id: 'ipl-2026-dc-pbks',
    team1: {
      name: 'Delhi Capitals',
      short: 'DC',
      color: '#00008B',
      runs: 45,
      wickets: 1,
      overs: 4.3,
      balls: 27,
      batting: true,
      currentBatsmen: [BATSMEN.DC[0], BATSMEN.DC[2]],
      currentBowler: BOWLERS.PBKS[1],
      batIndex: 2,
    },
    team2: {
      name: 'Punjab Kings',
      short: 'PBKS',
      color: '#ED1B24',
      runs: 185,
      wickets: 6,
      overs: 20.0,
      balls: 120,
      batting: false,
      currentBatsmen: [],
      currentBowler: null,
      batIndex: 6,
    },
    status: 'LIVE',
    phase: '2nd Innings',
    venue: 'Arun Jaitley Stadium, Delhi',
    target: 186,
    requiredRate: 9.1,
    currentRate: 10.0,
    lastEvent: 'DC needs 141 runs to win',
    recentBalls: ['1', '4', '•', 'W', '1', '6'],
    matchStarted: true,
    matchEnded: false,
    breakTime: false,
  };

  return match;
}

export function simulateBall(match) {
  const updated = JSON.parse(JSON.stringify(match));
  const batting = updated.team1.batting ? updated.team1 : updated.team2;
  const bowling = updated.team1.batting ? updated.team2 : updated.team1;

  // Check if innings over
  if (batting.balls >= 120 || batting.wickets >= 10) {
    updated.matchEnded = true;
    if (batting.runs >= updated.target) {
      updated.status = `${batting.short} won by ${10 - batting.wickets} wickets!`;
    } else {
      updated.status = `${bowling.short} won by ${updated.target - batting.runs - 1} runs!`;
    }
    updated.lastEvent = updated.status;
    return updated;
  }

  // Determine event
  const isWicket = Math.random() < 0.06;
  
  if (isWicket && batting.wickets < 9) {
    batting.wickets++;
    batting.balls++;
    const wicketEvent = WICKET_EVENTS[Math.floor(Math.random() * WICKET_EVENTS.length)];
    const outBatsman = batting.currentBatsmen[Math.floor(Math.random() * 2)];
    batting.batIndex++;
    const teamKey = batting.short;
    if (BATSMEN[teamKey] && batting.batIndex < BATSMEN[teamKey].length) {
      const idx = batting.currentBatsmen.indexOf(outBatsman);
      batting.currentBatsmen[idx] = BATSMEN[teamKey][batting.batIndex];
    }
    updated.lastEvent = `WICKET! ${outBatsman} — ${wicketEvent}`;
    updated.recentBalls.push('W');
  } else {
    const event = MATCH_EVENTS[Math.floor(Math.random() * MATCH_EVENTS.length)];
    batting.runs += event.value;
    batting.balls++;
    updated.lastEvent = event.desc + (event.value > 0 ? ` (${event.value} runs)` : '');
    updated.recentBalls.push(event.value === 0 ? '•' : event.value === 4 ? '4' : event.value === 6 ? '6' : String(event.value));
  }

  // Update overs
  const completedOvers = Math.floor(batting.balls / 6);
  const remainingBalls = batting.balls % 6;
  batting.overs = parseFloat(`${completedOvers}.${remainingBalls}`);

  // Keep recent balls to last 12
  if (updated.recentBalls.length > 12) {
    updated.recentBalls = updated.recentBalls.slice(-12);
  }

  // Update rates
  if (batting.balls > 0) {
    updated.currentRate = ((batting.runs / batting.balls) * 6).toFixed(2);
    const remainBalls = 120 - batting.balls;
    if (remainBalls > 0) {
      updated.requiredRate = (((updated.target - batting.runs) / remainBalls) * 6).toFixed(2);
    }
  }

  // Check if target achieved
  if (batting.runs >= updated.target) {
    updated.matchEnded = true;
    updated.status = `${batting.short} won by ${10 - batting.wickets} wickets!`;
    updated.lastEvent = `🎉 ${batting.short} WIN! ${updated.status}`;
  } else {
    updated.status = `${batting.short} needs ${updated.target - batting.runs} runs from ${120 - batting.balls} balls`;
  }

  return updated;
}

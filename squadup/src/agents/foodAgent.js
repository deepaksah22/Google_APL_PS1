// Food Agent — optimal counter recommendation + split-and-meet plans
import { callGemini } from '../utils/gemini.js';
import { FOOD_COUNTERS } from '../data/venueData.js';

const SYSTEM_PROMPT = `You are the Food Agent for SquadUp. Given a squad's order and venue data,
recommend the optimal food counter and suggest a split-and-meet plan.
Rules:
- Pick the counter closest to the squad's section with the shortest queue
- If squad has 3+ members, suggest task splitting (food + restroom)
- Estimate return time for each member
- Tone: friendly, efficient — like a smart friend helping coordinate

Respond in JSON: { "counter": "B7", "counter_name": "Counter B7", "walk_time": "3 min", "wait_time": "2 min", "split_plan": [{"member": "...", "task": "...", "location": "...", "time": "..."}], "total_return_time": "5 min" }`;

export async function getRecommendation(squadSection, orderItems, zoneData, members) {
  const result = await callGemini(
    SYSTEM_PROMPT,
    JSON.stringify({ squad_section: squadSection, order_items: orderItems, zone_data: zoneData, members: members.map(m => m.name) })
  );

  if (result && result.counter) return result;

  // Fallback: find best counter near section
  const sectionCounters = FOOD_COUNTERS.filter(c => c.section === squadSection || c.section === 'B');
  const best = sectionCounters[0] || FOOD_COUNTERS[0];
  const zoneKey = `Section ${best.section}`;
  const waitTime = zoneData[zoneKey]?.food_wait || 3;

  const splitPlan = members.length >= 3 ? [
    { member: members[0]?.name || 'Member 1', task: '🍔 Pick up food', location: best.name, time: `${waitTime + 2} min` },
    { member: members[1]?.name || 'Member 2', task: '🚻 Restroom break', location: `Section ${squadSection} restroom`, time: '3 min' },
    { member: members[2]?.name || 'Member 3', task: '💺 Hold the seats', location: `Section ${squadSection}`, time: '0 min' },
  ] : [
    { member: members[0]?.name || 'Member 1', task: '🍔 Pick up food', location: best.name, time: `${waitTime + 2} min` },
  ];

  return {
    counter: best.id,
    counter_name: best.name,
    walk_time: '2 min',
    wait_time: `${waitTime} min`,
    split_plan: splitPlan,
    total_return_time: `${waitTime + 3} min`,
  };
}

// Navigation Agent — entry/exit routing and squad location tracking

export function getEntryRecommendation(section, gates) {
  // Find least congested gate serving this section
  const relevantGates = gates.filter(g => g.sections.includes(section));
  if (relevantGates.length === 0) return gates[0];
  return relevantGates.reduce((best, g) => g.congestion < best.congestion ? g : best);
}

export function getExitRecommendation(section, gates) {
  const relevantGates = gates.filter(g => g.sections.includes(section));
  if (relevantGates.length === 0) return gates.reduce((best, g) => g.congestion < best.congestion ? g : best);
  return relevantGates.reduce((best, g) => g.congestion < best.congestion ? g : best);
}

export function getMemberStatus(member) {
  if (member.task) {
    return { status: 'on-task', label: `${member.task.task} — ${member.task.time}`, location: member.task.location };
  }
  return { status: 'seated', label: 'At seat', location: `Section ${member.section}` };
}

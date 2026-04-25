// Stadium venue data - Wankhede Stadium layout
export const VENUE = {
  name: 'Wankhede Stadium',
  city: 'Mumbai',
  capacity: 33108,
  gates: [
    { id: 'north', name: 'North Gate', sections: ['A', 'B'], congestion: 0.7 },
    { id: 'south', name: 'South Gate', sections: ['D', 'E'], congestion: 0.3 },
    { id: 'east', name: 'East Gate', sections: ['C', 'E'], congestion: 0.5 },
    { id: 'west', name: 'West Gate', sections: ['A', 'D'], congestion: 0.4 },
  ],
};

export const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

// Simulated venue zones with crowd density
export function generateZoneData() {
  return {
    'Section A': { density: 0.75 + Math.random() * 0.2, restroom_wait: 8 + Math.floor(Math.random() * 6), food_wait: 5 + Math.floor(Math.random() * 5), x: 50, y: 15 },
    'Section B': { density: 0.35 + Math.random() * 0.2, restroom_wait: 1 + Math.floor(Math.random() * 3), food_wait: 2 + Math.floor(Math.random() * 3), x: 85, y: 40 },
    'Section C': { density: 0.55 + Math.random() * 0.2, restroom_wait: 4 + Math.floor(Math.random() * 4), food_wait: 3 + Math.floor(Math.random() * 3), x: 75, y: 75 },
    'Section D': { density: 0.25 + Math.random() * 0.15, restroom_wait: 1 + Math.floor(Math.random() * 2), food_wait: 1 + Math.floor(Math.random() * 2), x: 25, y: 75 },
    'Section E': { density: 0.45 + Math.random() * 0.2, restroom_wait: 2 + Math.floor(Math.random() * 3), food_wait: 3 + Math.floor(Math.random() * 3), x: 15, y: 40 },
  };
}

export const FOOD_COUNTERS = [
  { id: 'B3', name: 'Counter B3', section: 'B', x: 88, y: 35 },
  { id: 'B7', name: 'Counter B7', section: 'B', x: 90, y: 50 },
  { id: 'C2', name: 'Counter C2', section: 'C', x: 80, y: 70 },
  { id: 'D5', name: 'Counter D5', section: 'D', x: 30, y: 80 },
  { id: 'E1', name: 'Counter E1', section: 'E', x: 10, y: 35 },
  { id: 'A4', name: 'Counter A4', section: 'A', x: 45, y: 10 },
];

export const RESTROOMS = [
  { id: 'R-A', section: 'A', x: 55, y: 12 },
  { id: 'R-B', section: 'B', x: 92, y: 45 },
  { id: 'R-C', section: 'C', x: 78, y: 80 },
  { id: 'R-D', section: 'D', x: 20, y: 78 },
  { id: 'R-E', section: 'E', x: 8, y: 42 },
];

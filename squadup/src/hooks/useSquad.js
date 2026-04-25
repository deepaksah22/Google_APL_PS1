// Squad state management hook
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AVATAR_COLORS = ['#FF6B4A','#00D4FF','#A855F7','#CCFF00','#F59E0B','#22C55E','#EC4899','#6366F1'];

export function useSquad() {
  const [squad, setSquad] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const createSquad = useCallback((user, squadName) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const member = { ...user, id: uuidv4(), color: AVATAR_COLORS[0], isLeader: true, points: 0, predictions: null, task: null, section: user.section };
    const newSquad = {
      id: uuidv4(), name: squadName || `${user.name}'s Squad`, code, section: user.section,
      members: [member], createdAt: Date.now(),
    };
    setSquad(newSquad);
    setCurrentUser(member);
    return newSquad;
  }, []);

  const joinSquad = useCallback((name, section, existingSquad) => {
    const member = { id: uuidv4(), name, section, color: AVATAR_COLORS[existingSquad.members.length % AVATAR_COLORS.length], isLeader: false, points: 0, predictions: null, task: null };
    const updated = { ...existingSquad, members: [...existingSquad.members, member] };
    setSquad(updated);
    setCurrentUser(member);
    return updated;
  }, []);

  const addDemoMembers = useCallback(() => {
    if (!squad) return;
    const demoNames = ['Priya','Raj','Aisha','Vikram'];
    const existing = squad.members.length;
    const toAdd = demoNames.slice(0, Math.min(3, 4 - existing + 1)).filter((_, i) => i + existing < 5);
    const allSections = ['A', 'B', 'C', 'D', 'E'].filter(s => s !== squad.section);
    const newMembers = toAdd.map((name, i) => ({
      id: uuidv4(), name, section: allSections[(existing + i) % allSections.length], color: AVATAR_COLORS[(existing + i) % AVATAR_COLORS.length], isLeader: false, points: Math.floor(Math.random() * 40), predictions: null, task: null,
    }));
    setSquad(prev => ({ ...prev, members: [...prev.members, ...newMembers] }));
  }, [squad]);

  const updatePoints = useCallback((memberId, points) => {
    setSquad(prev => {
      if (!prev) return prev;
      return { ...prev, members: prev.members.map(m => m.id === memberId ? { ...m, points: m.points + points } : m) };
    });
  }, []);

  const setPrediction = useCallback((memberId, prediction) => {
    setSquad(prev => {
      if (!prev) return prev;
      return { ...prev, members: prev.members.map(m => m.id === memberId ? { ...m, predictions: prediction } : m) };
    });
  }, []);

  const setMemberTask = useCallback((memberId, task) => {
    setSquad(prev => {
      if (!prev) return prev;
      return { ...prev, members: prev.members.map(m => m.id === memberId ? { ...m, task } : m) };
    });
  }, []);

  const totalPoints = squad?.members.reduce((sum, m) => sum + m.points, 0) || 0;

  return { squad, currentUser, createSquad, joinSquad, addDemoMembers, updatePoints, setPrediction, setMemberTask, totalPoints, setSquad };
}

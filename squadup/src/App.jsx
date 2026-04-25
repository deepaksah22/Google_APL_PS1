import React, { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';
import { useSquad } from './hooks/useSquad';
import { useMatch } from './hooks/useMatch';
import { useRewards } from './hooks/useRewards';
import { Orchestrator } from './agents/orchestrator';
import {
  Auth, SquadSetup, SquadLobby, LiveScore,
  PredictionCard, ChallengeCard, RewardPanel,
  FoodCart, Leaderboard, SquadMap, MatchMemory
} from './components/AllComponents';

const TABS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'predict', icon: '🎯', label: 'Predict' },
  { id: 'rewards', icon: '🎁', label: 'Rewards' },
  { id: 'squad', icon: '👥', label: 'Squad' },
  { id: 'food', icon: '🍔', label: 'Food' },
];

export default function App() {
  // Auth & Squad
  const [authUser, setAuthUser] = useState(null);
  const [phase, setPhase] = useState('auth'); // auth | squad-setup | lobby | live | post
  const { squad, currentUser, createSquad, joinSquad, addDemoMembers, updatePoints, setPrediction, setMemberTask, totalPoints, setSquad } = useSquad();

  // Match
  const { match, isLive, loading, usingMock } = useMatch();

  // Rewards
  const { rewards, activeRewards, addReward, claimReward, totalRewardPoints } = useRewards();

  // Challenges
  const [challenges, setChallenges] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const orchestratorRef = useRef(null);

  // Feed items
  const [feed, setFeed] = useState([]);

  const addFeedItem = useCallback((text, type = 'info') => {
    setFeed(prev => [{ id: Date.now(), text, type, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 30));
  }, []);

  // Auth handler
  const handleLogin = (user) => {
    setAuthUser(user);
    setPhase('squad-setup');
  };

  // Squad handlers
  const handleCreateSquad = (name) => {
    createSquad(authUser, name);
    setPhase('lobby');
  };

  const handleJoinSquad = (code) => {
    // For demo, create a squad with that code
    const s = createSquad(authUser, 'Squad ' + code);
    setPhase('lobby');
  };

  const handleStart = () => {
    setPhase('live');
    addFeedItem('🏏 Match is LIVE! Let\'s go!', 'event');

    let finalSquad = squad;
    if (squad && squad.members.length === 1) {
      const demoNames = ['Priya','Raj','Aisha'];
      // Assign demo members to different sections for a better map visualization
      const allSections = ['A', 'B', 'C', 'D', 'E'].filter(s => s !== squad.section);
      const newMembers = demoNames.map((name, i) => ({
        id: Math.random().toString(), 
        name, 
        section: allSections[i % allSections.length], // Distributed to other sections
        color: ['#00D4FF','#A855F7','#CCFF00'][i], 
        isLeader: false, 
        points: 0, 
        predictions: null, 
        task: null,
      }));
      finalSquad = { ...squad, members: [...squad.members, ...newMembers] };
      setSquad(finalSquad);
    }

    // Start orchestrator
    if (finalSquad && match) {
      const orc = new Orchestrator(finalSquad, match, (type, data) => {
        if (type === 'challenge') {
          setChallenges(prev => [data, ...prev]);
          addFeedItem(`⚡ New Challenge: ${data.challenge}`, 'challenge');
        } else if (type === 'challengeResolved') {
          setChallenges(prev => prev.map(c => c.id === data.id ? data : c));
          addFeedItem(`✅ Challenge resolved! Answer: ${data.correctAnswer}`, 'result');
          // Award random points to members
          squad.members.forEach(m => {
            const pts = Math.random() > 0.4 ? data.points : 0;
            if (pts) updatePoints(m.id, pts);
          });
        } else if (type === 'reward') {
          addReward(data);
          addFeedItem(`🎁 New Reward: ${data.offer}`, 'reward');
        }
      });
      orc.start();
      orchestratorRef.current = orc;
    }
  };

  // Update orchestrator match state
  useEffect(() => {
    if (orchestratorRef.current && match) {
      orchestratorRef.current.updateMatchState(match);
    }
  }, [match]);

  // Cleanup
  useEffect(() => {
    return () => orchestratorRef.current?.stop();
  }, []);

  // Check for post-match
  useEffect(() => {
    if (match?.matchEnded && phase === 'live') {
      setTimeout(() => {
        setPhase('post');
        addFeedItem('🎉 Match Over! Check your results!', 'event');
      }, 3000);
    }
  }, [match?.matchEnded, phase, addFeedItem]);

  const handleChallengeRespond = (challengeId, option) => {
    addFeedItem(`You picked: "${option}"`, 'action');
  };

  const handleClaimReward = (rewardId) => {
    claimReward(rewardId, currentUser?.id);
    const r = rewards.find(rw => rw.id === rewardId);
    if (r) {
      updatePoints(currentUser.id, r.points);
      addFeedItem(`🎁 Claimed: ${r.offer} (+${r.points} pts)`, 'reward');
    }
  };

  const handlePredictionSubmit = (pred) => {
    setPrediction(currentUser.id, pred);
    updatePoints(currentUser.id, 10);
    addFeedItem(`🎯 ${currentUser.name} locked their prediction!`, 'prediction');
    // Auto-set predictions for demo members
    squad?.members.forEach(m => {
      if (m.id !== currentUser.id && !m.predictions) {
        setPrediction(m.id, {
          score1: 140 + Math.floor(Math.random() * 40),
          score2: 140 + Math.floor(Math.random() * 40),
          mvp: ['David Warner', 'Shikhar Dhawan', 'Rishabh Pant'][Math.floor(Math.random() * 3)]
        });
      }
    });
  };

  // ─── RENDER ───

  if (phase === 'auth') return <Auth onLogin={handleLogin} />;
  if (phase === 'squad-setup') return <SquadSetup user={authUser} onCreateSquad={handleCreateSquad} onJoinSquad={handleJoinSquad} />;
  if (phase === 'lobby') return (
    <div>
      <div className="squad-header">
        <h3>🏟️ SquadUp</h3>
        <div className="avatar-stack">
          {squad?.members.map(m => <div key={m.id} className="avatar" style={{ background: m.color, width: 30, height: 30, fontSize: 11 }}>{m.name[0]}</div>)}
        </div>
      </div>
      <SquadLobby squad={squad} currentUser={currentUser} onAddDemo={addDemoMembers} onStart={handleStart} />
    </div>
  );

  if (phase === 'post') {
    return (
      <div>
        <div className="squad-header">
          <h3>🏟️ SquadUp</h3>
          <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--accent-lime)' }}>{totalPoints} pts</span>
        </div>
        <MatchMemory match={match} squad={squad} totalPoints={totalPoints} />
        <Leaderboard squad={squad} totalPoints={totalPoints} />
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>🚪 Exit Coordination</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Exit together via South Gate — +40 pts each, 2x squad multiplier</div>
          <div style={{ fontSize: 12, color: 'var(--accent-cyan)' }}>Estimated clear time: 12 min</div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 12 }}>Accept Exit Plan 🚶‍♂️</button>
        </div>
      </div>
    );
  }

  // LIVE PHASE
  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <LiveScore match={match} usingMock={usingMock} />
            {challenges.slice(0, 2).map(c => (
              <ChallengeCard key={c.id} challenge={c} currentUser={currentUser} onRespond={handleChallengeRespond} />
            ))}
            <p className="section-title">📢 Squad Feed</p>
            <div className="card">
              {feed.length === 0 && <div className="empty-state">Events will appear here...</div>}
              {feed.slice(0, 10).map(f => (
                <div className="feed-item" key={f.id}>
                  <div className="feed-content">
                    <div className="feed-text">{f.text}</div>
                    <div className="feed-time">{f.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 'predict':
        return (
          <>
            <LiveScore match={match} usingMock={usingMock} />
            <PredictionCard squad={squad} currentUser={currentUser} onSubmit={handlePredictionSubmit} match={match} />
            {challenges.length > 0 && <p className="section-title">Past Challenges</p>}
            {challenges.map(c => (
              <ChallengeCard key={c.id} challenge={c} currentUser={currentUser} onRespond={handleChallengeRespond} />
            ))}
          </>
        );
      case 'rewards':
        return <RewardPanel rewards={rewards} onClaim={handleClaimReward} totalPoints={totalPoints} squad={squad} />;
      case 'squad':
        return (
          <>
            <SquadMap squad={squad} />
            <Leaderboard squad={squad} totalPoints={totalPoints} />
          </>
        );
      case 'food':
        return <FoodCart squad={squad} currentUser={currentUser} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="squad-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3>🏟️ {squad?.name || 'SquadUp'}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--accent-lime)' }}>{totalPoints} pts</span>
          <div className="avatar-stack">
            {squad?.members.slice(0, 4).map(m => (
              <div key={m.id} className="avatar" style={{ background: m.color, width: 28, height: 28, fontSize: 10 }}>{m.name[0]}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-content">
        {renderTab()}
      </div>

      {/* Tab Bar */}
      <div className="tab-bar">
        {TABS.map(tab => (
          <button key={tab.id} className={`tab-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

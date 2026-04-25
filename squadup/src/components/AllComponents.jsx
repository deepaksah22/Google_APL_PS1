import React from 'react';
import QRCodeLib from 'react-qr-code';
const QRCode = QRCodeLib.default || QRCodeLib;

// ─── Auth Screen ───
export function Auth({ onLogin }) {
  const [name, setName] = React.useState('');
  const [section, setSection] = React.useState('A');
  return (
    <div className="auth-screen">
      <div style={{ fontSize: 48, marginBottom: 8 }}>🏟️</div>
      <div className="auth-logo">SquadUp</div>
      <div className="auth-tagline">Your Squad. Your Stadium. Your Game.</div>
      <div className="auth-form">
        <input className="input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        <select className="select" value={section} onChange={e => setSection(e.target.value)}>
          {['A','B','C','D','E'].map(s => <option key={s} value={s}>Section {s}</option>)}
        </select>
        <button className="btn btn-primary btn-full" disabled={!name.trim()} onClick={() => onLogin({ name: name.trim(), section })}>
          🚀 Get Started
        </button>
      </div>
    </div>
  );
}

// ─── Squad Create / Join ───
export function SquadSetup({ user, onCreateSquad, onJoinSquad, onAddDemo }) {
  const [mode, setMode] = React.useState(null); // null | 'create' | 'join'
  const [squadName, setSquadName] = React.useState(`${user.name}'s Squad`);
  const [joinCode, setJoinCode] = React.useState('');

  if (!mode) {
    return (
      <div className="auth-screen">
        <div style={{ fontSize: 48, marginBottom: 8 }}>👥</div>
        <h2 style={{ fontFamily: 'Outfit', marginBottom: 4 }}>Squad Time!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Create a new squad or join an existing one</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
          <button className="btn btn-primary btn-full" onClick={() => setMode('create')}>⚡ Create Squad</button>
          <button className="btn btn-secondary btn-full" onClick={() => setMode('join')}>🔗 Join Squad</button>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="auth-screen">
        <h2 style={{ fontFamily: 'Outfit', marginBottom: 16 }}>Create Your Squad</h2>
        <div className="auth-form">
          <input className="input" placeholder="Squad name" value={squadName} onChange={e => setSquadName(e.target.value)} />
          <button className="btn btn-primary btn-full" onClick={() => onCreateSquad(squadName)}>Create Squad 🎯</button>
          <button className="btn btn-ghost" onClick={() => setMode(null)}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <h2 style={{ fontFamily: 'Outfit', marginBottom: 16 }}>Join a Squad</h2>
      <div className="auth-form">
        <input className="input" placeholder="Enter squad code" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} maxLength={6} style={{ textAlign: 'center', letterSpacing: 4, fontSize: 20, fontWeight: 700 }} />
        <button className="btn btn-primary btn-full" disabled={joinCode.length < 4} onClick={() => onJoinSquad(joinCode)}>Join Squad 🤝</button>
        <button className="btn btn-ghost" onClick={() => setMode(null)}>← Back</button>
      </div>
    </div>
  );
}

// ─── Squad Lobby ───
export function SquadLobby({ squad, currentUser, onAddDemo, onStart }) {
  const inviteUrl = `${window.location.origin}?squad=${squad.code}`;
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'Outfit', fontSize: 22, marginBottom: 4 }}>{squad.name}</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>Share this code with your squad</p>
      <div className="squad-code">{squad.code}</div>
      <div className="qr-container"><QRCode value={inviteUrl} size={160} /></div>
      <p className="section-title" style={{ textAlign: 'left' }}>Squad Members ({squad.members.length})</p>
      <div className="member-list">
        {squad.members.map(m => (
          <div className="member-row" key={m.id}>
            <div className="avatar" style={{ background: m.color }}>{m.name[0]}</div>
            <span className="member-name">{m.name} {m.id === currentUser.id && '(You)'}</span>
            {m.isLeader && <span className="crown">👑</span>}
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sec {m.section}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onAddDemo}>+ Add Demo Members</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={onStart}>Start Match 🏏</button>
      </div>
    </div>
  );
}

// ─── Live Score Banner ───
export function LiveScore({ match, usingMock }) {
  if (!match) return null;
  const t1 = match.team1, t2 = match.team2;
  const batting = t1.batting ? t1 : t2;
  return (
    <div className="score-banner">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className="badge-live"><span className="live-dot" />LIVE</span>
        {usingMock && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Simulated</span>}
        {!usingMock && <span style={{ fontSize: 10, color: 'var(--accent-cyan)' }}>📡 Live API</span>}
      </div>
      <div className="score-teams">
        <div className="score-team">
          <div className="team-name" style={{ color: t1.color }}>{t1.short}</div>
          <div className="team-score">{t1.runs}/{t1.wickets}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>({t1.overs} ov)</div>
        </div>
        <div className="score-vs">vs</div>
        <div className="score-team">
          <div className="team-name" style={{ color: t2.color }}>{t2.short}</div>
          <div className="team-score">{t2.runs}/{t2.wickets}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>({t2.overs} ov)</div>
        </div>
      </div>
      <div className="score-status">{match.status}</div>
      {match.recentBalls?.length > 0 && (
        <div className="recent-balls">
          {match.recentBalls.map((b, i) => (
            <span key={i} className={`ball ${b === 'W' ? 'ball-wicket' : b === '6' ? 'ball-six' : b === '4' ? 'ball-four' : b === '•' ? 'ball-dot' : 'ball-run'}`}>{b}</span>
          ))}
        </div>
      )}
      <div className="rate-bar">
        <div className="rate-item"><div className="rate-label">CRR</div><div className="rate-value">{match.currentRate || '0.00'}</div></div>
        <div className="rate-item"><div className="rate-label">Target</div><div className="rate-value">{match.target}</div></div>
        <div className="rate-item"><div className="rate-label">RRR</div><div className="rate-value">{match.requiredRate || '-'}</div></div>
      </div>
    </div>
  );
}

// ─── Prediction Card ───
export function PredictionCard({ squad, currentUser, onSubmit, match }) {
  const [score1, setScore1] = React.useState(165);
  const [score2, setScore2] = React.useState(155);
  const [mvp, setMvp] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const t1 = match?.team1?.short || 'T1', t2 = match?.team2?.short || 'T2';

  if (submitted) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">📊 Squad Predictions</span></div>
        {squad.members.map(m => {
          const p = m.predictions || (m.id === currentUser.id ? { score1, score2, mvp } : { score1: 140 + Math.floor(Math.random() * 40), score2: 140 + Math.floor(Math.random() * 40), mvp: 'Rohit Sharma' });
          return (
            <div className="feed-item" key={m.id}>
              <div className="avatar" style={{ background: m.color, width: 32, height: 32, fontSize: 12 }}>{m.name[0]}</div>
              <div className="feed-content">
                <div className="feed-text"><strong>{m.name}</strong>: {t1} {p.score1} — {t2} {p.score2}</div>
                <div className="feed-time">MVP: {p.mvp || 'Not picked'}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header"><span className="card-title">🎯 Predict the Score</span><span className="card-badge badge-pts">+50 pts max</span></div>
      <div className="predict-form">
        <div className="predict-section"><label>{t1} Score</label>
          <input className="input" type="number" value={score1} onChange={e => setScore1(+e.target.value)} />
        </div>
        <div className="predict-section"><label>{t2} Score</label>
          <input className="input" type="number" value={score2} onChange={e => setScore2(+e.target.value)} />
        </div>
        <div className="predict-section"><label>MVP Pick</label>
          <input className="input" placeholder="e.g. Rohit Sharma" value={mvp} onChange={e => setMvp(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-full" onClick={() => { onSubmit({ score1, score2, mvp }); setSubmitted(true); }}>Lock Prediction 🔒</button>
      </div>
    </div>
  );
}

// ─── Challenge Card ───
export function ChallengeCard({ challenge, currentUser, onRespond }) {
  const [selected, setSelected] = React.useState(null);
  const [timer, setTimer] = React.useState(40);

  React.useEffect(() => {
    if (challenge.resolved) return;
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, [challenge.resolved]);

  if (!challenge) return null;

  const isResolved = challenge.resolved;

  return (
    <div className={`card challenge-card shimmer`}>
      <div className="card-header">
        <span className="card-title">⚡ Live Challenge</span>
        {!isResolved && <span className="challenge-timer">⏱ {timer}s</span>}
        {isResolved && <span className="card-badge" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>Resolved ✓</span>}
      </div>
      <div className="challenge-text">{challenge.challenge}</div>
      <div className="challenge-fact">💡 {challenge.fun_fact}</div>
      <div className="challenge-options">
        {challenge.options.map((opt, i) => {
          let cls = 'challenge-option';
          if (selected === i) cls += ' selected';
          if (isResolved && opt === challenge.correctAnswer) cls = 'challenge-option correct';
          else if (isResolved && selected === i && opt !== challenge.correctAnswer) cls = 'challenge-option wrong';
          return (
            <button key={i} className={cls} onClick={() => { if (!isResolved && selected === null) { setSelected(i); onRespond(challenge.id, opt); } }}>
              {opt}
            </button>
          );
        })}
      </div>
      {isResolved && selected !== null && (
        <div style={{ marginTop: 10, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>
          {challenge.options[selected] === challenge.correctAnswer
            ? <span style={{ color: 'var(--success)' }}>✅ Correct! +{challenge.points} pts</span>
            : <span style={{ color: 'var(--danger)' }}>❌ Wrong! Answer: {challenge.correctAnswer}</span>}
        </div>
      )}
    </div>
  );
}

// ─── Reward Panel ───
export function RewardPanel({ rewards, onClaim, totalPoints, squad }) {
  const CATALOG = [
    { name: 'Free Snack Upgrade', points: 100, emoji: '🎉' },
    { name: 'Merch Discount (20%)', points: 200, emoji: '👕' },
    { name: 'VIP Lounge Access', points: 350, emoji: '⭐' },
    { name: 'Early Access Tickets', points: 500, emoji: '🎫' },
  ];
  return (
    <>
      <p className="section-title">🎁 Available Rewards</p>
      {rewards.filter(r => !r.claimed).slice(0, 3).map(r => (
        <div className="card reward-card shimmer" key={r.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="reward-points">+{r.points} pts {r.emoji}</div>
              <div className="reward-offer">{r.offer}</div>
              <div className="reward-savings">⚡ {r.savings} • Bring your squad for 2x!</div>
            </div>
          </div>
          <button className="btn btn-coral btn-sm" style={{ marginTop: 10, width: '100%' }} onClick={() => onClaim(r.id)}>Accept Reward</button>
        </div>
      ))}
      <p className="section-title" style={{ marginTop: 8 }}>🏆 Reward Catalog</p>
      <div className="card">
        <div className="reward-catalog">
          {CATALOG.map((item, i) => (
            <div className={`reward-item ${totalPoints >= item.points ? 'unlocked' : ''}`} key={i}>
              <span className="reward-emoji">{item.emoji}</span>
              <div className="reward-info"><div className="reward-name">{item.name}</div><div className="reward-desc">{totalPoints >= item.points ? '✅ Unlocked!' : `${item.points - totalPoints} pts to go`}</div></div>
              <span className="reward-cost">{item.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Food Cart ───
export function FoodCart({ squad, currentUser, onAssign }) {
  const MENU = [
    { id: 1, name: 'Chicken Biryani', price: 250, emoji: '🍛' },
    { id: 2, name: 'Masala Chai', price: 40, emoji: '☕' },
    { id: 3, name: 'Cold Coffee', price: 120, emoji: '🧊' },
    { id: 4, name: 'Loaded Nachos', price: 180, emoji: '🧀' },
    { id: 5, name: 'Butter Popcorn', price: 150, emoji: '🍿' },
    { id: 6, name: 'Ice Cream Sundae', price: 160, emoji: '🍨' },
    { id: 7, name: 'Veg Burger', price: 140, emoji: '🍔' },
    { id: 8, name: 'Water Bottle', price: 30, emoji: '💧' },
    { id: 9, name: 'Pepsi', price: 60, emoji: '🥤' },
    { id: 10, name: 'Samosa (2pc)', price: 50, emoji: '🥟' },
  ];
  const [cart, setCart] = React.useState([]);
  const [plan, setPlan] = React.useState(null);

  const addItem = (item) => setCart(prev => [...prev, item]);
  const removeItem = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));
  const total = cart.reduce((s, i) => s + i.price, 0);

  const getSplitPlan = () => {
    const members = squad.members;
    const p = [
      { member: members[0]?.name, task: '🍔 Pick up food', location: 'Counter B7', time: '5 min' },
      ...(members.length >= 2 ? [{ member: members[1]?.name, task: '🚻 Restroom break', location: `Section ${squad.section}`, time: '3 min' }] : []),
      ...(members.length >= 3 ? [{ member: members[2]?.name, task: '💺 Hold the seats', location: `Section ${squad.section}`, time: '0 min' }] : []),
    ];
    setPlan(p);
  };

  return (
    <>
      <p className="section-title">🍽️ Stadium Menu</p>
      <div className="card">
        <div className="menu-grid">
          {MENU.map(item => (
            <div key={item.id} className={`menu-item ${cart.find(c => c.id === item.id) ? 'in-cart' : ''}`} onClick={() => addItem(item)}>
              <div className="menu-emoji">{item.emoji}</div>
              <div className="menu-name">{item.name}</div>
              <div className="menu-price">₹{item.price}</div>
            </div>
          ))}
        </div>
      </div>
      {cart.length > 0 && (
        <div className="card">
          <div className="card-header"><span className="card-title">🛒 Squad Cart</span><span className="card-badge badge-pts">{cart.length} items</span></div>
          <div className="cart-items">
            {cart.map((item, i) => (
              <div className="cart-row" key={i}>
                <span>{item.emoji} {item.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  ₹{item.price}
                  <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 14 }}>✕</button>
                </span>
              </div>
            ))}
            <div className="cart-row cart-total"><span>Total</span><span style={{ color: 'var(--accent-lime)' }}>₹{total}</span></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={getSplitPlan}>🤖 AI Split & Meet</button>
            <button className="btn btn-coral" style={{ flex: 1 }}>Place Order</button>
          </div>
        </div>
      )}
      {plan && (
        <div className="card">
          <div className="card-header"><span className="card-title">📍 Split & Meet Plan</span></div>
          <div className="split-plan">
            {plan.map((step, i) => (
              <div className="split-step" key={i}>
                <div className="avatar" style={{ background: squad.members[i]?.color || '#666' }}>{step.member?.[0]}</div>
                <div className="split-task"><div className="split-task-name">{step.task}</div><div className="split-task-loc">{step.location}</div></div>
                <div className="split-time">{step.time}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--accent-cyan)' }}>🕐 Everyone back together in ~5 min</div>
        </div>
      )}
    </>
  );
}

// ─── Leaderboard ───
export function Leaderboard({ squad, totalPoints }) {
  const sorted = [...(squad?.members || [])].sort((a, b) => b.points - a.points);
  const rivalScore = Math.floor(totalPoints * (0.7 + Math.random() * 0.5));
  return (
    <>
      <p className="section-title">🏆 Squad Leaderboard</p>
      <div className="card">
        {sorted.map((m, i) => (
          <div className="lb-row" key={m.id}>
            <span className="lb-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
            <div className="avatar" style={{ background: m.color, width: 32, height: 32, fontSize: 12 }}>{m.name[0]}</div>
            <span className="lb-name">{m.name} {m.isLeader && '👑'}</span>
            <span className="lb-points">{m.points} pts</span>
          </div>
        ))}
      </div>
      <p className="section-title">⚔️ Squad vs Squad</p>
      <div className="card">
        <div className="vs-card">
          <div className="vs-squad"><div className="vs-squad-name">{squad?.name}</div><div className="vs-squad-score" style={{ color: totalPoints >= rivalScore ? 'var(--accent-lime)' : 'var(--text-primary)' }}>{totalPoints}</div></div>
          <div className="vs-divider">VS</div>
          <div className="vs-squad"><div className="vs-squad-name">Section C Squad</div><div className="vs-squad-score" style={{ color: rivalScore > totalPoints ? 'var(--accent-coral)' : 'var(--text-primary)' }}>{rivalScore}</div></div>
        </div>
      </div>
    </>
  );
}

// ─── Squad Map ───
export function SquadMap({ squad }) {
  const sectionPositions = { A: { x: 50, y: 12 }, B: { x: 88, y: 40 }, C: { x: 75, y: 85 }, D: { x: 25, y: 85 }, E: { x: 12, y: 40 } };
  return (
    <>
      <p className="section-title">📍 Where's My Squad?</p>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="venue-map">
          <div className="venue-oval" />
          <div className="venue-pitch" />
          {['A','B','C','D','E'].map(s => (
            <div key={s} className="map-label" style={{ left: `${sectionPositions[s].x}%`, top: `${sectionPositions[s].y - 5}%` }}>SEC {s}</div>
          ))}
          {squad?.members.map((m, i) => {
            const pos = sectionPositions[m.section] || sectionPositions['A'];
            const offset = i * 6;
            return (
              <div key={m.id} className={`map-dot ${m.task ? 'on-task' : ''}`}
                style={{ left: `${pos.x + offset - 4}%`, top: `${pos.y + 5}%`, background: m.color, fontSize: 11 }}>
                {m.name[0]}
              </div>
            );
          })}
          <div className="map-status">
            {squad?.members.filter(m => m.task).map(m => (
              <span key={m.id} style={{ marginRight: 12 }}>{m.name}: {m.task?.task || 'On a task'} </span>
            ))}
            {squad?.members.filter(m => m.task).length === 0 && '👥 Everyone at their seats'}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Match Memory Card (Post-Match) ───
export function MatchMemory({ match, squad, totalPoints }) {
  const sorted = [...(squad?.members || [])].sort((a, b) => b.points - a.points);
  const mvp = sorted[0];
  return (
    <div className="memory-card">
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>🏟️ Match Memory</div>
      <h2>{match?.team1?.short} vs {match?.team2?.short}</h2>
      <div className="memory-score">{match?.team1?.runs}/{match?.team1?.wickets} — {match?.team2?.runs}/{match?.team2?.wickets}</div>
      <div style={{ color: 'var(--accent-cyan)', fontSize: 14 }}>{match?.status}</div>
      <div className="memory-stats">
        <div className="memory-stat"><div className="memory-stat-label">Squad MVP</div><div className="memory-stat-value">{mvp?.name} 🏆</div></div>
        <div className="memory-stat"><div className="memory-stat-label">Total Points</div><div className="memory-stat-value" style={{ color: 'var(--accent-lime)' }}>{totalPoints}</div></div>
        <div className="memory-stat"><div className="memory-stat-label">Challenges</div><div className="memory-stat-value">🎯 Played</div></div>
        <div className="memory-stat"><div className="memory-stat-label">Rewards</div><div className="memory-stat-value">🎁 Earned</div></div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--accent-coral)', marginTop: 8 }}>"{mvp?.name} carried the squad today — prediction machine! 🔥"</div>
    </div>
  );
}

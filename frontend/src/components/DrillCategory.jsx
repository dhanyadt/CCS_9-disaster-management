import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DRILL_COLORS = {
  earthquake: { bg: "#FEF3C7", border: "#FCD34D", accent: "#D97706", hover: "#FFFBEB" },
  flood:      { bg: "#E0F2FE", border: "#7DD3FC", accent: "#0284C7", hover: "#F0F9FF" },
  fire:       { bg: "#FFEDD5", border: "#FDBA74", accent: "#EA580C", hover: "#FFF7ED" },
  cyclone:    { bg: "#EFF6FF", border: "#BFDBFE", accent: "#3B82F6", hover: "#EFF6FF" },
  stampede:   { bg: "#FEF9C3", border: "#FDE047", accent: "#CA8A04", hover: "#FEFCE8" },
};

function dc(key) {
  return DRILL_COLORS[key?.toLowerCase()] || { 
    bg: "#F1F5F9", border: "#E2E8F0", accent: "#2D6A4F", hover: "#F8FAFC" 
  };
}

const DRILL_CATEGORIES = [
  {
    key:       "natural",
    title:     "Natural Disasters",
    desc:      "Practice responses to earthquakes, floods and cyclones",
    drills:    [
      { key: "earthquake", title: "Earthquake", scenarios: 12, difficulty: "Medium" },
      { key: "flood",      title: "Flood",      scenarios: 12, difficulty: "Medium" },
      { key: "cyclone",    title: "Cyclone",    scenarios: 11, difficulty: "Hard"   },
    ],
  },
  {
    key:       "manmade",
    title:     "Man-made Disasters",
    desc:      "Train for stampedes and man-made crises",
    drills:    [
      { key: "stampede", title: "Stampede", scenarios: 11, difficulty: "Hard" },
    ],
  },
  {
    key:       "fire",
    title:     "Fire Safety",
    desc:      "Fire evacuation, extinguisher use and prevention drills",
    drills:    [
      { key: "fire", title: "Fire", scenarios: 12, difficulty: "Medium" },
    ],
  },
];

const DIFF_STYLE = {
  Easy:   { bg: "#D1FAE5", color: "#15803D" },
  Medium: { bg: "#FEF9C3", color: "#B45309" },
  Hard:   { bg: "#FEE2E2", color: "#B91C1C" },
};

/* ── updated CSS with consistent styling ── */
const DRILL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  @keyframes dcFadeUp { 
    from { opacity:0; transform:translateY(12px); } 
    to { opacity:1; transform:translateY(0); } 
  }
  
  body { 
    background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    position: relative;
  }
  
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2340964C' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .dc-root { 
    font-family: 'DM Sans', sans-serif; 
    color: #0F172A; 
    width: 100%; 
    max-width: 1200px;
    margin: 0 auto;
    padding: 28px 28px 56px;
    position: relative;
    z-index: 1;
  }

  .dc-banner {
    background: linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%);
    border-radius: 16px; 
    padding: 32px 36px; 
    color: #fff;
    margin-bottom: 28px; 
    box-shadow: 0 4px 12px rgba(45,106,79,.15);
    animation: dcFadeUp .4s ease both; 
    position: relative; 
    overflow: hidden;
  }
  .dc-banner::after {
    content: ''; 
    position: absolute; 
    inset: 0;
    background: radial-gradient(ellipse at 85% 50%, rgba(255,255,255,.07) 0%, transparent 60%);
    pointer-events: none;
  }
  .dc-banner h2 { 
    font-size: 1.6rem; 
    font-weight: 700; 
    letter-spacing: -.02em; 
    color: #fff; 
    margin-bottom: 8px; 
  }
  .dc-banner p  { 
    font-size: .88rem; 
    opacity: .88; 
    margin: 0; 
  }

  .dc-section-hd { 
    margin-bottom: 16px; 
  }
  .dc-section-hd h3 { 
    font-size: 1.1rem; 
    font-weight: 700; 
    color: #1A3A2A; 
  }
  .dc-section-hd p  { 
    font-size: .78rem; 
    color: #5A7A6A; 
    margin-top: 4px; 
  }

  /* category block */
  .dc-cat-block {
    background: #FFFFFF; 
    border-radius: 16px;
    border: 1px solid #E8F0E8;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    margin-bottom: 20px;
    animation: dcFadeUp .4s ease both;
    overflow: hidden;
  }
  .dc-cat-hd {
    padding: 20px 24px; 
    border-bottom: 1px solid #F0F8F0;
    display: flex; 
    align-items: center; 
    justify-content: space-between;
  }
  .dc-cat-title { 
    font-size: 1rem; 
    font-weight: 700; 
    color: #1A3A2A; 
  }
  .dc-cat-desc  { 
    font-size: .75rem; 
    color: #5A7A6A; 
    margin-top: 4px; 
  }
  .dc-count-pill {
    font-size: .7rem; 
    font-weight: 700; 
    padding: 4px 12px;
    border-radius: 99px; 
    background: #F8FFF8; 
    color: #2D6A4F;
    border: 1px solid #E8F0E8; 
    white-space: nowrap; 
    flex-shrink: 0;
  }

  /* drill row inside category */
  .dc-drill-row {
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    padding: 16px 24px; 
    border-bottom: 1px solid #F8FFF8;
    cursor: pointer; 
    transition: all .2s ease;
    gap: 20px;
  }
  .dc-drill-row:last-child { border-bottom: none; }
  .dc-drill-row:hover { 
    background: #F8FFF8; 
    transform: translateX(4px);
  }

  .dc-drill-name  { 
    font-size: .92rem; 
    font-weight: 700; 
    transition: color .2s ease; 
  }
  .dc-drill-meta  { 
    font-size: .72rem; 
    color: #5A7A6A; 
    margin-top: 4px; 
  }
  .dc-drill-score { 
    font-size: .76rem; 
    font-weight: 700; 
  }

  .dc-diff-badge { 
    padding: 4px 12px; 
    border-radius: 99px; 
    font-size: .68rem; 
    font-weight: 700; 
    flex-shrink: 0; 
  }

  .dc-start-btn {
    padding: 8px 20px; 
    border-radius: 10px; 
    border: none;
    font-family: 'DM Sans', sans-serif; 
    font-size: .8rem; 
    font-weight: 600;
    cursor: pointer; 
    color: #fff; 
    white-space: nowrap; 
    flex-shrink: 0;
    transition: all .2s ease;
  }
  .dc-start-btn:hover { 
    opacity: .88; 
    transform: translateY(-2px); 
    filter: brightness(1.05);
  }

  /* info strip */
  .dc-info {
    background: #FFFFFF; 
    border-radius: 16px; 
    padding: 20px 24px;
    border: 1px solid #E8F0E8; 
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    gap: 20px; 
    flex-wrap: wrap;
    animation: dcFadeUp .4s ease both;
    margin-top: 8px;
  }
  .dc-info-text { 
    font-size: .82rem; 
    color: #5A7A6A; 
    line-height: 1.6; 
  }
  .dc-info-text strong { 
    color: #1A3A2A; 
  }

  .dc-view-btn {
    padding: 10px 24px; 
    border-radius: 10px; 
    border: 1px solid #E8F0E8;
    background: #F8FFF8; 
    color: #2D6A4F;
    font-family: 'DM Sans', sans-serif; 
    font-size: .82rem; 
    font-weight: 600;
    cursor: pointer; 
    transition: all .2s ease; 
    white-space: nowrap; 
    flex-shrink: 0;
  }
  .dc-view-btn:hover { 
    background: #2D6A4F; 
    color: #fff; 
    border-color: #2D6A4F; 
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .dc-root { padding: 20px 16px 40px; }
    .dc-banner { padding: 24px 28px; }
    .dc-banner h2 { font-size: 1.3rem; }
    .dc-drill-row { flex-wrap: wrap; padding: 16px 20px; }
    .dc-start-btn { width: 100%; margin-top: 8px; }
    .dc-info { flex-direction: column; text-align: center; }
  }
`;

function useDcStyles() {
  useEffect(() => {
    const existing = document.getElementById("dc-css");
    if (existing) existing.remove();
    const s = document.createElement("style");
    s.id = "dc-css";
    s.textContent = DRILL_CSS;
    document.head.appendChild(s);
  }, []);
}

/* ── DrillRow with hover color ── */
function DrillRow({ drill, savedScore, onStart, delay }) {
  const [hovered, setHovered] = useState(false);
  const col  = dc(drill.key);
  const diff = DIFF_STYLE[drill.difficulty] || DIFF_STYLE.Medium;

  return (
    <div
      className="dc-drill-row"
      style={{ 
        background: hovered ? col.hover : "#FFFFFF", 
        animationDelay: `${delay}s`,
        borderLeft: `4px solid ${col.accent}`
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onStart(drill.key)}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="dc-drill-name" style={{ color: hovered ? col.accent : "#1A3A2A" }}>
          {drill.title}
        </div>
        <div className="dc-drill-meta">
          {drill.scenarios} scenarios • 30s per question
          {savedScore !== undefined && (
            <span className="dc-drill-score" style={{
              marginLeft: 12,
              color: savedScore >= 75 ? "#10B981" : savedScore >= 50 ? "#F59E0B" : "#EF4444"
            }}>
              Best: {savedScore}%
            </span>
          )}
        </div>
      </div>

      <span className="dc-diff-badge" style={{ background: diff.bg, color: diff.color }}>
        {drill.difficulty}
      </span>

      <button
        className="dc-start-btn"
        style={{ background: col.accent }}
        onClick={e => { e.stopPropagation(); onStart(drill.key); }}
      >
        {savedScore !== undefined ? "Retry" : "Start"}
      </button>
    </div>
  );
}

function DrillCategory({ user }) {           // ← accept user prop
  useDcStyles();
  const navigate = useNavigate();
  const username = user?.username || "guest"; // ← add this
  const savedScores = JSON.parse(localStorage.getItem(`drillScores_${username}`) || "{}"); 

  return (
    <div className="dc-root">

      {/* banner */}
      <div className="dc-banner">
        <h2>Virtual Drill Simulator</h2>
        <p>Choose a drill below to start your timed emergency scenario</p>
      </div>

      {/* categories stacked */}
      <div className="dc-section-hd">
        <h3>Select a Drill</h3>
        <p>Each scenario gives you 30 seconds to choose the correct action</p>
      </div>

      {DRILL_CATEGORIES.map((cat, ci) => (
        <div key={cat.key} className="dc-cat-block" style={{ animationDelay: `${ci * .08}s` }}>
          <div className="dc-cat-hd">
            <div>
              <div className="dc-cat-title">{cat.title}</div>
              <div className="dc-cat-desc">{cat.desc}</div>
            </div>
            <span className="dc-count-pill">{cat.drills.length} drill{cat.drills.length !== 1 ? "s" : ""}</span>
          </div>

          {cat.drills.map((drill, di) => (
            <DrillRow
              key={drill.key}
              drill={drill}
              savedScore={savedScores[drill.key]}
              onStart={key => navigate(`/student/drill/${key}`)}
              delay={ci * .08 + di * .04}
            />
          ))}
        </div>
      ))}

      {/* info strip */}
      <div className="dc-info">
        <div className="dc-info-text">
          <strong>How drills work</strong><br />
          Each scenario presents a real emergency situation. You have 30 seconds to pick the right action. Your score is saved to your dashboard.
        </div>
        <button className="dc-view-btn" onClick={() => navigate("/student/dashboard")}>
          View My Scores
        </button>
      </div>

    </div>
  );
}

export default DrillCategory;
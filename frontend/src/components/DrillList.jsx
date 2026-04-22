import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const CATEGORY_DRILLS = {
  natural: {
    title: "Natural Disasters", accent: "#2D6A4F",
    drills: [
      { key: "earthquake", title: "Earthquake", desc: "12 scenarios — indoor safety, gas leaks, first aid, emergency kits",      scenarios: 12, difficulty: "Medium" },
      { key: "flood",      title: "Flood",      desc: "12 scenarios — flood watch response, moving water, re-entry safety",       scenarios: 12, difficulty: "Medium" },
      { key: "cyclone",    title: "Cyclone",    desc: "11 scenarios — evacuation, eye of the storm, downed power lines",          scenarios: 11, difficulty: "Hard"   },
    ],
  },
  manmade: {
    title: "Man-made Disasters", accent: "#CA8A04",
    drills: [
      { key: "stampede", title: "Stampede", desc: "11 scenarios — crowd movement, crush survival, helping others, emergency call", scenarios: 11, difficulty: "Hard" },
    ],
  },
  fire: {
    title: "Fire Safety", accent: "#EA580C",
    drills: [
      { key: "fire", title: "Fire", desc: "12 scenarios — smoke detection, crawling low, re-entry, extinguisher use", scenarios: 12, difficulty: "Medium" },
    ],
  },
};

const DIFF_STYLE = {
  Easy:   { bg: "#D1FAE5", color: "#15803D" },
  Medium: { bg: "#FEF9C3", color: "#B45309" },
  Hard:   { bg: "#FEE2E2", color: "#B91C1C" },
};

/* ── updated CSS with consistent styling ── */
const DL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  @keyframes dlFadeUp { 
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

  .dl-root { 
    font-family: 'DM Sans', sans-serif; 
    color: #0F172A; 
    width: 100%; 
    max-width: 900px;
    margin: 0 auto;
    padding: 28px 28px 56px;
    position: relative;
    z-index: 1;
  }

  .dl-breadcrumb { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    margin-bottom: 24px; 
    flex-wrap: wrap; 
  }
  .dl-back-btn {
    padding: 8px 20px; 
    border-radius: 10px; 
    border: 1px solid #E8F0E8;
    background: #FFFFFF; 
    color: #2D6A4F; 
    font-family: 'DM Sans', sans-serif;
    font-size: .82rem; 
    font-weight: 600; 
    cursor: pointer; 
    transition: all .2s ease;
  }
  .dl-back-btn:hover { 
    background: #2D6A4F; 
    color: #fff; 
    border-color: #2D6A4F; 
    transform: translateY(-1px);
  }
  .dl-crumb-sep   { color: #C8E6C9; font-size: .9rem; }
  .dl-crumb-label { 
    font-size: .88rem; 
    font-weight: 700; 
  }

  .dl-banner {
    border-radius: 16px; 
    padding: 28px 32px; 
    color: #fff;
    margin-bottom: 24px; 
    animation: dlFadeUp .4s ease both;
    position: relative; 
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,.08);
  }
  .dl-banner h2 { 
    font-size: 1.5rem; 
    font-weight: 700; 
    color: #fff; 
    margin-bottom: 6px; 
    letter-spacing: -.02em; 
  }
  .dl-banner p  { 
    font-size: .85rem; 
    opacity: .92; 
    margin: 0; 
  }

  .dl-drill-card {
    background: #FFFFFF; 
    border-radius: 16px;
    border: 1px solid #E8F0E8; 
    border-left-width: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    padding: 20px 24px; 
    margin-bottom: 12px;
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    gap: 20px;
    cursor: pointer; 
    transition: all .2s ease;
    animation: dlFadeUp .4s ease both;
    flex-wrap: wrap;
  }
  .dl-drill-card:hover { 
    box-shadow: 0 8px 20px rgba(45,106,79,.12); 
    transform: translateX(4px); 
    border-color: #C8E6C9;
  }

  .dl-drill-title { 
    font-size: .96rem; 
    font-weight: 700; 
    transition: color .2s ease; 
  }
  .dl-drill-desc  { 
    font-size: .74rem; 
    color: #5A7A6A; 
    margin-top: 4px; 
    line-height: 1.5; 
  }
  .dl-drill-meta  { 
    font-size: .72rem; 
    color: #5A7A6A; 
    margin-top: 8px; 
    display: flex; 
    gap: 16px; 
    align-items: center; 
    flex-wrap: wrap; 
  }

  .dl-diff-badge { 
    padding: 4px 12px; 
    border-radius: 99px; 
    font-size: .68rem; 
    font-weight: 700; 
  }
  .dl-score-tag  { 
    font-size: .74rem; 
    font-weight: 700; 
  }

  .dl-start-btn {
    padding: 10px 24px; 
    border-radius: 10px; 
    border: none; 
    flex-shrink: 0;
    font-family: 'DM Sans', sans-serif; 
    font-size: .84rem; 
    font-weight: 600;
    cursor: pointer; 
    color: #fff; 
    transition: all .2s ease;
    white-space: nowrap;
  }
  .dl-start-btn:hover { 
    opacity: .88; 
    transform: translateY(-2px); 
    filter: brightness(1.05);
  }

  .dl-tip {
    background: #FFFFFF; 
    border-radius: 16px; 
    padding: 20px 24px;
    border: 1px solid #E8F0E8; 
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    display: flex; 
    align-items: center; 
    gap: 20px; 
    flex-wrap: wrap;
    animation: dlFadeUp .4s ease both;
    margin-top: 8px;
  }
  .dl-tip-text { 
    font-size: .82rem; 
    color: #5A7A6A; 
    line-height: 1.6; 
    flex: 1; 
  }
  .dl-tip-text strong { 
    color: #1A3A2A; 
  }
  .dl-tip-btn {
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
  .dl-tip-btn:hover { 
    background: #2D6A4F; 
    color: #fff; 
    border-color: #2D6A4F; 
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    .dl-root { padding: 20px 16px 40px; }
    .dl-banner { padding: 24px 20px; }
    .dl-banner h2 { font-size: 1.2rem; }
    .dl-drill-card { padding: 16px 20px; flex-direction: column; align-items: stretch; }
    .dl-start-btn { width: 100%; text-align: center; }
    .dl-tip { flex-direction: column; text-align: center; }
  }
`;

function useDlStyles() {
  useEffect(() => {
    const existing = document.getElementById("dl-css");
    if (existing) existing.remove();
    const s = document.createElement("style");
    s.id = "dl-css";
    s.textContent = DL_CSS;
    document.head.appendChild(s);
  }, []);
}

function DrillCard({ drill, savedScore, onStart, delay }) {
  const [hovered, setHovered] = useState(false);
  const col  = dc(drill.key);
  const diff = DIFF_STYLE[drill.difficulty] || DIFF_STYLE.Medium;

  return (
    <div
      className="dl-drill-card"
      style={{ 
        borderLeftColor: col.accent, 
        background: hovered ? col.hover : "#FFFFFF", 
        animationDelay: `${delay}s` 
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onStart(drill.key)}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="dl-drill-title" style={{ color: hovered ? col.accent : "#1A3A2A" }}>
          {drill.title}
        </div>
        <div className="dl-drill-desc">{drill.desc}</div>
        <div className="dl-drill-meta">
          <span>{drill.scenarios} scenarios</span>
          <span>30s per question</span>
          <span className="dl-diff-badge" style={{ background: diff.bg, color: diff.color }}>
            {drill.difficulty}
          </span>
          {savedScore !== undefined && (
            <span className="dl-score-tag" style={{ 
              color: savedScore >= 75 ? "#10B981" : savedScore >= 50 ? "#F59E0B" : "#EF4444" 
            }}>
              Best: {savedScore}%
            </span>
          )}
        </div>
      </div>
      <button
        className="dl-start-btn"
        style={{ background: col.accent }}
        onClick={e => { e.stopPropagation(); onStart(drill.key); }}
      >
        {savedScore !== undefined ? "Retry" : "Start"}
      </button>
    </div>
  );
}

function DrillList() {
  useDlStyles();
  const navigate = useNavigate();
  const { category } = useParams();
  const cat = CATEGORY_DRILLS[category];
  const savedScores = JSON.parse(localStorage.getItem("drillScores") || "{}");

  if (!cat) {
    return (
      <div className="dl-root">
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 40, textAlign: "center", border: "1px solid #E8F0E8" }}>
          <h2 style={{ color: "#1A3A2A", marginBottom: 12 }}>Category not found</h2>
          <button 
            onClick={() => navigate("/student/drills")} 
            style={{ 
              padding: "10px 24px", 
              borderRadius: 10, 
              border: "1px solid #E8F0E8",
              background: "#F8FFF8", 
              color: "#2D6A4F",
              fontFamily: "DM Sans, sans-serif",
              fontSize: ".85rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            ← Back to Drills
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dl-root">

      <div className="dl-breadcrumb">
        <button className="dl-back-btn" onClick={() => navigate("/student/drills")}>← Back</button>
        <span className="dl-crumb-sep">›</span>
        <span className="dl-crumb-label" style={{ color: cat.accent }}>{cat.title}</span>
      </div>

      <div className="dl-banner" style={{ 
        background: `linear-gradient(135deg, ${cat.accent} 0%, ${cat.accent}dd 100%)`,
        boxShadow: `0 4px 12px ${cat.accent}33`
      }}>
        <h2>{cat.title}</h2>
        <p>{cat.drills.length} drill{cat.drills.length !== 1 ? "s" : ""} available — 30 seconds per scenario</p>
      </div>

      <div>
        {cat.drills.map((drill, i) => (
          <DrillCard
            key={drill.key}
            drill={drill}
            savedScore={savedScores[drill.key]}
            onStart={key => navigate(`/student/drill/${key}`)}
            delay={i * .07}
          />
        ))}
      </div>

      <div className="dl-tip">
        <div className="dl-tip-text">
          <strong>Tip:</strong> Read the learning modules for this category before attempting the drill — it will improve your score significantly.
        </div>
        <button className="dl-tip-btn" onClick={() => navigate(`/student/category/${category}`)}>
          Go to Learning Modules
        </button>
      </div>

    </div>
  );
}

export default DrillList;
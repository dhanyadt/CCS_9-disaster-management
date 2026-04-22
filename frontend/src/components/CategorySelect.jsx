import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

/* ── updated color tokens to match Dashboard palette ── */
const DRILL_COLORS = {
  earthquake: { bg: "#FEF3C7", border: "#FCD34D", accent: "#D97706", text: "#92400E", hover: "#FFFBEB" },
  flood:      { bg: "#E0F2FE", border: "#7DD3FC", accent: "#0284C7", text: "#075985", hover: "#F0F9FF" },
  fire:       { bg: "#FFEDD5", border: "#FDBA74", accent: "#EA580C", text: "#9A3412", hover: "#FFF7ED" },
  cyclone:    { bg: "#EFF6FF", border: "#BFDBFE", accent: "#3B82F6", text: "#1E3A8A", hover: "#EFF6FF" },
  stampede:   { bg: "#FEF9C3", border: "#FDE047", accent: "#CA8A04", text: "#854D0E", hover: "#FEFCE8" },
};

const CATEGORIES = [
  {
    key:      "earthquake",
    title:    "Earthquake",
    subtitle: "Drop, Cover, Hold On · Seismic Safety · Post-quake Response",
    desc:     "Master survival protocols for seismic events. Learn to protect yourself during shaking, respond to aftershocks, and handle post-earthquake hazards.",
    modules:  ["Drop & Cover", "Aftershocks", "Gas Leaks", "First Aid", "Emergency Kit"],
    route:    "/student/category/earthquake",
  },
  {
    key:      "flood",
    title:    "Flood",
    subtitle: "Flood Watch · Evacuation Routes · Safe Shelter · Re-entry",
    desc:     "Understand flood warnings and the difference between a watch and a warning. Learn evacuation routes, what to do when floodwater enters your area, and when it's safe to return.",
    modules:  ["Flood Watch vs Warning", "Evacuation", "Moving Water Safety", "Re-entry Protocol"],
    route:    "/student/category/flood",
  },
  {
    key:      "fire",
    title:    "Fire",
    subtitle: "Prevention · Smoke Alarms · Evacuation · Extinguisher Use",
    desc:     "Fire can escalate from a spark to an inferno in minutes. Learn fire prevention habits, alarm systems, escape planning, and how to correctly operate a fire extinguisher.",
    modules:  ["Fire Prevention", "Smoke & Alarms", "Evacuation Planning", "Extinguisher Use"],
    route:    "/student/category/fire",
  },
  {
    key:      "cyclone",
    title:    "Cyclone",
    subtitle: "Storm Surge · Shelter · Eye of the Storm · Downed Lines",
    desc:     "Prepare for high winds and storm surges. Know when to evacuate coastal areas, how to shelter safely, and what the eerie calm of a cyclone's eye really means.",
    modules:  ["Cyclone Warning", "Evacuation", "Sheltering Safely", "Post-Cyclone Hazards"],
    route:    "/student/category/cyclone",
  },
  {
    key:      "stampede",
    title:    "Stampede",
    subtitle: "Crowd Safety · Panic Response · Helping Others · Emergency Call",
    desc:     "Understand how crowd panic spreads and how to protect yourself in dense gatherings. Learn crowd movement techniques, how to help fallen people, and what to do after you reach safety.",
    modules:  ["Crowd Awareness", "Crowd Movement", "Helping Others", "Post-Stampede Response"],
    route:    "/student/category/stampede",
  },
];

/* ── updated CSS with consistent styling ── */
const CS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes csFadeUp { 
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

  .cs-root { 
    font-family: 'DM Sans', sans-serif; 
    color: #0F172A; 
    width: 100%; 
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* ── banner with updated gradient ── */
  .cs-banner {
    background: linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%);
    padding: 32px 36px; 
    color: #fff;
    position: relative; 
    overflow: hidden;
    animation: csFadeUp .4s ease both;
    margin: 28px 28px 0;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(45,106,79,.15);
  }
  .cs-banner::after {
    content: ''; 
    position: absolute; 
    inset: 0;
    background: radial-gradient(ellipse at 85% 50%, rgba(255,255,255,.07) 0%, transparent 60%);
    pointer-events: none;
  }
  .cs-banner-greeting { 
    font-size: .82rem; 
    opacity: .85; 
    margin-bottom: 6px; 
    letter-spacing: .01em; 
  }
  .cs-banner h1 { 
    font-size: 1.8rem; 
    font-weight: 700; 
    letter-spacing: -.02em; 
    color: #fff; 
    margin-bottom: 8px; 
  }
  .cs-banner p  { 
    font-size: .88rem; 
    opacity: .9; 
    margin-bottom: 20px; 
  }

  .cs-chips { 
    display: flex; 
    gap: 10px; 
    flex-wrap: wrap; 
  }
  .cs-chip {
    background: rgba(255,255,255,.15); 
    border: 1px solid rgba(255,255,255,.25);
    color: rgba(255,255,255,.95); 
    padding: 6px 16px; 
    border-radius: 99px;
    font-size: .76rem; 
    font-weight: 500;
  }

  /* ── section label ── */
  .cs-section-lbl {
    padding: 28px 28px 16px;
    font-size: .7rem; 
    font-weight: 700; 
    letter-spacing: .08em;
    text-transform: uppercase; 
    color: #5A7A6A;
  }

  /* ── category cards ── */
  .cs-cards { 
    padding: 0 28px 20px; 
    display: flex; 
    flex-direction: column; 
    gap: 12px; 
  }

  .cs-card {
    background: #FFFFFF; 
    border-radius: 16px;
    border: 1px solid #E8F0E8; 
    border-left-width: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    display: flex; 
    align-items: stretch;
    overflow: hidden; 
    cursor: pointer;
    transition: all .2s ease;
    animation: csFadeUp .4s ease both;
  }
  .cs-card:hover { 
    transform: translateX(6px); 
    box-shadow: 0 8px 20px rgba(45,106,79,.12); 
    border-color: #C8E6C9;
  }

  /* icon col */
  .cs-icon-col {
    width: 80px; 
    flex-shrink: 0;
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: 2rem;
    transition: background .2s ease;
  }

  /* body */
  .cs-card-body { 
    flex: 1; 
    padding: 20px 24px; 
    min-width: 0; 
  }
  .cs-card-title    { 
    font-size: 1.05rem; 
    font-weight: 700; 
    margin-bottom: 4px; 
    transition: color .2s ease; 
  }
  .cs-card-subtitle { 
    font-size: .72rem; 
    color: #5A7A6A; 
    font-weight: 500; 
    margin-bottom: 10px; 
  }
  .cs-card-desc     { 
    font-size: .8rem; 
    color: #5A7A6A; 
    line-height: 1.6; 
    margin-bottom: 12px; 
  }

  .cs-tags { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 8px; 
  }
  .cs-tag  { 
    padding: 4px 12px; 
    border-radius: 99px; 
    font-size: .7rem; 
    font-weight: 600; 
    border: 1px solid transparent; 
  }

  /* right col */
  .cs-card-right {
    flex-shrink: 0; 
    width: 180px;
    display: flex; 
    flex-direction: column;
    align-items: flex-end; 
    justify-content: center;
    padding: 20px 24px 20px 0; 
    gap: 12px;
  }
  .cs-card-btn {
    padding: 10px 24px; 
    border-radius: 10px; 
    border: none;
    font-family: 'DM Sans', sans-serif; 
    font-size: .82rem; 
    font-weight: 600;
    color: #fff; 
    cursor: pointer; 
    white-space: nowrap;
    transition: all .2s ease;
  }
  .cs-card-btn:hover { 
    opacity: .88; 
    transform: translateX(3px); 
    filter: brightness(1.05);
  }

  /* ── bottom bar ── */
  .cs-bottom {
    margin: 8px 28px 32px;
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
    animation: csFadeUp .4s ease both;
  }
  .cs-bottom-text { 
    font-size: .82rem; 
    color: #5A7A6A; 
  }
  .cs-bottom-text strong { 
    color: #2D6A4F; 
  }
  .cs-bottom-actions { 
    display: flex; 
    gap: 10px; 
  }

  .cs-bottom-btn {
    padding: 10px 22px; 
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif; 
    font-size: .82rem; 
    font-weight: 600;
    cursor: pointer; 
    transition: all .2s ease; 
    border: 1px solid;
  }
  .cs-bottom-btn.primary { 
    background: #2D6A4F; 
    color: #fff; 
    border-color: #2D6A4F; 
  }
  .cs-bottom-btn.primary:hover { 
    background: #1B4D3E; 
    border-color: #1B4D3E; 
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(45,106,79,.25);
  }
  .cs-bottom-btn.outline { 
    background: #FFFFFF; 
    color: #2D6A4F; 
    border-color: #E8F0E8; 
  }
  .cs-bottom-btn.outline:hover { 
    background: #F8FFF8; 
    border-color: #C8E6C9;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .cs-banner { 
      margin: 20px 20px 0;
      padding: 24px 24px; 
    }
    .cs-banner h1 { font-size: 1.4rem; }
    .cs-cards  { padding: 0 20px 16px; }
    .cs-card-right { 
      width: auto;
      padding: 16px 20px; 
      align-items: center;
    }
    .cs-card-body { padding: 16px 20px; }
    .cs-bottom { 
      margin: 8px 20px 24px;
      padding: 16px 20px;
    }
  }

  @media (max-width: 640px) {
    .cs-card {
      flex-direction: column;
    }
    .cs-icon-col {
      width: 100%;
      padding: 16px 0 0;
    }
    .cs-card-right {
      width: 100%;
      padding: 0 20px 20px;
      align-items: stretch;
    }
    .cs-card-btn {
      width: 100%;
      text-align: center;
    }
    .cs-bottom {
      flex-direction: column;
      text-align: center;
    }
    .cs-bottom-actions {
      width: 100%;
    }
    .cs-bottom-btn {
      flex: 1;
      text-align: center;
    }
  }
`;

function useCsStyles() {
  useEffect(() => {
    const existing = document.getElementById("cs-css");
    if (existing) existing.remove();
    const s = document.createElement("style");
    s.id = "cs-css";
    s.textContent = CS_CSS;
    document.head.appendChild(s);
  }, []);
}

/* ── CategoryCard with hover state ── */
function CategoryCard({ cat, onNavigate, delay }) {
  const [hovered, setHovered] = useState(false);
  const col = DRILL_COLORS[cat.key];

  return (
    <div
      className="cs-card"
      style={{
        borderLeftColor: col.accent,
        background: hovered ? col.hover : "#FFFFFF",
        animationDelay: `${delay}s`,
      }}
      onClick={onNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* icon */}
      <div className="cs-icon-col" style={{ background: hovered ? col.bg : "#F8FFF8" }}>
        <span style={{ fontSize: "1.8rem" }}>
          {cat.key === "earthquake" ? "🌍"
           : cat.key === "flood"    ? "🌊"
           : cat.key === "fire"     ? "🔥"
           : cat.key === "cyclone"  ? "🌪️"
           : "🏃"}
        </span>
      </div>

      {/* body */}
      <div className="cs-card-body">
        <div className="cs-card-title" style={{ color: hovered ? col.accent : "#1A3A2A" }}>
          {cat.title}
        </div>
        <div className="cs-card-subtitle">{cat.subtitle}</div>
        <div className="cs-card-desc">{cat.desc}</div>
        <div className="cs-tags">
          {cat.modules.map(m => (
            <span key={m} className="cs-tag" style={{ background: col.bg, color: col.accent, borderColor: col.border }}>
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* right */}
      <div className="cs-card-right">
        <button
          className="cs-card-btn"
          style={{ background: col.accent }}
          onClick={e => { e.stopPropagation(); onNavigate(); }}
        >
          Start Learning →
        </button>
      </div>
    </div>
  );
}

/* ── main component ── */
export default function CategorySelect({ user }) {
  useCsStyles();
  const navigate = useNavigate();
  const username = user?.username || user?.name || "Student";

  return (
    <div className="cs-root">

      {/* banner */}
      <div className="cs-banner">
        <div className="cs-banner-greeting">Hello </div>
        <h1>{username}!</h1>
        <p>Choose a category below to start learning. Each module has chapters, a quiz, and a live drill.</p>
        <div className="cs-chips">
          <span className="cs-chip">5 modules available</span>
          <span className="cs-chip">5 live drills</span>
          <span className="cs-chip">Earn completion badges</span>
        </div>
      </div>

      {/* section label */}
      <div className="cs-section-lbl">Learning Categories</div>

      {/* cards */}
      <div className="cs-cards">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard
            key={cat.key}
            cat={cat}
            onNavigate={() => navigate(cat.route)}
            delay={i * .07}
          />
        ))}
      </div>

      {/* bottom bar */}
      <div className="cs-bottom">
        <div className="cs-bottom-text">
          Track your progress on the <strong>Dashboard</strong>, or jump straight into a <strong>Drill</strong>.
        </div>
        <div className="cs-bottom-actions">
          <button className="cs-bottom-btn outline" onClick={() => navigate("/student/dashboard")}>
            My Dashboard
          </button>
          <button className="cs-bottom-btn primary" onClick={() => navigate("/student/drills")}>
            Quick Drill
          </button>
        </div>
      </div>

    </div>
  );
}
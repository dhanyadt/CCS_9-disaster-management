import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DRILL_COLORS = {
  earthquake: "#D97706",
  flood:      "#0284C7",
  fire:       "#EA580C",
  cyclone:    "#3B82F6",
  stampede:   "#CA8A04",
};

/* ── updated CSS with consistent styling ── */
const RESULT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  @keyframes resFadeUp { 
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

  .res-root { 
    font-family: 'DM Sans', sans-serif; 
    color: #0F172A; 
    width: 100%; 
    max-width: 680px; 
    margin: 0 auto; 
    padding: 32px 24px 56px;
    position: relative;
    z-index: 1;
  }

  .res-card {
    background: #FFFFFF; 
    border-radius: 16px;
    border: 1px solid #E8F0E8; 
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    padding: 40px 32px; 
    text-align: center;
    animation: resFadeUp .4s ease both;
  }

  .res-title { 
    font-size: 1.5rem; 
    font-weight: 700; 
    color: #1A3A2A; 
    margin-bottom: 8px; 
    letter-spacing: -0.01em;
  }
  .res-sub   { 
    font-size: .82rem; 
    color: #5A7A6A; 
    margin-bottom: 0; 
  }

  .res-score-ring {
    margin: 28px auto;
    width: 140px; 
    height: 140px; 
    border-radius: 50%;
    display: flex; 
    align-items: center; 
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,.08);
  }
  .res-score-inner {
    width: 104px; 
    height: 104px; 
    border-radius: 50%; 
    background: #FFFFFF;
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,.04);
  }
  .res-score-val { 
    font-size: 1.9rem; 
    font-weight: 800; 
    line-height: 1; 
  }
  .res-score-sub { 
    font-size: .72rem; 
    color: #5A7A6A; 
    margin-top: 4px; 
  }

  .res-badge {
    display: inline-flex; 
    align-items: center; 
    gap: 8px;
    padding: 8px 24px; 
    border-radius: 99px;
    font-size: .88rem; 
    font-weight: 700; 
    margin-bottom: 16px;
  }
  .res-msg { 
    font-size: .85rem; 
    color: #5A7A6A; 
    margin-bottom: 28px; 
    line-height: 1.6; 
  }

  /* answer review */
  .res-review { 
    text-align: left; 
    margin-bottom: 28px; 
  }
  .res-review-title { 
    font-size: .78rem; 
    font-weight: 700; 
    color: #1A3A2A; 
    margin-bottom: 12px; 
    text-transform: uppercase;
    letter-spacing: .06em;
  }
  .res-answer-row {
    display: flex; 
    align-items: flex-start; 
    gap: 12px;
    padding: 12px 14px; 
    border-radius: 10px; 
    margin-bottom: 8px; 
    font-size: .82rem;
  }
  .res-answer-row.ok   { background: #D1FAE5; }
  .res-answer-row.fail { background: #FEE2E2; }
  .res-answer-icon { 
    font-size: 1rem; 
    flex-shrink: 0; 
    margin-top: 2px;
  }
  .res-answer-q    { 
    font-weight: 600; 
    color: #1A3A2A; 
    margin-bottom: 4px; 
  }
  .res-answer-cor  { 
    font-size: .78rem; 
    color: #5A7A6A; 
  }

  /* cert strip with updated gradient */
  .res-cert {
    background: linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%);
    border-radius: 12px; 
    padding: 20px 24px; 
    color: #fff;
    text-align: center; 
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(45,106,79,.15);
  }
  .res-cert-title { 
    font-size: .95rem; 
    font-weight: 700; 
    margin-bottom: 4px; 
  }
  .res-cert-sub   { 
    font-size: .78rem; 
    opacity: .9; 
  }

  /* actions with updated button styling */
  .res-actions { 
    display: flex; 
    gap: 12px; 
    flex-wrap: wrap; 
    margin-bottom: 12px; 
  }
  .res-btn {
    flex: 1; 
    min-width: 130px; 
    padding: 12px 16px; 
    border-radius: 10px; 
    border: none;
    font-family: 'DM Sans', sans-serif; 
    font-size: .85rem; 
    font-weight: 600;
    cursor: pointer; 
    transition: all .2s ease;
  }
  .res-btn.primary { 
    color: #fff; 
  }
  .res-btn.primary:hover { 
    opacity: .9; 
    transform: translateY(-2px); 
    filter: brightness(1.05);
  }
  .res-btn.secondary { 
    background: #F8FFF8; 
    color: #2D6A4F; 
    border: 1px solid #E8F0E8; 
  }
  .res-btn.secondary:hover { 
    background: #2D6A4F; 
    color: #fff; 
    border-color: #2D6A4F;
    transform: translateY(-2px);
  }
  .res-btn-full {
    width: 100%; 
    padding: 12px; 
    border-radius: 10px;
    border: 1px solid #E8F0E8; 
    background: #FFFFFF; 
    color: #5A7A6A;
    font-family: 'DM Sans', sans-serif; 
    font-size: .82rem; 
    font-weight: 600;
    cursor: pointer; 
    transition: all .2s ease;
  }
  .res-btn-full:hover { 
    background: #F8FFF8; 
    border-color: #C8E6C9;
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    .res-root { padding: 24px 16px 40px; }
    .res-card { padding: 28px 20px; }
    .res-title { font-size: 1.3rem; }
    .res-score-ring { width: 120px; height: 120px; }
    .res-score-inner { width: 88px; height: 88px; }
    .res-actions { flex-direction: column; }
    .res-btn { width: 100%; }
  }
`;

function useResultStyles() {
  useEffect(() => {
    const existing = document.getElementById("result-css");
    if (existing) existing.remove();
    const s = document.createElement("style");
    s.id = "result-css";
    s.textContent = RESULT_CSS;
    document.head.appendChild(s);
  }, []);
}

function Result() {
  useResultStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const state      = location.state || {};
  const moduleName = state.module  || "Disaster Preparedness";
  const score      = state.score   ?? 0;
  const total      = state.total   ?? 5;
  const answers    = state.answers || [];

  const percent  = Math.round((score / total) * 100);
  const moduleKey = moduleName.toLowerCase();
  const accentColor = DRILL_COLORS[moduleKey] || "#2D6A4F";

  const badge =
    percent >= 90 ? { label: "Expert Responder",   msg: "Outstanding! You are fully prepared."              }
    : percent >= 75 ? { label: "Proficient",         msg: "Great work! Minor areas to review."               }
    : percent >= 50 ? { label: "Learner",             msg: "Good effort! Review the module and try again."   }
    :                 { label: "Needs More Practice", msg: "Keep studying and try again soon."               };

  // save score + progress
 const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
const username  = savedUser?.username || "guest";

const savedScores = JSON.parse(localStorage.getItem(`drillScores_${username}`) || "{}");
if (!savedScores[moduleKey]) {
  savedScores[moduleKey] = percent;
  localStorage.setItem(`drillScores_${username}`, JSON.stringify(savedScores));
}
if (percent >= 75) {
  const savedProgress = JSON.parse(localStorage.getItem(`moduleProgress_${username}`) || "{}");
  if (!savedProgress[moduleKey]) {
    savedProgress[moduleKey] = { completed: true };
    localStorage.setItem(`moduleProgress_${username}`, JSON.stringify(savedProgress));
  }
}

  return (
    <div className="res-root">
      <div className="res-card">
        <div className="res-title">{moduleName} Results</div>
        <div className="res-sub">Here's how you performed</div>

        <div className="res-score-ring" style={{ background: `conic-gradient(${accentColor} ${percent * 3.6}deg, #F0F8F0 0deg)` }}>
          <div className="res-score-inner">
            <div className="res-score-val" style={{ color: accentColor }}>{percent}%</div>
            <div className="res-score-sub">{score} / {total}</div>
          </div>
        </div>

        <div className="res-badge" style={{ background: accentColor + "1a", color: accentColor }}>
          {badge.label}
        </div>
        <div className="res-msg">{badge.msg}</div>

        {answers.length > 0 && (
          <div className="res-review">
            <div className="res-review-title">Question Review</div>
            {answers.map((a, i) => (
              <div key={i} className={`res-answer-row ${a.correct ? "ok" : "fail"}`}>
                <span className="res-answer-icon">{a.correct ? "✓" : "✗"}</span>
                <div>
                  <div className="res-answer-q">Q{i + 1}: {a.question}</div>
                  {!a.correct && a.correctAnswer && (
                    <div className="res-answer-cor">Correct: {a.correctAnswer}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {percent >= 75 && (
          <div className="res-cert">
            <div className="res-cert-title">Certificate Earned!</div>
            <div className="res-cert-sub">You passed {moduleName} with {percent}%</div>
          </div>
        )}

        <div className="res-actions">
          <button className="res-btn primary" style={{ background: accentColor }}
            onClick={() => navigate(`/student/drill/${moduleKey}`)}>
            Try Drill
          </button>
          <button className="res-btn secondary" onClick={() => navigate("/student/dashboard")}>
            Dashboard
          </button>
        </div>
        <button className="res-btn-full" onClick={() => navigate("/student")}>
          ← Back to Modules
        </button>
      </div>
    </div>
  );
}

export default Result;
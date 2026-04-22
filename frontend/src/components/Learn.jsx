import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MODULE_CONTENT } from "./ModuleContent";

/* ── color tokens updated to match Dashboard palette ── */
const DRILL_COLORS = {
  earthquake: { bg: "#FEF3C7", border: "#FCD34D", accent: "#D97706", text: "#92400E", hover: "#FFFBEB" },
  flood:      { bg: "#E0F2FE", border: "#7DD3FC", accent: "#0284C7", text: "#075985", hover: "#F0F9FF" },
  fire:       { bg: "#FFEDD5", border: "#FDBA74", accent: "#EA580C", text: "#9A3412", hover: "#FFF7ED" },
  cyclone:    { bg: "#EFF6FF", border: "#BFDBFE", accent: "#3B82F6", text: "#1E3A8A", hover: "#EFF6FF" },
  stampede:   { bg: "#FEF9C3", border: "#FDE047", accent: "#CA8A04", text: "#854D0E", hover: "#FEFCE8" },
};

const MODULE_META = {
  earthquake: { label: "Earthquake", icon: null },
  flood:      { label: "Flood",      icon: null },
  fire:       { label: "Fire",       icon: null },
  cyclone:    { label: "Cyclone",    icon: null },
  stampede:   { label: "Stampede",   icon: null },
};

function dc(key) {
  return DRILL_COLORS[key] || { 
    bg: "#F1F5F9", border: "#E2E8F0", accent: "#2D6A4F", 
    text: "#0F172A", hover: "#F8FAFC" 
  };
}

/* ── updated CSS with consistent styling ── */
const LEARN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes learnFadeUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes learnFadeDown { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }

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

  .learn-root { 
    font-family: 'DM Sans', sans-serif; 
    color: #0F172A; 
    width: 100%; 
    max-width: 900px;
    margin: 0 auto;
    padding: 28px 28px 56px;
    position: relative;
    z-index: 1;
  }

  /* ── banner ── */
  .learn-banner {
    border-radius: 16px; 
    padding: 28px 32px; 
    color: #fff;
    margin-bottom: 24px; 
    position: relative; 
    overflow: hidden;
    animation: learnFadeUp .4s ease both;
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    gap: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,.08);
  }
  .learn-banner::after {
    content: ''; 
    position: absolute; 
    inset: 0;
    background: radial-gradient(ellipse at 85% 50%, rgba(255,255,255,.08) 0%, transparent 60%);
    pointer-events: none;
  }
  .learn-banner-left { flex: 1; z-index: 1; }
  .learn-banner h1   { 
    font-size: 1.6rem; 
    font-weight: 700; 
    letter-spacing: -.02em; 
    color: #fff; 
    margin-bottom: 6px; 
  }
  .learn-banner p    { 
    font-size: .85rem; 
    opacity: .9; 
    margin: 0; 
  }

  .learn-back-btn {
    z-index: 1; 
    flex-shrink: 0;
    padding: 8px 20px; 
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,.3);
    background: rgba(255,255,255,.15); 
    color: #fff;
    font-family: 'DM Sans', sans-serif; 
    font-size: .8rem; 
    font-weight: 600;
    cursor: pointer; 
    transition: all .2s ease; 
    white-space: nowrap;
  }
  .learn-back-btn:hover { 
    background: rgba(255,255,255,.26); 
    border-color: rgba(255,255,255,.5); 
    transform: translateY(-1px);
  }

  /* ── progress strip ── */
  .learn-progress-card {
    background: #FFFFFF; 
    border-radius: 16px;
    border: 1px solid #E8F0E8; 
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    padding: 16px 20px; 
    margin-bottom: 20px;
    animation: learnFadeUp .4s ease both;
  }
  .learn-progress-row   { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 10px; 
  }
  .learn-progress-label { 
    font-size: .78rem; 
    font-weight: 600; 
    color: #5A7A6A; 
  }
  .learn-progress-pct   { 
    font-size: .78rem; 
    font-weight: 800; 
  }
  .learn-progress-track { 
    height: 6px; 
    background: #F0F8F0; 
    border-radius: 99px; 
    overflow: hidden; 
  }
  .learn-progress-fill  { 
    height: 100%; 
    border-radius: 99px; 
    transition: width .5s cubic-bezier(.25,.8,.25,1); 
  }

  /* ── chapter list ── */
  .learn-chapters { 
    display: flex; 
    flex-direction: column; 
    gap: 12px; 
    margin-bottom: 20px; 
  }

  .learn-chapter {
    background: #FFFFFF; 
    border-radius: 16px;
    border: 1px solid #E8F0E8; 
    border-left-width: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    overflow: hidden;
    animation: learnFadeUp .4s ease both;
    transition: all .2s ease;
  }
  .learn-chapter:hover { 
    box-shadow: 0 8px 20px rgba(45,106,79,.12); 
    transform: translateX(2px);
  }

  .learn-chapter-hd {
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    padding: 16px 20px; 
    cursor: pointer; 
    user-select: none;
    transition: all .2s ease; 
    gap: 12px;
  }
  .learn-chapter-hd:hover { 
    background: #F8FFF8; 
  }
  .learn-chapter-hd.open  { 
    background: #F8FFF8; 
  }

  .learn-chapter-num {
    width: 28px; 
    height: 28px; 
    border-radius: 99px;
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: .75rem; 
    font-weight: 800; 
    flex-shrink: 0;
  }
  .learn-chapter-title { 
    font-size: .92rem; 
    font-weight: 700; 
    flex: 1; 
    color: #1A3A2A; 
  }
  .learn-chapter-read  { 
    font-size: .7rem; 
    font-weight: 700; 
  }

  .learn-chapter-chevron {
    width: 24px; 
    height: 24px; 
    border-radius: 6px;
    background: #F0F8F0; 
    color: #2D6A4F;
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: .6rem; 
    font-weight: 700; 
    flex-shrink: 0;
    transition: all .25s ease;
  }
  .learn-chapter-chevron.open { 
    transform: rotate(180deg); 
    background: #E8F0E8; 
  }

  /* ── chapter content ── */
  .learn-chapter-body {
    padding: 0 20px 20px;
    animation: learnFadeDown .25s ease both;
  }

  /* ── image slider ── */
  .learn-slider {
    position: relative; 
    border-radius: 12px; 
    overflow: hidden;
    margin-bottom: 20px; 
    background: #F8FFF8;
    height: 420px; 
    width: 100%;
  }
  @media (max-width: 640px) { .learn-slider { height: 240px; } }

  .learn-slider-img {
    position: absolute; 
    top: 0; 
    left: 0;
    width: 100%; 
    height: 100%;
    object-fit: contain; 
    object-position: center; 
    background: #F8FFF8;
    display: block;
    transition: opacity .45s ease, transform .45s ease;
    opacity: 0; 
    transform: scale(1.02);
  }
  .learn-slider-img.active {
    opacity: 1; 
    transform: scale(1);
  }
  .learn-slider-btn {
    position: absolute; 
    top: 50%; 
    transform: translateY(-50%);
    width: 40px; 
    height: 40px; 
    border-radius: 50%;
    background: rgba(255,255,255,.95); 
    border: 1px solid #E8F0E8;
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: 1.2rem; 
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
    transition: all .2s ease;
    z-index: 2;
    color: #2D6A4F;
  }
  .learn-slider-btn:hover { 
    background: #FFFFFF; 
    transform: translateY(-50%) scale(1.08); 
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
  }
  .learn-slider-prev { left: 12px; }
  .learn-slider-next { right: 12px; }
  .learn-slider-dots {
    position: absolute; 
    bottom: 12px; 
    left: 50%; 
    transform: translateX(-50%);
    display: flex; 
    gap: 8px; 
    z-index: 2;
  }
  .learn-slider-dot {
    width: 8px; 
    height: 8px; 
    border-radius: 50%;
    background: rgba(255,255,255,.6); 
    border: none; 
    cursor: pointer;
    transition: all .2s ease; 
    padding: 0;
  }
  .learn-slider-dot.active { 
    transform: scale(1.2); 
  }

  .learn-chapter-text { 
    font-size: .88rem; 
    color: #5A7A6A; 
    line-height: 1.75; 
    margin-bottom: 12px; 
  }

  .learn-yt-btn {
    display: inline-flex; 
    align-items: center; 
    gap: 8px;
    padding: 10px 20px; 
    border-radius: 10px; 
    border: none;
    font-family: 'DM Sans', sans-serif; 
    font-size: .82rem; 
    font-weight: 600;
    cursor: pointer; 
    color: #fff; 
    background: #DC2626;
    margin-top: 8px;
  }
  .learn-yt-btn:hover { 
    opacity: .9; 
    transform: translateY(-2px); 
    box-shadow: 0 4px 12px rgba(220,38,38,.25);
  }

  /* ── start drill card ── */
  .learn-drill-card {
    border-radius: 16px; 
    padding: 24px 28px;
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    gap: 20px;
    animation: learnFadeUp .4s ease both; 
    flex-wrap: wrap;
    box-shadow: 0 4px 12px rgba(0,0,0,.08);
  }
  .learn-drill-title { 
    font-size: 1rem; 
    font-weight: 700; 
    color: #fff; 
    margin-bottom: 4px; 
  }
  .learn-drill-sub   { 
    font-size: .8rem; 
    opacity: .92; 
    color: #fff; 
  }
  .learn-drill-btn {
    padding: 10px 28px; 
    border-radius: 10px; 
    border: none; 
    flex-shrink: 0;
    font-family: 'DM Sans', sans-serif; 
    font-size: .86rem; 
    font-weight: 600;
    cursor: pointer; 
    background: #fff; 
    transition: all .2s ease; 
    white-space: nowrap;
  }
  .learn-drill-btn:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 4px 14px rgba(0,0,0,.15); 
  }

  @media (max-width: 640px) {
    .learn-root { padding: 20px 16px 40px; }
    .learn-banner { flex-direction: column; align-items: flex-start; padding: 24px 24px; }
    .learn-banner h1 { font-size: 1.3rem; }
    .learn-chapter-hd { padding: 14px 16px; }
    .learn-chapter-body { padding: 0 16px 16px; }
    .learn-drill-card { flex-direction: column; text-align: center; padding: 20px 24px; }
    .learn-drill-btn { width: 100%; }
  }
`;

function useLearnStyles() {
  useEffect(() => {
    const existing = document.getElementById("learn-css");
    if (existing) existing.remove();
    const s = document.createElement("style");
    s.id = "learn-css";
    s.textContent = LEARN_CSS;
    document.head.appendChild(s);
  }, []);
}

/* ── ImageSlider ── */
function ImageSlider({ images, accentColor }) {
  const [idx, setIdx] = useState(0);
  const imgs = Array.isArray(images) ? images.filter(Boolean) : [images].filter(Boolean);
  if (!imgs.length) return null;

  const prev = () => setIdx(i => (i - 1 + imgs.length) % imgs.length);
  const next = () => setIdx(i => (i + 1) % imgs.length);

  return (
    <div className="learn-slider">
      {imgs.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className={`learn-slider-img ${i === idx ? "active" : ""}`}
          onError={e => { e.target.style.display = "none"; }}
        />
      ))}

      {imgs.length > 1 && (
        <>
          <button className="learn-slider-btn learn-slider-prev" onClick={prev}>‹</button>
          <button className="learn-slider-btn learn-slider-next" onClick={next}>›</button>
          <div className="learn-slider-dots">
            {imgs.map((_, i) => (
              <button
                key={i}
                className={`learn-slider-dot ${i === idx ? "active" : ""}`}
                style={{ background: i === idx ? accentColor : "rgba(0,0,0,.3)" }}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── ChapterRow ── */
function ChapterRow({ chapter, index, isOpen, isRead, accentColor, bgColor, borderColor, onToggle, onRead, delay }) {
  return (
    <div
      className="learn-chapter"
      style={{ borderLeftColor: accentColor, animationDelay: `${delay}s` }}
    >
      {/* header */}
      <div
        className={`learn-chapter-hd ${isOpen ? "open" : ""}`}
        onClick={() => { onToggle(); if (!isRead) onRead(); }}
      >
        <div className="learn-chapter-num" style={{ background: bgColor, color: accentColor }}>
          {index + 1}
        </div>
        <span className="learn-chapter-title">{chapter.title}</span>
        {isRead && (
          <span className="learn-chapter-read" style={{ color: accentColor }}>✓ Read</span>
        )}
        <div className={`learn-chapter-chevron ${isOpen ? "open" : ""}`}>▼</div>
      </div>

      {/* body */}
      {isOpen && (
        <div className="learn-chapter-body">
          <ImageSlider
            images={chapter.images || chapter.image}
            accentColor={accentColor}
          />

          {chapter.body.map((para, i) => (
            <p key={i} className="learn-chapter-text">{para}</p>
          ))}

          {chapter.video && (
            <button
              className="learn-yt-btn"
              onClick={() => window.open(chapter.video, "_blank", "noopener,noreferrer")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8z"/>
                <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
              </svg>
              Watch on YouTube
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Learn ── */
function Learn({ user }) {
  useLearnStyles();

  const { category } = useParams();
  const navigate     = useNavigate();

  const chapters = MODULE_CONTENT[category];
  const meta     = MODULE_META[category];
  const col      = dc(category);

const username   = user?.username || "guest";
const storageKey = `readChapters_${username}_${category}`;  const [readSet, setReadSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(storageKey) || "[]")); }
    catch { return new Set(); }
  });
  const [openIdx, setOpenIdx] = useState(0);

  const markRead = (idx) => {
    setReadSet(prev => {
      const next = new Set(prev);
      next.add(idx);
      localStorage.setItem(storageKey, JSON.stringify([...next]));
      return next;
    });
  };

  const toggleChapter = (idx) => {
    setOpenIdx(prev => prev === idx ? null : idx);
  };

  if (!chapters || !meta) {
    return (
      <div className="learn-root">
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 40, textAlign: "center", border: "1px solid #E8F0E8" }}>
          <h2 style={{ color: "#1A3A2A", marginBottom: 12 }}>Module not found</h2>
          <button 
            onClick={() => navigate("/student")} 
            style={{ 
              padding: "10px 24px", 
              borderRadius: 10, 
              border: "1px solid #E8F0E8",
              background: "#F8FFF8", 
              color: "#2D6A4F",
              fontFamily: "DM Sans, sans-serif",
              fontSize: ".85rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#2D6A4F";
              e.target.style.color = "#fff";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#F8FFF8";
              e.target.style.color = "#2D6A4F";
              e.target.style.transform = "translateY(0)";
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const readCount = chapters.filter((_, i) => readSet.has(i)).length;
  const pct       = Math.round((readCount / chapters.length) * 100);
  const allRead   = readCount === chapters.length;

  return (
    <div className="learn-root">

      {/* banner */}
      <div className="learn-banner" style={{ background: `linear-gradient(135deg, ${col.accent} 0%, ${col.accent}dd 100%)`, boxShadow: `0 4px 12px ${col.accent}33` }}>
        <div className="learn-banner-left">
          <h1>{meta.label}</h1>
          <p>Work through each chapter at your own pace, then take on the drill</p>
        </div>
        <button className="learn-back-btn" onClick={() => navigate("/student")}>
          ← Back
        </button>
      </div>

      {/* progress */}
      <div className="learn-progress-card">
        <div className="learn-progress-row">
          <span className="learn-progress-label">
            {readCount}/{chapters.length} chapters read {allRead ? "✓" : ""}
          </span>
          <span className="learn-progress-pct" style={{ color: col.accent }}>{pct}%</span>
        </div>
        <div className="learn-progress-track">
          <div className="learn-progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${col.accent}, ${col.accent}bb)` }} />
        </div>
      </div>

      {/* chapters */}
      <div className="learn-chapters">
        {chapters.map((chapter, i) => (
          <ChapterRow
            key={i}
            chapter={chapter}
            index={i}
            isOpen={openIdx === i}
            isRead={readSet.has(i)}
            accentColor={col.accent}
            bgColor={col.bg}
            borderColor={col.border}
            onToggle={() => toggleChapter(i)}
            onRead={() => markRead(i)}
            delay={i * .05}
          />
        ))}
      </div>

      {/* start drill CTA */}
      <div className="learn-drill-card" style={{ background: `linear-gradient(135deg, ${col.accent} 0%, ${col.accent}dd 100%)`, boxShadow: `0 4px 12px ${col.accent}33` }}>
        <div>
          <div className="learn-drill-title">
            {allRead ? "Ready for the drill?" : "Start the drill anytime"}
          </div>
          <div className="learn-drill-sub">
            {allRead
              ? "You've read all chapters — put your knowledge to the test"
              : `${chapters.length - readCount} chapter${chapters.length - readCount !== 1 ? "s" : ""} remaining — you can still attempt the drill`}
          </div>
        </div>
        <button
          className="learn-drill-btn"
          style={{ color: col.accent }}
          onClick={() => navigate(`/student/drill/${category}`)}
        >
          Start {meta.label} Drill →
        </button>
      </div>

    </div>
  );
}

export default Learn;
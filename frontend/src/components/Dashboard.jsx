import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getMyScores } from "../services/api";

// ============================================
// PROFESSIONAL SVG ICONS - NO EMOJIS
// ============================================

const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const IconModules = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <path d="M8 7h8"/>
    <path d="M8 11h6"/>
  </svg>
);

const IconDrills = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

const IconBadges = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2z"/>
  </svg>
);

const IconHistory = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconProfile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const IconMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const IconAward = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M8.5 13.5L6 22l6-3 6 3-2.5-8.5"/>
  </svg>
);

const IconTarget = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const IconBookOpen = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const IconCheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

// Badge icons with explicit colors for dark mode
const BadgeIconFirstDrill = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

const BadgeIconDrillMaster = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="1.5">
    <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2z"/>
  </svg>
);

const BadgeIconPerfect = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const BadgeIconHighScorer = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const BadgeIconFirstModule = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="1.5">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const BadgeIconFullPrepared = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5">
    <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2z"/>
  </svg>
);

const BadgeIconGettingReady = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const BadgeIconWellPrepared = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

const BadgeIconAvidReader = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="1.5">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    <path d="M8 7h8"/>
    <path d="M8 11h6"/>
  </svg>
);

const BadgeIconScholar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="1.5">
    <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2z"/>
    <path d="M12 7v6"/>
    <path d="M9 10h6"/>
  </svg>
);

// ============================================
// DARK MODE CONTEXT
// ============================================
const ThemeContext = createContext({ darkMode: false, toggleDarkMode: () => {} });

// ============================================
// CONSTANTS
// ============================================
const DRILL_COLORS = {
  earthquake: { bg: "#FEF3C7", border: "#FCD34D", accent: "#D97706", text: "#92400E" },
  flood:      { bg: "#E0F2FE", border: "#7DD3FC", accent: "#0284C7", text: "#075985" },
  fire:       { bg: "#FFEDD5", border: "#FDBA74", accent: "#EA580C", text: "#9A3412" },
  cyclone:    { bg: "#EFF6FF", border: "#BFDBFE", accent: "#3B82F6", text: "#1E3A8A" },
  stampede:   { bg: "#FEF9C3", border: "#FDE047", accent: "#CA8A04", text: "#854D0E" },
};

const CATEGORY_DATA = [
  { key: "earthquake", title: "Earthquake", desc: "Drop, cover, and hold on. Learn to survive and respond to seismic events.", modules: ["Earthquake"], route: "/student/category/earthquake" },
  { key: "flood",      title: "Flood",      desc: "Understand flood warnings, evacuation routes, and safe shelter protocols.", modules: ["Flood"],      route: "/student/category/flood" },
  { key: "fire",       title: "Fire",       desc: "Fire safety, evacuation procedures, and first-response actions.", modules: ["Fire"],       route: "/student/category/fire" },
  { key: "cyclone",    title: "Cyclone",    desc: "Prepare for high winds, storm surges, and cyclone emergency protocols.", modules: ["Cyclone"],    route: "/student/category/cyclone" },
  { key: "stampede",   title: "Stampede",   desc: "Crowd safety, panic response, and how to stay safe in dense gatherings.", modules: ["Stampede"],   route: "/student/category/stampede" },
];

const ALL_DRILLS = [
  { key: "earthquake", title: "Earthquake" },
  { key: "flood",      title: "Flood" },
  { key: "fire",       title: "Fire" },
  { key: "cyclone",    title: "Cyclone" },
  { key: "stampede",   title: "Stampede" },
];

const BADGE_DEFS = [
  { id: "first_drill",   label: "First Drill",   desc: "Completed your first drill",           icon: BadgeIconFirstDrill, bg: "#FEF3C7", border: "#FCD34D", color: "#D97706", check: (s) => Object.keys(s.drillScores).length >= 1 },
  { id: "all_drills",    label: "Drill Master",  desc: "Attempted all 5 drills",               icon: BadgeIconDrillMaster, bg: "#FEF9C3", border: "#FDE047", color: "#CA8A04", check: (s) => Object.keys(s.drillScores).length >= 5 },
  { id: "perfect_drill", label: "Perfect Score", desc: "Scored 100% on any drill",             icon: BadgeIconPerfect, bg: "#D1FAE5", border: "#86EFAC", color: "#10B981", check: (s) => Object.values(s.drillScores).some(v => v === 100) },
  { id: "high_scorer",   label: "High Scorer",   desc: "Scored 90%+ on any drill",             icon: BadgeIconHighScorer, bg: "#EDE9FE", border: "#C4B5FD", color: "#8B5CF6", check: (s) => Object.values(s.drillScores).some(v => v >= 90) },
  { id: "first_module",  label: "First Module",  desc: "Completed your first module",          icon: BadgeIconFirstModule, bg: "#E0F2FE", border: "#7DD3FC", color: "#0284C7", check: (s) => s.completedModules >= 1 },
  { id: "all_modules",   label: "Full Prepared", desc: "Completed all 5 modules",              icon: BadgeIconFullPrepared, bg: "#D1FAE5", border: "#86EFAC", color: "#10B981", check: (s) => s.completedModules >= 5 },
  { id: "index_50",      label: "Getting Ready", desc: "Reached a preparedness index of 50+", icon: BadgeIconGettingReady, bg: "#FFEDD5", border: "#FDBA74", color: "#EA580C", check: (s) => s.preparednessIndex >= 50 },
  { id: "index_75",      label: "Well Prepared", desc: "Reached a preparedness index of 75+", icon: BadgeIconWellPrepared, bg: "#D1FAE5", border: "#86EFAC", color: "#10B981", check: (s) => s.preparednessIndex >= 75 },
  { id: "reader",        label: "Avid Reader",   desc: "Read 10+ chapters across all modules", icon: BadgeIconAvidReader, bg: "#E0F2FE", border: "#7DD3FC", color: "#0284C7", check: (s) => s.totalChaptersRead >= 10 },
  { id: "all_chapters",  label: "Scholar",       desc: "Read all chapters in every module",    icon: BadgeIconScholar, bg: "#FEF9C3", border: "#FDE047", color: "#CA8A04", check: (s) => s.totalChaptersRead >= 20 },
];

const WEEKLY_GOAL = 2;

function getWeekKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.floor(((now - start) / 86400000 + start.getDay() + 1) / 7);
  return `week_${now.getFullYear()}_w${week}`;
}

function getStorageKey(username, key) {
  return `disaster_prep_${username}_${key}`;
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getColor(key) {
  return DRILL_COLORS[key?.toLowerCase()] || { bg: "#F1F5F9", border: "#E2E8F0", accent: "#2D6A4F", text: "#0F172A" };
}

// ============================================
// COMPONENTS
// ============================================

function Sidebar({ activePage, setActivePage, user, onLogout }) {
  const { darkMode } = useContext(ThemeContext);
  const navItems = [
    { id: "dashboard", icon: <IconDashboard />, label: "Dashboard" },
    { id: "modules",   icon: <IconModules />,   label: "My Modules" },
    { id: "drills",    icon: <IconDrills />,    label: "Drills" },
    { id: "badges",    icon: <IconBadges />,    label: "Badges" },
    { id: "history",   icon: <IconHistory />,   label: "Score History" },
    { id: "profile",   icon: <IconProfile />,   label: "My Profile" },
  ];

  return (
    <div style={{
      width: "260px",
      flexShrink: 0,
      background: darkMode ? "#1E2A2A" : "#FFFFFF",
      borderRight: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
    }}>
      <div style={{ padding: "28px 20px", borderBottom: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}` }}>
        <div style={{ fontSize: "20px", fontWeight: 800, color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>
          Disaster<span style={{ color: "#2D6A4F" }}>Prep</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "20px 16px" }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              marginBottom: "4px",
              borderRadius: "10px",
              border: "none",
              background: activePage === item.id ? (darkMode ? "#2D6A4F" : "#2D6A4F") : "transparent",
              color: activePage === item.id ? "#FFFFFF" : (darkMode ? "#94A3B8" : "#5A7A6A"),
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "14px",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (activePage !== item.id) {
                e.currentTarget.style.background = darkMode ? "#2D3A3A" : "#F0F8F0";
                e.currentTarget.style.color = darkMode ? "#C8E6C9" : "#2D6A4F";
              }
            }}
            onMouseOut={(e) => {
              if (activePage !== item.id) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = darkMode ? "#94A3B8" : "#5A7A6A";
              }
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "20px", borderTop: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}` }}>
        <div style={{ fontSize: "12px", color: darkMode ? "#6A7A6A" : "#94A3B8", marginBottom: "12px" }}>
          Logged in as<br />
          <strong style={{ color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>{user?.username || "Student"}</strong>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px",
            borderRadius: "10px",
            border: `1px solid ${darkMode ? "#4A3A3A" : "#FECACA"}`,
            background: darkMode ? "#3A2A2A" : "#FEF2F2",
            color: "#EF4444",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "13px",
            fontWeight: 600,
            transition: "all 0.2s ease",
          }}
        >
          <IconLogout />
          Sign Out
        </button>
      </div>
    </div>
  );
}

function Header({ darkMode, toggleDarkMode, user }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 24px",
      marginBottom: "28px",
      background: darkMode ? "#1E2A2A" : "#FFFFFF",
      borderRadius: "14px",
      border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
      boxShadow: darkMode ? "none" : "0 2px 8px rgba(45,106,79,0.07)",
    }}>
      

      {/* Right: dark mode toggle + user chip */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        
         

        {/* User chip */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "6px 14px 6px 6px",
          background: darkMode ? "#2D3A3A" : "#F0F8F0",
          border: `1px solid ${darkMode ? "#3D4A4A" : "#D1EDD4"}`,
          borderRadius: "40px",
        }}>
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%",
            background: "linear-gradient(135deg, #2D6A4F, #1B4D3E)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 800, color: "#FFFFFF",
          }}>
            {user?.username?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <span style={{ fontSize: "12px", fontWeight: 600, color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>
            {user?.username || "Student"}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color, delay }) {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div style={{
      background: darkMode ? "#1E2A2A" : "#FFFFFF",
      borderRadius: "12px",
      padding: "20px",
      border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
      textAlign: "center",
      animation: `fadeUp 0.4s ease both ${delay}s`,
    }}>
      <div style={{ fontSize: "32px", fontWeight: 800, color: color, marginBottom: "8px" }}>{value}</div>
      <div style={{ fontSize: "12px", fontWeight: 600, color: darkMode ? "#94A3B8" : "#5A7A6A", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
    </div>
  );
}

function NextActionCard({ action, onClick }) {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div style={{
      background: darkMode ? "#1E2A2A" : "#FFFFFF",
      borderRadius: "12px",
      padding: "20px 24px",
      borderLeft: `4px solid ${action.btnColor}`,
      border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "16px",
      marginBottom: "24px",
    }}>
      <div>
        <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: darkMode ? "#6A7A6A" : "#94A3B8", marginBottom: "4px" }}>{action.label}</div>
        <div style={{ fontSize: "16px", fontWeight: 700, color: darkMode ? "#C8E6C9" : "#1A3A2A", marginBottom: "4px" }}>{action.title}</div>
        <div style={{ fontSize: "13px", color: darkMode ? "#94A3B8" : "#5A7A6A" }}>{action.sub}</div>
      </div>
      <button
        onClick={onClick}
        style={{
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          background: action.btnColor,
          color: "#FFFFFF",
          fontWeight: 600,
          fontSize: "13px",
          cursor: "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
        onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
      >
        {action.btnLabel} <IconArrowRight />
      </button>
    </div>
  );
}

function WeeklyGoalCard({ done, total }) {
  const { darkMode } = useContext(ThemeContext);
  const pct = (done / total) * 100;
  const goalMet = done >= total;
  return (
    <div style={{
      background: darkMode ? "#1E2A2A" : "#FFFFFF",
      borderRadius: "12px",
      padding: "20px",
      border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>Weekly Goal</div>
          <div style={{ fontSize: "11px", color: darkMode ? "#6A7A6A" : "#5A7A6A", marginTop: "2px" }}>Complete {total} drills this week</div>
        </div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: goalMet ? "#10B981" : "#F59E0B" }}>{done}/{total}</div>
      </div>
      <div style={{ height: "6px", background: darkMode ? "#2D3A3A" : "#F0F8F0", borderRadius: "99px", overflow: "hidden", marginBottom: "12px" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: goalMet ? "#10B981" : "#2D6A4F", borderRadius: "99px", transition: "width 0.3s ease" }} />
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{
            flex: 1,
            height: "32px",
            borderRadius: "8px",
            border: `1.5px solid ${i < done ? "#86EFAC" : (darkMode ? "#3D4A4A" : "#E8F0E8")}`,
            background: i < done ? "#D1FAE5" : (darkMode ? "#2D3A3A" : "transparent"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
            color: i < done ? "#10B981" : (darkMode ? "#6A7A6A" : "#94A3B8"),
          }}>
            {i < done ? "✓" : `${i + 1}`}
          </div>
        ))}
      </div>
    </div>
  );
}

function BadgeMiniList({ badges, earnedCount, totalCount }) {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div style={{
      background: darkMode ? "#1E2A2A" : "#FFFFFF",
      borderRadius: "12px",
      padding: "20px",
      border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
    }}>
      <div style={{ fontSize: "14px", fontWeight: 700, color: darkMode ? "#C8E6C9" : "#1A3A2A", marginBottom: "4px" }}>Achievements</div>
      <div style={{ fontSize: "11px", color: darkMode ? "#6A7A6A" : "#5A7A6A", marginBottom: "16px" }}>{earnedCount} of {totalCount} badges earned</div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {badges.slice(0, 8).map((badge, i) => {
          const IconComponent = badge.icon;
          return (
            <div key={i} title={badge.desc} style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: badge.earned ? badge.bg : (darkMode ? "#2D3A3A" : "#F8FAFC"),
              border: `1.5px solid ${badge.earned ? badge.border : (darkMode ? "#3D4A4A" : "#E2E8F0")}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: badge.earned ? 1 : 0.4,
            }}>
              <IconComponent />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickActions({ onNavigate }) {
  const { darkMode } = useContext(ThemeContext);
  const actions = [
    { label: "Browse Modules", onClick: () => onNavigate("modules") },
    { label: "Start a Drill", onClick: () => onNavigate("drills") },
    { label: "Score History", onClick: () => onNavigate("history") },
    { label: "My Profile", onClick: () => onNavigate("profile") },
  ];
  return (
    <div style={{
      background: darkMode ? "#1E2A2A" : "#FFFFFF",
      borderRadius: "12px",
      padding: "20px",
      border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
    }}>
      <div style={{ fontSize: "14px", fontWeight: 700, color: darkMode ? "#C8E6C9" : "#1A3A2A", marginBottom: "16px" }}>Quick Actions</div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            style={{
              flex: 1,
              minWidth: "100px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
              background: darkMode ? "#2D3A3A" : "#F8FFF8",
              color: darkMode ? "#C8E6C9" : "#2D6A4F",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = darkMode ? "#2D6A4F" : "#2D6A4F";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = darkMode ? "#2D3A3A" : "#F8FFF8";
              e.currentTarget.style.color = darkMode ? "#C8E6C9" : "#2D6A4F";
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CategoryCardComponent({ category, progress, completedCount, totalModules, onClick }) {
  const { darkMode } = useContext(ThemeContext);
  const color = getColor(category.key);
  const [hovered, setHovered] = useState(false);
  const totalChapters = totalModules * 5;
  const chaptersRead = Math.round((progress / 100) * totalChapters);
  const allDone = completedCount === totalModules;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? (darkMode ? "#2D3A3A" : color.bg) : (darkMode ? "#1E2A2A" : "#FFFFFF"),
        borderRadius: "12px",
        padding: "20px",
        borderLeft: `4px solid ${color.accent}`,
        border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: hovered ? color.accent : (darkMode ? "#C8E6C9" : "#1A3A2A"), marginBottom: "4px" }}>
            {category.title}
            {allDone && <span style={{ marginLeft: "8px", fontSize: "10px", background: "#D1FAE5", color: "#10B981", padding: "2px 8px", borderRadius: "99px", fontWeight: 700 }}>Done</span>}
          </div>
          <div style={{ fontSize: "12px", color: darkMode ? "#94A3B8" : "#5A7A6A", lineHeight: "1.4" }}>{category.desc}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: darkMode ? "#94A3B8" : "#5A7A6A" }}>{chaptersRead}/{totalChapters} chapters read</span>
        <span style={{ fontSize: "12px", fontWeight: 800, color: color.accent }}>{progress}%</span>
      </div>
      <div style={{ height: "4px", background: darkMode ? "#2D3A3A" : "#F0F8F0", borderRadius: "99px", overflow: "hidden", marginBottom: "12px" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: color.accent, borderRadius: "99px", transition: "width 0.3s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: `1px solid ${darkMode ? "#2D3A3A" : "#F0F8F0"}` }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: darkMode ? "#94A3B8" : "#5A7A6A" }}>{completedCount}/{totalModules} modules completed</span>
        <div style={{ fontSize: "12px", fontWeight: 700, color: color.accent }}>Continue →</div>
      </div>
    </div>
  );
}

function DrillCardComponent({ drill, score, onClick }) {
  const { darkMode } = useContext(ThemeContext);
  const color = getColor(drill.key);
  const [hovered, setHovered] = useState(false);
  const hasScore = score !== undefined;
  const badge = hasScore ? (score >= 90 ? "Expert" : score >= 75 ? "Proficient" : "Learner") : null;
  const scoreColor = hasScore ? (score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444") : "#CBD5E1";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? (darkMode ? "#2D3A3A" : color.bg) : (darkMode ? "#1E2A2A" : "#FFFFFF"),
        borderRadius: "12px",
        padding: "20px 16px",
        borderTop: `3px solid ${color.accent}`,
        border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: 700, color: hovered ? color.accent : (darkMode ? "#C8E6C9" : "#1A3A2A"), marginBottom: "12px" }}>{drill.title}</div>
      {hasScore ? (
        <>
          <div style={{ fontSize: "28px", fontWeight: 800, color: scoreColor, marginBottom: "4px" }}>{score}%</div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: color.accent, marginBottom: "12px" }}>{badge}</div>
        </>
      ) : (
        <div style={{ fontSize: "11px", color: darkMode ? "#6A7A6A" : "#CBD5E1", padding: "12px 0" }}>Not attempted</div>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "none",
          background: hovered ? color.accent : color.bg,
          color: hovered ? "#FFFFFF" : color.accent,
          fontWeight: 600,
          fontSize: "11px",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.2s ease",
        }}
      >
        {hasScore ? "Retry" : "Start"}
      </button>
    </div>
  );
}

function BadgeCard({ badge, earned, index }) {
  const { darkMode } = useContext(ThemeContext);
  const IconComponent = badge.icon;
  return (
    <div style={{
      background: earned ? (darkMode ? "#2D4A3A" : badge.bg) : (darkMode ? "#1E2A2A" : "#FFFFFF"),
      borderRadius: "12px",
      padding: "16px",
      border: `1px solid ${earned ? badge.border : (darkMode ? "#2D3A3A" : "#E8F0E8")}`,
      display: "flex",
      alignItems: "center",
      gap: "14px",
      opacity: earned ? 1 : 0.5,
      animation: `fadeUp 0.3s ease both ${index * 0.03}s`,
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "10px",
        background: earned ? badge.bg : (darkMode ? "#2D3A3A" : "#F8FAFC"),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <IconComponent />
      </div>
      <div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: darkMode ? "#C8E6C9" : "#1A3A2A", marginBottom: "2px" }}>{badge.label}</div>
        <div style={{ fontSize: "11px", color: darkMode ? "#94A3B8" : "#5A7A6A" }}>{badge.desc}</div>
      </div>
    </div>
  );
}

function ScoreHistoryItem({ module, score, date, index }) {
  const { darkMode } = useContext(ThemeContext);
  const color = getColor(module);
  const scoreColor = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  const badge = score >= 90 ? "Expert" : score >= 75 ? "Proficient" : score >= 60 ? "Learner" : "Needs Practice";
  const badgeColor = score >= 80 ? "#D1FAE5" : score >= 60 ? "#FEF9C3" : "#FEE2E2";
  const badgeTextColor = score >= 80 ? "#10B981" : score >= 60 ? "#CA8A04" : "#EF4444";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "14px 16px",
      background: darkMode ? "#1E2A2A" : "#FFFFFF",
      border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
      borderRadius: "12px",
      marginBottom: "8px",
      animation: `fadeUp 0.3s ease both ${index * 0.05}s`,
      transition: "all 0.2s ease",
    }}>
      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color.accent, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: "14px", color: darkMode ? "#C8E6C9" : "#1A3A2A", textTransform: "capitalize" }}>{module}</div>
        <div style={{ fontSize: "10px", color: darkMode ? "#6A7A6A" : "#94A3B8" }}>{date}</div>
      </div>
      <div style={{ width: "100px", height: "4px", background: darkMode ? "#2D3A3A" : "#F0F8F0", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: scoreColor, borderRadius: "99px" }} />
      </div>
      <div style={{ fontSize: "18px", fontWeight: 800, color: scoreColor, minWidth: "48px", textAlign: "right" }}>{score}%</div>
      <div style={{
        fontSize: "10px",
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: "99px",
        background: badgeColor,
        color: badgeTextColor,
        minWidth: "74px",
        textAlign: "center",
      }}>
        {badge}
      </div>
    </div>
  );
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
function Dashboard({ user, onLogout, darkMode, toggleDarkMode, navigateToProfileRef}) {
  const navigate = useNavigate();
  
  const [activePage, setActivePage] = useState("dashboard");
  

  // Data states
  const [drillScores, setDrillScores] = useState({});
  const [moduleProgress, setModuleProgress] = useState({});
  const [readChapters, setReadChapters] = useState({});
  const [allScores, setAllScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drillsThisWeek, setDrillsThisWeek] = useState(0);

  const username = user?.username || "guest";

   useEffect(() => {
    if (navigateToProfileRef) {
      navigateToProfileRef.current = () => setActivePage("profile");
    }
  }, [navigateToProfileRef]);
 
  // Load all data from localStorage and API
useEffect(() => {
  const loadData = async () => {
    setLoading(true);

    const storedChapters = {};
    ["earthquake", "flood", "fire", "cyclone", "stampede"].forEach(key => {
      try {
        const raw = localStorage.getItem(`readChapters_${username}_${key}`);
        storedChapters[key] = raw ? JSON.parse(raw) : [];
      } catch { storedChapters[key] = []; }
    });
    setReadChapters(storedChapters);

    const storedScores = JSON.parse(
      localStorage.getItem(getStorageKey(username, "drillScores")) || "{}"
    );

    try {
      const scoresRes = await getMyScores();
      const apiScores = {};
      scoresRes.data.forEach(s => { apiScores[s.module] = s.score; });
      setAllScores(scoresRes.data);

      const mergedScores = { ...storedScores, ...apiScores };
      setDrillScores(mergedScores);
      localStorage.setItem(getStorageKey(username, "drillScores"), JSON.stringify(mergedScores));
    } catch (err) {
      console.log("API load failed, using localStorage");
      setDrillScores(storedScores);
    }

    const weekKey = `weeklyDrills_${username}_${getWeekKey()}`;
    setDrillsThisWeek(parseInt(localStorage.getItem(weekKey) || "0", 10));

    setLoading(false);
  };

  loadData();
}, [username]); // runs once on login, re-runs if user changes

// Save drill scores when they change (only one copy of this)
useEffect(() => {
  if (Object.keys(drillScores).length > 0) {
    localStorage.setItem(getStorageKey(username, "drillScores"), JSON.stringify(drillScores));
  }
}, [drillScores, username]);

  


  // Save module progress when it changes
  useEffect(() => {
    if (Object.keys(moduleProgress).length > 0) {
      localStorage.setItem(getStorageKey(username, "moduleProgress"), JSON.stringify(moduleProgress));
    }
  }, [moduleProgress, username]);

 

  // Derived stats
const totalModules = CATEGORY_DATA.reduce((s, c) => s + c.modules.length, 0);
  const chaptersReadFor = (key) => readChapters[key]?.length || 0;

const CHAPTER_COUNTS = { earthquake: 5, flood: 4, fire: 4, cyclone: 4, stampede: 4 };

// Replace your existing completedModules block:
const completedModules = CATEGORY_DATA.reduce((count, cat) => {
  const totalChapters = CHAPTER_COUNTS[cat.key] || 5;
  return count + (chaptersReadFor(cat.key) >= totalChapters ? 1 : 0);
}, 0);

const drillsAttempted = ALL_DRILLS.filter(d => drillScores[d.key] !== undefined).length;
  

  
// Your existing line is fine, but make sure CHAPTER_COUNTS is used:
const totalChaptersRead = CATEGORY_DATA.reduce((sum, cat) =>
  sum + Math.min(chaptersReadFor(cat.key), CHAPTER_COUNTS[cat.key] || 5), 0
);

  const learningScore = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  const drillVals = ALL_DRILLS.map(d => drillScores[d.key]).filter(s => s !== undefined);
  const drillAvg = drillVals.length ? drillVals.reduce((a, b) => a + b, 0) / drillVals.length : 0;
  const consistencyScore = (drillsAttempted / ALL_DRILLS.length) * 100;
  const preparednessIndex = Math.round((0.4 * learningScore) + (0.4 * drillAvg) + (0.2 * consistencyScore));
  const indexColor = preparednessIndex >= 75 ? "#10B981" : preparednessIndex >= 50 ? "#F59E0B" : "#EF4444";

  // Replace your existing catStats block with this:
const catStats = CATEGORY_DATA.map(cat => {
  const totalChapters = CHAPTER_COUNTS[cat.key] || 5;
  const chaptersRead = chaptersReadFor(cat.key);
  const pct = totalChapters > 0 ? Math.round((chaptersRead / totalChapters) * 100) : 0;
  const completedInCat = chaptersRead >= totalChapters ? 1 : 0; // 1 module per category
  return { ...cat, pct, completedInCat };
});

  const badgeState = { drillScores, completedModules, preparednessIndex, totalChaptersRead };
  const earnedBadges = new Set(BADGE_DEFS.filter(b => b.check(badgeState)).map(b => b.id));
  
  const badgeDisplay = BADGE_DEFS.map(b => ({
    ...b,
    earned: earnedBadges.has(b.id),
  }));

  // Determine next action
  const getNextAction = () => {
    const notAttempted = ALL_DRILLS.find(d => drillScores[d.key] === undefined);
    const lowScore = ALL_DRILLS.find(d => drillScores[d.key] !== undefined && drillScores[d.key] < 60);
    const inProgress = catStats.find(c => c.pct > 0 && c.pct < 100);
    const unstarted = catStats.find(c => c.pct === 0);

    if (drillsAttempted === 0) {
      return { label: "Recommended Next Step", title: "Take your first drill", sub: "Start with Earthquake to get a feel for it.", btnLabel: "Start Earthquake Drill", btnColor: getColor("earthquake").accent, onClick: () => navigate("/student/drill/earthquake") };
    }
    if (lowScore) {
      const col = getColor(lowScore.key);
      return { label: "Needs Improvement", title: `Retry the ${lowScore.title} drill`, sub: `You scored ${drillScores[lowScore.key]}% — try again to improve.`, btnLabel: `Retry ${lowScore.title}`, btnColor: col.accent, onClick: () => navigate(`/student/drill/${lowScore.key}`) };
    }
    if (inProgress) {
      const col = getColor(inProgress.key);
      return { label: "Continue Learning", title: `Continue ${inProgress.title} module`, sub: `You're ${inProgress.pct}% through — keep reading to complete.`, btnLabel: `Continue ${inProgress.title}`, btnColor: col.accent, onClick: () => navigate(inProgress.route) };
    }
    if (notAttempted) {
      const col = getColor(notAttempted.key);
      return { label: "Recommended Next Step", title: `Try the ${notAttempted.title} drill`, sub: "You haven't attempted this drill yet — give it a go!", btnLabel: `Start ${notAttempted.title} Drill`, btnColor: col.accent, onClick: () => navigate(`/student/drill/${notAttempted.key}`) };
    }
    if (unstarted) {
      const col = getColor(unstarted.key);
      return { label: "New Module", title: `Start ${unstarted.title} module`, sub: "You haven't started this category yet.", btnLabel: `Start ${unstarted.title}`, btnColor: col.accent, onClick: () => navigate(unstarted.route) };
    }
    return { label: "Keep Going", title: "Maintain your readiness", sub: "Retry drills to keep your skills sharp.", btnLabel: "Browse Drills", btnColor: "#2D6A4F", onClick: () => setActivePage("drills") };
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  // CSS animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const themeStyles = {
    background: darkMode ? "#0F1A1A" : "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
    color: darkMode ? "#E8EDE9" : "#1A3A2A",
    minHeight: "100vh",
  };

  const mainBg = darkMode ? "#0F1A1A" : "transparent";

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div style={themeStyles}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar activePage={activePage} setActivePage={setActivePage} user={user} onLogout={handleLogout} />
          
          <main style={{ flex: 1, padding: "24px 32px", background: mainBg }}>

            {/* DASHBOARD PAGE */}
            {activePage === "dashboard" && (
              <div>
                {/* Welcome Banner */}
                <div style={{
                  background: darkMode ? "#1E2A2A" : "linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%)",
                  borderRadius: "16px",
                  padding: "28px 32px",
                  marginBottom: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div>
                   <div style={{ fontSize: "12px", opacity: 0.7, color: "#FFFFFF", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
  Welcome back
</div>
                    <div style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF", marginBottom: "4px" }}>{user?.username || "Student"}!</div>
                    <div style={{ fontSize: "13px", opacity: 0.8, color: "#FFFFFF" }}>Here's your disaster preparedness progress</div>
                  </div>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: indexColor === "#10B981" ? "#D1FAE5" : indexColor === "#F59E0B" ? "#FEF9C3" : "#FEE2E2",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `4px solid ${indexColor}`,
                  }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: indexColor }}>{preparednessIndex}</div>
                    <div style={{ fontSize: "9px", fontWeight: 700, color: indexColor, textTransform: "uppercase" }}>Index</div>
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
                  <StatCard value={preparednessIndex} label="Preparedness Index" color={indexColor} delay={0} />
                  <StatCard value={`${completedModules}/${totalModules}`} label="Modules Completed" color="#2D6A4F" delay={0.05} />
                  <StatCard value={`${drillsAttempted}/${ALL_DRILLS.length}`} label="Drills Attempted" color="#8B5CF6" delay={0.1} />
                </div>

                {/* Next Action */}
                <NextActionCard action={getNextAction()} onClick={getNextAction().onClick} />

                {/* Weekly Goal & Badges Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <WeeklyGoalCard done={drillsThisWeek} total={WEEKLY_GOAL} />
                  <BadgeMiniList badges={badgeDisplay.slice(0, 8)} earnedCount={earnedBadges.size} totalCount={BADGE_DEFS.length} />
                </div>

                {/* Quick Actions */}
                <QuickActions onNavigate={setActivePage} />
              </div>
            )}

            {/* MODULES PAGE */}
            {activePage === "modules" && (
              <div>
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: 800, color: darkMode ? "#C8E6C9" : "#1A3A2A", marginBottom: "4px" }}>My Modules</h2>
                  <p style={{ fontSize: "13px", color: darkMode ? "#94A3B8" : "#5A7A6A" }}>Your progress across all disaster categories</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {catStats.map((cat, i) => (
                    <CategoryCardComponent
                      key={cat.key}
                      category={cat}
                      progress={cat.pct}
                      completedCount={cat.completedInCat}
                      totalModules={cat.modules.length}
                      onClick={() => navigate(cat.route)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* DRILLS PAGE */}
            {activePage === "drills" && (
              <div>
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: 800, color: darkMode ? "#C8E6C9" : "#1A3A2A", marginBottom: "4px" }}>Drill Performance</h2>
                  <p style={{ fontSize: "13px", color: darkMode ? "#94A3B8" : "#5A7A6A" }}>Your scores across all emergency drills</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
                  {ALL_DRILLS.map((drill, i) => (
                    <DrillCardComponent
                      key={drill.key}
                      drill={drill}
                      score={drillScores[drill.key]}
                      onClick={() => navigate(`/student/drill/${drill.key}`)}
                    />
                  ))}
                </div>

                {drillsAttempted === ALL_DRILLS.length && drillAvg >= 75 && (
                  <div style={{
                    background: "linear-gradient(135deg, #E9C46A 0%, #E76F51 100%)",
                    borderRadius: "12px",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <IconAward />
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>Outstanding Performance!</div>
                        <div style={{ fontSize: "12px", color: "#5a4a00" }}>You've completed all drills with an average of {Math.round(drillAvg)}%</div>
                      </div>
                    </div>
                    <button style={{
                      padding: "8px 20px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#FFFFFF",
                      color: "#E76F51",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                    }}>Download Certificate</button>
                  </div>
                )}
              </div>
            )}

            {/* BADGES PAGE */}
            {activePage === "badges" && (
              <div>
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: 800, color: darkMode ? "#C8E6C9" : "#1A3A2A", marginBottom: "4px" }}>Badge Shelf</h2>
                  <p style={{ fontSize: "13px", color: darkMode ? "#94A3B8" : "#5A7A6A" }}>{earnedBadges.size} of {BADGE_DEFS.length} badges earned</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                  {badgeDisplay.map((badge, i) => (
                    <BadgeCard key={badge.id} badge={badge} earned={badge.earned} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* HISTORY PAGE */}
            {activePage === "history" && (
              <div>
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: 800, color: darkMode ? "#C8E6C9" : "#1A3A2A", marginBottom: "4px" }}>Score History</h2>
                  <p style={{ fontSize: "13px", color: darkMode ? "#94A3B8" : "#5A7A6A" }}>Your drill performance over time</p>
                </div>

                {/* Summary Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
                  {ALL_DRILLS.map(drill => {
                    const color = getColor(drill.key);
                    const score = drillScores[drill.key];
                    return (
                      <div key={drill.key} style={{
                        background: score !== undefined ? color.bg : (darkMode ? "#1E2A2A" : "#F8FAFC"),
                        border: `1px solid ${score !== undefined ? color.border : (darkMode ? "#2D3A3A" : "#E2E8F0")}`,
                        borderTop: `3px solid ${score !== undefined ? color.accent : (darkMode ? "#3D4A4A" : "#E2E8F0")}`,
                        borderRadius: "12px",
                        padding: "16px 12px",
                        textAlign: "center",
                      }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: score !== undefined ? color.text : (darkMode ? "#6A7A6A" : "#94A3B8"), marginBottom: "8px" }}>{drill.title}</div>
                        {score !== undefined ? (
                          <>
                            <div style={{ fontSize: "28px", fontWeight: 800, color: color.accent }}>{score}%</div>
                            <div style={{ fontSize: "9px", fontWeight: 700, color: color.accent, marginTop: "4px" }}>
                              {score >= 90 ? "Expert" : score >= 75 ? "Proficient" : "Learner"}
                            </div>
                          </>
                        ) : (
                          <div style={{ fontSize: "11px", color: darkMode ? "#6A7A6A" : "#CBD5E1", padding: "12px 0" }}>Not attempted</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* All Attempts */}
                <div style={{
                  background: darkMode ? "#1E2A2A" : "#FFFFFF",
                  borderRadius: "16px",
                  border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
                  overflow: "hidden",
                }}>
                  <div style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>All Drill Attempts</div>
                      <div style={{ fontSize: "11px", color: darkMode ? "#94A3B8" : "#5A7A6A", marginTop: "2px" }}>Pulled from the database</div>
                    </div>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#2D6A4F",
                      background: darkMode ? "#2D4A3A" : "#F0FDF4",
                      padding: "4px 12px",
                      borderRadius: "99px",
                    }}>{allScores.length} records</span>
                  </div>
                  <div style={{ padding: "20px" }}>
                    {loading ? (
                      <div style={{ textAlign: "center", padding: "40px", color: darkMode ? "#6A7A6A" : "#94A3B8" }}>Loading scores...</div>
                    ) : allScores.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "40px", color: darkMode ? "#6A7A6A" : "#94A3B8" }}>No drill history yet. Complete a drill to see your scores here.</div>
                    ) : (
                      allScores.map((s, i) => (
                        <ScoreHistoryItem
                          key={i}
                          module={s.module}
                          score={s.score}
                          date={s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                          index={i}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE PAGE */}
            {activePage === "profile" && (
              <div>
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: 800, color: darkMode ? "#C8E6C9" : "#1A3A2A", marginBottom: "4px" }}>My Profile</h2>
                  <p style={{ fontSize: "13px", color: darkMode ? "#94A3B8" : "#5A7A6A" }}>Manage your account and view your achievements</p>
                </div>

                {/* Profile Banner */}
                <div style={{
                  background: darkMode ? "#1E2A2A" : "linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%)",
                  borderRadius: "16px",
                  padding: "28px 32px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                }}>
                  <div style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "18px",
                    background: "rgba(255,255,255,0.2)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    fontWeight: 800,
                    color: "#FFFFFF",
                  }}>
                    {user?.username?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF" }}>{user?.username || "Student"}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>Student Account</div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: "20px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF" }}>{preparednessIndex}</div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Index</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF" }}>{earnedBadges.size}</div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Badges</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF" }}>{drillsAttempted}/5</div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Drills</div>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                  <StatCard value={preparednessIndex} label="Preparedness Index" color={indexColor} delay={0} />
                  <StatCard value={`${completedModules}/5`} label="Modules Completed" color="#2D6A4F" delay={0.05} />
                  <StatCard value={`${drillsAttempted}/5`} label="Drills Attempted" color="#8B5CF6" delay={0.1} />
                  <StatCard value={`${Math.round(drillAvg) || 0}%`} label="Average Drill Score" color="#0284C7" delay={0.15} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {/* Change Username */}
                  <div style={{
                    background: darkMode ? "#1E2A2A" : "#FFFFFF",
                    borderRadius: "16px",
                    padding: "24px",
                    border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#F0FDF4", border: "1px solid #C8E6C9", display: "flex", alignItems: "center", justifyContent: "center" }}>✏️</div>
                      <div>
                        <div style={{ fontWeight: 700, color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>Change Username</div>
                        <div style={{ fontSize: "11px", color: darkMode ? "#94A3B8" : "#5A7A6A" }}>Update your display name</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: darkMode ? "#94A3B8" : "#5A7A6A", marginBottom: "6px", display: "block" }}>Current Username</label>
                      <div style={{
                        padding: "10px 14px",
                        background: darkMode ? "#2D3A3A" : "#F8FFF8",
                        border: `1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}`,
                        borderRadius: "10px",
                        fontSize: "13px",
                        color: darkMode ? "#94A3B8" : "#5A7A6A",
                      }}>{user?.username || "—"}</div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: darkMode ? "#94A3B8" : "#5A7A6A", marginBottom: "6px", display: "block" }}>New Username</label>
                      <input
                        type="text"
                        placeholder="Enter new username"
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: `1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}`,
                          borderRadius: "10px",
                          fontSize: "13px",
                          fontFamily: "inherit",
                          background: darkMode ? "#2D3A3A" : "#FFFFFF",
                          color: darkMode ? "#C8E6C9" : "#0F172A",
                          outline: "none",
                        }}
                      />
                    </div>
                    <button style={{
                      width: "100%",
                      padding: "12px",
                      background: "#2D6A4F",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                    }}>Update Username</button>
                  </div>

                  {/* Change Password */}
                  <div style={{
                    background: darkMode ? "#1E2A2A" : "#FFFFFF",
                    borderRadius: "16px",
                    padding: "24px",
                    border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#FFF7ED", border: "1px solid #FDBA74", display: "flex", alignItems: "center", justifyContent: "center" }}>🔒</div>
                      <div>
                        <div style={{ fontWeight: 700, color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>Change Password</div>
                        <div style={{ fontSize: "11px", color: darkMode ? "#94A3B8" : "#5A7A6A" }}>Keep your account secure</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: darkMode ? "#94A3B8" : "#5A7A6A", marginBottom: "6px", display: "block" }}>Current Password</label>
                      <input type="password" placeholder="Enter current password" style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: `1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}`,
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        background: darkMode ? "#2D3A3A" : "#FFFFFF",
                        color: darkMode ? "#C8E6C9" : "#0F172A",
                        outline: "none",
                      }} />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: darkMode ? "#94A3B8" : "#5A7A6A", marginBottom: "6px", display: "block" }}>New Password</label>
                      <input type="password" placeholder="Enter new password" style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: `1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}`,
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        background: darkMode ? "#2D3A3A" : "#FFFFFF",
                        color: darkMode ? "#C8E6C9" : "#0F172A",
                        outline: "none",
                      }} />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: darkMode ? "#94A3B8" : "#5A7A6A", marginBottom: "6px", display: "block" }}>Confirm Password</label>
                      <input type="password" placeholder="Repeat new password" style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: `1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}`,
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        background: darkMode ? "#2D3A3A" : "#FFFFFF",
                        color: darkMode ? "#C8E6C9" : "#0F172A",
                        outline: "none",
                      }} />
                    </div>
                    <button style={{
                      width: "100%",
                      padding: "12px",
                      background: "#2D6A4F",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                    }}>Update Password</button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default Dashboard;
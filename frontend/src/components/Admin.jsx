import { useState, useEffect, createContext, useContext } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { getScores, getModules, addModule, deleteModule as deleteModuleAPI, updateModule } from "../services/api";

// ============================================
// DARK MODE CONTEXT
// ============================================
const ThemeContext = createContext({ darkMode: false, toggleDarkMode: () => {} });

// ============================================
// PROFESSIONAL SVG ICONS - NO EMOJIS
// ============================================
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const IconStudents = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconModules = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <path d="M8 7h8"/>
    <path d="M8 11h6"/>
  </svg>
);

const IconProfile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
  </svg>
);

const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const IconChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const DRILL_COLORS = {
  earthquake: { bg: "#FEF3C7", border: "#FCD34D", accent: "#D97706", text: "#92400E", hover: "#FFFBEB" },
  flood:      { bg: "#E0F2FE", border: "#7DD3FC", accent: "#0284C7", text: "#075985", hover: "#F0F9FF" },
  fire:       { bg: "#FFEDD5", border: "#FDBA74", accent: "#EA580C", text: "#9A3412", hover: "#FFF7ED" },
  cyclone:    { bg: "#EFF6FF", border: "#BFDBFE", accent: "#3B82F6", text: "#1E3A8A", hover: "#EFF6FF" },
  stampede:   { bg: "#FEF9C3", border: "#FDE047", accent: "#CA8A04", text: "#854D0E", hover: "#FEFCE8" },
};

const AVATAR_COLORS = ["#2D6A4F", "#E9C46A", "#3B82F6", "#8B5CF6", "#EA580C"];
const DRILL_META    = [
  { key: "earthquake", label: "Earthquake" },
  { key: "flood",      label: "Flood"      },
  { key: "fire",       label: "Fire"       },
  { key: "cyclone",    label: "Cyclone"    },
  { key: "stampede",   label: "Stampede"   },
];
const ALL_MODULE_NAMES = ["Earthquake", "Flood", "Fire", "Cyclone", "Stampede"];
const CATEGORIES = ["Natural Disasters", "Man-made Disasters", "Medical Emergency", "Fire Safety"];

const scoreColor = s => s >= 80 ? "#10B981" : s >= 60 ? "#F59E0B" : "#EF4444";
const scoreBadge = (s, darkMode) => {
  if (s >= 80) return darkMode ? "#2D4A3A" : "#D1FAE5";
  if (s >= 60) return darkMode ? "#4A3D2A" : "#FEF9C3";
  return darkMode ? "#4A2A2A" : "#FEE2E2";
};
const scoreTextColor = s => s >= 80 ? "#10B981" : s >= 60 ? "#CA8A04" : "#EF4444";

function dc(key) {
  return DRILL_COLORS[key?.toLowerCase()] || { bg: "#F1F5F9", border: "#E2E8F0", accent: "#2D6A4F", text: "#0F172A", hover: "#F8FAFC" };
}

function getCss(darkMode) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes fadeUp   { from { opacity:0; transform:translateY(12px);  } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeDown { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideIn  { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }

    body {
      background: ${darkMode ? "#0F1A1A" : "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)"};
      font-family: 'DM Sans', sans-serif; min-height: 100vh; position: relative;
    }
    body::before {
      content: ''; position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2340964C' fill-opacity='${darkMode ? "0.02" : "0.03"}'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      pointer-events: none; z-index: 0;
    }

    .adm-shell { display: flex; min-height: 100vh; position: relative; z-index: 1; }

    /* Sidebar */
    .adm-sidebar {
      width: 260px; flex-shrink: 0;
      background: ${darkMode ? "#1E2A2A" : "#FFFFFF"};
      border-right: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"};
      padding: 28px 20px; display: flex; flex-direction: column; gap: 6px;
      box-shadow: 2px 0 8px rgba(0,0,0,${darkMode ? "0.2" : "0.03"});
      min-height: 100vh; position: sticky; top: 0; height: 100vh; overflow-y: auto;
    }
    .adm-sidebar-logo {
      font-size: 1rem; font-weight: 800; color: ${darkMode ? "#C8E6C9" : "#1A3A2A"};
      letter-spacing: -.02em; margin-bottom: 20px; padding-bottom: 16px;
      border-bottom: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"};
    }
    .adm-sidebar-logo span { color: #2D6A4F; }
    .adm-nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 10px; cursor: pointer;
      font-size: .84rem; font-weight: 600; color: ${darkMode ? "#94A3B8" : "#5A7A6A"};
      transition: all .18s ease; border: none; background: none;
      width: 100%; text-align: left; font-family: inherit;
    }
    .adm-nav-item:hover { background: ${darkMode ? "#2D3A3A" : "#F0F8F0"}; color: ${darkMode ? "#C8E6C9" : "#2D6A4F"}; }
    .adm-nav-item.active { background: #2D6A4F; color: #fff; }
    .adm-nav-item .nav-icon { width: 20px; text-align: center; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .adm-nav-divider { height: 1px; background: ${darkMode ? "#2D3A3A" : "#E8F0E8"}; margin: 8px 0; }
    .adm-nav-section { font-size: .62rem; font-weight: 700; color: ${darkMode ? "#6A7A6A" : "#94A3B8"}; text-transform: uppercase; letter-spacing: .08em; padding: 4px 14px; margin-top: 4px; }
    .adm-sidebar-bottom { margin-top: auto; padding-top: 16px; border-top: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}; }

    /* Main content */
    .adm-main { flex: 1; min-width: 0; padding: 28px 28px 48px; }

    /* Profile panel */
    .profile-panel {
      background: ${darkMode ? "#1E2A2A" : "#FFFFFF"}; border-radius: 16px;
      border: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"};
      box-shadow: 0 2px 8px rgba(0,0,0,${darkMode ? "0.2" : "0.04"});
      padding: 32px; max-width: 520px; animation: slideIn .3s ease both;
    }
    .profile-name { font-size: 1.3rem; font-weight: 800; color: ${darkMode ? "#C8E6C9" : "#1A3A2A"}; margin-bottom: 4px; }
    .profile-role { font-size: .78rem; color: ${darkMode ? "#94A3B8" : "#5A7A6A"}; margin-bottom: 24px; }
    .profile-section { font-size: .7rem; font-weight: 700; color: ${darkMode ? "#94A3B8" : "#5A7A6A"}; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 12px; margin-top: 24px; }
    .profile-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
    .profile-field label { font-size: .72rem; font-weight: 700; color: ${darkMode ? "#94A3B8" : "#5A7A6A"}; text-transform: uppercase; letter-spacing: .06em; }
    .profile-field input {
      border: 1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}; border-radius: 10px;
      padding: 10px 14px; font-size: .88rem; font-family: inherit;
      background: ${darkMode ? "#2D3A3A" : "#FFFFFF"}; color: ${darkMode ? "#C8E6C9" : "#0F172A"};
      outline: none; transition: all .2s ease;
    }
    .profile-field input:focus { border-color: #2D6A4F; box-shadow: 0 0 0 3px rgba(45,106,79,.1); }
    .profile-btn { padding: 10px 24px; border-radius: 10px; border: none; font-family: inherit; font-size: .84rem; font-weight: 600; cursor: pointer; transition: all .2s ease; }
    .profile-btn.primary { background: #2D6A4F; color: #fff; }
    .profile-btn.primary:hover { background: #1B4D3E; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(45,106,79,.3); }
    .profile-btn.secondary { background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; color: #2D6A4F; border: 1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}; margin-left: 8px; }
    .profile-btn.secondary:hover { background: ${darkMode ? "#3D4A4A" : "#E8F0E8"}; }
    .profile-flash { padding: 10px 14px; border-radius: 10px; font-size: .8rem; font-weight: 600; margin-bottom: 16px; animation: fadeUp .2s ease both; }
    .profile-flash.ok  { background: #D1FAE5; color: #10B981; border: 1px solid #86EFAC; }
    .profile-flash.err { background: #FEE2E2; color: #EF4444; border: 1px solid #FECACA; }

    /* Page header */
    .adm-page-hd { margin-bottom: 28px; }
    .adm-page-hd h2 { font-size: 1.6rem; font-weight: 700; letter-spacing: -.02em; color: ${darkMode ? "#C8E6C9" : "#1A3A2A"}; }
    .adm-page-hd p  { font-size: .82rem; color: ${darkMode ? "#94A3B8" : "#5A7A6A"}; margin-top: 4px; }

    /* Stat strip */
    .stat-strip { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
    @media (max-width: 700px) { .stat-strip { grid-template-columns: repeat(2,1fr); } }
    .adm-stat {
      background: ${darkMode ? "#1E2A2A" : "#FFFFFF"}; border-radius: 16px;
      padding: 20px 18px; border: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"};
      box-shadow: 0 2px 8px rgba(0,0,0,${darkMode ? "0.2" : "0.04"});
      transition: all .2s ease; animation: fadeUp .4s ease both;
    }
    .adm-stat:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(45,106,79,.12); border-color: #2D6A4F; }
    .adm-stat-val   { font-size: 2rem; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
    .adm-stat-label { font-size: .72rem; font-weight: 600; color: ${darkMode ? "#94A3B8" : "#64748B"}; text-transform: uppercase; letter-spacing: .07em; margin-top: 8px; }

    /* Layout */
    .adm-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
    @media (max-width: 860px) { .adm-layout { grid-template-columns: 1fr; } }
    .col-full { grid-column: 1 / -1; }

    /* Cards */
    .adm-card {
      background: ${darkMode ? "#1E2A2A" : "#FFFFFF"}; border-radius: 16px;
      border: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"};
      box-shadow: 0 2px 8px rgba(0,0,0,${darkMode ? "0.2" : "0.04"});
      overflow: hidden; animation: fadeUp .4s ease both;
      transition: all .2s ease;
    }
    .adm-card:hover { box-shadow: 0 8px 20px rgba(45,106,79,.08); border-color: #2D6A4F; }
    .adm-card-hd { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; user-select: none; transition: background .2s ease; }
    .adm-card-hd:hover { background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; }
    .adm-card-hd.open  { background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; border-bottom: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}; }
    .adm-card-title { font-size: .96rem; font-weight: 700; color: ${darkMode ? "#C8E6C9" : "#1A3A2A"}; }
    .adm-card-sub   { font-size: .72rem; color: ${darkMode ? "#94A3B8" : "#5A7A6A"}; margin-top: 3px; }
    .adm-chevron {
      width: 24px; height: 24px; border-radius: 6px;
      background: ${darkMode ? "#2D3A3A" : "#F0F8F0"}; color: #2D6A4F;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all .25s ease;
    }
    .adm-chevron.open { transform: rotate(180deg); background: ${darkMode ? "#3D4A4A" : "#E8F0E8"}; }
    .adm-card-body { padding: 20px; animation: fadeDown .25s ease both; }

    .lb-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 14px; border-radius: 12px;
      border: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"};
      margin-bottom: 8px; transition: all .2s ease;
      animation: fadeUp .3s ease both; background: ${darkMode ? "#1E2A2A" : "#FFFFFF"};
    }
    .lb-row:hover { transform: translateX(4px); box-shadow: 0 4px 12px rgba(45,106,79,.08); background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; border-color: #2D6A4F; }
    .prog-track { height: 5px; background: ${darkMode ? "#2D3A3A" : "#F0F8F0"}; border-radius: 99px; overflow: hidden; margin-top: 6px; }
    .prog-fill  { height: 100%; border-radius: 99px; transition: width .65s cubic-bezier(.25,.8,.25,1); }

    .adm-badge { padding: 4px 10px; border-radius: 99px; font-size: .7rem; font-weight: 700; }

    .tog-pill { padding: 4px 12px; border-radius: 99px; font-size: .7rem; font-weight: 700; cursor: pointer; transition: all .2s ease; user-select: none; white-space: nowrap; }
    .mod-row {
      display: flex; align-items: center; gap: 12px;
      background: ${darkMode ? "#1E2A2A" : "#FFFFFF"};
      border: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"};
      padding: 12px 16px; transition: all .2s ease;
      animation: fadeUp .3s ease both;
    }
    .stu-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; border: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"};
      cursor: pointer; transition: all .2s ease;
      animation: fadeUp .3s ease both; background: ${darkMode ? "#1E2A2A" : "#FFFFFF"};
    }
    .stu-row:hover { background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; transform: translateX(4px); border-color: #2D6A4F; }
    .stu-row.open  { background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; border-bottom-color: transparent; }
    .avatar { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: .88rem; color: #fff; flex-shrink: 0; }
    .drill-card { border-radius: 12px; padding: 12px 8px; text-align: center; border: 1px solid transparent; transition: all .2s ease; }
    .drill-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,.08); }

    .adm-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
    .adm-field label { font-size: .7rem; font-weight: 700; color: ${darkMode ? "#94A3B8" : "#5A7A6A"}; letter-spacing: .06em; text-transform: uppercase; }
    .adm-field input, .adm-field select {
      border: 1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}; border-radius: 10px;
      padding: 10px 12px; font-size: .86rem; font-family: inherit;
      background: ${darkMode ? "#2D3A3A" : "#FFFFFF"}; color: ${darkMode ? "#C8E6C9" : "#0F172A"};
      outline: none; transition: all .2s ease;
    }
    .adm-field input:focus, .adm-field select:focus { border-color: #2D6A4F; box-shadow: 0 0 0 3px rgba(45,106,79,.1); }

    .adm-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: none; font-family: inherit; font-size: .82rem; font-weight: 600; cursor: pointer; transition: all .2s ease; user-select: none; outline: none; }
    .btn-pri { background: #2D6A4F; color: #fff; }
    .btn-pri:hover { background: #1B4D3E; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(45,106,79,.3); }
    .btn-sec { background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; color: #2D6A4F; border: 1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}; }
    .btn-sec:hover { background: ${darkMode ? "#3D4A4A" : "#E8F0E8"}; transform: translateY(-1px); }
    .btn-danger { background: ${darkMode ? "#4A2A2A" : "#FEE2E2"}; color: #EF4444; border: 1px solid #FECACA; }
    .btn-danger:hover { background: #EF4444; color: #fff; transform: translateY(-1px); }
    .btn-ghost { background: none; color: #2D6A4F; border: 1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}; font-size: .75rem; padding: 5px 10px; }
    .btn-ghost:hover { background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; border-color: #2D6A4F; transform: translateY(-1px); }

    .adm-flash { padding: 12px 16px; border-radius: 12px; font-size: .82rem; font-weight: 600; margin-bottom: 16px; animation: fadeUp .2s ease both; }
    .flash-ok  { background: #D1FAE5; color: #10B981; border: 1px solid #86EFAC; }
    .flash-err { background: #FEE2E2; color: #EF4444; border: 1px solid #FECACA; }

    .adm-table { width: 100%; border-collapse: collapse; font-size: .84rem; }
    .adm-table th { text-align: left; padding: 8px 12px; font-size: .68rem; font-weight: 700; color: ${darkMode ? "#94A3B8" : "#64748B"}; text-transform: uppercase; letter-spacing: .06em; border-bottom: 2px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}; }
    .adm-table td { padding: 10px 12px; border-bottom: 1px solid ${darkMode ? "#2D3A3A" : "#F0F8F0"}; vertical-align: middle; color: ${darkMode ? "#C8E6C9" : "#1A3A2A"}; }
    .adm-table tr:last-child td { border-bottom: none; }
    .adm-table tr:hover td { background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; }

    .arr-btn { background: none; border: 1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}; border-radius: 5px; cursor: pointer; padding: 3px 6px; font-size: .58rem; color: ${darkMode ? "#94A3B8" : "#94A3B8"}; line-height: 1.6; transition: all .2s ease; }
    .arr-btn:hover { background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; color: #2D6A4F; border-color: #2D6A4F; transform: scale(1.05); }

    .inline-panel { border: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}; border-top: none; padding: 16px 20px; animation: fadeDown .2s ease both; }
    .ipanel-g { background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; border-color: #2D6A4F; border-radius: 0 0 12px 12px; }
    .ipanel-r { background: ${darkMode ? "#4A2A2A" : "#FEF2F2"}; border-color: #FECACA; border-radius: 0 0 12px 12px; }

    .mod-chip { padding: 4px 12px; border-radius: 99px; font-size: .72rem; font-weight: 600; }
    .drill-lb-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px; }
    @media (max-width: 700px) { .drill-lb-grid { grid-template-columns: repeat(3,1fr); } }
    .drill-lb-card { border-radius: 12px; padding: 14px 12px; border: 1px solid transparent; transition: all .2s ease; }
    .drill-lb-card:hover { box-shadow: 0 8px 20px rgba(0,0,0,.08); transform: translateY(-2px); }
    .drill-lb-title { font-size: .68rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; margin-bottom: 12px; }

    .new-mod-box {
      background: ${darkMode ? "#2D3A3A" : "#F8FFF8"};
      border: 1px solid #2D6A4F;
      border-radius: 12px; padding: 20px; margin-bottom: 16px;
      animation: fadeDown .2s ease both;
    }
    .new-mod-title { font-size: .86rem; font-weight: 700; color: #2D6A4F; margin-bottom: 16px; }
    .scroll-area { overflow-y: auto; padding-right: 4px; }
    .scroll-area::-webkit-scrollbar { width: 4px; }
    .scroll-area::-webkit-scrollbar-thumb { background: #2D6A4F; border-radius: 99px; }

    .insight-row {
      border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;
      font-size: .84rem; line-height: 1.65;
      border: 1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"};
      border-left: 3px solid transparent;
      transition: all .2s ease; animation: fadeUp .3s ease both;
      background: ${darkMode ? "#1E2A2A" : "#FFFFFF"};
      color: ${darkMode ? "#C8E6C9" : "#1A3A2A"};
    }
    .insight-row:hover { box-shadow: 0 4px 12px rgba(0,0,0,.05); background: ${darkMode ? "#2D3A3A" : "#F8FFF8"}; border-color: #2D6A4F; }

    .drill-perf-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 8px; margin-bottom: 16px; }
    @media (max-width: 560px) { .drill-perf-grid { grid-template-columns: repeat(3,1fr); } }
    .sec-label { font-size: .7rem; font-weight: 700; color: ${darkMode ? "#94A3B8" : "#5A7A6A"}; letter-spacing: .07em; text-transform: uppercase; margin-bottom: 12px; }
    .inner-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    @media (max-width: 640px) { .inner-2col { grid-template-columns: 1fr; } }
    .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    @media (max-width: 500px) { .form-2col { grid-template-columns: 1fr; } }

    .empty-state { text-align: center; padding: 40px 20px; color: ${darkMode ? "#6A7A6A" : "#94A3B8"}; font-size: .84rem; }
    .empty-state .empty-icon { font-size: 2rem; margin-bottom: 8px; }
  `;
}

function useStyles(darkMode) {
  useEffect(() => {
    const existing = document.getElementById("adm-css");
    if (existing) existing.remove();
    const s = document.createElement("style");
    s.id = "adm-css";
    s.textContent = getCss(darkMode);
    document.head.appendChild(s);
  }, [darkMode]);
}

/* ── Header with Dark Mode Toggle ── */
function Header({ darkMode, toggleDarkMode }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: "24px",
    }}>
      <button
        onClick={toggleDarkMode}
        style={{
          background: darkMode ? "#2D3A3A" : "#F0F8F0",
          border: `1px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}`,
          borderRadius: "40px",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "13px",
          fontWeight: 500,
          color: darkMode ? "#C8E6C9" : "#2D6A4F",
          transition: "all 0.2s ease",
        }}
      >
        {darkMode ? <IconSun /> : <IconMoon />}
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}

/* ── ModuleRow ── */
function ModuleRow({ mod, idx, isEditing, isDeleting, onMoveUp, onMoveDown, onEdit, onDelete, onToggle, children, darkMode }) {
  const [hovered, setHovered] = useState(false);
  const col        = dc(mod.name);
  const borderLeft = `4px solid ${col.accent}`;
  const bg         = hovered ? (darkMode ? "#2D3A3A" : col.hover) : (darkMode ? "#1E2A2A" : "#fff");
  const bord       = hovered ? col.border : (darkMode ? "#2D3A3A" : "#e4e8e4");
  const br         = isEditing || isDeleting ? "9px 9px 0 0" : 9;

  return (
    <div style={{ marginBottom: 8 }}>
      <div className="mod-row"
        style={{ borderLeft, background: bg, borderColor: bord, borderRadius: br, animationDelay: `${idx * .04}s` }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <button className="arr-btn" onClick={onMoveUp}>▲</button>
          <button className="arr-btn" onClick={onMoveDown}>▼</button>
        </div>
        {mod.icon && (
          <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, background: col.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", border: `1px solid ${col.border}` }}>
            {mod.icon}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: ".86rem", color: hovered ? col.accent : (darkMode ? "#C8E6C9" : "#1a1a1a"), transition: "color .16s ease" }}>{mod.name}</div>
          <div style={{ fontSize: ".67rem", color: darkMode ? "#6A7A6A" : "#a0a8a2", marginTop: 1 }}>{mod.category} &bull; {mod.students || 0} students</div>
        </div>
        <span className="tog-pill" onClick={onToggle} style={{ background: mod.active ? "#dcfce7" : "#fee2e2", color: mod.active ? "#15803d" : "#b91c1c", border: `1px solid ${mod.active ? "#bbf7d0" : "#fecaca"}` }}>
          {mod.active ? "Active" : "Inactive"}
        </span>
        <button className="adm-btn btn-ghost" onClick={onEdit}>{isEditing ? "Close" : "Edit"}</button>
        <button className="adm-btn btn-danger" style={{ padding: "4px 9px", fontSize: ".7rem" }} onClick={onDelete}>Delete</button>
      </div>
      {children}
    </div>
  );
}

/* ── SectionHeader ── */
function SectionHeader({ id, title, sub, expandedSection, toggleSection }) {
  const open = expandedSection.has(id);  // ← was: expandedSection === id
  return (
    <div className={`adm-card-hd ${open ? "open" : ""}`} onClick={() => toggleSection(id)}>
      <div>
        <div className="adm-card-title">{title}</div>
        <div className="adm-card-sub">{sub}</div>
      </div>
      <div className={`adm-chevron ${open ? "open" : ""}`}>
        <IconChevronDown />
      </div>
    </div>
  );
}

/* ── Profile Panel ── */
function ProfilePanel({ user, darkMode }) {
  const [newUsername,     setNewUsername]     = useState("");
  const [oldPassword,     setOldPassword]     = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg,             setMsg]             = useState({ text: "", type: "" });

  const flash = (text, type = "ok") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3500);
  };

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) return flash("Enter a new username.", "err");
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res   = await fetch("/api/auth/update-username", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newUsername }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const stored = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({ ...stored, username: newUsername }));
      setNewUsername("");
      flash("Username updated! Please log in again to reflect changes.");
    } catch (err) {
      flash(err.message || "Failed to update username.", "err");
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) return flash("Fill in all password fields.", "err");
    if (newPassword !== confirmPassword) return flash("New passwords do not match.", "err");
    if (newPassword.length < 4) return flash("Password must be at least 4 characters.", "err");
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res   = await fetch("/api/auth/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      flash("Password updated successfully!");
    } catch (err) {
      flash(err.message || "Failed to update password.", "err");
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    border: `1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}`,
    borderRadius: 10, fontSize: ".9rem", fontFamily: "inherit",
    background: darkMode ? "#2D3A3A" : "#FFFFFF",
    color: darkMode ? "#C8E6C9" : "#0F172A",
    outline: "none", transition: "all .2s ease",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", minHeight: "80vh", paddingTop: 20 }}>

      <div className="adm-page-hd" style={{ textAlign: "center", width: "100%", marginBottom: 32 }}>
        <h2>My Profile</h2>
        <p>Manage your account credentials</p>
      </div>

      {/* Avatar + name banner */}
      <div style={{
        width: "100%", maxWidth: 760,
        background: "linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%)",
        borderRadius: 16, padding: "32px 40px",
        display: "flex", alignItems: "center", gap: 24,
        marginBottom: 24, boxShadow: "0 6px 20px rgba(45,106,79,.2)",
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20, flexShrink: 0,
          background: "rgba(255,255,255,.2)", border: "2px solid rgba(255,255,255,.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2.2rem", fontWeight: 800, color: "#fff",
        }}>
          {user?.username?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-.02em" }}>
            {user?.username || "Admin"}
          </div>
          <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,.7)", marginTop: 4 }}>
            Administrator Account
          </div>
        </div>
      </div>

      {/* Flash message */}
      {msg.text && (
        <div style={{
          width: "100%", maxWidth: 760, marginBottom: 16,
          padding: "12px 18px", borderRadius: 12,
          fontSize: ".84rem", fontWeight: 600,
          animation: "fadeUp .2s ease both",
          background: msg.type === "ok" ? "#D1FAE5" : "#FEE2E2",
          color:      msg.type === "ok" ? "#10B981"  : "#EF4444",
          border:     `1px solid ${msg.type === "ok" ? "#86EFAC" : "#FECACA"}`,
        }}>
          {msg.type === "ok" ? "✓ " : "⚠ "}{msg.text}
        </div>
      )}

      {/* Two column cards */}
      <div style={{ width: "100%", maxWidth: 760, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Change Username */}
        <div style={{
          background: darkMode ? "#1E2A2A" : "#FFFFFF",
          borderRadius: 16, border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
          boxShadow: `0 2px 8px rgba(0,0,0,${darkMode ? "0.2" : "0.04"})`,
          padding: "28px 28px", animation: "fadeUp .35s ease both"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#F0FDF4", border: "1px solid #C8E6C9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>✏️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: ".92rem", color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>Change Username</div>
              <div style={{ fontSize: ".7rem", color: darkMode ? "#94A3B8" : "#5A7A6A" }}>Update your display name</div>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: ".7rem", fontWeight: 700, color: darkMode ? "#94A3B8" : "#5A7A6A", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>
              Current Username
            </label>
            <div style={{ padding: "11px 16px", background: darkMode ? "#2D3A3A" : "#F8FFF8", border: `1.5px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}`, borderRadius: 10, fontSize: ".88rem", color: darkMode ? "#6A7A6A" : "#94A3B8", fontWeight: 500 }}>
              {user?.username || "—"}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: ".7rem", fontWeight: 700, color: darkMode ? "#94A3B8" : "#5A7A6A", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>
              New Username
            </label>
            <input
              style={inputStyle}
              placeholder="Enter new username"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              onFocus={e => { e.target.style.borderColor = "#2D6A4F"; e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,.1)"; }}
              onBlur={e  => { e.target.style.borderColor = darkMode ? "#3D4A4A" : "#E8F0E8"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <button onClick={handleUsernameChange} style={{
            width: "100%", padding: "12px", border: "none", borderRadius: 10,
            background: "#2D6A4F", color: "#fff", fontFamily: "inherit",
            fontSize: ".86rem", fontWeight: 700, cursor: "pointer", transition: "all .2s ease",
          }}
            onMouseOver={e => { e.target.style.background = "#1B4D3E"; e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 12px rgba(45,106,79,.3)"; }}
            onMouseOut={e  => { e.target.style.background = "#2D6A4F"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >
            Update Username
          </button>
        </div>

        {/* Change Password */}
        <div style={{
          background: darkMode ? "#1E2A2A" : "#FFFFFF",
          borderRadius: 16, border: `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}`,
          boxShadow: `0 2px 8px rgba(0,0,0,${darkMode ? "0.2" : "0.04"})`,
          padding: "28px 28px", animation: "fadeUp .45s ease both"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#FFF7ED", border: "1px solid #FDBA74", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>🔒</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: ".92rem", color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>Change Password</div>
              <div style={{ fontSize: ".7rem", color: darkMode ? "#94A3B8" : "#5A7A6A" }}>Keep your account secure</div>
            </div>
          </div>

          {[
            { label: "Current Password",  val: oldPassword,     set: setOldPassword,     ph: "Enter current password"  },
            { label: "New Password",      val: newPassword,     set: setNewPassword,     ph: "Enter new password"      },
            { label: "Confirm Password",  val: confirmPassword, set: setConfirmPassword, ph: "Repeat new password"     },
          ].map(({ label, val, set, ph }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: ".7rem", fontWeight: 700, color: darkMode ? "#94A3B8" : "#5A7A6A", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>
                {label}
              </label>
              <input
                type="password" placeholder={ph} value={val}
                onChange={e => set(e.target.value)} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "#2D6A4F"; e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,.1)"; }}
                onBlur={e  => { e.target.style.borderColor = darkMode ? "#3D4A4A" : "#E8F0E8"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          ))}

          <button onClick={handlePasswordChange} style={{
            width: "100%", padding: "12px", border: "none", borderRadius: 10,
            background: "#2D6A4F", color: "#fff", fontFamily: "inherit",
            fontSize: ".86rem", fontWeight: 700, cursor: "pointer", transition: "all .2s ease",
          }}
            onMouseOver={e => { e.target.style.background = "#1B4D3E"; e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 12px rgba(45,106,79,.3)"; }}
            onMouseOut={e  => { e.target.style.background = "#2D6A4F"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >
            Update Password
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Main Admin ── */
function Admin({ user, darkMode, toggleDarkMode }) {
  useStyles(darkMode);

  const [activePage,      setActivePage]      = useState("dashboard");
  const [expandedSection, setExpandedSection] = useState(new Set(["leaderboard"]));  const [expandedStudent, setExpandedStudent] = useState(null);
  const [modules,         setModules]         = useState([]);
  const [scores,          setScores]          = useState([]);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      getModules().then(r => setModules(r.data)),
      getScores().then(r => setScores(r.data)),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const [editingId,       setEditingId]       = useState(null);
  const [editForm,        setEditForm]        = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [addingNew,       setAddingNew]       = useState(false);
  const [newModForm,      setNewModForm]      = useState({ name: "", category: "Natural Disasters", icon: "", chapters: "5" });
  const [modMsg,          setModMsg]          = useState("");

  const flash       = msg => { setModMsg(msg); setTimeout(() => setModMsg(""), 3000); };
const toggleSection = s => setExpandedSection(prev => {
  const next = new Set(prev);
  next.has(s) ? next.delete(s) : next.add(s);
  return next;
});
  const startEdit = mod => {
    setEditingId(mod._id);
    setEditForm({ name: mod.name, category: mod.category, icon: mod.icon || "", chapters: String(mod.chapters || 5) });
    setDeleteConfirmId(null);
  };

  const saveEdit = id => {
    updateModule(id, { name: editForm.name, category: editForm.category, icon: editForm.icon, chapters: Number(editForm.chapters) })
      .then(res => {
        setModules(ms => ms.map(m => m._id === id ? { ...m, ...res.data } : m));
        setEditingId(null);
        flash("Module updated.");
      })
      .catch(() => flash("Failed to update module."));
  };

  const deleteModule = id => {
    deleteModuleAPI(id)
      .then(() => {
        setModules(ms => ms.filter(m => m._id !== id));
        setDeleteConfirmId(null);
        flash("Module removed.");
      })
      .catch(() => flash("Failed to delete module."));
  };

  const toggleActive = id => {
    const mod = modules.find(m => m._id === id);
    updateModule(id, { active: !mod.active })
      .then(res => setModules(ms => ms.map(m => m._id === id ? { ...m, ...res.data } : m)))
      .catch(() => flash("Failed to update status."));
  };

  const moveUp   = idx => { if (idx === 0) return; const m = [...modules]; [m[idx-1],m[idx]]=[m[idx],m[idx-1]]; setModules(m); };
  const moveDown = idx => { if (idx === modules.length-1) return; const m = [...modules]; [m[idx],m[idx+1]]=[m[idx+1],m[idx]]; setModules(m); };

  const addNewModule = () => {
    if (!newModForm.name.trim()) return;
    addModule({ name: newModForm.name, category: newModForm.category, icon: newModForm.icon, chapters: Number(newModForm.chapters) })
      .then(res => {
        setModules(prev => [...prev, res.data]);
        setAddingNew(false);
        setNewModForm({ name: "", category: "Natural Disasters", icon: "", chapters: "5" });
        flash("Module added.");
      })
      .catch(() => flash("Failed to add module."));
  };

  /* derived data */
  const studentMap = {};
  scores.forEach(s => {
    if (!studentMap[s.username]) studentMap[s.username] = { name: s.username, drills: {}, totalScore: 0, count: 0 };
    studentMap[s.username].drills[s.module] = s.score;
    studentMap[s.username].totalScore += s.score;
    studentMap[s.username].count += 1;
  });

  const dynamicStudents = Object.values(studentMap)
    .map((s, i) => ({
      id: i + 1, name: s.name,
      avgScore: Math.round(s.totalScore / s.count),
      drills: s.drills,
      completedModules: Object.keys(s.drills).length,
      doneModules: Object.keys(s.drills),
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  const students      = dynamicStudents;
  const totalStudents = dynamicStudents.length;

  const drillLeaderboards = {};
  DRILL_META.forEach(({ key }) => {
    drillLeaderboards[key] = dynamicStudents
      .filter(s => s.drills[key] !== undefined)
      .sort((a, b) => b.drills[key] - a.drills[key]);
  });

  const moduleStats = modules.map(mod => {
    const key = mod.name.toLowerCase();
    const ms  = scores.filter(s => s.module?.toLowerCase() === key);
    const uniqueStudents = new Set(ms.map(s => s.username)).size;
    const avgScore = ms.length > 0 ? Math.round(ms.reduce((sum, s) => sum + s.score, 0) / ms.length) : 0;
    return { ...mod, studentCount: uniqueStudents, avgScore };
  });

  const overallAvgScore = scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length) : 0;
  const completionRate  = totalStudents > 0 ? Math.round(dynamicStudents.reduce((sum, s) => sum + s.completedModules / 5, 0) / totalStudents * 100) : 0;
  const activeModules   = modules.filter(m => m.active).length;

  const insights = students.map(s => {
    const entries = Object.entries(s.drills);
    if (!entries.length) return null;
    const best  = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    const worst = entries.reduce((a, b) => a[1] < b[1] ? a : b);
    return { name: s.name, bestDrill: best[0], bestScore: best[1], worstDrill: worst[0], worstScore: worst[1] };
  }).filter(Boolean);

  const sp = { expandedSection, toggleSection };

  const NAV = [
    { id: "dashboard", icon: <IconDashboard />, label: "Dashboard" },
    { id: "students",  icon: <IconStudents />,  label: "Students" },
    { id: "modules",   icon: <IconModules />,   label: "Manage Modules" },
    { id: "profile",   icon: <IconProfile />,   label: "My Profile" },
  ];

  /* render */
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className="adm-shell">

        {/* Sidebar */}
        <aside className="adm-sidebar">
          <div className="adm-sidebar-logo">Disaster<span>Prep</span></div>
          <div className="adm-nav-section">Menu</div>
          {NAV.map(item => (
            <button key={item.id} className={`adm-nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="adm-sidebar-bottom">
            <div style={{ fontSize: ".72rem", color: darkMode ? "#6A7A6A" : "#94A3B8", padding: "0 14px", marginBottom: 12 }}>
              Logged in as<br />
              <strong style={{ color: darkMode ? "#C8E6C9" : "#5A7A6A" }}>{user?.username || "Admin"}</strong>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="adm-main">

          {/* Header with Dark Mode Toggle */}

          {/* Profile Page */}
          {activePage === "profile" && <ProfilePanel user={user} darkMode={darkMode} />}

          {/* Dashboard Page */}
          {activePage === "dashboard" && (
            <>
              <div className="adm-page-hd">
                <h2>Admin Dashboard</h2>
                <p>Overview of student performance and module activity</p>
              </div>

              <div className="stat-strip">
                {[
                  { val: totalStudents,         label: "Students",       color: "#3B82F6" },
                  { val: activeModules,         label: "Active Modules", color: "#2D6A4F" },
                  { val: `${overallAvgScore}%`, label: "Avg Score",      color: "#D97706" },
                  { val: `${completionRate}%`,  label: "Completion",     color: "#8B5CF6" },
                ].map((s, i) => (
                  <div key={i} className="adm-stat" style={{ animationDelay: `${i * .07}s` }}>
                    <div className="adm-stat-val" style={{ color: s.color }}>{s.val}</div>
                    <div className="adm-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="adm-layout">

                {/* Leaderboard */}
                <div className="adm-card">
                  <SectionHeader id="leaderboard" title="Leaderboard" sub="Top performing students" {...sp} />
                  {expandedSection.has("leaderboard") && (
                    <div className="adm-card-body">
                      <div className="scroll-area" style={{ maxHeight: 360 }}>
                        {students.length === 0
                          ? <div className="empty-state"><div className="empty-icon">🏆</div>No student data yet.</div>
                          : students.map((s, i) => {
                              const col = scoreColor(s.avgScore);
                              return (
                                <div key={s.name} className="lb-row" style={{ animationDelay: `${i * .05}s` }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontFamily: "monospace", fontSize: ".65rem", fontWeight: 700, color: i < 3 ? "#D97706" : (darkMode ? "#6A7A6A" : "#ccc"), minWidth: 28 }}>
                                      {["1st","2nd","3rd"][i] || `#${i+1}`}
                                    </span>
                                    <div>
                                      <div style={{ fontWeight: 700, fontSize: ".86rem", color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>{s.name}</div>
                                      <div style={{ fontSize: ".67rem", color: darkMode ? "#6A7A6A" : "#a0a8a2", marginTop: 2 }}>{s.completedModules} drills done</div>
                                    </div>
                                  </div>
                                  <div style={{ minWidth: 80, textAlign: "right" }}>
                                    <div style={{ fontWeight: 800, fontSize: ".96rem", color: col }}>{s.avgScore}%</div>
                                    <div className="prog-track"><div className="prog-fill" style={{ width: `${s.avgScore}%`, background: col }} /></div>
                                  </div>
                                </div>
                              );
                            })
                        }
                      </div>
                    </div>
                  )}
                </div>

                {/* Smart Insights */}
                <div className="adm-card">
                  <SectionHeader id="insights" title="Smart Insights" sub="Performance observations per student" {...sp} />
                  {expandedSection.has("insights") && (
                    <div className="adm-card-body">
                      <div className="scroll-area" style={{ maxHeight: 360 }}>
                        {insights.length === 0
                          ? <div className="empty-state"><div className="empty-icon">💡</div>No insights yet.</div>
                          : insights.map((ins, i) => {
                              const bc = dc(ins.bestDrill);
                              const wc = dc(ins.worstDrill);
                              return (
                                <div key={i} className="insight-row" style={{ borderLeftColor: bc.accent, animationDelay: `${i * .04}s` }}>
                                  <span style={{ fontWeight: 700 }}>{ins.name}</span>
                                  <span style={{ color: darkMode ? "#6A7A6A" : "#6a7a6c" }}>{" — best in "}</span>
                                  <span style={{ color: bc.accent, fontWeight: 700, background: darkMode ? "#2D3A3A" : bc.bg, padding: "1px 7px", borderRadius: 99, fontSize: ".74rem", border: `1px solid ${bc.border}`, textTransform: "capitalize" }}>{ins.bestDrill}</span>
                                  <span style={{ color: darkMode ? "#6A7A6A" : "#6a7a6c" }}>{` ${ins.bestScore}%, needs work in `}</span>
                                  <span style={{ color: wc.accent, fontWeight: 700, background: darkMode ? "#2D3A3A" : wc.bg, padding: "1px 7px", borderRadius: 99, fontSize: ".74rem", border: `1px solid ${wc.border}`, textTransform: "capitalize" }}>{ins.worstDrill}</span>
                                  <span style={{ color: darkMode ? "#6A7A6A" : "#6a7a6c" }}>{` ${ins.worstScore}%`}</span>
                                </div>
                              );
                            })
                        }
                      </div>
                    </div>
                  )}
                </div>

                {/* Drill Comparison Chart */}
                <div className="adm-card col-full">
                  <SectionHeader id="drillchart" title="Student Drill Comparison" sub="Performance across all disaster drills" {...sp} />
                  {expandedSection.has("drillchart") && (
                    <div className="adm-card-body">
                      {students.length === 0
                        ? <div className="empty-state"><div className="empty-icon">📊</div>No drill data yet.</div>
                        : (
                          <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={students.map(s => ({ name: s.name, earthquake: s.drills.earthquake || 0, flood: s.drills.flood || 0, fire: s.drills.fire || 0, cyclone: s.drills.cyclone || 0, stampede: s.drills.stampede || 0 }))}>
                              <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "DM Sans", fill: darkMode ? "#C8E6C9" : "#1A3A2A" }} />
                              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: darkMode ? "#C8E6C9" : "#1A3A2A" }} />
                              <Tooltip contentStyle={{ borderRadius: 10, fontFamily: "DM Sans", fontSize: 12, backgroundColor: darkMode ? "#1E2A2A" : "#FFFFFF", borderColor: darkMode ? "#2D3A3A" : "#E8F0E8", color: darkMode ? "#C8E6C9" : "#1A3A2A" }} />
                              <Bar dataKey="earthquake" name="Earthquake" fill={DRILL_COLORS.earthquake.accent} radius={[4,4,0,0]} />
                              <Bar dataKey="flood"      name="Flood"      fill={DRILL_COLORS.flood.accent}      radius={[4,4,0,0]} />
                              <Bar dataKey="fire"       name="Fire"       fill={DRILL_COLORS.fire.accent}       radius={[4,4,0,0]} />
                              <Bar dataKey="cyclone"    name="Cyclone"    fill={DRILL_COLORS.cyclone.accent}    radius={[4,4,0,0]} />
                              <Bar dataKey="stampede"   name="Stampede"   fill={DRILL_COLORS.stampede.accent}   radius={[4,4,0,0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )
                      }
                    </div>
                  )}
                </div>

                {/* Drill Leaderboards */}
                <div className="adm-card col-full">
                  <SectionHeader id="drilllb" title="Drill Leaderboards" sub="Top performers per disaster type" {...sp} />
                  {expandedSection.has("drilllb") && (
                    <div className="adm-card-body">
                      <div className="drill-lb-grid">
                        {DRILL_META.map(({ key, label }) => {
                          const col = dc(key);
                          return (
                            <div key={key} className="drill-lb-card" style={{ background: darkMode ? "#1E2A2A" : col.bg, borderColor: col.border }}>
                              <div className="drill-lb-title" style={{ color: col.text }}>{label}</div>
                              {drillLeaderboards[key]?.length === 0
                                ? <p style={{ fontSize: ".7rem", color: darkMode ? "#6A7A6A" : "#ccc" }}>No attempts</p>
                                : drillLeaderboards[key]?.slice(0, 3).map((s, i) => (
                                    <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < 2 ? `1px solid ${col.border}` : "none", fontSize: ".79rem" }}>
                                      <span style={{ color: col.text, fontFamily: "monospace", fontSize: ".6rem", fontWeight: 700, marginRight: 5, opacity: .7 }}>{["1st","2nd","3rd"][i]}</span>
                                      <span style={{ flex: 1, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>{s.name}</span>
                                      <span style={{ fontWeight: 800, color: col.accent, marginLeft: 6 }}>{s.drills[key]}%</span>
                                    </div>
                                  ))
                              }
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Module Analytics */}
                <div className="adm-card">
                  <SectionHeader id="analytics" title="Module Analytics" sub="Performance metrics per module" {...sp} />
                  {expandedSection.has("analytics") && (
                    <div className="adm-card-body">
                      {loading
                        ? <div className="empty-state">Loading...</div>
                        : moduleStats.length === 0
                          ? <div className="empty-state"><div className="empty-icon">📚</div>No modules yet.</div>
                          : (
                            <>
                              <table className="adm-table" style={{ marginBottom: 22 }}>
                                <thead>
                                  <tr>
                                    <th>Module</th><th>Students</th><th>Avg Score</th><th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {moduleStats.map((m, i) => {
                                    const col = dc(m.name);
                                    const badgeBg = scoreBadge(m.avgScore || 0, darkMode);
                                    const badgeTxt = scoreTextColor(m.avgScore || 0);
                                    return (
                                      <tr key={m._id || i}>
                                        <td>
                                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.accent, flexShrink: 0 }} />
                                            <strong style={{ color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>{m.name}</strong>
                                          </div>
                                        </td>
                                        <td style={{ color: darkMode ? "#94A3B8" : "#6a7a6c" }}>{m.studentCount || 0}</td>
                                        <td>
                                          <span style={{ padding: "4px 10px", borderRadius: 99, fontSize: ".7rem", fontWeight: 700, background: badgeBg, color: badgeTxt }}>
                                            {m.avgScore || 0}%
                                          </span>
                                        </td>
                                        <td>
                                          <span style={{ fontSize: ".7rem", fontWeight: 700, color: m.active ? "#15803d" : "#b91c1c" }}>
                                            {m.active ? "Active" : "Inactive"}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>

                              <div className="sec-label" style={{ color: darkMode ? "#94A3B8" : "#5A7A6A" }}>Average Score by Module</div>
                              <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={moduleStats} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "DM Sans", fill: darkMode ? "#C8E6C9" : "#1A3A2A" }} />
                                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: darkMode ? "#C8E6C9" : "#1A3A2A" }} />
                                  <Tooltip contentStyle={{ borderRadius: 10, fontFamily: "DM Sans", fontSize: 12, backgroundColor: darkMode ? "#1E2A2A" : "#FFFFFF", borderColor: darkMode ? "#2D3A3A" : "#E8F0E8" }} formatter={v => `${v}%`} />
                                  <Bar dataKey="avgScore" minPointSize={5} radius={[5,5,0,0]}>
                                    {moduleStats.map((m, i) => <Cell key={i} fill={dc(m.name).accent} />)}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </>
                          )
                      }
                    </div>
                  )}
                </div>

                {/* Enrollment Distribution */}
                <div className="adm-card">
                  <SectionHeader id="enrollment" title="Enrollment Distribution" sub="Students per module" {...sp} />
                  {expandedSection.has("enrollment") && (
                    <div className="adm-card-body">
                      {loading
                        ? <div className="empty-state">Loading...</div>
                        : moduleStats.filter(m => m.studentCount > 0).length === 0
                          ? <div className="empty-state"><div className="empty-icon">🥧</div>No enrollment data yet.</div>
                          : (
                            <ResponsiveContainer width="100%" height={280}>
                              <PieChart>
                                <Pie
                                  data={moduleStats.filter(m => m.studentCount > 0)}
                                  dataKey="studentCount"
                                  nameKey="name"
                                  cx="50%" cy="50%" outerRadius={100}
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                  {moduleStats.filter(m => m.studentCount > 0).map((m, i) => (
                                    <Cell key={i} fill={dc(m.name).accent} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 10, fontFamily: "DM Sans", fontSize: 12, backgroundColor: darkMode ? "#1E2A2A" : "#FFFFFF", borderColor: darkMode ? "#2D3A3A" : "#E8F0E8" }} formatter={v => `${v} students`} />
                                <Legend wrapperStyle={{ fontFamily: "DM Sans", fontSize: 12, color: darkMode ? "#C8E6C9" : "#1A3A2A" }} />
                              </PieChart>
                            </ResponsiveContainer>
                          )
                      }
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

          {/* Students Page */}
          {activePage === "students" && (
            <>
              <div className="adm-page-hd">
                <h2>Student Management</h2>
                <p>View drill history and module progress per student</p>
              </div>

              {students.length === 0 ? (
                <div className="adm-card">
                  <div className="adm-card-body">
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      No students have logged any scores yet.
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {students.map((s, idx) => {
                    const isOpen   = expandedStudent === s.id;
                    const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                    const drillsDone = Object.values(s.drills).filter(v => v !== null).length;

                    return (
                      <div key={s.id} className="adm-card" style={{ overflow: "visible" }}>
                        {/* Student header row */}
                        <div
                          onClick={() => setExpandedStudent(isOpen ? null : s.id)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "18px 24px", cursor: "pointer",
                            borderBottom: isOpen ? `1px solid ${darkMode ? "#2D3A3A" : "#E8F0E8"}` : "none",
                            background: isOpen ? (darkMode ? "#2D3A3A" : "#F8FFF8") : (darkMode ? "#1E2A2A" : "#FFFFFF"),
                            borderRadius: isOpen ? "16px 16px 0 0" : 16,
                            transition: "all .2s ease",
                          }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {/* Avatar */}
                            <div style={{
                              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                              background: `linear-gradient(135deg, ${avatarBg}, ${avatarBg}cc)`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "1.2rem", fontWeight: 800, color: "#fff",
                              boxShadow: `0 4px 10px ${avatarBg}44`,
                            }}>
                              {s.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Name + meta */}
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "1rem", color: darkMode ? "#C8E6C9" : "#1A3A2A" }}>{s.name}</div>
                              <div style={{ fontSize: ".74rem", color: darkMode ? "#94A3B8" : "#5A7A6A", marginTop: 3, display: "flex", gap: 12 }}>
                                <span>🎯 {drillsDone}/5 drills attempted</span>
                                <span>📊 Avg score: <strong style={{ color: scoreColor(s.avgScore) }}>{s.avgScore}%</strong></span>
                              </div>
                            </div>
                          </div>

                          {/* Right side — score badge + chevron */}
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {/* Mini drill score pills */}
                            <div style={{ display: "flex", gap: 6 }}>
                              {DRILL_META.map(d => {
                                const sc  = s.drills[d.key];
                                const col = dc(d.key);
                                return (
                                  <div key={d.key} title={`${d.label}: ${sc != null ? sc + "%" : "Not attempted"}`}
                                    style={{
                                      width: 32, height: 32, borderRadius: 8,
                                      background: sc != null ? col.bg : (darkMode ? "#2D3A3A" : "#F1F5F9"),
                                      border: `1.5px solid ${sc != null ? col.border : (darkMode ? "#3D4A4A" : "#E2E8F0")}`,
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                      fontSize: ".65rem", fontWeight: 800,
                                      color: sc != null ? col.accent : (darkMode ? "#6A7A6A" : "#CBD5E1"),
                                    }}>
                                    {sc != null ? sc : "—"}
                                  </div>
                                );
                              })}
                            </div>
                            <span style={{ padding: "4px 10px", borderRadius: 99, fontSize: ".7rem", fontWeight: 700, background: scoreBadge(s.avgScore, darkMode), color: scoreTextColor(s.avgScore) }}>{s.avgScore}%</span>
                            <span style={{ fontSize: ".7rem", color: "#2D6A4F", transition: "transform .2s ease", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                              <IconChevronDown />
                            </span>
                          </div>
                        </div>

                        {/* Expanded detail panel */}
                        {isOpen && (
                          <div style={{ padding: "24px", animation: "fadeDown .2s ease both" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                              {/* Drill performance */}
                              <div>
                                <div className="sec-label" style={{ marginBottom: 14, color: darkMode ? "#94A3B8" : "#5A7A6A" }}>Drill Performance</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                  {DRILL_META.map(d => {
                                    const sc  = s.drills[d.key];
                                    const col = dc(d.key);
                                    return (
                                      <div key={d.key} style={{
                                        display: "flex", alignItems: "center", gap: 12,
                                        padding: "10px 14px", borderRadius: 10,
                                        background: sc != null ? (darkMode ? "#2D3A3A" : col.bg) : (darkMode ? "#1E2A2A" : "#F8FAFC"),
                                        border: `1px solid ${sc != null ? col.border : (darkMode ? "#3D4A4A" : "#E2E8F0")}`,
                                      }}>
                                        <div style={{
                                          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                                          background: sc != null ? col.accent : (darkMode ? "#3D4A4A" : "#E2E8F0"),
                                          display: "flex", alignItems: "center", justifyContent: "center",
                                          fontSize: ".7rem", fontWeight: 800, color: "#fff",
                                        }}>
                                          {sc != null ? `${sc}%` : "—"}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                          <div style={{ fontWeight: 700, fontSize: ".84rem", color: sc != null ? col.text : (darkMode ? "#6A7A6A" : "#94A3B8") }}>{d.label}</div>
                                          {sc != null && (
                                            <>
                                              <div style={{ height: 4, background: darkMode ? "#3D4A4A" : "#E2E8F0", borderRadius: 99, marginTop: 5, overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${sc}%`, background: col.accent, borderRadius: 99, transition: "width .6s ease" }} />
                                              </div>
                                              <div style={{ fontSize: ".62rem", color: col.accent, marginTop: 3, fontWeight: 600 }}>
                                                {sc >= 90 ? "Expert" : sc >= 75 ? "Proficient" : sc >= 60 ? "Learner" : "Needs Practice"}
                                              </div>
                                            </>
                                          )}
                                          {sc == null && <div style={{ fontSize: ".7rem", color: darkMode ? "#6A7A6A" : "#CBD5E1", marginTop: 2 }}>Not attempted</div>}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Module completion + stats */}
                              <div>
                                <div className="sec-label" style={{ marginBottom: 14, color: darkMode ? "#94A3B8" : "#5A7A6A" }}>Module Completion</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                                  {ALL_MODULE_NAMES.map(mn => {
                                    const done = s.doneModules.map(d => d.toLowerCase()).includes(mn.toLowerCase());
                                    const col  = dc(mn);
                                    return (
                                      <div key={mn} style={{
                                        display: "flex", alignItems: "center", gap: 10,
                                        padding: "8px 14px", borderRadius: 10,
                                        background: done ? (darkMode ? "#2D3A3A" : col.bg) : (darkMode ? "#1E2A2A" : "#F8FAFC"),
                                        border: `1px solid ${done ? col.border : (darkMode ? "#3D4A4A" : "#E2E8F0")}`,
                                      }}>
                                        <span style={{ fontSize: "1rem" }}>{done ? "✅" : "⬜"}</span>
                                        <span style={{ fontWeight: 600, fontSize: ".84rem", color: done ? col.accent : (darkMode ? "#6A7A6A" : "#94A3B8") }}>{mn}</span>
                                        {done && <span style={{ marginLeft: "auto", fontSize: ".68rem", fontWeight: 700, color: col.accent, background: darkMode ? "#1E2A2A" : "#fff", padding: "2px 8px", borderRadius: 99, border: `1px solid ${col.border}` }}>Completed</span>}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Summary stats */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                  {[
                                    { label: "Drills Done",   val: `${drillsDone}/5`,    color: "#2D6A4F" },
                                    { label: "Avg Score",     val: `${s.avgScore}%`,     color: scoreColor(s.avgScore) },
                                    { label: "Best Drill",    val: Object.entries(s.drills).length ? Object.entries(s.drills).reduce((a,b) => a[1]>b[1]?a:b)[0] : "—", color: "#8B5CF6" },
                                    { label: "Lowest Score",  val: Object.entries(s.drills).length ? `${Object.entries(s.drills).reduce((a,b) => a[1]<b[1]?a:b)[1]}%` : "—", color: "#EF4444" },
                                  ].map((stat, i) => (
                                    <div key={i} style={{ background: darkMode ? "#2D3A3A" : "#F8FFF8", border: `1px solid ${darkMode ? "#3D4A4A" : "#E8F0E8"}`, borderRadius: 10, padding: "10px 12px" }}>
                                      <div style={{ fontSize: ".62rem", fontWeight: 700, color: darkMode ? "#94A3B8" : "#94A3B8", textTransform: "uppercase", letterSpacing: ".06em" }}>{stat.label}</div>
                                      <div style={{ fontSize: "1rem", fontWeight: 800, color: stat.color, marginTop: 4, textTransform: "capitalize" }}>{stat.val}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Modules Page */}
          {activePage === "modules" && (
            <>
              <div className="adm-page-hd">
                <h2>Manage Modules</h2>
                <p>Add, edit, reorder, activate or remove modules</p>
              </div>
              <div className="adm-card">
                <div className="adm-card-body">
                  {modMsg && <div className={`adm-flash ${modMsg.startsWith("Failed") ? "flash-err" : "flash-ok"}`}>{modMsg}</div>}

                  <button className="adm-btn btn-pri" style={{ width: "100%", marginBottom: 14 }}
                    onClick={() => { setAddingNew(true); setEditingId(null); setDeleteConfirmId(null); }}>
                    + Add New Module
                  </button>

                  {addingNew && (
                    <div className="new-mod-box">
                      <div className="new-mod-title">New Module</div>
                      <div className="form-2col">
                        <div className="adm-field">
                          <label>Module Name</label>
                          <input placeholder="e.g. Tsunami Safety" value={newModForm.name}
                            onChange={e => setNewModForm({ ...newModForm, name: e.target.value })} />
                        </div>
                        <div className="adm-field">
                          <label>Category</label>
                          <select value={newModForm.category} onChange={e => setNewModForm({ ...newModForm, category: e.target.value })}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="adm-field">
                          <label>Icon</label>
                          <input placeholder="🌊" value={newModForm.icon}
                            onChange={e => setNewModForm({ ...newModForm, icon: e.target.value })} />
                        </div>
                        <div className="adm-field">
                          <label>Chapters</label>
                          <input type="number" min="1" value={newModForm.chapters}
                            onChange={e => setNewModForm({ ...newModForm, chapters: e.target.value })} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="adm-btn btn-pri" onClick={addNewModule}>Save</button>
                        <button className="adm-btn btn-sec" onClick={() => setAddingNew(false)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {loading
                    ? <div className="empty-state">Loading modules...</div>
                    : modules.length === 0
                      ? <div className="empty-state"><div className="empty-icon">📚</div>No modules yet. Add one above.</div>
                      : (
                        <div className="inner-2col">
                          {modules.map((mod, idx) => (
                            <ModuleRow
                              key={mod._id} mod={mod} idx={idx}
                              isEditing={editingId === mod._id}
                              isDeleting={deleteConfirmId === mod._id}
                              onMoveUp={() => moveUp(idx)}
                              onMoveDown={() => moveDown(idx)}
                              onEdit={() => editingId === mod._id ? setEditingId(null) : startEdit(mod)}
                              onDelete={() => setDeleteConfirmId(deleteConfirmId === mod._id ? null : mod._id)}
                              onToggle={() => toggleActive(mod._id)}
                              darkMode={darkMode}
                            >
                              {editingId === mod._id && (
                                <div className="inline-panel ipanel-g">
                                  <div style={{ fontSize: ".76rem", fontWeight: 700, color: "#2D6A4F", marginBottom: 10 }}>Editing: {mod.name}</div>
                                  <div className="form-2col">
                                    <div className="adm-field"><label>Name</label>
                                      <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
                                    <div className="adm-field"><label>Category</label>
                                      <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                      </select></div>
                                    <div className="adm-field"><label>Icon</label>
                                      <input value={editForm.icon} onChange={e => setEditForm({ ...editForm, icon: e.target.value })} /></div>
                                    <div className="adm-field"><label>Chapters</label>
                                      <input type="number" min="1" value={editForm.chapters}
                                        onChange={e => setEditForm({ ...editForm, chapters: e.target.value })} /></div>
                                  </div>
                                  <div style={{ display: "flex", gap: 8 }}>
                                    <button className="adm-btn btn-pri" onClick={() => saveEdit(mod._id)}>Save Changes</button>
                                    <button className="adm-btn btn-sec" onClick={() => setEditingId(null)}>Cancel</button>
                                  </div>
                                </div>
                              )}
                              {deleteConfirmId === mod._id && (
                                <div className="inline-panel ipanel-r" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                                  <span style={{ fontSize: ".77rem", color: "#EF4444", fontWeight: 500 }}>Delete "{mod.name}"? Cannot be undone.</span>
                                  <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                                    <button className="adm-btn btn-danger" style={{ background: "#b91c1c", color: "#fff" }}
                                      onClick={() => deleteModule(mod._id)}>Confirm</button>
                                    <button className="adm-btn btn-sec" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
                                  </div>
                                </div>
                              )}
                            </ModuleRow>
                          ))}
                        </div>
                      )
                  }
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </ThemeContext.Provider>
  );
}

export default Admin;
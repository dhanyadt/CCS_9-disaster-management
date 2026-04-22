import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saveScore } from "../services/api";

const DRILL_COLORS = {
  earthquake: { bg: "#FEF3C7", border: "#FCD34D", accent: "#D97706", text: "#92400E", hover: "#FFFBEB" },
  flood:      { bg: "#E0F2FE", border: "#7DD3FC", accent: "#0284C7", text: "#075985", hover: "#F0F9FF" },
  fire:       { bg: "#FFEDD5", border: "#FDBA74", accent: "#EA580C", text: "#9A3412", hover: "#FFF7ED" },
  cyclone:    { bg: "#EFF6FF", border: "#BFDBFE", accent: "#3B82F6", text: "#1E3A8A", hover: "#EFF6FF" },
  stampede:   { bg: "#FEF9C3", border: "#FDE047", accent: "#CA8A04", text: "#854D0E", hover: "#FEFCE8" },
};

function dc(key) {
  return DRILL_COLORS[key?.toLowerCase()] || {
    bg: "#F1F5F9", border: "#E2E8F0", accent: "#2D6A4F",
    text: "#0F172A", hover: "#F8FAFC"
  };
}

// ── Professional SVG icons replacing emojis ──
const ICONS = {
  school: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  search: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  warning: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  firstaid: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  backpack: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20a2 2 0 002-2V8a2 2 0 00-2-2h-2.5"/><path d="M4 20a2 2 0 01-2-2V8a2 2 0 012-2h2.5"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M2 13h20"/><path d="M10 13v3"/><path d="M14 13v3"/>
    </svg>
  ),
  building: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M16 11h.01"/>
    </svg>
  ),
  brokenhouse: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 14l2 2 4-4"/>
    </svg>
  ),
  car: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    </svg>
  ),
  waves: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/>
    </svg>
  ),
  zap: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  phone: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  radio: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
    </svg>
  ),
  home: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  lifebuoy: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
    </svg>
  ),
  food: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  mountain: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 20 15 4 21 14 17 14 21 20"/><polyline points="3 20 9 10 13 16"/>
    </svg>
  ),
  sos: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
    </svg>
  ),
  plug: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8H6a2 2 0 00-2 2v3a2 2 0 002 2h12a2 2 0 002-2v-3a2 2 0 00-2-2z"/>
    </svg>
  ),
  water: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
    </svg>
  ),
  bell: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  wind: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1013 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/>
    </svg>
  ),
  run: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13" cy="4" r="2"/><path d="M5 20l4-4 2.5 3 3.5-9 4 5"/><path d="M9.5 8.5c1 1 2 2.5 3 3s3.5 1 3.5 1"/>
    </svg>
  ),
  extinguisher: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6.5V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2.5"/><path d="M9 6.5h6"/><rect x="7" y="8" width="10" height="13" rx="2"/><path d="M12 11v5"/><line x1="7" y1="11" x2="17" y2="11"/>
    </svg>
  ),
  door: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4H3v18h18V8z"/><path d="M13 4v4h4"/><circle cx="15" cy="13" r="1"/>
    </svg>
  ),
  flame: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
    </svg>
  ),
  stairs: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20h4v-4h4v-4h4v-4h4V4"/><path d="M3 20V8"/>
    </svg>
  ),
  pan: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 11h.01"/><path d="M11 15H6a4 4 0 010-8h8a4 4 0 014 4"/><path d="M16.5 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"/>
    </svg>
  ),
  child: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/><path d="M12 7v7"/><path d="M9 10l3 2 3-2"/><path d="M9 21v-4l3-2 3 2v4"/>
    </svg>
  ),
  hotel: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V8a5 5 0 015-5h8a5 5 0 015 5v14"/><path d="M3 22h18"/><path d="M9 22V11"/><path d="M15 22V11"/><path d="M9 7h6"/>
    </svg>
  ),
  callphone: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.8 19.79 19.79 0 01.0 .18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
    </svg>
  ),
  cyclone: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1010 10"/><path d="M12 12a4 4 0 100-8 4 4 0 000 8z"/><path d="M12 12a2 2 0 110-4 2 2 0 010 4z"/>
    </svg>
  ),
  silence: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  ),
  secure: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  window: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="2" y1="12" x2="22" y2="12"/>
    </svg>
  ),
  announce: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
    </svg>
  ),
  gas: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-5 0v-15A2.5 2.5 0 019.5 2z"/><path d="M14.5 2A2.5 2.5 0 0117 4.5v15a2.5 2.5 0 01-5 0v-15A2.5 2.5 0 0114.5 2z"/>
    </svg>
  ),
  surge: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h4l3-9 4 18 3-9h6"/>
    </svg>
  ),
  crowd: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  breathe: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  fall: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/><path d="M12 7l-3 5h6l-3 5"/><path d="M8 21h8"/>
    </svg>
  ),
  exit: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  stadium: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="11" rx="10" ry="5"/><path d="M2 11v5a10 5 0 0020 0v-5"/>
    </svg>
  ),
  pressure: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>
    </svg>
  ),
  witness: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  medical: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/>
    </svg>
  ),
  lift: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><path d="M8 15l4-4 4 4"/><path d="M9 21h6"/>
    </svg>
  ),
  music: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  boat: (color) => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20a2.4 2.4 0 002 1 2.4 2.4 0 002-1 2.4 2.4 0 012-1 2.4 2.4 0 012 1 2.4 2.4 0 002 1 2.4 2.4 0 002-1 2.4 2.4 0 012-1 2.4 2.4 0 012 1"/><path d="M4 9l8-7 8 7"/><path d="M12 2v17"/>
    </svg>
  ),
};

// Map each scenario image key to an icon function
const SCENARIO_ICON_MAP = {
  // Earthquake
  "🏫": ICONS.school,
  "🔍": ICONS.search,
  "⚠️": ICONS.warning,
  "🩹": ICONS.firstaid,
  "🎒": ICONS.backpack,
  "🏢": ICONS.building,
  "🏚️": ICONS.brokenhouse,
  "🚗": ICONS.car,
  "🌍": ICONS.waves,
  "🌊": ICONS.waves,
  "⚡": ICONS.zap,
  "📱": ICONS.phone,
  // Flood
  "📻": ICONS.radio,
  "🏠": ICONS.home,
  "🚘": ICONS.car,
  "⛵": ICONS.boat,
  "🥫": ICONS.food,
  "🏔️": ICONS.mountain,
  "🆘": ICONS.sos,
  "🔌": ICONS.plug,
  "💧": ICONS.water,
  // Fire
  "🚨": ICONS.bell,
  "💨": ICONS.wind,
  "🏃": ICONS.run,
  "🧯": ICONS.extinguisher,
  "🚪": ICONS.door,
  "🔥": ICONS.flame,
  "🪜": ICONS.stairs,
  "🍳": ICONS.pan,
  "👶": ICONS.child,
  "🏨": ICONS.hotel,
  "📞": ICONS.callphone,
  // Cyclone
  "🌀": ICONS.cyclone,
  "😶": ICONS.silence,
  "🏡": ICONS.secure,
  "📢": ICONS.announce,
  "🪟": ICONS.window,
  "💨": ICONS.gas,
  // Stampede
  "🎪": ICONS.crowd,
  "😰": ICONS.breathe,
  "🚨": ICONS.warning,
  "🛟": ICONS.lifebuoy,
  "🎵": ICONS.music,
  "🏟️": ICONS.stadium,
  "📞": ICONS.callphone,
  "🏥": ICONS.medical,
  "👶": ICONS.lift,
};

function ScenarioIcon({ image, color }) {
  const iconFn = SCENARIO_ICON_MAP[image];
  if (iconFn) {
    return (
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: color + "18",
        border: `1.5px solid ${color}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px",
      }}>
        {iconFn(color)}
      </div>
    );
  }
  // fallback
  return <span style={{ fontSize: "3.5rem", display: "block", marginBottom: 20 }}>{image}</span>;
}

const DRILL_DATA = {
  earthquake: {
    title: "Earthquake", color: "#D97706",
    steps: [
      { id:1,  situation: "You are sitting at your desk at school when the floor begins shaking violently. Books fall off shelves.",                                              image: "🏫", choices: [{ text: "Run to the nearest exit immediately", correct: false, feedback: "Running during shaking is dangerous — you may fall or be struck by falling objects." },{ text: "Drop, Cover under your desk, and Hold On", correct: true, feedback: "Correct! DROP to your knees, take COVER under sturdy furniture, HOLD ON until shaking stops." },{ text: "Stand in the doorway", correct: false, feedback: "Outdated myth — doorways are no safer than any other spot in a modern building." },{ text: "Run outside into the open", correct: false, feedback: "Never run outside during shaking — falling debris is a major hazard." }]},
      { id:2,  situation: "Shaking has stopped. You are under your desk. What do you do next?",                                                                                  image: "🔍", choices: [{ text: "Jump up and run outside immediately", correct: false, feedback: "Check for hazards first. Aftershocks can occur any time." },{ text: "Check yourself and others for injuries, then look for exit hazards", correct: true, feedback: "Correct! Check injuries and look for broken glass and debris before moving." },{ text: "Call friends to tell them what happened", correct: false, feedback: "Keep lines free for emergency services only." },{ text: "Ignore everything and continue what you were doing", correct: false, feedback: "Always assess the situation — structural damage may not be visible." }]},
      { id:3,  situation: "While evacuating you smell gas strongly in the corridor. What do you do?",                                                                             image: "⚠️", choices: [{ text: "Turn on the lights to see better", correct: false, feedback: "Never use electrical switches near a gas leak — sparks can ignite gas." },{ text: "Open windows, leave immediately, call emergency services from outside", correct: true, feedback: "Correct! Ventilate briefly if quick, evacuate, and report from a safe distance." },{ text: "Light a match to locate the leak", correct: false, feedback: "An open flame near gas is catastrophic — never do this." },{ text: "Wait inside for firefighters to arrive", correct: false, feedback: "Evacuate immediately — gas can ignite or cause asphyxiation." }]},
      { id:4,  situation: "A classmate has a deep cut on their arm from broken glass. No adults are nearby.",                                                                     image: "🩹", choices: [{ text: "Ignore it and wait for an adult", correct: false, feedback: "Uncontrolled bleeding is life-threatening. Act immediately." },{ text: "Apply firm pressure with a clean cloth and keep it elevated", correct: true, feedback: "Correct! Direct pressure and elevation are the first-line treatment for bleeding." },{ text: "Remove the glass pieces first", correct: false, feedback: "Never remove embedded objects — it worsens bleeding." },{ text: "Pour water vigorously over the wound", correct: false, feedback: "Gentle rinsing may help, but firm pressure is the priority." }]},
      { id:5,  situation: "Your family's emergency kit is damaged. Which item is MOST critical to replace first?",                                                                image: "🎒", choices: [{ text: "Flashlight", correct: false, feedback: "Important, but phone flashlights can serve as backup." },{ text: "Water — at least 1 litre per person per day", correct: true, feedback: "Correct! Water is the most critical survival need — humans survive only 3 days without it." },{ text: "Extra clothing", correct: false, feedback: "Important for comfort, but water comes first." },{ text: "Battery-powered radio", correct: false, feedback: "Useful for information, but water is the immediate priority." }]},
      { id:6,  situation: "You are in a multi-storey building when an earthquake starts. You cannot get under a desk. What is your best option?",                                 image: "🏢", choices: [{ text: "Take the elevator to the ground floor immediately", correct: false, feedback: "Never use elevators during an earthquake — they may fail and trap you." },{ text: "Crouch against an interior wall, covering your head", correct: true, feedback: "Correct! If no desk is available, an interior wall away from windows offers the best protection." },{ text: "Lean against an exterior wall with windows", correct: false, feedback: "Exterior walls and windows are the most dangerous spots — glass shatters and walls may collapse." },{ text: "Run to the stairwell immediately", correct: false, feedback: "Do not move during shaking — you are likely to fall and be injured." }]},
      { id:7,  situation: "After the earthquake, you see a crack running across your ceiling. The building is still standing. What do you do?",                                   image: "🏚️", choices: [{ text: "Stay inside — a crack is not dangerous", correct: false, feedback: "Structural cracks can indicate serious damage. The building may be unsafe." },{ text: "Evacuate carefully and do not re-enter until inspected", correct: true, feedback: "Correct! Even a standing building may be structurally compromised. Wait for official inspection." },{ text: "Try to seal the crack yourself", correct: false, feedback: "This does not address underlying structural damage and wastes critical evacuation time." },{ text: "Go to an upper floor to avoid falling debris", correct: false, feedback: "Moving up in a structurally compromised building increases your risk." }]},
      { id:8,  situation: "You are driving when an earthquake strikes. What should you do?",                                                                                      image: "🚗", choices: [{ text: "Speed up to escape the shaking area", correct: false, feedback: "You cannot outrun an earthquake — this is dangerous and pointless." },{ text: "Pull over away from buildings, trees, and power lines, and stay in the car", correct: true, feedback: "Correct! Stop safely in an open area and stay in the vehicle with your seatbelt on." },{ text: "Stop on a bridge for stability", correct: false, feedback: "Bridges are among the most dangerous places during an earthquake." },{ text: "Keep driving — moving is safer", correct: false, feedback: "Pull over immediately. Driving on damaged roads is extremely dangerous." }]},
      { id:9,  situation: "Several hours after the earthquake, you feel another strong shake. What is this?",                                                                     image: "🌍", choices: [{ text: "The main quake has returned", correct: false, feedback: "Earthquakes do not return — this is a separate event." },{ text: "An aftershock — drop, cover, and hold on again", correct: true, feedback: "Correct! Aftershocks are common after a major quake. Apply the same Drop, Cover, Hold On response." },{ text: "Normal ground settling — nothing to worry about", correct: false, feedback: "Aftershocks can be as dangerous as the original quake. Never ignore them." },{ text: "A different natural disaster starting", correct: false, feedback: "This is most likely an aftershock. Respond with Drop, Cover, Hold On." }]},
      { id:10, situation: "You are near the coast when a major earthquake hits. What is an important additional hazard to be aware of?",                                          image: "🌊", choices: [{ text: "Increased rainfall", correct: false, feedback: "Earthquakes do not directly cause rain." },{ text: "Tsunami — move immediately to high ground inland", correct: true, feedback: "Correct! Coastal earthquakes can trigger tsunamis. Move to high ground immediately without waiting for a warning." },{ text: "Volcanic eruption", correct: false, feedback: "While related, a volcanic eruption is not an immediate consequence of every coastal earthquake." },{ text: "Sinkholes in the middle of cities", correct: false, feedback: "Liquefaction can occur, but tsunami is the primary coastal hazard." }]},
      { id:11, situation: "Power lines are down across the road after the earthquake. You need to get past. What do you do?",                                                     image: "⚡", choices: [{ text: "Drive over the lines quickly", correct: false, feedback: "Driving over live power lines can electrify your vehicle." },{ text: "Move the lines aside with a wooden branch", correct: false, feedback: "Even non-metallic materials can conduct electricity near live wires." },{ text: "Stay back at least 10 metres and find an alternate route", correct: true, feedback: "Correct! Treat all downed lines as live. Keep distance and find another way." },{ text: "Check if the lines are sparking before deciding", correct: false, feedback: "A wire does not need to spark to be live and lethal." }]},
      { id:12, situation: "You are trapped under debris after the earthquake. You have your phone but no signal. What should you do?",                                             image: "📱", choices: [{ text: "Scream continuously until rescued", correct: false, feedback: "Screaming wastes energy and you may inhale dust. Only call out when you hear rescuers." },{ text: "Try to move heavy debris immediately to free yourself", correct: false, feedback: "Moving debris can cause further collapse. Stay as still as possible." },{ text: "Tap on pipes or walls and conserve energy", correct: true, feedback: "Correct! Tapping creates sound that rescuers can detect. Conserve energy and stay calm." },{ text: "Use your phone torch continuously to signal rescuers", correct: false, feedback: "Conserve battery. Use the torch only when you hear people nearby." }]},
    ]
  },
  flood: {
    title: "Flood", color: "#0284C7",
    steps: [
      { id:1,  situation: "Authorities issue a Flood Watch for your area after 2 days of heavy rain. What should you do?",                                                        image: "📻", choices: [{ text: "Continue daily activities — it's just a watch", correct: false, feedback: "A watch means conditions favor flooding. Begin preparations immediately." },{ text: "Prepare your emergency kit and know your evacuation route", correct: true, feedback: "Correct! A watch means be ready. Pack supplies and review evacuation routes now." },{ text: "Drive to higher ground immediately", correct: false, feedback: "A WATCH means prepare — evacuate only when a WARNING is issued." },{ text: "Sandbag your entire house alone", correct: false, feedback: "Sandbags help, but preparation and monitoring come first." }]},
      { id:2,  situation: "Floodwaters are entering your street. There is 30 cm of moving water between you and your car.",                                                       image: "🚗", choices: [{ text: "Wade through the water to your car", correct: false, feedback: "Just 15 cm of moving water can knock an adult down. 30 cm can carry away a car." },{ text: "Stay inside on upper floors and wait for rescue", correct: true, feedback: "Correct! Move to upper floors and call for rescue. Do not enter the water." },{ text: "Drive through the water as quickly as possible", correct: false, feedback: "60 cm of water can float most vehicles. Never drive into floodwater." },{ text: "Swim across to safety", correct: false, feedback: "Floodwater contains debris, chemicals, and strong currents. Never swim in it." }]},
      { id:3,  situation: "Floodwaters have receded. You want to return home. What is your first check?",                                                                         image: "🏠", choices: [{ text: "Whether your belongings are damaged", correct: false, feedback: "Belongings matter, but structural safety comes first." },{ text: "Turn electricity back on to check appliances", correct: false, feedback: "Never turn on electricity in a flood-damaged building before a qualified inspection." },{ text: "Official clearance that the area is safe to return", correct: true, feedback: "Correct! Wait for the official all-clear. Floodwater leaves structural damage, contamination, and live wires." },{ text: "Whether your neighbours have returned", correct: false, feedback: "Neighbours returning does not mean it is safe. Wait for official clearance." }]},
      { id:4,  situation: "You are in a car when floodwaters rapidly rise around you. The car begins to float. What do you do?",                                                  image: "🚘", choices: [{ text: "Stay in the car and wait for the water to recede", correct: false, feedback: "The car may be swept away or submerged. You must escape." },{ text: "Wait for pressure to equalise then open the door and escape", correct: true, feedback: "Correct! Once water equalises pressure, open the door and swim to safety immediately." },{ text: "Call emergency services and wait inside", correct: false, feedback: "By the time help arrives the car may have sunk. Act immediately." },{ text: "Try to drive to higher ground", correct: false, feedback: "A floating car cannot be steered reliably. Escape immediately." }]},
      { id:5,  situation: "You are being evacuated by boat. The rescue worker tells you to leave behind your emergency bag. What do you do?",                                     image: "⛵", choices: [{ text: "Insist on taking the bag — it has critical supplies", correct: false, feedback: "Follow rescuer instructions. Overloading a rescue boat can endanger everyone." },{ text: "Follow the rescuer's instruction and leave the bag", correct: true, feedback: "Correct! Rescue workers are trained professionals. Follow their instructions without argument." },{ text: "Jump into the water to retrieve it later", correct: false, feedback: "Never enter floodwater voluntarily. Your life is more valuable than the bag." },{ text: "Argue for a few minutes then comply", correct: false, feedback: "In rescues, seconds matter. Comply immediately with rescue instructions." }]},
      { id:6,  situation: "You need to walk through a flooded area. The water appears calm and is about knee height. Is it safe?",                                                image: "🌊", choices: [{ text: "Yes — knee-height water is manageable", correct: false, feedback: "Calm-looking water can hide strong currents, open drains, and debris." },{ text: "No — use a stick to test depth and stability before each step", correct: true, feedback: "Correct! Never assume calm floodwater is safe. Test each step if you absolutely must walk through it." },{ text: "Yes — as long as you hold on to something", correct: false, feedback: "Floodwater can sweep you off your feet even if it looks calm." },{ text: "Only if you are wearing rubber boots", correct: false, feedback: "Rubber boots do not protect you from current, debris, or hidden hazards." }]},
      { id:7,  situation: "After returning home you discover your food cupboard was submerged. Some cans look undamaged. Can you eat the food?",                                  image: "🥫", choices: [{ text: "Yes — sealed cans are safe", correct: false, feedback: "Floodwater penetrates can seals and contaminates contents. Discard all flood-touched food." },{ text: "Discard all food that contacted floodwater, including cans", correct: true, feedback: "Correct! Floodwater is contaminated with sewage and bacteria. Do not consume anything it touched." },{ text: "Boil the food inside the cans to make it safe", correct: false, feedback: "Boiling cannot remove chemical and bacterial contamination from flood-soaked food." },{ text: "Only discard food that smells bad", correct: false, feedback: "Dangerous contaminants are often odourless. Discard everything touched by floodwater." }]},
      { id:8,  situation: "A flash flood warning is issued while you are hiking in a valley. There is no rain where you are. What should you do?",                               image: "🏔️", choices: [{ text: "Continue hiking — there is no rain near you", correct: false, feedback: "Flash floods travel from distant storms. The danger is real even without local rain." },{ text: "Move immediately to high ground away from the valley floor", correct: true, feedback: "Correct! Flash floods can arrive as a wall of water with little warning. Move to high ground now." },{ text: "Wait to see if water appears before moving", correct: false, feedback: "By the time you see the water, it is too late to escape." },{ text: "Set up camp on a slightly elevated spot in the valley", correct: false, feedback: "Any spot in a valley can be reached by a flash flood. Move to genuinely high ground." }]},
      { id:9,  situation: "You see a person struggling in fast-moving floodwater. What is the safest way to help?",                                                               image: "🆘", choices: [{ text: "Jump in to swim to them", correct: false, feedback: "Entering floodwater to rescue someone puts two lives at risk. Never jump in." },{ text: "Throw a rope, branch, or flotation device from the bank", correct: true, feedback: "Correct! Reach or throw — never go. Use any object to extend your reach without entering the water." },{ text: "Call out instructions for them to swim to you", correct: false, feedback: "A person in fast water cannot control their direction. Throw something they can hold." },{ text: "Wade in to knee depth to reach them", correct: false, feedback: "Even shallow fast-moving water can knock you down and sweep you away." }]},
      { id:10, situation: "You have returned home after a flood. There is standing water in the basement. What is your first action?",                                             image: "🔌", choices: [{ text: "Go down to inspect the damage", correct: false, feedback: "The basement may have live electricity in the water. Never enter before power is confirmed off." },{ text: "Confirm electricity is off at the main breaker before entering", correct: true, feedback: "Correct! Flooded basements with live electricity are lethal. Confirm power is off before entry." },{ text: "Use a pump to remove water immediately", correct: false, feedback: "Operating electrical equipment near standing water without confirmed power cutoff is dangerous." },{ text: "Open basement windows to let it drain naturally", correct: false, feedback: "Ventilation helps after water removal, but entering without confirming power is off is the primary risk." }]},
      { id:11, situation: "Your area has a flood evacuation order. You have 15 minutes. What do you take?",                                                                       image: "🎒", choices: [{ text: "As much furniture and valuables as possible", correct: false, feedback: "Heavy items slow you down. Your life is worth more than possessions." },{ text: "Emergency kit, documents, medications, and pets", correct: true, feedback: "Correct! Prioritise essentials: emergency kit, ID, medications, and pets. Leave everything else." },{ text: "Electronics and appliances — they are expensive to replace", correct: false, feedback: "Electronics are replaceable. Focus on essentials and leave quickly." },{ text: "Nothing — leave immediately without stopping", correct: false, feedback: "Your emergency kit and essential documents are worth the 2 minutes it takes to grab them." }]},
      { id:12, situation: "After the flood, your drinking water supply looks clean. Is it safe to drink?",                                                                        image: "💧", choices: [{ text: "Yes — if it looks clear, it is safe", correct: false, feedback: "Flood contaminants are often invisible and odourless. Do not trust appearance alone." },{ text: "Boil water or use bottled water until authorities confirm supply is safe", correct: true, feedback: "Correct! Always boil or use bottled water after a flood until authorities confirm the supply is safe." },{ text: "Run the tap for 5 minutes to flush the pipes", correct: false, feedback: "Flushing does not remove bacterial or chemical contamination from flood-affected pipes." },{ text: "Add a pinch of salt to purify it", correct: false, feedback: "Salt does not purify water. Boiling or chemical treatment is required." }]},
    ]
  },
  fire: {
    title: "Fire", color: "#EA580C",
    steps: [
      { id:1,  situation: "You smell smoke in the hallway of your school. The fire alarm has not sounded yet.",                                                                   image: "🚨", choices: [{ text: "Wait for the fire alarm before doing anything", correct: false, feedback: "Never wait for alarms. If you smell smoke, act immediately." },{ text: "Alert others, activate the nearest alarm, and evacuate", correct: true, feedback: "Correct! Alert others, pull the alarm, and evacuate using the safest route immediately." },{ text: "Investigate where the smoke is coming from", correct: false, feedback: "Never investigate a fire — every second counts." },{ text: "Open windows to let the smoke out", correct: false, feedback: "Opening windows feeds oxygen to a fire and can intensify it rapidly." }]},
      { id:2,  situation: "You must escape through a smoke-filled corridor. You cannot see the exit clearly.",                                                                    image: "💨", choices: [{ text: "Stand upright and run as fast as possible", correct: false, feedback: "Smoke rises — standing puts you directly in the most toxic air." },{ text: "Crawl low on the floor and cover your mouth with a cloth", correct: true, feedback: "Correct! Clean air stays near the floor. Crawl and cover your nose and mouth." },{ text: "Turn back and wait in a classroom", correct: false, feedback: "Only shelter in place if the exit route is completely blocked." },{ text: "Break a window and wait there for rescue", correct: false, feedback: "Only as a last resort when all exits are blocked and you need to signal for help." }]},
      { id:3,  situation: "You escape outside. A classmate says their bag is inside and wants to go back in.",                                                                    image: "🏃", choices: [{ text: "Go with them quickly to help", correct: false, feedback: "Never re-enter a burning building. Possessions can be replaced; lives cannot." },{ text: "Firmly advise them against it and inform a teacher or firefighter", correct: true, feedback: "Correct! Alert adults and emergency services. Never re-enter under any circumstances." },{ text: "Let them decide — it's their choice", correct: false, feedback: "In emergencies, peer safety matters. Actively intervene and get adult help." },{ text: "Distract them until help arrives", correct: false, feedback: "The right action is to immediately inform emergency responders." }]},
      { id:4,  situation: "A small fire starts in a wastebasket. There is a fire extinguisher nearby. Should you use it?",                                                        image: "🧯", choices: [{ text: "Yes — use it immediately without hesitation", correct: false, feedback: "First verify: Is the fire small and contained? Do you have a clear exit? Only then use it." },{ text: "Only if the fire is small, you know PASS technique, and exit is behind you", correct: true, feedback: "Correct! PASS: Pull pin, Aim at base, Squeeze handle, Sweep side to side." },{ text: "No — always let firefighters handle it", correct: false, feedback: "A trained person can safely tackle a small contained fire with an extinguisher." },{ text: "Pour water on it immediately", correct: false, feedback: "Water is dangerous on electrical or grease fires." }]},
      { id:5,  situation: "You touch a door before opening it and it feels hot. What does this mean and what do you do?",                                                         image: "🚪", choices: [{ text: "The door is old and absorbs heat — open it carefully", correct: false, feedback: "A hot door means fire or intense heat is directly on the other side. Do not open it." },{ text: "Fire or intense heat is on the other side — use another exit", correct: true, feedback: "Correct! A hot door is your warning. Seal the gap underneath and use an alternate escape route." },{ text: "Open it quickly and close it again to check", correct: false, feedback: "Opening a hot door can cause a flashover — a sudden explosive spread of fire." },{ text: "Use your shoulder to force it open", correct: false, feedback: "Do not open a hot door under any circumstances. It could mean instant flashover." }]},
      { id:6,  situation: "Your clothes catch fire. What is the correct immediate response?",                                                                                     image: "🔥", choices: [{ text: "Run to the nearest tap or bathroom", correct: false, feedback: "Running fans the flames and makes them worse." },{ text: "Stop, Drop to the ground, and Roll back and forth", correct: true, feedback: "Correct! Stop immediately, drop to the ground, and roll to smother the flames." },{ text: "Shake the clothing vigorously to put out the fire", correct: false, feedback: "Shaking increases air flow and intensifies the fire." },{ text: "Pull the clothing off as fast as possible", correct: false, feedback: "Pulling burning clothing over your head brings flames to your face. Stop, drop, roll." }]},
      { id:7,  situation: "All exits from a burning building are blocked by fire and smoke. You are on the 2nd floor. What do you do?",                                           image: "🏢", choices: [{ text: "Jump from the window immediately", correct: false, feedback: "Jumping from 2 storeys causes serious injury. This is a last resort only." },{ text: "Seal door gaps with clothing, signal from the window, wait for rescue", correct: true, feedback: "Correct! Seal smoke entry, signal clearly, and wait — rescuers prioritise trapped people." },{ text: "Try to climb down the outside of the building", correct: false, feedback: "Climbing is extremely dangerous without equipment. Signal for rescue instead." },{ text: "Hide under the bed to protect yourself from flames", correct: false, feedback: "Hiding delays rescue. Signal your location clearly from the window." }]},
      { id:8,  situation: "You are escaping a building fire using the stairwell. The stairs are full of smoke. What do you do?",                                                  image: "🪜", choices: [{ text: "Take the elevator — it will be faster", correct: false, feedback: "Never use elevators in a fire — power can fail, trapping you." },{ text: "Crawl low, hold the handrail, and descend as fast as safely possible", correct: true, feedback: "Correct! Stay low where air is cleaner. Hold the rail for stability in low visibility." },{ text: "Go back up to a higher floor where there may be less smoke", correct: false, feedback: "Smoke rises — upper floors will have worse conditions, not better." },{ text: "Hold your breath and sprint down", correct: false, feedback: "You cannot hold your breath long enough. Crawl low where air is cleaner." }]},
      { id:9,  situation: "A grease fire starts on your kitchen stove. What should you do?",                                                                                     image: "🍳", choices: [{ text: "Pour water on it immediately", correct: false, feedback: "Water on a grease fire causes a violent explosion of flame. Never do this." },{ text: "Slide a lid over the pan and turn off the heat", correct: true, feedback: "Correct! Covering the pan removes oxygen and smothers the fire. Turn off heat and do not move the pan." },{ text: "Blow on it to cool it down", correct: false, feedback: "Blowing supplies oxygen and spreads burning oil." },{ text: "Carry the pan outside", correct: false, feedback: "Moving a burning pan of oil risks spilling it and spreading fire across the kitchen." }]},
      { id:10, situation: "After escaping a building fire, you realise a young child is still inside. What do you do?",                                                           image: "👶", choices: [{ text: "Go back in to rescue the child immediately", correct: false, feedback: "Re-entering is extremely dangerous. Firefighters have equipment and training you do not." },{ text: "Tell firefighters immediately with the child's exact location", correct: true, feedback: "Correct! Give firefighters precise information about the child's location — they are trained for this." },{ text: "Shout the child's name from outside and wait", correct: false, feedback: "Shouting does not substitute for informing trained rescuers with accurate location information." },{ text: "Call the child's parents before calling emergency services", correct: false, feedback: "Call emergency services first. Every second the child is inside matters." }]},
      { id:11, situation: "You are checking into a hotel. What fire safety step should you take first?",                                                                          image: "🏨", choices: [{ text: "Nothing — hotels are fully compliant with fire codes", correct: false, feedback: "Never assume. Fire safety awareness is your personal responsibility." },{ text: "Locate the nearest fire exit and count the doors to it", correct: true, feedback: "Correct! Counting doors lets you find the exit in darkness or smoke. Check the escape route map too." },{ text: "Note where the fire extinguisher is located", correct: false, feedback: "Useful, but knowing the exit route is more critical for personal safety." },{ text: "Make sure your room has a window that opens", correct: false, feedback: "An open window helps in emergency, but knowing the exit route comes first." }]},
      { id:12, situation: "You discover a fire in a building and call emergency services. What information is most important to give first?",                                      image: "📞", choices: [{ text: "Your name and contact details", correct: false, feedback: "Location is the critical first piece of information — responders need to know where to go." },{ text: "The exact address and whether anyone is trapped inside", correct: true, feedback: "Correct! Location and whether anyone is trapped allows responders to prioritise and deploy correctly." },{ text: "What caused the fire", correct: false, feedback: "Cause can be determined later. Location and casualties are the urgent information." },{ text: "How big the fire is", correct: false, feedback: "Give location first. Responders assess size when they arrive." }]},
    ]
  },
  cyclone: {
    title: "Cyclone", color: "#3B82F6",
    steps: [
      { id:1,  situation: "A Cyclone Warning is issued for your coastal district. You live 2 km from the sea. What is your first action?",                                        image: "🌀", choices: [{ text: "Board up your house and shelter inside", correct: false, feedback: "Boarding up is useful but coastal evacuation takes priority." },{ text: "Evacuate to a designated cyclone shelter inland", correct: true, feedback: "Correct! Coastal areas face storm surge risk. Move to an official shelter immediately." },{ text: "Go to the beach to watch the approaching storm", correct: false, feedback: "Extremely dangerous — storm surges can be 6+ metres high." },{ text: "Call relatives to discuss what to do", correct: false, feedback: "Act first. Evacuation must be immediate when a warning is issued." }]},
      { id:2,  situation: "You are sheltering indoors during a cyclone. The wind suddenly goes completely quiet. What does this mean?",                                            image: "😶", choices: [{ text: "The cyclone has passed — go outside to check damage", correct: false, feedback: "The most dangerous mistake. The calm is the cyclone's eye passing over you." },{ text: "It is the eye of the cyclone — stay sheltered, violent winds return shortly", correct: true, feedback: "Correct! The eye brings brief calm, but the back wall brings equally fierce winds back." },{ text: "Open windows to ventilate the house now", correct: false, feedback: "Never open windows — dangerous winds are minutes away." },{ text: "Check on neighbours quickly while it is calm", correct: false, feedback: "Remain sheltered. The back wall of the cyclone is approaching." }]},
      { id:3,  situation: "After the cyclone, you find a downed power line blocking your road. What do you do?",                                                                  image: "⚡", choices: [{ text: "Move the wire aside with a wooden branch", correct: false, feedback: "Even non-metallic objects can conduct electricity near live wires." },{ text: "Drive over it quickly", correct: false, feedback: "Downed power lines can electrify vehicles and surrounding ground." },{ text: "Stay back at least 10 metres and report it to authorities", correct: true, feedback: "Correct! Always treat downed lines as live. Keep distance and report to emergency services." },{ text: "Check if it is sparking before deciding", correct: false, feedback: "A wire does not need to spark to be live and lethal." }]},
      { id:4,  situation: "Before a cyclone arrives, you need to secure your home. Which action is most important?",                                                              image: "🏠", choices: [{ text: "Open all windows to equalise air pressure", correct: false, feedback: "Open windows allow dangerous wind and rain inside. Keep them closed and shuttered." },{ text: "Bring all loose outdoor items inside or tie them down", correct: true, feedback: "Correct! Loose objects become deadly projectiles in cyclone-force winds." },{ text: "Fill your bathtub with sand as a barrier", correct: false, feedback: "Filling your bathtub with clean water for emergency use is useful — not sand." },{ text: "Move your car to the lowest point of the property", correct: false, feedback: "Move your car to a sheltered area away from trees. Low areas may flood." }]},
      { id:5,  situation: "You have no time to evacuate and must shelter at home during a cyclone. Where is the safest room?",                                                    image: "🏡", choices: [{ text: "The room with the most windows for visibility", correct: false, feedback: "Windows are the most dangerous feature in a cyclone — glass shatters explosively." },{ text: "An interior room on the lowest floor above flood level", correct: true, feedback: "Correct! An interior room away from windows on the lowest safe floor offers the best protection." },{ text: "The attic — it is the highest point", correct: false, feedback: "The roof is highly vulnerable in a cyclone and attics can trap you if flooding occurs." },{ text: "The garage — the walls are thickest", correct: false, feedback: "Garages often have large, weak doors and poor structural integrity in cyclones." }]},
      { id:6,  situation: "A cyclone watch has been issued. What is the difference between a watch and a warning?",                                                              image: "📢", choices: [{ text: "They mean the same thing", correct: false, feedback: "They are different. Watch = possible in 48 hours. Warning = expected within 24 hours." },{ text: "Watch means possible in 48 hrs — prepare. Warning means imminent — act now.", correct: true, feedback: "Correct! A watch is your time to prepare. A warning means immediate action is required." },{ text: "A watch is more serious than a warning", correct: false, feedback: "A warning is more serious and urgent than a watch." },{ text: "A watch means evacuate, a warning means shelter in place", correct: false, feedback: "The opposite — a warning is when evacuation orders may be issued." }]},
      { id:7,  situation: "During the cyclone, a window in your shelter breaks. What do you do?",                                                                                 image: "🪟", choices: [{ text: "Try to cover it with furniture from the room", correct: false, feedback: "Moving furniture in cyclone-force wind is dangerous and ineffective." },{ text: "Move immediately to an interior room away from all windows", correct: true, feedback: "Correct! Broken windows expose you to wind, rain, and debris. Retreat to the safest interior space." },{ text: "Go outside to assess the storm's strength", correct: false, feedback: "Never go outside during a cyclone. The wind can kill." },{ text: "Board up the window from inside using planks", correct: false, feedback: "Attempting DIY repairs during a cyclone is extremely dangerous. Move to shelter." }]},
      { id:8,  situation: "Your area has been hit by a cyclone and you want to drive to check on relatives nearby. Is it safe?",                                                  image: "🚗", choices: [{ text: "Yes — if the eye has passed", correct: false, feedback: "The back wall of the cyclone is approaching. Driving after the eye is extremely dangerous." },{ text: "Only once authorities declare roads safe after the full cyclone passes", correct: true, feedback: "Correct! Do not drive until the full cyclone has passed and roads are officially cleared." },{ text: "Yes — if you drive slowly", correct: false, feedback: "Speed does not protect you from downed lines, flooded roads, or debris." },{ text: "Yes — emergency visits are always an exception", correct: false, feedback: "No exception applies here — roads during and immediately after a cyclone are deadly." }]},
      { id:9,  situation: "After a cyclone, you smell gas in your home. What do you do?",                                                                                        image: "💨", choices: [{ text: "Turn on lights and fans to disperse the gas", correct: false, feedback: "Electrical switches can create sparks that ignite gas. Do not operate any switches." },{ text: "Evacuate immediately without using any switches, call gas supplier from outside", correct: true, feedback: "Correct! Leave doors open as you exit, do not operate any electrical switch, and call from outside." },{ text: "Open all windows and wait inside for gas to clear", correct: false, feedback: "Even with windows open, the gas may ignite from any source. Evacuate." },{ text: "Locate and turn off the gas meter yourself", correct: false, feedback: "Only if you are certain there is no ignition risk and you know how. The safest action is to evacuate." }]},
      { id:10, situation: "You prepared an emergency kit before the cyclone. Which item is most critical for a 3-day shelter period?",                                            image: "🎒", choices: [{ text: "A set of board games for children", correct: false, feedback: "Comfort items help but are not critical for survival." },{ text: "3 days of water, food, medications, and a battery radio", correct: true, feedback: "Correct! Water, food, medications and a radio for official updates are the core survival items." },{ text: "An umbrella and waterproof jacket", correct: false, feedback: "These help but are not the critical survival items for a 3-day shelter period." },{ text: "A full change of formal clothing", correct: false, feedback: "Practical, but not a survival priority." }]},
      { id:11, situation: "Storm surge is approaching your coastal area with a cyclone warning active. You live on the ground floor. What do you do?",                            image: "🌊", choices: [{ text: "Move to the upper floor and wait", correct: false, feedback: "Storm surge can exceed 6 metres — upper floors may not be safe in a coastal home." },{ text: "Evacuate inland to official shelter immediately", correct: true, feedback: "Correct! Storm surge is the deadliest aspect of cyclones. Leave coastal areas immediately." },{ text: "Shelter in the ground floor bathroom — the walls are strongest", correct: false, feedback: "Ground floor rooms are directly in the path of storm surge." },{ text: "Drive to the beach to assess the surge height", correct: false, feedback: "Absolutely never. Storm surge arrives with no warning and is unsurvivable on the coast." }]},
    ]
  },
  stampede: {
    title: "Stampede", color: "#CA8A04",
    steps: [
      { id:1,  situation: "You are at a crowded festival. People suddenly start pushing from behind and panic spreads.",                                                           image: "🎪", choices: [{ text: "Push forward harder to escape", correct: false, feedback: "Pushing increases pressure and panic in the crowd, making the situation far more dangerous." },{ text: "Stay calm and move sideways with the flow of people", correct: true, feedback: "Correct! Moving sideways with the crowd gradually moves you toward the edge of the crush." },{ text: "Stop and stand your ground in the middle", correct: false, feedback: "Stopping causes collisions and increases your risk of falling." },{ text: "Shout loudly and push against the crowd", correct: false, feedback: "Moving against the crowd can knock you off your feet and lead to trampling." }]},
      { id:2,  situation: "The crowd is pressing tightly. You can barely breathe. What do you do with your arms?",                                                                image: "⚠️", choices: [{ text: "Press your arms to your sides to make yourself smaller", correct: false, feedback: "Arms at your side offer no chest protection — you may not be able to breathe." },{ text: "Raise your arms in front of your chest with elbows out", correct: true, feedback: "Correct! Creating a space in front of your chest allows your lungs to expand." },{ text: "Push your arms out aggressively to create space", correct: false, feedback: "Aggressive pushing escalates panic and worsens the crush." },{ text: "Raise your arms above your head", correct: false, feedback: "Arms above your head do not protect your chest or create breathing space." }]},
      { id:3,  situation: "Someone nearby trips and falls in the crowd.",                                                                                                         image: "⚠️", choices: [{ text: "Step over them to keep moving", correct: false, feedback: "Stepping over a fallen person increases risk of serious trampling injury." },{ text: "Help them up quickly if it is safe to do so", correct: true, feedback: "Correct! Quickly helping someone up prevents trampling and may save their life." },{ text: "Ignore them and focus on your own escape", correct: false, feedback: "Ignoring fallen people significantly increases their risk of fatal trampling." },{ text: "Sit down beside them to protect them", correct: false, feedback: "Sitting down puts both of you at immediate risk in a moving crowd." }]},
      { id:4,  situation: "You fall to the ground in the middle of the crowd.",                                                                                                   image: "🚨", choices: [{ text: "Stay lying down and wait for the crowd to pass", correct: false, feedback: "Staying down means being stepped on repeatedly — get up as fast as possible." },{ text: "Curl into a ball to protect your organs and head, then get up immediately", correct: true, feedback: "Correct! Protect vital organs briefly while getting your footing, then stand as quickly as you can." },{ text: "Scream for help and stay still", correct: false, feedback: "Screaming wastes energy and you are still at risk. Getting up is the priority." },{ text: "Crawl under the crowd's feet toward the edge", correct: false, feedback: "Crawling in a crowd puts you directly in the path of trampling." }]},
      { id:5,  situation: "You have safely escaped the crowd. You are at the edge of the venue. What do you do?",                                                                 image: "🛟", choices: [{ text: "Return to the crowd to help others", correct: false, feedback: "Re-entering exposes you to danger again and adds to the crowd problem." },{ text: "Move well away, check yourself for injuries, alert authorities", correct: true, feedback: "Correct! Move to a clear area, check for injuries, call emergency services, and report." },{ text: "Record videos for social media", correct: false, feedback: "Calling emergency services and giving accurate information is the priority." },{ text: "Leave the area entirely without informing anyone", correct: false, feedback: "Your information could help emergency services locate and help others." }]},
      { id:6,  situation: "You are at a concert and notice the crowd is rapidly becoming too dense near the stage. No panic has started yet. What do you do?",                   image: "🎵", choices: [{ text: "Stay — the crowd will spread out when the show starts", correct: false, feedback: "Early action is far easier than responding mid-crush. Move now." },{ text: "Begin moving toward the edges immediately before it worsens", correct: true, feedback: "Correct! Recognising danger early and moving before panic starts is the safest strategy." },{ text: "Hold your position so you do not lose your spot", correct: false, feedback: "Your position is not worth the risk of being caught in a crush." },{ text: "Ask the people around you to spread out", correct: false, feedback: "You cannot control a crowd. Move yourself to safety." }]},
      { id:7,  situation: "You are entering a crowded venue. What is the most important safety step to take immediately?",                                                        image: "🏟️", choices: [{ text: "Find the best viewing position", correct: false, feedback: "This prioritises comfort over safety." },{ text: "Locate at least two exit routes and memorise their positions", correct: true, feedback: "Correct! Knowing your exits before a crowd emergency means you can move immediately without panic." },{ text: "Buy food and water so you do not need to leave during the event", correct: false, feedback: "Helpful but not a safety measure. Locating exits comes first." },{ text: "Stay near the entrance you came in", correct: false, feedback: "The entrance may be the most congested point. Know all your options." }]},
      { id:8,  situation: "During a crowd surge, you feel intense pressure on your chest. You cannot breathe fully. What is your immediate priority?",                            image: "😰", choices: [{ text: "Shout for help as loudly as possible", correct: false, feedback: "Shouting uses the limited air you have. Focus on creating chest space." },{ text: "Use your elbows to push outward and create chest space", correct: true, feedback: "Correct! Creating a few centimetres of space around your chest can allow your lungs to expand." },{ text: "Hold your breath and wait for the pressure to ease", correct: false, feedback: "Holding your breath in a crush will accelerate loss of consciousness." },{ text: "Crouch down to reduce your profile", correct: false, feedback: "Crouching in a crowd increases your risk of falling and being trampled." }]},
      { id:9,  situation: "You witness a stampede from outside the crowd. What is the most helpful action?",                                                                      image: "📞", choices: [{ text: "Enter the crowd to pull people out", correct: false, feedback: "Entering the crowd adds to the numbers and puts you at risk." },{ text: "Call emergency services immediately with location and details", correct: true, feedback: "Correct! Your call can bring trained emergency responders quickly. Give precise location and crowd size." },{ text: "Shout at the crowd to calm down", correct: false, feedback: "Shouting into a panicked crowd increases panic rather than reducing it." },{ text: "Try to direct the crowd with your arms", correct: false, feedback: "A panicked crowd cannot respond to individual direction. Call emergency services." }]},
      { id:10, situation: "After escaping a stampede you notice bruising across your ribs. You feel no immediate pain. Is it serious?",                                           image: "🏥", choices: [{ text: "No — bruising is superficial, you are fine", correct: false, feedback: "Rib bruising from crowd crush can indicate fractured ribs or internal injury." },{ text: "Yes — seek medical attention, rib injuries from crush can be serious", correct: true, feedback: "Correct! Crush injuries may not be immediately painful. Seek medical evaluation even if you feel okay." },{ text: "Apply ice and rest — medical care is unnecessary", correct: false, feedback: "Ice helps minor bruising, but crush injuries need professional evaluation." },{ text: "Only seek help if breathing becomes difficult", correct: false, feedback: "Rib injuries from crowd crush require evaluation before symptoms worsen." }]},
      { id:11, situation: "You are with a child in a crowd that begins to crush. What is the priority?",                                                                          image: "👶", choices: [{ text: "Put the child on your shoulders immediately", correct: true, feedback: "Correct! Lifting a child above the crowd protects them from crush pressure and helps them breathe." },{ text: "Hold the child's hand and move together at ground level", correct: false, feedback: "Children at ground level face extreme crush pressure. Lift them above the crowd immediately." },{ text: "Send the child toward the edge of the crowd alone", correct: false, feedback: "A child alone in a crowd is at far greater risk." },{ text: "Stand still and shield the child with your body", correct: false, feedback: "Standing still in a crowd surge increases your risk of both being knocked over." }]},
    ]
  },
};

const TIMER_SECONDS = 30;

const DRILL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes drFadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes drSlideIn  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
  @keyframes drFeedback { from{opacity:0;transform:translateY(-8px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes drPulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes drShake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
  @keyframes drCorrect  { 0%{transform:scale(1)} 40%{transform:scale(1.03)} 100%{transform:scale(1)} }
  @keyframes drScoreUp  { from{opacity:0;transform:scale(.6)} to{opacity:1;transform:scale(1)} }
  @keyframes drResultIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  body { background:linear-gradient(135deg,#E8F5E9 0%,#C8E6C9 100%); font-family:'DM Sans',sans-serif; min-height:100vh; }
  body::before { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2340964C' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); pointer-events:none; z-index:0; }
  .dr-root { font-family:'DM Sans',sans-serif; color:#0F172A; width:100%; max-width:780px; margin:0 auto; padding:28px 24px 56px; position:relative; z-index:1; }
  .dr-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .dr-back-btn { padding:8px 20px; border-radius:10px; border:1px solid #E8F0E8; background:#FFFFFF; color:#2D6A4F; font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:600; cursor:pointer; transition:all .2s ease; }
  .dr-back-btn:hover { background:#2D6A4F; color:#fff; border-color:#2D6A4F; transform:translateY(-1px); }
  .dr-drill-label { font-size:1rem; font-weight:700; color:#1A3A2A; }
  .dr-step-label { font-size:.8rem; color:#5A7A6A; font-weight:600; background:#FFFFFF; padding:6px 14px; border-radius:99px; border:1px solid #E8F0E8; }
  .dr-progress { height:6px; background:#F0F8F0; border-radius:99px; overflow:hidden; margin-bottom:24px; }
  .dr-progress-fill { height:100%; border-radius:99px; transition:width .5s cubic-bezier(.25,.8,.25,1); }
  .dr-card { background:#FFFFFF; border-radius:16px; border:1px solid #E8F0E8; box-shadow:0 2px 8px rgba(0,0,0,.04); overflow:hidden; margin-bottom:20px; animation:drFadeUp .35s ease both; }
  .dr-timer-bar-wrap { height:4px; background:#F0F8F0; }
  .dr-timer-bar { height:100%; transform-origin:left; transition:background .3s ease; }
  .dr-timer-pill { display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; font-size:.8rem; font-weight:800; transition:background .3s,color .3s; font-variant-numeric:tabular-nums; margin:16px 20px 0; }
  .dr-timer-pill.urgent { animation:drPulse .5s ease infinite; }
  .dr-scenario { text-align:center; padding:24px 28px 28px; animation:drFadeUp .3s ease both; }
  .dr-scenario-text { font-size:1rem; color:#1A3A2A; line-height:1.7; font-weight:500; max-width:640px; margin:0 auto; }
  .dr-choices { display:flex; flex-direction:column; gap:12px; padding:0 20px 20px; }
  .dr-choice { padding:16px 20px; border-radius:12px; border:1.5px solid #E8F0E8; background:#FFFFFF; cursor:pointer; font-size:.9rem; line-height:1.55; color:#0F172A; display:flex; align-items:flex-start; gap:14px; transition:all .2s ease; animation:drSlideIn .3s ease both; }
  .dr-choice:nth-child(1){animation-delay:.05s} .dr-choice:nth-child(2){animation-delay:.1s} .dr-choice:nth-child(3){animation-delay:.15s} .dr-choice:nth-child(4){animation-delay:.2s}
  .dr-choice:hover:not(.answered) { border-color:#C8E6C9; background:#F8FFF8; transform:translateX(4px); }
  .dr-choice.correct { background:#D1FAE5; border-color:#86EFAC; color:#14532D; animation:drCorrect .4s ease both; }
  .dr-choice.wrong   { background:#FEE2E2; border-color:#FECACA; color:#991B1B; animation:drShake .4s ease both; }
  .dr-choice.answered { cursor:default; }
  .dr-choice-letter { width:28px; height:28px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:800; background:#F0F8F0; color:#2D6A4F; transition:background .15s,color .15s; }
  .dr-choice.correct .dr-choice-letter { background:#86EFAC; color:#14532D; }
  .dr-choice.wrong   .dr-choice-letter { background:#FECACA; color:#991B1B; }
  .dr-feedback { margin:0 20px 20px; padding:16px 20px; border-radius:12px; font-size:.88rem; line-height:1.6; color:#0F172A; animation:drFeedback .25s ease both; display:flex; gap:12px; align-items:flex-start; }
  .dr-feedback.correct { background:#D1FAE5; border:1px solid #86EFAC; }
  .dr-feedback.wrong   { background:#FEE2E2; border:1px solid #FECACA; }
  .dr-feedback.timeout { background:#FEF9C3; border:1px solid #FDE047; }
  .dr-feedback-icon { font-size:1.2rem; flex-shrink:0; margin-top:2px; }
  .dr-next-btn { width:100%; padding:14px; border-radius:12px; border:none; font-family:'DM Sans',sans-serif; font-size:.95rem; font-weight:700; cursor:pointer; color:#fff; transition:all .2s ease; animation:drFadeUp .2s ease both; letter-spacing:.01em; }
  .dr-next-btn:hover { opacity:.9; transform:translateY(-2px); filter:brightness(1.05); }
  .dr-score-row { display:flex; gap:8px; justify-content:center; margin:20px 0 8px; flex-wrap:wrap; padding:0 20px; }
  .dr-score-dot { width:10px; height:10px; border-radius:50%; transition:all .3s ease; }
  .dr-result { background:#FFFFFF; border-radius:16px; border:1px solid #E8F0E8; box-shadow:0 2px 8px rgba(0,0,0,.04); padding:40px 32px; text-align:center; animation:drResultIn .5s ease both; }
  .dr-result h2 { font-size:1.5rem; font-weight:700; color:#1A3A2A; margin-bottom:8px; }
  .dr-result-sub { font-size:.82rem; color:#5A7A6A; }
  .dr-score-ring { margin:28px auto; width:140px; height:140px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,.08); animation:drScoreUp .5s .2s ease both; }
  .dr-score-inner { width:104px; height:104px; border-radius:50%; background:#FFFFFF; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .dr-score-val { font-size:1.9rem; font-weight:800; line-height:1; }
  .dr-score-sub { font-size:.7rem; color:#5A7A6A; margin-top:4px; }
  .dr-badge-pill { display:inline-flex; align-items:center; gap:8px; padding:8px 24px; border-radius:99px; font-size:.88rem; font-weight:700; margin-bottom:16px; }
  .dr-result-msg { font-size:.88rem; color:#5A7A6A; margin-bottom:24px; line-height:1.6; }
  .dr-review { text-align:left; margin-bottom:28px; }
  .dr-review-title { font-size:.78rem; font-weight:700; color:#1A3A2A; margin-bottom:12px; text-transform:uppercase; letter-spacing:.06em; }
  .dr-review-row { display:flex; align-items:flex-start; gap:12px; padding:10px 14px; border-radius:10px; margin-bottom:6px; font-size:.82rem; }
  .dr-review-row.ok   { background:#D1FAE5; }
  .dr-review-row.fail { background:#FEE2E2; }
  .dr-review-icon { font-size:.9rem; flex-shrink:0; margin-top:2px; }
  .dr-result-actions { display:flex; gap:12px; margin-bottom:12px; }
  .dr-result-btn { flex:1; padding:12px; border-radius:10px; border:none; font-family:'DM Sans',sans-serif; font-size:.86rem; font-weight:600; cursor:pointer; transition:all .2s ease; }
  .dr-result-btn.primary { color:#fff; }
  .dr-result-btn.primary:hover { opacity:.88; transform:translateY(-2px); filter:brightness(1.05); }
  .dr-result-btn.secondary { background:#F8FFF8; color:#2D6A4F; border:1px solid #E8F0E8; }
  .dr-result-btn.secondary:hover { background:#2D6A4F; color:#fff; border-color:#2D6A4F; transform:translateY(-2px); }
  .dr-result-btn-full { width:100%; margin-top:12px; padding:12px; border-radius:10px; border:1px solid #E8F0E8; background:#FFFFFF; color:#5A7A6A; font-family:'DM Sans',sans-serif; font-size:.82rem; font-weight:600; cursor:pointer; transition:all .2s ease; }
  .dr-result-btn-full:hover { background:#F8FFF8; border-color:#C8E6C9; transform:translateY(-1px); }
  @media(max-width:640px){.dr-root{padding:20px 16px 40px}.dr-scenario{padding:20px 20px 24px}.dr-choices{padding:0 16px 20px}.dr-feedback{margin:0 16px 20px}.dr-result{padding:28px 20px}.dr-choice{padding:14px 16px}}
`;

function useDrillStyles() {
  useEffect(() => {
    const existing = document.getElementById("drill-css");
    if (existing) existing.remove();
    const s = document.createElement("style");
    s.id = "drill-css"; s.textContent = DRILL_CSS;
    document.head.appendChild(s);
  }, []);
}

function getWeekKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.floor(((now - start) / 86400000 + start.getDay() + 1) / 7);
  return `week_${now.getFullYear()}_w${week}`;
}

function Drill() {
  useDrillStyles();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const { module } = useParams();
  const navigate   = useNavigate();
  const drillKey   = module?.toLowerCase();
  const drill      = DRILL_DATA[drillKey];

  // ── get username for namespaced localStorage ──
  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user?.username || "guest";

  const [step,       setStep]       = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [answered,   setAnswered]   = useState(false);
  const [score,      setScore]      = useState(0);
  const [timer,      setTimer]      = useState(TIMER_SECONDS);
  const [timedOut,   setTimedOut]   = useState(false);
  const [finished,   setFinished]   = useState(false);
  const [answers,    setAnswers]    = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (answered || finished) return;
    setTimer(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimedOut(true);
          setAnswered(true);
          setAnswers(a => [...a, { correct: false, timedOut: true }]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [step, finished]);

  useEffect(() => {
    if (!finished || answers.length === 0) return;
    // ── save to DB ──
    saveScore({ username, module: drillKey, score: finalScore }).catch(console.error);
    // Increment weekly drill counter
const weekKey = `weeklyDrills_${username}_${getWeekKey()}`;
localStorage.setItem(weekKey, String((parseInt(localStorage.getItem(weekKey) || "0", 10) + 1)));
    // ── save to namespaced localStorage ──
    const key = `drillScores_${username}`;
    const existing = JSON.parse(localStorage.getItem(key) || "{}");
    existing[drillKey] = finalScore;
    localStorage.setItem(key, JSON.stringify(existing));
  }, [finished]);

  if (!drill) {
    return (
      <div className="dr-root">
        <div style={{ background:"#FFFFFF", borderRadius:16, padding:40, textAlign:"center", border:"1px solid #E8F0E8" }}>
          <h2 style={{ color:"#1A3A2A", marginBottom:12 }}>Module not found</h2>
          <button onClick={() => navigate("/student")} style={{ padding:"10px 24px", borderRadius:10, border:"1px solid #E8F0E8", background:"#F8FFF8", color:"#2D6A4F", fontFamily:"DM Sans,sans-serif", fontSize:".85rem", fontWeight:600, cursor:"pointer" }}>← Back</button>
        </div>
      </div>
    );
  }

  const currentStep = drill.steps[step];
  const totalSteps  = drill.steps.length;
  const lastAnswer  = answers[answers.length - 1];
  const col         = dc(drillKey);

  const timerPct   = (timer / TIMER_SECONDS) * 100;
  const timerColor = timer > 15 ? "#10B981" : timer > 7 ? "#F59E0B" : "#EF4444";
  const timerBg    = timer > 15 ? "#D1FAE5" : timer > 7 ? "#FEF9C3" : "#FEE2E2";

  const handleChoice = (choice, idx) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    setAnswered(true);
    setTimedOut(false);
    if (choice.correct) setScore(s => s + 1);
    setAnswers(a => [...a, { correct: choice.correct, timedOut: false }]);
  };

  const handleNext = () => {
    if (step + 1 >= totalSteps) {
      const calc = Math.round((score / totalSteps) * 100);
      setFinalScore(calc);
      // ── write moduleProgress with username prefix ──
      if (calc >= 60) {
        const key = `moduleProgress_${username}`;
        const prog = JSON.parse(localStorage.getItem(key) || "{}");
        prog[drillKey] = { completed: true };
        localStorage.setItem(key, JSON.stringify(prog));
      }
      setFinished(true);
    } else {
      setStep(s => s + 1);
      setSelected(null);
      setAnswered(false);
      setTimedOut(false);
    }
  };

  /* ── Results screen ── */
  if (finished) {
    const badge =
      finalScore >= 90 ? { label: "Expert Responder", color: "#D97706" }
      : finalScore >= 75 ? { label: "Proficient",      color: "#2D6A4F" }
      : finalScore >= 50 ? { label: "Learner",         color: "#3B82F6" }
      :                    { label: "Needs Practice",  color: "#EF4444" };

    return (
      <div className="dr-root">
        <div className="dr-result">
          <h2>{drill.title} Drill Complete</h2>
          <div className="dr-result-sub">Here's how you did</div>
          <div className="dr-score-ring" style={{ background:`conic-gradient(${drill.color} ${finalScore*3.6}deg, #F0F8F0 0deg)` }}>
            <div className="dr-score-inner">
              <div className="dr-score-val" style={{ color:drill.color }}>{finalScore}%</div>
              <div className="dr-score-sub">{score}/{totalSteps}</div>
            </div>
          </div>
          <div className="dr-badge-pill" style={{ background:badge.color+"1a", color:badge.color }}>{badge.label}</div>
          <div className="dr-result-msg">{finalScore >= 60 ? `Good work — you know how to respond in a ${drill.title} situation.` : "Keep practicing! Review the module and try again to improve your score."}</div>
          <div className="dr-review">
            <div className="dr-review-title">Your answers</div>
            {answers.map((a, i) => (
              <div key={i} className={`dr-review-row ${a.correct?"ok":"fail"}`}>
                <span className="dr-review-icon">{a.correct?"✓":a.timedOut?"⏱":"✗"}</span>
                <span>Q{i+1}: {drill.steps[i]?.situation.slice(0,65)}…</span>
              </div>
            ))}
          </div>
          <div className="dr-result-actions">
            <button className="dr-result-btn primary" style={{ background:drill.color }}
              onClick={() => { setStep(0);setScore(0);setAnswers([]);setSelected(null);setAnswered(false);setTimedOut(false);setFinished(false);setFinalScore(0); }}>
              Retry Drill
            </button>
            <button className="dr-result-btn secondary" onClick={() => navigate("/student/dashboard")}>Dashboard</button>
          </div>
          <button className="dr-result-btn-full" onClick={() => navigate("/student")}>← Back to Modules</button>
        </div>
      </div>
    );
  }

  /* ── Drill screen ── */
  return (
    <div className="dr-root">
      <div className="dr-topbar">
        <button className="dr-back-btn" onClick={() => navigate("/student")}>← Back</button>
        <span className="dr-drill-label">{drill.title} Drill</span>
        <span className="dr-step-label">{step+1} / {totalSteps}</span>
      </div>

      <div className="dr-progress">
        <div className="dr-progress-fill" style={{ width:`${((step+1)/totalSteps)*100}%`, background:drill.color }} />
      </div>

      <div className="dr-score-row">
        {drill.steps.map((_, i) => {
          const ans = answers[i];
          const bg  = ans==null ? (i===step ? drill.color+"44":"#E8F0E8") : ans.correct?"#10B981":"#EF4444";
          return <div key={i} className="dr-score-dot" style={{ background:bg, width:i===step?12:10, height:i===step?12:10 }} />;
        })}
      </div>

      <div className="dr-card" key={step}>
        <div className="dr-timer-bar-wrap">
          <div className="dr-timer-bar" style={{ width:`${timerPct}%`, background:timerColor, transition:"width 1s linear,background .3s ease" }} />
        </div>
        <div className={`dr-timer-pill ${timer<=7?"urgent":""}`} style={{ background:timerBg, color:timerColor }}>
          {timer}s remaining
        </div>

        <div className="dr-scenario">
          {/* ── SVG icon instead of emoji ── */}
          <ScenarioIcon image={currentStep.image} color={drill.color} />
          <div className="dr-scenario-text">{currentStep.situation}</div>
        </div>

        <div className="dr-choices">
          {currentStep.choices.map((choice, idx) => {
            let cls = "dr-choice";
            if (answered) { cls += " answered"; if (choice.correct) cls += " correct"; else if (selected===idx) cls += " wrong"; }
            return (
              <div key={idx} className={cls} onClick={() => handleChoice(choice, idx)}>
                <span className="dr-choice-letter">{["A","B","C","D"][idx]}</span>
                <span>{choice.text}</span>
              </div>
            );
          })}
        </div>

        {answered && (
          <div className={`dr-feedback ${timedOut?"timeout":lastAnswer?.correct?"correct":"wrong"}`}>
            <span className="dr-feedback-icon">{timedOut?"⏱":lastAnswer?.correct?"✓":"✗"}</span>
            <span>{timedOut ? `Time's up! ${currentStep.choices.find(c=>c.correct)?.feedback}` : currentStep.choices[selected]?.feedback}</span>
          </div>
        )}
      </div>

      {answered && (
        <button className="dr-next-btn" style={{ background:drill.color }} onClick={handleNext}>
          {step+1>=totalSteps?"See Results":"Next Question →"}
        </button>
      )}
    </div>
  );
}

export default Drill;
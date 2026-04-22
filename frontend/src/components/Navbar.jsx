import { useNavigate, useLocation } from "react-router-dom";

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconDrills = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

const IconDashboard = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconSun = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const IconMoon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

function Navbar({ user, onLogout, darkMode, toggleDarkMode, onNavigateProfile }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding   = location.pathname === "/";
  const isLoginPage = location.pathname.startsWith("/login");
  if (!user || isLanding || isLoginPage) return null;

  const navBtnStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    fontSize: "0.8rem",
    fontWeight: 600,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    letterSpacing: "0.01em",
  };

  const handleHover = (e, enter) => {
    e.currentTarget.style.background = enter ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)";
    e.currentTarget.style.borderColor = enter ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)";
    e.currentTarget.style.color = enter ? "#ffffff" : "rgba(255,255,255,0.9)";
    e.currentTarget.style.transform = enter ? "translateY(-1px)" : "translateY(0)";
  };

  // Handles profile click: if already on /student dashboard, switch tab; else navigate
  const handleProfileClick = () => {
    if (location.pathname === "/student" || location.pathname === "/student/dashboard") {
      // Signal Dashboard to switch to profile tab
      if (onNavigateProfile) onNavigateProfile();
    } else {
      navigate("/student");
      // Small delay to let Dashboard mount before switching tab
      setTimeout(() => { if (onNavigateProfile) onNavigateProfile(); }, 100);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%)",
      padding: "0 28px",
      height: "56px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.12)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>

      {/* ── Brand ── */}
      <div
        onClick={() => navigate(user.role === "student" ? "/student" : "/admin")}
        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", userSelect: "none" }}
        onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
        onMouseOut={e => e.currentTarget.style.opacity = "1"}
      >
        <div style={{
          width: "32px", height: "32px", borderRadius: "9px",
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF",
        }}>
          <IconShield />
        </div>
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.3px" }}>
            Disaster<span style={{ color: "#86EFAC" }}>Prep</span>
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", fontWeight: 500, letterSpacing: "0.4px", textTransform: "uppercase", marginTop: "2px" }}>
            Emergency Readiness
          </div>
        </div>
      </div>

      {/* ── Right Controls ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

        {user.role === "student" && (
          <>
            <button
              onClick={() => navigate("/student/drills")}
              style={navBtnStyle}
              onMouseOver={e => handleHover(e, true)}
              onMouseOut={e => handleHover(e, false)}
            >
              <IconDrills /> Drills
            </button>
            <button
              onClick={() => navigate("/student/dashboard")}
              style={navBtnStyle}
              onMouseOver={e => handleHover(e, true)}
              onMouseOut={e => handleHover(e, false)}
            >
              <IconDashboard /> Dashboard
            </button>
            <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.15)", margin: "0 2px" }} />
          </>
        )}

        {/* Dark mode toggle */}
        {toggleDarkMode && (
          <button
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              ...navBtnStyle,
              padding: "7px 10px",
              gap: "0",
            }}
            onMouseOver={e => handleHover(e, true)}
            onMouseOut={e => handleHover(e, false)}
          >
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>
        )}

        <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.15)", margin: "0 2px" }} />

        {/* User chip — clickable, goes to profile */}
        <button
          onClick={handleProfileClick}
          title="View my profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "5px 12px 5px 5px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "99px",
            color: "rgba(255,255,255,0.9)",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
            e.currentTarget.style.color = "rgba(255,255,255,0.9)";
          }}
        >
          <div style={{
            width: "24px", height: "24px", borderRadius: "50%",
            background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF",
            flexShrink: 0,
          }}>
            <IconUser />
          </div>
          <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.01em" }}>
            {user.username}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={() => { onLogout(); navigate("/"); }}
          style={{
            ...navBtnStyle,
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#FCA5A5",
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.28)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.15)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
            e.currentTarget.style.color = "#FCA5A5";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <IconLogout /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default Navbar;
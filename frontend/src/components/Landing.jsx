import { useNavigate } from "react-router-dom";

// Professional SVG Icons - No Emojis
const StudentIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    <circle cx="12" cy="8" r="2"/>
  </svg>
);

const AdminIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    <path d="M12 11v4"/>
    <path d="M10 13h4"/>
  </svg>
);

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <path d="M8 7h8"/>
    <path d="M8 11h6"/>
  </svg>
);

const DrillIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
    <path d="M16 21.5a9 9 0 0 0 0-18"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3"/>
    <path d="M12 2v8"/>
    <path d="m8 6 4-4 4 4"/>
    <path d="M12 18v-4"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Main Content - Full width, no gaps */}
      <div style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 24px"
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: "center",
          marginBottom: "48px"
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "20px"
          }}>
            
          </div>
          
          <h1 style={{
            margin: "0 0 12px 0",
            fontSize: "56px",
            fontWeight: "800",
            color: "#1A3A2A",
            lineHeight: "1.1",
            letterSpacing: "-0.02em"
          }}>
            Disaster Preparedness
          </h1>
          
          <p style={{
            margin: 0,
            fontSize: "20px",
            color: "#5A7A6A",
            fontWeight: "500"
          }}>
            Education & Virtual Drill Platform
          </p>
        </div>

        {/* Two Column Layout for Role Selection */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
          marginBottom: "48px"
        }}>
          {/* Student Card */}
          <button
            onClick={() => navigate("/login/student")}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8F0E8",
              borderRadius: "20px",
              padding: "40px 32px",
              cursor: "pointer",
              transition: "all 0.25s ease",
              textAlign: "left",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(45, 106, 79, 0.12)";
              e.currentTarget.style.borderColor = "#2D6A4F";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "#E8F0E8";
            }}
          >
            <div style={{
              width: "56px",
              height: "56px",
              background: "linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              color: "white"
            }}>
              <StudentIcon />
            </div>
            <h2 style={{
              margin: "0 0 8px 0",
              fontSize: "24px",
              fontWeight: "700",
              color: "#1A3A2A"
            }}>
              Student Access
            </h2>
            <p style={{
              margin: 0,
              fontSize: "14px",
              color: "#5A7A6A",
              lineHeight: "1.5"
            }}>
              Access learning modules, complete virtual drills, and track your preparedness progress
            </p>
          </button>

          {/* Admin Card */}
          <button
            onClick={() => navigate("/login/admin")}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8F0E8",
              borderRadius: "20px",
              padding: "40px 32px",
              cursor: "pointer",
              transition: "all 0.25s ease",
              textAlign: "left",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(45, 106, 79, 0.12)";
              e.currentTarget.style.borderColor = "#2D6A4F";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "#E8F0E8";
            }}
          >
            <div style={{
              width: "56px",
              height: "56px",
              background: "linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              color: "white"
            }}>
              <AdminIcon />
            </div>
            <h2 style={{
              margin: "0 0 8px 0",
              fontSize: "24px",
              fontWeight: "700",
              color: "#1A3A2A"
            }}>
              Admin Dashboard
            </h2>
            <p style={{
              margin: 0,
              fontSize: "14px",
              color: "#5A7A6A",
              lineHeight: "1.5"
            }}>
              Manage educational content, monitor student progress, and access analytics
            </p>
          </button>
        </div>

        {/* Features Section - Clean 3 column grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          paddingTop: "24px",
          borderTop: "1px solid rgba(45, 106, 79, 0.15)"
        }}>
          <div style={{
            textAlign: "center",
            padding: "20px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "rgba(45, 106, 79, 0.1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#2D6A4F"
            }}>
              <BookIcon />
            </div>
            <h3 style={{
              margin: "0 0 8px 0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#1A3A2A"
            }}>
              Interactive Modules
            </h3>
            <p style={{
              margin: 0,
              fontSize: "14px",
              color: "#5A7A6A",
              lineHeight: "1.4"
            }}>
              Engaging educational content
            </p>
          </div>

          <div style={{
            textAlign: "center",
            padding: "20px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "rgba(45, 106, 79, 0.1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#2D6A4F"
            }}>
              <DrillIcon />
            </div>
            <h3 style={{
              margin: "0 0 8px 0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#1A3A2A"
            }}>
              Virtual Drills
            </h3>
            <p style={{
              margin: 0,
              fontSize: "14px",
              color: "#5A7A6A",
              lineHeight: "1.4"
            }}>
              Practice scenarios safely
            </p>
          </div>

          <div style={{
            textAlign: "center",
            padding: "20px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "rgba(45, 106, 79, 0.1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#2D6A4F"
            }}>
              <ChartIcon />
            </div>
            <h3 style={{
              margin: "0 0 8px 0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#1A3A2A"
            }}>
              Progress Tracking
            </h3>
            <p style={{
              margin: 0,
              fontSize: "14px",
              color: "#5A7A6A",
              lineHeight: "1.4"
            }}>
              Monitor your readiness
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
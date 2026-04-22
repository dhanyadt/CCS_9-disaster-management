import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";

// SVG icon components — kept as-is (already professional)
const StudentIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const AdminIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const EyeIcon = ({ visible }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {visible ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    )}
  </svg>
);

function Login({ onLogin }) {
  const { role } = useParams();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [username,   setUsername]   = useState("");
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isStudent = role === "student";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      const fn  = isRegister ? registerUser : loginUser;
      const res = await fn({ username, password, role });
      onLogin({ ...res.data.user, token: res.data.token });
      navigate(role === "student" ? "/student" : "/admin");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px",
    border: "1.5px solid #E8F0E8", borderRadius: "10px",
    fontSize: "15px", outline: "none",
    fontFamily: "inherit", background: "#FFFFFF", color: "#0F172A",
    boxSizing: "border-box", transition: "all 0.2s ease",
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = "#2D6A4F";
    e.target.style.boxShadow   = "0 0 0 3px rgba(45,106,79,0.1)";
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = "#E8F0E8";
    e.target.style.boxShadow   = "none";
  };

  const pwWrap = { position: "relative", display: "flex", alignItems: "center" };
  const eyeBtn = {
    position: "absolute", right: "14px", background: "none", border: "none",
    cursor: "pointer", padding: 0, display: "flex", alignItems: "center",
    color: "#5A7A6A", opacity: 0.6, transition: "opacity 0.15s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", fontFamily: "'DM Sans', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* bg blobs - KEPT */}
      <div style={{ position:"absolute", top:"-10%", right:"-5%", width:"400px", height:"400px", background:"radial-gradient(circle, rgba(45,106,79,0.08) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-15%", left:"-10%", width:"500px", height:"500px", background:"radial-gradient(circle, rgba(45,106,79,0.06) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />

      <div style={{
        background: "#FFFFFF", borderRadius: "16px", padding: "48px",
        maxWidth: "440px", width: "100%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #E8F0E8",
        position: "relative", zIndex: 1,
      }}>
        {/* icon — SVG kept */}
        <div style={{
          width:"72px", height:"72px",
          background:"linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%)",
          borderRadius:"16px", display:"flex", alignItems:"center",
          justifyContent:"center", margin:"0 auto 20px",
          boxShadow:"0 2px 8px rgba(45,106,79,0.2)",
        }}>
          {isStudent ? <StudentIcon /> : <AdminIcon />}
        </div>

        {/* title - NO MARGINS TIGHTENED */}
        <h2 style={{ margin:"0 0 4px", fontSize:"26px", fontWeight:"800", color:"#1A3A2A", textAlign:"center", letterSpacing:"-0.01em" }}>
          {isRegister ? "Create Account" : (isStudent ? "Student Login" : "Admin Login")}
        </h2>
        <p style={{ margin:"0 0 24px", fontSize:"13px", color:"#5A7A6A", textAlign:"center", lineHeight:"1.6" }}>
          {isRegister
            ? `Register as ${role}`
            : isStudent ? "Access your learning modules and drills" : "Manage modules and view analytics"}
        </p>

        {/* toggle tabs - TIGHTENED */}
        <div style={{ display:"flex", background:"#F0F8F0", borderRadius:"10px", padding:"4px", marginBottom:"20px", gap:"4px" }}>
          {["Login", "Register"].map(tab => (
            <button key={tab}
              onClick={() => { setIsRegister(tab === "Register"); setError(""); }}
              style={{
                flex:1, padding:"8px", borderRadius:"8px", border:"none",
                fontFamily:"inherit", fontSize:".84rem", fontWeight:"600",
                cursor:"pointer", transition:"all .2s ease",
                background: (tab === "Register") === isRegister ? "#2D6A4F" : "transparent",
                color:      (tab === "Register") === isRegister ? "#fff"    : "#5A7A6A",
              }}>
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* username */}
          <div style={{ marginBottom:"14px" }}>
            <label style={{ display:"block", fontSize:"13px", fontWeight:"600", color:"#1A3A2A", marginBottom:"6px" }}>
              Username
            </label>
            <input type="text" placeholder="Enter your username"
              value={username} onChange={e => setUsername(e.target.value)}
              required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          {/* password */}
          <div style={{ marginBottom:"14px" }}>
            <label style={{ display:"block", fontSize:"13px", fontWeight:"600", color:"#1A3A2A", marginBottom:"6px" }}>
              Password
            </label>
            <div style={pwWrap}>
              <input type={showPw ? "text" : "password"} placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)}
                required style={{ ...inputStyle, paddingRight: "46px" }}
                onFocus={focusStyle} onBlur={blurStyle} />
              <button type="button" style={eyeBtn}
                onMouseOver={e => e.currentTarget.style.opacity = "1"}
                onMouseOut={e  => e.currentTarget.style.opacity = "0.6"}
                onClick={() => setShowPw(v => !v)}>
                <EyeIcon visible={showPw} />
              </button>
            </div>
          </div>

          {/* confirm password — register only */}
          {isRegister && (
            <div style={{ marginBottom:"14px" }}>
              <label style={{ display:"block", fontSize:"13px", fontWeight:"600", color:"#1A3A2A", marginBottom:"6px" }}>
                Confirm Password
              </label>
              <div style={pwWrap}>
                <input type={showConfirm ? "text" : "password"} placeholder="Repeat your password"
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  required style={{ ...inputStyle, paddingRight: "46px" }}
                  onFocus={focusStyle} onBlur={blurStyle} />
                <button type="button" style={eyeBtn}
                  onMouseOver={e => e.currentTarget.style.opacity = "1"}
                  onMouseOut={e  => e.currentTarget.style.opacity = "0.6"}
                  onClick={() => setShowConfirm(v => !v)}>
                  <EyeIcon visible={showConfirm} />
                </button>
              </div>
            </div>
          )}

          {/* error - TIGHTENED */}
          {error && (
            <div style={{ padding:"10px 14px", background:"#FEE2E2", border:"1px solid #FECACA", borderRadius:"10px", marginBottom:"14px", display:"flex", alignItems:"center", gap:"8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ margin:0, fontSize:"13px", color:"#DC2626", fontWeight:"500" }}>{error}</p>
            </div>
          )}

          {/* submit */}
          <button type="submit" disabled={loading} style={{
            width:"100%", padding:"14px",
            background: loading ? "#94A3B8" : "linear-gradient(135deg, #2D6A4F 0%, #1B4D3E 100%)",
            color:"white", border:"none", borderRadius:"10px",
            fontSize:"15px", fontWeight:"600",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily:"inherit", marginBottom:"10px", transition:"all 0.2s ease",
          }}>
            {loading
              ? "Please wait..."
              : isRegister ? "Create Account" : "Login"}
          </button>

          {/* back - TIGHTENED */}
          <button type="button" onClick={() => navigate("/")} style={{
            width:"100%", padding:"13px", background:"#FFFFFF", color:"#2D6A4F",
            border:"1.5px solid #E8F0E8", borderRadius:"10px",
            fontSize:"14px", fontWeight:"600", cursor:"pointer", fontFamily:"inherit",
            transition:"all 0.2s ease",
          }}
            onMouseOver={e => { e.target.style.background="#F8FFF8"; e.target.style.borderColor="#C8E6C9"; }}
            onMouseOut={e  => { e.target.style.background="#FFFFFF"; e.target.style.borderColor="#E8F0E8"; }}
          >
            ← Back to Home
          </button>
        </form>

        {/* footer - TIGHTENED */}
        <p style={{ marginTop:"16px", textAlign:"center", fontSize:"12px", color:"#94A3B8" }}>
          {isStudent ? "Need help? Contact your administrator" : "Secure admin access only"}
        </p>
      </div>
    </div>
  );
}

export default Login;
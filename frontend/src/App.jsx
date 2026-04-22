import React, { useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./components/Landing.jsx";
import Login from "./components/Login.jsx";
import CategorySelect from "./components/CategorySelect.jsx";
import Learn from "./components/Learn.jsx";
import Admin from "./components/Admin.jsx";
import Dashboard from "./components/Dashboard.jsx";
import DrillCategory from "./components/DrillCategory.jsx";
import DrillList from "./components/DrillList.jsx";
import Drill from "./components/Drill.jsx";
import Result from "./components/Result.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const navigateToProfileRef = useRef(null); // ← moved here, before return

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("disaster_prep_theme") === "dark";
  });

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("disaster_prep_theme", next ? "dark" : "light");
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const appStyle = {
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    background: darkMode ? "#0F1A1A" : "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
    color: darkMode ? "#FFFFFF" : "#000000",
    transition: "all 0.3s ease",
  };

  return (
    <div style={appStyle}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onNavigateProfile={() => navigateToProfileRef.current?.()}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/:role" element={<Login onLogin={handleLogin} />} />
        <Route path="/student" element={
          <Dashboard user={user} darkMode={darkMode} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} navigateToProfileRef={navigateToProfileRef} />
        } />
        <Route path="/student/dashboard" element={
          <Dashboard user={user} darkMode={darkMode} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} navigateToProfileRef={navigateToProfileRef} />
        } />
        <Route path="/student/categories" element={<CategorySelect user={user} />} />
        <Route path="/student/category/:category" element={<Learn user={user} />} />
        <Route path="/student/drills" element={<DrillCategory user={user} />} />
        <Route path="/student/drill-category/:category" element={<DrillList />} />
        <Route path="/student/drill/:module" element={<Drill />} />
        <Route path="/student/result" element={<Result />} />
        <Route path="/admin" element={<Admin user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
      </Routes>
    </div>
  );
}

export default App;
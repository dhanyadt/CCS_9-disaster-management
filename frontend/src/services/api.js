const BASE = "/api";

function getToken() {
  const user = localStorage.getItem("user");
  if (!user) return null;
  return JSON.parse(user).token || null;
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res  = await fetch(`${BASE}${path}`, { headers, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return { data };
}

// ── Auth ────────────────────────────────────────────────
export const loginUser    = (payload) =>
  request("/auth/login",    { method: "POST", body: JSON.stringify(payload) });

export const registerUser = (payload) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(payload) });

// ── Modules ─────────────────────────────────────────────
export const getModules   = ()         => request("/modules");
export const addModule    = (payload)  => request("/modules",     { method: "POST",   body: JSON.stringify(payload) });
export const updateModule = (id, data) => request(`/modules/${id}`, { method: "PUT",  body: JSON.stringify(data)   });
export const deleteModule = (id)       => request(`/modules/${id}`, { method: "DELETE" });

// ── Scores ──────────────────────────────────────────────
export const saveScore     = (payload)  => request("/scores",     { method: "POST", body: JSON.stringify(payload) });
export const getScores     = ()         => request("/scores");
export const getMyScores   = ()         => request("/scores/me");
export const getUserScores = (username) => request(`/scores/${username}`);

// ── Drills ──────────────────────────────────────────────
export const getDrills           = ()         => request("/drills");
export const getDrillsByCategory = (category) => request(`/drills/category/${category}`);
export const getDrillByModule    = (module)   => request(`/drills/module/${module}`);

// ── Learning ────────────────────────────────────────────
export const getLearningByCategory = (category) => request(`/learning/category/${category}`);
export const getLearningByModule   = (module)    => request(`/learning/module/${module}`);
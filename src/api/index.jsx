import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api", 
  // Uses .env value if available, else falls back to /api for local dev
});

// Attach token if present so authenticated requests work after refresh
try {
  const persistedToken = localStorage.getItem("token");
  if (persistedToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${persistedToken}`;
  }
} catch {}

export default api;

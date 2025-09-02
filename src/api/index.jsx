import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Attach token if present so authenticated requests work after refresh
try {
  const persistedToken = localStorage.getItem("token");
  if (persistedToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${persistedToken}`;
  }
} catch {}
export default api;

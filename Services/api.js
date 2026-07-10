import axios from "axios";

// create interceptor to attach JWT to every request and handle errors globally
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  // Get token from localStorage
  const token = localStorage.getItem("fk_token");
  // If token exists, attach it to the Authorization header
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.message || "Something went wrong";
    // Auto-logout on 401
    if (err.response?.status === 401) {
      localStorage.removeItem("fk_token");
      localStorage.removeItem("fk_user");
      window.location.href = "/login";
    }
    return Promise.reject(new Error(msg));
  },
);

export default api;

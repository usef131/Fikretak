import api from "./api";

export const authService = {

  // post request to login endpoint with email and password, returns user data and token
  login: (email, password) => api.post("/auth/login", { email, password }),

  register: (data) => api.post("/auth/register", data),

  // get request to /auth/me endpoint to get the current logged in user data
  getProfile: () => api.get("/auth/me"),

  updateProfile: (data) => api.put("/auth/me", data)
};

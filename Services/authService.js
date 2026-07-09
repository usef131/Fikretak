import api from "./api";

export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),

  register: (data) => api.post("/auth/register", data),

  getProfile: () => api.get("/auth/me"),

  updateProfile: (data) => api.put("/auth/me", data),

  changePassword: (currentPassword, newPassword) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
};

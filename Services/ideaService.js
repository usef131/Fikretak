import api from "./api";

export const ideaService = {
  // Browsing
  getIdeas: (params) => api.get("/ideas", { params }),

  getIdeaById: (id) => api.get(`/ideas/${id}`),

  // CRUD
  createIdea: (data) => api.post("/ideas", data),

  updateIdea: (id, data) => api.put(`/ideas/${id}`, data),

  deleteIdea: (id) => api.delete(`/ideas/${id}`),

  // Investor actions
  expressInterest: (id) => api.post(`/ideas/${id}/interest`),

  withdrawInterest: (id) => api.delete(`/ideas/${id}/interest`),

  // My ideas (entrepreneur)
  getMyIdeas: () => api.get("/ideas/my"),

  getInterestedIdeas: () => api.get("/ideas/interested"),
};

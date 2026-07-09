import api from "./api";

const investorService = {
  // get all investors
  getInvestors: (params) => api.get("/users/investors", { params }),

  getUserById: (id) => api.get(`/users/investors/${id}`),

  // ideas an investor has expressed interest in
  getIdeasInterestedByUser: (id) => api.get(`/ideas/interested-by/${id}`),

  // ideas created by an entrepreneur
  getIdeasByUser: (id) => api.get(`/ideas/by-user/${id}`),
};

export default investorService;

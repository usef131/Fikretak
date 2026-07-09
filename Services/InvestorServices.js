import api from "./api";

const investorService = {
  //get all investors
  getInvestors: (params) => api.get("/users/investors", { params }),

  getUserById: (id) => api.get(`/users/investors/${id}`),
};

export default investorService;

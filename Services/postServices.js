import api from "./api";
import axios from "axios";

export const postService = {
  // Browsing
  getPosts: () => api.get("/posts"),

  getMyPosts: () => api.get("/posts/my"),
  // CRUD
  createPost: (text) => api.post("/posts", { text }),

  deletePost: (id) => api.delete(`/posts/${id}`),

  likePost: (id) => api.post(`/posts/${id}/like`),

  addComment: (id, text) => api.post(`/posts/${id}/comment`, { text }),
};

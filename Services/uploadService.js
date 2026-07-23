import axios from "axios";

// Uploads a single image file as multipart/form-data and returns { url }.
// Uses the bare axios (not the JSON `api` instance) so the browser sets the
// correct multipart Content-Type with a boundary.
export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("fk_token");
    const res = await axios.post("/api/uploads/image", formData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data; // { url: '/uploads/...' }
  },
};

export default uploadService;

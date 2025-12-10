import axios from "axios";

// 1. Export BASE_URL agar bisa diambil oleh itemTable.jsx
export const BASE_URL = "http://localhost:5000";

// 2. Buat axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// 3. Export fungsi login (opsional, jika masih dipakai)
export const loginUser = async (data) => {
  const res = await api.post("/login", data);
  return res.data;
};

// 4. Export 'api' sebagai default agar dashboard.jsx bisa pakai api.get()
export default api;
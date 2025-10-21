import axios from "axios";

console.log("🔗 API_URL =", import.meta.env.VITE_API_URL);

const API_URL =
  import.meta.env.VITE_API_URL || "https://kokost-backend.vercel.app";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export const getKos = () => api.get("/kos");
export const getUsers = () => api.get("/users");
export const getBookings = () => api.get("/bookings");
export const loginUser = (data) => api.post("/users/login", data);

export default api;

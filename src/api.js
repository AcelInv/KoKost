import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// ====== ENDPOINTS ======
export const getKos = () => api.get("/kos");
export const getUsers = () => api.get("/users");
export const getBookings = () => api.get("/bookings");

export default api;

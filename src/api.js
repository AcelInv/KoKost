import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getKos = () => axios.get(`${API_BASE}/kos`);
export const getUsers = () => axios.get(`${API_BASE}/users`);
export const getBookings = () => axios.get(`${API_BASE}/bookings`);

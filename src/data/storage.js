export const STORAGE_KEY = "kos_app_v2";
export const initialData = {
users: [{ id: "u1", email: "admin@kos.com", password: "admin", role: "admin" }, { id: "u2", email: "user@kos.com",  password: "user",  role: "user" }],
kosList: [
{ id: "k1", name: "Kamar 1", location: "Bandung", price: 1500000, availableRooms: 10, image: "/images/Kamar1.jpg", description: "Kamar nyaman dengan fasilitas AC, kamar mandi dalam, dan akses WiFi 24 jam."},
{ id: "k2", name: "Kamar 2", location: "Bandung", price: 1200000, availableRooms: 5, image: "/images/Kamar2.jpg", description: "Kamar minimalis dengan pemandangan kota, dilengkapi meja belajar dan lemari pakaian."},
{ id: "k3", name: "Kamar 3", location: "Bandung", price: 1950000, availableRooms: 2, image: "/images/Kamar3.jpg", description: "Kamar eksklusif dengan balkon pribadi, AC, dan kamar mandi dalam."},
{ id: "k4", name: "Kamar 4", location: "Bandung", price: 1850000, availableRooms: 4, image: "/images/Kamar4.jpg", description: "Kamar luas dengan fasilitas lengkap, termasuk AC, lemari es, dan akses WiFi cepat."},
{ id: "k5", name: "Kamar 5", location: "Bandung", price: 1100000, availableRooms: 8, image: "/images/Kamar5.jpg", description: "Kamar ekonomis dengan fasilitas dasar, cocok untuk pelajar dan pekerja."},
{ id: "k6", name: "Kamar 6", location: "Bandung", price: 1350000, availableRooms: 11, image: "/images/Kamar6.jpg", description: "Kamar nyaman dengan fasilitas AC, kamar mandi dalam, dan akses WiFi 24 jam."},

],
bookings: [],
};
export function loadData() {
try {
const raw = localStorage.getItem(STORAGE_KEY);
return raw ? JSON.parse(raw) : initialData;
} catch {
return initialData;
}
}
export function saveData(data) {
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
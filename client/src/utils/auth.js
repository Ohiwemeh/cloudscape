import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = axios.create({ baseURL: base });

export const register = (payload) => API.post("/auth/register", payload).then((r) => r.data);
export const login = (payload) => API.post("/auth/login", payload).then((r) => r.data);
export const me = (token) =>
  API.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data);

export default { register, login, me };

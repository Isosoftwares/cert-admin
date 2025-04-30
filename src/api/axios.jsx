import axios from "axios";
// 192.168.0.109

// const BASE_URL = 'http://localhost:3501';
const BASE_URL = "https://api.crendential.net";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

import axios from "axios";

/**
 * Axios instance that only talks to Next.js Route Handlers (/api/*).
 * The backend Railway URL is NEVER exposed to client-side code.
 * The JWT token is NEVER accessible from JavaScript (httpOnly cookie).
 */
const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

export default apiClient;

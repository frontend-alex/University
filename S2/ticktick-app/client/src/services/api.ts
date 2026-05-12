import Cookies from "js-cookie";
import axios, { AxiosInstance } from "axios";

import { decryptToken } from "@/utils/auth";
import { logout } from "@/services/authService";

export const URL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "prod-url";

const api: AxiosInstance = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthError =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      ![
        "/auth/login",
        "/auth/create-password",
        "/auth/reset-password",
        "/auth/update-password",
        "/auth/refresh",
      ].includes(originalRequest.url);

    if (!isAuthError) {
      return Promise.reject(error);
    }

    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      const { data } = await axios.post(`${URL}/auth/refresh`, {
        refreshToken,
      });

      const decryptedToken = await decryptToken(data.authToken);
      if (!decryptedToken) throw new Error("Failed to decrypt token");

      localStorage.setItem("authToken", data.authToken);
      originalRequest.headers.Authorization = `Bearer ${data.authToken}`;
      return axios(originalRequest);
    } catch {
      logout();
    }

    return Promise.reject(error);
  }
);

export default api;

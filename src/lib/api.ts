import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "./auth";

const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const baseURL =
  envBaseUrl ||
  (import.meta.env.PROD ? window.location.origin : "http://localhost:552");

export const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = auth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed";
    toast.error(message);
    return Promise.reject(error);
  }
);

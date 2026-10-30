import axios, { type AxiosError } from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "./constants";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string }>) => {
    const message =
      error.response?.data?.error ??
      error.message ??
      "Something went wrong";
    toast.error(message);
    return Promise.reject(error);
  }
);

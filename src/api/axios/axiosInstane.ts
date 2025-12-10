import axios from "axios";

import { BACKEND_BASE_URL } from "../../../env";
import { store } from "../../store";
import { logout } from "../../store/authSlice";

const axiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
  
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 globally
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login"; 
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;

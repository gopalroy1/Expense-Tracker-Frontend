import axios from "axios";

import { store } from "../../store";
import { logout } from "../../store/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
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

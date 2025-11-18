import axios from "axios";

import { store } from "../../store";
import { logout } from "../../store/authSlice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
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

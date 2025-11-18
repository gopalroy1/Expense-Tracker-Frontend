import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { API } from "../api";
import Loader from "../components/common/Loader";
import { useApi } from "../hooks/useApi";
import { loginSuccess, logout } from "../store/authSlice";

const ProtectedRoute = () => {
  const dispatch = useDispatch();

  //@ts-ignore
  const user = useSelector((state) => state.auth.user);

  const { callApi, loading } = useApi();

  useEffect(() => {
    const check = async () => {
      try {
        const data = await callApi(() => API.isLoggedIn());
        console.log("User is logged in: inside the protected route", data);
        // update redux
        dispatch(loginSuccess({ user: data.user, token: data.token }));
      } catch {
        dispatch(logout());
      }
    };

    // Only check if user is not already available in redux
    if (!user) {
      check();
    }
  }, []);

  // Still loading = show loader
  if (loading) return <Loader />;

  // Not logged in = redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → allow component to render
  return <Outlet />;
};

export default ProtectedRoute;

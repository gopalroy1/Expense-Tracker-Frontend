import { API } from "@/api";
import Loader from "@/components/common/Loader";
import { useApi } from "@/hooks/useApi";
import type { RootState } from "@/store";
import { loginSuccess, logout } from "@/store/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { callApi } = useApi();
  const [initializing, setInitializing] = useState(!user);

  useEffect(() => {
    if (user) return;

    const check = async () => {
      try {
        const data = await callApi(() => API.isLoggedIn());
        dispatch(loginSuccess({ user: data.data.user }));
      } catch {
        dispatch(logout());
      }
      setInitializing(false);
    };

    check();
  }, []);

  if (initializing) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;

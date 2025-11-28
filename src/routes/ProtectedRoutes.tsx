import { useEffect, useState } from "react";
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

  const { callApi } = useApi();

  const [initializing, setInitializing] = useState(true);  
  // <-- THIS FIXES YOUR BUG

  useEffect(() => {
    const check = async () => {
      try {
        const data = await callApi(() => API.isLoggedIn());
        dispatch(loginSuccess({ user: data.data.user }));
      } catch {
        dispatch(logout());
      }
      setInitializing(false); // <-- let component know check is done
    };

    if (!user) {
      check();
    } else {
      setInitializing(false);
    }
  }, []);

  // 🔥 FIX: do NOT redirect while initializing
  if (initializing) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;

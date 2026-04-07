import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";

const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  useEffect(() => {
    // 🔐 If no token anywhere → redirect
    if (!isAuthenticated && !token) {
      navigate("/login");
      return;
    }



  }, [isAuthenticated, token, storedUser, navigate, dispatch]);

  if (!isAuthenticated && !token) {
    return null;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
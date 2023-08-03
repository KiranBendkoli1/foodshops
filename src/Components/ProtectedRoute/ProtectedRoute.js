import React from "react";
import { auth } from "../../config/firebase";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;
  const location = useLocation();
  return user ? (
    children
  ) : (
    <Navigate to={"/login"} replace state={{ path: location.pathname }} />
  );
};

export default ProtectedRoute;

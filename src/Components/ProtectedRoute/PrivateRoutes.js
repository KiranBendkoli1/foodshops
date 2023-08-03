import React from "react";
import { auth } from "../../config/firebase";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoutes = () => {
  const user = auth.currentUser;
  return user ? <Outlet /> : <Navigate to={"/login"} />;
};

export default PrivateRoutes;

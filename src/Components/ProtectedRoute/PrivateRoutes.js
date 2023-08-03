import React, { useMemo } from "react";
import { auth } from "../../config/firebase";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoutes = () => {
  const user = useMemo(() => auth.currentUser, []);
  return user ? <Outlet /> : <Navigate to={"/login"} />;
};

export default PrivateRoutes;

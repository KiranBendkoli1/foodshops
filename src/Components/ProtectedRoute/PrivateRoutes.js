import React, { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoutes = () => {
  let user = localStorage.getItem("user");
  user = useMemo(() => JSON.parse(user), [user]);
  return user ? <Outlet /> : <Navigate to={"/login"} />;
};

export default PrivateRoutes;

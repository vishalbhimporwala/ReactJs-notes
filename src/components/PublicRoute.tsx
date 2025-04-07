// src/routes/PublicRoute.tsx
import { JSX } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;

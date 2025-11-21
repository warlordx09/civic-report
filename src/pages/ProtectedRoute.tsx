import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

// Add optional requiredRole prop
interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: "user" | "admin" | "authority";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const authorityId = localStorage.getItem("authorityId");

  if (!token) {

    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    switch (requiredRole) {
      case "admin":
        if (role !== "admin") return <Navigate to="/dashboard" replace />;
        break;

      case "authority":
        if (!authorityId) return <Navigate to="/dashboard" replace />;
        break;

      case "user":
        if (role !== "user") return <Navigate to="/dashboard" replace />;
        break;

      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

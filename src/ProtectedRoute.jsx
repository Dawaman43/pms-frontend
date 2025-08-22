// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = userData.role;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided, check user role
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Not authorized → redirect to their own dashboard
    switch (role) {
      case "admin":
        return <Navigate to="/admin-dashboard" replace />;
      case "team_leader":
        return <Navigate to="/team-leader-dashboard" replace />;
      case "staff":
        return <Navigate to="/home" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

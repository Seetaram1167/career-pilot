import { Navigate, useLocation } from "react-router-dom";

/**
 * AdminRoute – wraps any route that requires admin privileges.
 * If user is not an admin, they are redirected to dashboard.
 */
const AdminRoute = ({ children }) => {
  const location = useLocation();
  const userData = localStorage.getItem("user");
  
  if (!userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = JSON.parse(userData);

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;

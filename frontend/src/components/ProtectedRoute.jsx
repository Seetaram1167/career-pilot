import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute – wraps any route that requires authentication.
 * If no user is found in localStorage, the user is redirected to /login.
 * The original destination is preserved in location state so the user
 * can be sent there after a successful login.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = localStorage.getItem("user");

  if (!user) {
    // Redirect to login, but remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

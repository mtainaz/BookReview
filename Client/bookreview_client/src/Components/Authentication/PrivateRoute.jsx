import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>; // Wait for session check
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
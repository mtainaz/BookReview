import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import WelcomePage from '../WelcomePage/WelcomePage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Wait for session check

  if (children.type === WelcomePage) return user ? children : <Navigate to="/" />;
  return user ? <Navigate to="/welcome" /> : children;
};

export default PrivateRoute;
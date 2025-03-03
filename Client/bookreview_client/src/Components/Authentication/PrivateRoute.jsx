import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import WelcomePage from '../WelcomePage/WelcomePage';
import Loader from "../Loader/Loader";
import RecPage from "../RecPage/RecPage";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader/>; // Wait for session check

  if (children.type === WelcomePage || children.type === RecPage) return user ? children : <Navigate to="/" />;
  return user ? <Navigate to="/welcome" /> : children;
};

export default PrivateRoute;
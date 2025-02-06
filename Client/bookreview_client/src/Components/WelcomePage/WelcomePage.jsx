import { useAuth } from "../Authentication/AuthContext";

const WelcomePage = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Welcome to the BookNest!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default WelcomePage;

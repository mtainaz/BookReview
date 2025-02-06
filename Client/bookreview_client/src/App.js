import './App.css';
import { AuthProvider } from "./Components/Authentication/AuthContext";
import PrivateRoute from "./Components/Authentication/PrivateRoute";
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/RegistrationForm/RegistrationForm';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from './Components/WelcomePage/WelcomePage';

function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            {/* Protected Route: Welcome Page (only accessible when logged in) */}
            <Route
              path="/welcome"
              element={
                <PrivateRoute>
                  <WelcomePage />
                </PrivateRoute>
              }
            />

            {/* Default Route (Redirect to login page) */}
            <Route path="*" element={<LoginForm />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

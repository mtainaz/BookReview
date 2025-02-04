import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/RegistrationForm/RegistrationForm';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from './Components/WelcomePage/WelcomePage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/welcome" element={<WelcomePage />} />
        </Routes>
    </Router>
  );
}

export default App;

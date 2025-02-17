import './App.css';
import { AuthProvider } from "./Components/Authentication/AuthContext";
import { AppProvider } from './context';
import PrivateRoute from "./Components/Authentication/PrivateRoute";
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/RegistrationForm/RegistrationForm';
import BookList from './Components/BookList/BookList';
import BookDetails from './Components/BookDetails/BookDetails';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from './Components/WelcomePage/WelcomePage';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
            <Routes>
              {/* Protected Route: Welcome Page (only accessible when logged in) */}
              {/* Default Route (Redirect to login page) */}
              <Route             
                path="*"
                element={
                  <PrivateRoute>
                    <LoginForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PrivateRoute>
                    <RegistrationForm />
                  </PrivateRoute>
                }
              />
              <Route path="/welcome"
                element={
                  <PrivateRoute>
                    <WelcomePage />
                  </PrivateRoute>
                }
              > 
              </Route>
              <Route path = "book" element = {<BookList />} />
              <Route path = "/book/:id" element = {<BookDetails />} />
            </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

import React, {useState} from 'react';
import { useAuth } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import './LoginForm.css';
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";

const LoginForm = () => {
    const [message, setMessage] = useState();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response=await login(formData);
        if (response.ok) {
            navigate("/welcome");
          } else if (response.status===401) {
            setMessage("Wrong info")
          } else {
            setMessage("Server error");
        }
    };

    const handleOauth = async () => {
      window.location.href = "http://localhost:3010/auth/google"; 
    };

    return (
        <div className='login-wrapper'>
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Welcome to BookNest</h1>
                    <div className="input-box">
                        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Email" required/>
                        <FaUser className='icon'/>
                    </div>
                    <div className="input-box">
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required/>
                        <FaLock className='icon'/>
                    </div>

                    {message && (
                      <p className='login-error'>
                        {message === "Wrong info" ? (
                          "Invalid email or password. Please try again."
                        ) : (
                          "Internal server error, please try again."
                        )}
                      </p>
                    )}

                    <button type="submit">Login</button>
                </form>

                <div className="divider">
                  <span>OR</span>
                </div>

                <button className='google-btn' onClick={handleOauth}>
                  <FaGoogle className='google-icon' />
                  Sign in with Google
                </button>
                
                <div className="register-link">
                  <p>Don't have an account? <a href="/register">Register</a></p>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;
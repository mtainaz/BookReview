import React, {useState} from 'react';
import './RegistrationForm.css'
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";
import { useAuth } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({ username: "", password: "" });
    const { register } = useAuth();

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response=await register(formData);
        if (response.ok) {
          navigate("/welcome");
        } else if (response.status===400) {
          setMessage("User exists")
        } else {
          setMessage("Server error");
        }
    };

    const handleOauth = () => {
      window.location.href = "http://localhost:3010/auth/google"; 
    };

    return (
        <div className='registration-wrapper'>
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
                      <p className='error-message'>
                        {message === "User exists" ? (
                          <>
                            This email is already registered. Please <a href="/login">log in</a> or use a different email.
                          </>
                        ) : (
                          "Internal server error, please try again."
                        )}
                      </p>
                    )}
                    <button type="submit">Register</button>
                </form>

                <div class="divider">
                  <span>OR</span>
                </div>

                <button className='google-btn' onClick={handleOauth}>
                  <FaGoogle className='google-icon' />
                  Sign up with Google
                </button>

            </div>
        </div>
    )
}

export default RegistrationForm;
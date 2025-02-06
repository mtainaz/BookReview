import React, {useState} from 'react';
import { useAuth } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
        navigate("/welcome");
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

                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>Don't have an account? <a href="/register">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;
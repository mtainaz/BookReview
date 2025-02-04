import React, {useState} from 'react';
import './RegistrationForm.css'
import { FaUser, FaLock } from "react-icons/fa";

const RegistrationForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch("http://localhost:3010/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
    
          if (!response.ok) throw new Error("Failed to submit form");
    
          const result = await response.json();
          console.log("Form submitted:", result);
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      };

    return (
        <div className='registration-wrapper'>
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Welcome to BookNest</h1>
                    <div className="input-box">
                        <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required/>
                        <FaUser className='icon'/>
                    </div>
                    <div className="input-box">
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required/>
                        <FaLock className='icon'/>
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    )
}

export default RegistrationForm;
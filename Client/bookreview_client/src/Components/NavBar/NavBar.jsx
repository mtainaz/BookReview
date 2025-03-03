import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import "./NavBar.css";
import logoImg from "../Assets/booknest_logo.png";
import {HiOutlineMenuAlt3} from "react-icons/hi";
import { useAuth } from "../Authentication/AuthContext";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const handleNavbar = () => setToggleMenu(!toggleMenu);
  const { logout } = useAuth();

  return (
    <nav className='navbar' id = "navbar">
      <div className='container navbar-content flex'>
        <div className='brand-and-toggler flex flex-sb'>
          <Link to = "/" className='navbar-brand flex'>
            <img src = {logoImg} alt = "site logo"/>
            <span className='fw-7 fs-24 ls-1'>BookNest</span>
          </Link>
          <button type = "button" className='navbar-toggler-btn' onClick={handleNavbar}>
            <HiOutlineMenuAlt3 size = {35} style = {{
              color: `${toggleMenu ? "#D4A373" : "#FFD7A3"}`
            }} />
          </button>
        </div>

        <div className={toggleMenu ? "navbar-collapse show-navbar-collapse" : "navbar-collapse"}>
          <ul className = "navbar-nav">
            <li className='nav-item'>
              <Link to = "/" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>Home</Link>
            </li>
            <li className='nav-item'>
              <Link to = "#" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>My Reviews</Link>
            </li>
            <li className='nav-item'>
              <Link to = "/recs" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1'>Recommendations</Link>
            </li>
            <li className='nav-item'>
              <Link to = "#" className='nav-link text-uppercase text-white fs-22 fw-6 ls-1' onClick={logout}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
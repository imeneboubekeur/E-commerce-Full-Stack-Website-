import React from "react";
import { useState,useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link,useNavigate } from 'react-router-dom';
import SearchBar from "./searchBar"
import logo from "../assets/logo.png";
import Heart from "../assets/Heart.png"
import UserImage from "../assets/User.png"
import Cart from "../assets/ShoppingCart.png"
import { User ,Settings,LogOut   } from 'lucide-react';
import { authAPI } from '../services/api';

export function Banner(){
    const [showMenu, setShowMenu] = useState(false);
    const dropdownRef = useRef(null);
    const user = useSelector((state) => state.auth.user);
        const navigate = useNavigate();
const handleLogout = async () => {
    try {
        await authAPI.logout();

   

      

        navigate("/login"); 
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
    useEffect(() => {
    function handleClickOutside(event) {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setShowMenu(false);
        }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);
    return(
        <section className="banner">
<Link to="/"><div className="logo">
    <img src="https://res.cloudinary.com/di08nffcl/image/upload/v1777999989/-2147483648_-210857_mvcao9.webp"/>
</div>
</Link>
           <SearchBar/>
           <div className="navLinks">
   <Link to="/wishlist"> <img src="https://res.cloudinary.com/di08nffcl/image/upload/v1777998498/Heart_bhzzos.png"/></Link>
       <Link to="/cart"> <img src="https://res.cloudinary.com/di08nffcl/image/upload/v1777998477/Shopping_Cart_ny3u03.png"/></Link>
  {!user ? (
                    <Link to="/login">
                        <img src="https://res.cloudinary.com/di08nffcl/image/upload/v1777998455/User_md1nor.png" />
                    </Link>
                ) : (
                    <div className="profile-container"
                    ref={dropdownRef}
                    >
                        <button
                            className="profile-btn"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <img
                                src={user.image_url}
                                alt={user.name}
                                className="nav-avatar"
                            />
                        </button>

                        {showMenu && (
                            <div className="profile-menu">

                                <div className="profile-header">
                                    <img
                                        src={user.image_url}
                                        alt={user.name}
                                        className="profile-avatar"
                                    />

                                    <div className="profile-details">
                                        <h3>{user.name}</h3>
                                        <p>{user.email}</p>
                                    </div>
                                </div>

                                <div className="menu-divider"></div>

                                <Link to="/profile">
                                <span>
    <User  height="0.9rem" width="2.3rem" /> My Profile</span>
                                </Link>

                                <Link to="/admin/security">
  <span>
    <Settings  height="0.9rem" width="2.3rem" /> Settings</span>                                </Link>

                               

                                

                                <div className="menu-divider"></div>

                                <button className="logout-btn"
                               onClick={handleLogout}>
<span>
    <LogOut  height="0.9rem" width="2.3rem" /> Log Out</span>                                </button>

                            </div>
                        )}
                    </div>
                )}
</div>
        </section>
    )
}
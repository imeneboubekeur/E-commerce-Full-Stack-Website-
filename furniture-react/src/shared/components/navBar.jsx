import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import React from "react";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛍️ EcoShop
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            Products
          </Link>
          <Link to="/wishlist" className="nav-link">
            ❤️ Wishlist
          </Link>
          <Link to="/cart" className="nav-link">
            🛒 Cart ({totalItems})
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/orders" className="nav-link">
                Orders
              </Link>
              <span className="user-name">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
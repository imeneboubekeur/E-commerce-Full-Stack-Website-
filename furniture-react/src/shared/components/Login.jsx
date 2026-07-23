import React from "react";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice';
import { authAPI } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await authAPI.login(formData.email, formData.password);
      dispatch(loginSuccess(response.user));
      navigate('/');
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <>
        <div className="login-container">
          <div className="left-section">
            <div className="form-wrapper">
              <h1 className="title">Log in to your account</h1>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="login-button"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>
            </div>
          </div>

          <div className="right-section">
            <div className="signup-wrapper">
              <p className="signup-text">don't have an account ?</p>
              <Link to="/signup"><button
                className="signup-button"
              >
                Sign Up
              </button>
              </Link>
            </div>
          </div>
        </div>
    </>
  );
}
import React from "react";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function RegisterPage() { 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      
      await authAPI.register(formData.email, formData.password,formData.confirmPassword,  formData.name);
      
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <div className="signup-container">
          <div className="left-section">
            <div className="login-wrapper">
              <p className="login-text">Already have an account ?</p>
              <button
                className="login-button"
                
              >
                Log in
              </button>
            </div>
          </div>

          <div className="right-section">
            <div className="form-wrapper">
              <h1 className="title">Sign up for an account</h1>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

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

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="terms"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="checkbox-input"
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="checkbox-label">
                    I accept all the <a href="/terms">Terms & Conditions</a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="signup-button"
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
              </form>
            </div>
          </div>
        </div>
    </>
  );
}

export default RegisterPage;
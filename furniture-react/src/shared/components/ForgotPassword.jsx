import React from "react";
import { useState } from "react";
import { authAPI } from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await authAPI.forgotPassword(email);

      alert(data.message);

      setEmail("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="forgot-password">
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>

      <p>
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="back-login">
        <a href="/login">Back to Login</a>
      </div>
    </div>
  </div>
);
}

export default ForgotPassword;
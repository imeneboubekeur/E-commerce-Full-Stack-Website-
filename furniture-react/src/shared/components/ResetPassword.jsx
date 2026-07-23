import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authAPI } from "../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await authAPI.resetPassword(
        token,
        password,
        confirmPassword
      );

      alert(data.message);
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password-container">
        <h2>Reset Password</h2>

        <p>
          Enter your new password below and confirm it to complete your password
          reset.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <div className="back-login">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
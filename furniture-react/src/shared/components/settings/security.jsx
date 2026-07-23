
import React, { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { authAPI } from "../../services/api";
import { updateProfile } from "../../slices/authSlice";
import { UpBar } from "../dashboard";

export function SecuritySettings1() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const user = useSelector(state => state.auth.user);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    address: user.address,
    image: null,
    imageUrl: user.image_url,
  });
const [imagePreview, setImagePreview] = useState(user.image_url || "");
  const [localError, setLocalError] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return setLocalError("Image must be less than 5MB");
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  // Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("address", formData.address);

      if (formData.image) {
        form.append("image", formData.image);
      }
     const res = await fetch(
        `${process.env.API_URL || 'http://localhost:5000/api'}/auth/profile`,
        {
          method: "PUT",
          body:form
        }
      );
      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();

      dispatch(updateProfile(updatedUser));

      alert("Profile updated successfully");
    } catch (err) {
      setLocalError(err.message);
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await authAPI.changePassword(currentPassword, newPassword);

      alert("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (

      <div className="security">
        <div className="security-page">
          <p>
            Manage your credentials, authentication methods, and security
            preferences
          </p>

          {/* PROFILE */}
          <div className="profile">
            <h3>Profile Information</h3>

            <div className="card1">
              <form className="card1" onSubmit={handleSubmit}>
                <div className="img">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" />
                  )}

                  <label className="upload-box">
                    <Upload size={18} /> Upload Image
                    <input
                      type="file"
                      hidden
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <div className="container">
                  <label>Display Name</label>
                  <input
                    name="name"
                    placeholder="Display Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="container">
                  <label>Email Address</label>
                  <input
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit">
                  Save
                </button>
              </form>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="password">
            <h3>Update Password</h3>

            <div className="card2">
              <div className="container">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                />
              </div>
<div className="containerMain">
              <div className="container">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                />
              </div>

              <div className="container">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />
              </div>
</div>
              <button onClick={handlePasswordChange}>
                Change Password
              </button>
            </div>
          </div>

          {loading && <p>Loading...</p>}
          {(error || localError) && (
            <p className="error">
              {error || localError}
            </p>
          )}
        </div>
      </div>
  );
}
export default function SecuritySettings(){
  return(
     <div className="main">
      <UpBar title="Security Settings" />
      <SecuritySettings1/>
      </div>
  )
}
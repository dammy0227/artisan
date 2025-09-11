// src/pages/artisan/auth/ArtisanRegister.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerArtisan } from "../../../features/artisan/artisanThunks";
import { useNavigate } from "react-router-dom";
import './ArtisanRegister.css'

const ArtisanRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    description: "",
    skillCategory: "",
    phone: "",
    availability: true,
    location: "",
    yearsOfExperience: "",
    profilePhoto: null,
    verificationDocs: [],
    email: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { successMessage, error, loading } = useSelector((s) => s.artisan);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "verificationDocs") {
        formData.verificationDocs.forEach((file) => {
          data.append("verificationDocs", file);
        });
      } else if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    dispatch(registerArtisan(data));
    setSubmitted(true); // mark as submitted
  };

  useEffect(() => {
    if (successMessage) {
      navigate("/artisan/dashboard");
    }
  }, [successMessage, navigate]);

  // Show pending page after submission
  if (submitted && !loading) {
    return (
      <div className="pending-container">
        <h2>Registration Submitted ✅</h2>
        <p>
          Thank you <strong>{formData.fullName}</strong>! Your artisan account is currently under review by our admin team.
        </p>
        <p>You will receive an email once your account is approved.</p>
        <button onClick={() => navigate("/artisan/dashboard")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="register-container">
      <form
        onSubmit={handleSubmit}
        className="register-form"
        encType="multipart/form-data"
      >
        <h2 className="register-title">Artisan Registration</h2>

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />

        {/* Description */}
        <textarea
          placeholder="Short Bio / Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        ></textarea>

        {/* Skill Category */}
        <input
          type="text"
          placeholder="Skill Category"
          value={formData.skillCategory}
          onChange={(e) => setFormData({ ...formData, skillCategory: e.target.value })}
          required
        />

        {/* Phone */}
        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />

        {/* Availability */}
        <label>
          Available:
          <input
            type="checkbox"
            checked={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
          />
        </label>

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />

        {/* Years of Experience */}
        <input
          type="number"
          placeholder="Years of Experience"
          value={formData.yearsOfExperience}
          onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
          required
        />

        {/* Profile Photo */}
        <label>Profile Photo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.files[0] })}
        />

        {/* Verification Docs */}
        <label>Verification Documents:</label>
        <input
          type="file"
          multiple
          onChange={(e) =>
            setFormData({ ...formData, verificationDocs: Array.from(e.target.files) })
          }
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Register"}
        </button>

        {error && <p className="register-error">{error}</p>}
      </form>
    </div>
  );
};

export default ArtisanRegister;

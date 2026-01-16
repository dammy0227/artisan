import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateArtisan } from "../../../features/artisan/artisanThunks";
import { clearArtisanMessages } from "../../../features/artisan/artisanSlice";
import "./UpdatingProfile.css";

const UpdatingProfile = () => {
  const dispatch = useDispatch();
  const { artisan, loading, error, successMessage } = useSelector(
    (state) => state.artisan
  );

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
  });

 
  useEffect(() => {
    if (artisan) {
      setFormData({
        fullName: artisan.fullName || "",
        description: artisan.description || "",
        skillCategory: artisan.skillCategory || "",
        phone: artisan.phone || "",
        availability: artisan.availability ?? true,
        location: artisan.location || "",
        yearsOfExperience: artisan.yearsOfExperience || "",
        profilePhoto: null,
        verificationDocs: [],
      });
    }
  }, [artisan]);

  useEffect(() => {
    if (successMessage) {
      setFormData({
        fullName: "",
        description: "",
        skillCategory: "",
        phone: "",
        availability: true,
        location: "",
        yearsOfExperience: "",
        profilePhoto: null,
        verificationDocs: [],
      });

      const timer = setTimeout(() => {
        dispatch(clearArtisanMessages());
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearArtisanMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      if (name === "verificationDocs") {
        setFormData({ ...formData, verificationDocs: files });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit update
  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "verificationDocs") {
        Array.from(formData.verificationDocs).forEach((file) => {
          updateData.append("verificationDocs", file);
        });
      } else {
        updateData.append(key, formData[key]);
      }
    });

    dispatch(updateArtisan(updateData));
  };

  return (
    <div className="update-profile">
      <h2>Update Profile</h2>

      {successMessage && <p className="success">{successMessage}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short Bio"
        ></textarea>
        <input
          type="text"
          name="skillCategory"
          value={formData.skillCategory}
          onChange={handleChange}
          placeholder="Skill Category"
          required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <label>
          Available:
          <input
            type="checkbox"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
          />
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <input
          type="number"
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleChange}
          placeholder="Years of Experience"
          required
        />
        <label>Profile Photo:</label>
        <input type="file" name="profilePhoto" onChange={handleChange} />

        <label>Verification Documents:</label>
        <input
          type="file"
          name="verificationDocs"
          onChange={handleChange}
          multiple
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdatingProfile;

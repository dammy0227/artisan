import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateArtisan } from "../../../features/artisan/artisanThunks";
import { clearArtisanMessages } from "../../../features/artisan/artisanSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserEdit,
  FaUpload,
  FaCheckCircle,
  FaBriefcase,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserTie,
  FaImage,
  FaFileAlt,
  FaSave,
  FaTimes,
  FaUser,
  FaStar,
  FaTools
} from "react-icons/fa";
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

  const [profilePreview, setProfilePreview] = useState(null);
  const [docPreviews, setDocPreviews] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stats, setStats] = useState({
    profileComplete: 0,
    lastUpdated: null,
    rating: 0,
    totalJobs: 0
  });

  const skillCategories = [
    "Carpentry",
    "Plumbing",
    "Electrical",
    "Masonry",
    "Painting",
    "Welding",
    "HVAC",
    "Roofing",
    "Landscaping",
    "Cleaning",
    "Automotive",
    "Electronics",
    "Other"
  ];

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

      if (artisan.profilePhoto) {
        setProfilePreview(artisan.profilePhoto);
      }

      // Calculate profile completion
      const completedFields = [
        artisan.fullName,
        artisan.description,
        artisan.skillCategory,
        artisan.phone,
        artisan.location,
        artisan.yearsOfExperience
      ].filter(field => field).length;

      setStats({
        profileComplete: Math.round((completedFields / 6) * 100),
        lastUpdated: artisan.updatedAt || artisan.createdAt,
        rating: artisan.rating || 0,
        totalJobs: artisan.totalJobs || 0
      });
    }
  }, [artisan]);

  useEffect(() => {
    if (successMessage) {
      showToast(successMessage, "success");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      dispatch(clearArtisanMessages());
    }
    if (error) {
      showToast(error, "error");
      dispatch(clearArtisanMessages());
    }
  }, [successMessage, error, dispatch]);

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "file") {
      if (name === "profilePhoto" && files[0]) {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      } else if (name === "verificationDocs") {
        setFormData(prev => ({ ...prev, [name]: files }));
        const previews = Array.from(files).map(file => URL.createObjectURL(file));
        setDocPreviews(previews);
      }
    } else if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = new FormData();
    
    Object.keys(formData).forEach((key) => {
      if (key === "verificationDocs") {
        Array.from(formData.verificationDocs).forEach((file) => {
          updateData.append("verificationDocs", file);
        });
      } else if (formData[key] !== null) {
        updateData.append(key, formData[key]);
      }
    });

    dispatch(updateArtisan(updateData));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch(currentStep) {
      case 1:
        return formData.fullName && formData.phone && formData.location;
      case 2:
        return formData.skillCategory && formData.yearsOfExperience;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  return (
    <div className="update-profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-left">
          <h1 className="page-title">
            <FaUserEdit /> Profile Settings
          </h1>
          <p className="page-subtitle">
            Update your professional information to attract more clients
          </p>
        </div>
        <div className="header-stats">
          <div className="profile-completion">
            <div className="completion-circle">
              <span className="completion-percent">{stats.profileComplete}%</span>
            </div>
            <span className="completion-label">Profile Complete</span>
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            className="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="success-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <FaCheckCircle className="success-icon" />
              <h3>Profile Updated!</h3>
              <p>Your profile has been successfully updated</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Steps */}
      <div className="progress-steps">
        {[1, 2, 3].map((step) => (
          <div key={step} className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
            <div className="step-number">{step}</div>
            <div className="step-label">
              {step === 1 && 'Basic Info'}
              {step === 2 && 'Professional Details'}
              {step === 3 && 'Documents'}
            </div>
          </div>
        ))}
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <motion.div 
            className="form-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="step-header">
              <h3><FaUser /> Basic Information</h3>
              <p>Tell us about yourself</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <FaUserTie /> Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaPhone /> Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaMapMarkerAlt /> Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Availability
                </label>
                <div className="availability-toggle">
                  <span className={`toggle-label ${formData.availability ? 'active' : ''}`}>
                    Available
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="availability"
                      checked={formData.availability}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className={`toggle-label ${!formData.availability ? 'active' : ''}`}>
                    Unavailable
                  </span>
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  Bio / Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell clients about yourself, your experience, and what you offer..."
                  className="form-textarea"
                  rows={4}
                />
                <div className="char-count">
                  {formData.description.length}/500 characters
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Professional Details */}
        {currentStep === 2 && (
          <motion.div 
            className="form-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="step-header">
              <h3><FaBriefcase /> Professional Details</h3>
              <p>Tell us about your professional background</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <FaTools /> Skill Category *
                </label>
                <select
                  name="skillCategory"
                  value={formData.skillCategory}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select your skill category</option>
                  {skillCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaCalendarAlt /> Years of Experience *
                </label>
                <div className="experience-input">
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="0"
                    className="form-input"
                    min="0"
                    max="50"
                    required
                  />
                  <span className="input-suffix">years</span>
                </div>
                <div className="experience-slider">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={formData.yearsOfExperience || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                    className="range-slider"
                  />
                  <div className="slider-labels">
                    <span>0</span>
                    <span>25</span>
                    <span>50+</span>
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <div className="rating-display">
                  <div className="rating-label">
                    <FaStar /> Current Rating
                  </div>
                  <div className="rating-value">
                    {stats.rating.toFixed(1)}/5.0
                  </div>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i}
                        className={i < Math.floor(stats.rating) ? 'star filled' : 'star'}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <div className="stats-card">
                  <div className="stat-item">
                    <div className="stat-value">{stats.totalJobs}</div>
                    <div className="stat-label">Total Jobs</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{formData.yearsOfExperience || 0}</div>
                    <div className="stat-label">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Documents & Photos */}
        {currentStep === 3 && (
          <motion.div 
            className="form-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="step-header">
              <h3><FaFileAlt /> Documents & Verification</h3>
              <p>Upload photos and documents to verify your identity</p>
            </div>
            
            <div className="form-grid">
              {/* Profile Photo Upload */}
              <div className="form-group">
                <label className="form-label">
                  <FaImage /> Profile Photo
                </label>
                <div className="photo-upload">
                  <div className="photo-preview">
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile Preview" className="preview-image" />
                    ) : (
                      <div className="photo-placeholder">
                        <FaUser size={32} />
                      </div>
                    )}
                  </div>
                  <div className="upload-controls">
                    <input
                      type="file"
                      name="profilePhoto"
                      onChange={handleChange}
                      accept="image/*"
                      id="profile-photo"
                      className="file-input"
                    />
                    <label htmlFor="profile-photo" className="upload-btn">
                      <FaUpload /> Upload Photo
                    </label>
                    <p className="upload-hint">Max 5MB • JPG, PNG, or GIF</p>
                  </div>
                </div>
              </div>

              {/* Verification Documents */}
              <div className="form-group">
                <label className="form-label">
                  <FaFileAlt /> Verification Documents
                </label>
                <div className="documents-upload">
                  <div className="docs-preview">
                    {docPreviews.length > 0 ? (
                      <div className="docs-grid">
                        {docPreviews.map((preview, index) => (
                          <div key={index} className="doc-preview">
                            <img src={preview} alt={`Document ${index + 1}`} />
                            <button 
                              type="button"
                              className="remove-doc"
                              onClick={() => {
                                const newDocs = [...formData.verificationDocs];
                                newDocs.splice(index, 1);
                                setFormData(prev => ({ ...prev, verificationDocs: newDocs }));
                                setDocPreviews(prev => prev.filter((_, i) => i !== index));
                              }}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="docs-empty">
                        <FaFileAlt size={48} />
                        <p>No documents uploaded</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    name="verificationDocs"
                    onChange={handleChange}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    id="verification-docs"
                    className="file-input"
                  />
                  <label htmlFor="verification-docs" className="upload-btn secondary">
                    <FaUpload /> Upload Documents
                  </label>
                  <p className="upload-hint">ID, Certificates, Licenses, etc.</p>
                </div>
              </div>

              {/* Tips */}
              <div className="form-group full-width">
                <div className="tips-card">
                  <h4>💡 Tips for a great profile:</h4>
                  <ul>
                    <li>Use a clear, professional profile photo</li>
                    <li>Upload relevant certificates and licenses</li>
                    <li>Be specific about your skills and experience</li>
                    <li>Keep your availability status updated</li>
                    <li>Add a detailed bio to attract clients</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button
              type="button"
              className="nav-btn prev-btn"
              onClick={prevStep}
            >
              <FaTimes /> Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              className="nav-btn next-btn"
              onClick={nextStep}
              disabled={!isStepValid()}
            >
              Next <FaCheckCircle />
            </button>
          ) : (
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !isStepValid()}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Update Profile
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdatingProfile;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentById, updateStudent} from "../../../features/student/studentThunks";
import { clearStudentMessages } from "../../../features/student/studentSlice";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { student, loading, error, successMessage } = useSelector((state) => state.student);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    faculty: "",
    department: "",
    phone: "",
    yearOfStudy: "",
    studentId: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileStats, setProfileStats] = useState({
    completedBookings: 0,
    totalReviews: 0,
    memberSince: "",
  });

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    if (studentId) {
      dispatch(getStudentById(studentId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        faculty: student.faculty || "",
        department: student.department || "",
        phone: student.phone || "",
        yearOfStudy: student.yearOfStudy || "",
        studentId: student.studentId || "",
      });

      // Set profile stats
      setProfileStats({
        completedBookings: student.completedBookings || 0,
        totalReviews: student.totalReviews || 0,
        memberSince: new Date(student.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        }),
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateStudent(formData)).then(() => {
      setIsEditing(false);
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF)');
        return;
      }

      if (file.size > maxSize) {
        alert('Image size should be less than 5MB');
        return;
      }

      setProfileImage(URL.createObjectURL(file));
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          dispatch(uploadProfilePicture({ studentId: student._id, imageFile: file }));
          setTimeout(() => setUploadProgress(0), 1000);
        }
      }, 100);
    }
  };

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => dispatch(clearStudentMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  const handleCancel = () => {
    setIsEditing(false);
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        faculty: student.faculty || "",
        department: student.department || "",
        phone: student.phone || "",
        yearOfStudy: student.yearOfStudy || "",
        studentId: student.studentId || "",
      });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p className="profile-subtitle">Manage your personal information and account settings</p>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          {successMessage}
        </div>
      )}

      <div className="profile-content">
        {/* Profile Overview */}
        <div className="profile-overview">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              <div className="avatar-large">
                {student?.profilePicture ? (
                  <img src={student.profilePicture} alt="Profile" />
                ) : (
                  <span>{student?.name?.charAt(0) || "U"}</span>
                )}
              </div>
              <div className="avatar-actions">
                <label htmlFor="profile-upload" className="btn-upload">
                  <span className="upload-icon">📷</span>
                  Upload Photo
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                {uploadProgress > 0 && (
                  <div className="upload-progress">
                    <div 
                      className="progress-bar"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="profile-info">
              <h2>{student?.name || "Student Name"}</h2>
              <p className="student-id">Student ID: {student?.studentId || "N/A"}</p>
              <p className="student-email">{student?.email || "No email provided"}</p>
              <div className="student-status">
                <span className="status-badge">Active</span>
                <span className="member-since">Member since {profileStats.memberSince}</span>
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{profileStats.completedBookings}</h3>
                <p>Completed Bookings</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{profileStats.totalReviews}</h3>
                <p>Reviews Given</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <h3>{student?.yearOfStudy || "N/A"}</h3>
                <p>Year of Study</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="profile-form-section">
          <div className="section-header">
            <h3>Personal Information</h3>
            {!isEditing ? (
              <button 
                className="btn-edit"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button 
                  className="btn-save"
                  form="profile-form"
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <form 
            id="profile-form"
            onSubmit={handleSubmit} 
            className={`profile-form ${isEditing ? 'editing' : ''}`}
          >
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Full Name
                  {isEditing && <span className="required">*</span>}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="form-value">{student?.name || "Not provided"}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    disabled // Usually email shouldn't be changed
                    placeholder="student@university.edu"
                  />
                ) : (
                  <div className="form-value">{student?.email || "Not provided"}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Student ID</label>
                <div className="form-value">{student?.studentId || "Not assigned"}</div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Phone Number
                  {isEditing && <span className="required">*</span>}
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="+1 (555) 123-4567"
                  />
                ) : (
                  <div className="form-value">{student?.phone || "Not provided"}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Faculty
                  {isEditing && <span className="required">*</span>}
                </label>
                {isEditing ? (
                  <select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select Faculty</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Business">Business</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Law">Law</option>
                  </select>
                ) : (
                  <div className="form-value">{student?.faculty || "Not provided"}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Department
                  {isEditing && <span className="required">*</span>}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="e.g., Computer Science"
                  />
                ) : (
                  <div className="form-value">{student?.department || "Not provided"}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Year of Study
                  {isEditing && <span className="required">*</span>}
                </label>
                {isEditing ? (
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                    <option value="5+">Year 5+</option>
                  </select>
                ) : (
                  <div className="form-value">Year {student?.yearOfStudy || "Not provided"}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="form-help">
                <p className="help-text">
                  <span className="required">*</span> Required fields
                </p>
                <div className="form-actions">
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-small"></span>
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Account Settings Section */}
          <div className="account-settings">
            <h3>Account Settings</h3>
            <div className="settings-list">
              <button className="setting-item">
                <span className="setting-icon">🔒</span>
                <div className="setting-content">
                  <h4>Change Password</h4>
                  <p>Update your password regularly for security</p>
                </div>
                <span className="setting-arrow">›</span>
              </button>
              <button className="setting-item">
                <span className="setting-icon">🔔</span>
                <div className="setting-content">
                  <h4>Notification Preferences</h4>
                  <p>Manage how you receive updates</p>
                </div>
                <span className="setting-arrow">›</span>
              </button>
              <button className="setting-item">
                <span className="setting-icon">👥</span>
                <div className="setting-content">
                  <h4>Privacy Settings</h4>
                  <p>Control your profile visibility</p>
                </div>
                <span className="setting-arrow">›</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
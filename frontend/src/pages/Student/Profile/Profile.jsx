// src/pages/Student/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentById, updateStudent } from "../../../features/student/studentThunks";
import { clearStudentMessages } from "../../../features/student/studentSlice";
import "./Profile.css"; // ✅ Import external CSS

const Profile = () => {
  const dispatch = useDispatch();
  const { student, loading, error, successMessage } = useSelector((state) => state.student);

  const [formData, setFormData] = useState({
    name: "",
    faculty: "",
    department: "",
    phone: "",
  });

  useEffect(() => {
    if (!student) {
      const studentId = localStorage.getItem("studentId");
      if (studentId) {
        dispatch(getStudentById(studentId));
      }
    } else {
      setFormData({
        name: student.name || "",
        faculty: student.faculty || "",
        department: student.department || "",
        phone: student.phone || "",
      });
    }
  }, [dispatch, student]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateStudent(formData));
  };

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => dispatch(clearStudentMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {loading && <p className="message">Loading...</p>}
      {error && <p className="message error">{error}</p>}
      {successMessage && <p className="message success">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="profile-form">
        <div>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Faculty</label>
          <input type="text" name="faculty" value={formData.faculty} onChange={handleChange} required />
        </div>

        <div>
          <label>Department</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} required />
        </div>

        <div>
          <label>Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;

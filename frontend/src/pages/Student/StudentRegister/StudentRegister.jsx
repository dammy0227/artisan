// src/pages/Auth/StudentRegister.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerStudent } from "../../../features/student/studentThunks";
import './register.css'

const StudentRegister = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    faculty: "",
    department: "",
    phone: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();
  const { successMessage, error } = useSelector((s) => s.student);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(registerStudent(formData));
  };

  useEffect(() => {
    if (successMessage && onSuccess) {
      onSuccess();   // ✅ tell parent "success happened"
    }
  }, [successMessage, onSuccess]);

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Student Registration</h2>

        <input type="text" placeholder="Full Name" className="register-input"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input type="email" placeholder="Email" className="register-input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input type="password" placeholder="Password" className="register-input"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <input type="text" placeholder="Faculty" className="register-input"
          value={formData.faculty}
          onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
        />
        <input type="text" placeholder="Department" className="register-input"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        />
        <input type="text" placeholder="Phone Number" className="register-input"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <button type="submit" className="register-button">Register</button>
        {submitted && error && <p className="register-error">{error}</p>}
      </form>
    </div>
  );
};

export default StudentRegister;

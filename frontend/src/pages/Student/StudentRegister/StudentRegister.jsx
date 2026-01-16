import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerStudent } from "../../../features/student/studentThunks";
import './register.css';

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
  const { successMessage, error, loading } = useSelector((s) => s.student);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(registerStudent(formData));
  };

  useEffect(() => {
    if (successMessage && onSuccess) {
      onSuccess();
    }
  }, [successMessage, onSuccess]);

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-card">
        <h2 className="register-heading">Student Registration</h2>

        {submitted && error && <p className="form-error">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="form-input"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="form-input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="form-input"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="Faculty"
          className="form-input"
          value={formData.faculty}
          onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
        />
        <input
          type="text"
          placeholder="Department"
          className="form-input"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="form-input"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <button type="submit" className="form-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default StudentRegister;

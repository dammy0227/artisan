// src/pages/Auth/StudentLogin.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginStudent } from "../../../features/student/studentThunks";
import { useNavigate } from "react-router-dom";
import "./StudentLogin.css";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, error, loading } = useSelector((s) => s.student);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(loginStudent(formData));
  };

  useEffect(() => {
    if (token) navigate("/student/dashboard");
  }, [token, navigate]);

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Student Login</h2>

        {submitted && error && <p className="login-error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default StudentLogin;

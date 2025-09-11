import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../../../features/admin/adminThunks";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, error, loading } = useSelector((s) => s.admin);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(loginAdmin(formData));
  };

  useEffect(() => {
    if (token) navigate("/admin/dashboard");
  }, [token, navigate]);

  return (
    <div className="adminlogin-container">
      <form onSubmit={handleSubmit} className="adminlogin-form">
        <h2 className="login-title">Admin Login</h2>

        {submitted && error && <p className="adminlogin-error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="admilogin-input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="adminlogin-input"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <button type="submit" className="adminlogin-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

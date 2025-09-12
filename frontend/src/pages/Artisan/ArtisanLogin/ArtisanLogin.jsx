import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginArtisan } from "../../../features/artisan/artisanThunks";
import { useNavigate } from "react-router-dom";
import "./Artisanlogin.css";


const ArtisanLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, error, loading } = useSelector((s) => s.artisan);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(loginArtisan(formData));
  };

  useEffect(() => {
    if (token) navigate("/artisan/dashboard");
  }, [token, navigate]);

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Artisan Login</h2>

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

export default ArtisanLogin;

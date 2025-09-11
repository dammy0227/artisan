// src/pages/artisan/ArtisanLanding.jsx
import React, { useState } from "react";
import { Link } from "react-scroll";
import { FaBars, FaTimes } from "react-icons/fa";
import "./ArtisanLanding.css";
import ArtisanRegister from "../ArtisanRegister/ArtisanRegister";
import ArtisanLogin from "../ArtisanLogin/ArtisanLogin";
import Modal from "../../Student/Modal/Modal";
import { useDispatch } from "react-redux";
import { clearArtisanMessages } from "../../../features/artisan/artisanSlice";
import './ArtisanLanding.css'

const ArtisanLanding = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useDispatch();

  const openRegister = () => {
    dispatch(clearArtisanMessages()); // ✅ clear old messages before opening
    setShowRegister(true);
  };

  const openLogin = () => {
    dispatch(clearArtisanMessages()); // ✅ same for login
    setShowLogin(true);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-icon">
          <h3>
            <Link to="home">
              Mapoly
            </Link>
          </h3>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="section home-container">
        <div className="home-wrapper">
          <div className="home-text">
            <h1>Connect With Students Anytime, Anywhere</h1>
            <p>
              Join our platform to showcase your skills, connect with students, and
              grow your career.
            </p>
            <div className="button">
              <button className="home-button" onClick={openRegister}>
                Get Started
              </button>
              <button className="home-button" onClick={openLogin}>
                Login Now
              </button>
            </div>
          </div>
          <div className="home-image">
           <img src="https://mobilenig.com/assets/img/hero.png" alt="" />
         </div>
        </div>
      </section>

      {/* Register Modal */}
      <Modal
        isOpen={showRegister}
        onClose={() => {
          setShowRegister(false);
          dispatch(clearArtisanMessages()); // ✅ reset on close too
        }}
      >
        <ArtisanRegister />
      </Modal>

      {/* Login Modal */}
      <Modal
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false);
          dispatch(clearArtisanMessages()); // ✅ reset on close too
        }}
      >
        <ArtisanLogin />
      </Modal>
    </div>
  );
};

export default ArtisanLanding;

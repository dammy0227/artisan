import React, { useState } from "react";
import { FaBars, FaTimes, FaInstagram, FaFacebookF, FaTwitter, FaTiktok, FaLinkedinIn } from "react-icons/fa";
import "./ArtisanLanding.css";
import Modal from "../../Student/Modal/Modal";
import ArtisanRegister from "../ArtisanRegister/ArtisanRegister";
import ArtisanLogin from "../ArtisanLogin/ArtisanLogin";
import { useDispatch } from "react-redux";
import { clearArtisanMessages } from "../../../features/artisan/artisanSlice";
import img from "../../../assets/artisan3.png";
import img1 from "../../../assets/artisan.png";

const ArtisanLanding = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="landing-wrapper">
      {/* NAVBAR */}
      <nav className="landing-navbar">
        <div className="landing-icon">
          <img src={img1} alt="logo" />
        </div>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>
      </nav>

      {/* HERO */}
      <section className="section home-container">
        <div className="home-wrapper">
          <div className="home-text">
            <h1>
              Grow Your Skills <br />
              <span>Get More Jobs</span>
            </h1>

            <p>
              Join thousands of artisans connecting with real customers.
              Showcase your skills, accept bookings, and grow your income.
            </p>

            <div className="home-actions">
              <button
                className="home-btn primary"
                onClick={() => {
                  dispatch(clearArtisanMessages());
                  setShowRegister(true);
                }}
              >
                Join as Artisan
              </button>

              <button
                className="home-btn secondary"
                onClick={() => {
                  dispatch(clearArtisanMessages());
                  setShowLogin(true);
                }}
              >
                Login
              </button>
            </div>
          </div>

          {/* IMAGE + COMMENTS */}
          <div className="home-image">
            <img src={img} alt="artisan" />

<div className="comment-bubble bubble-1">
  <div className="bubble-header">
    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Doe" />
    <span className="bubble-name">John Doe</span>
  </div>
  <p>“Got my first job in 24hrs!”</p>
</div>

<div className="comment-bubble bubble-2">
  <div className="bubble-header">
    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Jane Smith" />
    <span className="bubble-name">Jane Smith</span>
  </div>
  <p>“Clients message me daily now”</p>
</div>

<div className="comment-bubble bubble-3">
  <div className="bubble-header">
    <img src="https://randomuser.me/api/portraits/men/55.jpg" alt="Mike Lee" />
    <span className="bubble-name">Mike Lee</span>
  </div>
  <p>“This platform changed my income”</p>
</div>

          </div>
        </div>

  {/* SOCIAL FOOTER */}
      <footer className="landing-footer">
        {/* <p>Follow & Connect With Us</p> */}
        <div className="social-icons">
          <FaInstagram />
          <FaFacebookF />
          <FaTwitter />
          <FaTiktok />
          <FaLinkedinIn />
        </div>
      </footer>
      </section>

    

      {/* REGISTER MODAL */}
      <Modal
        isOpen={showRegister}
        onClose={() => {
          setShowRegister(false);
          dispatch(clearArtisanMessages());
        }}
      >
        <ArtisanRegister />
      </Modal>

      {/* LOGIN MODAL */}
      <Modal
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false);
          dispatch(clearArtisanMessages());
        }}
      >
        <ArtisanLogin />
      </Modal>
    </div>
  );
};

export default ArtisanLanding;

import React, { useState } from "react";
import { Link } from "react-scroll";
import { FaBars, FaTimes } from "react-icons/fa";
import "./LandingPage.css";
import ServicesOffered from "../ServicesOffered/ServicesOffered";
import About from "../About/About";
import Testimonials from "../testimonials/testimonials";
import ContactForm from "../Contact/Contact";
import Footer from "../Footer/Footer";
import Modal from '../../Student/Modal/Modal'
import StudentRegister from "../../Student/StudentRegister/StudentRegister";
import StudentLogin from "../../Student/StudentLogin/StudentLogin";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearStudentMessages } from "../../../features/student/studentSlice"; 
import img from '../../../assets/artisan2.png'
import img1 from '../../../assets/artisan.png'

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const openRegister = () => {
    dispatch(clearStudentMessages());   
    setShowRegister(true);
  };

  const openLogin = () => {
    dispatch(clearStudentMessages()); 
    setShowLogin(true);
  };

  return (
    <div>
    
      <nav className="landing-navbar">
        <div className="landing-icon">
          <img src={img1}  alt="" /> 
        </div>

        <ul className={`landing-nav-list ${menuOpen ? "active-menu" : ""}`}>
          <li><Link to="home" smooth duration={500} spy activeClass="active" onClick={closeMenu}>Home</Link></li>
          <li><Link to="service" smooth duration={500} spy activeClass="active" onClick={closeMenu}>Services</Link></li>
          <li><Link to="about" smooth duration={500} spy activeClass="active" onClick={closeMenu}>About</Link></li>
          <li><Link to="contact" smooth duration={500} spy activeClass="active" onClick={closeMenu}>Testimonials</Link></li>
          <li><Link to="api" smooth duration={500} spy activeClass="active" onClick={closeMenu}>Contact</Link></li>
        </ul>

        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>
      </nav>


      {/* Hero Section */}
      <section id="home" className="section home-container">
        <div className="home-wrapper">
        <div className="home-text">
  <h1>
    Find Skilled Artisans <br />
    <span>Anytime, Anywhere</span>
  </h1>

  <p>
    Book trusted professionals for your projects, repairs,
    and personal needs — fast, reliable, and hassle-free.
  </p>

  <div className="home-actions">
    <button className="home-btn primary" onClick={openRegister}>
      Get Started
    </button>
    <button className="home-btn secondary" onClick={openLogin}>
      Login Now
    </button>
  </div>
</div>


          <div className="home-image">
            {/* <img src="https://mobilenig.com/assets/img/hero.png" alt="" /> */}
            <img src={img} alt="" />
          </div>
        </div>
      </section>

      <section id="service" className="section"><ServicesOffered /></section>
      <section id="about" className="section"><About /></section>
      <section id="contact" className="section"><Testimonials /></section>
      <section id="api" className="section"><ContactForm /></section>
      <footer className="footer"><Footer /></footer>

    
      <Modal
        isOpen={showRegister}
        onClose={() => {
          setShowRegister(false);
          dispatch(clearStudentMessages()); 
        }}
      >
        <StudentRegister
          onSuccess={() => {
            setShowRegister(false);
            navigate("/student/dashboard");
          }}
        />
      </Modal>

    
      <Modal
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false);
          dispatch(clearStudentMessages());
        }}
      >
        <StudentLogin />
      </Modal>
    </div>
  );
};

export default LandingPage;

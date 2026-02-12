// LandingPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { FaBars, FaTimes, FaArrowRight, FaStar, FaShieldAlt, FaClock, FaUserCheck } from "react-icons/fa";
import "./LandingPage.css";
import ServicesOffered from "../ServicesOffered/ServicesOffered";
import About from "../About/About";
import Testimonials from "../testimonials/testimonials";
import ContactForm from "../Contact/Contact";
import Footer from "../Footer/Footer";
import Modal from '../../Student/Modal/Modal';
import StudentRegister from "../../Student/StudentRegister/StudentRegister";
import StudentLogin from "../../Student/StudentLogin/StudentLogin";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearStudentMessages } from "../../../features/student/studentSlice"; 
import heroImage from '../../../assets/artisan2.png';
import logoImage from '../../../assets/artisan.png';

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to trigger animations for all section components
  const triggerSectionAnimation = (sectionId) => {
    // Create and dispatch custom event for the specific section
    const event = new CustomEvent('triggerSectionAnimation', {
      detail: { sectionId }
    });
    window.dispatchEvent(event);
    
    // Also update hash to help with direct navigation
    window.location.hash = sectionId;
  };

  // Navigation handler for all links
  const handleNavClick = (sectionId) => {
    closeMenu();
    
    // Small delay to ensure scroll completes before triggering animation
    setTimeout(() => {
      triggerSectionAnimation(sectionId);
    }, 300);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'service', 'about', 'contact', 'api'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to handle initial URL hash
  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      setTimeout(() => {
        triggerSectionAnimation(sectionId);
      }, 500);
    }
  }, []);

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

  const stats = [
    { value: "2,500+", label: "Active Artisans", icon: <FaUserCheck /> },
    { value: "10k+", label: "Jobs Completed", icon: <FaStar /> },
    { value: "98%", label: "Satisfaction Rate", icon: <FaShieldAlt /> },
    { value: "24/7", label: "Support", icon: <FaClock /> }
  ];

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="landing-icon">
            <img src={logoImage} alt="SkillLink" />
            <span className="brand-name">Skill<span>Link</span></span>
          </div>

          <ul className={`landing-nav-list ${menuOpen ? "active-menu" : ""}`}>
            <li>
              <Link 
                to="home" 
                smooth 
                duration={500} 
                spy 
                activeClass="active" 
                onClick={() => handleNavClick('home')}
                className={activeSection === 'home' ? 'active' : ''}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="service" 
                smooth 
                duration={500} 
                spy 
                activeClass="active" 
                onClick={() => handleNavClick('service')}
                className={activeSection === 'service' ? 'active' : ''}
              >
                Services
              </Link>
            </li>
            <li>
              <Link 
                to="about" 
                smooth 
                duration={500} 
                spy 
                activeClass="active" 
                onClick={() => handleNavClick('about')}
                className={activeSection === 'about' ? 'active' : ''}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="contact" 
                smooth 
                duration={500} 
                spy 
                activeClass="active" 
                onClick={() => handleNavClick('contact')}
                className={activeSection === 'contact' ? 'active' : ''}
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link 
                to="api" 
                smooth 
                duration={500} 
                spy 
                activeClass="active" 
                onClick={() => handleNavClick('api')}
                className={activeSection === 'api' ? 'active' : ''}
              >
                Contact
              </Link>
            </li>
          </ul>

          <div className="navbar-right">
            <button className="login-btn-mobile" onClick={openLogin}>Login</button>
            <div className="menu-icon" onClick={toggleMenu}>
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-background">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>

        <div className="hero-container">
          <div className="hero-content animate-slide-in-left">
            <div className="hero-badge">
              <span className="badge-pulse">⚡</span>
              Trusted by 10,000+ Users
            </div>
            
            <h1 className="hero-title">
              Find Skilled Artisans
              <span className="gradient-text">Anytime, Anywhere</span>
            </h1>

            <p className="hero-description">
              Book trusted professionals for your projects, repairs, and personal needs — 
              fast, reliable, and hassle-free. Join thousands of satisfied customers.
            </p>

            <div className="hero-actions">
              <button className="hero-btn primary" onClick={openRegister}>
                Get Started
                <FaArrowRight className="btn-icon" />
              </button>
              <button className="hero-btn secondary" onClick={openLogin}>
                Login Now
              </button>
            </div>

            <div className="hero-stats-preview">
              {stats.slice(0, 3).map((stat, index) => (
                <div className="stat-preview-item" key={index}>
                  <span className="stat-preview-value">{stat.value}</span>
                  <span className="stat-preview-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual animate-slide-in-right">
            <div className="hero-image-wrapper">
              <img src={heroImage} alt="Artisan at work" className="hero-image" />
              
              <div className="floating-card card-1">
                <div className="floating-card-icon">🛠️</div>
                <div className="floating-card-content">
                  <h4>2,500+</h4>
                  <p>Active Artisans</p>
                </div>
              </div>
              
              <div className="floating-card card-2">
                <div className="floating-card-icon">⭐</div>
                <div className="floating-card-content">
                  <h4>4.9</h4>
                  <p>Average Rating</p>
                </div>
              </div>
              
              <div className="floating-card card-3">
                <div className="floating-card-icon">⚡</div>
                <div className="floating-card-content">
                  <h4>24/7</h4>
                  <p>Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <Link 
            to="service" 
            smooth 
            duration={500}
            onClick={() => handleNavClick('service')}
          >
            <div className="mouse">
              <div className="wheel"></div>
            </div>
            <span>Scroll Down</span>
          </Link>
        </div>
      </section>

      {/* Sections */}
      <section id="service" className="section">
        <ServicesOffered />
      </section>

      <section id="about" className="section">
        <About />
      </section>

      <section id="contact" className="section">
        <Testimonials />
      </section>

      <section id="api" className="section">
        <ContactForm />
      </section>

      <footer className="footer">
        <Footer />
      </footer>

      {/* Modals */}
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
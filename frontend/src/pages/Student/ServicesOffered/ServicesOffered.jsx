// ServicesOffered.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaSearch, FaTools, FaHome, FaPaintBrush, FaBolt, FaWrench, FaCut } from "react-icons/fa";
import "./ServicesOffered.css";

const services = [
  {
    title: "Electricians",
    desc: "Professional wiring, repairs, and electrical installations",
    icon: <FaBolt />,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)"
  },
  {
    title: "Carpenters",
    desc: "Custom furniture, repairs, and expert woodwork",
    icon: <FaTools />,
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.1)"
  },
  {
    title: "Plumbers",
    desc: "Fix leaks, install fittings, manage plumbing needs",
    icon: <FaWrench />,
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.1)"
  },
  {
    title: "Tailors",
    desc: "Custom designs, alterations, and perfect fits",
    icon: <FaCut />,
    color: "#ec4899",
    bg: "rgba(236, 72, 153, 0.1)"
  },
  {
    title: "Painters",
    desc: "Interior, exterior, and decorative painting",
    icon: <FaPaintBrush />,
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)"
  },
  {
    title: "Mechanics",
    desc: "Vehicle repair and maintenance services",
    icon: <FaHome />,
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.1)"
  }
];

const ServicesOffered = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  // Function to trigger animation
  const triggerAnimation = () => {
    if (!hasAnimated) {
      setIsVisible(true);
      setHasAnimated(true);
    }
  };

  useEffect(() => {
    // Function to handle custom animation trigger from navigation
    const handleTriggerAnimation = (event) => {
      if (event.detail.sectionId === 'service' && !hasAnimated) {
        setTimeout(() => {
          triggerAnimation();
        }, 300); // Small delay to allow scroll to complete
      }
    };

    // Check if section is already visible on mount
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const isElementInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
      if (isElementInView) {
        triggerAnimation();
      }
    }

    // Intersection Observer for scroll detection
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggerAnimation();
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Listen for hash changes (navigation clicks) - keeping as fallback
    const handleHashChange = () => {
      if (window.location.hash === '#service' && !hasAnimated) {
        setTimeout(() => {
          triggerAnimation();
        }, 300);
      }
    };

    // Listen for custom animation trigger from navigation
    window.addEventListener('triggerSectionAnimation', handleTriggerAnimation);
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash
    if (window.location.hash === '#service' && !hasAnimated) {
      setTimeout(() => {
        triggerAnimation();
      }, 300);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      window.removeEventListener('triggerSectionAnimation', handleTriggerAnimation);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [hasAnimated]);

  // Additional effect to handle scroll spy navigation
  useEffect(() => {
    const handleScroll = () => {
      if (!hasAnimated && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isElementInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
        if (isElementInView) {
          triggerAnimation();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  // Reset animation when component unmounts/remounts (optional)
  useEffect(() => {
    return () => {
      setIsVisible(false);
      setHasAnimated(false);
    };
  }, []);

  return (
    <section 
      className={`services-section ${isVisible ? 'animate-in' : ''}`} 
      id="services"
      ref={sectionRef}
    >
      <div className="services-container">
        {/* Header */}
        <div className={`services-header ${isVisible ? 'animate-header' : ''}`}>
          <div className="services-header-left">
            <span className="services-badge">OUR SERVICES</span>
            <h2 className="services-title">
              Professional Services <span>At Your Fingertips</span>
            </h2>
            <p className="services-description">
              Connect with skilled artisans across various fields. From home repairs to personal services, 
              we've got you covered with verified professionals.
            </p>
          </div>
          <button className="services-explore-btn">
            Explore All Services
            <FaArrowRight className="btn-icon" />
          </button>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              className={`service-card ${isVisible ? `animate-card-${index + 1}` : ''}`}
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                borderColor: hoveredIndex === index ? service.color : '#e2e8f0',
                boxShadow: hoveredIndex === index ? `0 20px 40px -12px ${service.color}20` : 'none'
              }}
            >
              <div 
                className="service-icon-wrapper"
                style={{ 
                  background: service.bg,
                  color: service.color
                }}
              >
                {service.icon}
              </div>
              
              <div className="service-content">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>

              <button 
                className="service-link"
                style={{ color: service.color }}
              >
                Book Now
                <FaArrowRight className="link-icon" />
              </button>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className={`services-stats ${isVisible ? 'animate-stats' : ''}`}>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Active Artisans</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOffered;
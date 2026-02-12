// About.jsx
import React from 'react';
import { FaCheckCircle, FaUsers, FaClock, FaShieldAlt } from "react-icons/fa";
import './About.css';

const About = () => {
  const features = [
    { icon: <FaCheckCircle />, title: "Affordable", desc: "Student-friendly pricing with no hidden fees" },
    { icon: <FaShieldAlt />, title: "Trusted", desc: "Verified artisans with authentic reviews" },
    { icon: <FaClock />, title: "24/7 Access", desc: "Book anytime from your phone or desktop" },
    { icon: <FaUsers />, title: "Fast Connection", desc: "Get matched with professionals in minutes" }
  ];

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-header">
          <span className="about-badge">WHY CHOOSE US</span>
          <h2 className="about-title">
            The Smart Way to <span>Connect & Grow</span>
          </h2>
          <p className="about-subtitle">
            We're revolutionizing how people find skilled professionals and how artisans build their businesses.
          </p>
        </div>

        <div className="about-content">
          <div className="about-stats">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>2,500+</h3>
                <p>Verified Artisans</p>
              </div>
              <div className="stat-card">
                <h3>10k+</h3>
                <p>Jobs Completed</p>
              </div>
              <div className="stat-card">
                <h3>98%</h3>
                <p>Satisfaction Rate</p>
              </div>
              <div className="stat-card">
                <h3>24/7</h3>
                <p>Support Available</p>
              </div>
            </div>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-info">
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
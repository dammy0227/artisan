import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
   
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            We make it easy for students and individuals to connect with
            trusted artisans — from electricians and carpenters to tailors,
            plumbers, and more. Affordable, reliable, and convenient services
            right at your fingertips.
          </p>
        </div>

    
        <div className="footer-section">
          <h3>Our Services</h3>
          <ul>
            <li>Electrical Repairs</li>
            <li>Carpentry & Furniture</li>
            <li>Plumbing & Maintenance</li>
            <li>Tailoring & Fashion</li>
            <li>Painting & Renovation</li>
            <li>Mechanics & Auto Repairs</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>📍 Lagos, Nigeria</p>
          <p>📞 +234 800 123 4567</p>
          <p>📧 support@artisanconnect.com</p>
        </div>

 
        <div className="footer-section">
          <h3>Get in Touch</h3>
          <p>Follow us on social media and get our app:</p>
          <div className="app-links">
            <button className="app-btn">Google Play</button>
            <button className="app-btn">App Store</button>
          </div>
        </div>
      </div>

     
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ArtisanConnect. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

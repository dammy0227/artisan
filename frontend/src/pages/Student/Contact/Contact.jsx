// ContactForm.jsx
import React, { useState } from "react";
import { FaPaperPlane, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaClock } from "react-icons/fa";
import "./Contact.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: "", email: "", phone: "", message: "" });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, title: "Visit Us", detail: "123 Innovation Street, Tech City, TC 12345" },
    { icon: <FaEnvelope />, title: "Email Us", detail: "support@skilllink.com" },
    { icon: <FaPhoneAlt />, title: "Call Us", detail: "+1 (555) 123-4567" },
    { icon: <FaClock />, title: "Working Hours", detail: "Mon - Sat: 8:00 AM - 8:00 PM" }
  ];

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <span className="contact-badge">GET IN TOUCH</span>
          <h2 className="contact-title">
            Ready to Get Started? <span>Contact Us Today</span>
          </h2>
          <p className="contact-subtitle">
            Have questions about our services? Need help with a booking? 
            Our team is here to help you 24/7.
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Info Cards */}
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div className="info-card" key={index}>
                <div className="info-icon">{info.icon}</div>
                <div className="info-details">
                  <h3>{info.title}</h3>
                  <p>{info.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form & Map Section */}
          <div className="contact-form-wrapper">
            <div className="form-container">
              <h3>Send us a Message</h3>
              <p className="form-description">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send Message
                      <FaPaperPlane className="btn-icon" />
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="success-message">
                    ✓ Thank you! Your message has been sent successfully.
                  </div>
                )}
              </form>
            </div>

            <div className="map-container">
              <iframe
                title="location-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-73.98510768458414!3d40.75889697932645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                allowFullScreen=""
                loading="lazy"
               
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
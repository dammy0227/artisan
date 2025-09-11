import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./Contact.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formData, "YOUR_PUBLIC_KEY")
      .then(
        (result) => {
          console.log(result.text);
          alert("Message sent successfully ✅");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error(error.text);
          alert("Something went wrong ❌");
        }
      );
  };

  return (
    <section className="contact-section" id="contact">
      <h1>Contact Us</h1>
      <p className="contact-subtitle">
        Get in touch with us — we’ll respond as soon as possible.
      </p>

      <div className="contact-wrapper">
        {/* Left Side - Image */}
        <div className="contact-image">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL5mqoqlMvt1_W3RcLb4JjXeS2rI5p0ofRmg&s"
          />
        </div>

        {/* Right Side - Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;

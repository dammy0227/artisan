// Testimonials.jsx
import React, { useRef } from "react";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight, FaQuoteRight, FaStar } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./testimonials2.css";

const testimonials = [
  {
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "John Smith",
    role: "Homeowner",
    comment: "Found an amazing electrician within minutes. The work was professional and the pricing was transparent. Definitely my go-to platform for home services.",
    rating: 5
  },
  {
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Emily Johnson",
    role: "Interior Designer",
    comment: "As a professional, I need reliable artisans for my projects. This platform has never disappointed. The quality of work is consistently excellent.",
    rating: 5
  },
  {
    img: "https://randomuser.me/api/portraits/men/55.jpg",
    name: "Michael Adams",
    role: "Property Manager",
    comment: "Managing multiple properties is challenging, but this service makes it easy. Quick responses, fair prices, and great results every time.",
    rating: 5
  },
  {
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Sophia Brown",
    role: "Small Business Owner",
    comment: "The carpenter we hired through this platform transformed our office space. The booking process was seamless and the craftsmanship was top-notch.",
    rating: 5
  },
  {
    img: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "David Wilson",
    role: "Restaurant Owner",
    comment: "Emergency plumbing at 10 PM? They had someone at my restaurant within an hour. Saved our evening service. Incredible response time.",
    rating: 5
  },
  {
    img: "https://randomuser.me/api/portraits/women/50.jpg",
    name: "Olivia Martinez",
    role: "New Homeowner",
    comment: "As a first-time homeowner, I needed multiple services. This platform connected me with trustworthy professionals for painting, electrical, and more.",
    rating: 5
  }
];

const Testimonials = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-container">
        {/* Header */}
        <div className="testimonials-header">
          <div className="header-left">
            <span className="testimonials-badge">TESTIMONIALS</span>
            <h2 className="testimonials-title">
              Trusted by Thousands of <span>Happy Customers</span>
            </h2>
            <p className="testimonials-subtitle">
              Don't just take our word for it — hear from some of our satisfied users
            </p>
          </div>
          
          <div className="testimonials-nav">
            <button 
              className="nav-btn prev-btn"
              onClick={() => sliderRef.current?.slickPrev()}
            >
              <FaArrowLeft />
            </button>
            <button 
              className="nav-btn next-btn"
              onClick={() => sliderRef.current?.slickNext()}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="testimonials-slider-wrapper">
          <Slider ref={sliderRef} {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-slide">
                <div className="testimonial-card">
                  <div className="testimonial-quote">
                    <FaQuoteRight />
                  </div>
                  
                  <div className="testimonial-profile">
                    <img src={testimonial.img} alt={testimonial.name} />
                    <div className="profile-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>

                  <p className="testimonial-comment">
                    "{testimonial.comment}"
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Trust Badges */}
        <div className="trust-badges">
          <div className="badge-item">
            <span className="badge-number">4.9</span>
            <div className="badge-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <span className="badge-label">Average Rating</span>
          </div>
          <div className="badge-divider"></div>
          <div className="badge-item">
            <span className="badge-number">10k+</span>
            <span className="badge-label">Verified Reviews</span>
          </div>
          <div className="badge-divider"></div>
          <div className="badge-item">
            <span className="badge-number">98%</span>
            <span className="badge-label">Would Recommend</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
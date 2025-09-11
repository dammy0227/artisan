import React from 'react'
import './About.css'
import {FaCheckCircle } from "react-icons/fa";

const About = () => {
  return (
    <div className='about-container'>
      <div className="about-wrapper">
            <div className="about-image">
             <h1> DETAILS _ <span>WHY CHOOSE US ?</span></h1>
             <img src="https://mobilenig.com/assets/img/services/why_mobilenig.jpg" alt="" className='about-img'/>
            </div>
            <div className="about-text">
                  <h1>Why Choose Artisan ?</h1>
                  <p><FaCheckCircle className="check-icon" /> Affordable – Student-friendly pricing.</p>
                  <p><FaCheckCircle className="check-icon" /> Trusted – Verified artisans with reviews.</p>
                 <p><FaCheckCircle className="check-icon" /> Convenient – Book anytime from your phone.</p>
                 <p><FaCheckCircle className="check-icon" /> Fast – Get connected in minutes.</p>
            </div>
      </div>
    </div>
  )
}

export default About
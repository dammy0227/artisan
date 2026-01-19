import React from "react";
import "./Artisan.css";
import img from '../../assets/artisan.png'

const ArtisanLayout = ({ activeTab, setActiveTab, handleLogout, children }) => {
  return (
    <div className="artisan-container">
      <aside className="artisan-sidebar">
        <div className="landing-icon">
            <img src={img} alt="" />
        </div>
        <nav className="artisan-nav">
          <button
            className={`artisan-button ${activeTab === "booking" ? "active" : ""}`}
            onClick={() => setActiveTab("booking")}
          > 
            My Bookings
          </button>
          {/* <button
            className={`artisan-button ${activeTab === "updateProfile" ? "active" : ""}`}
            onClick={() => setActiveTab("updateProfile")}
          >
            Update Profile
          </button> */}
          <button
            className={`artisan-button ${activeTab === "reviewRating" ? "active" : ""}`}
            onClick={() => setActiveTab("reviewRating")}
          >
            Review Rating
          </button>
          <button
            className={`artisan-button ${activeTab === "Post" ? "active" : ""}`}
            onClick={() => setActiveTab("Post")}
          >
            My Work
          </button>
            <button
            className={`artisan-button ${activeTab === "updateProfile" ? "active" : ""}`}
            onClick={() => setActiveTab("updateProfile")}
          >
            Update Profile
          </button>
          <button
            className="artisan-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="artisan-main">{children}</main>
    </div>
  );
};

export default ArtisanLayout;

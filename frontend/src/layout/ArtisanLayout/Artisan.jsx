import React from "react";
import "./Artisan.css";

const ArtisanLayout = ({ activeTab, setActiveTab, handleLogout, children }) => {
  return (
    <div className="artisan-container">
      {/* Sidebar */}
      <aside className="artisan-sidebar">
        <h2>Artisan</h2>
        <nav className="artisan-nav">
          <button
            className={`artisan-button ${activeTab === "booking" ? "active" : ""}`}
            onClick={() => setActiveTab("booking")}
          >
            Bookings
          </button>
          <button
            className={`artisan-button ${activeTab === "updateProfile" ? "active" : ""}`}
            onClick={() => setActiveTab("updateProfile")}
          >
            Update Profile
          </button>
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
            Post
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

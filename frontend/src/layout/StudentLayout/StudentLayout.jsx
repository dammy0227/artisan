import React from "react";
import './StudentLayout.css'
import img from '../../assets/artisan.png'

const StudentLayout = ({ activeTab, setActiveTab, handleLogout, children }) => {
  return (
    <div className="students-container">
      {/* Sidebar */}
      <aside className="student-sidebar">
        <div className="landing-icon">
          <img src={img} alt="" />
        </div>
        <nav className="student-nav">
          <button
            className={`student-button ${activeTab === "bookArtisan" ? "active" : ""}`}
            onClick={() => setActiveTab("bookArtisan")}
          >
            Book Artisan
          </button>
          <button
            className={`student-button ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>

           <button
            className={`student-button ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>

          <button
            className={`student-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          {/* <button
            className={`student-button ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button> */}
          <button
            className="student-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div>
        <main className="student-main">{children}</main>
      </div>
    </div>
  );
};

export default StudentLayout;

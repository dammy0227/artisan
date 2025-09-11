import React from "react";
import './StudentLayout.css'

const StudentLayout = ({ activeTab, setActiveTab, handleLogout, children }) => {
  return (
    <div className="student-container">
      {/* Sidebar */}
      <aside className="student-sidebar">
        <h2>Student</h2>
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
            className={`student-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`student-button ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
          <button
            className="student-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="student-main">{children}</main>
    </div>
  );
};

export default StudentLayout;

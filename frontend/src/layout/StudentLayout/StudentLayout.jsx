import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaSearch,
  FaClipboardList,
  FaStar,
  FaUserEdit,
  FaUserGraduate
} from "react-icons/fa";
import './StudentLayout.css'

const StudentLayout = ({ activeTab, setActiveTab, handleLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Define navigation items
  const navItems = [
    { id: "bookArtisan", label: "Book Artisan", icon: <FaSearch /> },
    { id: "bookings", label: "My Bookings", icon: <FaClipboardList /> },
    { id: "reviews", label: "Give Reviews", icon: <FaStar /> },
    { id: "profile", label: "Profile", icon: <FaUserEdit /> },
  ];

  return (
    <div className="students-container">
      {/* MOBILE HEADER */}
      <header className="student-mobile-header">
        <button
          className="student-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <FaBars size={22} />
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
            <FaUserGraduate style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Student Panel
          </span>
        </div>
      </header>

      {/* OVERLAY */}
      {sidebarOpen && isMobile && (
        <div
          className="student-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`student-sidebar ${sidebarOpen ? "open" : ""}`}>
        <button
          className="student-close-btn"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <FaTimes size={18} />
        </button>

        <div className="student-sidebar-header">
          <h2>Student Panel</h2>
        </div>

        <nav className="student-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`student-button ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setSidebarOpen(false);
              }}
              aria-current={activeTab === item.id ? "page" : undefined}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom logout */}
        <div className="student-bottom">
          <button
            className="student-button logout-button"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="student-main">
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;
import React, { useState, useEffect } from "react";
import "./Artisan.css";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaClipboardList,
  FaStar,
  FaUserEdit,
  FaBriefcase,
  FaHammer
} from "react-icons/fa";

const ArtisanLayout = ({ activeTab, setActiveTab, handleLogout, children }) => {
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
    { id: "booking", label: "My Bookings", icon: <FaClipboardList /> },
    { id: "reviewRating", label: "Review Rating", icon: <FaStar /> },
    { id: "Post", label: "My Work", icon: <FaBriefcase /> },
    { id: "updateProfile", label: "Update Profile", icon: <FaUserEdit /> },
  ];

  return (
    <div className="artisan-container">
      {/* MOBILE HEADER */}
      <header className="artisan-mobile-header">
        <button
          className="artisan-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <FaBars size={22} />
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
            <FaHammer style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Artisan Panel
          </span>
        </div>
      </header>

      {/* OVERLAY */}
      {sidebarOpen && isMobile && (
        <div
          className="artisan-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`artisan-sidebar ${sidebarOpen ? "open" : ""}`}>
        <button
          className="artisan-close-btn"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <FaTimes size={18} />
        </button>

        <div className="artisan-sidebar-header">
          <h2>Artisan Panel</h2>
        </div>

        <nav className="artisan-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`artisan-button ${activeTab === item.id ? "active" : ""}`}
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
        <div className="artisan-bottom">
          <button
            className="artisan-button logout-button"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="artisan-main">
        {children}
      </main>
    </div>
  );
};

export default ArtisanLayout;
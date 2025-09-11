import React from "react";
import "./AdminLayout.css";

const AdminLayout = ({ activeTab, setActiveTab, handleLogout, children }) => {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav className="admin-nav">
          <button
            className={`admin-button ${activeTab === "chart" ? "active" : ""}`}
            onClick={() => setActiveTab("chart")}
          >
            Chart
          </button>
          <button
            className={`admin-button ${activeTab === "approve" ? "active" : ""}`}
            onClick={() => setActiveTab("approve")}
          >
            Approve Artisan
          </button>
          <button
            className={`admin-button ${activeTab === "students" ? "active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            View Students
          </button>
          <button
            className="admin-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;

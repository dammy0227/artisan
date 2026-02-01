import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllArtisans,
  approveArtisan,
  rejectArtisan,
} from "../../../features/admin/adminThunks";
import { clearAdminMessages } from "../../../features/admin/adminSlice";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaClock,
  FaUserCheck,
  FaUserTimes,
  FaFilter
} from "react-icons/fa";
import "./ApproveArtisan.css";

const ApproveArtisan = () => {
  const dispatch = useDispatch();
  const { artisans = [], loading, error, successMessage } = useSelector(
    (state) => state.admin
  );
  
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllArtisans());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      showToast(successMessage, "success");
      dispatch(clearAdminMessages());
    }
    if (error) {
      showToast(error, "error");
      dispatch(clearAdminMessages());
    }
  }, [successMessage, error, dispatch]);

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const handleApprove = (id, name) => {
    if (window.confirm(`Approve ${name} as an artisan?`)) {
      dispatch(approveArtisan(id));
    }
  };

  const handleReject = (id, name) => {
    if (window.confirm(`Reject ${name}'s artisan application?`)) {
      dispatch(rejectArtisan(id));
    }
  };

  // Filter artisans based on status and search
  const filteredArtisans = artisans.filter(artisan => {
    if (filter === "pending") return artisan.status === "pending";
    if (filter === "approved") return artisan.status === "approved";
    if (filter === "rejected") return artisan.status === "rejected";
    return true;
  }).filter(artisan => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      artisan.fullName?.toLowerCase().includes(searchLower) ||
      artisan.email?.toLowerCase().includes(searchLower) ||
      artisan.skillCategory?.toLowerCase().includes(searchLower) ||
      artisan.location?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate statistics
  const stats = {
    total: artisans.length,
    pending: artisans.filter(a => a.status === "pending").length,
    approved: artisans.filter(a => a.status === "approved").length,
    rejected: artisans.filter(a => a.status === "rejected").length,
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading artisans...</p>
    </div>
  );

  if (!artisans.length) return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FaUserTimes size={48} />
      </div>
      <h3>No Artisans Found</h3>
      <p>No artisan applications are available at the moment.</p>
    </div>
  );

  return (
    <div className="approve-artisan-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Artisan Management</h1>
        <p className="page-subtitle">
          Review and manage artisan applications
        </p>
      </div>


      {/* Filters */}
      <div className="filters-section">
        <h3 className="filter-title">
          <FaFilter size={16} /> Filter Applications
        </h3>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({stats.total})
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={`filter-btn ${filter === "approved" ? "active" : ""}`}
            onClick={() => setFilter("approved")}
          >
            Approved ({stats.approved})
          </button>
          <button
            className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected ({stats.rejected})
          </button>
        </div>
        
        <div className="search-box">
         
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, skill, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="table-container">
        <table className="artisan-table">
          <thead>
            <tr>
              <th>Artisan Details</th>
              <th>Contact</th>
              <th>Skills</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArtisans.map((artisan) => (
              <tr key={artisan._id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>
                    {artisan.fullName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    ID: {artisan._id.substring(0, 8)}...
                  </div>
                </td>
                <td>
                  <div>{artisan.email}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {artisan.phoneNumber || "No phone"}
                  </div>
                </td>
                <td>
                  <div style={{
                    backgroundColor: '#f1f5f9',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#475569',
                    display: 'inline-block'
                  }}>
                    {artisan.skillCategory || "Not specified"}
                  </div>
                </td>
                <td>{artisan.location || "Not specified"}</td>
                <td>
                  <span className={`status-badge status-${artisan.status || 'pending'}`}>
                    {artisan.status || "pending"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(artisan._id, artisan.fullName)}
                      disabled={artisan.status === "approved"}
                    >
                      <FaCheck /> {artisan.status === "approved" ? "Approved" : "Approve"}
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(artisan._id, artisan.fullName)}
                      disabled={artisan.status === "rejected"}
                    >
                      <FaTimes /> {artisan.status === "rejected" ? "Rejected" : "Reject"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-list">
        {filteredArtisans.map((artisan) => (
          <div key={artisan._id} className="artisan-card">
            <div className="artisan-info">
              <div className="artisan-field">
                <span className="field-label">Name</span>
                <span className="field-value">{artisan.fullName}</span>
              </div>
              <div className="artisan-field">
                <span className="field-label">Email</span>
                <span className="field-value">{artisan.email}</span>
              </div>
              <div className="artisan-field">
                <span className="field-label">Skill</span>
                <span className="field-value">{artisan.skillCategory}</span>
              </div>
              <div className="artisan-field">
                <span className="field-label">Location</span>
                <span className="field-value">{artisan.location}</span>
              </div>
              <div className="artisan-field">
                <span className="field-label">Status</span>
                <span className="field-value">
                  <span className={`status-badge status-${artisan.status || 'pending'}`}>
                    {artisan.status || "pending"}
                  </span>
                </span>
              </div>
            </div>
            <div className="action-buttons">
              <button
                className="approve-btn"
                onClick={() => handleApprove(artisan._id, artisan.fullName)}
                disabled={artisan.status === "approved"}
              >
                <FaCheck /> {artisan.status === "approved" ? "Approved" : "Approve"}
              </button>
              <button
                className="reject-btn"
                onClick={() => handleReject(artisan._id, artisan.fullName)}
                disabled={artisan.status === "rejected"}
              >
                <FaTimes /> {artisan.status === "rejected" ? "Rejected" : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty Filter State */}
      {filteredArtisans.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaSearch size={48} />
          </div>
          <h3>No matching artisans found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default ApproveArtisan;
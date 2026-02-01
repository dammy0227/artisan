import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookingsByStudent } from "../../../features/booking/bookingThunks";
import {
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUserTie,
  FaTools,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaSort,
  FaEye,
  FaPhone,
  FaMapMarkerAlt,
  FaStar,
  FaExclamationTriangle,
  FaInfoCircle
} from "react-icons/fa";
import './Bookings.css';

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.booking || {});

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    dispatch(getBookingsByStudent());
  }, [dispatch]);

  const filteredBookings = bookings?.filter(booking => {
    if (filter !== "all" && booking.status !== filter) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.artisan?.fullName?.toLowerCase().includes(searchLower) ||
        booking.jobDetails?.toLowerCase().includes(searchLower) ||
        booking.artisan?.skillCategory?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  }).sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    if (sortBy === "name") {
      return a.artisan?.fullName?.localeCompare(b.artisan?.fullName);
    }
    return 0;
  });

  const stats = {
    total: bookings?.length || 0,
    pending: bookings?.filter(b => b.status === "pending").length || 0,
    accepted: bookings?.filter(b => b.status === "accepted").length || 0,
    completed: bookings?.filter(b => b.status === "completed").length || 0,
    cancelled: bookings?.filter(b => b.status === "cancelled").length || 0,
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending": return <FaClock className="status-icon pending" />;
      case "accepted": return <FaCheckCircle className="status-icon accepted" />;
      case "completed": return <FaCheckCircle className="status-icon completed" />;
      case "cancelled": return <FaTimesCircle className="status-icon cancelled" />;
      default: return <FaInfoCircle className="status-icon" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading your bookings...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <FaExclamationTriangle />
      <p>{error}</p>
    </div>
  );
  
  if (!bookings || bookings.length === 0)
    return (
      <div className="no-bookings">
        <FaCalendarCheck size={48} />
        <h3>No Bookings Yet</h3>
        <p>You haven't made any bookings yet. Start by finding an artisan!</p>
      </div>
    );

  return (
    <div className="bookings-container">
      {/* Header */}
      <div className="bookings-header">
        <div className="header-left">
          <h1 className="page-title">
            <FaCalendarCheck /> My Bookings
          </h1>
          <p className="page-subtitle">
            Track and manage all your service bookings
          </p>
        </div>
        <div className="header-stats">
          <div className="total-count">
            <span className="count-number">{stats.total}</span>
            <span className="count-label">Total Bookings</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bookings-stats">
        <div className="stat-card stat-pending">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card stat-accepted">
          <div className="stat-icon">
            <FaCalendarCheck />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.accepted}</div>
            <div className="stat-label">Accepted</div>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card stat-cancelled">
          <div className="stat-icon">
            <FaTimesCircle />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.cancelled}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h3 className="filters-title">
            <FaFilter /> Filter & Sort
          </h3>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
          </div>
        </div>
        
        <div className="filters-row">
          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">Filter by Status</label>
            <div className="filter-options">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({stats.total})
              </button>
              <button 
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({stats.pending})
              </button>
              <button 
                className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
                onClick={() => setFilter('accepted')}
              >
                Accepted ({stats.accepted})
              </button>
              <button 
                className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed ({stats.completed})
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label className="filter-label">
              <FaSearch /> Search
            </label>
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search by artisan name or job details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label className="filter-label">
              <FaSort /> Sort By
            </label>
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Newest First</option>
              <option value="status">By Status</option>
              <option value="name">Artisan Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        Showing {filteredBookings?.length || 0} bookings
        {filter !== "all" && ` (${filter})`}
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="bookings-grid">
          {filteredBookings?.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="card-header">
                <div className="booking-status">
                  <span className={`status-badge status-${booking.status}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </span>
                </div>
                <div className="booking-id">
                  ID: #{booking._id?.substring(0, 8)}
                </div>
              </div>
              
              <div className="card-body">
                <div className="booking-artisan">
                  <div className="artisan-avatar">
                    {booking.artisan?.fullName?.charAt(0) || "A"}
                  </div>
                  <div className="artisan-info">
                    <h4 className="artisan-name">{booking.artisan?.fullName || "Unknown Artisan"}</h4>
                    <div className="artisan-details">
                      <span className="artisan-skill">
                        <FaTools /> {booking.artisan?.skillCategory || "Not specified"}
                      </span>
                      <span className="artisan-location">
                        <FaMapMarkerAlt /> {booking.artisan?.location || "Unknown location"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-details">
                  <h5 className="details-title">
                    <FaTools /> Job Details
                  </h5>
                  <p className="details-content">{booking.jobDetails}</p>
                </div>

                <div className="booking-meta">
                  <div className="meta-item">
                    <FaCalendarAlt />
                    <span>Scheduled: {formatDate(booking.scheduledDate)}</span>
                  </div>
                  <div className="meta-item">
                    <FaClock />
                    <span>
                      Created: {booking.createdAt 
                        ? new Date(booking.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                  {booking.artisan?.rating && (
                    <div className="meta-item">
                      <FaStar />
                      <span>Rating: {booking.artisan.rating.toFixed(1)}/5.0</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-footer">
                <div className="contact-info">
                  {booking.artisan?.phone && (
                    <div className="contact-item">
                      <FaPhone /> {booking.artisan.phone}
                    </div>
                  )}
                </div>
                
                <button
                  className="btn btn-view"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <FaEye /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Artisan</th>
                <th>Job Details</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings?.map((booking) => (
                <tr key={booking._id}>
                  <td className="artisan-cell">
                    <div className="artisan-info-compact">
                      <div className="artisan-name">{booking.artisan?.fullName}</div>
                      <div className="artisan-skill">{booking.artisan?.skillCategory}</div>
                      <div className="artisan-location">{booking.artisan?.location}</div>
                    </div>
                  </td>
                  <td>
                    <div className="job-details-compact">
                      {booking.jobDetails}
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      {booking.scheduledDate
                        ? new Date(booking.scheduledDate).toLocaleDateString()
                        : "Not scheduled"}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${booking.status}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-sm btn-view"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <FaEye /> Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Details</h3>
              <button className="modal-close" onClick={() => setSelectedBooking(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-header">
                  <div className={`status-badge-large status-${selectedBooking.status}`}>
                    {getStatusIcon(selectedBooking.status)}
                    {selectedBooking.status}
                  </div>
                  <div className="booking-id-large">
                    ID: #{selectedBooking._id?.substring(0, 12)}
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="detail-card">
                    <h4 className="detail-title">
                      <FaUserTie /> Artisan Information
                    </h4>
                    <div className="detail-content">
                      <p><strong>Name:</strong> {selectedBooking.artisan?.fullName || "Unknown"}</p>
                      <p><strong>Skill:</strong> {selectedBooking.artisan?.skillCategory || "Not specified"}</p>
                      <p><strong>Location:</strong> {selectedBooking.artisan?.location || "Unknown"}</p>
                      <p><strong>Phone:</strong> {selectedBooking.artisan?.phone || "Not provided"}</p>
                      <p><strong>Rating:</strong> {selectedBooking.artisan?.rating?.toFixed(1) || "N/A"}/5.0</p>
                      <p><strong>Experience:</strong> {selectedBooking.artisan?.yearsOfExperience || "0"} years</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <h4 className="detail-title">
                      <FaTools /> Job Information
                    </h4>
                    <div className="detail-content">
                      <p><strong>Job Details:</strong></p>
                      <p className="job-description">{selectedBooking.jobDetails}</p>
                      <p><strong>Scheduled Date:</strong></p>
                      <p>
                        {selectedBooking.scheduledDate
                          ? formatDate(selectedBooking.scheduledDate)
                          : "Not scheduled"}
                      </p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <h4 className="detail-title">
                      <FaCalendarAlt /> Timeline
                    </h4>
                    <div className="detail-content">
                      <p><strong>Created:</strong> {selectedBooking.createdAt 
                        ? new Date(selectedBooking.createdAt).toLocaleDateString()
                        : "Unknown"}</p>
                      <p><strong>Last Updated:</strong> {selectedBooking.updatedAt 
                        ? new Date(selectedBooking.updatedAt).toLocaleDateString()
                        : "Unknown"}</p>
                      <p><strong>Status Last Changed:</strong> {selectedBooking.updatedAt 
                        ? new Date(selectedBooking.updatedAt).toLocaleDateString()
                        : "Unknown"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-close"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBookingsByArtisan,
  updateBookingStatus,
} from "../../../features/booking/bookingThunks";
import {
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUserGraduate,
  FaTools,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaSort,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";
import "./Booking.css";

const Booking = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.booking || {});

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  useEffect(() => {
    dispatch(getBookingsByArtisan());
  }, [dispatch]);

  const handleStatusChange = (bookingId, status, studentName) => {
    if (window.confirm(`Are you sure you want to ${status} booking from ${studentName}?`)) {
      dispatch(updateBookingStatus({ bookingId, status }));
    }
  };

  // Filter bookings based on status and search
  const filteredBookings = bookings?.filter(booking => {
    if (filter !== "all" && booking.status !== filter) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.student?.name?.toLowerCase().includes(searchLower) ||
        booking.jobDetails?.toLowerCase().includes(searchLower) ||
        booking.student?.email?.toLowerCase().includes(searchLower)
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
    return 0;
  });

  // Calculate statistics
  const stats = {
    total: bookings?.length || 0,
    pending: bookings?.filter(b => b.status === "pending").length || 0,
    accepted: bookings?.filter(b => b.status === "accepted").length || 0,
    completed: bookings?.filter(b => b.status === "completed").length || 0,
    cancelled: bookings?.filter(b => b.status === "cancelled").length || 0,
  };

  if (loading) return (
    <div className="booking-loading">
      <div className="loading-spinner"></div>
      <p>Loading your bookings...</p>
    </div>
  );
  
  if (error) return (
    <div className="booking-error">
      <FaTimesCircle />
      <p>{error}</p>
    </div>
  );
  
  if (!bookings || bookings.length === 0)
    return (
      <div className="no-bookings">
        <FaCalendarCheck size={48} />
        <h3>No Bookings Yet</h3>
        <p>You don't have any bookings at the moment. Check back later!</p>
      </div>
    );

  return (
    <div className="booking-container">
      {/* Header */}
      <div className="booking-header">
        <div className="header-left">
          <h1 className="booking-title">
            <FaCalendarCheck /> My Bookings
          </h1>
          <p className="booking-subtitle">
            Manage and track all your job bookings
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
      <div className="booking-stats">
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
            <label className="filter-label">Status</label>
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
                placeholder="Search by student name or job details..."
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
                    {booking.status}
                  </span>
                </div>
                <div className="booking-id">
                  ID: #{booking._id?.substring(0, 8)}
                </div>
              </div>
              
              <div className="card-body">
                <div className="booking-student">
                  <div className="student-avatar">
                    <FaUserGraduate />
                  </div>
                  <div className="student-info">
                    <h4 className="student-name">{booking.student?.name || "Unknown Student"}</h4>
                    <div className="student-contact">
                      <span><FaEnvelope /> {booking.student?.email}</span>
                      {booking.student?.phone && (
                        <span><FaPhone /> {booking.student.phone}</span>
                      )}
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
                    <span>
                      {booking.scheduledDate
                        ? new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : "Not scheduled"}
                    </span>
                  </div>
                  <div className="meta-item">
                    <FaClock />
                    <span>
                      Created: {booking.createdAt 
                        ? new Date(booking.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                {booking.status === "pending" && (
                  <div className="action-buttons">
                    <button
                      className="btn btn-accept"
                      onClick={() => handleStatusChange(booking._id, "accepted", booking.student?.name)}
                    >
                      <FaCheckCircle /> Accept Booking
                    </button>
                    <button
                      className="btn btn-cancel"
                      onClick={() => handleStatusChange(booking._id, "cancelled", booking.student?.name)}
                    >
                      <FaTimesCircle /> Decline
                    </button>
                  </div>
                )}

                {booking.status === "accepted" && (
                  <div className="action-buttons">
                    <button
                      className="btn btn-complete"
                      onClick={() => handleStatusChange(booking._id, "completed", booking.student?.name)}
                    >
                      <FaCheckCircle /> Mark as Completed
                    </button>
                    <button
                      className="btn btn-cancel"
                      onClick={() => handleStatusChange(booking._id, "cancelled", booking.student?.name)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}

                {booking.status === "completed" && (
                  <div className="completed-info">
                    <FaCheckCircle className="completed-icon" />
                    <span>Job Successfully Completed</span>
                  </div>
                )}

                {booking.status === "cancelled" && (
                  <div className="cancelled-info">
                    <FaTimesCircle className="cancelled-icon" />
                    <span>Booking Cancelled</span>
                  </div>
                )}

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
          <table className="booking-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Job Details</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings?.map((booking) => (
                <tr key={booking._id}>
                  <td className="student-cell">
                    <div className="student-info-compact">
                      <div className="student-name">{booking.student?.name}</div>
                      <div className="student-email">{booking.student?.email}</div>
                      <div className="student-phone">{booking.student?.phone}</div>
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
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      {booking.status === "pending" && (
                        <>
                          <button
                            className="btn-sm btn-accept"
                            onClick={() => handleStatusChange(booking._id, "accepted", booking.student?.name)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-sm btn-cancel"
                            onClick={() => handleStatusChange(booking._id, "cancelled", booking.student?.name)}
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {booking.status === "accepted" && (
                        <button
                          className="btn-sm btn-complete"
                          onClick={() => handleStatusChange(booking._id, "completed", booking.student?.name)}
                        >
                          Complete
                        </button>
                      )}

                      {booking.status === "completed" && (
                        <span className="completed-text">
                          <FaCheckCircle /> Completed
                        </span>
                      )}

                      {booking.status === "cancelled" && (
                        <span className="cancelled-text">
                          <FaTimesCircle /> Cancelled
                        </span>
                      )}

                      <button
                        className="btn-sm btn-view"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <FaEye />
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
                    {selectedBooking.status}
                  </div>
                  <div className="booking-id-large">
                    ID: #{selectedBooking._id?.substring(0, 12)}
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="detail-card">
                    <h4 className="detail-title">
                      <FaUserGraduate /> Student Information
                    </h4>
                    <div className="detail-content">
                      <p><strong>Name:</strong> {selectedBooking.student?.name || "Unknown"}</p>
                      <p><strong>Email:</strong> {selectedBooking.student?.email}</p>
                      <p><strong>Phone:</strong> {selectedBooking.student?.phone || "Not provided"}</p>
                      <p><strong>Department:</strong> {selectedBooking.student?.department || "N/A"}</p>
                      <p><strong>Faculty:</strong> {selectedBooking.student?.faculty || "N/A"}</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <h4 className="detail-title">
                      <FaTools /> Job Information
                    </h4>
                    <div className="detail-content">
                      <p><strong>Job Details:</strong></p>
                      <p className="job-description">{selectedBooking.jobDetails}</p>
                      <p><strong>Preferred Date:</strong></p>
                      <p>
                        {selectedBooking.scheduledDate
                          ? new Date(selectedBooking.scheduledDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : "Not specified"}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="modal-actions">
                {selectedBooking.status === "pending" && (
                  <>
                    <button
                      className="btn btn-accept"
                      onClick={() => {
                        handleStatusChange(selectedBooking._id, "accepted", selectedBooking.student?.name);
                        setSelectedBooking(null);
                      }}
                    >
                      <FaCheckCircle /> Accept Booking
                    </button>
                    <button
                      className="btn btn-cancel"
                      onClick={() => {
                        handleStatusChange(selectedBooking._id, "cancelled", selectedBooking.student?.name);
                        setSelectedBooking(null);
                      }}
                    >
                      <FaTimesCircle /> Decline Booking
                    </button>
                  </>
                )}

                {selectedBooking.status === "accepted" && (
                  <button
                    className="btn btn-complete"
                    onClick={() => {
                      handleStatusChange(selectedBooking._id, "completed", selectedBooking.student?.name);
                      setSelectedBooking(null);
                    }}
                  >
                    <FaCheckCircle /> Mark as Completed
                  </button>
                )}

                <button
                  className="btn btn-close"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
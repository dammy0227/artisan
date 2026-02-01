import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getArtisans,
  getPreviousWorksByArtisan,
} from "../../../features/student/studentThunks";
import { createBooking } from "../../../features/booking/bookingThunks";
import {
  FaSearch,
  FaCalendarAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaStar,
  FaBriefcase,
  FaUserTie,
  FaCheckCircle,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSort,
  FaEye,
  FaBook,
  FaClock,
  FaCertificate,
  FaThumbsUp
} from "react-icons/fa";
import "./BookArtisan.css";

const BookArtisan = () => {
  const dispatch = useDispatch();
  const { artisansList, artisanPreviousWorks, loading } = useSelector(
    (state) => state.student
  );

  const [searchInput, setSearchInput] = useState("");
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    jobDetails: "",
    scheduledDate: "",
  });
  const [selectedArtisanForBooking, setSelectedArtisanForBooking] = useState(null);
  const [skillFilter, setSkillFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    dispatch(getArtisans());
  }, [dispatch]);

  const skillCategories = ["all", ...new Set(artisansList.map(a => a.skillCategory).filter(Boolean))];

  const filteredArtisans = artisansList
    .filter(artisan => {
      if (skillFilter !== "all" && artisan.skillCategory !== skillFilter) return false;
      
      if (searchInput) {
        const searchLower = searchInput.toLowerCase();
        return (
          artisan.fullName?.toLowerCase().includes(searchLower) ||
          artisan.skillCategory?.toLowerCase().includes(searchLower) ||
          artisan.location?.toLowerCase().includes(searchLower) ||
          artisan.description?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "experience") return (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0);
      if (sortBy === "name") return a.fullName?.localeCompare(b.fullName);
      return 0;
    });

  const openBookingModal = (artisan) => {
    setSelectedArtisanForBooking(artisan);
    setShowBookingModal(true);
    setBookingDetails({
      jobDetails: "",
      scheduledDate: new Date().toISOString().split('T')[0]
    });
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setBookingDetails({ jobDetails: "", scheduledDate: "" });
  };

  const submitBooking = () => {
    if (!bookingDetails.jobDetails.trim()) {
      showToast("Please enter job details", "error");
      return;
    }

    dispatch(
      createBooking({
        artisanId: selectedArtisanForBooking._id,
        jobDetails: bookingDetails.jobDetails,
        scheduledDate: bookingDetails.scheduledDate || null,
      })
    )
      .unwrap()
      .then(() => {
        showToast("Booking request sent successfully!", "success");
        closeBookingModal();
      })
      .catch((err) => showToast(`Booking failed: ${err.message || "Please try again"}`, "error"));
  };

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

  const openPreviousWorks = (artisanId) => {
    setSelectedArtisan(artisanId);
    setCurrentWorkIndex(0);
    dispatch(getPreviousWorksByArtisan(artisanId));
  };

  const closePreviousWorks = () => {
    setSelectedArtisan(null);
    setCurrentWorkIndex(0);
  };

  const handleNext = () => {
    if (currentWorkIndex < artisanPreviousWorks.length - 1) {
      setCurrentWorkIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentWorkIndex > 0) {
      setCurrentWorkIndex((prev) => prev - 1);
    }
  };

  const stats = {
    total: artisansList.length,
    available: artisansList.filter(a => a.availability).length,
    topRated: artisansList.filter(a => a.rating >= 4).length,
  };

  return (
    <div className="book-artisan-container">
      {/* Header */}
      <div className="header-section">
        <div className="header-left">
          <h1 className="page-title">
            <FaUserTie /> Find & Book Artisans
          </h1>
          <p className="page-subtitle">
            Discover skilled professionals for your needs
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7' }}>
              <FaUserTie color="#059669" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Artisans</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e0f2fe' }}>
              <FaCheckCircle color="#0ea5e9" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.available}</div>
              <div className="stat-label">Available Now</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="filters-section">
        <div className="search-container">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by skill, name, location, or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            {searchInput && (
              <button 
                className="clear-search"
                onClick={() => setSearchInput('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">
              <FaFilter /> Filter by Skill
            </label>
            <select 
              className="filter-select"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              {skillCategories.map(skill => (
                <option key={skill} value={skill}>
                  {skill === "all" ? "All Skills" : skill}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <FaSort /> Sort By
            </label>
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Highest Rating</option>
              <option value="experience">Most Experience</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">View</label>
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        Showing {filteredArtisans.length} of {artisansList.length} artisans
        {searchInput && ` for "${searchInput}"`}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading artisans...</p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredArtisans.length === 0 && (
            <div className="empty-state">
              <FaSearch size={48} />
              <h3>No Artisans Found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && filteredArtisans.length > 0 && (
            <div className="artisan-grid">
              {filteredArtisans.map((artisan) => (
                <div key={artisan._id} className="artisan-card">
                  <div className="card-header">
                    <div className="artisan-photo">
                      <img
                        src={artisan.profilePhoto || "https://via.placeholder.com/150?text=No+Photo"}
                        alt={artisan.fullName}
                        className="profile-image"
                      />
                      {artisan.availability && (
                        <span className="availability-badge">
                          <FaCheckCircle /> Available
                        </span>
                      )}
                    </div>
                    <div className="artisan-rating">
                      <FaStar className="star-icon" />
                      <span className="rating-value">{artisan.rating?.toFixed(1) || "N/A"}</span>
                      <span className="rating-count">({artisan.totalReviews || 0} reviews)</span>
                    </div>
                  </div>

                  <div className="card-body">
                    <h3 className="artisan-name">{artisan.fullName}</h3>
                    <div className="artisan-skill">
                      <FaBriefcase /> {artisan.skillCategory}
                    </div>
                    
                    <div className="artisan-info">
                      <div className="info-item">
                        <FaMapMarkerAlt /> {artisan.location}
                      </div>
                      <div className="info-item">
                        <FaClock /> {artisan.yearsOfExperience || 0} years experience
                      </div>
                      <div className="info-item">
                        <FaPhone /> {artisan.phone}
                      </div>
                    </div>

                    <p className="artisan-description">
                      {artisan.description?.slice(0, 100)}...
                    </p>

                    {artisan.verificationDocs?.length > 0 && (
                      <div className="verification-badge">
                        <FaCertificate /> Verified
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <div className="artisan-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => openPreviousWorks(artisan._id)}
                      >
                        <FaEye /> Portfolio
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => openBookingModal(artisan)}
                        disabled={!artisan.availability}
                      >
                        <FaBook /> Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && filteredArtisans.length > 0 && (
            <div className="artisan-list">
              {filteredArtisans.map((artisan) => (
                <div key={artisan._id} className="artisan-list-item">
                  <div className="list-item-header">
                    <img
                      src={artisan.profilePhoto || "https://via.placeholder.com/150?text=No+Photo"}
                      alt={artisan.fullName}
                      className="list-image"
                    />
                    <div className="list-info">
                      <h3 className="list-name">{artisan.fullName}</h3>
                      <div className="list-meta">
                        <span className="list-skill">
                          <FaBriefcase /> {artisan.skillCategory}
                        </span>
                        <span className="list-location">
                          <FaMapMarkerAlt /> {artisan.location}
                        </span>
                        <span className="list-rating">
                          <FaStar /> {artisan.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                      <p className="list-description">
                        {artisan.description?.slice(0, 150)}...
                      </p>
                    </div>
                  </div>
                  <div className="list-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => openPreviousWorks(artisan._id)}
                    >
                      <FaEye /> View Works
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => openBookingModal(artisan)}
                      disabled={!artisan.availability}
                    >
                      <FaBook /> Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Previous Works Modal */}
      {selectedArtisan && artisanPreviousWorks.length > 0 && (
        <div className="modal-overlay" onClick={closePreviousWorks}>
          <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Portfolio Gallery</h3>
              <button className="close-btn" onClick={closePreviousWorks}>
                <FaTimes />
              </button>
            </div>
            
            <div className="portfolio-content">
              <div className="work-navigation">
                <button
                  className="nav-btn prev-btn"
                  onClick={handlePrev}
                  disabled={currentWorkIndex === 0}
                >
                  <FaChevronLeft /> Previous
                </button>
                
                <div className="work-display">
                  <div className="work-image-container">
                    <img
                      src={artisanPreviousWorks[currentWorkIndex].image || "https://via.placeholder.com/600x400?text=No+Image"}
                      alt={artisanPreviousWorks[currentWorkIndex].title}
                      className="work-image"
                    />
                  </div>
                  <div className="work-details">
                    <h4 className="work-title">
                      {artisanPreviousWorks[currentWorkIndex].title}
                    </h4>
                    <p className="work-description">
                      {artisanPreviousWorks[currentWorkIndex].description}
                    </p>
                    <div className="work-counter">
                      {currentWorkIndex + 1} / {artisanPreviousWorks.length}
                    </div>
                  </div>
                </div>
                
                <button
                  className="nav-btn next-btn"
                  onClick={handleNext}
                  disabled={currentWorkIndex === artisanPreviousWorks.length - 1}
                >
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={closeBookingModal}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book Service</h3>
              <button className="close-btn" onClick={closeBookingModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="booking-content">
              <div className="artisan-booking-info">
                <img
                  src={selectedArtisanForBooking?.profilePhoto || "https://via.placeholder.com/100?text=Artisan"}
                  alt={selectedArtisanForBooking?.fullName}
                  className="booking-artisan-image"
                />
                <div className="booking-artisan-details">
                  <h4>{selectedArtisanForBooking?.fullName}</h4>
                  <p>{selectedArtisanForBooking?.skillCategory}</p>
                  <div className="booking-rating">
                    <FaStar /> {selectedArtisanForBooking?.rating?.toFixed(1) || "N/A"}
                  </div>
                </div>
              </div>
              
              <div className="booking-form">
                <div className="form-group">
                  <label className="form-label">
                    <FaBriefcase /> Job Details *
                  </label>
                  <textarea
                    placeholder="Describe the work you need done..."
                    value={bookingDetails.jobDetails}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        jobDetails: e.target.value,
                      })
                    }
                    className="booking-textarea"
                    rows={4}
                  />
                  <div className="char-count">
                    {bookingDetails.jobDetails.length}/500 characters
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <FaCalendarAlt /> Preferred Date
                  </label>
                  <input
                    type="date"
                    value={bookingDetails.scheduledDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        scheduledDate: e.target.value,
                      })
                    }
                    className="booking-date"
                  />
                </div>
                
                <div className="booking-tips">
                  <h5><FaThumbsUp /> Tips for a successful booking:</h5>
                  <ul>
                    <li>Be specific about your requirements</li>
                    <li>Include any special instructions</li>
                    <li>Mention your budget if you have one</li>
                    <li>Provide your contact information</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeBookingModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submitBooking}>
                Send Booking Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookArtisan;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getArtisans,
  getPreviousWorksByArtisan,
} from "../../../features/student/studentThunks";
import { createBooking } from "../../../features/booking/bookingThunks";
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

  
  useEffect(() => {
    dispatch(getArtisans());
  }, [dispatch]);

  const filteredArtisans = artisansList.filter(
    (artisan) =>
      artisan.fullName?.toLowerCase().includes(searchInput.toLowerCase()) ||
      artisan.skillCategory?.toLowerCase().includes(searchInput.toLowerCase()) ||
      artisan.location?.toLowerCase().includes(searchInput.toLowerCase())
  );


  const openBookingModal = (artisan) => {
    setSelectedArtisanForBooking(artisan);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setBookingDetails({ jobDetails: "", scheduledDate: "" });
  };

  const submitBooking = () => {
    if (!bookingDetails.jobDetails.trim()) {
      alert("Please enter job details.");
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
        alert("Booking successful!");
        closeBookingModal();
      })
      .catch((err) => alert("Booking failed: " + err));
  };

  // Previous works modal
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

  return (
    <div className="book-artisan-container">
      <h2 className="book-artisan">Find and Book an Artisan</h2>

      {/* Real-time search input */}
      <input
        type="text"
        placeholder="Search by skill, name, or location..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>Loading artisans...</p>
      ) : searchInput.trim() === "" ? (
        <p>🔎 Please search by skill, name, or location to see artisans.</p>
      ) : filteredArtisans.length > 0 ? (
        <div className="artisan-grid">
          {filteredArtisans.map((artisan) => (
            <div key={artisan._id} className="artisan-card">
              <div className="artisan-photo">
                <img
                  src={
                    artisan.profilePhoto ||
                    "https://via.placeholder.com/150?text=No+Photo"
                  }
                  alt={artisan.fullName}
                />
              </div>

              <h3 className="artisan-name">{artisan.fullName}</h3>
              <p>📱 Phone: {artisan.phone}</p>
              <p>Skill: {artisan.skillCategory}</p>
              <p>Location: {artisan.location}</p>
              <p>Rating: ⭐ {artisan.rating || "N/A"}</p>
              <p>Experience: {artisan.yearsOfExperience} years</p>
              <p>
                Availability:{" "}
                <span
                  style={{
                    color: artisan.availability ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {artisan.availability ? "Available" : "Unavailable"}
                </span>
              </p>

              {artisan.verificationDocs?.length > 0 && (
                <p>
                  Verification Docs:{" "}
                  <a
                    href={artisan.verificationDocs[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </p>
              )}

              <p className="artisan-description">
                {artisan.description?.slice(0, 60)}...
              </p>

              <div className="artisan-actions">
                <button
                  className="btn-view"
                  onClick={() => openPreviousWorks(artisan._id)}
                >
                  View Previous Works
                </button>
                <button
                  className="btn-book"
                  onClick={() => openBookingModal(artisan)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No artisans found matching your search.</p>
      )}

      {/* Previous Works Modal */}
      {selectedArtisan && artisanPreviousWorks.length > 0 && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={closePreviousWorks}>
              ✖
            </span>
            <div className="work-item">
              <p className="title">
                {artisanPreviousWorks[currentWorkIndex].title}
              </p>
              <img
                src={
                  artisanPreviousWorks[currentWorkIndex].image ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={artisanPreviousWorks[currentWorkIndex].title}
                className="previous-work-image"
              />
              <p className="description">
                {artisanPreviousWorks[currentWorkIndex].description}
              </p>
            </div>
            <div className="navigation">
              <button
                className="nav-btn"
                onClick={handlePrev}
                disabled={currentWorkIndex === 0}
              >
                ◀ Prev
              </button>
              <button
                className="nav-btn"
                onClick={handleNext}
                disabled={currentWorkIndex === artisanPreviousWorks.length - 1}
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={closeBookingModal}>
              ✖
            </span>
            <h3 style={{color: '#1e7e34'}}>Book {selectedArtisanForBooking?.fullName}</h3>
            <textarea
              placeholder="Enter job details..."
              value={bookingDetails.jobDetails}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  jobDetails: e.target.value,
                })
              }
              className="modal-textarea"
            ></textarea>
            <input
              type="date"
              value={bookingDetails.scheduledDate}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  scheduledDate: e.target.value,
                })
              }
              className="modal-input"
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeBookingModal}>
                Cancel
              </button>
              <button className="btn-submit" onClick={submitBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookArtisan;

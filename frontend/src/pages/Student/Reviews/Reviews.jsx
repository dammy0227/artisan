import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookingsByStudent } from "../../../features/booking/bookingThunks";
import { createReview, getReviewsForStudent } from "../../../features/review/reviewThunks";
import { clearReviewMessages } from "../../../features/review/reviewSlice";
import "./Reviews.css";

const Reviews = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.booking);
  const { reviews, loading, error, successMessage } = useSelector((state) => state.review);

  const [reviewData, setReviewData] = useState({
    bookingId: "",
    artisanId: "",
    rating: 5,
    reviewText: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [expandedReview, setExpandedReview] = useState(null);
  const [activeTab, setActiveTab] = useState("toReview");

  useEffect(() => {
    dispatch(getBookingsByStudent());
    dispatch(getReviewsForStudent());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearReviewMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const openReviewForm = (booking) => {
    setReviewData({
      bookingId: booking._id,
      artisanId: booking.artisan._id,
      rating: 5,
      reviewText: "",
    });
    setSelectedBooking(booking);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createReview(reviewData)).then(() => {
      dispatch(getReviewsForStudent());
      setShowForm(false);
      setSelectedBooking(null);
    });
  };

  const handleStarClick = (rating) => {
    setReviewData({ ...reviewData, rating });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter completed bookings that have not been reviewed yet
  const bookingsToReview = bookings?.filter(
    (b) => b.status === "completed" && !reviews?.some((r) => r.booking === b._id)
  );

  const getAverageRating = () => {
    if (!reviews?.length) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return (
      <div className="stars-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "star filled" : "star"}>
            ★
          </span>
        ))}
        <span className="rating-number">({rating}.0)</span>
      </div>
    );
  };

  return (
    <div className="reviews-container">
      <header className="reviews-header">
        <h1>Your Reviews</h1>
        <div className="reviews-summary">
          <div className="summary-card">
            <h3>{reviews?.length || 0}</h3>
            <p>Reviews Written</p>
          </div>
          <div className="summary-card">
            <h3>{getAverageRating()}</h3>
            <p>Average Rating</p>
          </div>
          <div className="summary-card">
            <h3>{bookingsToReview?.length || 0}</h3>
            <p>Pending Reviews</p>
          </div>
        </div>
      </header>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          {successMessage}
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeTab === "toReview" ? "active" : ""}`}
          onClick={() => setActiveTab("toReview")}
        >
          To Review ({bookingsToReview?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === "myReviews" ? "active" : ""}`}
          onClick={() => setActiveTab("myReviews")}
        >
          My Reviews ({reviews?.length || 0})
        </button>
      </div>

      {activeTab === "toReview" && (
        <section className="section-to-review">
          <h2>Completed Bookings Awaiting Review</h2>
          {bookingsToReview?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No completed bookings to review at the moment.</p>
              <small>Once you complete a booking, you'll be able to review it here.</small>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookingsToReview?.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <div className="artisan-info">
                      <div className="avatar">{booking.artisan?.fullName?.charAt(0)}</div>
                      <div>
                        <h4>{booking.artisan?.fullName}</h4>
                        <p className="job-title">{booking.jobDetails}</p>
                      </div>
                    </div>
                    <span className="booking-date">
                      {formatDate(booking.updatedAt || booking.createdAt)}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Service:</strong> {booking.serviceType || "General Service"}</p>
                    <p><strong>Location:</strong> {booking.location || "Not specified"}</p>
                  </div>
                  <button 
                    className="btn-review"
                    onClick={() => openReviewForm(booking)}
                  >
                    ✍️ Write Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "myReviews" && (
        <section className="section-my-reviews">
          <h2>Your Submitted Reviews</h2>
          {reviews?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⭐</div>
              <p>You haven't submitted any reviews yet.</p>
              <small>Complete a booking and share your experience!</small>
            </div>
          ) : (
            <div className="reviews-grid">
              {reviews?.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="avatar">{review.artisan?.fullName?.charAt(0)}</div>
                      <div>
                        <h4>{review.artisan?.fullName}</h4>
                        <p className="review-date">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <div className="review-content">
                    <p className={expandedReview === review._id ? "expanded" : "collapsed"}>
                      {review.reviewText}
                    </p>
                    {review.reviewText.length > 150 && (
                      <button
                        className="btn-expand"
                        onClick={() => setExpandedReview(
                          expandedReview === review._id ? null : review._id
                        )}
                      >
                        {expandedReview === review._id ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
                  <div className="review-footer">
                    <span className="booking-ref">Booking #{review.booking?.slice(-6)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Write a Review</h2>
              <button className="btn-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="review-preview">
                <div className="artisan-preview">
                  <div className="avatar-large">{selectedBooking?.artisan?.fullName?.charAt(0)}</div>
                  <div>
                    <h3>{selectedBooking?.artisan?.fullName}</h3>
                    <p>{selectedBooking?.jobDetails}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="rating-section">
                  <label>Your Rating</label>
                  <div className="stars-selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= reviewData.rating ? "selected" : ""}`}
                        onClick={() => handleStarClick(star)}
                      >
                        ★
                      </button>
                    ))}
                    <span className="rating-label">{reviewData.rating}.0 stars</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reviewText">Your Review</label>
                  <textarea
                    id="reviewText"
                    value={reviewData.reviewText}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, reviewText: e.target.value })
                    }
                    placeholder="Share your experience with this artisan..."
                    rows="4"
                    required
                  />
                  <div className="char-count">
                    {reviewData.reviewText.length}/500 characters
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
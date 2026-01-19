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
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createReview(reviewData)).then(() => {
      dispatch(getReviewsForStudent());
      setShowForm(false);
    });
  };

  // Filter completed bookings that have not been reviewed yet
  const bookingsToReview = bookings?.filter(
    (b) => b.status === "completed" && !reviews?.some((r) => r.booking === b._id)
  );

  return (
    <div className="reviews-container">
      <h2>Submit a Review</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <h3>Your Completed Bookings</h3>
      {bookingsToReview?.length === 0 && <p>No completed bookings to review.</p>}

      <ul className="booking-list">
        {bookingsToReview?.map((booking) => (
          <li key={booking._id} className="booking-item">
            <p>
              Artisan: {booking.artisan?.fullName} <br />
              Job: {booking.jobDetails}
            </p>
            <button onClick={() => openReviewForm(booking)}>Write Review</button>
          </li>
        ))}
      </ul>

      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Write a Review</h3>

          <label>Rating: {reviewData.rating}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={reviewData.rating}
            onChange={(e) =>
              setReviewData({ ...reviewData, rating: parseInt(e.target.value) })
            }
            className="rating-range"
          />

          <div className="star-preview">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= reviewData.rating ? "star filled" : "star"}>
                ★
              </span>
            ))}
          </div>

          <label>
            Review:
            <textarea
              value={reviewData.reviewText}
              onChange={(e) =>
                setReviewData({ ...reviewData, reviewText: e.target.value })
              }
              required
            />
          </label>

          <div className="form-actions">
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit">Submit Review</button>
          </div>
        </form>
      )} <br />

      <h3>Your Previous Reviews</h3>
      {reviews?.length === 0 && <p>No reviews submitted yet.</p>}
      <ul className="review-list">
        {reviews?.map((rev) => (
          <li key={rev._id}>
            <h4>Artisan: {rev.artisan?.fullName}</h4>
            <p>
              Rating:{" "}
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= rev.rating ? "star filled" : "star"}>
                  ★
                </span>
              ))}
              <br />
              Review: {rev.reviewText} <br />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;

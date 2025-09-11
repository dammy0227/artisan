import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsForLoggedArtisan } from "../../../features/review/reviewThunks";
import { FaStar } from "react-icons/fa";
import "./ReviewRating.css";

const StarRating = ({ rating }) => (
  <div className="star-rating">
    {[...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "star filled" : "star"}
      />
    ))}
  </div>
);

const ReviewRating = () => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getReviewsForLoggedArtisan());
  }, [dispatch]);

  if (loading) return <p className="message">Loading reviews...</p>;
  if (error) return <p className="message error">{error}</p>;
  if (!reviews || reviews.length === 0) return <p className="message">No reviews yet.</p>;

  return (
    <div className="review-container">
      <h1 className="title">Reviews from Students</h1>
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <div className="student-info-wrapper">
                <h2 className="student-name">{review.student?.name || "Unknown Student"}</h2>
                <p className="student-info">
                  {review.student?.faculty} - {review.student?.department}
                </p>
              </div>
              <StarRating rating={review.rating} />
            </div>
            {review.reviewText && <p className="review-text">{review.reviewText}</p>}
            <p className="review-date">
              Reviewed on {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewRating;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsForLoggedArtisan } from "../../../features/review/reviewThunks";
import {
  FaStar,
  FaFilter,
  FaSort,
  FaSearch,
  FaUserGraduate,
  FaQuoteLeft,
  FaQuoteRight,
  FaCalendarAlt,
  FaChartLine,
  FaSmile,
  FaFrown,
  FaRegStar,
  FaStarHalfAlt
} from "react-icons/fa";
import "./ReviewRating.css";

const StarRating = ({ rating, size = "md" }) => {
  const sizes = {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem"
  };
  
  const starSize = sizes[size] || sizes.md;
  
  return (
    <div className="star-rating" style={{ fontSize: starSize }}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        let StarComponent = FaRegStar;
        
        if (rating >= starValue) {
          StarComponent = FaStar;
        } else if (rating >= starValue - 0.5) {
          StarComponent = FaStarHalfAlt;
        }
        
        return (
          <StarComponent
            key={index}
            className={index < rating ? "star filled" : "star"}
          />
        );
      })}
      <span className="rating-value">{rating.toFixed(1)}</span>
    </div>
  );
};

const ReviewRating = () => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.review);

  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0],
    recentReviews: []
  });

  useEffect(() => {
    dispatch(getReviewsForLoggedArtisan());
  }, [dispatch]);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      // Calculate statistics
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      const ratingDistribution = [0, 0, 0, 0, 0];
      reviews.forEach(review => {
        ratingDistribution[Math.round(review.rating) - 1]++;
      });
      
      const recentReviews = [...reviews]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      setStats({
        averageRating,
        totalReviews: reviews.length,
        ratingDistribution,
        recentReviews
      });
    }
  }, [reviews]);

  // Filter and sort reviews
  const filteredReviews = reviews?.filter(review => {
    if (filter !== "all") {
      const ratingFilter = parseInt(filter);
      const reviewRating = Math.round(review.rating);
      return reviewRating === ratingFilter;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        review.student?.name?.toLowerCase().includes(searchLower) ||
        review.reviewText?.toLowerCase().includes(searchLower) ||
        review.student?.faculty?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  }).sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "name") {
      return a.student?.name?.localeCompare(b.student?.name);
    }
    return 0;
  });

  const getSentimentIcon = (rating) => {
    if (rating >= 4) return <FaSmile className="sentiment-icon happy" />;
    if (rating >= 3) return <FaSmile className="sentiment-icon neutral" />;
    return <FaFrown className="sentiment-icon sad" />;
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading your reviews...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <FaFrown />
      <p>{error}</p>
    </div>
  );
  
  if (!reviews || reviews.length === 0) return (
    <div className="empty-state">
      <FaQuoteLeft size={48} />
      <h3>No Reviews Yet</h3>
      <p>You haven't received any reviews yet. Keep up the great work!</p>
    </div>
  );

  return (
    <div className="review-container">
      {/* Header */}
      <div className="review-header">
        <div className="header-left">
          <h1 className="page-title">
            <FaQuoteLeft /> Student Reviews
          </h1>
          <p className="page-subtitle">
            Feedback and ratings from your students
          </p>
        </div>
        <div className="header-stats">
          <div className="overall-rating">
            <div className="rating-number">{stats.averageRating.toFixed(1)}</div>
            <StarRating rating={stats.averageRating} size="lg" />
            <div className="rating-count">{stats.totalReviews} reviews</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card rating-distribution">
          <h3 className="stat-title">
            <FaChartLine /> Rating Distribution
          </h3>
          <div className="distribution-bars">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div key={index} className="distribution-row">
                <span className="rating-label">{rating} star</span>
                <div className="distribution-bar">
                  <div 
                    className="distribution-fill"
                    style={{ 
                      width: `${(stats.ratingDistribution[rating-1] / stats.totalReviews) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="distribution-count">
                  {stats.ratingDistribution[rating-1]}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="stat-card recent-highlights">
          <h3 className="stat-title">
            <FaStar /> Recent Highlights
          </h3>
          <div className="highlight-list">
            {stats.recentReviews.slice(0, 3).map(review => (
              <div key={review._id} className="highlight-item">
                <div className="highlight-rating">
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <div className="highlight-text">
                  {review.reviewText?.substring(0, 60)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h3 className="filters-title">
            <FaFilter /> Filter & Sort
          </h3>
          <div className="total-results">
            Showing {filteredReviews?.length || 0} of {stats.totalReviews} reviews
          </div>
        </div>
        
        <div className="filters-row">
          {/* Rating Filter */}
          <div className="filter-group">
            <label className="filter-label">Filter by Rating</label>
            <div className="filter-options">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Ratings
              </button>
              {[5, 4, 3, 2, 1].map(rating => (
                <button 
                  key={rating}
                  className={`filter-btn ${filter === rating.toString() ? 'active' : ''}`}
                  onClick={() => setFilter(rating.toString())}
                >
                  {rating} Star
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label className="filter-label">
              <FaSearch /> Search Reviews
            </label>
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search by student name or review text..."
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
              <option value="date">Most Recent</option>
              <option value="rating">Highest Rating</option>
              <option value="name">Student Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="reviews-grid">
        {filteredReviews?.map((review) => (
          <div key={review._id} className="review-card">
            <div className="card-header">
              <div className="student-avatar">
                {review.student?.name?.charAt(0) || "S"}
              </div>
              <div className="student-info">
                <h4 className="student-name">{review.student?.name || "Anonymous Student"}</h4>
                <div className="student-meta">
                  {review.student?.faculty && (
                    <span className="student-faculty">
                      <FaUserGraduate /> {review.student.faculty}
                    </span>
                  )}
                  <span className="review-date">
                    <FaCalendarAlt /> {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {getSentimentIcon(review.rating)}
            </div>
            
            <div className="card-body">
              <div className="rating-display">
                <StarRating rating={review.rating} size="xl" />
              </div>
              
              {review.reviewText && (
                <div className="review-content">
                  <FaQuoteLeft className="quote-icon left" />
                  <p className="review-text">{review.reviewText}</p>
                  <FaQuoteRight className="quote-icon right" />
                </div>
              )}
              
              {review.student?.department && (
                <div className="student-details">
                  <div className="detail-item">
                    <strong>Department:</strong> {review.student.department}
                  </div>
                </div>
              )}
            </div>
            
            <div className="card-footer">
              <div className="review-meta">
                <span className="meta-item">
                  Rating: <strong>{review.rating.toFixed(1)}</strong>/5.0
                </span>
                {review.createdAt && (
                  <span className="meta-item">
                    Posted: {new Date(review.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-card">
          <h3 className="summary-title">Review Summary</h3>
          <div className="summary-content">
            <div className="summary-stat">
              <div className="stat-value">{stats.averageRating.toFixed(1)}</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">{stats.totalReviews}</div>
              <div className="stat-label">Total Reviews</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">
                {stats.ratingDistribution[4]}
              </div>
              <div className="stat-label">5-Star Reviews</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">
                {stats.ratingDistribution.slice(2).reduce((a, b) => a + b, 0)}
              </div>
              <div className="stat-label">Positive Reviews (3+ stars)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewRating;
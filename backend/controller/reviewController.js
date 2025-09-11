import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Artisan from "../models/Artisan.js";

// Student creates a review
export const createReview = async (req, res) => {
  try {
    const { artisanId, bookingId, rating, reviewText } = req.body;
    const studentId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.student.toString() !== studentId) return res.status(403).json({ message: "You can only review your own bookings" });
    if (booking.status !== "completed") return res.status(400).json({ message: "You can only review completed bookings" });

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ student: studentId, booking: bookingId });
    if (existingReview) return res.status(400).json({ message: "You have already reviewed this booking" });

    const review = await Review.create({ student: studentId, artisan: artisanId, booking: bookingId, rating, reviewText });

    // Update artisan's average rating
    const reviews = await Review.find({ artisan: artisanId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Artisan.findByIdAndUpdate(artisanId, { rating: avgRating });

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    // Handle unique index error if somehow duplicate slips through
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this booking" });
    }
    res.status(500).json({ msg: "Server Error" });
  }
};


// Get all reviews for a specific artisan (public)
export const getReviewsForArtisan = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const reviews = await Review.find({ artisan: artisanId })
      .populate("student", "name email faculty department")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Get reviews for logged-in student
export const getReviewsForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const reviews = await Review.find({ student: studentId })
      .populate("artisan", "fullName email rating")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Get reviews for logged-in artisan
export const getReviewsForLoggedArtisan = async (req, res) => {
  try {
    const artisanId = req.user.id;
    const reviews = await Review.find({ artisan: artisanId })
      .populate("student", "name email faculty department")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent duplicate review by same student for same booking
reviewSchema.index({ student: 1, booking: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);

import express from "express";
import {
  createBooking,
  getBookingByStudent,
  getBookingByArtisan,
  updateBookingStatus,
} from "../controller/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// ---------------------
// Student routes
// ---------------------
router.post("/", authorizeRoles("student"), createBooking); // Create a booking
router.get("/student", authorizeRoles("student"), getBookingByStudent); // Get bookings for logged-in student

// ---------------------
// Artisan routes
// ---------------------
router.get("/artisan", authorizeRoles("artisan"), getBookingByArtisan); // Get bookings for logged-in artisan
router.put("/artisan/:bookingId", authorizeRoles("artisan"), updateBookingStatus); // Update booking status

export default router;

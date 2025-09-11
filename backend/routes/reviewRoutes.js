import express from "express";
import {
  createReview,
  getReviewsForArtisan,
  getReviewsForStudent,
  getReviewsForLoggedArtisan,
} from "../controller/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// ---------------------
// Student routes
// ---------------------
router.post("/", authorizeRoles("student"), createReview); 
router.get("/student/me", authorizeRoles("student"), getReviewsForStudent); 

// ---------------------
// Artisan routes
// ---------------------
router.get("/artisan/me", authorizeRoles("artisan"), getReviewsForLoggedArtisan);

// ---------------------
// Public / Artisan routes
// ---------------------
router.get("/:artisanId", getReviewsForArtisan); 

export default router;
